import Stripe from 'stripe'
import { createOrder } from '~/server/utils/orderManager'
import type { OrderItem } from '~/server/types/order'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  })

  try {
    // Get the raw body for signature verification
    const body = await readRawBody(event)
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Missing request body'
      })
    }

    // Get the Stripe signature from headers
    const signature = getHeader(event, 'stripe-signature')
    if (!signature) {
      throw createError({
        statusCode: 400,
        message: 'Missing stripe-signature header'
      })
    }

    // Verify webhook signature
    const webhookSecret = config.stripeWebhookSecret || ''
    if (!webhookSecret) {
      throw createError({
        statusCode: 500,
        message: 'Webhook secret not configured'
      })
    }

    let stripeEvent: Stripe.Event
    try {
      stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      throw createError({
        statusCode: 400,
        message: `Webhook signature verification failed: ${err.message}`
      })
    }

    // Handle the checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session

      // Extract order data from metadata
      const orderItemsJson = session.metadata?.orderItems
      const orderTotal = session.metadata?.orderTotal

      if (!orderItemsJson || !orderTotal) {
        throw createError({
          statusCode: 400,
          message: 'Missing order data in session metadata'
        })
      }

      // Retrieve full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items']
      })

      // Parse minimal items from metadata (id + quantity)
      let minimalItems: Array<{ id: number; quantity: number }>
      try {
        minimalItems = JSON.parse(orderItemsJson)
      } catch (err) {
        throw createError({
          statusCode: 400,
          message: 'Invalid order items data'
        })
      }

      // Reconstruct full OrderItems from line items
      const items: OrderItem[] = minimalItems.map((minItem, index) => {
        const lineItem = fullSession.line_items?.data[index]
        if (!lineItem) {
          throw new Error(`Missing line item at index ${index}`)
        }

        // Extract name and emoji from product name (format: "🍕 Pizza Name")
        const fullName = lineItem.description || lineItem.price?.product?.toString() || 'Unknown Item'
        const nameMatch = fullName.match(/^(.+?)\s+(.+)$/)
        const emoji = nameMatch ? nameMatch[1] : '🍕'
        const name = nameMatch ? nameMatch[2] : fullName

        return {
          id: minItem.id,
          name: name,
          description: lineItem.description || '',
          emoji: emoji,
          quantity: minItem.quantity,
          price: ((lineItem.amount_total || 0) / 100 / minItem.quantity).toFixed(2)
        }
      })

      // Create order in our system
      const order = await createOrder(
        session.id,
        items,
        parseFloat(orderTotal)
      )

      return {
        received: true,
        orderNumber: order.orderNumber
      }
    }

    // For other event types, just acknowledge receipt
    return { received: true }

  } catch (error: any) {
    // Return error response
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Webhook processing failed'
    })
  }
})
