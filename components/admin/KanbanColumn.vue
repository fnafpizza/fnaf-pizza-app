<template>
  <div class="kanban-column scan-lines" :class="[columnColorClass]">
    <!-- Camera Header -->
    <div class="camera-header" :class="headerColorClass">
      <div class="header-top">
        <span class="camera-label camera-flicker">{{ title }}</span>
      </div>
      <div class="header-bottom">
        <span class="recording-dot pulse">● REC</span>
        <span class="order-count">{{ orders.length }} orders</span>
      </div>
    </div>

    <!-- Drop Zone -->
    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{ 'drop-zone-active': isOverDropZone }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Cards -->
      <KanbanCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        :is-dragging="draggedOrderId === order.id"
        @drag-start="handleCardDragStart"
        @drag-end="handleCardDragEnd"
        @delete="$emit('delete', $event)"
      />

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">No orders {{ statusLabel }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/server/types/order'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  status: OrderStatus
  orders: Order[]
  title: string
  cameraLabel: string
  draggedOrderId: string | null
}>()

const emit = defineEmits<{
  drop: [orderId: string, newStatus: OrderStatus]
  delete: [orderId: string]
}>()

const dropZoneRef = ref<HTMLElement | null>(null)
const isOverDropZone = ref(false)

const columnColorClass = computed(() => {
  switch (props.status) {
    case 'preparing':
      return 'border-fnaf-purple'
    case 'baking':
      return 'border-fnaf-red'
    case 'out_for_delivery':
      return 'border-blue-500'
    case 'delivered':
      return 'border-green-500'
    default:
      return 'border-gray-500'
  }
})

const headerColorClass = computed(() => {
  switch (props.status) {
    case 'preparing':
      return 'bg-fnaf-purple'
    case 'baking':
      return 'bg-fnaf-red'
    case 'out_for_delivery':
      return 'bg-blue-900'
    case 'delivered':
      return 'bg-green-900'
    default:
      return 'bg-gray-900'
  }
})

const statusLabel = computed(() => {
  switch (props.status) {
    case 'preparing':
      return 'being prepared'
    case 'baking':
      return 'in the oven'
    case 'out_for_delivery':
      return 'out for delivery'
    case 'delivered':
      return 'yet'
    default:
      return ''
  }
})

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  isOverDropZone.value = true
}

const handleDragLeave = (e: DragEvent) => {
  const rect = dropZoneRef.value?.getBoundingClientRect()
  if (rect && (
    e.clientX < rect.left ||
    e.clientX >= rect.right ||
    e.clientY < rect.top ||
    e.clientY >= rect.bottom
  )) {
    isOverDropZone.value = false
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isOverDropZone.value = false

  if (e.dataTransfer) {
    const orderId = e.dataTransfer.getData('orderId')
    if (orderId) {
      emit('drop', orderId, props.status)
    }
  }
}

const handleCardDragStart = (orderId: string) => {
  // Card drag started - parent will handle
}

const handleCardDragEnd = () => {
  isOverDropZone.value = false
}

// Handle touch drop from custom event
const handleCardDropped = (e: CustomEvent) => {
  const orderId = e.detail.orderId
  if (orderId) {
    emit('drop', orderId, props.status)
  }
}

// Add event listener for touch drops
onMounted(() => {
  const columnEl = dropZoneRef.value?.closest('.kanban-column')
  if (columnEl) {
    columnEl.addEventListener('card-dropped', handleCardDropped as EventListener)
  }
})

onUnmounted(() => {
  const columnEl = dropZoneRef.value?.closest('.kanban-column')
  if (columnEl) {
    columnEl.removeEventListener('card-dropped', handleCardDropped as EventListener)
  }
})
</script>

<style scoped>
.kanban-column {
  background: rgba(13, 13, 13, 0.5);
  border: 1px solid;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  position: relative;
}

.camera-header {
  padding: 0.75rem;
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  background-opacity: 0.9;
}

.header-top {
  margin-bottom: 0.5rem;
}

.camera-label {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #d4af37;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recording-dot {
  font-size: 0.75rem;
  color: #ff0000;
  text-shadow: 0 0 5px #ff0000;
}

.order-count {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: 'Courier New', monospace;
}

.drop-zone {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  min-height: 400px;
  transition: all 0.3s ease;
}

.drop-zone::-webkit-scrollbar {
  width: 8px;
}

.drop-zone::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.drop-zone::-webkit-scrollbar-thumb {
  background: rgba(139, 0, 0, 0.5);
  border-radius: 4px;
}

.drop-zone::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 0, 0, 0.7);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 0.875rem;
  text-align: center;
}
</style>
