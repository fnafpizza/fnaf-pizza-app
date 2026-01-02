<template>
  <div class="cart-item flex items-center gap-4 p-4 border-b border-fnaf-red">
    <div class="text-4xl">{{ item.emoji }}</div>

    <div class="flex-grow">
      <h4 class="text-fnaf-gold font-bold">{{ item.name }}</h4>
      <p class="text-gray-400 text-sm">${{ item.price }} each</p>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="decrementQuantity"
        class="qty-btn"
        :disabled="item.quantity === 1"
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10H18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </button>
      <span class="text-white font-bold min-w-[30px] text-center">
        {{ item.quantity }}
      </span>
      <button
        @click="incrementQuantity"
        class="qty-btn"
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2V18M2 10H18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <button
      @click="removeItem"
      class="remove-btn"
      aria-label="Remove item"
    >
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const incrementQuantity = () => {
  cartStore.incrementQuantity(props.item.id)
}

const decrementQuantity = () => {
  cartStore.decrementQuantity(props.item.id)
}

const removeItem = () => {
  cartStore.removeFromCart(props.item.id)
}
</script>

<style scoped>
.cart-item {
  background: linear-gradient(145deg, #0d0d0d, #1a1a1a);
  transition: all 0.3s;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: #3d1f4d;
  color: #d4af37;
  border: 1px solid #8b0000;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.qty-btn:hover:not(:disabled) {
  background: #8b0000;
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  color: #8b0000;
  border: 1px solid #8b0000;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.remove-btn:hover {
  background: #8b0000;
  color: white;
  transform: scale(1.1);
}
</style>
