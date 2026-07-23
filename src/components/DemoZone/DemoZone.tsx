import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useRef, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ShoppingCart } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useIsMobile } from '../../hooks/useIsMobile'

// CoffeePortal3D se importa dinámicamente SOLO cuando el usuario hace clic en Pixel Coffee
// Esto evita que three.js (288KB) se cargue en la página principal

// --- CONSTANTES ESTÁTICAS (Optimizadas fuera del componente) ---
const PROJECTS = [
  {
    title: 'Salon Bloom',
    category: 'Landing de servicios',
    summary: 'Página para reservas, promociones y testimonios con estilo visual premium.',
    categoryKey: 'demozone.project_category_bloom',
    summaryKey: 'demozone.project_summary_bloom',
  },
  {
    title: 'NeoFit Studio',
    category: 'Web de membresías',
    summary: 'Sitio de gimnasio con planes, agenda de clases y CTA para conversión.',
    categoryKey: 'demozone.project_category_neofit',
    summaryKey: 'demozone.project_summary_neofit',
  },
  {
    title: 'Casa Aura',
    category: 'Catálogo inmobiliario',
    summary: 'Subpáginas de propiedades con filtros y contacto directo por WhatsApp.',
    categoryKey: 'demozone.project_category_aura',
    summaryKey: 'demozone.project_summary_aura',
  },
  {
    title: 'Pixel Coffee',
    category: 'E-commerce ligero',
    summary: 'Tienda online con carrito rápido y fichas de producto visuales.',
    categoryKey: 'demozone.project_category_coffee',
    summaryKey: 'demozone.project_summary_coffee',
  },
]

const COFFEE_PRODUCTS = [
  { id: 1, name: 'Espresso Oscuro', price: 8.9, emoji: '☕', origin: 'Etiopía' },
  { id: 2, name: 'Cold Brew Clásico', price: 11.5, emoji: '🧊', origin: 'Colombia' },
  { id: 3, name: 'Latte de Avena', price: 9.9, emoji: '🥛', origin: 'Brasil' },
  { id: 4, name: 'Blend Especial', price: 14.0, emoji: '✨', origin: 'Perú' },
]

const PROPERTIES = [
  {
    id: 1,
    type: 'casa',
    name: 'Villa Serena',
    location: 'Zona Norte · Buenos Aires',
    price: 'USD 285,000',
    beds: 4,
    baths: 3,
    m2: 220,
    gradient: 'from-stone-700 to-stone-900',
    image: '/assets/casa-aura/1.webp',
    tag: 'Destacada',
  },
  {
    id: 2,
    type: 'depto',
    name: 'Loft Aura Centro',
    location: 'Microcentro · CABA',
    price: 'USD 95,000',
    beds: 1,
    baths: 1,
    m2: 58,
    gradient: 'from-slate-700 to-slate-900',
    image: '/assets/casa-aura/2.webp',
    tag: 'Nuevo',
  },
  {
    id: 3,
    type: 'casa',
    name: 'Casa del Lago',
    location: 'Tigre · GBA',
    price: 'USD 420,000',
    beds: 5,
    baths: 4,
    m2: 380,
    gradient: 'from-emerald-900 to-stone-900',
    image: '/assets/casa-aura/3.webp',
    tag: 'Premium',
  },
  {
    id: 4,
    type: 'depto',
    name: 'Studio Palermo',
    location: 'Palermo · CABA',
    price: 'USD 72,000',
    beds: 1,
    baths: 1,
    m2: 42,
    gradient: 'from-zinc-700 to-zinc-900',
    image: '/assets/casa-aura/4.webp',
    tag: 'Oportunidad',
  },
  {
    id: 5,
    type: 'casa',
    name: 'Chalet Andino',
    location: 'Bariloche · Río Negro',
    price: 'USD 350,000',
    beds: 3,
    baths: 2,
    m2: 190,
    gradient: 'from-amber-900 to-stone-900',
    image: '/assets/casa-aura/5.webp',
    tag: 'Exclusiva',
  },
]

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sofía R.',
    text: 'El mejor servicio de coloración que he probado. El sistema de reservas es súper cómodo.',
    textKey: 'demozone.bloom_testimonial_1',
    role: 'Cliente Frecuente',
    roleKey: 'demozone.bloom_role_frecuente',
    avatar: '👩',
  },
  {
    id: 2,
    name: 'Martina G.',
    text: 'Me encantó el ambiente y la atención. Los turnos siempre a tiempo.',
    textKey: 'demozone.bloom_testimonial_2',
    role: 'Cliente Premium',
    roleKey: 'demozone.bloom_role_premium',
    avatar: '👱‍♀️',
  },
  {
    id: 3,
    name: 'Valentina P.',
    text: 'La web me permitió agendar un domingo a la noche sin molestar a nadie. Genial.',
    textKey: 'demozone.bloom_testimonial_3',
    role: 'Nueva Cliente',
    roleKey: 'demozone.bloom_role_nueva',
    avatar: '👩‍🦰',
  },
]

