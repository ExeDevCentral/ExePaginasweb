/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { AuthSessionProvider } from '@/core/auth/AuthSessionProvider'
import { ThemeProvider } from '@/core/theme/ThemeContext'
import { PostHogProvider } from '@/lib/posthog/PostHogProvider'
import dynamic from 'next/dynamic'
import ThemedToaster from '@/components/shared/ThemedToaster'
import i18n, { syncHtmlLangAttributes } from '@/core/i18n/config'

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
  const isVercelDeployment = process.env.NEXT_PUBLIC_IS_VERCEL === '1'
  const enableVercelTelemetry =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_TELEMETRY !== 'false' &&
    (process.env.NEXT_PUBLIC_ENABLE_VERCEL_TELEMETRY === 'true' || isVercelDeployment)
  const enableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS !== 'false' &&
    (process.env.NODE_ENV === 'production' || enableVercelTelemetry)

  const shouldFilterVercelTelemetry = (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const search = window.location.search
      if (search.includes('admin=true') || search.includes('va-disable=1')) {
        localStorage.setItem('va-disable', '1')
        return true
      }
      const vaDisable = localStorage.getItem('va-disable')
      return vaDisable === '1' || vaDisable === 'true'
    } catch {
      return false
    }
  }

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lang')
      if (savedLang && savedLang !== i18n.language) {
        void i18n.changeLanguage(savedLang)
      } else {
        syncHtmlLangAttributes(i18n.language)
      }
    } catch {
      // safe fallback
    }
  }, [])

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
      {enableVercelTelemetry && (
        <SpeedInsights beforeSend={(event) => (shouldFilterVercelTelemetry() ? null : event)} />
      )}
      {enableVercelAnalytics && (
        <Analytics beforeSend={(event) => (shouldFilterVercelTelemetry() ? null : event)} />
      )}
    </QueryClientProvider>
  )
}
