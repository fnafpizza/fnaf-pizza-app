import { readOrders, writeOrders, withLock } from './orderStorage'
import type { Order, OrderItem, OrderStatus } from '../types/order'
import { OrderStatus as OrderStatusEnum } from '../types/order'
import { emitOrderEvent } from './pusherServer'

/**
 * Generate a human-friendly order number
 */
function generateOrderNumber(nextNumber: number): string {
  return `ORD-${String(nextNumber).padStart(3, '0')}`
}

/**
 * Calculate estimated ready time (30-45 minutes from now)
 */
function calculateEstimatedReady(): string {
  const now = new Date()
  const minutes = 30 + Math.floor(Math.random() * 16) // 30-45 minutes
  now.setMinutes(now.getMinutes() + minutes)
  return now.toISOString()
}

/**
 * Create a new order (atomic operation with lock)
 */
export async function createOrder(
  sessionId: string,
  items: OrderItem[],
  total: number
): Promise<Order> {
  // Wrap entire read-check-write sequence in lock to prevent race conditions
  return withLock(async () => {
    const data = await readOrders()

    // Check if order already exists (duplicate webhook event)
    const existing = data.orders.find(order => order.id === sessionId)
    if (existing) {
      return existing
    }

    const now = new Date().toISOString()
    const order: Order = {
      id: sessionId,
      orderNumber: generateOrderNumber(data.nextOrderNumber),
      items,
      total,
      status: OrderStatusEnum.PREPARING,
      createdAt: now,
      updatedAt: now,
      estimatedReady: calculateEstimatedReady()
    }

    data.orders.push(order)
    data.nextOrderNumber++

    await writeOrders(data)

    // Emit Pusher event
    await emitOrderEvent('order:created', order)

    return order
  })
}

/**
 * Get all orders with optional filtering
 */
export async function getOrders(options?: {
  status?: OrderStatus | OrderStatus[]
  includeCompleted?: boolean
  limit?: number
}): Promise<Order[]> {
  const data = await readOrders()
  let filtered = data.orders

  // Filter by status
  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status]
    filtered = filtered.filter(order => statuses.includes(order.status))
  }

  // Exclude completed orders by default
  if (!options?.includeCompleted) {
    filtered = filtered.filter(order => order.status !== OrderStatusEnum.DELIVERED)
  }

  // Sort by createdAt (newest first)
  filtered.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Apply limit
  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit)
  }

  return filtered
}

/**
 * Get a single order by ID or order number
 */
export async function getOrder(identifier: string): Promise<Order | null> {
  const data = await readOrders()
  const order = data.orders.find(
    o => o.id === identifier || o.orderNumber === identifier
  )
  return order || null
}

/**
 * Update order status (atomic operation with lock)
 */
export async function updateOrderStatus(
  identifier: string,
  newStatus: OrderStatus
): Promise<Order> {
  return withLock(async () => {
    const data = await readOrders()

    const orderIndex = data.orders.findIndex(
      o => o.id === identifier || o.orderNumber === identifier
    )

    if (orderIndex === -1) {
      throw new Error(`Order not found: ${identifier}`)
    }

    const order = data.orders[orderIndex]

    // Update status, timestamp, and set manual override flag
    order.status = newStatus
    order.updatedAt = new Date().toISOString()
    order.manualOverride = true

    await writeOrders(data)

    // Emit Pusher event
    await emitOrderEvent('order:updated', order)

    return order
  })
}

/**
 * Delete old completed orders (atomic operation with lock)
 */
export async function cleanupOldOrders(daysOld: number = 7): Promise<number> {
  return withLock(async () => {
    const data = await readOrders()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const initialCount = data.orders.length
    data.orders = data.orders.filter(order => {
      if (order.status === OrderStatusEnum.DELIVERED) {
        const updatedAt = new Date(order.updatedAt)
        return updatedAt > cutoffDate
      }
      return true
    })

    const removed = initialCount - data.orders.length

    if (removed > 0) {
      await writeOrders(data)
    }

    return removed
  })
}

/**
 * Get all active orders grouped by status
 */
export async function getOrdersByStatus(): Promise<Record<OrderStatus, Order[]>> {
  const orders = await getOrders({ includeCompleted: true })

  const grouped: Record<OrderStatus, Order[]> = {
    [OrderStatusEnum.PREPARING]: [],
    [OrderStatusEnum.BAKING]: [],
    [OrderStatusEnum.OUT_FOR_DELIVERY]: [],
    [OrderStatusEnum.DELIVERED]: []
  }

  orders.forEach(order => {
    grouped[order.status].push(order)
  })

  return grouped
}

/**
 * Auto-update order statuses based on time elapsed (atomic operation with lock)
 */
export async function autoUpdateOrderStatuses(): Promise<number> {
  return withLock(async () => {
    const data = await readOrders()
    let updatedCount = 0
    const now = new Date()

    for (const order of data.orders) {
    // Skip orders that are already delivered
    if (order.status === OrderStatusEnum.DELIVERED) {
      continue
    }

    // Skip orders with manual override
    if (order.manualOverride) {
      continue
    }

    // Calculate minutes elapsed since order creation
    const createdAt = new Date(order.createdAt)
    const minutesElapsed = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60)

    let newStatus: OrderStatus | null = null

    // Determine new status based on time elapsed
    // Preparing (0-5 mins) → Baking (5-10 mins) → Out for Delivery (10-20 mins) → Delivered (20+ mins)
    if (minutesElapsed >= 20) {
      newStatus = OrderStatusEnum.DELIVERED
    } else if (minutesElapsed >= 10 && order.status !== OrderStatusEnum.OUT_FOR_DELIVERY && order.status !== OrderStatusEnum.DELIVERED) {
      newStatus = OrderStatusEnum.OUT_FOR_DELIVERY
    } else if (minutesElapsed >= 5 && order.status === OrderStatusEnum.PREPARING) {
      newStatus = OrderStatusEnum.BAKING
    }

    // Update status if changed
    if (newStatus && newStatus !== order.status) {
      order.status = newStatus
      order.updatedAt = now.toISOString()
      updatedCount++
    }
  }

    // Save changes if any orders were updated
    if (updatedCount > 0) {
      await writeOrders(data)

      // Emit Pusher event for refresh
      await emitOrderEvent('orders:refresh', data.orders)
    }

    return updatedCount
  })
}
