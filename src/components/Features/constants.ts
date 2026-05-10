import { LayoutDashboard, BellRing, BarChart3, UsersRound } from 'lucide-react'

/**
 * Tipo para las propiedades de una feature card
 */
export interface FeatureData {
  icon: typeof LayoutDashboard
  title: string
  description: string
  color: string
}

/**
 * Lista de features del sistema
 */
export const FEATURES_LIST: FeatureData[] = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard claro',
    description: 'Resumen de ventas, leads y tareas con widgets visuales que cualquier cliente entiende al instante.',
    color: 'from-accent-yellow to-accent-cyan',
  },
  {
    icon: BellRing,
    title: 'Notificaciones smart',
    description: 'Alertas en tiempo real para formularios, pagos y eventos clave de tu web para no perder oportunidades.',
    color: 'from-accent-cyan to-accent-magenta',
  },
  {
    icon: BarChart3,
    title: 'Analitica accionable',
    description: 'Graficas simples con conversion, clics y rendimiento para tomar decisiones sin tecnicismos.',
    color: 'from-accent-magenta to-accent-yellow',
  },
  {
    icon: UsersRound,
    title: 'Equipo conectado',
    description: 'Roles por usuario y seguimiento de tareas para marketing, ventas y soporte en una sola app web.',
    color: 'from-accent-cyan to-accent-magenta',
  },
] as const

/**
 * Datos de estadísticas para el dashboard demo
 */
export const DASHBOARD_STATS = [
  { label: 'Consultas hoy', value: '42', color: 'text-accent-cyan', trend: '+12%' },
  { label: 'Nuevos Clientes', value: '12', color: 'text-white', trend: '+5' },
  { label: 'Crecimiento', value: '24%', color: 'text-accent-magenta', trend: 'In crescendo' },
] as const

/**
 * Configuración de spring para animaciones 3D
 */
export const SPRING_CONFIG = {
  damping: 25,
  stiffness: 200,
} as const