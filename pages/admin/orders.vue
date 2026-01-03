<template>
  <div class="admin-page min-h-screen bg-black scan-lines p-4 !overflow-auto h-screen">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-fnaf-gold glow-text">
            Admin Dashboard
          </h1>
          <p v-if="connected" class="text-xs text-green-500">● Live</p>
          <p v-else class="text-xs text-yellow-500">● Polling</p>
        </div>
        <div class="flex gap-4">
          <button
            @click="handleCleanup"
            :disabled="cleanupLoading"
            class="px-4 py-2 bg-fnaf-red text-white font-bold rounded-lg hover:bg-opacity-80 disabled:opacity-50"
          >
            {{ cleanupLoading ? 'Cleaning...' : 'Cleanup Old Orders' }}
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-label">Preparing</div>
          <div class="stat-value text-fnaf-purple">{{ stats.preparing }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Baking</div>
          <div class="stat-value text-fnaf-red">{{ stats.baking }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Out for Delivery</div>
          <div class="stat-value text-blue-400">{{ stats.out_for_delivery }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Delivered</div>
          <div class="stat-value text-green-500">{{ stats.delivered }}</div>
        </div>
      </div>

      <!-- Orders Kanban Board -->
      <div class="bg-fnaf-dark border border-fnaf-gold rounded-lg p-6">
        <h2 class="text-xl font-bold text-fnaf-gold mb-4">Security Camera Feed</h2>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fnaf-gold"></div>
          <p class="text-gray-400 mt-4">Loading orders...</p>
        </div>

        <KanbanBoard
          v-else
          :orders="orders"
          @status-change="handleStatusChange"
          @delete="handleDelete"
        />
      </div>

      <!-- Public View Link -->
      <div class="mt-6 text-center">
        <NuxtLink
          to="/orders"
          class="text-fnaf-gold hover:text-fnaf-purple"
        >
          View Public Order Board →
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Order Modal -->
    <DeleteOrderModal
      :is-open="isDeleteModalOpen"
      :order="orderToDelete"
      :is-deleting="isDeleting"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <!-- Status Toast Notification -->
    <StatusToast
      :visible="showToast"
      :message="toastMessage"
    />
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'
import KanbanBoard from '~/components/admin/KanbanBoard.vue'
import DeleteOrderModal from '~/components/admin/DeleteOrderModal.vue'
import StatusToast from '~/components/admin/StatusToast.vue'

definePageMeta({
  middleware: 'admin'
})

// Use WebSocket orders composable
const {
  orders,
  loading,
  error: fetchError,
  connected,
  refresh: refreshOrders
} = useSocketOrders({
  isAdmin: true,
  pollInterval: 10000
})

const cleanupLoading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const isDeleteModalOpen = ref(false)
const orderToDelete = ref<Order | null>(null)
const isDeleting = ref(false)

// Toast helper function
const displayToast = (message: string, duration = 3000) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, duration)
}

const router = useRouter()

// Calculate stats
const stats = computed(() => {
  return {
    preparing: orders.value.filter(o => o.status === 'preparing').length,
    baking: orders.value.filter(o => o.status === 'baking').length,
    out_for_delivery: orders.value.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.value.filter(o => o.status === 'delivered').length
  }
})

// Update order status
const handleStatusChange = async (order: Order, newStatus: string) => {
  try {
    const authToken = localStorage.getItem('fnaf-admin-auth')

    await $fetch(`/api/admin/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        status: newStatus
      }
    })

    displayToast(`Order ${order.orderNumber} → ${newStatus.replace('_', ' ').toUpperCase()}`)

    // Pusher will update the UI automatically via order:updated event
  } catch (err: any) {
    displayToast('Failed to update order status')
  }
}

// Delete order - open modal
const handleDelete = (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    orderToDelete.value = order
    isDeleteModalOpen.value = true
  }
}

// Confirm delete - actually delete the order
const confirmDelete = async () => {
  if (!orderToDelete.value) return

  isDeleting.value = true

  try {
    const authToken = localStorage.getItem('fnaf-admin-auth')

    const response = await $fetch<{ success: boolean; message: string }>(`/api/admin/orders/${orderToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    displayToast(response.message || 'Order deleted successfully')

    // Close modal and refresh orders
    isDeleteModalOpen.value = false
    orderToDelete.value = null
    await refreshOrders()
  } catch (err: any) {
    displayToast('Failed to delete order: ' + (err.data?.message || err.message))
  } finally {
    isDeleting.value = false
  }
}

// Close delete modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  orderToDelete.value = null
}

// Cleanup old orders
const handleCleanup = async () => {
  if (!confirm('This will remove all completed orders older than 7 days. Continue?')) {
    return
  }

  cleanupLoading.value = true
  try {
    const response = await $fetch<{ removed: number; message: string }>('/api/orders/cleanup', {
      method: 'POST'
    })

    displayToast(response.message || 'Cleanup completed')

    // Refresh orders
    await refreshOrders()
  } catch (err: any) {
    displayToast('Failed to cleanup orders')
  } finally {
    cleanupLoading.value = false
  }
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('fnaf-admin-auth')
  router.push('/admin/login')
}

// Socket connection happens automatically via useSocketOrders
// No manual polling or onMounted needed
</script>

<style scoped>
.stat-card {
  @apply bg-fnaf-dark border border-fnaf-purple rounded-lg p-4 text-center;
}

.stat-label {
  @apply text-gray-400 text-sm mb-1;
}

.stat-value {
  @apply text-3xl font-bold;
}

.glow-text {
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
}
</style>
