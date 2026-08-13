import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { AuthSessionProvider } from './core/auth/AuthSessionProvider'
import { ThemeProvider } from './core/theme/ThemeContext'
import './core/i18n/config'
import * as Sentry from '@sentry/react'

import ThemedToaster from './components/shared/ThemedToaster'
import PremiumBackground from './components/Effects/PremiumBackground'
import AppRoutes from './routes/AppRoutes'
import './index.css'

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

function SentryErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-muted-foreground mb-6">
          Ocurrió un error inesperado. Ya lo estamos revisando.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold"
        >
          Recargar página
        </button>
      </div>
    </div>
  )
}

const AppRoot = (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>
          <ThemeProvider>
            <PremiumBackground />
            <BrowserRouter>
              <div style={{ position: 'relative', zIndex: 9999 }}>
                <ThemedToaster />
              </div>
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </AuthSessionProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
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
