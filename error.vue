<template>
  <div class="test-error">
    CUSTOM ERROR PAGE WORKS! {{ error?.statusCode }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object
})

const handleClear = () => clearError({ redirect: '/' })
</script>

<style scoped>
.test-error {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: red !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  font-size: 3rem !important;
  z-index: 9999 !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style>
/* Override Nuxt's default error wrapper */
[data-v-fdc70557] {
  background: transparent !important;
  color: inherit !important;
  display: contents !important;
}

/* Target all possible error container classes */
.antialiased,
.bg-white,
.dark\:bg-black {
  background: transparent !important;
  display: contents !important;
}
</style>
