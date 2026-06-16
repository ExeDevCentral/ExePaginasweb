import type { PlanTier } from './resolvePlanTier'

export type Metric = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'neutral' | 'down'
}

export type ActivityItem = {
  label: string
  time: string
  status: 'ok' | 'info' | 'warn'
}

export type PlanDashboardTheme = {
  tier: PlanTier
  title: string
  subtitle: string
  badge: string
  accent: string
  accentMuted: string
  border: string
  glow: string
  gradient: string
  chartBar: string
  metrics: Metric[]
  chartLabel: string
  chartValues: number[]
  activities: ActivityItem[]
  perks: string[]
  supportLabel: string
  supportDetail: string
}

export const PLAN_THEMES: Record<Exclude<PlanTier, 'none'>, PlanDashboardTheme> = {
  basico: {
    tier: 'basico',
    title: 'Centro de Operaciones',
    subtitle: 'Tu sitio siempre online, seguro y actualizado.',
    badge: 'Abono Básico',
    accent: 'text-cyan-600 dark:text-cyan-400',
    accentMuted: 'text-cyan-600/70 dark:text-cyan-400/70',
    border: 'border-cyan-500/25',
    glow: 'bg-cyan-500/10',
    gradient: 'from-cyan-500/20 via-blue-500/5 to-transparent',
    chartBar: 'from-cyan-500/30 to-cyan-400',
    metrics: [
      { label: 'Uptime del sitio', value: '99.9%', delta: '+ estable', trend: 'up' },
      { label: 'SSL activo', value: 'OK', delta: 'Renovación auto', trend: 'neutral' },
      { label: 'Tickets abiertos', value: '0', delta: 'Sin pendientes', trend: 'up' },
      { label: 'Próximo backup', value: '48h', delta: 'Programado', trend: 'neutral' },
    ],
    chartLabel: 'Visitas semanales',
    chartValues: [32, 45, 38, 52, 48, 61, 55],
    activities: [
      { label: 'Certificado SSL verificado', time: 'hace 1h', status: 'ok' },
      { label: 'Parche de seguridad aplicado', time: 'hace 6h', status: 'ok' },
      { label: 'Dominio en renovación automática', time: 'ayer', status: 'info' },
    ],
    perks: [
      'Hosting Vercel Edge',
      'SSL automático',
      'Soporte estándar',
      'Actualizaciones de seguridad',
    ],
    supportLabel: 'Soporte estándar',
    supportDetail: 'Respuesta en 24–48 h hábiles',
  },
  avanzado: {
    tier: 'avanzado',
    title: 'Panel Operativo',
    subtitle: 'Reservas, pagos y base de datos bajo control.',
    badge: 'Abono Avanzado',
    accent: 'text-purple-600 dark:text-purple-400',
    accentMuted: 'text-purple-600/80 dark:text-purple-300/80',
    border: 'border-purple-500/30',
    glow: 'bg-purple-500/10',
    gradient: 'from-purple-500/20 via-cyan-500/10 to-transparent',
    chartBar: 'from-purple-500/30 to-cyan-400',
    metrics: [
      { label: 'Reservas hoy', value: '24', delta: '+18% vs ayer', trend: 'up' },
      { label: 'Pagos procesados', value: '$128k', delta: 'Mes actual', trend: 'up' },
      { label: 'DB saludable', value: '100%', delta: 'Sin alertas', trend: 'up' },
      { label: 'Backups', value: 'Diario', delta: 'Último: 03:00', trend: 'neutral' },
    ],
    chartLabel: 'Reservas por día',
    chartValues: [40, 55, 48, 72, 65, 88, 76],
    activities: [
      { label: 'Reserva confirmada — Cancha 2', time: 'hace 4m', status: 'ok' },
      { label: 'Pago PayPal aprobado', time: 'hace 22m', status: 'ok' },
      { label: 'Backup automático completado', time: 'hace 3h', status: 'info' },
      { label: 'WhatsApp recordatorio enviado', time: 'hace 1h', status: 'info' },
    ],
    perks: ['Gestión de BD', 'Backups diarios', 'Monitoreo de pagos', 'Soporte prioritario 24/7'],
    supportLabel: 'Soporte prioritario',
    supportDetail: 'Canal directo · respuesta en menos de 4h',
  },
  premium: {
    tier: 'premium',
    title: 'Command Center',
    subtitle: 'Evolución continua con account manager y bolsa de horas.',
    badge: 'Abono Premium',
    accent: 'text-amber-700 dark:text-amber-300',
    accentMuted: 'text-amber-700/70 dark:text-amber-200/70',
    border: 'border-amber-400/35',
    glow: 'bg-amber-400/10',
    gradient: 'from-amber-500/25 via-pink-500/10 to-transparent',
    chartBar: 'from-amber-500/40 to-pink-500/80',
    metrics: [
      { label: 'Horas dev restantes', value: '1.5h', delta: 'De 2h/mes', trend: 'neutral' },
      { label: 'Eficiencia operativa', value: '96.8%', delta: '+3.2% mes', trend: 'up' },
      { label: 'Features en roadmap', value: '3', delta: 'En progreso', trend: 'up' },
      { label: 'Prioridad Edge', value: 'Máxima', delta: 'Activa', trend: 'up' },
    ],
    chartLabel: 'Impacto del negocio',
    chartValues: [55, 62, 58, 78, 85, 92, 98],
    activities: [
      { label: 'Consultoría estratégica agendada', time: 'mañana 10:00', status: 'info' },
      { label: 'Feature "Reportes PRO" en desarrollo', time: 'sprint actual', status: 'ok' },
      { label: 'Account Manager: revisión mensual', time: 'en 5 días', status: 'info' },
      { label: 'Deploy edge prioritario', time: 'hace 2h', status: 'ok' },
    ],
    perks: [
      'Account Manager',
      '2h dev/mes',
      'Edge prioritario',
      'Consultoría estratégica',
      'Roadmap dedicado',
    ],
    supportLabel: 'Account Manager',
    supportDetail: 'Línea directa · respuesta inmediata',
  },
}
