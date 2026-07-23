import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PhoneCall, Code2, Rocket, Headphones } from 'lucide-react'

const STEPS = [
  { icon: PhoneCall, color: 'from-blue-500 to-accent-cyan' },
  { icon: Code2, color: 'from-accent-cyan to-accent-magenta' },
  { icon: Rocket, color: 'from-accent-magenta to-accent-yellow' },
  { icon: Headphones, color: 'from-accent-yellow to-orange-500' },
]

const Process = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.4'],
  })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">
            {t('process.seccion_titulo')}
          </p>
          <h2 className="font-montserrat text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            {t('process.heading_1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
              {t('process.heading_2')}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
          {/* Línea conectora (solo en desktop) — se llena con scroll */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-muted rounded-full z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-yellow"
              style={{ width: lineWidth }}
            />
          </div>

          {STEPS.map((step, i) => {
            const stepT = (key: string) => t(`process.step_${i + 1}_${key}`)
            const Icon = step.icon
            return (
              <motion.div
                key={`step-${i}`}
                className="relative z-10 flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} p-[2px] mb-6 shadow-lg shadow-accent-magenta/5 group-hover:-translate-y-2 transition-transform duration-300`}
                >
                  <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center">
                    <Icon className="w-10 h-10 text-foreground group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 font-montserrat">{stepT('titulo')}</h3>
                <p className="text-primary-secondary text-sm leading-relaxed">{stepT('desc')}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Process
