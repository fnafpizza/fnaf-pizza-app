import { createOrder } from '~/server/utils/orderManager'

/**
 * TEST ENDPOINT - Create a test order manually
 * This bypasses Stripe and creates an order directly
 * Use this to test if the order board is working
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Creating test order...')

    // Create a test order with sample items
    const testItems = [
      {
        id: 1,
        name: "Freddy's Favorite",
        description: "Pepperoni, sausage, and extra cheese",
        emoji: "🍕",
        quantity: 2,
        price: "12.99"
      },
      {
        id: 2,
        name: "Foxy's Fire",
        description: "Spicy jalapeños and hot sauce",
        emoji: "🔥",
        quantity: 1,
        price: "14.99"
      }
    ]

    const total = testItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity)
    }, 0)

    // Generate a test session ID
    const testSessionId = `test_${Date.now()}`

    const order = await createOrder(testSessionId, testItems, total)

    console.log(`✅ Test order created: ${order.orderNumber}`)

    return {
      success: true,
      message: 'Test order created successfully!',
      order
    }
  } catch (error: any) {
    console.error('❌ Failed to create test order:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create test order'
    })
  }
})
