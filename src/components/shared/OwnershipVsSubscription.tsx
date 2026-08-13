import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Lock,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react'

export const OwnershipVsSubscription: React.FC = () => {
  const { t } = useTranslation()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0 })
  const [glowPos, setGlowPos] = React.useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    setGlowPos({ x: Math.round(px * 100), y: Math.round(py * 100) })
    setTilt({
      rx: parseFloat(((0.5 - py) * 10).toFixed(2)),
      ry: parseFloat(((px - 0.5) * 10).toFixed(2)),
    })
  }

  const handlePointerEnter = () => setIsHovered(true)
  const handlePointerLeave = () => {
    setIsHovered(false)
    setTilt({ rx: 0, ry: 0 })
  }

  const handleCopyQuote = () => {
    const quoteText = t(
      'versus.cita_destacada',
      '¿Por qué pagar indefinidamente por una plantilla que se parece a miles de otras tiendas, si podés tener una plataforma hecha específicamente para tu negocio y además recibir el código?'
    )
    navigator.clipboard.writeText(`"${quoteText}" — ExePaginasweb`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const ownershipSteps = [
    {
      title: t('versus.propiedad_step1', 'Pagás por desarrollo'),
      desc: 'Inversión única en tu activo digital',
    },
    {
      title: t('versus.propiedad_step2', 'Diseño personalizado'),
      desc: 'Identidad exclusiva creada para tu marca',
    },
    {
      title: t('versus.propiedad_step3', 'Funciones específicas'),
      desc: 'Arquitectura alineada a tus procesos',
    },
    {
      title: t('versus.propiedad_step4', 'Automatizaciones'),
      desc: 'Ahorro de horas operativas e integración de IA',
    },
    {
      title: t('versus.propiedad_step5', 'Código del proyecto'),
      desc: 'Repositorio, recursos y documentación en tu poder',
    },
    {
      title: t('versus.propiedad_step6', 'El negocio es dueño de su software'),
      desc: 'Independencia total sin mensualidades cautivas',
    },
  ]

  const subscriptionSteps = [
    {
      title: t('versus.alquiler_step1', 'Pagás mensualidad'),
      desc: 'Costo infinito recurrente que jamás se detiene',
    },
    {
      title: t('versus.alquiler_step2', 'Plantilla'),
      desc: 'Diseño idéntico al de miles de otros competidores',
    },
    {
      title: t('versus.alquiler_step3', 'Funciones predeterminadas'),
      desc: 'Debés adaptar tu negocio al sistema',
    },
    {
      title: t('versus.alquiler_step4', 'Personalización limitada'),
      desc: 'Bloqueos técnicos y restricciones de plataforma',
    },
    {
      title: t('versus.alquiler_step5', 'Dependencia de la Plataforma'),
      desc: 'Si dejás de pagar, perdés tu página y tus datos',
    },
  ]

  return (
    <section id="comparativa" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Glow Backdrops */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">
              {t('versus.badge', 'MODELO DE NEGOCIO 2026')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight text-foreground mb-6">
            {t('versus.titulo_principal', 'Software Diseñado Alrededor de Tu Negocio')}
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'versus.subtitulo',
              'No vendemos plantillas de alquiler. Desarrollamos herramientas digitales únicas donde el negocio es dueño absoluto de su tecnología.'
            )}
          </p>
        </motion.div>

        {/* Highlight Banner Quote (Interactive 3D Tilt & Spotlight Glow) */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          animate={{
            rotateX: tilt.rx,
            rotateY: tilt.ry,
          }}
          style={{ perspective: 1000 }}
          className="mb-16 p-8 md:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_60px_rgba(6,182,212,0.15)] text-center group cursor-pointer transition-shadow duration-500 hover:shadow-[0_25px_70px_rgba(6,182,212,0.3)]"
        >
          {/* Dynamic Spotlight Effect following Mouse */}
          <div
            className="pointer-events-none absolute -inset-1 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0.4,
              background: `radial-gradient(550px circle at ${glowPos.x}% ${glowPos.y}%, rgba(6, 182, 212, 0.22), transparent 75%)`,
            }}
          />

          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/35 transition-all duration-700" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-500/35 transition-all duration-700" />
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Continuous Light Sheen Sweep Ray */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
            style={{ transform: 'translateX(-100%) skewX(-20deg)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Floating Interactive Tech Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.span
              className="absolute text-cyan-400/30 text-xs font-mono font-bold"
              style={{ left: '10%', top: '20%' }}
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              &lt;/&gt;
            </motion.span>
            <motion.span
              className="absolute text-purple-400/30 text-xs font-mono font-bold"
              style={{ right: '12%', top: '25%' }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1, ease: 'easeInOut' }}
            >
              &#123; &#125;
            </motion.span>
            <motion.span
              className="absolute text-emerald-400/30 text-[10px] font-mono font-bold tracking-widest uppercase"
              style={{ left: '15%', bottom: '22%' }}
              animate={{ y: [0, -12, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 6, delay: 2, ease: 'easeInOut' }}
            >
              git push origin main
            </motion.span>
            <motion.span
              className="absolute text-cyan-400/40 text-xs font-mono font-black"
              style={{ right: '18%', bottom: '20%' }}
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 4.5, delay: 0.5, ease: 'easeInOut' }}
            >
              100% CÓDIGO
            </motion.span>
          </div>

          {/* Watermark Code Icon */}
          <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none text-cyan-400 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-25">
            <Code2 className="w-48 h-48 sm:w-64 sm:h-64" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Diferencial Estratégico</span>
            </div>

            <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed max-w-4xl mx-auto font-montserrat tracking-tight drop-shadow-md">
              “
              {t(
                'versus.cita_destacada',
                '¿Por qué pagar indefinidamente por una plantilla que se parece a miles de otras tiendas, si podés tener una plataforma hecha específicamente para tu negocio y además recibir el código?'
              )}
              ”
            </blockquote>

            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400/80 uppercase tracking-widest">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/60 hidden sm:inline-block" />
                <span>Código Propio • Libertad Absoluta • Sin Mensualidades Ocultas</span>
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-cyan-400/60 hidden sm:inline-block" />
              </div>

              {/* Interactive Copy Quote Pill */}
              <motion.button
                type="button"
                onClick={handleCopyQuote}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-slate-900/80 text-cyan-300 text-xs font-bold transition-all duration-300 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-300 shadow-md"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-extrabold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Copiar Frase Clave</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {/* Column 1: Proprietary Ownership Model (ExePaginasweb) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 bg-card/60 backdrop-blur-xl p-4 sm:p-8 relative overflow-hidden shadow-xl shadow-emerald-500/5 group hover:border-emerald-500/70 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-border/80 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    EXEPAGINASWEB
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {t('versus.propiedad_titulo', 'Modelo de Propiedad Real')}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
                100% Tuyo
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {ownershipSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors relative"
                >
                  <div className="mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm sm:text-lg flex items-center gap-2">
                        {step.title}
                        {idx === ownershipSteps.length - 1 && (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                        )}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
                      {step.desc}
                    </p>
                  </div>
                  {idx < ownershipSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-emerald-500/40 absolute right-3 bottom-3 hidden sm:block rotate-90 sm:rotate-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                {t(
                  'versus.propiedad_footer',
                  'Te entregamos el código fuente completo, documentación y todos los recursos. Tu negocio es dueño absoluto de su tecnología.'
                )}
              </p>
            </div>
          </motion.div>

          {/* Column 2: Template Subscription Model (Platforms) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl sm:rounded-3xl border border-rose-500/30 bg-card/40 backdrop-blur-xl p-4 sm:p-8 relative overflow-hidden shadow-xl shadow-rose-500/5 group hover:border-rose-500/50 transition-all opacity-90"
          >
            <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-border/80 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">
                    PLATAFORMAS TRADICIONALES
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {t('versus.alquiler_titulo', 'Modelo de Alquiler / Plantilla')}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                Rehén Mensual
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {subscriptionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors relative"
                >
                  <div className="mt-0.5 shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm sm:text-lg flex items-center gap-2">
                        {step.title}
                        {idx === subscriptionSteps.length - 1 && (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                        )}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-rose-300">
                {t(
                  'versus.alquiler_footer',
                  'Si dejás de pagar la suscripción mensual, tu sitio desaparece y perdés todo el trabajo acumulado.'
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Core Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-muted/50 border border-border backdrop-blur-md text-left"
          >
            <Cpu className="w-6 h-6 text-accent-cyan mb-3" />
            <h4 className="font-bold text-foreground mb-2 text-base">
              {t('versus.quote1_title', 'Tecnología Adaptada')}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              “No buscamos que tu negocio se adapte a nuestra plantilla. Construimos la herramienta
              para que la tecnología se adapte a tu negocio.”
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-muted/50 border border-border backdrop-blur-md text-left"
          >
            <Sparkles className="w-6 h-6 text-accent-magenta mb-3" />
            <h4 className="font-bold text-foreground mb-2 text-base">
              {t('versus.quote2_title', 'Competir por la Atención')}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              “En 2026, la clave estratégica es competir por la atención con experiencia de usuario,
              diseño exclusivo, ventas y automatización real.”
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-muted/50 border border-border backdrop-blur-md text-left"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="font-bold text-foreground mb-2 text-base">
              {t('versus.quote3_title', 'El Proyecto es Tuyo')}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              “No te alquilo una página. Te construyo una herramienta digital que es tuya. Código,
              recursos y documentación, como corresponde.”
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default OwnershipVsSubscription
