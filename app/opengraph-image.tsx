/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/og/OgCard'

export const alt = 'ExePaginasWeb - Estudio de Desarrollo Web & Sistemas SaaS'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    <OgCard
      eyebrow="Estudio de Desarrollo Web"
      title="Sistemas SaaS y páginas web a medida"
      description="Creamos páginas web, tiendas online y sistemas de software SaaS a medida con código propio de alto rendimiento."
      tags={['SaaS', 'E-Commerce', 'Turnos & Reservas', 'Landings', 'Código Propio']}
    />,
    size
  )
}
