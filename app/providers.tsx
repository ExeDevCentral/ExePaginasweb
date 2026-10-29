/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { AuthSessionProvider } from '@/core/auth/AuthSessionProvider'
import { ThemeProvider } from '@/core/theme/ThemeContext'
import { PostHogProvider } from '@/lib/posthog/PostHogProvider'
import dynamic from 'next/dynamic'
import ThemedToaster from '@/components/shared/ThemedToaster'
import '@/core/i18n/config'

const PremiumBackground = dynamic(() => import('@/components/Effects/PremiumBackground'), {
  ssr: false,
})

const ScrollProvider = dynamic(() => import('@/components/shared/ScrollProvider'), {
  ssr: false,
})

const MouseSpotlight = dynamic(() => import('@/components/shared/MouseSpotlight'), {
  ssr: false,
})

const LaserScrollBeam = dynamic(() => import('@/components/layout/LaserScrollBeam'), {
  ssr: false,
})

const AnimatedFavicon = dynamic(() => import('@/components/layout/AnimatedFavicon'), { ssr: false })

const CommandPalette = dynamic(() => import('@/components/layout/CommandPalette'), {
  ssr: false,
})

export default function Providers({ children }: { readonly children: React.ReactNode }) {
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
  const enableVercelTelemetry = process.env.NEXT_PUBLIC_ENABLE_VERCEL_TELEMETRY === 'true'
  const enableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS !== 'false' &&
    (process.env.NODE_ENV === 'production' || enableVercelTelemetry)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <ThemeProvider>
          <PostHogProvider>
            <ScrollProvider>
              <LaserScrollBeam />
              <AnimatedFavicon />
              <PremiumBackground />
              <MouseSpotlight />
              <ThemedToaster />
              <CommandPalette />
              {children}
            </ScrollProvider>
          </PostHogProvider>
        </ThemeProvider>
      </AuthSessionProvider>
      {enableVercelTelemetry && <SpeedInsights />}
      {enableVercelAnalytics && (
        <Analytics
          beforeSend={(event) => {
            if (typeof window !== 'undefined') {
              try {
                const search = window.location.search
                if (search.includes('admin=true') || search.includes('va-disable=1')) {
                  localStorage.setItem('va-disable', '1')
                  return null
                }
                const vaDisable = localStorage.getItem('va-disable')
                if (vaDisable === '1' || vaDisable === 'true') {
                  return null
                }
              } catch {
                // Silencioso ante restricciones de cookies/storage
              }
            }
            return event
          }}
        />
      )}
    </QueryClientProvider>
  )
}
