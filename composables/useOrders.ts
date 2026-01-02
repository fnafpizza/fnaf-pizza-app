import { ref, onMounted, onUnmounted } from 'vue'
import type { Order } from '~/server/types/order'

export function useOrders(pollInterval = 5000) {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let intervalId: NodeJS.Timeout | null = null

  /**
   * Fetch orders from API
   */
  const fetchOrders = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{ orders: Order[]; count: number }>('/api/orders', {
        query: {
          includeCompleted: 'true' // Include done orders to display greyed out
        }
      })

      orders.value = response.orders
    } catch (err: any) {
      console.error('Failed to fetch orders:', err)
      error.value = err.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  /**
   * Start polling for updates
   */
  const startPolling = () => {
    // Initial fetch
    fetchOrders()

    // Set up interval for polling
    intervalId = setInterval(fetchOrders, pollInterval)
  }

  /**
   * Stop polling
   */
  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * Refresh orders manually
   */
  const refresh = () => {
    fetchOrders()
  }

  // Automatically start/stop polling on mount/unmount
  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    orders,
    loading,
    error,
    refresh,
    startPolling,
    stopPolling
  }
}
