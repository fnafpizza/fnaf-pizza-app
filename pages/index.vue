<template>
  <div class="fnaf-app w-full min-h-screen">
    <section class="h-screen">
      <HeroSection />
    </section>
    <section class="h-screen">
      <MenuSection />
    </section>

    <FloatingAdminButton />
    <FloatingOrdersButton />
    <FloatingCartButton />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const activeSection = ref(0)
let inMove = false
const moveDelay = 800

const scrollToSection = (id) => {
  if (inMove) return false

  activeSection.value = id
  inMove = true

  const sections = document.getElementsByTagName('section')
  if (sections[id]) {
    sections[id].scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  setTimeout(() => {
    inMove = false
  }, moveDelay)
}

const handleMouseWheel = (e) => {
  // Disable scroll snap when any modal is open
  if (document.querySelector('.modal-overlay') || document.body.style.overflow === 'hidden') {
    return
  }

  if (inMove) return

  const sections = document.getElementsByTagName('section')
  const currentSection = sections[activeSection.value]

  if (e.wheelDelta < 0) {
    // Scrolling down
    if (activeSection.value < 1) {
      e.preventDefault()
      scrollToSection(activeSection.value + 1)
    }
  } else if (e.wheelDelta > 0) {
    // Scrolling up
    if (activeSection.value > 0) {
      // Check if we're at the top of the current section
      const scrollTop = currentSection?.querySelector('.menu-section')?.scrollTop || 0
      if (scrollTop <= 10) {
        // At or near the top, snap to previous section
        e.preventDefault()
        scrollToSection(activeSection.value - 1)
      }
      // Otherwise allow natural scroll within the section
    }
  }
}

const handleMouseWheelDOM = (e) => {
  // Disable scroll snap when any modal is open
  if (document.querySelector('.modal-overlay') || document.body.style.overflow === 'hidden') {
    return
  }

  if (inMove) return

  const sections = document.getElementsByTagName('section')
  const currentSection = sections[activeSection.value]

  if (e.detail > 0) {
    // Scrolling down
    if (activeSection.value < 1) {
      e.preventDefault()
      scrollToSection(activeSection.value + 1)
    }
  } else if (e.detail < 0) {
    // Scrolling up
    if (activeSection.value > 0) {
      // Check if we're at the top of the current section
      const scrollTop = currentSection?.querySelector('.menu-section')?.scrollTop || 0
      if (scrollTop <= 10) {
        // At or near the top, snap to previous section
        e.preventDefault()
        scrollToSection(activeSection.value - 1)
      }
      // Otherwise allow natural scroll within the section
    }
  }
}

let touchStartY = 0

const touchStart = (e) => {
  touchStartY = e.touches[0].clientY
}

const touchMove = (e) => {
  // Disable scroll snap when any modal is open
  if (document.querySelector('.modal-overlay') || document.body.style.overflow === 'hidden') {
    return
  }

  if (inMove) return false

  const touchEndY = e.touches[0].clientY
  const delta = touchStartY - touchEndY

  const sections = document.getElementsByTagName('section')
  const currentSection = sections[activeSection.value]

  if (delta > 50 && activeSection.value < 1) {
    // Swiping up (scrolling down)
    e.preventDefault()
    scrollToSection(activeSection.value + 1)
  } else if (delta < -50 && activeSection.value > 0) {
    // Swiping down (scrolling up)
    // Check if we're at the top of the current section
    const scrollTop = currentSection?.querySelector('.menu-section')?.scrollTop || 0
    if (scrollTop <= 10) {
      // At or near the top, snap to previous section
      e.preventDefault()
      scrollToSection(activeSection.value - 1)
    }
    // Otherwise allow natural scroll within the section
  }
}

onMounted(() => {
  cartStore.loadFromLocalStorage()

  window.addEventListener('DOMMouseScroll', handleMouseWheelDOM)
  window.addEventListener('mousewheel', handleMouseWheel, { passive: false })
  window.addEventListener('touchstart', touchStart, { passive: false })
  window.addEventListener('touchmove', touchMove, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('DOMMouseScroll', handleMouseWheelDOM)
  window.removeEventListener('mousewheel', handleMouseWheel, { passive: false })
  window.removeEventListener('touchstart', touchStart)
  window.removeEventListener('touchmove', touchMove)
})
</script>

<style scoped>
.fnaf-app {
  background-color: #000;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
