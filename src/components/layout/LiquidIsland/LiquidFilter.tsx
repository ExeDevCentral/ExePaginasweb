/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * LiquidFilter: Filtro SVG feTurbulence + feDisplacementMap para refracción de vidrio líquido.
 */
'use client'

import React from 'react'

export default function LiquidFilter() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed -top-full -left-full w-0 h-0 opacity-0 overflow-hidden"
    >
      <defs>
        <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.05"
            numOctaves={2}
            result="liquidNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="liquidNoise"
            scale={4}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
