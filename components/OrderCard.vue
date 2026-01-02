<template>
  <div
    :class="[
      'order-card grain',
      statusBorderClass,
      { 'my-order': isMine }
    ]"
  >
    <!-- Header -->
    <div class="card-header">
      <span class="order-number">{{ order.orderNumber }}</span>
      <span v-if="isMine" class="your-order-badge">⭐</span>
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
      <div class="status-badge" :class="statusBadgeClass">
        {{ statusLabel }}
      </div>
      <span class="timestamp">
        {{ order.status !== 'delivered' ? 'Est: ' : 'Done: ' }}{{ formatTime(order.status !== 'delivered' ? order.estimatedReady : order.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'

const props = defineProps<{
  order: Order
  isMine?: boolean
}>()

const statusBorderClass = computed(() => {
  switch (props.order.status) {
    case 'preparing':
      return 'border-purple-500'
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

const statusBadgeClass = computed(() => {
  switch (props.order.status) {
    case 'preparing':
      return 'bg-purple-600 text-white'
    case 'baking':
      return 'bg-fnaf-red text-white'
    case 'out_for_delivery':
      return 'bg-blue-500 text-white'
    case 'delivered':
      return 'bg-green-700 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
})

const statusLabel = computed(() => {
  switch (props.order.status) {
    case 'preparing':
      return 'Preparing'
    case 'baking':
      return 'Baking'
    case 'out_for_delivery':
      return 'Out for Delivery'
    case 'delivered':
      return 'Delivered'
    default:
      return 'Unknown'
  }
})

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<style scoped>
.order-card {
  position: relative;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%);
  border: 2px solid;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.order-card:hover:not(.my-order) {
  animation: glow-border 2s ease-in-out infinite;
  border-color: #ff0000 !important;
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

.your-order-badge {
  font-size: 1.25rem;
  animation: badge-glow 2s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.8));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 1));
  }
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
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timestamp {
  font-size: 0.625rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

/* Highlight user's own orders */
.my-order {
  border-width: 3px;
  border-color: #d4af37 !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2);
  animation: my-order-pulse 2s ease-in-out infinite;
}

@keyframes my-order-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2);
  }
  50% {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5), 0 0 30px rgba(212, 175, 55, 0.3);
  }
}
</style>