const TiltCard = ({
  category,
  title,
  summary,
  onOpen,
}: {
  category: string
  title: string
  summary: string
  onOpen: () => void
}) => {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 })
  const [active, setActive] = useState(false)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  return (
    <motion.article
      ref={cardRef}
      className="relative rounded-2xl border border-accent-cyan/20 bg-primary-bg/40 p-5 backdrop-blur-sm overflow-hidden"
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        const el = cardRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        const ry = (px - 0.5) * 14
        const rx = -(py - 0.5) * 10
        const tx = (px - 0.5) * 10
        const ty = (py - 0.5) * 8
        setTilt({ rx, ry, tx, ty })
        setGlowPos({ x: px * 100, y: py * 100 })
      }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false)
        setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 })
        setGlowPos({ x: 50, y: 50 })
      }}
      animate={{
        rotateX: tilt.rx,
        rotateY: tilt.ry,
        x: tilt.tx,
        y: tilt.ty,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      {/* Sheen */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ transform: 'translateX(-60%) skewX(-20deg)' }}
        animate={active ? { x: '160%' } : { x: '-60%' }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      />

      {/* Glow — follows cursor */}
      <div
        className="pointer-events-none absolute -inset-1 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(34,211,238,0.18), rgba(236,72,153,0.08) 40%, transparent 65%)`,
        }}
      />

      <p className="text-xs uppercase tracking-[0.2em] text-accent-cyan">{category}</p>
      <h3 className="mt-2 text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-primary-secondary">{summary}</p>

      <motion.button
        type="button"
        className="mt-4 rounded-full border border-accent-cyan/40 px-4 py-2 text-sm text-accent-cyan transition hover:bg-accent-cyan/10 flex items-center gap-2"
        onClick={onOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('demozone.ver_subpagina')}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </motion.button>
    </motion.article>
  )
}

