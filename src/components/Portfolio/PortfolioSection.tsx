/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
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
import HudButton from '@/components/HudButton'
import LiveSystemLauncherButton from '@/components/ui/LiveSystemLauncherButton'
import { INITIAL_PROJECTS, type Project } from '@/data/projects'

export const PortfolioSection: React.FC<{ featuredOnly?: boolean }> = ({
  featuredOnly = false,
}) => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const CATEGORIES = [
    { id: 'all', label: t('portfolio.cat_todos', 'Todos los Proyectos'), icon: Layers },
    { id: 'saas', label: 'SaaS & Seguridad', icon: Zap },
    { id: 'turnos', label: t('portfolio.cat_turnos', 'Turnos & Reservas'), icon: Calendar },
    { id: 'ecommerce', label: t('portfolio.cat_ecommerce', 'E-Commerce'), icon: ShoppingBag },
    { id: 'web', label: t('portfolio.cat_web', 'Landings & Web'), icon: Globe },
  ]

  const hasProjects = INITIAL_PROJECTS.length > 0
  const filteredProjects =
    activeCategory === 'all'
      ? INITIAL_PROJECTS
      : INITIAL_PROJECTS.filter((p) => p.category === activeCategory)
  const FEATURED_IDS = ['restoai', 'sportmanager', 'owleye']
  const visibleProjects = featuredOnly
    ? FEATURED_IDS.map((id) => INITIAL_PROJECTS.find((p) => p.id === id)).filter(
        (p): p is Project => Boolean(p)
      )
    : filteredProjects

  return (
    <section id="portafolio" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Glows de fondo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-linear-to-r from-accent-cyan/10 to-accent-magenta/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Encabezado Editorial Técnico */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] border border-brand/30 bg-brand/10 backdrop-blur-md mb-4 font-mono text-xs text-brand"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-bold uppercase tracking-wider">
              FIG. 03 — LÁMINAS DE OBRA // CASOS DE ESTUDIO
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-4"
          >
            Arquitectura de Software en{' '}
            <span className="font-serif italic text-brand">producción real</span>
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
              'Sistemas web con código propio, aislamiento de datos, conciliación automática y despliegue en la nube para empresas que escalan sus ingresos.'
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
            <HudButton
              href="https://cv-xi-swart.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              label={t('portfolio.ver_cv', 'Ver Mi CV Profesional Completo')}
              icon={<FileText className="w-3.5 h-3.5 text-brand" />}
              iconPosition="left"
            />
          </motion.div>
        </div>

        {/* Si hay proyectos cargados, renderiza filtros y grid */}
        {hasProjects ? (
          <>
            {/* Botones de Categorías */}
            {!featuredOnly && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] font-mono text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-brand/15 border border-brand text-brand shadow-xs'
                          : 'bg-card/70 hover:bg-card border border-border dark:border-border-tech text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Grid de Láminas de Obra */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProjects.map((project, idx) => (
                <div key={project.id} className="h-full flex flex-col">
                  {/* Lámina Técnica con marcas de esquina */}
                  <div className="relative h-full flex flex-col justify-between bg-card/90 dark:bg-card/70 border border-border dark:border-border-tech rounded-[3px] transition-colors duration-200 hover:border-brand/60 group">
                    {/* Marcas de registro en esquinas */}
                    <span
                      className="absolute -top-1.5 -left-1 text-xs font-mono text-brand select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span
                      className="absolute -top-1.5 -right-1 text-xs font-mono text-brand select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span
                      className="absolute -bottom-1.5 -left-1 text-xs font-mono text-brand select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span
                      className="absolute -bottom-1.5 -right-1 text-xs font-mono text-brand select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      +
                    </span>

                    {/* Cota estática de lámina */}
                    <span
                      className="absolute top-2 right-2 z-20 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-[2px] bg-background/90 border border-border dark:border-border-tech text-brand"
                      aria-hidden="true"
                    >
                      LÁMINA 0{idx + 1} // 2025
                    </span>

                    {/* Imagen del proyecto */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-900 border-b border-border dark:border-border-tech">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                      {/* Estado / Badge de proyecto */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-0.5 rounded-[2px] bg-slate-950/90 border border-brand/50 text-[10px] font-mono text-brand flex items-center gap-1.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                          {project.statusLabel || t('portfolio.en_produccion', 'EN PRODUCCIÓN')}
                        </span>
                      </div>

                      {/* Acceso rápido a link externo */}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ver sitio web de ${project.title} en producción`}
                          className="absolute bottom-3 right-3 p-1.5 rounded-[2px] bg-slate-950/90 border border-border dark:border-border-tech text-brand hover:bg-brand hover:text-slate-950 transition-colors shadow-xs flex items-center justify-center"
                          title={`Ver sitio web de ${project.title} en producción`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}

                      {/* Título en tarjeta */}
                      <div className="absolute bottom-2.5 left-3 right-12">
                        <span className="text-[10px] font-mono text-brand uppercase tracking-wider block mb-0.5">
                          {project.client}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-display leading-tight group-hover:text-brand transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Contenido & Detalles */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.2rem]">
                        {project.description}
                      </p>

                      {/* Métricas destacadas en estilo técnico */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[2px] bg-paper border border-border dark:border-border-tech text-center">
                        {project.metrics.map((m) => (
                          <div key={m.label}>
                            <div className="text-sm font-bold text-foreground font-mono">
                              {m.value}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tags tecnológicos */}
                      <div className="flex flex-wrap gap-1 min-h-6">
                        {project.tags.map((tTag) => (
                          <span
                            key={tTag}
                            className="px-2 py-0.5 rounded-[2px] bg-brand/10 border border-brand/20 text-[10px] font-mono text-brand"
                          >
                            {tTag}
                          </span>
                        ))}
                      </div>

                      {/* Acciones principales con botón de lanzamiento directo */}
                      <div className="pt-3 border-t border-border dark:border-border-tech flex flex-wrap items-center justify-between gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="text-xs font-mono text-muted-foreground hover:text-brand flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                        >
                          <Maximize2 className="w-3 h-3 text-brand" />
                          <span>{t('portfolio.detalles', 'FICHA TÉCNICA')}</span>
                        </button>

                        {project.link && (
                          <LiveSystemLauncherButton
                            label={
                              project.id === 'sportmanager'
                                ? 'PROBAR PÁDEL EN VIVO 🎾'
                                : project.id === 'celstore'
                                  ? 'PROBAR TIENDA 3D 🛒'
                                  : project.id === 'restoai'
                                    ? 'PROBAR RESTOIA 🍷'
                                    : project.id === 'owleye'
                                      ? 'TESTEAR RADAR 🛡️'
                                      : 'LANZAR APP EN VIVO'
                            }
                            sublabel="PRODUCCIÓN · DIRECTO"
                            href={project.link}
                            icon={
                              project.id === 'sportmanager'
                                ? '🎾'
                                : project.id === 'celstore'
                                  ? '🛒'
                                  : project.id === 'restoai'
                                    ? '🍷'
                                    : project.id === 'owleye'
                                      ? '🛡️'
                                      : '⚡'
                            }
                            color={
                              project.id === 'sportmanager'
                                ? 'cyan'
                                : project.id === 'celstore'
                                  ? 'fuchsia'
                                  : project.id === 'restoai'
                                    ? 'amber'
                                    : 'emerald'
                            }
                            compact
                          />
                        )}
                      </div>
                    </div>

                    {/* Cajetín Técnico de Obra (Title Block) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-border dark:border-border-tech font-mono text-[11px] bg-paper divide-x divide-border dark:divide-border-tech">
                      <div className="p-2 sm:p-2.5">
                        <span
                          className="text-[9px] uppercase text-muted-foreground block"
                          aria-hidden="true"
                        >
                          SISTEMA
                        </span>
                        <span className="font-semibold text-foreground truncate block">
                          {project.client}
                        </span>
                      </div>
                      <div className="p-2 sm:p-2.5">
                        <span
                          className="text-[9px] uppercase text-muted-foreground block"
                          aria-hidden="true"
                        >
                          STACK
                        </span>
                        <span className="text-muted-foreground truncate block">
                          {project.tags[0] || 'Next.js'}
                        </span>
                      </div>
                      <div className="p-2 sm:p-2.5">
                        <span
                          className="text-[9px] uppercase text-muted-foreground block"
                          aria-hidden="true"
                        >
                          MÉTRICA
                        </span>
                        <span className="font-bold text-brand truncate block">
                          {project.metrics[0]?.value}
                        </span>
                      </div>
                      <div className="p-2 sm:p-2.5">
                        <span
                          className="text-[9px] uppercase text-muted-foreground block"
                          aria-hidden="true"
                        >
                          AÑO // ESTADO
                        </span>
                        <span className="text-brand font-medium truncate block">
                          2025 // ACTIVO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tarjeta de "+ Tu Proyecto Custom" estilo Lámina Técnica */}
              <div className="relative rounded-[3px] border border-dashed border-brand/40 bg-card/40 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-brand hover:bg-card/70 transition-colors duration-200 min-h-95">
                <span
                  className="absolute -top-1.5 -left-1 text-xs font-mono text-brand select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </span>
                <span
                  className="absolute -top-1.5 -right-1 text-xs font-mono text-brand select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </span>
                <span
                  className="absolute -bottom-1.5 -left-1 text-xs font-mono text-brand select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </span>
                <span
                  className="absolute -bottom-1.5 -right-1 text-xs font-mono text-brand select-none pointer-events-none"
                  aria-hidden="true"
                >
                  +
                </span>

                <div className="w-10 h-10 rounded-[2px] bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
                  <PlusCircle className="w-5 h-5" />
                </div>

                <div>
                  <span className="font-mono text-[10px] text-brand uppercase tracking-wider block mb-1">
                    OBRA A MEDIDA // 2025
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-display text-foreground mb-1">
                    {t('portfolio.custom_card_titulo', '¿Querés tu sistema en producción?')}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {t(
                      'portfolio.custom_card_desc',
                      'Creamos desarrollos a medida con 100% código propio, arquitectura robusta y despliegue llave en mano.'
                    )}
                  </p>
                </div>

                <HudButton
                  href="/cotizador"
                  size="sm"
                  variant="primary"
                  label={t('portfolio.pedir_presupuesto', 'Iniciar Proyecto [1:1]')}
                  icon={<Zap className="w-3.5 h-3.5" />}
                  iconPosition="left"
                />
              </div>
            </div>
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
                <HudButton
                  href="/cotizador"
                  variant="primary"
                  size="md"
                  label={t('portfolio.cta_cotizar', 'Cotizar Mi Proyecto a Medida')}
                  icon={<Zap className="w-4 h-4" />}
                  iconPosition="left"
                />

                {featuredOnly && (
                  <HudButton
                    href="/portafolio"
                    variant="secondary"
                    size="md"
                    label={t('portfolio.ver_todos', 'Ver todos los proyectos')}
                    icon={<ArrowUpRight className="w-4 h-4 text-accent-cyan" />}
                    iconPosition="right"
                  />
                )}
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
                    <span>EN PRODUCCIÓN</span>
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
                  <LiveSystemLauncherButton
                    label={
                      selectedProject.id === 'sportmanager'
                        ? 'ABRIR SPORTMANAGER (PÁDEL) EN VIVO 🎾'
                        : selectedProject.id === 'celstore'
                          ? 'ABRIR TIENDA CELSTORE 3D 🛒'
                          : selectedProject.id === 'restoai'
                            ? 'ABRIR RESTOIA EN VIVO 🍷'
                            : 'ABRIR SISTEMA EN PRODUCCIÓN'
                    }
                    sublabel="ACCESO DIRECTO · DESPLEGADO EN VERCEL"
                    href={selectedProject.link}
                    icon={
                      selectedProject.id === 'sportmanager'
                        ? '🎾'
                        : selectedProject.id === 'celstore'
                          ? '🛒'
                          : selectedProject.id === 'restoai'
                            ? '🍷'
                            : '⚡'
                    }
                    color={
                      selectedProject.id === 'sportmanager'
                        ? 'cyan'
                        : selectedProject.id === 'celstore'
                          ? 'fuchsia'
                          : selectedProject.id === 'restoai'
                            ? 'amber'
                            : 'emerald'
                    }
                  />
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
