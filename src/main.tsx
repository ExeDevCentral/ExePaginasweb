import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthSessionProvider } from './core/auth/AuthSessionProvider'
import { ThemeProvider } from './core/theme/ThemeContext'
import './core/i18n/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

import App from './App.tsx'
import StorePage from './components/store/StorePage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'
import AuthCallback from './pages/AuthCallback'
import ThemedToaster from './components/shared/ThemedToaster'
import { AuthGuard } from './core/auth/AuthGuard'
import './index.css'

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <App />
            </AnimatedPage>
          }
        />
        <Route
          path="/tienda"
          element={
            <AnimatedPage>
              <StorePage />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login />
            </AnimatedPage>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AnimatedPage>
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            </AnimatedPage>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <AnimatedPage>
              <AuthCallback />
            </AnimatedPage>
          }
        />
        <Route
          path="/privacidad"
          element={
            <AnimatedPage>
              <PrivacyPolicy />
            </AnimatedPage>
          }
        />
        <Route
          path="/terminos"
          element={
            <AnimatedPage>
              <TermsOfService />
            </AnimatedPage>
          }
        />
        <Route
          path="*"
          element={
            <AnimatedPage>
              <NotFound />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
          <ThemeProvider>
            <BrowserRouter>
              <div style={{ position: 'relative', zIndex: 9999 }}>
                <ThemedToaster />
              </div>
              <AnimatedRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </AuthSessionProvider>
      </QueryClientProvider>
      <SpeedInsights />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
)