const DemoZone = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [selectedProject, setSelectedProject] = useState<{
    title: string
    category: string
    summary: string
  } | null>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [isCoffeeTransitioning, setIsCoffeeTransitioning] = useState(false)
  const [CoffeePortalComponent, setCoffeePortalComponent] = useState<React.ComponentType<{
    isVisible: boolean
    onDismiss?: () => void
  }> | null>(null)
  const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number }[]>([])
  const [flyingItem, setFlyingItem] = useState<number | null>(null)
  const [cartBounce, setCartBounce] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const modalRef = useFocusTrap(!!selectedProject)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Configuración estable de partículas de vapor (Pixel Coffee)
  const steamParticles = useMemo(
    () =>
      Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => ({
        id: i,
        width: 100 + Math.random() * 150,
        height: 150 + Math.random() * 150,
        left: `${20 + Math.random() * 60}%`,
        duration: 6 + Math.random() * 6,
        delay: i * 0.8,
        drift: i % 2 === 0 ? 80 : -80,
      })),
    [isMobile]
  )

  // Configuración estable de partículas de datos (Portal Genérico)
  const digitalParticles = useMemo(
    () =>
      Array.from({ length: isMobile ? 12 : 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 7,
        delay: Math.random() * 10,
        // Variaciones para el efecto "glitch"
        opacityKeyframes: [0, 1, 0.4, 1, 0.2, 1, 0],
        scaleKeyframes: [1, 1.5, 0.8, 2, 0.5],
        xDrift: Math.random() * 20 - 10,
        flickerTimes: [0, 0.1, 0.15, 0.3, 0.5, 0.8, 1],
      })),
    [isMobile]
  )

  const addToCart = (product: {
    id: number
    name: string
    price: number
    emoji: string
    origin: string
  }) => {
    setFlyingItem(product.id)
    setTimeout(() => {
      setFlyingItem(null)
      setCartItems((prev) => [
        ...prev,
        { id: product.id, name: product.name, price: product.price },
      ])
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 400)
      setToast(`${product.emoji} "${product.name}" ${t('demozone.coffee_added')}`)
      setTimeout(() => setToast(null), 2000)
    }, 600)
  }

  const [propFilter, setPropFilter] = useState<'todos' | 'casa' | 'depto'>('todos')
  const [whatsappProp, setWhatsappProp] = useState<number | null>(null)
  const dismissCoffee = () => {
    setIsCoffeeTransitioning(false)
  }

  const openProject = (project: { title: string; category: string; summary: string }) => {
    if (project.title === 'NeoFit Studio') {
      setGlitchActive(true)
      setTimeout(() => {
        setGlitchActive(false)
        setSelectedProject(project)
      }, 600)
    } else if (project.title === 'Pixel Coffee') {
      if (!CoffeePortalComponent) {
        import('../Effects/CoffeePortal3D').then((module) => {
          setCoffeePortalComponent(() => module.CoffeePortal3D)
        })
      }
      setIsCoffeeTransitioning(true)
      setTimeout(() => {
        setSelectedProject(project)
        setTimeout(() => setIsCoffeeTransitioning(false), 800)
      }, 1200)
    } else {
      setSelectedProject(project)
    }
  }

  // Casa Aura derived state optimizado
  const auraFeatured = useMemo(
    () => PROPERTIES.find((p) => p.id === (whatsappProp ?? 1)) ?? PROPERTIES[0],
    [whatsappProp]
  )
  const auraFiltered = useMemo(
    () => PROPERTIES.filter((p) => propFilter === 'todos' || p.type === propFilter),
    [propFilter]
  )

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
            <span className="bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-transparent">
              {t('demozone.section_heading')}
            </span>
          </h2>
          <p className="text-xl text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            {t('demozone.section_desc')}
          </p>
        </motion.div>

        <motion.div
          className="mb-12 grid gap-5 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {PROJECTS.map((project) => (
            <TiltCard
              key={project.title}
              category={t(project.categoryKey)}
              title={project.title}
              summary={t(project.summaryKey)}
              onOpen={() =>
                openProject({
                  title: project.title,
                  category: t(project.categoryKey),
                  summary: t(project.summaryKey),
                })
              }
            />
          ))}
        </motion.div>
      </div>

      {/* Glitch Flash Overlay for NeoFit */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1] }}
          >
            <div className="absolute inset-0 bg-yellow-400 mix-blend-overlay opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-black font-montserrat font-black text-8xl tracking-widest"
                animate={{ x: [-4, 4, -2, 2, 0], skewX: [-5, 5, -2, 0] }}
                transition={{ duration: 0.4, repeat: 1 }}
              >
                NEOFIT
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efecto Alucinante 3D para Café — solo se monta si el componente fue cargado */}
      {CoffeePortalComponent && (
        <Suspense fallback={null}>
          <CoffeePortalComponent isVisible={isCoffeeTransitioning} onDismiss={dismissCoffee} />
        </Suspense>
      )}

      {/* Portal de Cristal (Modal Exagerado) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-primary-bg/80 backdrop-blur-md md:backdrop-blur-xl cursor-pointer"
              onClick={() => setSelectedProject(null)}
            />

            {/* ─── CASA AURA MODAL — Split-screen moderno ─── */}
            {selectedProject.title === 'Casa Aura' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-7xl h-[90vh] bg-background border border-border rounded-[2rem] shadow-[0_0_140px_-30px_rgba(139,92,246,0.25)] overflow-hidden"
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-20 left-1/3 w-[500px] h-48 bg-violet-600/10 blur-[120px] rounded-full" />
                  <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-900/15 blur-[100px] rounded-full" />
                </div>

                {/* Top bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-border shrink-0 gap-4 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2">
                      <h2 className="font-montserrat font-black text-xl sm:text-2xl text-foreground tracking-tight">
                        Casa<span className="text-violet-400">Aura</span>
                      </h2>
                      <span className="text-muted-foreground text-xl hidden sm:inline">·</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest hidden sm:inline">
                        {`${auraFiltered.length} ${t('demozone.casa_aura_propiedades')}`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProject(null)
                        setWhatsappProp(null)
                      }}
                      className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all bg-black/30"
                      aria-label={t('demozone.close')}
                    >
                      <X size={22} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {(['todos', 'casa', 'depto'] as const).map((f) => (
                      <motion.button
                        key={f}
                        onClick={() => setPropFilter(f)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold border transition-all ${
                          propFilter === f
                            ? 'bg-violet-600 border-violet-500 text-foreground shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                            : 'border-border text-muted-foreground hover:border-violet-600/50 hover:text-violet-400 bg-muted'
                        }`}
                      >
                        {f === 'todos'
                          ? t('demozone.casa_aura_todos')
                          : f === 'casa'
                            ? `🏡 ${t('demozone.casa_aura_casas')}`
                            : `🏙 ${t('demozone.casa_aura_deptos')}`}
                      </motion.button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedProject(null)
                        setWhatsappProp(null)
                      }}
                      className="hidden sm:flex ml-3 min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all bg-black/30"
                      aria-label={t('demozone.close')}
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Body: split screen responsive */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* LEFT — Featured big property */}
                  <div className="lg:w-[52%] h-1/2 lg:h-full w-full shrink-0 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={auraFeatured.id}
                        className={`absolute inset-0 bg-cover bg-center bg-gradient-to-br ${auraFeatured.gradient}`}
                        style={
                          auraFeatured.image
                            ? { backgroundImage: `url(${auraFeatured.image})` }
                            : {}
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      />
                    </AnimatePresence>
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    {/* Tag badge */}
                    <motion.span
                      key={`tag-${auraFeatured.id}`}
                      className="absolute top-6 left-6 bg-violet-600/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {auraFeatured.tag}
                    </motion.span>
                    {/* Info panel bottom */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`info-${auraFeatured.id}`}
                        className="absolute bottom-0 left-0 right-0 p-7"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      >
                        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                          {auraFeatured.location}
                        </p>
                        <h3 className="text-foreground font-black text-3xl font-montserrat mb-3">
                          {auraFeatured.name}
                        </h3>
                        <div className="flex gap-4 mb-4">
                          {[
                            `🛏 ${auraFeatured.beds} ${t('demozone.casa_aura_hab')}`,
                            `🚿 ${auraFeatured.baths} ${t('demozone.casa_aura_banos')}`,
                            `📐 ${auraFeatured.m2} ${t('demozone.casa_aura_m2')}`,
                          ].map((s) => (
                            <span
                              key={s}
                              className="bg-muted backdrop-blur-sm text-foreground/80 text-xs px-3 py-1.5 rounded-full border border-border"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-violet-300 text-2xl font-black">
                            {auraFeatured.price}
                          </p>
                          <motion.button
                            onClick={() => {
                              setWhatsappProp(auraFeatured.id)
                              setTimeout(() => setWhatsappProp(null), 2000)
                            }}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-3 rounded-full transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={
                              whatsappProp === auraFeatured.id
                                ? {
                                    scale: [1, 1.12, 0.96, 1.05, 1],
                                    boxShadow: [
                                      '0 0 0px rgba(34,197,94,0)',
                                      '0 0 30px rgba(34,197,94,0.8)',
                                      '0 0 0px rgba(34,197,94,0)',
                                    ],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            <span className="text-base">📱</span> WhatsApp
                          </motion.button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* RIGHT — Thumbnail list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {auraFiltered.map((prop, i) => (
                        <motion.div
                          key={prop.id}
                          layout
                          className={`flex gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            (whatsappProp ?? 1) === prop.id ||
                            (!whatsappProp && prop.id === 1 && i === 0)
                              ? 'border-violet-500/60 bg-violet-600/8'
                              : 'border-border hover:border-border bg-muted hover:bg-muted'
                          }`}
                          onClick={() => setWhatsappProp(prop.id)}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ x: -2 }}
                        >
                          {/* Mini thumb */}
                          <div
                            className={`w-20 h-16 rounded-xl bg-gradient-to-br ${prop.gradient} shrink-0 flex items-center justify-center text-foreground/30 text-xs font-bold bg-cover bg-center relative overflow-hidden`}
                          >
                            {prop.image && (
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${prop.image})` }}
                              />
                            )}
                            {!prop.image && (prop.type === 'casa' ? '🏡' : '🏙')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <p className="text-foreground text-sm font-semibold truncate">
                                {prop.name}
                              </p>
                              <span className="text-muted-foreground text-[10px] shrink-0">
                                {prop.tag}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs truncate mt-0.5">
                              {prop.location}
                            </p>
                            <div className="flex items-center justify-between mt-1.5">
                              <p className="text-violet-400 text-sm font-black">{prop.price}</p>
                              <p className="text-muted-foreground text-[10px]">
                                {prop.m2}
                                {t('demozone.casa_aura_m2_short')} · {prop.beds}
                                {t('demozone.casa_aura_hab_short')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* WhatsApp toast */}
                <AnimatePresence>
                  {whatsappProp !== null && (
                    <motion.div
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-green-500 text-black font-bold px-6 py-3 rounded-full text-sm shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center gap-2"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      💬 {t('demozone.casa_aura_connecting')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : selectedProject.title === 'Pixel Coffee' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[88vh] bg-background border border-amber-700/50 rounded-[2rem] shadow-[0_0_120px_-20px_rgba(180,83,9,0.5)] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                {/* Background warm glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-900/30 blur-[120px] rounded-full" />
                  <div className="absolute top-0 right-1/4 w-64 h-64 bg-orange-900/20 blur-[80px] rounded-full" />
                </div>

                {/* Steam particles - Versión Atmosférica */}
                <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                  {steamParticles.map((p) => (
                    <motion.div
                      key={p.id}
                      className={`absolute bottom-0 bg-amber-100/5 rounded-full ${isMobile ? 'blur-[20px]' : 'blur-[40px]'}`}
                      style={{
                        width: p.width,
                        height: p.height,
                        left: p.left,
                        willChange: 'transform, opacity',
                      }}
                      animate={{
                        y: [0, -400, -900],
                        opacity: [0, 0.3, 0.5, 0.1, 0],
                        scale: [1, 2.5, isMobile ? 3 : 5],
                        x: [0, p.drift, p.drift / 2],
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>

                {/* Header */}
                <div className="px-8 pt-8 pb-5 border-b border-amber-900/40 flex items-center justify-between relative">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-500 font-bold mb-1">
                      {t('demozone.coffee_ecommerce')}
                    </p>
                    <h2 className="text-4xl sm:text-6xl font-montserrat font-black text-foreground">
                      Pixel <span className="text-amber-400">Coffee</span>
                    </h2>
                  </div>

                  {/* Cart icon with counter */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative p-4 bg-amber-900/40 border border-amber-700/40 rounded-2xl cursor-default"
                      animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <ShoppingCart size={24} className="text-amber-400" />
                      {cartItems.length > 0 && (
                        <motion.span
                          className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center"
                          key={cartItems.length}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {cartItems.length}
                        </motion.span>
                      )}
                    </motion.div>
                    <button
                      onClick={() => {
                        setSelectedProject(null)
                        setCartItems([])
                      }}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-amber-900/20 hover:bg-red-900/40 border border-amber-800/40 hover:border-red-700/60 rounded-full text-amber-400 hover:text-red-300 transition-all"
                      aria-label={t('demozone.close')}
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Toast notification */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm shadow-lg"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {toast}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products grid */}
                <div className="flex-1 overflow-auto p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {COFFEE_PRODUCTS.map((product) => (
                      <motion.div
                        key={product.id}
                        className="relative bg-card border border-amber-900/40 rounded-2xl p-5 flex flex-col gap-3 hover:border-amber-600/60 transition-colors"
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {/* Emoji big */}
                        <div className="text-5xl mb-1 text-center">{product.emoji}</div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t('demozone.coffee_origin')} {product.origin}
                          </p>
                        </div>
                        <p className="text-2xl font-black text-amber-400">
                          ${product.price.toFixed(2)}
                        </p>

                        {/* Flying animation from button */}
                        <AnimatePresence>
                          {flyingItem === product.id && (
                            <motion.div
                              className="absolute top-1/2 left-1/2 text-2xl z-20 pointer-events-none"
                              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                              animate={{ x: 200, y: -300, scale: 0.3, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, ease: 'easeIn' }}
                            >
                              {product.emoji}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          onClick={() => addToCart(product)}
                          className="mt-auto w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-600/40 text-amber-400 text-sm font-semibold hover:bg-amber-500/40 hover:text-amber-200 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={flyingItem === product.id}
                        >
                          {t('demozone.coffee_add')}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini checkout */}
                  {cartItems.length > 0 && (
                    <motion.div
                      className="mt-6 bg-card/80 border border-amber-700/30 rounded-2xl p-6 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div>
                        <p className="text-amber-500 text-sm">
                          {cartItems.length} {t('demozone.coffee_products_in_order')}
                        </p>
                        <p className="text-foreground text-2xl font-black mt-1">
                          {t('demozone.coffee_total')} $
                          {cartItems.reduce((s, i) => s + i.price, 0).toFixed(2)}
                        </p>
                      </div>
                      <motion.button
                        className="px-8 py-4 bg-amber-400 text-black font-black text-lg rounded-full hover:bg-amber-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(251,191,36,0.3)',
                            '0 0 40px rgba(251,191,36,0.6)',
                            '0 0 20px rgba(251,191,36,0.3)',
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ☕ {t('demozone.coffee_buy_now')}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : selectedProject.title === 'NeoFit Studio' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] bg-background border-2 border-yellow-400/60 rounded-[2rem] shadow-[0_0_120px_-10px_rgba(234,179,8,0.4)] overflow-hidden"
                initial={{ scale: 0.7, opacity: 0, y: 80 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.6, opacity: 0, y: 60 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                {/* Yellow scanlines decoration */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(234,179,8,0.03) 3px, rgba(234,179,8,0.03) 4px)',
                  }}
                />

                {/* Close */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-5 right-5 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/40 hover:bg-black/60 border border-yellow-400/50 hover:border-yellow-400/70 rounded-full text-yellow-400 transition-all duration-200 backdrop-blur-sm"
                  aria-label={t('demozone.close')}
                >
                  <X size={26} />
                </button>

                {/* Header */}
                <div className="px-10 pt-10 pb-6 border-b border-yellow-400/20 relative">
                  <div className="absolute top-0 left-0 w-72 h-32 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none" />
                  <p className="text-xs uppercase tracking-[0.4em] text-yellow-400 font-bold mb-2">
                    {t('demozone.neofit_web_membresias')}
                  </p>
                  <h2 className="text-5xl sm:text-7xl font-montserrat font-black text-foreground">
                    Neo<span className="text-yellow-400">Fit</span> Studio
                  </h2>
                  <p className="mt-3 text-lg text-muted-foreground max-w-xl">
                    {t('demozone.neofit_desc')}
                  </p>
                </div>

                {/* Membership Cards */}
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                    {/* BÁSICO */}
                    <motion.div
                      className="relative rounded-2xl border border-border bg-card/80 p-7 flex flex-col gap-4"
                      whileHover={{ y: -8, borderColor: 'rgba(234,179,8,0.4)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t('demozone.neofit_basico')}
                      </p>
                      <div className="text-5xl font-black text-foreground">
                        $29
                        <span className="text-lg text-muted-foreground">
                          {t('demozone.neofit_mes')}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground flex-1">
                        {[
                          'demozone.neofit_feat_basico_1',
                          'demozone.neofit_feat_basico_2',
                          'demozone.neofit_feat_basico_3',
                        ].map((k) => (
                          <li key={k} className="flex items-center gap-2">
                            <span className="text-yellow-400">✓</span>
                            {t(k)}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full border border-border text-muted-foreground text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                        {t('demozone.neofit_elegir')}
                      </button>
                    </motion.div>

                    {/* ELITE – destacado */}
                    <motion.div
                      className="relative rounded-2xl border-2 border-yellow-400 bg-yellow-400/5 p-7 flex flex-col gap-4 shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]"
                      animate={{
                        boxShadow: [
                          '0 0 30px -10px rgba(234,179,8,0.4)',
                          '0 0 60px -5px rgba(234,179,8,0.6)',
                          '0 0 30px -10px rgba(234,179,8,0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full tracking-wider">
                        ⚡ {t('demozone.neofit_mas_popular')}
                      </div>
                      <p className="text-xs uppercase tracking-widest text-yellow-400">
                        {t('demozone.neofit_elite')}
                      </p>
                      <div className="text-5xl font-black text-foreground">
                        $59
                        <span className="text-lg text-muted-foreground">
                          {t('demozone.neofit_mes')}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground flex-1">
                        {[
                          'demozone.neofit_feat_elite_1',
                          'demozone.neofit_feat_elite_2',
                          'demozone.neofit_feat_elite_3',
                          'demozone.neofit_feat_elite_4',
                        ].map((k) => (
                          <li key={k} className="flex items-center gap-2">
                            <span className="text-yellow-400">✓</span>
                            {t(k)}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors">
                        {t('demozone.neofit_empezar_ahora')}
                      </button>
                    </motion.div>

                    {/* BESTIA */}
                    <motion.div
                      className="relative rounded-2xl border border-border bg-card/80 p-7 flex flex-col gap-4"
                      whileHover={{ y: -8, borderColor: 'rgba(234,179,8,0.4)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t('demozone.neofit_bestia')}
                      </p>
                      <div className="text-5xl font-black text-foreground">
                        $99
                        <span className="text-lg text-muted-foreground">
                          {t('demozone.neofit_mes')}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground flex-1">
                        {[
                          'demozone.neofit_feat_bestia_1',
                          'demozone.neofit_feat_bestia_2',
                          'demozone.neofit_feat_bestia_3',
                          'demozone.neofit_feat_bestia_4',
                        ].map((k) => (
                          <li key={k} className="flex items-center gap-2">
                            <span className="text-yellow-400">✓</span>
                            {t(k)}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full border border-border text-muted-foreground text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                        {t('demozone.neofit_elegir')}
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : selectedProject.title === 'Salon Bloom' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] bg-background border border-pink-900/50 rounded-[2rem] shadow-[0_0_120px_-20px_rgba(236,72,153,0.3)] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-20 right-1/4 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full" />
                  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-900/20 blur-[100px] rounded-full" />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/40 hover:bg-pink-900/40 border border-pink-800/40 hover:border-pink-700/60 rounded-full text-pink-400 transition-all"
                  aria-label={t('demozone.close')}
                >
                  <X size={24} />
                </button>

                {/* Header */}
                <div className="px-10 pt-10 pb-6 border-b border-pink-900/20 relative">
                  <p className="text-sm uppercase tracking-[0.3em] text-pink-500 font-bold mb-2">
                    {t('demozone.bloom_landing')}
                  </p>
                  <h2 className="text-5xl font-montserrat font-black text-foreground">
                    Salon <span className="text-pink-500">Bloom</span>
                  </h2>
                  <p className="mt-3 text-lg text-muted-foreground max-w-xl">
                    {t('demozone.bloom_desc')}
                  </p>
                </div>

                {/* Body with 3D Carousel */}
                <div className="flex-1 overflow-hidden p-10 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-montserrat font-bold text-foreground uppercase tracking-[0.3em] mb-10 text-center">
                    {t('demozone.bloom_testimonials_heading')}
                  </h3>

                  {/* Carousel Container */}
                  <div
                    className="relative w-full max-w-4xl h-64 flex items-center justify-center"
                    style={{ perspective: 1000 }}
                  >
                    {TESTIMONIALS.map((testimonial, index) => {
                      const isActive = index === activeTestimonial
                      const isPrev =
                        index ===
                        (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                      const isNext = index === (activeTestimonial + 1) % TESTIMONIALS.length

                      let rotateY = 0
                      let translateZ = 0
                      let translateX = 0
                      let opacity = 0
                      let zIndex = 0

                      if (isActive) {
                        rotateY = 0
                        translateZ = 100
                        translateX = 0
                        opacity = 1
                        zIndex = 10
                      } else if (isPrev) {
                        rotateY = 45
                        translateZ = 0
                        translateX = -200
                        opacity = 0.5
                        zIndex = 5
                      } else if (isNext) {
                        rotateY = -45
                        translateZ = 0
                        translateX = 200
                        opacity = 0.5
                        zIndex = 5
                      } else {
                        opacity = 0
                      }

                      return (
                        <motion.div
                          key={testimonial.id}
                          className="absolute w-80 p-6 bg-muted backdrop-blur-xl border border-border rounded-2xl cursor-pointer"
                          style={{ transformStyle: 'preserve-3d' }}
                          animate={{
                            rotateY,
                            translateZ,
                            translateX,
                            opacity,
                            zIndex,
                          }}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                          onClick={() => setActiveTestimonial(index)}
                        >
                          <div className="text-4xl mb-4">{testimonial.avatar}</div>
                          <p className="text-muted-foreground font-inter text-sm mb-4">
                            "{t(testimonial.textKey)}"
                          </p>
                          <div>
                            <p className="text-foreground font-montserrat font-bold text-sm">
                              {testimonial.name}
                            </p>
                            <p className="text-pink-500 font-montserrat font-semibold text-xs">
                              {t(testimonial.roleKey)}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() =>
                        setActiveTestimonial(
                          (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                        )
                      }
                      className="p-3 bg-pink-500/20 border border-pink-500/40 rounded-full text-pink-400 hover:bg-pink-500/40 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
                      }
                      className="p-3 bg-pink-500/20 border border-pink-500/40 rounded-full text-pink-400 hover:bg-pink-500/40 transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ─── PORTAL GENÉRICO (resto de proyectos) ─── */
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] bg-gradient-to-br from-primary-bg/90 to-primary-bg/60 border border-accent-cyan/30 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,255,255,0.3)] overflow-hidden"
                initial={{ scale: 0.5, y: 150, opacity: 0, rotateX: 25 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, y: 100, opacity: 0, rotateX: -15 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-20 min-w-[48px] min-h-[48px] flex items-center justify-center bg-black/50 hover:bg-accent-magenta/30 border border-accent-cyan/30 hover:border-accent-magenta/60 rounded-full text-primary-text hover:text-foreground transition-all duration-200 backdrop-blur-md shadow-lg"
                  aria-label={t('demozone.close')}
                >
                  <X size={26} />
                </button>
                <div className="p-10 border-b border-accent-cyan/20 bg-gradient-to-r from-accent-cyan/10 to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-magenta/20 blur-[100px] rounded-full pointer-events-none" />
                  <p className="text-sm uppercase tracking-[0.3em] text-accent-cyan font-bold mb-3">
                    {selectedProject.category}
                  </p>
                  <h2 className="text-5xl sm:text-7xl font-montserrat font-black bg-gradient-to-r from-foreground via-primary-text to-primary-secondary bg-clip-text text-transparent">
                    {selectedProject.title}
                  </h2>
                  <p className="mt-4 text-xl text-primary-secondary max-w-3xl">
                    {selectedProject.summary}
                  </p>
                </div>
                <div className="flex-1 overflow-hidden relative bg-primary-bg/40 p-10 flex items-center justify-center">
                  <div className="w-full max-w-4xl h-full bg-background rounded-2xl border-4 border-primary-secondary/20 shadow-2xl overflow-hidden relative flex flex-col">
                    <div className="h-10 bg-primary-bg border-b border-primary-secondary/20 flex items-center px-6 gap-3 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full bg-accent-magenta/80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-accent-cyan/80" />
                      <div className="mx-auto w-1/3 h-5 bg-primary-secondary/10 rounded-full" />
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      {/* Digital Vapor / Data Particles */}
                      <div className="absolute inset-0 pointer-events-none z-10">
                        {digitalParticles.map((p) => (
                          <motion.div
                            key={p.id}
                            className="absolute w-1 h-1 bg-accent-cyan/20 rounded-full blur-[1px]"
                            style={{
                              left: p.left,
                              bottom: '-5%',
                              willChange: 'transform, opacity',
                            }}
                            animate={{
                              y: -600,
                              opacity: p.opacityKeyframes,
                              scale: p.scaleKeyframes,
                              x: [0, p.xDrift, 0],
                            }}
                            transition={{
                              duration: p.duration,
                              repeat: Infinity,
                              delay: p.delay,
                              times: p.flickerTimes,
                            }}
                          />
                        ))}
                      </div>
                      <motion.div
                        className="w-full h-[350%] bg-gradient-to-b from-primary-bg via-accent-cyan/5 to-accent-magenta/5"
                        animate={{ y: ['0%', '-65%'] }}
                        transition={{
                          duration: 25,
                          ease: 'linear',
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      >
                        <div className="p-12 space-y-16 opacity-60">
                          <div className="w-full h-80 bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 rounded-3xl border border-primary-secondary/10 flex items-center justify-center">
                            <div className="text-center space-y-6">
                              <div className="w-64 h-12 bg-primary-secondary/20 rounded-full mx-auto" />
                              <div className="w-96 h-6 bg-primary-secondary/10 rounded-full mx-auto" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-8">
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                          </div>
                          <div className="w-full h-48 bg-primary-secondary/10 rounded-3xl" />
                          <div className="grid grid-cols-2 gap-8">
                            <div className="h-96 bg-primary-secondary/10 rounded-2xl" />
                            <div className="space-y-6">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-16 bg-primary-secondary/10 rounded-xl" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default DemoZone
