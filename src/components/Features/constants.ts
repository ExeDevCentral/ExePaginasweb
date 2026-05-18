import React from 'react'
import { Sparkles, ShieldCheck, Zap, Repeat } from 'lucide-react'

/**
 * Tipo para las propiedades de una feature card
 */
export interface FeatureData {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}

/**
 * Lista de features del sistema
 */
export const FEATURES_LIST: FeatureData[] = [
  {
    icon: Sparkles,
    title: 'Arquitectura que escala',

    description: 'Sistemas diseñados desde cero para crecer sin downtime: de 100 a 100.000 usuarios.',
    color: 'from-accent-cyan to-accent-magenta',
  },
  {
    icon: Zap,
    title: 'Automatización real',
    description: 'Reservas, pagos y notificaciones automáticas: menos caos, más ingresos 24/7.',
    color: 'from-accent-magenta to-accent-yellow',
  },
  {
    icon: Repeat,
    title: '99.9% uptime garantizado',
    description: 'Redundancia + respaldo automático. Si algo cae, lo resolvemos en menos de 4 horas.',
    color: 'from-accent-yellow to-accent-cyan',
  },
  {
    icon: ShieldCheck,
    title: 'Soporte técnico premium',
    description: 'Respuesta técnica prioritaria con SLAs claros y actualizaciones constantes.',
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