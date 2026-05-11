import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
    }),
    sitemap({
      hostname: 'https://exepaginasweb.com',
      exclude: ['/404', '/500'],
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    // Separar CSS por chunk para reducir el CSS crítico inicial
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — siempre necesario
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core'
          }
          // Framer Motion — necesario para las animaciones del Hero
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          // three.js — SOLO se carga al hacer clic en Pixel Coffee
          // NO incluir en manualChunks para que sea un chunk verdaderamente dinámico
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three-3d'
          }
          // react-markdown y react-syntax-highlighter — solo en el BotWidget
          if (id.includes('react-markdown') || id.includes('react-syntax-highlighter') || id.includes('remark') || id.includes('rehype')) {
            return 'markdown'
          }
        }
      }
    }
  }
})
