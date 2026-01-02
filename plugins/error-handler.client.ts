export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  // Override default error handling
  nuxtApp.hook('vue:error', (error) => {
    console.log('Error caught:', error)
  })
})
