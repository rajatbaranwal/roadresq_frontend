import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all Socket.IO requests to backend
      '/socket.io': {
        target: 'http://127.0.0.1:5050',
        ws: true,            // enable websockets
        changeOrigin: true,  // avoid host header issues
      },
      // Proxy your API routes to backend
      '/api': {
        target: 'http://127.0.0.1:5050',
        changeOrigin: true,
      },
    },
  },
})
