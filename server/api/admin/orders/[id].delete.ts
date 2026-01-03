import { readOrders, writeOrders } from '~/server/utils/orderStorage'
import { emitOrderEvent } from '~/server/utils/pusherServer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Check authentication
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token || token !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const orderId = getRouterParam(event, 'id')

  if (!orderId) {
    throw createError({
      statusCode: 400,
      message: 'Order ID is required'
    })
  }

  try {
    const data = await readOrders()

    // Find the order index
    const orderIndex = data.orders.findIndex(
      o => o.id === orderId || o.orderNumber === orderId
    )

    if (orderIndex === -1) {
      throw createError({
        statusCode: 404,
        message: `Order not found: ${orderId}`
      })
    }

    // Get order details before deleting
    const deletedOrder = data.orders[orderIndex]

    // Remove the order
    data.orders.splice(orderIndex, 1)

    // Save changes
    await writeOrders(data)

    console.log(`🗑️  Deleted order: ${deletedOrder.orderNumber} (${deletedOrder.id})`)

    // Emit Pusher event
    await emitOrderEvent('order:deleted', { orderId: deletedOrder.id })

    return {
      success: true,
      message: `Order ${deletedOrder.orderNumber} deleted successfully`,
      deletedOrder: deletedOrder.orderNumber
    }
  } catch (error: any) {
    console.error('Error deleting order:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete order'
    })
  }
})
