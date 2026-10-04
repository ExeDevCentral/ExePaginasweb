/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { Metadata } from 'next'
import NotFoundClient from '@/components/NotFoundClient'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscás no existe o fue movida.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function NotFound() {
  return <NotFoundClient />
}
