<template>
  <div>
    <div class="orders-page bg-black scan-lines relative !overflow-auto h-screen">
      <!-- Header -->
      <div class="header-section py-8 px-4">
        <div class="container mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold text-center text-fnaf-gold glow-text mb-2">
            FREDDY FAZBEAR'S
          </h1>
          <p class="text-xl md:text-2xl text-center text-fnaf-purple font-bold">
            ORDER TRACKING BOARD
          </p>
          <p class="text-sm text-center text-gray-500 mt-2">
            <span v-if="connected" class="text-green-500">● Live Updates</span>
            <span v-else class="text-yellow-500">● Polling Mode</span>
            | Last Updated: {{ lastUpdatedTime }}
          </p>
        </div>
      </div>

      <!-- Waiting for New Order State -->
      <div v-if="waitingForOrder" class="container mx-auto px-4 py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fnaf-gold"></div>
          <p class="text-fnaf-gold font-bold text-xl mt-4">Waiting for your order...</p>
          <p class="text-gray-400 text-sm mt-2">Your order is being processed ({{ waitAttempts }}/20)</p>
          <p class="text-gray-500 text-xs mt-1">This usually takes 2-5 seconds</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading && orders.length === 0" class="container mx-auto px-4 py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fnaf-gold"></div>
          <p class="text-gray-400 mt-4">Loading orders...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="container mx-auto px-4 py-12">
        <div class="bg-fnaf-red bg-opacity-20 border-2 border-fnaf-red rounded-lg p-6 text-center">
          <p class="text-fnaf-red font-bold text-xl mb-2">Error Loading Orders</p>
          <p class="text-gray-400">{{ error }}</p>
          <button
            @click="refresh"
            class="mt-4 px-6 py-2 bg-fnaf-red text-white font-bold rounded-lg hover:bg-opacity-80"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- No Orders State -->
      <div v-else-if="orders.length === 0" class="container mx-auto px-4 py-12">
        <div class="text-center">
          <p class="text-6xl mb-4">🍕</p>
          <p class="text-xl text-gray-400">No orders yet</p>
          <p class="text-sm text-gray-600 mt-2">Orders will appear here when customers place them</p>
        </div>
      </div>

      <!-- Order Board -->
      <div v-else class="container mx-auto px-4 pb-12">
        <OrderBoard :orders="orders" :is-my-order="isMyOrder" />
      </div>
    </div>

    <!-- Floating Buttons (outside scrollable container) -->
    <FloatingAdminButton />

    <NuxtLink
      to="/"
      class="menu-button"
      aria-label="Back to menu"
    >
      <span class="text-3xl">🏠</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Order Tracking - Freddy Fazbear\'s Pizza',
  meta: [
    {
      name: 'description',
      content: 'Track your pizza order in real-time'
    }
  ]
})

// Use WebSocket orders composable with fallback to 5-second polling
const { orders, loading, error, refresh, connected } = useSocketOrders({
  pollInterval: 5000
})

// Get user's order IDs from localStorage
const myOrderIds = ref<string[]>([])

/**
 * Check if an order belongs to the current user
 * Normalizes IDs for comparison to handle edge cases
 */
const isMyOrder = (orderId: string) => {
  const normalizedOrderId = orderId?.trim() || ''
  return myOrderIds.value.some(id => id.trim() === normalizedOrderId)
}

/**
 * Load user's order IDs from localStorage with validation
 */
const loadMyOrders = () => {
  try {
    const cached = localStorage.getItem('fnaf-my-orders')
    if (cached) {
      const orders = JSON.parse(cached)
      // Normalize all IDs (trim whitespace) and filter out invalid ones
      myOrderIds.value = orders
        .map((id: string) => id?.trim())
        .filter((id: string) => id && id.length >= 5)
    }
  } catch (error) {
    console.error('Error loading my orders:', error)
    myOrderIds.value = []
  }
}

