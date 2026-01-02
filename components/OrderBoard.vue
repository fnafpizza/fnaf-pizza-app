<template>
  <div class="order-board">
    <!-- Active Orders Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <!-- Preparing Column -->
      <div class="status-section">
        <h2 class="section-header text-purple-500">
          <span class="header-icon">🍕</span>
          <span class="header-text">PREPARING</span>
          <span class="header-count">({{ ordersByStatus.preparing.length }})</span>
        </h2>
        <div class="cards-container">
          <OrderCard
            v-for="order in ordersByStatus.preparing"
            :key="order.id"
            :order="order"
            :is-mine="isMyOrder(order.id)"
          />
          <div v-if="ordersByStatus.preparing.length === 0" class="empty-state">
            <p class="empty-text">No orders preparing</p>
          </div>
        </div>
      </div>

      <!-- Baking Column -->
      <div class="status-section">
        <h2 class="section-header text-fnaf-red">
          <span class="header-icon">🔥</span>
          <span class="header-text">BAKING</span>
          <span class="header-count">({{ ordersByStatus.baking.length }})</span>
        </h2>
        <div class="cards-container">
          <OrderCard
            v-for="order in ordersByStatus.baking"
            :key="order.id"
            :order="order"
            :is-mine="isMyOrder(order.id)"
          />
          <div v-if="ordersByStatus.baking.length === 0" class="empty-state">
            <p class="empty-text">No orders baking</p>
          </div>
        </div>
      </div>

      <!-- Out for Delivery Column -->
      <div class="status-section">
        <h2 class="section-header text-blue-400">
          <span class="header-icon">🚗</span>
          <span class="header-text">OUT FOR DELIVERY</span>
          <span class="header-count">({{ ordersByStatus.out_for_delivery.length }})</span>
        </h2>
        <div class="cards-container">
          <OrderCard
            v-for="order in ordersByStatus.out_for_delivery"
            :key="order.id"
            :order="order"
            :is-mine="isMyOrder(order.id)"
          />
          <div v-if="ordersByStatus.out_for_delivery.length === 0" class="empty-state">
            <p class="empty-text">No orders out</p>
          </div>
        </div>
      </div>

      <!-- Delivered Column -->
      <div class="status-section">
        <h2 class="section-header text-green-500">
          <span class="header-icon">✓</span>
          <span class="header-text">DELIVERED</span>
          <span class="header-count">({{ ordersByStatus.delivered.length }})</span>
        </h2>
        <div class="cards-container">
          <OrderCard
            v-for="order in ordersByStatus.delivered"
            :key="order.id"
            :order="order"
            :is-mine="isMyOrder(order.id)"
          />
          <div v-if="ordersByStatus.delivered.length === 0" class="empty-state">
            <p class="empty-text">No delivered orders</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'

const props = defineProps<{
  orders: Order[]
  isMyOrder: (orderId: string) => boolean
}>()

const ordersByStatus = computed(() => {
  const grouped = {
    preparing: [] as Order[],
    baking: [] as Order[],
    out_for_delivery: [] as Order[],
    delivered: [] as Order[]
  }

  props.orders.forEach(order => {
    if (grouped[order.status]) {
      grouped[order.status].push(order)
    }
  })

  return grouped
})
</script>

<style scoped>
.status-section {
  min-height: 200px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid currentColor;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px currentColor;
}

.header-icon {
  font-size: 1.5rem;
}

.header-text {
  font-weight: 800;
}

.header-count {
  font-size: 0.875rem;
  opacity: 0.7;
  font-weight: normal;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  padding: 2rem 1rem;
  color: #6b7280;
}

.empty-text {
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
  opacity: 0.6;
}
</style>
