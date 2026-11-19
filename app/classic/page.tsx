/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * App Router entry for Classic Face (`/classic`).
 */
import type { Metadata } from 'next'
import ClassicFaceView from '@/faces/classic/ClassicFaceView'

export const metadata: Metadata = {
  title: 'Versión Classic | Exe Páginas Web',
  description:
    'Experiencia interactiva completa de ExePaginasWeb: portafolio, cotizador, demos y tienda.',
  alternates: {
    canonical: '/classic',
  },
}

export default function ClassicPage() {
  return <ClassicFaceView />
}
