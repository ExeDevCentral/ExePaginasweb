import type { Metadata } from 'next'
import StorePage from '@/components/store/StorePage'

export const metadata: Metadata = {
  title: 'Tienda de Servicios y Abonos de Mantenimiento',
  description:
    'Contratá abonos de mantenimiento web, soporte técnico y horas de desarrollo para tu negocio en ExeSistemasWEB.',
}

export default function TiendaPage() {
  return <StorePage />
}
