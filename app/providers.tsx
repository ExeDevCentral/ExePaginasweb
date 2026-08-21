'use client'

import React, { useState } from 'react'

// Polyfill React internals for Three.js / React Three Fiber in Next.js Turbopack
if (typeof window !== 'undefined') {
  const R = React as any
  if (!R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
      R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {}
  }
  const secret = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  const client = R.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  if (secret) {
    if (!secret.ReactCurrentOwner) {
      secret.ReactCurrentOwner = client?.A || { current: null }
    }
    if (!secret.ReactCurrentBatchConfig) {
      secret.ReactCurrentBatchConfig = client?.T || { transition: null }
    }
    if (!secret.ReactCurrentDispatcher) {
      secret.ReactCurrentDispatcher = client?.H || { current: null }
    }
  }
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { AuthSessionProvider } from '@/core/auth/AuthSessionProvider'
import { ThemeProvider } from '@/core/theme/ThemeContext'
import ThemedToaster from '@/components/shared/ThemedToaster'
import PremiumBackground from '@/components/Effects/PremiumBackground'
import '@/core/i18n/config'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <ThemeProvider>
          <PremiumBackground />
          <ThemedToaster />
          {children}
        </ThemeProvider>
      </AuthSessionProvider>
      <SpeedInsights />
      <Analytics />
    </QueryClientProvider>
  )
}
