<template>
  <div
    ref="cardRef"
    class="kanban-card grain"
    :class="[
      statusColorClass,
      { 'drag-ghost': isDragging, 'card-lift': isDragging }
    ]"
    :draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Header -->
    <div class="card-header">
      <span class="order-number">{{ order.orderNumber }}</span>
      <button
        @click="$emit('delete', order.id)"
        class="delete-btn"
        title="Delete order"
      >
        ×
      </button>
    </div>

    <!-- Items -->
    <div class="card-items">
      <div v-for="(item, idx) in order.items" :key="idx" class="item">
        <span class="item-emoji">{{ item.emoji }}</span>
        <span class="item-name">{{ item.name }}</span>
        <span class="item-qty">x{{ item.quantity }}</span>
      </div>
    </div>

    <!-- Total -->
    <div class="card-total">
      <span class="total-label">Total:</span>
      <span class="total-amount">${{ order.total.toFixed(2) }}</span>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <span class="timestamp">{{ formatDateTime(order.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'

const props = defineProps<{
  order: Order
  isDragging: boolean
}>()

const emit = defineEmits<{
  dragStart: [orderId: string]
  dragEnd: []
  delete: [orderId: string]
}>()

const cardRef = ref<HTMLElement | null>(null)
const touchStartY = ref(0)
const touchStartX = ref(0)
const dragClone = ref<HTMLElement | null>(null)

const statusColorClass = computed(() => {
  switch (props.order.status) {
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

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('orderId', props.order.id)
  }
  emit('dragStart', props.order.id)
}

const handleDragEnd = () => {
  emit('dragEnd')
}

// Touch event handlers for mobile support
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY

  // Create a clone of the card for visual feedback
  if (cardRef.value) {
    const clone = cardRef.value.cloneNode(true) as HTMLElement
    clone.style.position = 'fixed'
    clone.style.pointerEvents = 'none'
    clone.style.zIndex = '9999'
    clone.style.width = cardRef.value.offsetWidth + 'px'
    clone.style.opacity = '0.8'
    clone.style.transform = 'scale(1.05) rotate(2deg)'
    clone.classList.add('dragging-clone')

    // Position at touch point
    const rect = cardRef.value.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    clone.style.left = (touch.clientX - offsetX) + 'px'
    clone.style.top = (touch.clientY - offsetY) + 'px'

    document.body.appendChild(clone)
    dragClone.value = clone

    // Make original card semi-transparent
    cardRef.value.style.opacity = '0.3'
  }

  emit('dragStart', props.order.id)
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  const touch = e.touches[0]

  // Update clone position
  if (dragClone.value && cardRef.value) {
    const rect = cardRef.value.getBoundingClientRect()
    const offsetX = touchStartX.value - rect.left
    const offsetY = touchStartY.value - rect.top

    dragClone.value.style.left = (touch.clientX - offsetX) + 'px'
    dragClone.value.style.top = (touch.clientY - offsetY) + 'px'
  }

  // Find element at touch position (hide clone temporarily to get element below)
  if (dragClone.value) {
    dragClone.value.style.display = 'none'
  }
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
  if (dragClone.value) {
    dragClone.value.style.display = 'block'
  }

  // Check if we're over a drop zone
  const dropZone = elementBelow?.closest('.drop-zone')
  if (dropZone) {
    dropZone.classList.add('drop-zone-active')
  }

  // Remove active class from other drop zones
  document.querySelectorAll('.drop-zone').forEach(zone => {
    if (zone !== dropZone) {
      zone.classList.remove('drop-zone-active')
    }
  })
}

const handleTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]

  // Hide clone to get element below
  if (dragClone.value) {
    dragClone.value.style.display = 'none'
  }
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)

  // Find the drop zone
  const dropZone = elementBelow?.closest('.drop-zone')

  if (dropZone) {
    // Get the column component
    const columnEl = dropZone.closest('.kanban-column')
    if (columnEl) {
      // Trigger a custom event that the column can listen to
      const customEvent = new CustomEvent('card-dropped', {
        detail: { orderId: props.order.id },
        bubbles: true
      })
      columnEl.dispatchEvent(customEvent)
    }
  }

  // Clean up
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drop-zone-active')
  })

  // Remove clone and restore original card opacity
  if (dragClone.value) {
    dragClone.value.remove()
    dragClone.value = null
  }
  if (cardRef.value) {
    cardRef.value.style.opacity = '1'
  }

  emit('dragEnd')
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<style scoped>
.kanban-card {
  position: relative;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%);
  border: 2px solid;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: all 0.2s ease;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.kanban-card:hover {
  animation: glow-border 2s ease-in-out infinite;
}

.kanban-card:active {
  cursor: grabbing;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-number {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #d4af37;
  letter-spacing: 0.1em;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
}

.delete-btn {
  background: transparent;
  border: none;
  color: #8b0000;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff0000;
}

.card-items {
  margin-bottom: 0.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #e5e5e5;
  margin-bottom: 0.25rem;
}

.item-emoji {
  font-size: 1rem;
}

.item-name {
  flex: 1;
}

.item-qty {
  color: #9ca3af;
  font-weight: bold;
}

.card-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.total-label {
  font-size: 0.875rem;
  color: #9ca3af;
}

.total-amount {
  font-size: 1rem;
  font-weight: bold;
  color: #d4af37;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.timestamp {
  font-size: 0.625rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}
</style>
