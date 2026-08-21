import type { Metadata } from 'next'
import PrivacyPolicy from '@/views/PrivacyPolicy'

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos',
  description:
    'Información sobre privacidad, seguridad y tratamiento de datos personales en ExePaginasWeb.',
}

export default function PrivacidadPage() {
  return <PrivacyPolicy />
}
