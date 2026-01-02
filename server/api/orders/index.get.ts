import { getOrders, autoUpdateOrderStatuses } from '~/server/utils/orderManager'
import { OrderStatus } from '~/server/types/order'

export default defineEventHandler(async (event) => {
  try {
    // Auto-update order statuses based on time elapsed
    await autoUpdateOrderStatuses()

    // Parse query parameters
    const query = getQuery(event)
    const statusParam = query.status as string | string[] | undefined
    const includeCompleted = query.includeCompleted === 'true'
    const limit = query.limit ? parseInt(query.limit as string) : 50

    // Parse status filter
    let statusFilter: OrderStatus | OrderStatus[] | undefined
    if (statusParam) {
      if (Array.isArray(statusParam)) {
        statusFilter = statusParam as OrderStatus[]
      } else if (statusParam.includes(',')) {
        statusFilter = statusParam.split(',') as OrderStatus[]
      } else {
        statusFilter = statusParam as OrderStatus
      }
    }

    // Get orders with filters
    const orders = await getOrders({
      status: statusFilter,
      includeCompleted,
      limit
    })

    return {
      orders,
      count: orders.length
    }
  } catch (error: any) {
    console.error('Get orders error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch orders'
    })
  }
})
