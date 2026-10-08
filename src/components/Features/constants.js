import {
  CyberMetricProcessor,
  CyberTechCode,
  CyberSparkleIcon,
  CyberMetricLightning,
  CyberRealPropertyShield,
} from '@/components/ui/MagnificentIcons'

export const FEATURES_LIST = [
  {
    icon: CyberMetricProcessor,
    title: 'Personalización Total',
    description:
      'No buscamos que tu negocio se adapte a una plantilla. Construimos la herramienta para que la tecnología se adapte a vos.',
    color: 'from-accent-cyan to-accent-magenta',
  },
  {
    icon: CyberTechCode,
    title: 'Propiedad Absoluta',
    description:
      'El proyecto es tuyo. Código fuente, recursos y documentación como corresponde. Cero mensualidades atadas.',
    color: 'from-emerald-400 to-accent-cyan',
  },
  {
    icon: CyberSparkleIcon,
    title: 'Competir por la Atención',
    description:
      'Diseño moderno, experiencia de usuario y arquitectura orientada a ventas para destacar en 2026.',
    color: 'from-accent-magenta to-accent-yellow',
  },
  {
    icon: CyberMetricLightning,
    title: 'Automatización & Integraciones',
    description:
      'Procesos internos fluidos, cobros, pasarelas y analítica integrada para escalar tus ingresos.',
    color: 'from-accent-yellow to-accent-cyan',
  },
  {
    icon: CyberRealPropertyShield,
    title: 'IA con Valor Real',
    description:
      'Implementamos Inteligencia Artificial cuando realmente aporta un retorno operativo o comercial claro.',
    color: 'from-accent-cyan to-accent-magenta',
  },
]

export const DASHBOARD_STATS = [
  { tKey: 'consultas', value: '42', color: 'text-accent-cyan', trend: '+12%' },
  { tKey: 'clientes', value: '12', color: 'text-foreground', trend: '+5' },
  { tKey: 'crecimiento', value: '24%', color: 'text-accent-magenta', trend: 'In crescendo' },
]

export const SPRING_CONFIG = {
  damping: 25,
  stiffness: 200,
}
