import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  clearScreen: false,
  plugins: [solid(), tailwindcss()],
  server: {
    proxy: {
      '/api/auth': 'http://localhost:3000',
    },
  },
})
