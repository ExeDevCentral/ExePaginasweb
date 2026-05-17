import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { TrendingUp, Clock, Users } from 'lucide-react'
import DashboardMock from './DashboardMock'

const CASES = [
  {
    title: 'Automatización de Reservas',
    niche: 'Centro Deportivo',
    metric: '+40%',
    metricLabel: 'Aumento en reservas',
    description: 'Eliminamos la fricción de reservas por WhatsApp con un sistema 24/7. El cliente recuperó 15 horas semanales de gestión manual.',
    icon: Clock,
    color: 'from-accent-cyan to-blue-500',
    bgLight: 'rgba(0, 255, 255, 0.15)'
  },
  {
    title: 'E-commerce Mayorista',
    niche: 'Distribuidora',
    metric: '3x',
    metricLabel: 'Volumen de ventas',
    description: 'Migración a una plataforma B2B optimizada con sincronización de stock en tiempo real y catálogo digital interactivo.',
    icon: TrendingUp,
    color: 'from-purple-500 to-accent-magenta',
    bgLight: 'rgba(255, 0, 255, 0.15)'
  },
  {
    title: 'Gestión de Pacientes',
    niche: 'Clínica Odontológica',
    metric: '-60%',
    metricLabel: 'Ausentismo',
    description: 'Implementación de recordatorios automáticos por WhatsApp y panel de control unificado para recepcionistas y médicos.',
    icon: Users,
    color: 'from-emerald-400 to-teal-500',
    bgLight: 'rgba(52, 211, 153, 0.15)'
  }
]

const CaseCard = ({ study, index }: { study: typeof CASES[0], index: number }) => {
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
      className={`group relative p-8 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5`}
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
        <span className="text-xs font-bold px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-white/80 border border-white/5">
          {study.niche}
        </span>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${study.color} p-[1px]`}>
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
             <study.icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 relative z-10">
        <h3 className={`text-6xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-br ${study.color} mb-2 tracking-tighter`}>
          {study.metric}
        </h3>
        <p className="text-white/60 font-bold text-xs uppercase tracking-[0.2em]">
          {study.metricLabel}
        </p>
      </div>

      <h4 className="text-2xl font-bold text-white mb-4 relative z-10 font-outfit">
        {study.title}
      </h4>
      <p className="text-slate-400 text-sm leading-relaxed relative z-10 group-hover:text-slate-300 transition-colors">
        {study.description}
      </p>
    </motion.div>
  )
}

const CaseStudies = () => {
  return (
    <section id="cases" className="py-32 px-4 bg-[#030305] relative overflow-hidden z-10">
      {/* Luces de fondo estilo Vercel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-magenta/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/50 font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Casos de Estudio
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-outfit font-black text-white tracking-tight"
          >
            RESULTADOS REALES
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
              Evidencia Visual del Sistema
            </div>
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
