import { Server } from 'socket.io'
import type { NitroApp } from 'nitropack'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  if (!import.meta.dev) {
    // Only run in production - dev mode doesn't expose HTTP server the same way
    console.log('⚠️  Socket.io disabled in dev mode - using polling fallback')
    return
  }

  const config = useRuntimeConfig()

  // Try to get HTTP server from Nitro (production only)
  const httpServer = (nitroApp as any).h3App?.nodeHandler?.server ||
                     (nitroApp as any).localCall?.server ||
                     (nitroApp as any).server

  if (!httpServer) {
    console.warn('⚠️  Could not find HTTP server for socket.io - using polling fallback')
    return
  }

  // Create socket.io server with CORS
  const io = new Server(httpServer, {
    cors: {
      origin: config.public.appUrl || 'http://localhost:3000',
      credentials: true
    }
  })

  // Connection handler
  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id)

    // Check if admin (via handshake auth token)
    const isAdmin = socket.handshake.auth?.token === config.adminPassword

    if (isAdmin) {
      socket.join('admin')
      console.log('👑 Admin socket joined:', socket.id)
    }

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id)
    })
  })

  // Store globally for access in other server files
  ;(globalThis as any).__io__ = io

  console.log('🚀 Socket.io server initialized')
})
