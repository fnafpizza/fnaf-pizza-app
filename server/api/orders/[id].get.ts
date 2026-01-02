import { getOrder } from '~/server/utils/orderManager'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    const order = await getOrder(id)

    if (!order) {
      throw createError({
        statusCode: 404,
        message: `Order not found: ${id}`
      })
    }

    return order
  } catch (error: any) {
    console.error('Get order error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch order'
    })
  }
})
