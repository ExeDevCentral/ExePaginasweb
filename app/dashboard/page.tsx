import type { Metadata } from 'next'
import Dashboard from '@/views/Dashboard'
import { AuthGuard } from '@/core/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Panel de Control | ExeSistemasWEB',
  description:
    'Panel de gestión para clientes y administración de servicios web, tickets de soporte, métricas y facturación.',
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
