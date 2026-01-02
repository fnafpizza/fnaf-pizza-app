<template>
  <div class="hero-section h-screen flex flex-col items-center justify-center relative scan-lines grain">
    <!-- Security Camera UI -->
    <div class="security-ui absolute top-4 left-4 text-green-500 font-mono text-sm z-20">
      <div class="flex items-center gap-2">
        <div class="pulse w-3 h-3 bg-red-600 rounded-full"></div>
        <span>REC</span>
      </div>
      <div class="mt-1">CAM 01</div>
      <div class="mt-1">{{ currentTime }}</div>
    </div>

    <!-- Main Content -->
    <div class="text-center z-10 px-4">
      <h1 class="text-7xl md:text-8xl font-bold text-fnaf-gold mb-4 flicker glow-text">
        Freddy Fazbear's Pizza
      </h1>

      <p class="text-2xl md:text-3xl text-fnaf-purple mb-8 flicker-fast">
        Where nightmares come to dine...
      </p>

      <p class="text-gray-500 text-lg">
        Est. 1987 • Open Till 6AM
      </p>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10">
      <ScrollIndicator />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

let intervalId

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  position: relative;
}

.security-ui {
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}
</style>
