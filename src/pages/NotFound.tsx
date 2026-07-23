import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import { Home } from 'lucide-react'

const PremiumBackground = lazy(() => import('../components/Effects/PremiumBackground'))

const floatingShapes = [
  {
    size: 60,
    x: '15%',
    y: '20%',
    delay: 0,
    color: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/20',
    duration: 6,
    shape: 'rounded-2xl',
  },
  {
    size: 40,
    x: '75%',
    y: '30%',
    delay: 0.5,
    color: 'bg-accent-magenta/10',
    border: 'border-accent-magenta/20',
    duration: 7,
    shape: 'rounded-full',
  },
  {
    size: 80,
    x: '80%',
    y: '70%',
    delay: 1,
    color: 'bg-accent-cyan/5',
    border: 'border-accent-cyan/10',
    duration: 8,
    shape: 'rotate-45 rounded-2xl',
  },
  {
    size: 35,
    x: '20%',
    y: '75%',
    delay: 0.3,
    color: 'bg-accent-magenta/8',
    border: 'border-accent-magenta/15',
    duration: 5.5,
    shape: 'rounded-xl',
  },
  {
    size: 50,
    x: '50%',
    y: '15%',
    delay: 0.8,
    color: 'bg-white/5',
    border: 'border-white/10',
    duration: 7.5,
    shape: 'rounded-full',
  },
]

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <Suspense fallback={null}>
        <PremiumBackground />
      </Suspense>
      <Helmet>
        <title>{t('notfound.meta_title')}</title>
      </Helmet>

      {/* Floating shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.color} ${shape.border} border ${shape.shape}`}
          style={{ width: shape.size, height: shape.size, left: shape.x, top: shape.y }}
          animate={{
            y: [0, -30, 0, 20, 0],
            rotate: [0, 10, -5, 5, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Glow orbs behind 404 */}
      <div className="absolute w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-accent-magenta/5 rounded-full blur-[100px] pointer-events-none translate-x-40 translate-y-40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-md px-4"
      >
        <motion.p
          className="text-[140px] sm:text-[180px] font-black leading-none select-none"
          animate={{ color: ['#0ea5e9', '#6366f1', '#0ea5e9'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
          }}
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-foreground mt-2"
        >
          {t('notfound.titulo')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-muted-foreground mt-3"
        >
          {t('notfound.descripcion')}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/')}
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-2xl text-primary-bg font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent-cyan/20"
        >
          <Home className="w-4 h-4" />
          {t('notfound.boton')}
        </motion.button>
      </motion.div>
    </div>
  )
}
