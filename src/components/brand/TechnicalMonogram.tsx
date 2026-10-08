/**
 * © 2025–2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Monograma Técnico "E" vectorial ortogonal (Plano de Arquitecto).
 */
import React from 'react'

interface TechnicalMonogramProps {
  className?: string
  size?: number
  strokeWidth?: number
  showFrame?: boolean
}

export const TechnicalMonogram: React.FC<TechnicalMonogramProps> = ({
  className = '',
  size = 28,
  strokeWidth = 1.75,
  showFrame = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors duration-200 ${className}`}
      aria-label="Monograma Técnico ExePaginasWeb"
      role="img"
    >
      {showFrame && (
        <rect
          x="1"
          y="1"
          width="22"
          height="22"
          rx="2"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
          className="opacity-40"
        />
      )}
      {/* Trazo arquitectónico "E" ortogonal con marcas técnicas */}
      <path
        d="M6 5.5H18M6 5.5V18.5M6 12H15.5M6 18.5H18"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Puntos de cota en los extremos */}
      <circle cx="18" cy="5.5" r="1" fill="currentColor" className="opacity-80" />
      <circle cx="15.5" cy="12" r="1" fill="currentColor" className="opacity-80" />
      <circle cx="18" cy="18.5" r="1" fill="currentColor" className="opacity-80" />
    </svg>
  )
}

export default TechnicalMonogram
