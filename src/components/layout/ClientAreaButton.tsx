/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import HudButton from '@/components/HudButton'

interface ClientAreaButtonProps {
  onClick: () => void
  label: string
  variant?: 'desktop' | 'mobile'
}

export default function ClientAreaButton({
  onClick,
  label,
  variant = 'desktop',
}: Readonly<ClientAreaButtonProps>) {
  return (
    <HudButton
      onClick={onClick}
      variant="primary"
      size="sm"
      label={label}
      icon={<ChevronRight size={14} />}
      iconPosition="right"
      className={variant === 'mobile' ? 'w-full justify-center' : ''}
    />
  )
}
