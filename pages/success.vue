<template>
  <div class="success-page min-h-screen bg-black flex items-center justify-center p-4 scan-lines">
    <div class="success-card max-w-2xl w-full bg-fnaf-dark border-2 border-fnaf-gold rounded-lg p-8 text-center">
      <!-- Success Icon -->
      <div class="success-icon mb-6">
        <div class="text-8xl text-fnaf-gold pulse">✓</div>
      </div>

      <!-- Success Message -->
      <h1 class="text-4xl md:text-5xl font-bold text-fnaf-gold glow-text mb-4">
        Order Confirmed!
      </h1>
      <p class="text-xl text-gray-400 mb-8">
        Thank you for ordering from Freddy Fazbear's Pizza!
      </p>

      <!-- Order Details -->
      <div class="order-details bg-fnaf-purple bg-opacity-20 border border-fnaf-purple rounded-lg p-6 mb-8">
        <div v-if="sessionId" class="mb-4">
          <p class="text-sm text-gray-500">Order Number</p>
          <p class="text-fnaf-gold font-mono text-sm break-all">{{ sessionId }}</p>
        </div>

        <div v-if="orderData" class="mb-4">
          <h3 class="text-lg font-bold text-fnaf-gold mb-3">Your Order:</h3>
          <div class="space-y-2">
            <div
              v-for="(item, index) in orderData.items"
              :key="index"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-300">
                {{ item.emoji }} {{ item.name }} x{{ item.quantity }}
              </span>
              <span class="text-fnaf-gold">
                ${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
          <div class="border-t border-fnaf-red mt-4 pt-4">
            <div class="flex justify-between text-xl font-bold">
              <span class="text-fnaf-gold">Total Paid:</span>
              <span class="text-fnaf-gold">${{ orderData.total }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-fnaf-red bg-opacity-20 border border-fnaf-red rounded">
          <p class="text-sm text-gray-400">
            Estimated Delivery: 30-45 minutes
          </p>
          <p class="text-xs text-gray-500 mt-1">
            We'll have your pizza ready before the night shift ends!
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          :to="`/orders?waitFor=${sessionId}`"
          class="px-6 py-3 bg-fnaf-gold text-black font-bold rounded-lg hover:bg-opacity-80 transition-all duration-300 text-center"
        >
          Track Your Order
        </NuxtLink>
        <button
          @click="returnHome"
          class="px-6 py-3 bg-fnaf-red text-fnaf-gold font-bold rounded-lg hover:bg-fnaf-purple transition-all duration-300"
        >
          Return to Menu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const sessionId = ref('')
const orderData = ref(null)

onMounted(() => {
  // Get session ID from URL
  sessionId.value = route.query.session_id || ''

  // Get last order from backup
  orderData.value = cartStore.getLastOrder()

  // Cache this order ID as "my order" for highlighting on orders page
  if (sessionId.value) {
    const myOrders = JSON.parse(localStorage.getItem('fnaf-my-orders') || '[]')
    if (!myOrders.includes(sessionId.value)) {
      myOrders.push(sessionId.value)
      localStorage.setItem('fnaf-my-orders', JSON.stringify(myOrders))
    }
  }

  // Clear cart
  cartStore.clearCart()

  // Close cart panel if open
  cartStore.closeCart()
})

const returnHome = () => {
  router.push('/')
}
</script>

<style scoped>
.success-icon {
  animation: success-appear 0.6s ease-out;
}

@keyframes success-appear {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.success-card {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(139, 0, 0, 0.3);
  animation: card-appear 0.4s ease-out;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
