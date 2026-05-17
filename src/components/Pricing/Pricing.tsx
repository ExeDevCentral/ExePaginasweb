import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Check, X } from 'lucide-react'

const PLANS = [
  {
    name: 'Landing Page',
    description: 'Perfecto para validar ideas y captar leads.',
    setupFee: '$200.000',
    setupLabel: 'Pago único de setup',
    monthlyFee: '$10.000',
    monthlyLabel: 'Mantenimiento mensual',
    features: [
      { name: 'Diseño a medida (One-Page)', included: true },
      { name: 'Formulario de contacto', included: true },
      { name: 'Hosting ultra-rápido', included: true },
      { name: 'Certificado SSL', included: true },
      { name: 'Dominio propio (.com)', included: false },
      { name: 'Panel autoadministrable', included: false }
    ],
    popular: false
  },
  {
    name: 'E-Commerce / Reservas',
    description: 'Para negocios que necesitan vender o gestionar en piloto automático.',
    setupFee: '$450.000',
    setupLabel: 'Pago único de setup',
    monthlyFee: '$25.000',
    monthlyLabel: 'Mantenimiento mensual',
    popular: true,
    features: [
      { name: 'Múltiples secciones', included: true },
      { name: 'Sistema de pagos / reservas', included: true },
      { name: 'Panel de administración', included: true },
      { name: 'Integración WhatsApp', included: true },
      { name: 'Hosting ultra-rápido', included: true },
      { name: 'Soporte prioritario', included: true }
    ]
  }
]

const PricingCard = ({ plan, index }: { plan: typeof PLANS[0], index: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[2.5rem] bg-[#0a0a0c] backdrop-blur-xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 p-10 flex flex-col ${
        plan.popular 
          ? 'border-accent-magenta/50 shadow-2xl shadow-accent-magenta/10 hover:shadow-accent-magenta/20' 
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${plan.popular ? 'rgba(236,72,153, 0.15)' : 'rgba(255,255,255, 0.05)'},
              transparent 80%
            )
          `,
        }}
      />

      {plan.popular && (
        <>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-magenta to-transparent" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
            Más Elegido
          </div>
        </>
      )}
      
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-3xl font-outfit font-black text-white mb-3">{plan.name}</h3>
        <p className="text-sm text-slate-400 mb-8 min-h-[40px]">{plan.description}</p>
        
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="mb-4 pb-4 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{plan.setupLabel}</p>
            <p className="text-4xl font-outfit font-black text-white">{plan.setupFee}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{plan.monthlyLabel}</p>
            <div className="flex items-end gap-1">
              <p className="text-2xl font-outfit font-bold text-accent-cyan">{plan.monthlyFee}</p>
              <span className="text-xs text-slate-500 mb-1">/mes</span>
            </div>
          </div>
        </div>

        <ul className="space-y-4 mb-10 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                {feature.included ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>
              <span className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600 line-through decoration-slate-600/50'}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`block w-full py-4 rounded-xl text-center font-bold transition-all duration-300 ${
            plan.popular 
              ? 'bg-white text-black hover:bg-slate-200 hover:shadow-lg hover:shadow-white/20' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Solicitar Cotización
        </a>
      </div>
    </motion.div>
  )
}

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-4 relative overflow-hidden bg-[#030305] z-10 border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-cyan/5 via-[#030305] to-[#030305] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent-cyan font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Inversión Transparente
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-white tracking-tight"
          >
            PLANES DE DESARROLLO
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Modelo híbrido: Pagas el desarrollo una sola vez, y una cuota mínima de mantenimiento para que tu web esté siempre online, segura y rápida.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
