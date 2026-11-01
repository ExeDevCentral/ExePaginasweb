/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { Metadata } from 'next'
import LinuxPage from '@/components/linux/LinuxPage'

export const metadata: Metadata = {
  title: 'Servicios Linux Empresariales | Terminales POS, Migración de PCs y Servidores Locales',
  description:
    'Aprovisionamiento de terminales Linux POS en modo quiosco (arranque en 4.5s), rescate de flotas de PCs lentas con $0 en licencias y nodos servidores locales PostgreSQL Offline-First.',
  alternates: { canonical: '/linux' },
}

export default function LinuxRoutePage() {
  return <LinuxPage />
}
