'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-transparent">
          Algo salió mal
        </h1>
        <p className="text-muted-foreground mb-6">
          Ocurrió un error inesperado al cargar esta sección.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg font-bold shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
