/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Root Gateway entry (`/`) — allows choosing between Classic (`/classic`) and V2 (`/v2`).
 * Respects localStorage `exe:face` client-side unless `?choose=1` is present.
 */
import { Suspense } from 'react'
import GatewayScreen from '@/shared/GatewayScreen'

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#090d16] text-sm text-slate-400">
          Cargando ExePaginasWeb...
        </div>
      }
    >
      <GatewayScreen />
    </Suspense>
  )
}
