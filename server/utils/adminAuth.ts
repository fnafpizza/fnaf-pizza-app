/**
 * Verify admin authentication token
 * The token is base64 encoded in format: password:timestamp
 */
export function verifyAdminToken(token: string | undefined, adminPassword: string): boolean {
  if (!token || !adminPassword) {
    return false
  }

  try {
    // Decode the base64 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8')

    // Extract password from "password:timestamp" format
    const [password] = decoded.split(':')

    // Verify password matches
    return password === adminPassword
  } catch (error) {
    console.error('Failed to verify admin token:', error)
    return false
  }
}
