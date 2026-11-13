/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { isTrackingDisabled } from '@/core/analytics/trackEvent'
import { posthogClient, posthogEnabled } from './client'

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!posthogEnabled || !pathname || isTrackingDisabled()) return

    const search = searchParams.toString()
    const url = search ? `${window.origin}${pathname}?${search}` : `${window.origin}${pathname}`

    posthogClient.capture('$pageview', {
      $current_url: url,
      pathname,
      search,
    })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { readonly children: React.ReactNode }) {
  if (!posthogEnabled) return <>{children}</>

  return (
    <PostHogProviderBase client={posthogClient}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PostHogProviderBase>
  )
}
