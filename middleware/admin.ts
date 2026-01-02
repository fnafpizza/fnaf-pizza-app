export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  // Check if user is authenticated
  const authToken = localStorage.getItem('fnaf-admin-auth')

  if (!authToken) {
    // Redirect to login page
    return navigateTo('/admin/login')
  }

  // Token exists - allow access
  // Note: For production, you should verify the token on the server
})
