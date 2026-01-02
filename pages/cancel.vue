<template>
  <div class="cancel-page min-h-screen bg-black flex items-center justify-center p-4 scan-lines">
    <div class="cancel-card max-w-lg w-full bg-fnaf-dark border-2 border-fnaf-red rounded-lg p-8 text-center">
      <!-- Cancel Icon -->
      <div class="cancel-icon mb-6">
        <div class="text-8xl text-fnaf-red flicker">✕</div>
      </div>

      <!-- Cancel Message -->
      <h1 class="text-4xl md:text-5xl font-bold text-fnaf-red glow-text mb-4">
        Payment Cancelled
      </h1>
      <p class="text-xl text-gray-400 mb-6">
        Your order was not completed.
      </p>

      <!-- Reassurance -->
      <div class="reassurance bg-fnaf-purple bg-opacity-20 border border-fnaf-purple rounded-lg p-6 mb-8">
        <p class="text-gray-300 mb-2">
          Don't worry! Your cart items are still saved.
        </p>
        <p class="text-sm text-gray-500">
          You can return to the menu and checkout whenever you're ready.
        </p>
      </div>

      <!-- Actions -->
      <button
        @click="returnHome"
        class="w-full px-6 py-3 bg-fnaf-red text-fnaf-gold font-bold rounded-lg hover:bg-fnaf-purple transition-all duration-300"
      >
        Return to Menu
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const returnHome = () => {
  router.push('/')
}
</script>

<style scoped>
.cancel-icon {
  animation: cancel-appear 0.6s ease-out;
}

@keyframes cancel-appear {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
  }
  100% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
}

.cancel-card {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  box-shadow: 0 0 30px rgba(139, 0, 0, 0.5), 0 0 60px rgba(61, 31, 77, 0.3);
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
