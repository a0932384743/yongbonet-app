// https://nuxt.com/docs/api/configuration/nuxt-config

console.log(process.env.API_BASE_URL)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify']
  },
  typescript: {
    shim: false
  },
  axios: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000'
  },
  vite: {
    resolve: {
      alias: {
        '@': '/<rootDir>',
        '@components': '/<rootDir>/components',
        '@assets': '/<rootDir>/assets',
        '@plugins': '/<rootDir>/plugins'
      }
    }
  }
})
