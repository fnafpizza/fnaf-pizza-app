<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="cartStore.isCheckoutModalOpen"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[110]"
    />
  </Transition>

  <!-- Modal -->
  <Transition name="modal">
    <div
      v-if="cartStore.isCheckoutModalOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center p-4"
    >
      <div class="checkout-modal max-w-lg w-full bg-fnaf-dark border-2 border-fnaf-red rounded-lg scan-lines">
        <!-- Header -->
        <div class="modal-header p-6 border-b-2 border-fnaf-red flex items-center justify-between">
          <h2 class="text-3xl font-bold text-fnaf-gold glow-text">
            Ready to Order?
          </h2>
          <button
            @click="closeModal"
            class="close-btn"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-content p-6 max-h-[60vh] overflow-y-auto">
          <!-- Customer Info Section -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-fnaf-gold mb-3">Customer Information</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value="Freddy Fazbear"
                  disabled
                  class="w-full px-3 py-2 bg-gray-900 border border-fnaf-purple text-gray-500 rounded cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value="test@example.com"
                  disabled
                  class="w-full px-3 py-2 bg-gray-900 border border-fnaf-purple text-gray-500 rounded cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  value="(555) 123-4567"
                  disabled
                  class="w-full px-3 py-2 bg-gray-900 border border-fnaf-purple text-gray-500 rounded cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  value="123 Pizzeria Lane, Hurricane, UT 84737"
                  disabled
                  class="w-full px-3 py-2 bg-gray-900 border border-fnaf-purple text-gray-500 rounded cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <!-- Test Card Instructions -->
          <div class="mb-6 p-4 bg-fnaf-purple bg-opacity-20 border border-fnaf-purple rounded">
            <h3 class="text-lg font-bold text-fnaf-gold mb-2">Test Mode</h3>
            <p class="text-sm text-gray-400 mb-3">
              This is a demo. Use this test card on the Stripe payment page:
            </p>
            <div class="flex items-center gap-2">
              <div class="flex-grow px-3 py-2 bg-gray-900 border border-fnaf-red rounded font-mono text-fnaf-gold">
                4242 4242 4242 4242
              </div>
              <button
                @click="copyTestCard"
                class="copy-btn px-4 py-2 bg-fnaf-red text-fnaf-gold font-bold rounded hover:bg-fnaf-purple transition-all"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Expiry: Any future date | CVC: Any 3 digits | ZIP: Any 5 digits
            </p>
          </div>

          <!-- Order Summary -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-fnaf-gold mb-3">Order Summary</h3>
            <div class="space-y-2">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-300">
                  {{ item.emoji }} {{ item.name }} x{{ item.quantity }}
                </span>
                <span class="text-fnaf-gold">
                  ${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                </span>
              </div>
              <div class="border-t border-fnaf-red pt-2 mt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span class="text-fnaf-gold">Total:</span>
                  <span class="text-fnaf-gold">${{ cartStore.cartTotal }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="cartStore.checkoutError" class="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded">
            <p class="text-red-400 text-sm">{{ cartStore.checkoutError }}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer p-6 border-t-2 border-fnaf-red flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 py-3 px-4 bg-transparent border-2 border-fnaf-red text-fnaf-red font-bold rounded hover:bg-fnaf-red hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            @click="handleCheckout"
            :disabled="cartStore.checkoutLoading"
            class="flex-1 py-3 px-4 bg-fnaf-red text-fnaf-gold font-bold rounded hover:bg-fnaf-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cartStore.checkoutLoading ? 'Processing...' : 'Pay with Stripe' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const config = useRuntimeConfig()
const copied = ref(false)

const closeModal = () => {
  cartStore.closeCheckoutModal()
}

const copyTestCard = async () => {
  try {
    await navigator.clipboard.writeText('4242424242424242')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const handleCheckout = async () => {
  try {
    cartStore.setCheckoutLoading(true)
    cartStore.setCheckoutError(null)

    // Backup cart for success page
    cartStore.backupOrderToLocalStorage()

    // Create checkout session
    const response = await $fetch('/api/checkout/create-session', {
      method: 'POST',
      body: { items: cartStore.items }
    })

    // Redirect to Stripe Checkout using the session URL
    if (response.url) {
      window.location.href = response.url
    } else {
      throw new Error('No checkout URL received')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    cartStore.setCheckoutError('Failed to start checkout. Please try again.')
    cartStore.setCheckoutLoading(false)
  }
}
</script>

<style scoped>
.checkout-modal {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  box-shadow: 0 0 30px rgba(139, 0, 0, 0.5), 0 0 60px rgba(61, 31, 77, 0.3);
  max-height: 90vh;
  overflow: hidden;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: transparent;
  color: #8b0000;
  border: 2px solid #8b0000;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #8b0000;
  color: white;
  transform: rotate(90deg);
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #0d0d0d;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #8b0000;
  border-radius: 4px;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
