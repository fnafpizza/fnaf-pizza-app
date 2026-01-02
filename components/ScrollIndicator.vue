<template>
  <div
    class="scroll-indicator transition-opacity duration-500"
    :class="{ 'opacity-0': scrollY > 50, 'opacity-100': scrollY <= 50 }"
    @click="scrollToMenu"
  >
    <div class="bounce text-fnaf-gold text-4xl">
      ↓
    </div>
    <p class="text-gray-400 text-sm mt-2">Scroll Down</p>
  </div>
</template>

<script setup>
const { scrollY } = useScrollReveal()

const scrollToMenu = () => {
  console.log('ScrollIndicator clicked, scrolling to menu section...')

  // Find the menu section and scroll to it
  const menuSection = document.querySelector('.menu-section')
  if (menuSection) {
    menuSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  } else {
    // Fallback: scroll by viewport height
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.scroll-indicator {
  text-align: center;
  cursor: pointer;
}
</style>
