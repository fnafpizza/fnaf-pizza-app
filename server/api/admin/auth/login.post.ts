export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      message: 'Password is required'
    })
  }

  // Check if password matches the one in .env
  const adminPassword = config.adminPassword

  if (password !== adminPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid password'
    })
  }

  // Generate a simple auth token (you could use JWT here)
  const authToken = Buffer.from(`${password}:${Date.now()}`).toString('base64')

  return {
    success: true,
    token: authToken
  }
})
