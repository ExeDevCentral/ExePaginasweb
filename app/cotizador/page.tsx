import type { Metadata } from 'next'
import QuoteBuilder from '@/components/QuoteBuilder/QuoteBuilder'

export const metadata: Metadata = {
  title: 'Cotizador Online Interactivo de Software y Webs',
  description:
    'Cotizá tu proyecto web o sistema SaaS a medida en minutos. Seleccioná funcionalidades y recibí un presupuesto estimado al instante.',
}

export default function CotizadorPage() {
  return <QuoteBuilder />
}
