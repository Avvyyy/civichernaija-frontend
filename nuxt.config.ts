import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  // modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/index.css'],

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:5000/api'
    }
  }
})