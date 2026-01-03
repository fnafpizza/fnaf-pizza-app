import { getStore } from '@netlify/blobs'
import type { OrdersData } from '../types/order'

const STORE_NAME = 'orders'
const ORDERS_KEY = 'orders-data'

// Simple in-memory lock to prevent concurrent writes
let isLocked = false

/**
 * Acquire lock with timeout and retry logic
 */
async function acquireLock(timeout = 5000): Promise<void> {
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const tryAcquire = () => {
      if (!isLocked) {
        isLocked = true
        resolve()
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error('Lock acquisition timeout'))
      } else {
        // Wait 50ms and try again
        setTimeout(tryAcquire, 50)
      }
    }
    tryAcquire()
  })
}

/**
 * Release lock
 */
function releaseLock(): void {
  isLocked = false
}

/**
 * Execute function with lock
 */
export async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  await acquireLock()
  try {
    return await fn()
  } finally {
    releaseLock()
  }
}

/**
 * Read orders from Netlify Blobs
 */
export async function readOrders(): Promise<OrdersData> {
  try {
    const store = getStore(STORE_NAME)
    const data = await store.get(ORDERS_KEY, { type: 'json' })

    // If no data exists, return initial structure
    if (!data) {
      return {
        orders: [],
        lastUpdated: new Date().toISOString(),
        nextOrderNumber: 1
      }
    }

    return data as OrdersData
  } catch (error: any) {
    console.error('Failed to read orders from Netlify Blobs:', error)
    // Return empty data on error
    return {
      orders: [],
      lastUpdated: new Date().toISOString(),
      nextOrderNumber: 1
    }
  }
}

/**
 * Write orders to Netlify Blobs with atomic operation
 */
export async function writeOrders(data: OrdersData): Promise<void> {
  return withLock(async () => {
    try {
      // Update lastUpdated timestamp
      data.lastUpdated = new Date().toISOString()

      const store = getStore(STORE_NAME)
      await store.setJSON(ORDERS_KEY, data)

      console.log('✅ Orders saved to Netlify Blobs')
    } catch (error: any) {
      console.error('Failed to write orders to Netlify Blobs:', error)
      throw error
    }
  })
}
