<template>
  <div class="error-page scan-lines grain">
    <!-- Static Overlay -->
    <div class="static-overlay"></div>

    <!-- VHS Timestamp -->
    <div class="vhs-timestamp">{{ currentTime }}</div>
    <div class="camera-label">CAM-04</div>

    <!-- Error Content -->
    <div class="error-content">
      <!-- Flickering Error Code -->
      <div class="error-code flicker">
        <span class="glitch">404</span>
      </div>

      <!-- Creepy Message -->
      <div class="error-message">
        <h1 class="title camera-flicker">PAGE NOT FOUND</h1>
        <p class="description">The page you're looking for has vanished... just like the night guard.</p>

        <!-- FNAF Reference -->
        <div class="fnaf-quote flicker-fast">
          "It's me."
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="handleGoHome" class="btn-primary">
          🏠 Return to Safety
        </button>
        <button @click="handleGoBack" class="btn-secondary">
          ← Go Back
        </button>
      </div>

      <!-- Warning Message -->
      <div class="warning-message pulse">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">SYSTEM ANOMALY DETECTED</span>
      </div>
    </div>

    <!-- Animatronic Eyes (decorative) -->
    <div class="animatronic-eyes">
      <div class="eye left" :class="{ blink: isBlinking }"></div>
      <div class="eye right" :class="{ blink: isBlinking }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

// Current time for VHS effect
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// Blinking eyes effect
const isBlinking = ref(false)
const startBlinking = () => {
  setInterval(() => {
    isBlinking.value = true
    setTimeout(() => {
      isBlinking.value = false
    }, 200)
  }, 3000 + Math.random() * 3000)
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
  startBlinking()
})

// Navigation handlers
const handleGoHome = () => {
  router.push('/')
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleGoHome()
  }
}
</script>

<style scoped>
.error-page {
  position: fixed;
  inset: 0;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
}

/* Static Overlay */
.static-overlay {
  position: fixed;
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
}

@keyframes static-noise {
  0% { opacity: 0.05; }
  50% { opacity: 0.1; }
  100% { opacity: 0.05; }
}

/* VHS Elements */
.vhs-timestamp {
  position: fixed;
  top: 20px;
  right: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 0, 0, 0.8);
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.camera-label {
  position: fixed;
  top: 20px;
  left: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
  z-index: 10;
  animation: camera-flicker 3s infinite;
}

/* Error Content */
.error-content {
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: #8b0000;
  text-shadow: 0 0 20px rgba(139, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.6);
  margin-bottom: 1rem;
  line-height: 1;
}

.glitch {
  display: inline-block;
  animation: glitch-effect 2s infinite;
}

@keyframes glitch-effect {
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-5px, 2px); }
  20% { transform: translate(5px, -2px); }
  30% { transform: translate(-2px, -5px); }
  40% { transform: translate(2px, 5px); }
  50% { transform: translate(0); }
}

.error-message {
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.8);
  margin-bottom: 1rem;
  letter-spacing: 0.2em;
}

.description {
  font-size: 1.125rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.fnaf-quote {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  color: #8b0000;
  font-style: italic;
  margin: 2rem 0;
  text-shadow: 0 0 10px rgba(139, 0, 0, 0.8);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-primary {
  background: #8b0000;
  border-color: #d4af37;
  color: #d4af37;
}

.btn-primary:hover {
  background: #a00000;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.btn-secondary {
  background: transparent;
  border-color: #6b7280;
  color: #9ca3af;
}

.btn-secondary:hover {
  border-color: #d4af37;
  color: #d4af37;
  transform: scale(1.05);
}

/* Warning Message */
.warning-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(139, 0, 0, 0.2);
  border: 2px solid #8b0000;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
}

.warning-icon {
  font-size: 1.5rem;
}

/* Animatronic Eyes */
.animatronic-eyes {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8rem;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
}

.eye {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #d4af37 20%, #8b0000 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.3);
  transition: opacity 0.2s;
}

.eye.blink {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .fnaf-quote {
    font-size: 1.125rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .animatronic-eyes {
    gap: 4rem;
  }

  .eye {
    width: 60px;
    height: 60px;
  }
}
</style>
