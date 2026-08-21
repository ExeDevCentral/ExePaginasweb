import type { Metadata } from 'next'
import TermsOfService from '@/views/TermsOfService'

export const metadata: Metadata = {
  title: 'Términos y Condiciones del Servicio',
  description:
    'Términos y condiciones legales de uso de los servicios y sistemas de ExePaginasWeb.',
}

export default function TerminosPage() {
  return <TermsOfService />
}
