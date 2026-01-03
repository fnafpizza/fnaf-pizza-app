import { ref, onMounted, onUnmounted } from 'vue'
import Pusher from 'pusher-js'
import type { Order } from '~/server/types/order'

export function useSocketOrders(options?: {
  pollInterval?: number
}) {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const connected = ref(false)

  let pusher: Pusher | null = null
  let channel: any = null
  let pollIntervalId: NodeJS.Timeout | null = null

  const pollInterval = options?.pollInterval || 5000

  // Fetch orders via REST API (initial load & fallback)
  const fetchOrders = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{ orders: Order[] }>('/api/orders', {
        query: { includeCompleted: 'true' }
      })

      orders.value = response.orders
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  // Connect to Pusher
  const connectPusher = () => {
    const config = useRuntimeConfig()

    if (!config.public.pusherKey || !config.public.pusherCluster) {
      startPolling()
      return
    }

    try {
      // Initialize Pusher
      pusher = new Pusher(config.public.pusherKey, {
        cluster: config.public.pusherCluster,
      })

      // Subscribe to orders channel
      channel = pusher.subscribe('orders')

      // Connection events
      pusher.connection.bind('connected', () => {
        connected.value = true
        error.value = null
        stopPolling()
        fetchOrders() // Initial fetch
      })

      pusher.connection.bind('disconnected', () => {
        connected.value = false
        startPolling() // Fallback
      })

      pusher.connection.bind('error', (err: any) => {
        connected.value = false
        error.value = 'Real-time connection failed, using polling'
        startPolling() // Fallback
      })

      // Order events
      channel.bind('order:created', (order: Order) => {
        orders.value = [order, ...orders.value]
      })

      channel.bind('order:updated', (updatedOrder: Order) => {
        const index = orders.value.findIndex(o => o.id === updatedOrder.id)
        if (index !== -1) {
          orders.value[index] = updatedOrder
        }
      })

      channel.bind('order:deleted', (data: { orderId: string }) => {
        orders.value = orders.value.filter(o => o.id !== data.orderId)
      })

      channel.bind('orders:refresh', (allOrders: Order[]) => {
        orders.value = allOrders
      })
    } catch (err) {
      startPolling()
    }
  }

  // Start polling (fallback)
  const startPolling = () => {
    if (pollIntervalId) return
    fetchOrders()
    pollIntervalId = setInterval(fetchOrders, pollInterval)
  }

  // Stop polling
  const stopPolling = () => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
  }

  // Disconnect
  const disconnect = () => {
    if (pusher) {
      pusher.disconnect()
      pusher = null
      channel = null
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
      connectPusher()
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
