'use client'

import React, { useState } from 'react'
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
