import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Genera 'dist/stats.html' al compilar para optimizar el peso del bundle
    visualizer({
      open: false, // Cambia a true para que se abra automáticamente
      filename: 'dist/stats.html',
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
