import { createOrder } from '~/server/utils/orderManager'
import { verifyAdminToken } from '~/server/utils/adminAuth'

/**
 * TEST ENDPOINT - Create a test order manually
 * This bypasses Stripe and creates an order directly
 * Use this to test if the order board is working
 * REQUIRES ADMIN AUTHENTICATION
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Require admin authentication to prevent unauthorized test order creation
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!verifyAdminToken(token, config.adminPassword)) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Admin access required'
    })
  }

  try {
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

    return {
      success: true,
      message: 'Test order created successfully!',
      order
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create test order'
    })
  }
})
