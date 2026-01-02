<template>
  <div class="order-table">
    <table class="w-full">
      <thead>
        <tr class="border-b border-fnaf-gold">
          <th class="text-left p-3 text-fnaf-gold">Order #</th>
          <th class="text-left p-3 text-fnaf-gold">Items</th>
          <th class="text-left p-3 text-fnaf-gold">Total</th>
          <th class="text-left p-3 text-fnaf-gold">Status</th>
          <th class="text-left p-3 text-fnaf-gold">Created</th>
          <th class="text-left p-3 text-fnaf-gold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="border-b border-gray-800 hover:bg-fnaf-purple hover:bg-opacity-10"
        >
          <td class="p-3 font-mono text-sm text-white">{{ order.orderNumber }}</td>
          <td class="p-3">
            <div class="text-xs space-y-1 text-white">
              <div v-for="(item, idx) in order.items" :key="idx">
                {{ item.emoji }} {{ item.name }} x{{ item.quantity }}
              </div>
            </div>
          </td>
          <td class="p-3 text-fnaf-gold font-bold">${{ order.total.toFixed(2) }}</td>
          <td class="p-3">
            <select
              :value="order.status"
              @change="(e) => handleStatusChange(order, (e.target as HTMLSelectElement).value)"
              class="bg-fnaf-dark border border-fnaf-purple rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-fnaf-gold"
            >
              <option value="preparing">Preparing</option>
              <option value="baking">Baking</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </td>
          <td class="p-3 text-sm text-gray-400">{{ formatDateTime(order.createdAt) }}</td>
          <td class="p-3">
            <button
              @click="$emit('delete', order.id)"
              class="text-fnaf-red hover:text-red-400 text-sm"
              title="Delete order"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="orders.length === 0" class="text-center py-12 text-gray-500">
      No orders found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'

const props = defineProps<{
  orders: Order[]
}>()

const emit = defineEmits<{
  statusChange: [order: Order, newStatus: string]
  delete: [orderId: string]
}>()

const handleStatusChange = (order: Order, newStatus: string) => {
  emit('statusChange', order, newStatus)
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
.order-table {
  overflow-x: auto;
}

table {
  min-width: 800px;
}
</style>
