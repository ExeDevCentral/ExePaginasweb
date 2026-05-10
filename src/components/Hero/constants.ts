/**
 * Texto principal para el efecto typewriter en el Hero
 */
export const HERO_TYPEWRITER_TEXT = 
  'Software de gestión, reservas online y automatizaciones inteligentes para potenciar tu negocio local.'

/**
 * Configuración de partículas para el Hero - Sensación premium
 * Velocidad suave y constante con movimiento orgánico
 */
export const PARTICLES_CONFIG = {
  background: {
    color: {
      value: '#000000',
    },
    opacity: 0,
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: 'push' as const,
      },
      onHover: {
        enable: true, // Habilitado para interacción sutil
        mode: 'repulse' as const,
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 150,
        duration: 0.6,
      },
    },
  },
  particles: {
    color: {
      value: ['#00FFFF', '#FF00FF', '#FFFF00'] as string[],
    },
    links: {
      enable: false,
    },
    move: {
      direction: 'top' as const,
      enable: true,
      speed: 0.08, // Velocidad ultra-lenta constante
      random: false,
      straight: false, // Movimiento más natural
      outModes: {
        default: 'out',
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 60, // Reducido de 80 a 60 para menos saturación
    },
    opacity: {
      value: {
        min: 0.2, // Más sutil
        max: 0.6,
      },
      animation: {
        enable: true,
        speed: 0.1, // Parpadeo de opacidad muy suave
        sync: false,
      },
    },
    size: {
      value: {
        min: 1,
        max: 2.5, // Ligeramente más pequeñas
      },
      animation: {
        enable: true,
        speed: 0.05, // Cambio de tamaño extremadamente lento
        sync: false,
      },
    },
    // Movimiento adicional para efecto flotante
    rotate: {
      value: 0,
      animation: {
        enable: true,
        speed: 0.2, // Rotación muy lenta
        sync: false,
      },
    },
  },
  detectRetina: true,
} as const

/**
 * Variantes de animación para Framer Motion
 */
export const HERO_ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
} as const