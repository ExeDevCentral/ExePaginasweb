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
      exclude: ['/404', '/500', '/stats', '/stats.html', '/dashboard', '/login', '/auth/callback'],
      dynamicRoutes: ['/tienda', '/privacidad', '/terminos'],
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
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
          // React core & Router
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'react-core'
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          // Three.js & React Three Fiber
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three-3d'
          }
          // Supabase & TanStack React Query
          if (id.includes('@supabase') || id.includes('@tanstack')) {
            return 'supabase-query'
          }
          // UI Icons & i18n
          if (id.includes('lucide-react') || id.includes('i18next')) {
            return 'ui-i18n'
          }
          // react-markdown
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
            return 'markdown'
          }
        },
      },
    },
  },
})
