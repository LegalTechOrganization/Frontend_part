import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
