import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Initialize Stripe with secret key
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  })

  try {
    // Validate request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid cart items'
      })
    }

    // Calculate total
    const total = body.items.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.price) * item.quantity)
    }, 0)

    // Create line items for Stripe
    const lineItems = body.items.map((item: any) => {
      // Convert price string to cents (Stripe expects integer cents)
      const unitAmount = Math.round(parseFloat(item.price) * 100)

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.emoji} ${item.name}`,
            description: item.description,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      }
    })

    // Store minimal item data in metadata to avoid 500 char limit
    const minimalItems = body.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity
    }))

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.public.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.appUrl}/cancel`,
      metadata: {
        orderType: 'pizza-order',
        orderItems: JSON.stringify(minimalItems),
        orderTotal: total.toFixed(2),
      },
    })

    return {
      sessionId: session.id,
      url: session.url,
    }
  } catch (error: any) {
    console.error('Stripe session creation error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create checkout session'
    })
  }
})
