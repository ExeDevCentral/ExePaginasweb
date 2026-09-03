import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ExternalLink,
  Calendar,
  ShoppingBag,
  Globe,
  CheckCircle2,
  Maximize2,
  X,
  Layers,
  ArrowUpRight,
  PlusCircle,
  Zap,
  FileText,
} from 'lucide-react'
import { scrollToElement } from '../shared/ScrollProvider'

export interface Project {
  id: string
  title: string
  category: 'saas' | 'ecommerce' | 'turnos' | 'web'
  categoryLabel: string
  client: string
  description: string
  image: string
  tags: string[]
  metrics: { label: string; value: string }[]
  highlights: string[]
  link?: string
  status?: 'live' | 'demo' | 'building'
  statusLabel?: string
}

// Proyectos reales desplegados en producción Vercel
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'chispa32',
    title: 'Chispa32 — Taller ESP32',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Chispa32 · Rosario, Argentina',
    description:
      'Landing de alta conversión para taller especializado en reparación y reflasheo de placas ESP32. Diseño técnico premium con propuesta de valor clara, servicios y contacto directo.',
    image: '/portfolio/chispa32.png',
    tags: ['Next.js', 'Tailwind', 'SEO', 'Landing'],
    metrics: [
      { label: 'Stack', value: 'Next.js' },
      { label: 'Tipo', value: 'Landing' },
    ],
    highlights: [
      'Diseño orientado a nicho técnico (ESP32 / IoT)',
      'Sección de servicios y consultas a medida',
      'Despliegue automático en producción Vercel',
      'Optimización de carga y SEO técnico',
    ],
    link: 'https://chispa32.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'gam',
    title: 'Taller Artesanal GAM',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'GAM · Restauración de Máquinas de Escribir',
    description:
      'Web dedicada a la restauración artesanal de máquinas de escribir. Estética vintage-premium que posiciona el oficio, muestra el taller y facilita el contacto para trabajos de restauración.',
    image: '/portfolio/gam.png',
    tags: ['Vite', 'Tailwind', 'Vintage', 'Landing'],
    metrics: [
      { label: 'Stack', value: 'Vite' },
      { label: 'Tipo', value: 'Landing' },
    ],
    highlights: [
      'Identidad visual artesanal y premium',
      'Refleja el oficio de restauración',
      'Carga ultrarrápida (Vite)',
      'Desplegada en producción',
    ],
    link: 'https://restauracion-maquinas-gam.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'chambea',
    title: 'Chambea — Profesionales de Oficio',
    category: 'ecommerce',
    categoryLabel: 'Marketplace',
    client: 'Chambea · Marketplace de Servicios',
    description:
      'Marketplace de servicios locales que conecta profesionales de oficio con clientes. Gestión de perfiles, fichas de servicio, Supabase y experiencia de usuario optimizada para conversión.',
    image: '/portfolio/chambea.png',
    tags: ['React', 'Vite', 'Supabase', 'Marketplace'],
    metrics: [
      { label: 'Stack', value: 'React' },
      { label: 'Servicios', value: 'Marketplace' },
    ],
    highlights: [
      'Conexión profesionales de oficio ↔ clientes',
      'Backend con Supabase (auth + datos)',
      'Fichas de servicio y perfiles',
      'Flujo de contacto optimizado',
    ],
    link: 'https://chambea.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'noema',
    title: 'Noema — Investigación de Mercado',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Noema Consultora · Asunción, Paraguay',
    description:
      'Sitio corporativo ejecutivo para consultora de investigación de mercado cualitativa y cuantitativa. Calculadora interactiva de diagnóstico metodológico, dashboard de Data Insights con Chart.js, formulario de contacto vía serverless y diseño glassmorphism con tema oscuro.',
    image: '/portfolio/noema.png',
    tags: ['React', 'TypeScript', 'Vite', 'Chart.js', 'SEO'],
    metrics: [
      { label: 'Stack', value: 'React + Vite' },
      { label: 'Features', value: 'Calculadora + Charts' },
    ],
    highlights: [
      'Calculadora interactiva de diagnóstico metodológico',
      'Dashboard de Data Insights (Chart.js)',
      'Diseño glassmorphism con tema oscuro (#11171D)',
      'SEO con JSON-LD Schema.org y Open Graph',
      'Formulario con Vercel Serverless Functions',
      'Alineación ESOMAR & ISO 20252',
    ],
    link: 'https://noema-ivory.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'celstore',
    title: 'CelStore — Atelier 3D & E-commerce',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce',
    client: 'CelStore · Atelier Generacional & 3D Studio',
    description:
      'Tienda online con experiencia 3D (Three.js), sistema de boutiques, catálogo de accesorios y pasarela de pago MercadoPago. E-commerce visual premium con panel de administración.',
    image: '/portfolio/celstore.svg',
    tags: ['Next.js', 'Three.js', '3D', 'MercadoPago'],
    metrics: [
      { label: 'Stack', value: 'Next.js' },
      { label: 'Pagos', value: 'MercadoPago' },
    ],
    highlights: [
      'Experiencia visual 3D con Three.js',
      'E-commerce con catálogo de boutiques y accesorios',
      'Pagos integrados con MercadoPago',
      'Panel de administración propio',
    ],
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'coleccion-patrimonial',
    title: 'Colección Patrimonial & Archivo Histórico',
    category: 'web',
    categoryLabel: 'Landing & Web',
    client: 'Colección Patrimonial · Chile',
    description:
      'Museo digital de un fondo histórico chileno con vocación de donación museográfica: catálogo curatorial de libros antiguos, cerámica colonial con pan de oro, manuscritos republicanos, obras de arte y máquinas de escribir de época, con protocolo formal de donación a instituciones.',
    image: '/portfolio/coleccion-patrimonial.svg',
    tags: ['React', 'Vite', 'Tailwind', 'Museo Digital'],
    metrics: [
      { label: 'Stack', value: 'Vite' },
      { label: 'Tipo', value: 'Museo Digital' },
    ],
    highlights: [
      'Vitrina interactiva con lupa curatorial y piezas en 3D',
      'Catálogo de piezas con estado de conservación y procedencia',
      'Línea de tiempo histórica y filosofía curatorial',
      'Protocolo de donación museográfica a museos de Chile',
    ],
    link: 'https://coleccion-patrimonial-chile.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
  {
    id: 'bilex',
    title: 'Bilex — Traductor de PDFs e Imágenes',
    category: 'web',
    categoryLabel: 'Herramienta Web',
    client: 'Bilex · Herramienta de Traducción Bilingüe',
    description:
      'Aplicación web para traducir documentos completos (PDFs e imágenes) con vista dual bilingüe sincronizada. OCR con Tesseract.js, múltiples motores de traducción (Gemini, Groq, DeepL, OpenAI, Claude), exportación a PDF, TXT, Markdown y sesiones JSON.',
    image: '/portfolio/bilex.svg',
    tags: ['React', 'TypeScript', 'Vite', 'OCR', 'PDF', 'Traducción'],
    metrics: [
      { label: 'Stack', value: 'React + Vite' },
      { label: 'Tipo', value: 'Herramienta OCR/IA' },
    ],
    highlights: [
      'Extracción de texto de PDFs digitales y escaneados (OCR WASM)',
      'Lector bilingüe dual sincronizado párrafo a párrafo',
      '7 motores de traducción modulares con modo demo offline',
      'Exportación multi-formato: PDF bilingüe, TXT, Markdown, JSON',
      'Detección automática de idioma con franc-min',
      'Tema oscuro/claro y diseño responsive',
    ],
    link: 'https://dualdoc-translate.vercel.app',
    status: 'live',
    statusLabel: 'EN PRODUCCIÓN',
  },
]

