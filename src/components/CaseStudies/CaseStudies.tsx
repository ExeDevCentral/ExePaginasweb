import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TrendingUp, Clock, Users } from 'lucide-react'
import DashboardMock from './DashboardMock'

const CASES = [
  {
    tIdx: 1,
    metric: '+40%',
    icon: Clock,
    color: 'from-accent-cyan to-blue-500',
    bgLight: 'rgba(0, 255, 255, 0.15)',
  },
  {
    tIdx: 2,
    metric: '3x',
    icon: TrendingUp,
    color: 'from-indigo-500 to-accent-magenta',
    bgLight: 'rgba(99, 102, 241, 0.15)',
  },
  {
    tIdx: 3,
    metric: '-60%',
    icon: Users,
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'rgba(52, 211, 153, 0.15)',
  },
]

const CaseCard = ({ study, index }: { study: (typeof CASES)[0]; index: number }) => {
  const { t } = useTranslation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      className={`group relative p-8 rounded-[2rem] bg-card backdrop-blur-md border border-border overflow-hidden transition-all duration-500 hover:border-foreground/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-foreground/5`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${study.bgLight},
              transparent 80%
            )
          `,
        }}
      />

      {/* Background Icon */}
      <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 transform-gpu pointer-events-none">
        <study.icon className="w-64 h-64" />
      </div>

      <div className="flex items-center justify-between mb-12 relative z-10">
        <span className="text-xs font-bold px-4 py-2 bg-muted backdrop-blur-md rounded-full text-foreground/80 border border-border">
          {t(`casestudies.case_${study.tIdx}_niche`)}
        </span>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${study.color} p-[1px]`}>
          <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
            <study.icon className="w-5 h-5 text-foreground" />
          </div>
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3
          className={`text-6xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-br ${study.color} mb-2 tracking-tighter`}
        >
          {study.metric}
        </h3>
        <p className="text-foreground/60 font-bold text-xs uppercase tracking-[0.2em]">
          {t(`casestudies.case_${study.tIdx}_metric_label`)}
        </p>
      </div>

      <h4 className="text-2xl font-bold text-foreground mb-4 relative z-10 font-outfit">
        {t(`casestudies.case_${study.tIdx}_titulo`)}
      </h4>
      <p className="text-muted-foreground text-sm leading-relaxed relative z-10 group-hover:text-foreground transition-colors">
        {t(`casestudies.case_${study.tIdx}_desc`)}
      </p>
    </motion.div>
  )
}

const CaseStudies = () => {
  const { t } = useTranslation()
  return (
    <section id="cases" className="py-32 px-4 bg-background relative overflow-hidden z-10">
      {/* Luces de fondo estilo Vercel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-magenta/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-foreground/50 font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            {t('casestudies.seccion_titulo')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-outfit font-black text-foreground tracking-tight"
          >
            {t('casestudies.heading')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Tarjetas de Casos */}
          <div className="lg:col-span-7 space-y-6">
            {CASES.map((study, index) => (
              <CaseCard key={index} study={study} index={index} />
            ))}
          </div>

          {/* Mockup del Dashboard (Evidencia Visual) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan/80">
              {t('casestudies.evidencia_label')}
            </div>
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
