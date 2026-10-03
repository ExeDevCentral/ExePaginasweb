/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * SiteHeader: Renderiza la nueva barra Dynamic Island de vidrio líquido (LiquidIslandNavbar)
 * garantizando compatibilidad total en todas las rutas del sitio.
 */
'use client'

import React from 'react'
import LiquidIslandNavbar from './LiquidIsland/LiquidIslandNavbar'

export interface SiteHeaderProps {
  expandOnScrollUp?: boolean
}

export default function SiteHeader({ expandOnScrollUp = false }: SiteHeaderProps) {
  return <LiquidIslandNavbar expandOnScrollUp={expandOnScrollUp} />
}