// Order waiting mechanism
const route = useRoute()
const waitingForOrder = ref(false)
const waitAttempts = ref(0)
let waitInterval: NodeJS.Timeout | null = null

/**
 * Check if order exists in current orders list
 */
const checkOrderExists = (sessionId: string): boolean => {
  return orders.value.some(order => order.id === sessionId)
}

/**
 * Wait for a specific order to appear (after checkout)
 * Polls every 500ms for up to 10 seconds (20 attempts)
 */
const waitForOrder = async (sessionId: string) => {
  waitingForOrder.value = true
  waitAttempts.value = 0
  const maxAttempts = 20 // 20 attempts * 500ms = 10 seconds

  return new Promise<void>((resolve) => {
    waitInterval = setInterval(async () => {
      waitAttempts.value++

      // Refresh orders to check for new order
      await refresh()

      // Check if order now exists
      if (checkOrderExists(sessionId)) {
        if (waitInterval) {
          clearInterval(waitInterval)
        }
        waitingForOrder.value = false
        resolve()
        return
      }

      // Timeout after max attempts
      if (waitAttempts.value >= maxAttempts) {
        if (waitInterval) {
          clearInterval(waitInterval)
        }
        waitingForOrder.value = false
        resolve()
      }
    }, 500)
  })
}

onMounted(async () => {
  // Load user's order IDs from localStorage
  if (process.client) {
    loadMyOrders()

    // Check if we should wait for a specific order
    const rawWaitFor = route.query.waitFor
    const waitForSessionId = typeof rawWaitFor === 'string' ? rawWaitFor.trim() : ''

    if (waitForSessionId) {
      // Ensure this order is marked as mine (defensive - should already be in localStorage)
      if (!myOrderIds.value.includes(waitForSessionId)) {
        myOrderIds.value.push(waitForSessionId)
        try {
          localStorage.setItem('fnaf-my-orders', JSON.stringify(myOrderIds.value))
        } catch (error) {
          console.error('Error saving order ID:', error)
        }
      }

      // Check if order already exists (fast webhook)
      if (!checkOrderExists(waitForSessionId)) {
        // Order doesn't exist yet, wait for it
        await waitForOrder(waitForSessionId)
      }

      // Remove query parameter from URL (clean up)
      const router = useRouter()
      router.replace({ query: {} })
    }
  }
})

// Format last updated time
const lastUpdatedTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
})

// Update last updated time every second
const lastUpdatedRef = ref(lastUpdatedTime.value)
let updateInterval: NodeJS.Timeout | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    lastUpdatedRef.value = lastUpdatedTime.value
  }, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  if (waitInterval) {
    clearInterval(waitInterval)
  }
})
</script>

<style scoped>
.orders-page {
  position: relative;
  background: #0d0d0d;
}

.header-section {
  background: linear-gradient(180deg, rgba(13, 13, 13, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
}

.glow-text {
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.5);
  animation: text-flicker 3s infinite;
}

@keyframes text-flicker {
  0%, 100% {
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(212, 175, 55, 0.5);
  }
  50% {
    text-shadow: 0 0 25px rgba(212, 175, 55, 0.9), 0 0 50px rgba(212, 175, 55, 0.6);
  }
}

/* Scan lines overlay effect */
.scan-lines::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
}

.scan-lines > * {
  position: relative;
  z-index: 2;
}

/* Floating Menu Button - matches cart button style */
.menu-button {
  position: fixed;
  bottom: 20px;
  right: 40px;
  width: 64px;
  height: 64px;
  background: linear-gradient(145deg, #8b0000, #a00000);
  border: 3px solid #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.5);
  z-index: 50;
  text-decoration: none;
}

.menu-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px #d4af37, 0 0 40px #8b0000;
}

@media (max-width: 768px) {
  .menu-button {
    width: 56px;
    height: 56px;
    bottom: 16px;
    right: 16px;
  }

  .menu-button .text-3xl {
    font-size: 24px;
  }
}
</style>
