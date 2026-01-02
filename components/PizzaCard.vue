<template>
  <div
    class="pizza-card bg-fnaf-dark border-2 border-fnaf-red rounded-lg p-6
           hover:border-fnaf-purple transition-all duration-300 shake-hover
           glow-border cursor-pointer flex flex-col h-full"
    @click="handleCardClick"
  >
    <div class="text-6xl mb-4 text-center">
      {{ emoji }}
    </div>

    <h3 class="text-2xl font-bold text-fnaf-gold mb-2 text-center">
      {{ name }}
    </h3>

    <p class="text-gray-400 text-sm mb-4 text-center">
      {{ description }}
    </p>

    <div class="flex-grow"></div>

    <div class="text-fnaf-red text-xl font-bold text-center mb-2">
      ${{ price }}
    </div>

    <button
      @click.stop="handleAddToCart"
      class="add-to-cart-btn w-full py-2 px-4 bg-fnaf-red text-fnaf-gold
             font-bold rounded-lg transition-all duration-300
             hover:bg-fnaf-purple hover:scale-105 active:scale-95"
    >
      Add to Cart 🛒
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '🍕'
  }
})

const emit = defineEmits(['click'])

const cartStore = useCartStore()

const handleCardClick = () => {
  emit('click')
}

const handleAddToCart = () => {
  cartStore.addToCart({
    id: props.id,
    name: props.name,
    description: props.description,
    price: props.price,
    emoji: props.emoji
  })
}
</script>

<style scoped>
.pizza-card {
  background: linear-gradient(145deg, #0d0d0d, #1a1a1a);
}

.pizza-card:hover {
  transform: translateY(-5px);
}
</style>
