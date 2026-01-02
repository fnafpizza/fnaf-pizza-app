export interface OrderItem {
  id: number
  name: string
  description: string
  emoji: string
  quantity: number
  price: string
}

export enum OrderStatus {
  PREPARING = 'preparing',
  BAKING = 'baking',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered'
}

export interface Order {
  id: string                    // Stripe session ID
  orderNumber: string           // Human-friendly: "ORD-001"
  items: OrderItem[]            // Pizza items from cart
  total: number                 // Total in dollars
  status: OrderStatus           // Current status
  createdAt: string             // ISO timestamp
  updatedAt: string             // ISO timestamp
  estimatedReady: string        // ISO timestamp (30-45 min from creation)
  manualOverride?: boolean      // If true, skip auto-status updates
}

export interface OrdersData {
  orders: Order[]
  lastUpdated: string
  nextOrderNumber: number
}