export const PortfolioSection: React.FC = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const CATEGORIES = [
    { id: 'all', label: t('portfolio.cat_todos', 'Todos los Proyectos'), icon: Layers },
    { id: 'turnos', label: t('portfolio.cat_turnos', 'Turnos & Reservas'), icon: Calendar },
    { id: 'ecommerce', label: t('portfolio.cat_ecommerce', 'E-Commerce'), icon: ShoppingBag },
    { id: 'web', label: t('portfolio.cat_web', 'Landings & Web'), icon: Globe },
  ]

  const hasProjects = INITIAL_PROJECTS.length > 0
  const filteredProjects =
    activeCategory === 'all'
      ? INITIAL_PROJECTS
      : INITIAL_PROJECTS.filter((p) => p.category === activeCategory)

  return (
    <section id="portafolio" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Glows de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Encabezado Profesional */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-400">
              PORTAFOLIO & EXPERIENCIA PROFESIONAL
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black font-montserrat tracking-tight text-foreground mb-4"
          >
            {t('portfolio.titulo', 'Portafolio Profesional')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto"
          >
            {t(
              'portfolio.subtitulo',
              'Desarrollos reales con arquitectura moderna, código propio y despliegue en la nube. Podés consultar mi trayectoria técnica completa en mi CV online o solicitar una propuesta personalizada para tu proyecto.'
            )}
          </motion.p>

          {/* Acceso a CV Profesional */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="https://cv-xi-swart.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-extrabold text-xs sm:text-sm hover:scale-105 transition-all shadow-xl shadow-purple-500/25 border border-white/25 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>📄 {t('portfolio.ver_cv', 'Ver Mi CV Profesional Completo')}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Si hay proyectos cargados, renderiza filtros y grid */}
        {hasProjects ? (
          <>
            {/* Botones de Categorías */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-white shadow-lg shadow-accent-cyan/20 scale-105'
                        : 'bg-card/70 hover:bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Grid interactivo de proyectos */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="group rounded-3xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-accent-cyan/40 transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Imagen del proyecto + Overlay interactivo */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                      {/* Estado / Badge de proyecto */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                        <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-black text-emerald-400 flex items-center gap-1.5 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {project.statusLabel || t('portfolio.en_produccion', 'EN PRODUCCIÓN')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold text-accent-cyan">
                          {project.categoryLabel}
                        </span>
                      </div>

                      {/* Acceso rápido a link */}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-background/90 backdrop-blur-md border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-background transition-all duration-300 shadow-lg flex items-center justify-center"
                          title="Abrir enlace directo en producción"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}

                      {/* Título en tarjeta */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[11px] font-semibold text-accent-cyan uppercase tracking-wider block mb-0.5">
                          {project.client}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground font-montserrat leading-tight group-hover:text-accent-cyan transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Contenido & Detalles */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      {/* Métricas destacadas */}
                      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="text-sm sm:text-base font-black text-foreground font-montserrat">
                              {m.value}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tags tecnológicos */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tTag) => (
                          <span
                            key={tTag}
                            className="px-2 py-0.5 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 text-[10px] font-semibold text-accent-cyan"
                          >
                            {tTag}
                          </span>
                        ))}
                      </div>

                      {/* Acciones principales */}
                      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="text-[11px] font-bold text-foreground hover:text-accent-cyan flex items-center gap-1 transition-colors"
                        >
                          <Maximize2 className="w-3 h-3" />
                          {t('portfolio.detalles', 'Detalles')}
                        </button>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-accent-cyan text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t('portfolio.ver_en_vivo', 'Ver en Vivo')}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Tarjeta dinámica de "+ Tu Proyecto Custom" */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                  className="rounded-3xl border-2 border-dashed border-accent-cyan/40 bg-card/40 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-accent-cyan hover:bg-card/70 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-montserrat text-foreground mb-1">
                      {t(
                        'portfolio.custom_card_titulo',
                        '¿Querés tu sitio o sistema en producción?'
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      {t(
                        'portfolio.custom_card_desc',
                        'Creamos desarrollos a medida con código propio y despliegue rápido.'
                      )}
                    </p>
                  </div>

                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToElement('#contact')
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-cyan text-background font-bold text-xs uppercase tracking-wider hover:bg-accent-cyan/90 transition-all shadow-md cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {t('portfolio.pedir_presupuesto', 'Pedir Presupuesto')}
                  </a>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          /* Vista destacada cuando no hay proyectos individuales en lista */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl border border-accent-cyan/30 bg-card/70 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-magenta/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex p-3 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan mb-2">
                <Zap className="w-8 h-8" />
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-montserrat text-foreground tracking-tight">
                {t(
                  'portfolio.banner_titulo',
                  '¿Tenés un proyecto o sistema para llevar a producción?'
                )}
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t(
                  'portfolio.banner_desc',
                  'Desarrollamos soluciones web a medida de punta a punta: desde plataformas SaaS y sistemas de agendamiento de turnos, hasta tiendas e-commerce de alto impacto y landings corporativas ultra-rápidas.'
                )}
              </p>

              {/* Grid de capacidades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-left">
                <div className="p-4 rounded-2xl bg-background/60 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-accent-cyan font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('portfolio.cap_saas', 'SaaS & Cloud')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'portfolio.cap_saas_desc',
                      'Paneles administrativos, gestión de datos y arquitecturas escalables.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-background/60 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-accent-cyan font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('portfolio.cap_ecommerce', 'E-Commerce')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'portfolio.cap_ecommerce_desc',
                      'Tiendas online con pasarelas de pago y conversión optimizada.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-background/60 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-accent-cyan font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('portfolio.cap_turnos', 'Turnos Online')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'portfolio.cap_turnos_desc',
                      'Agendamiento en tiempo real sin registro obligatorio ni fricción.'
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-background/60 border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-accent-cyan font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('portfolio.cap_webs', 'Webs & Landings')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'portfolio.cap_webs_desc',
                      'Carga ultrarrápida, SEO técnico de primer nivel y diseño moderno.'
                    )}
                  </p>
                </div>
              </div>

              {/* Botón CTA */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToElement('#contact')
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-accent-cyan/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>{t('portfolio.cta_cotizar', 'Cotizar Mi Proyecto a Medida')}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Detalle Completo del Proyecto */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              role="dialog"
              aria-modal="true"
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    EN PRODUCCIÓN
                  </span>
                  <span className="px-3 py-1 rounded-full bg-accent-cyan/20 text-accent-cyan font-bold text-xs uppercase tracking-wider">
                    {selectedProject.categoryLabel}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground font-montserrat">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Cliente / Dominio: {selectedProject.client}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border h-60 sm:h-72 bg-muted">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Resumen del Desarrollo
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Características Clave
                </h4>
                <div className="space-y-2">
                  {selectedProject.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  Cerrar
                </button>

                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-accent-cyan text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Sitio en Producción
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default PortfolioSection
