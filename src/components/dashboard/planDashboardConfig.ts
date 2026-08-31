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
    title: 'Centro de Operaciones Web',
    subtitle: 'Tu sitio web corporativo siempre online, veloz y seguro.',
    badge: 'Abono Básico Web',
    accent: 'text-[#38BDF8]',
    accentMuted: 'text-[#38BDF8]/70',
    border: 'border-[#1E2638]',
    glow: 'bg-[#0284C7]/10',
    gradient: 'from-[#111622] to-[#151B28]',
    chartBar: 'from-[#4361EE] to-[#38BDF8]',
    metrics: [
      { label: 'Visitas del mes', value: '12.4K', delta: '+18.4% ↗', trend: 'up' },
      { label: 'Consultas recibidas', value: '48', delta: '+12.0% ↗', trend: 'up' },
      { label: 'Disponibilidad Uptime', value: '99.99%', delta: 'Óptimo ↗', trend: 'up' },
      { label: 'Tickets de soporte', value: '0', delta: 'Sin demoras ↗', trend: 'up' },
    ],
    chartLabel: 'Tráfico Web Semanal',
    chartValues: [35, 50, 42, 68, 55, 82, 70],
    activities: [
      { label: 'Certificado SSL TLS 1.3 renovado y activo', time: 'hace 1h', status: 'ok' },
      { label: 'Optimización de caché Edge CDN completada', time: 'hace 4h', status: 'ok' },
      { label: 'Formulario de contacto sincronizado con email', time: 'hace 1d', status: 'ok' },
      { label: 'Auditoría mensual SEO y velocidad 100/100', time: 'hace 2d', status: 'ok' },
    ],
    perks: [
      'Hosting de Alta Velocidad (Vercel Edge)',
      'Certificado SSL Automático',
      'Mantenimiento y Actualizaciones',
      'Soporte Técnico Estándar',
    ],
    supportLabel: 'Soporte Técnico Estándar',
    supportDetail: 'Respuesta en 24h hábiles · Vía Ticket y Mail',
  },
  avanzado: {
    tier: 'avanzado',
    title: 'Panel de Gestión y Turnos',
    subtitle: 'Gestión de reservas, base de datos de clientes y WhatsApp automatizado.',
    badge: 'Abono Avanzado (Turnos & App)',
    accent: 'text-[#818CF8]',
    accentMuted: 'text-[#818CF8]/80',
    border: 'border-[#1E2638]',
    glow: 'bg-[#4361EE]/10',
    gradient: 'from-[#111622] to-[#151B28]',
    chartBar: 'from-[#4361EE] to-[#818CF8]',
    metrics: [
      { label: 'Reservas del mes', value: '485', delta: '+24.8% ↗', trend: 'up' },
      { label: 'Clientes en base', value: '1,280', delta: '+15.3% ↗', trend: 'up' },
      { label: 'Tasa de ocupación', value: '94.2%', delta: '+6.1% ↗', trend: 'up' },
      { label: 'WhatsApp recordatorios', value: '1,420', delta: '100% OK ↗', trend: 'up' },
    ],
    chartLabel: 'Reservas y Citas por Día',
    chartValues: [45, 60, 52, 78, 68, 92, 80],
    activities: [
      {
        label: 'Turno confirmado — Sede Central (Cancha/Consultorio)',
        time: 'hace 4m',
        status: 'ok',
      },
      { label: 'Pago Mercado Pago / PayPal acreditado', time: 'hace 22m', status: 'ok' },
      { label: 'Recordatorio automático enviado por WhatsApp', time: 'hace 1h', status: 'info' },
      { label: 'Backup diario de Supabase Postgres realizado', time: 'hace 3h', status: 'ok' },
    ],
    perks: [
      'Sistema de Turnos & Reservas Online 24/7',
      'Bot de Recordatorios por WhatsApp',
      'Integración con Mercado Pago y PayPal',
      'Backups Diarios de Base de Datos',
      'Soporte Prioritario WhatsApp 24/7',
    ],
    supportLabel: 'Soporte Prioritario VIP',
    supportDetail: 'Canal directo por WhatsApp · Respuesta < 2h',
  },
  premium: {
    tier: 'premium',
    title: 'Command Center Empresarial',
    subtitle: 'E-Commerce, múltiples sucursales, desarrollo a medida y bolsa de horas.',
    badge: 'Abono Premium Custom',
    accent: 'text-[#F59E0B]',
    accentMuted: 'text-[#F59E0B]/80',
    border: 'border-[#1E2638]',
    glow: 'bg-[#F59E0B]/10',
    gradient: 'from-[#111622] to-[#151B28]',
    chartBar: 'from-[#4361EE] to-[#F59E0B]',
    metrics: [
      { label: 'Facturación del mes', value: '$1.48M', delta: '+32.4% ↗', trend: 'up' },
      { label: 'Órdenes procesadas', value: '842', delta: '+21.0% ↗', trend: 'up' },
      { label: 'Conversión Checkout', value: '3.9%', delta: '+0.8% ↗', trend: 'up' },
      { label: 'SLA de Respuesta', value: '< 30 min', delta: 'VIP 24/7 ↗', trend: 'up' },
    ],
    chartLabel: 'Ventas y Conversión Semanal',
    chartValues: [55, 65, 60, 85, 90, 95, 100],
    activities: [
      { label: 'Orden #1842 cobrada y despachada con éxito', time: 'hace 8m', status: 'ok' },
      {
        label: 'Reunión de consultoría estratégica y mejoras agendada',
        time: 'mañana 10:00',
        status: 'info',
      },
      { label: 'Nueva funcionalidad desplegada en Vercel Edge', time: 'hace 2h', status: 'ok' },
      { label: 'Monitoreo de alta concurrencia: 0 caídas', time: 'hace 5h', status: 'ok' },
    ],
    perks: [
      'Account Manager Dedicado',
      'Bolsa mensual de 4h de desarrollo a medida',
      'SLA de respuesta garantizado < 30 minutos',
      'Infraestructura multi-región de alta escala',
      'Auditoría y optimización trimestral de conversiones',
    ],
    supportLabel: 'Account Manager VIP Dedicado',
    supportDetail: 'Línea directa y llamadas privadas · Respuesta inmediata',
  },
}
