import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Code2, Zap, Shield, Search } from 'lucide-react'

const STACK = [
  {
    icon: Zap,
    title: 'Performance Extrema',
    description: 'Score 99+ en Google Lighthouse. Tiempos de carga en milisegundos que evitan que tus clientes abandonen la página.',
    color: 'text-yellow-400',
    bgLight: 'rgba(250, 204, 21, 0.15)'
  },
  {
    icon: Code2,
    title: 'Stack Moderno',
    description: 'Desarrollo en React y TypeScript. Interfaces dinámicas, fluidas y sin recargas de página.',
    color: 'text-blue-400',
    bgLight: 'rgba(96, 165, 250, 0.15)'
  },
  {
    icon: Shield,
    title: 'Infraestructura Segura',
    description: 'Despliegue en la nube (Edge Computing). Certificados SSL y protección contra ataques.',
    color: 'text-emerald-400',
    bgLight: 'rgba(52, 211, 153, 0.15)'
  },
  {
    icon: Search,
    title: 'SEO Técnico Integrado',
    description: 'Estructura semántica y Core Web Vitals optimizados para rankear orgánicamente en Google.',
    color: 'text-purple-400',
    bgLight: 'rgba(192, 132, 252, 0.15)'
  }
]

const TechCard = ({ item, index }: { item: typeof STACK[0], index: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative p-8 rounded-3xl bg-[#0a0a0c] border border-white/5 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-cyan-500/10"
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
        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
          <item.icon className={`w-7 h-7 ${item.color}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors font-outfit">{item.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

const TechStack = () => {
  return (
    <section className="py-32 px-4 bg-[#030305] relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-cyan/5 via-[#030305] to-[#030305] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              Despliegue Global en <span className="text-white font-black">Vercel</span>
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-white mb-6 tracking-tight"
          >
            Tecnología Enterprise para<br className="hidden md:block"/> tu negocio local
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
