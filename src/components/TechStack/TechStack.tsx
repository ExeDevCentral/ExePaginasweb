import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Code2, Zap, Shield, Search } from 'lucide-react'

const STACK = [
  {
    icon: Zap,
    tIdx: 1,
    color: 'text-yellow-400',
    bgLight: 'rgba(250, 204, 21, 0.15)',
  },
  {
    icon: Code2,
    tIdx: 2,
    color: 'text-blue-400',
    bgLight: 'rgba(96, 165, 250, 0.15)',
  },
  {
    icon: Shield,
    tIdx: 3,
    color: 'text-emerald-400',
    bgLight: 'rgba(52, 211, 153, 0.15)',
  },
  {
    icon: Search,
    tIdx: 4,
    color: 'text-purple-400',
    bgLight: 'rgba(192, 132, 252, 0.15)',
  },
]

const TechCard = ({ item, index }: { item: (typeof STACK)[0]; index: number }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative p-8 rounded-3xl bg-card border border-border overflow-hidden transition-all hover:border-border hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${item.bgLight},
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}
        >
          <item.icon className={`w-7 h-7 ${item.color}`} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-foreground transition-colors font-outfit">
          {t(`techstack.card_${item.tIdx}_titulo`)}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
          {t(`techstack.card_${item.tIdx}_desc`)}
        </p>
      </div>
    </motion.div>
  )
}

const TechStack = () => {
  const { t } = useTranslation()
  return (
    <section className="py-32 px-4 bg-background relative overflow-hidden border-y border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-cyan/5 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex px-4 py-1.5 rounded-full border border-border bg-muted backdrop-blur-md mb-6"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t('techstack.badge_1')} <span className="text-foreground font-black">{t('techstack.badge_2')}</span>
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-foreground mb-6 tracking-tight"
          >
            {t('techstack.heading_1')}
            <br className="hidden md:block" /> {t('techstack.heading_2')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STACK.map((item, index) => (
            <TechCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
