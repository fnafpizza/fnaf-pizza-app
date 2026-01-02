import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import type { Order } from '~/server/types/order'

export function useSocketOrders(options?: {
  isAdmin?: boolean
  pollInterval?: number
}) {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const connected = ref(false)

  let socket: Socket | null = null
  let pollIntervalId: NodeJS.Timeout | null = null

  const isAdmin = options?.isAdmin || false
  const pollInterval = options?.pollInterval || 5000

  // Fetch orders via REST API (fallback)
  const fetchOrders = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{ orders: Order[] }>('/api/orders', {
        query: { includeCompleted: 'true' }
      })

      orders.value = response.orders
    } catch (err: any) {
      console.error('Failed to fetch orders:', err)
      error.value = err.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  // Connect to socket.io
  const connectSocket = () => {
    const auth: any = {}

    // Add admin token if admin mode
    if (isAdmin && process.client) {
      const adminToken = localStorage.getItem('fnaf-admin-auth')
      auth.token = adminToken
    }

    socket = io({
      auth,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id)
      connected.value = true
      error.value = null
      stopPolling()
      fetchOrders() // Initial fetch
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      connected.value = false
      startPolling() // Fallback
    })

    socket.on('connect_error', (err) => {
      console.error('Socket error:', err)
      connected.value = false
      error.value = 'WebSocket failed, using polling'
      startPolling() // Fallback
    })

    // Order events
    socket.on('order:created', (order: Order) => {
      console.log('📨 Order created:', order.orderNumber)
      orders.value = [order, ...orders.value]
    })

    socket.on('order:updated', (updatedOrder: Order) => {
      console.log('📨 Order updated:', updatedOrder.orderNumber)
      const index = orders.value.findIndex(o => o.id === updatedOrder.id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
    })

    socket.on('order:deleted', (data: { orderId: string }) => {
      console.log('📨 Order deleted:', data.orderId)
      orders.value = orders.value.filter(o => o.id !== data.orderId)
    })

    socket.on('orders:refresh', (allOrders: Order[]) => {
      console.log('📨 Orders refresh')
      orders.value = allOrders
    })
  }

  // Start polling (fallback)
  const startPolling = () => {
    if (pollIntervalId) return
    console.log('🔄 Starting polling fallback')
    fetchOrders()
    pollIntervalId = setInterval(fetchOrders, pollInterval)
  }

  // Stop polling
  const stopPolling = () => {
    if (pollIntervalId) {
      console.log('⏸️  Stopping polling')
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
  }

  // Disconnect
  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    stopPolling()
  }

  // Manual refresh
  const refresh = () => {
    fetchOrders()
  }

  // Lifecycle
  onMounted(() => {
    if (process.client) {
      // In development, skip WebSocket and use polling directly
      if (import.meta.dev) {
        console.log('🔄 Development mode: Using polling only')
        connected.value = false
        startPolling()
      } else {
        // In production, use WebSocket with polling fallback
        connectSocket()
      }
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    orders,
    loading,
    error,
    connected,
    refresh
  }
}
