<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[110]"
    />
  </Transition>

  <!-- Modal -->
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[120] flex items-center justify-center p-4"
      @click="$emit('close')"
    >
      <div class="delete-modal max-w-md w-full bg-fnaf-dark border-2 border-fnaf-red rounded-lg scan-lines" @click.stop>
        <!-- Header -->
        <div class="modal-header p-6 border-b-2 border-fnaf-red flex items-center justify-between">
          <h2 class="text-3xl font-bold text-fnaf-gold glow-text">
            Delete Order?
          </h2>
          <button
            @click="$emit('close')"
            class="close-btn"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-content p-6">
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4 p-4 bg-fnaf-red bg-opacity-20 border border-fnaf-red rounded">
              <div class="text-4xl">⚠️</div>
              <div>
                <p class="text-fnaf-gold font-bold mb-1">Warning</p>
                <p class="text-sm text-gray-300">This action cannot be undone.</p>
              </div>
            </div>

            <div v-if="order" class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Order Number:</span>
                <span class="text-fnaf-gold font-mono font-bold">{{ order.orderNumber }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-400">Status:</span>
                <span class="text-white capitalize">{{ order.status.replaceAll('_', ' ') }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-400">Total:</span>
                <span class="text-fnaf-gold font-bold">${{ order.total.toFixed(2) }}</span>
              </div>

              <div class="border-t border-gray-700 pt-3 mt-3">
                <p class="text-xs text-gray-500 mb-2">Items:</p>
                <div class="space-y-1">
                  <div
                    v-for="(item, idx) in order.items"
                    :key="idx"
                    class="text-sm text-gray-300"
                  >
                    {{ item.emoji }} {{ item.name }} x{{ item.quantity }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-400">
            Are you sure you want to delete this order? All order data will be permanently removed.
          </p>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer p-6 border-t-2 border-fnaf-red flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 py-3 px-4 bg-transparent border-2 border-gray-600 text-gray-400 font-bold rounded hover:bg-gray-800 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="isDeleting"
            class="flex-1 py-3 px-4 bg-fnaf-red text-fnaf-gold font-bold rounded hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Order' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Order } from '~/server/types/order'

defineProps<{
  isOpen: boolean
  order: Order | null
  isDeleting: boolean
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<style scoped>
.delete-modal {
  background: linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  box-shadow: 0 0 30px rgba(139, 0, 0, 0.5), 0 0 60px rgba(61, 31, 77, 0.3);
  max-height: 90vh;
  overflow: hidden;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: transparent;
  color: #8b0000;
  border: 2px solid #8b0000;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #8b0000;
  color: white;
  transform: rotate(90deg);
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #0d0d0d;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #8b0000;
  border-radius: 4px;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
