import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { FeatureData } from './constants'
import { FEATURES_LIST, DASHBOARD_STATS, SPRING_CONFIG } from './constants'

interface FeatureCardProps {
  feature: FeatureData;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Usamos la configuración de resortes compartida
  const springConfig = SPRING_CONFIG;
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Centramos el valor para el efecto de rotación
    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const Icon = feature.icon;

  return (
    <div className="perspective-[1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-8 transition-colors hover:bg-slate-800/40 hover:border-white/20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Capa de Spotlight Dinámico */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${useTransform(mouseX, (v) => v + 150)}px ${useTransform(mouseY, (v) => v + 150)}px,
                rgba(0, 255, 242, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Brillo en el borde (Edge beam) */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-white/20" />
        
        <div 
          className="relative z-10"
          style={{ transform: "translateZ(50px)" }} // Eleva el contenido
        >
          <motion.div 
            className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-3 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="h-full w-full text-slate-950" strokeWidth={2.5} />
          </motion.div>
          
          <h3 className="mb-3 font-montserrat text-2xl font-black text-white group-hover:text-accent-cyan transition-colors">
            {feature.title}
          </h3>
          <p className="text-base leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
            {feature.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Usamos las features desde constantes
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
          <p className="text-accent-cyan font-bold tracking-[0.3em] uppercase text-xs mb-4">Sistemas de Próxima Generación</p>
          <h2 className="mb-6 font-montserrat text-4xl font-black tracking-tight sm:text-6xl text-white">
            Tu negocio, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">automatizado.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desarrollamos herramientas de gestión que se sienten como aplicaciones nativas, 
            diseñadas para escalar sin complicaciones técnicas.
          </p>
        </motion.div>

        <motion.div
          className="mb-20 rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-2 backdrop-blur-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-[2.2rem] bg-slate-950/50 p-8 border border-white/5">
            <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Status Global</p>
                <h3 className="text-2xl font-bold text-white">Dashboard Operativo</h3>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
Sistemas Online
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {DASHBOARD_STATS.map((stat, i) => (
                <div key={i} className="group/stat rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-white/10 transition-all">
                  <p className="text-sm text-slate-500 font-medium mb-2">{stat.label}</p>
                  <div className="flex items-end gap-3">
                    <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-slate-400 mb-1.5">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
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
              e.preventDefault();
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg font-semibold text-lg hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver mas funcionalidades
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features