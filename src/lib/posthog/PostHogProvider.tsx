/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { posthogClient, posthogEnabled } from './client'

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!posthogEnabled) return
    posthogClient.capture('$pageview', {
      pathname,
      search: searchParams.toString(),
    })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!posthogEnabled) return <>{children}</>

  return (
    <PostHogProviderBase client={posthogClient}>
      <PageViewTracker />
      {children}
    </PostHogProviderBase>
  )
}
