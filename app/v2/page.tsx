/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * App Router entry for V2 Face (`/v2`) — AWS Cloud Utility Web.
 */
import type { Metadata } from 'next'
import V2CloudUtilityApp from '@/faces/v2/V2CloudUtilityApp'

export const metadata: Metadata = {
  title: 'Cloud Utility & Servicios Directos (V2) | Exe Páginas Web',
  description:
    'Diagnóstico en vivo de infraestructura web y catálogo directo de servicios de ExePaginasWeb al estilo AWS Utility.',
  alternates: {
    canonical: '/v2',
  },
}

export default function V2Page() {
  return <V2CloudUtilityApp />
}
