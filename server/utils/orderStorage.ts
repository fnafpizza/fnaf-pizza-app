import { promises as fs } from 'fs'
import { join } from 'path'
import type { OrdersData } from '../types/order'

const DATA_DIR = join(process.cwd(), 'server', 'data')
const ORDERS_FILE = join(DATA_DIR, 'orders.json')
const BACKUP_FILE = join(DATA_DIR, 'orders.backup.json')
const TEMP_FILE = join(DATA_DIR, 'orders.tmp.json')

// Simple in-memory lock to prevent concurrent writes
let isLocked = false
const lockQueue: Array<() => void> = []

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
 * Release lock and process queue
 */
function releaseLock(): void {
  isLocked = false
  const next = lockQueue.shift()
  if (next) next()
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
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

/**
 * Read orders from JSON file
 */
export async function readOrders(): Promise<OrdersData> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    // File doesn't exist or is corrupted, return initial structure
    if (error.code === 'ENOENT') {
      return {
        orders: [],
        lastUpdated: new Date().toISOString(),
        nextOrderNumber: 1
      }
    }

    // Try to recover from backup
    try {
      console.warn('Orders file corrupted, attempting recovery from backup')
      const backupData = await fs.readFile(BACKUP_FILE, 'utf-8')
      return JSON.parse(backupData)
    } catch {
      console.error('Backup recovery failed, returning empty data')
      return {
        orders: [],
        lastUpdated: new Date().toISOString(),
        nextOrderNumber: 1
      }
    }
  }
}

/**
 * Write orders to JSON file with atomic operation
 */
export async function writeOrders(data: OrdersData): Promise<void> {
  await ensureDataDir()

  return withLock(async () => {
    // Create backup of existing file
    try {
      await fs.copyFile(ORDERS_FILE, BACKUP_FILE)
    } catch (error: any) {
      // Original file might not exist yet, that's okay
      if (error.code !== 'ENOENT') {
        console.warn('Failed to create backup:', error.message)
      }
    }

    // Update lastUpdated timestamp
    data.lastUpdated = new Date().toISOString()

    // Write to temporary file first
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(TEMP_FILE, jsonData, 'utf-8')

    // Atomic rename (overwrite original)
    await fs.rename(TEMP_FILE, ORDERS_FILE)
  })
}
