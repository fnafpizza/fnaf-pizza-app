import { updateOrderStatus } from '~/server/utils/orderManager'
import { OrderStatus } from '~/server/types/order'
import { verifyAdminToken } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin authentication
    const config = useRuntimeConfig()
    const authHeader = getHeader(event, 'authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!config.adminPassword) {
      throw createError({
        statusCode: 500,
        message: 'Admin password not configured'
      })
    }

    if (!verifyAdminToken(token, config.adminPassword)) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Get order ID from route params
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      })
    }

    // Get request body
    const body = await readBody(event)
    const { status } = body

    if (!status) {
      throw createError({
        statusCode: 400,
        message: 'Status is required'
      })
    }

    // Validate status enum
    const validStatuses = Object.values(OrderStatus)
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    // Update order status
    const updatedOrder = await updateOrderStatus(id, status)

    return updatedOrder
  } catch (error: any) {
    console.error('Update order status error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update order status'
    })
  }
})
