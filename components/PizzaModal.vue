<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-container scan-lines grain">
        <!-- Static Overlay -->
        <div class="static-overlay"></div>

        <!-- VHS Timestamp -->
        <div class="vhs-timestamp">{{ currentTime }}</div>
        <div class="camera-label camera-flicker">CAM-KITCHEN</div>

        <!-- Close Button -->
        <button
          @click="closeModal"
          class="close-button"
          aria-label="Close modal"
        >
          ✕
        </button>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Pizza Emoji -->
          <div class="pizza-emoji pulse">
            {{ pizza.emoji }}
          </div>

          <!-- Pizza Name -->
          <h2 class="pizza-name glitch-text">
            {{ pizza.name }}
          </h2>

          <!-- Description -->
          <p class="pizza-description">
            {{ pizza.description }}
          </p>

          <!-- Warning Banner -->
          <div class="warning-banner flicker">
            <span class="warning-icon">⚠️</span>
            <span>INGREDIENTS DETECTED</span>
          </div>

          <!-- Ingredients List -->
          <div class="ingredients-section">
            <h3 class="ingredients-title">
              📋 SECURITY LOG - CONTENTS
            </h3>
            <ul class="ingredients-list">
              <li
                v-for="(ingredient, index) in pizza.ingredients"
                :key="index"
                class="ingredient-item"
              >
                <span class="ingredient-bullet">●</span>
                <span>{{ ingredient }}</span>
              </li>
            </ul>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <span class="price-label">COST:</span>
            <span class="price-amount">${{ pizza.price }}</span>
          </div>

          <!-- Add to Cart Button -->
          <button
            @click="handleAddToCart"
            class="modal-add-btn"
          >
            <span>🛒 ADD TO ORDER</span>
          </button>

          <!-- Footer Warning -->
          <div class="footer-warning">
            <p class="footer-text">⚠️ Consumption at your own risk</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  pizza: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const cartStore = useCartStore()

// Current time for VHS effect
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const closeModal = () => {
  emit('close')
}

const handleAddToCart = () => {
  cartStore.addToCart({
    id: props.pizza.id,
    name: props.pizza.name,
    description: props.pizza.description,
    price: props.pizza.price,
    emoji: props.pizza.emoji
  })
  closeModal()
}

// Handle escape key to close modal
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-container {
  position: relative;
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  border: 3px solid #d4af37;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(139, 0, 0, 0.1);
}

/* Static Overlay */
.static-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
  animation: static-noise 0.1s infinite;
  border-radius: 1rem;
}

@keyframes static-noise {
  0% { opacity: 0.05; }
  50% { opacity: 0.1; }
  100% { opacity: 0.05; }
}

/* VHS Elements */
.vhs-timestamp {
  position: absolute;
  top: 15px;
  right: 60px;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(255, 0, 0, 0.8);
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.camera-label {
  position: absolute;
  top: 15px;
  left: 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
  z-index: 10;
}

/* Close Button */
.close-button {
  position: sticky;
  top: 15px;
  float: right;
  margin-right: 15px;
  margin-top: 15px;
  width: 32px;
  height: 32px;
  background: rgba(139, 0, 0, 0.8);
  border: 2px solid #d4af37;
  border-radius: 50%;
  color: #d4af37;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-button:hover {
  background: rgba(160, 0, 0, 1);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
}

/* Modal Content */
.modal-content {
  position: relative;
  z-index: 5;
  padding: 3rem 2rem 2rem;
}

/* Pizza Emoji */
.pizza-emoji {
  font-size: 6rem;
  text-align: center;
  margin-bottom: 1rem;
}

/* Pizza Name */
.pizza-name {
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  text-align: center;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.glitch-text {
  animation: glitch-effect 3s infinite;
}

@keyframes glitch-effect {
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, 1px); }
  20% { transform: translate(2px, -1px); }
  30% { transform: translate(0); }
}

/* Description */
.pizza-description {
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  font-style: italic;
}

/* Warning Banner */
.warning-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(139, 0, 0, 0.2);
  border: 2px solid #8b0000;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  margin-bottom: 1.5rem;
  letter-spacing: 0.1em;
}

.warning-icon {
  font-size: 1.25rem;
}

/* Ingredients Section */
.ingredients-section {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #3d1f4d;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.ingredients-title {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  text-align: center;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #9ca3af;
  transition: all 0.3s;
}

.ingredient-item:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding-left: 1rem;
}

.ingredient-bullet {
  color: #8b0000;
  font-size: 0.6rem;
}

/* Price Section */
.price-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(139, 0, 0, 0.2);
  border: 2px solid #8b0000;
  border-radius: 0.5rem;
}

.price-label {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #9ca3af;
  letter-spacing: 0.1em;
}

.price-amount {
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
}

/* Add to Cart Button */
.modal-add-btn {
  width: 100%;
  padding: 1rem;
  background: #8b0000;
  border: 2px solid #d4af37;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #d4af37;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.modal-add-btn:hover {
  background: #a00000;
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.modal-add-btn:active {
  transform: scale(0.98);
}

/* Footer Warning */
.footer-warning {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 0, 0, 0.3);
}

.footer-text {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-content {
    padding: 2.5rem 1.5rem 1.5rem;
  }

  .pizza-emoji {
    font-size: 4rem;
  }

  .pizza-name {
    font-size: 1.5rem;
  }

  .price-amount {
    font-size: 1.5rem;
  }
}
</style>
