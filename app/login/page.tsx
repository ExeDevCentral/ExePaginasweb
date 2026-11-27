/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { Metadata } from 'next'
import Login from '@/views/Login'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Panel de Clientes y Administración',
  description:
    'Accedé al panel de control de ExeSistemasWEB para gestionar tus servicios, tickets de soporte y facturación.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <Login />
}
