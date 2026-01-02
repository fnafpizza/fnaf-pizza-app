<template>
  <div class="kanban-board">
    <!-- VHS Overlay -->
    <div class="vhs-overlay">
      <div class="security-watermark">SECURITY FOOTAGE</div>
      <div class="vhs-timestamp">{{ currentTime }}</div>
    </div>

    <!-- Kanban Columns Grid -->
    <div class="kanban-grid">
      <KanbanColumn
        v-for="column in columns"
        :key="column.status"
        :status="column.status"
        :title="column.title"
        :camera-label="column.cameraLabel"
        :orders="ordersByStatus[column.status]"
        :dragged-order-id="draggedOrderId"
        @drop="handleDrop"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/server/types/order'
import KanbanColumn from './KanbanColumn.vue'

const props = defineProps<{
  orders: Order[]
}>()

const emit = defineEmits<{
  statusChange: [order: Order, newStatus: string]
  delete: [orderId: string]
}>()

// Use drag order composable
const { draggedOrderId, startDrag, endDrag, updateOrderStatus } = useDragOrder()

// Column definitions
const columns = [
  {
    status: 'preparing' as OrderStatus,
    title: 'PREPARING',
    cameraLabel: 'CAM-01'
  },
  {
    status: 'baking' as OrderStatus,
    title: 'BAKING',
    cameraLabel: 'CAM-02'
  },
  {
    status: 'out_for_delivery' as OrderStatus,
    title: 'OUT FOR DELIVERY',
    cameraLabel: 'CAM-03'
  },
  {
    status: 'delivered' as OrderStatus,
    title: 'DELIVERED',
    cameraLabel: 'CAM-04'
  }
]

// Group orders by status
const ordersByStatus = computed(() => {
  const grouped: Record<OrderStatus, Order[]> = {
    preparing: [],
    baking: [],
    out_for_delivery: [],
    delivered: []
  }

  props.orders.forEach(order => {
    if (order.status in grouped) {
      grouped[order.status].push(order)
    }
  })

  return grouped
})

// Current time for VHS timestamp
const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// Update time every second
onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(interval))
})

// Handle drop event
const handleDrop = async (orderId: string, newStatus: OrderStatus) => {
  // Find the order
  const order = props.orders.find(o => o.id === orderId)
  if (!order) return

  // If status hasn't changed, ignore
  if (order.status === newStatus) {
    endDrag()
    return
  }

  // Emit status change event to parent
  emit('statusChange', order, newStatus)

  // End drag
  endDrag()
}
</script>

<style scoped>
.kanban-board {
  position: relative;
  width: 100%;
}

.vhs-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  pointer-events: none;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.security-watermark {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
  letter-spacing: 0.2em;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.vhs-timestamp {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.kanban-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* Responsive Grid */
@media (min-width: 768px) {
  .kanban-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kanban-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
