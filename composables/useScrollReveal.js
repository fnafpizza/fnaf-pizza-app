import { ref, onMounted, onUnmounted } from 'vue'

export const useScrollReveal = (threshold = 300) => {
  const isRevealed = ref(false)
  const scrollY = ref(0)

  const handleScroll = () => {
    scrollY.value = window.scrollY
    if (scrollY.value > threshold && !isRevealed.value) {
      isRevealed.value = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isRevealed,
    scrollY
  }
}
