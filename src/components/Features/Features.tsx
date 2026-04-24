import { motion } from 'framer-motion'
import { useRef } from 'react'
import { LayoutDashboard, BellRing, BarChart3, UsersRound } from 'lucide-react'

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard claro',
      description: 'Resumen de ventas, leads y tareas con widgets visuales que cualquier cliente entiende al instante.',
      color: 'from-accent-yellow to-accent-cyan',
    },
    {
      icon: BellRing,
      title: 'Notificaciones smart',
      description: 'Alertas en tiempo real para formularios, pagos y eventos clave de tu web para no perder oportunidades.',
      color: 'from-accent-cyan to-accent-magenta',
    },
    {
      icon: BarChart3,
      title: 'Analitica accionable',
      description: 'Graficas simples con conversion, clics y rendimiento para tomar decisiones sin tecnicismos.',
      color: 'from-accent-magenta to-accent-yellow',
    },
    {
      icon: UsersRound,
      title: 'Equipo conectado',
      description: 'Roles por usuario y seguimiento de tareas para marketing, ventas y soporte en una sola app web.',
      color: 'from-accent-cyan to-accent-magenta',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-bg to-primary-bg/95 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-cyan rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 font-montserrat text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient-animated">Features: mini app web moderna</span>
          </h2>
          <p className="text-xl text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            Una vista estilo producto SaaS: limpia, elegante y facil de entender para tus clientes.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 rounded-3xl border border-accent-cyan/30 bg-gradient-to-br from-primary-bg/70 to-primary-bg/30 p-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.2em] text-accent-cyan">Vista app web</p>
            <span className="rounded-full bg-accent-cyan/20 px-3 py-1 text-xs text-accent-cyan">Live</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-accent-cyan/20 bg-primary-bg/50 p-4">
              <p className="text-sm text-primary-secondary">Ventas del mes</p>
              <p className="mt-2 text-3xl font-bold">$24,980</p>
            </div>
            <div className="rounded-2xl border border-accent-magenta/20 bg-primary-bg/50 p-4">
              <p className="text-sm text-primary-secondary">Leads activos</p>
              <p className="mt-2 text-3xl font-bold">128</p>
            </div>
            <div className="rounded-2xl border border-accent-yellow/20 bg-primary-bg/50 p-4">
              <p className="text-sm text-primary-secondary">Conversion</p>
              <p className="mt-2 text-3xl font-bold">18.4%</p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="group relative"
                variants={cardVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full p-8 bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl hover:border-accent-cyan/40 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-full h-full text-primary-bg" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 font-montserrat text-primary-text group-hover:text-accent-cyan transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-primary-secondary leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 to-accent-magenta/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg font-semibold text-lg hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver mas funcionalidades
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features
