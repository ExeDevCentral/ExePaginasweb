import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FEATURES_LIST, DASHBOARD_STATS } from './constants'
import EnhancedFeatureCard from './EnhancedFeatureCard'

const Features = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const features = FEATURES_LIST

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-magenta/10 rounded-full blur-[140px]"></div>
      </div>

      <motion.div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-accent-cyan font-bold tracking-[0.3em] uppercase text-xs mb-4">
            {t('features.seccion_titulo')}
          </p>
          <h2 className="mb-6 font-montserrat text-4xl font-black tracking-tight sm:text-6xl text-foreground">
            {t('features.heading_1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
              {t('features.heading_2')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('features.descripcion')}
          </p>
        </motion.div>

        <motion.div
          className="mb-20 rounded-[2.5rem] border border-border bg-card/40 p-2 backdrop-blur-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-[2.2rem] bg-background/50 p-8 border border-border">
            <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">
                  {t('features.dashboard_status')}
                </p>
                <h3 className="text-2xl font-bold text-foreground">{t('features.dashboard_titulo')}</h3>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('features.dashboard_online')}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {DASHBOARD_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="group/stat rounded-2xl bg-muted p-6 border border-border hover:border-border transition-all"
                >
                  <p className="text-sm text-muted-foreground font-medium mb-2">{t(`features.dashboard_${stat.tKey as string}`)}</p>
                  <div className="flex items-end gap-3">
                    <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground mb-1.5">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <EnhancedFeatureCard
              key={feature.title}
              icon={feature.icon as unknown as React.ComponentType<{ className?: string }>}
              title={t(`features.card_${i + 1}_titulo`)}
              description={t(`features.card_${i + 1}_desc`)}
              colorClass={feature.color}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('contact')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg font-semibold text-lg hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('features.cta')}
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features
