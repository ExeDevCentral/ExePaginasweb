/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MaterialIcon: Componente de íconos Google Material Symbols Variable.
 * Admite pesos tipográficos ópticos (wght), estados de relleno continuos (FILL 0..1),
 * grado (GRAD) y tamaño óptico (opsz) con transición ultra-suave.
 */
import React from 'react'

export interface MaterialIconProps {
  name: string
  filled?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: 20 | 24 | 40 | 48
  size?: number
  className?: string
  style?: React.CSSProperties
  'aria-label'?: string
}

export default function MaterialIcon({
  name,
  filled = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  size,
  className = '',
  style = {},
  'aria-label': ariaLabel,
}: Readonly<MaterialIconProps>) {
  const fontVariationSettings = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`

  const mergedStyle: React.CSSProperties = {
    fontVariationSettings,
    fontSize: size ? `${size}px` : undefined,
    width: size ? `${size}px` : undefined,
    height: size ? `${size}px` : undefined,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    userSelect: 'none',
    transition: 'font-variation-settings 0.2s ease, transform 0.2s ease, color 0.2s ease',
    ...style,
  }

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={mergedStyle}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  )
}
