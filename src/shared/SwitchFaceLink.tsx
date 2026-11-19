/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Shared link to switch between Classic and V2 faces via `/?choose=1`.
 */
'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import type { SiteFace } from './face-preference'

interface SwitchFaceLinkProps {
  currentFace: SiteFace
  className?: string
}

export function SwitchFaceLink({ currentFace, className }: SwitchFaceLinkProps) {
  const isV2 = currentFace === 'v2'
  const baseClass = isV2
    ? 'inline-flex items-center gap-1.5 rounded-md border border-[#e7e7e7] bg-white px-3 py-1.5 text-xs font-semibold text-[#243040] transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]'
    : 'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur transition-colors hover:border-emerald-400/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400'

  return (
    <Link
      href="/?choose=1"
      className={className ? `${baseClass} ${className}` : baseClass}
      aria-label="Cambiar versión del sitio (Classic o V2 Cloud Utility)"
    >
      <Layers className="h-3.5 w-3.5" aria-hidden="true" />
      <span>Cambiar versión</span>
    </Link>
  )
}
