import { ref, computed } from 'vue'
import type { OrderStatus } from '~/server/types/order'

export function useDragOrder() {
  const draggedOrderId = ref<string | null>(null)
  const isDragging = computed(() => draggedOrderId.value !== null)
  const isUpdating = ref(false)
  const error = ref<string | null>(null)

  const startDrag = (orderId: string) => {
    draggedOrderId.value = orderId
    error.value = null
  }

  const endDrag = () => {
    draggedOrderId.value = null
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<{ success: boolean; error?: string }> => {
    isUpdating.value = true
    error.value = null

    try {
      const authToken = localStorage.getItem('fnaf-admin-auth')

      if (!authToken) {
        throw new Error('Not authenticated')
      }

      await $fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: {
          status: newStatus
        }
      })

      return { success: true }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to update order status'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isUpdating.value = false
    }
  }

  return {
    draggedOrderId,
    isDragging,
    isUpdating,
    error,
    startDrag,
    endDrag,
    updateOrderStatus
  }
}
