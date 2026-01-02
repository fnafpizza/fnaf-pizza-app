<template>
  <div>
    <NuxtErrorBoundary>
      <NuxtPage />

      <template #error="{ error, clearError }">
        <div class="custom-error-wrapper">
          <div class="test-error">
            CUSTOM ERROR PAGE WORKS! {{ error?.statusCode || error?.status || 500 }}
            <button @click="clearError({ redirect: '/' })" style="display: block; margin-top: 2rem; padding: 1rem 2rem; background: white; color: red; border: none; cursor: pointer; font-size: 1rem;">
              Go Home
            </button>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  /* Hide scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

#__nuxt {
  width: 100%;
  min-height: 100vh;
}

.custom-error-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.test-error {
  width: 100vw;
  height: 100vh;
  background: red;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}
</style>
