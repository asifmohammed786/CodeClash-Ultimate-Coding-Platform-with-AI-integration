import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change the port below (5000) if your backend runs on a different port!
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000', // <-- Replace 5000 with your backend port if needed
    },
  },
})
