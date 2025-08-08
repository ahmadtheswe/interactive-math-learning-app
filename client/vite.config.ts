import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react', 'react-dom', 'react-router-dom']
  },
  define: {
    // Add polyfill for the global object that Draft.js needs
    global: 'window',
  }
})
