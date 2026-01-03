// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-31',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  experimental: {
    useOxc: false
  },

  css: ['~/assets/css/animations.css'],

  // Disable dev error overlay to show custom error page
  vite: {
    clearScreen: false,
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  nitro: {
    // Disable default error handling in development
    devErrorHandler: undefined as any
  },

  app: {
    head: {
      title: "Freddy Fazbear's Pizza | Fresh Pizza Delivery",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "A Five Nights at Freddy's themed pizza ordering simulator. Order delicious pizza from Freddy Fazbear's Pizza and track your order in real-time with our live order board!"
        },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🍕</text></svg>"
        }
      ]
    }
  },

  runtimeConfig: {
    // Private keys (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    adminPassword: process.env.ADMIN_PASSWORD,

    // Public keys (exposed to client)
    public: {
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            'fnaf-dark': '#0d0d0d',
            'fnaf-purple': '#3d1f4d',
            'fnaf-red': '#8b0000',
            'fnaf-gold': '#d4af37',
          }
        }
      }
    }
  }
})
