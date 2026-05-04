import { motion } from 'framer-motion'
import { PhoneCall, Code2, Rocket, Headphones } from 'lucide-react'

const STEPS = [
  {
    icon: PhoneCall,
    title: '1. Discovery Call',
    description: 'Nos reunimos 30 minutos para entender qué necesita tu negocio y cómo automatizarlo.',
    color: 'from-blue-500 to-accent-cyan'
  },
  {
    icon: Code2,
    title: '2. Desarrollo Ágil',
    description: 'En días construimos la primera versión usando nuestro sistema modular avanzado.',
    color: 'from-accent-cyan to-accent-magenta'
  },
  {
    icon: Rocket,
    title: '3. Lanzamiento',
    description: 'Desplegamos tu web en servidores premium globales (99.9% uptime).',
    color: 'from-accent-magenta to-accent-yellow'
  },
  {
    icon: Headphones,
    title: '4. Soporte Total',
    description: 'Nos encargamos del mantenimiento, los servidores y las actualizaciones.',
    color: 'from-accent-yellow to-orange-500'
  }
]

const Process = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">Metodología</p>
          <h2 className="font-montserrat text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Lanzamiento en <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">tiempo récord</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
          {/* Línea conectora (solo en desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-white/5 rounded-full z-0">
            <div className="h-full bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-yellow opacity-50" />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                className="relative z-10 flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} p-[2px] mb-6 shadow-lg shadow-accent-magenta/5 group-hover:-translate-y-2 transition-transform duration-300`}>
                  <div className="w-full h-full bg-[#050508] rounded-[22px] flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 font-montserrat">{step.title}</h3>
                <p className="text-primary-secondary text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Process
