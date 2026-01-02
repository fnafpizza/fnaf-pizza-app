import type { Order } from '../types/order'

export function getSocketIO() {
  return (globalThis as any).__io__
}

export function emitOrderEvent(
  event: 'order:created' | 'order:updated' | 'order:deleted' | 'orders:refresh',
  data: Order | Order[] | { orderId: string }
) {
  const io = getSocketIO()
  if (!io) {
    console.warn('⚠️  Socket.io not initialized, event not emitted:', event)
    return
  }

  console.log(`📡 Emitting: ${event}`)
  io.emit(event, data)
}
