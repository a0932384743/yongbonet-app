// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'url';
import dotenv from 'dotenv';
dotenv.config();

export default defineNuxtConfig({
  compatibilityDate: '2025-03-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    apiUrl: process.env.API_BASE_URL,
    public: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }
  },
  typescript: {
    shim: false
  },
  axios: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000'
  },
  alias: {
    '@plugins': fileURLToPath(new URL('.', import.meta.url)),
    '@components': fileURLToPath(new URL('./components', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    '@plugins': fileURLToPath(new URL('./plugins', import.meta.url)),
    '@composables':  fileURLToPath(new URL('./composables', import.meta.url)),
  },
  vite: {
    resolve: {
      alias: {
        '@plugins': fileURLToPath(new URL('.', import.meta.url)),
        '@components': fileURLToPath(new URL('./components', import.meta.url)),
        '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
        '@plugins': fileURLToPath(new URL('./plugins', import.meta.url)),
        '@composables':  fileURLToPath(new URL('./composables', import.meta.url)),
      }
    }
  }
})
