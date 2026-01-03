<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content grain">
        <!-- Header -->
        <div class="modal-header">
          <div class="camera-label flicker">📹 CAM-SYSTEM // MAINTENANCE</div>
          <span class="rec-dot pulse">● REC</span>
        </div>

        <!-- Warning Icon -->
        <div class="warning-section">
          <div class="warning-icon flicker">⚠️</div>
          <div class="warning-text">SYSTEM CLEANUP PROTOCOL</div>
        </div>

        <!-- Description -->
        <div class="modal-body">
          <div class="description-box">
            <p class="description-title">⚙️ MAINTENANCE ROUTINE</p>
            <p class="description-text">
              This will permanently remove all <span class="highlight">DELIVERED</span> orders
              older than <span class="highlight">7 days</span> from the security archives.
            </p>
            <p class="description-text mt-3">
              This action cannot be undone. The orders will be erased from all camera feeds
              and monitoring systems.
            </p>
            <p class="description-note">
              💾 Active orders (PREPARING, BAKING, OUT FOR DELIVERY) will remain untouched.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            @click="$emit('close')"
            :disabled="isProcessing"
            class="btn-secondary"
          >
            <span>CANCEL</span>
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="isProcessing"
            class="btn-danger"
          >
            <span v-if="!isProcessing">PURGE ARCHIVES</span>
            <span v-else class="flex items-center gap-2">
              <span class="spinner"></span>
              PURGING...
            </span>
          </button>
        </div>

        <!-- VHS Timestamp -->
        <div class="vhs-timestamp">{{ timestamp }}</div>

        <!-- Scan lines overlay -->
        <div class="scan-lines"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  isProcessing: boolean
}>()

defineEmits<{
  close: []
  confirm: []
}>()

const timestamp = computed(() => {
  const now = new Date()
  return now.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '')
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 100%);
  border: 3px solid #8b0000;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow:
    0 0 30px rgba(139, 0, 0, 0.6),
    0 0 60px rgba(139, 0, 0, 0.4),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 0, 0, 0.3);
}

.camera-label {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #8b0000;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-shadow: 0 0 5px rgba(139, 0, 0, 0.8);
}

.rec-dot {
  font-size: 0.7rem;
  color: #ff0000;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.8);
}

.warning-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.warning-icon {
  font-size: 3rem;
  animation: warning-pulse 1.5s ease-in-out infinite;
}

@keyframes warning-pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.5));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(255, 193, 7, 0.8));
  }
}

.warning-text {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #d4af37;
  letter-spacing: 0.15em;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
}

.modal-body {
  margin-bottom: 2rem;
}

.description-box {
  background: rgba(139, 0, 0, 0.1);
  border: 1px solid rgba(139, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.description-title {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  color: #d4af37;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.description-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #e5e5e5;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.highlight {
  color: #d4af37;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
}

.description-note {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-danger {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.1em;
  position: relative;
  overflow: hidden;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.2);
  border-color: #6b7280;
  color: #9ca3af;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(107, 114, 128, 0.3);
  border-color: #9ca3af;
  color: #e5e5e5;
}

.btn-danger {
  background: rgba(139, 0, 0, 0.3);
  border-color: #8b0000;
  color: #ff0000;
  box-shadow: 0 0 10px rgba(139, 0, 0, 0.3);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(139, 0, 0, 0.5);
  border-color: #ff0000;
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
  animation: glow-border 1s ease-in-out infinite;
}

.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-top-color: #ff0000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.vhs-timestamp {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
  pointer-events: none;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}
</style>
