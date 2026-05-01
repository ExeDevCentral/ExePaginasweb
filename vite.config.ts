import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Genera 'dist/stats.html' al compilar para optimizar el peso del bundle
    visualizer({
      open: false,
      filename: 'dist/stats.html',
    }),
    // Sitemap automático para SEO
    sitemap({
      hostname: 'https://exesistemasweb.vercel.app',
      exclude: ['/404', '/500'],
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  // Optimizaciones para Vercel
  build: {
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  }
})
