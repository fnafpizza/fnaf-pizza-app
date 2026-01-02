export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // Return the admin password for demo purposes
  // This is only acceptable because it's a simulator/demo app
  return {
    password: config.adminPassword || 'freddyfazbear'
  }
})
