import Pusher from 'pusher'
import type { Order } from '../types/order'

let pusherInstance: Pusher | null = null

/**
 * Get or create Pusher instance
 */
function getPusher(): Pusher | null {
  const config = useRuntimeConfig()

  // Return existing instance if available
  if (pusherInstance) {
    return pusherInstance
  }

  // Check if Pusher is configured
  if (!config.pusherAppId || !config.pusherSecret || !config.public.pusherKey || !config.public.pusherCluster) {
    return null
  }

  // Create new instance
  try {
    pusherInstance = new Pusher({
      appId: config.pusherAppId,
      key: config.public.pusherKey,
      secret: config.pusherSecret,
      cluster: config.public.pusherCluster,
      useTLS: true
    })
    return pusherInstance
  } catch (error) {
    console.error('Failed to initialize Pusher:', error)
    return null
  }
}

/**
 * Emit order event via Pusher
 */
export async function emitOrderEvent(
  event: 'order:created' | 'order:updated' | 'order:deleted' | 'orders:refresh',
  data: Order | Order[] | { orderId: string }
) {
  const pusher = getPusher()

  if (!pusher) {
    return
  }

  try {
    await pusher.trigger('orders', event, data)
  } catch (error) {
    console.error(`Failed to emit Pusher event ${event}:`, error)
  }
}
