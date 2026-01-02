<template>
  <Transition name="backdrop">
    <div
      v-if="cartStore.isOpen"
      @click="cartStore.closeCart()"
      class="cart-backdrop fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[90]"
    />
  </Transition>

  <Transition name="slide-right">
    <div
      v-if="cartStore.isOpen"
      class="cart-panel fixed top-0 right-0 h-full w-full md:w-[400px]
             bg-fnaf-dark border-fnaf-red z-[100]
             flex flex-col scan-lines"
    >
      <div class="cart-header p-6 border-b-2 border-fnaf-red flex items-center justify-between">
        <h2 class="text-3xl font-bold text-fnaf-gold glow-text">
          Your Order
        </h2>
        <button
          @click="cartStore.closeCart()"
          class="close-btn"
          aria-label="Close cart"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="cart-items-container flex-grow overflow-y-auto">
        <div v-if="cartStore.hasItems">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.id"
            :item="item"
          />
        </div>
        <div v-else class="empty-state text-center p-8">
          <div class="text-6xl mb-4">🍕</div>
          <p class="text-gray-500 text-lg flicker-fast">
            Your cart is empty...
          </p>
          <p class="text-gray-600 text-sm mt-2">
            Add some pizza to get started!
          </p>
        </div>
      </div>

      <div class="cart-footer p-6 border-t-2 border-fnaf-red bg-black">
        <div class="totals mb-4">
          <div class="flex justify-between text-gray-400 mb-2">
            <span>Subtotal:</span>
            <span>${{ cartStore.cartSubtotal }}</span>
          </div>
          <div class="flex justify-between text-fnaf-gold text-2xl font-bold">
            <span>Total:</span>
            <span>${{ cartStore.cartTotal }}</span>
          </div>
        </div>

        <button
          @click="cartStore.openCheckoutModal()"
          :disabled="!cartStore.hasItems"
          class="checkout-btn w-full py-3 px-6 bg-fnaf-red text-fnaf-gold
                 font-bold text-lg rounded-lg transition-all duration-300
                 hover:bg-fnaf-purple disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </Transition>

  <!-- Checkout Modal -->
  <CheckoutModal />
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-panel {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  box-shadow: 0px 0 8px rgba(139, 0, 0, 0.5);
  width: calc(100vw - 32px);
}

@media (min-width: 768px) {
  .cart-panel {
    width: 400px;
  }
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
  padding: 0;
}

.close-btn:hover {
  background: #8b0000;
  color: white;
  transform: rotate(90deg);
}

.cart-items-container {
  scrollbar-width: thin;
  scrollbar-color: #8b0000 #0d0d0d;
}

.cart-items-container::-webkit-scrollbar {
  width: 8px;
}

.cart-items-container::-webkit-scrollbar-track {
  background: #0d0d0d;
}

.cart-items-container::-webkit-scrollbar-thumb {
  background: #8b0000;
  border-radius: 4px;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
