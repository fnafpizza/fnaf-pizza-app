<template>
  <Transition name="toast">
    <div v-if="visible" class="status-toast grain">
      <!-- Camera label -->
      <div class="toast-header">
        <span class="camera-label flicker">📹 ADMIN-LOG</span>
        <span class="rec-dot pulse">● REC</span>
      </div>

      <!-- Message -->
      <div class="toast-message">
        <span class="status-icon">✓</span>
        <span class="message-text">{{ message }}</span>
      </div>

      <!-- VHS timestamp -->
      <div class="vhs-timestamp">{{ timestamp }}</div>

      <!-- Scan lines overlay -->
      <div class="scan-lines"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  visible: boolean
}>()

const timestamp = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})
</script>

<style scoped>
.status-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 320px;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%);
  border: 2px solid #8b0000;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow:
    0 0 20px rgba(139, 0, 0, 0.5),
    0 0 40px rgba(139, 0, 0, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(139, 0, 0, 0.3);
}

.camera-label {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: #8b0000;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 0 0 5px rgba(139, 0, 0, 0.8);
}

.rec-dot {
  font-size: 0.65rem;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
}

.toast-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.status-icon {
  font-size: 1.5rem;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
  animation: icon-glow 1s ease-in-out;
}

@keyframes icon-glow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.message-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #d4af37;
  letter-spacing: 0.05em;
  line-height: 1.4;
}

.vhs-timestamp {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
}

/* Toast transition */
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in;
}

@keyframes toast-in {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(400px) scale(0.8);
    opacity: 0;
  }
}
</style>
