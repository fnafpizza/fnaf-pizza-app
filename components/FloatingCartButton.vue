<template>
  <div class="floating-cart-container">
    <button
      @click="handleCartClick"
      class="cart-button"
      :class="{ 'has-items': cartStore.hasItems, 'pulse-once': justAdded }"
      aria-label="Shopping cart"
    >
      <span class="text-3xl">🛒</span>

      <Transition name="pop">
        <span
          v-if="cartStore.cartItemCount > 0"
          class="cart-badge"
        >
          {{ cartStore.cartItemCount }}
        </span>
      </Transition>
    </button>

    <CartPanel />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const justAdded = ref(false)

const handleCartClick = () => {
  cartStore.toggleCart()
}

watch(() => cartStore.cartItemCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    justAdded.value = true
    setTimeout(() => {
      justAdded.value = false
    }, 600)
  }
})
</script>

<style scoped>
.floating-cart-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
}

.cart-button {
  position: fixed;
  bottom: 20px;
  right: 120px;
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
}

.cart-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px #d4af37, 0 0 40px #8b0000;
}

.cart-button.has-items {
  animation: pulse 2s ease-in-out infinite;
}

.cart-button.pulse-once {
  animation: shake 0.5s ease-in-out;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ffd700;
  color: #0d0d0d;
  border: 2px solid #8b0000;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s;
}

.pop-enter-from {
  transform: scale(0);
  opacity: 0;
}

.pop-leave-to {
  transform: scale(0);
  opacity: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

@media (max-width: 768px) {
  .floating-cart-container {
    bottom: 16px;
    right: 16px;
  }

  .cart-button {
    width: 56px;
    height: 56px;
    right: 105px;
  }

  .cart-button .text-3xl {
    font-size: 24px;
  }
}
</style>
