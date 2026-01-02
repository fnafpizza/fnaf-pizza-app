import { cleanupOldOrders } from '~/server/utils/orderManager'

export default defineEventHandler(async (event) => {
  try {
    // Get optional days parameter (default 7)
    const body = await readBody(event).catch(() => ({}))
    const days = body.days || 7

    if (typeof days !== 'number' || days < 1) {
      throw createError({
        statusCode: 400,
        message: 'Days must be a positive number'
      })
    }

    // Perform cleanup
    const removed = await cleanupOldOrders(days)

    return {
      success: true,
      removed,
      message: `Cleaned up ${removed} old order(s)`
    }
  } catch (error: any) {
    console.error('Cleanup error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to cleanup orders'
    })
  }
})
