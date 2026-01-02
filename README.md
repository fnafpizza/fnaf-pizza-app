# 🍕 FNAF Pizza App

A Five Nights at Freddy's themed pizza ordering application built with Nuxt 3, featuring real-time order tracking, admin management, and Stripe payment integration.

## 🎮 Features

### Customer Features
- **FNAF-Themed UI**: Security camera aesthetic with VHS effects, scan lines, and glitchy animations
- **Pizza Menu**: Browse 6 unique pizzas with detailed ingredient modals
  - Freddy's Favorite (Pepperoni & Cheese)
  - Bonnie's Blast (Veggie Supreme)
  - Chica's Choice (BBQ Chicken)
  - Foxy's Fire (Spicy Jalapeño)
  - Golden Special (Four Cheese)
  - Night Shift (Meat Lovers)
- **Interactive Pizza Modals**: Click any pizza to view FNAF-themed ingredient details with camera feed effects
- **Shopping Cart**: Floating cart button with badge counter and slide-out panel
- **Real-time Order Tracking**: Live updates via WebSocket with camera-style order boards
- **Stripe Checkout**: Secure payment processing with test mode
- **Order Status Updates**: Track orders through Preparing → Baking → Out for Delivery → Delivered
- **Responsive Design**: Fully responsive with mobile touch support

### Admin Features
- **Admin Login**: Password-protected admin panel with creepy animatronic eyes effect
  - Glitchy "I SEE YOU" text when password revealed
  - VHS security camera aesthetic
  - Demo password display for testing
- **Kanban Board**: Drag-and-drop order management with security camera theme
  - 4 status columns (CAM-01 through CAM-04)
  - Real-time WebSocket updates
  - Glitch effects and red alert animations
- **Order Table View**: Alternative table layout (deprecated in favor of kanban)
- **Order Management**:
  - Update order status via drag-and-drop or dropdown
  - Delete orders with confirmation modal
  - Cleanup old delivered orders
- **Statistics Dashboard**: View total orders, preparing, baking, and out for delivery counts
- **Admin Navigation**: Door emoji button for quick access to admin login

### UI/UX Enhancements
- **Scroll Snap**: Smooth section snapping on homepage (disabled when modals open)
- **VHS Effects**: Timestamps, camera labels, static overlay, grain effects
- **Custom 404 Page**: FNAF-themed error page with animatronic eyes and camera glitches
- **Floating Buttons**:
  - Admin login (🚪) - bottom left
  - Cart (🛒) - middle right
  - Orders (📋) - far right
  - Home (🏠) - context-specific
- **Animations**:
  - Flicker and glow effects
  - Camera shake and glitch transitions
  - Pulse animations for active elements
  - Hover effects with red borders and shadows
- **Modal System**:
  - Pizza details modal with sticky close button
  - Checkout modal with test card instructions
  - Delete confirmation modals
  - Background scroll prevention when modals open

### Technical Features
- **Real-time Updates**: Socket.IO for instant order synchronization
- **Polling Fallback**: 5-second polling when WebSocket unavailable
- **Persistent Storage**: File-based order storage with JSON
- **Order Cleanup**: Automatic cleanup of old delivered orders
- **SEO Optimized**: Meta tags, sitemap.xml, robots.txt
- **TypeScript**: Full type safety across the application
- **Pinia State Management**: Cart and application state
- **Composables**: Reusable logic for orders, WebSocket, and drag-and-drop
- **Middleware**: Admin authentication protection
- **API Routes**: RESTful endpoints for orders, auth, and webhooks
- **Payment Integration**: Stripe Checkout with webhook support

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI**: Vue 3 + Tailwind CSS
- **State Management**: Pinia
- **Real-time**: Socket.IO
- **Payments**: Stripe
- **Drag & Drop**: @vueuse/core
- **Animations**: Custom CSS keyframes with FNAF theme
- **TypeScript**: Full type safety
- **Styling**: Tailwind CSS + Custom CSS animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fnafpizza/fnaf-pizza-app.git
   cd fnaf-pizza-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Stripe Keys (get from https://stripe.com/docs/keys)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Admin Password
   ADMIN_PASSWORD=freddyfazbear

   # Base URL (for production)
   NUXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

## 🎯 Usage

### Customer Flow
1. Browse pizzas on the homepage
2. Click any pizza to view detailed ingredients
3. Add pizzas to cart
4. Checkout with Stripe (use test card: `4242 4242 4242 4242`)
5. Track your order in real-time on the `/orders` page

### Admin Flow
1. Click the door emoji (🚪) button in the bottom left
2. Log in with password (default: `freddyfazbear`)
3. Manage orders via drag-and-drop kanban board
4. Update order statuses, delete orders, or cleanup old orders
5. View real-time statistics

## 🔑 Test Credentials

### Stripe Test Card
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### Admin Login
- **Password**: `freddyfazbear` (or check the demo password on login page)

## 📁 Project Structure

```
pizza-app/
├── assets/css/           # Global styles and animations
├── components/           # Vue components
│   ├── admin/           # Admin-specific components
│   ├── CartPanel.vue
│   ├── PizzaModal.vue
│   └── ...
├── composables/         # Reusable composition functions
├── middleware/          # Route middleware (admin auth)
├── pages/               # File-based routing
│   ├── admin/          # Admin pages
│   ├── index.vue       # Homepage
│   └── orders.vue      # Order tracking
├── public/             # Static assets
├── server/             # Backend API
│   ├── api/           # API endpoints
│   ├── data/          # Order storage
│   ├── plugins/       # Socket.IO plugin
│   └── utils/         # Server utilities
├── stores/            # Pinia stores
└── nuxt.config.ts     # Nuxt configuration
```

## 🎨 Theme & Design

The entire application is themed around Five Nights at Freddy's with:
- Security camera VHS aesthetic
- Dark red (#8b0000) and gold (#d4af37) color scheme
- Glitch effects and animations
- Scan lines and grain overlays
- Flickering text and camera shake
- Creepy animatronic references

## 🤝 Credits

**Developed by**: [fnafpizza](https://github.com/fnafpizza)

**Co-Authored by**: [Claude Sonnet 4.5](https://claude.ai) - AI pair programming assistant

## 📝 License

This project is a demo/simulator application built for educational purposes.

## 🚀 Deployment

For production deployment:

1. Set up environment variables on your hosting platform
2. Update `NUXT_PUBLIC_BASE_URL` to your production URL
3. Configure Stripe webhook endpoint
4. Build the application:
   ```bash
   npm run build
   ```
5. Deploy the `.output` directory to your hosting provider

---

**🤖 Built with [Claude Code](https://claude.com/claude-code)**

*"It's me."* - Golden Freddy
