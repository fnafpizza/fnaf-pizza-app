import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  description: string
  price: string
  emoji: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    isCheckoutModalOpen: false,
    checkoutLoading: false,
    checkoutError: null as string | null
  }),

  getters: {
    cartItemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    },

    cartSubtotal: (state) => {
      const total = state.items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity)
      }, 0)
      return total.toFixed(2)
    },

    cartTotal(): string {
      return this.cartSubtotal
    },

    hasItems: (state) => state.items.length > 0
  },

  actions: {
    addToCart(pizza: Omit<CartItem, 'quantity'>) {
      const existingItem = this.items.find(item => item.id === pizza.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...pizza, quantity: 1 })
      }

      this.saveToLocalStorage()
    },

    removeFromCart(id: number) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },

    incrementQuantity(id: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.quantity++
        this.saveToLocalStorage()
      }
    },

    decrementQuantity(id: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          this.removeFromCart(id)
          return
        }
        this.saveToLocalStorage()
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    saveToLocalStorage() {
      if (process.client) {
        try {
          localStorage.setItem('fnaf-pizza-cart', JSON.stringify(this.items))
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error)
        }
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        try {
          const saved = localStorage.getItem('fnaf-pizza-cart')
          if (saved) {
            this.items = JSON.parse(saved)
          }
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error)
          this.items = []
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    // Checkout modal actions
    openCheckoutModal() {
      this.isCheckoutModalOpen = true
    },

    closeCheckoutModal() {
      this.isCheckoutModalOpen = false
      this.checkoutError = null
    },

    setCheckoutLoading(loading: boolean) {
      this.checkoutLoading = loading
    },

    setCheckoutError(error: string | null) {
      this.checkoutError = error
    },

    // Order backup for success page
    backupOrderToLocalStorage() {
      if (process.client) {
        try {
          const orderBackup = {
            items: this.items,
            total: this.cartTotal,
            timestamp: new Date().toISOString()
          }
          localStorage.setItem('fnaf-pizza-last-order', JSON.stringify(orderBackup))
        } catch (error) {
          console.error('Failed to backup order to localStorage:', error)
        }
      }
    },

    getLastOrder() {
      if (process.client) {
        try {
          const saved = localStorage.getItem('fnaf-pizza-last-order')
          if (saved) {
            return JSON.parse(saved)
          }
        } catch (error) {
          console.error('Failed to load last order from localStorage:', error)
        }
      }
      return null
    },

    clearLastOrder() {
      if (process.client) {
        try {
          localStorage.removeItem('fnaf-pizza-last-order')
        } catch (error) {
          console.error('Failed to clear last order from localStorage:', error)
        }
      }
    }
  }
})
