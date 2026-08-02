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
import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

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
import QuoteBuilder from './components/QuoteBuilder/QuoteBuilder'
import Dashboard from './pages/Dashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import NotFound from './pages/NotFound'
import AuthCallback from './pages/AuthCallback'
import ThemedToaster from './components/shared/ThemedToaster'
import { AuthGuard } from './core/auth/AuthGuard'
import { useEffect } from 'react'
import { resetScrollToTop } from './components/shared/ScrollProvider'
import './index.css'

const pageTransition = {
  initial: { opacity: 0.7, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0.7, y: -4 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    resetScrollToTop()
  }, [pathname])
  return null
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
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
            path="/cotizador"
            element={
              <AnimatedPage>
                <QuoteBuilder />
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
    </>
  )
}

const AppRoot = (
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  SENTRY_DSN ? (
    <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>{AppRoot}</Sentry.ErrorBoundary>
  ) : (
    AppRoot
  )
)

function SentryErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-muted-foreground mb-6">
          Ocurrió un error inesperado. Ya lo estamos revisando.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold"
        >
          Recargar página
        </button>
      </div>
    </div>
  )
}
