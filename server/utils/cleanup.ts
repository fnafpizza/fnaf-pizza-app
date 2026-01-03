import { cleanupOldOrders } from './orderManager'

/**
 * Run cleanup task to remove old completed orders
 * This can be called manually or scheduled via a cron job
 */
export async function runCleanupTask(daysOld: number = 7): Promise<{
  success: boolean
  removed: number
  message: string
}> {
  try {
    const removed = await cleanupOldOrders(daysOld)

    return {
      success: true,
      removed,
      message: `Cleanup completed successfully. Removed ${removed} order(s) older than ${daysOld} days.`
    }
  } catch (error: any) {
    console.error('Cleanup task failed:', error)
    return {
      success: false,
      removed: 0,
      message: `Cleanup failed: ${error.message}`
    }
  }
}

/**
 * Schedule cleanup to run at specified interval (in milliseconds)
 * Example: scheduleCleanup(86400000) // Run daily (24 hours)
 */
export function scheduleCleanup(intervalMs: number = 86400000, daysOld: number = 7) {
  // Run immediately
  runCleanupTask(daysOld)

  // Schedule recurring cleanup
  const interval = setInterval(() => {
    runCleanupTask(daysOld)
  }, intervalMs)

  return {
    stop: () => {
      clearInterval(interval)
    }
  }
}
