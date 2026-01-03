<template>
  <div
    ref="menuRef"
    class="menu-section h-screen bg-black py-20 px-4 transition-all duration-1000"
    :class="{
      'opacity-100 translate-y-0': isRevealed,
      'opacity-0 translate-y-10': !isRevealed,
      'overflow-y-auto': !isModalOpen,
      'overflow-hidden': isModalOpen
    }"
  >
    <div class="container mx-auto max-w-6xl">
      <h2 class="text-5xl font-bold text-center mb-4 text-fnaf-gold glow-text">
        Tonight's Menu
      </h2>

      <p class="text-center text-gray-500 mb-12 text-sm">
        Choose your poison... we mean pizza
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PizzaCard
          v-for="pizza in pizzas"
          :key="pizza.id"
          :id="pizza.id"
          :name="pizza.name"
          :description="pizza.description"
          :price="pizza.price"
          :emoji="pizza.emoji"
          @click="openPizzaModal(pizza)"
        />
      </div>
    </div>

    <!-- Pizza Modal -->
    <PizzaModal
      :is-open="isModalOpen"
      :pizza="selectedPizza"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isRevealed = ref(false)
const menuRef = ref(null)
let observer = null

onMounted(() => {
  if (process.client && menuRef.value) {
    // Create intersection observer
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isRevealed.value = true
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '-100px' // Trigger 100px before element enters viewport
      }
    )

    // Start observing the menu section
    observer.observe(menuRef.value)
  }
})

onUnmounted(() => {
  if (observer && menuRef.value) {
    observer.unobserve(menuRef.value)
    observer.disconnect()
  }
})

// Modal state
const isModalOpen = ref(false)
const selectedPizza = ref({
  id: 1,
  name: '',
  description: '',
  price: '',
  emoji: '',
  ingredients: []
})

const openPizzaModal = (pizza) => {
  selectedPizza.value = pizza
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const pizzas = [
  {
    id: 1,
    name: "Freddy's Favorite",
    description: "Pepperoni & Cheese - A classic that never dies",
    price: "12.99",
    emoji: "🍕",
    ingredients: [
      "Hand-tossed dough (freshly prepared at midnight)",
      "Marinara sauce (from the 1987 recipe)",
      "Mozzarella cheese (sourced from the prize corner)",
      "Pepperoni slices (cut by Freddy himself)",
      "Italian herbs (found in the back room)",
      "A sprinkle of nostalgia"
    ]
  },
  {
    id: 2,
    name: "Bonnie's Blast",
    description: "Veggie Supreme - Fresh from the garden... if you dare",
    price: "11.99",
    emoji: "🥗",
    ingredients: [
      "Whole wheat crust (stored in parts & service)",
      "Garlic butter base (Bonnie's secret)",
      "Bell peppers (red, green, and purple)",
      "Fresh mushrooms (from the security office)",
      "Black olives (surveillance camera approved)",
      "Onions (guaranteed to make you cry)",
      "Tomatoes (slightly haunted)"
    ]
  },
  {
    id: 3,
    name: "Chica's Choice",
    description: "BBQ Chicken - Smoky and mysterious",
    price: "13.99",
    emoji: "🍗",
    ingredients: [
      "Crispy crust (baked in Chica's kitchen)",
      "Smoky BBQ sauce (with a hint of darkness)",
      "Grilled chicken (free-range... we think)",
      "Red onions (caramelized at 6 AM)",
      "Cheddar cheese (melted to perfection)",
      "Cilantro (picked fresh from the prize garden)",
      "Bacon bits (crispy and mysterious)"
    ]
  },
  {
    id: 4,
    name: "Foxy's Fire",
    description: "Spicy Jalapeño - For those who like it hot",
    price: "14.99",
    emoji: "🌶️",
    ingredients: [
      "Thin crust (as sharp as Foxy's hook)",
      "Spicy marinara (pirate-approved heat level)",
      "Pepper jack cheese (stolen from the kitchen)",
      "Fresh jalapeños (from Pirate Cove)",
      "Spicy Italian sausage (walk the plank worthy)",
      "Crushed red pepper (danger level: maximum)",
      "Hot honey drizzle (Foxy's secret ingredient)"
    ]
  },
  {
    id: 5,
    name: "Golden Special",
    description: "Four Cheese - Rare and delicious",
    price: "15.99",
    emoji: "🧀",
    ingredients: [
      "Golden crust (brushed with butter)",
      "Alfredo sauce (creamy and haunting)",
      "Mozzarella (the classic one)",
      "Provolone (aged in the safe room)",
      "Parmesan (freshly grated)",
      "Gorgonzola (for the brave)",
      "Fresh basil (from the hidden garden)",
      "Truffle oil (extremely rare)"
    ]
  },
  {
    id: 6,
    name: "Night Shift",
    description: "Meat Lovers - Fuel for the long night ahead",
    price: "16.99",
    emoji: "🥩",
    ingredients: [
      "Thick crust (fortified for survival)",
      "Rich tomato sauce (simmered for 12 hours)",
      "Pepperoni (double layer)",
      "Italian sausage (night guard approved)",
      "Ground beef (100% animatronic-free)",
      "Canadian bacon (imported from the North)",
      "Bacon strips (extra crispy)",
      "Mozzarella & cheddar blend (power-up included)"
    ]
  }
]
</script>

<style scoped>
.menu-section {
  background: linear-gradient(180deg, #000000 0%, #0d0d0d 100%);
}
</style>
