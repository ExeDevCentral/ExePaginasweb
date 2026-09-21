/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Landmark,
  MousePointerClick,
  Power,
  RotateCcw,
  TrendingDown,
  Activity,
  FileSignature,
  Bot,
  Mail,
  MessageCircle,
  MessageSquare,
  Plus,
  Sparkles,
  BadgeCheck,
  Terminal,
  RefreshCw,
  Workflow,
  Globe,
  Database,
  CreditCard,
  Receipt,
  BarChart3,
  Webhook,
  Bell,
  Calendar,
  MapPin,
  HardDriveDownload,
  KeyRound,
  Smartphone,
  Search,
  Share2,
  Send,
  FileSpreadsheet,
  Users,
  Headphones,
  Video,
  Languages,
  Coins,
  PenLine,
  LockKeyhole,
  ChartLine,
  ShieldAlert,
} from 'lucide-react'

const MONTHLY_RENTAL = 49
const DEV_COST = 1500
const YEARS = 5

function fmtUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtUsdC(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function rentalCost(year: number): number {
  return MONTHLY_RENTAL * 12 * year
}

function savingsAt(year: number): number {
  return Math.max(0, rentalCost(year) - DEV_COST)
}

/* ============================================================
   Mini mock de sitio web (esqueleto tipo landing)
   ============================================================ */
function SiteSkeleton({ url, tone }: { url: string; tone: 'emerald' | 'rose' }) {
  const isOwn = tone === 'emerald'
  const barColor = isOwn ? 'bg-own-400/60' : 'bg-rent-400/50'
  return (
    <div className="dark-card rounded-xl overflow-hidden">
      {/* Barra del navegador */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/80 bg-surface-0/90">
        <span className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-rent-400/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-own-400/70" />
        </span>
        <span className="flex-1 mx-2 flex items-center justify-center">
          <span className="px-3 py-0.5 rounded-md bg-surface-2 text-[10px] font-mono text-text-mid truncate max-w-full">
            {url}
          </span>
        </span>
      </div>
      {/* Contenido simulando el sitio */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <div className={`w-8 h-2 rounded ${barColor}`} />
          <div className="h-1.5 bg-surface-2/70 rounded flex-1 max-w-[40%]" />
          <div className="h-1.5 bg-surface-2/70 rounded flex-1 max-w-[15%]" />
          <div className="h-1.5 bg-surface-2/70 rounded flex-1 max-w-[15%]" />
        </div>
        <div className="h-8 rounded-md bg-surface-2/80" />
        <div className="h-2.5 w-3/4 rounded bg-surface-2/60" />
        <div className="h-2.5 w-1/2 rounded bg-surface-2/40" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="h-10 rounded-md bg-surface-2/80" />
          <div className="h-10 rounded-md bg-surface-2/80" />
          <div className="h-10 rounded-md bg-surface-2/80" />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Card 1 — Escritura Digital de Propiedad (modelo propio)
   ============================================================ */

/* Carrusel con frenada/arranque suave: velocidad fija en px/s con
   playbackRate difuminado (cubic-ish) en hover, respetando reduced-motion. */
function useSmoothMarquee(speed = 45) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const wrap = wrapRef.current
    const el = trackRef.current
    if (!wrap || !el) return
    if (reduceMotion) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const half = el.scrollWidth / 2 // la lista está duplicada
    if (!half) return

    const anim = el.animate(
      [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${-half}px, 0, 0)` }],
      { duration: (half / speed) * 1000, iterations: Infinity, easing: 'linear' }
    )

    let target = 1
    let rate = 1
    let raf = 0
    const step = () => {
      rate += (target - rate) * 0.08 // suaviza frenada y arranque
      if (Math.abs(target - rate) < 0.005) rate = target
      anim.playbackRate = rate
      if (rate !== target) raf = requestAnimationFrame(step)
    }
    const go = (t: number) => {
      target = t
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(step)
    }
    const onEnter = () => go(0)
    const onLeave = () => go(1)

    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      anim.cancel()
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [speed, reduceMotion])

  return { wrapRef, trackRef }
}

function DeedCard() {
  const { t } = useTranslation()
  const { wrapRef, trackRef } = useSmoothMarquee(45)
  const [alive, setAlive] = React.useState(false)
  const [verified, setVerified] = React.useState(false)
  const docRef = React.useRef<HTMLDivElement>(null)
  const docInView = useInView(docRef, { once: true, amount: 0.3 })

  React.useEffect(() => {
    if (!docInView) return
    const id = window.setTimeout(() => setVerified(true), 2200)
    return () => window.clearTimeout(id)
  }, [docInView])

  const fields = [
    {
      label: t('versus.escritura_folio_label', 'Folio'),
      value: t('versus.escritura_folio', 'EXE-2026-0001'),
      mono: true,
    },
    {
      label: t('versus.escritura_titular_label', 'Titular'),
      value: t('versus.escritura_titular', 'Tu negocio'),
      mono: false,
    },
    {
      label: t('versus.escritura_repo_label', 'Repositorio'),
      value: `${t('versus.escritura_repo', 'main')} @ ec79e31`,
      mono: true,
    },
    {
      label: t('versus.escritura_docs_label', 'Documentación'),
      value: t('versus.escritura_docs', 'Completa'),
      mono: false,
    },
    {
      label: t('versus.escritura_objeto_label', 'Objeto'),
      value: t('versus.escritura_objeto', 'Software a medida + código fuente'),
      mono: false,
    },
    {
      label: t('versus.escritura_entrega_label', 'Entrega'),
      value: t('versus.escritura_entrega', 'Día de GO-LIVE'),
      mono: true,
    },
  ]

  const steps = [
    t('versus.propiedad_step1', 'Pagás por desarrollo'),
    t('versus.propiedad_step2', 'Diseño personalizado'),
    t('versus.propiedad_step3', 'Funciones específicas'),
    t('versus.propiedad_step4', 'Automatizaciones'),
    t('versus.propiedad_step5', 'Código del proyecto'),
    t('versus.propiedad_step6', 'El negocio es dueño de su software'),
  ]

  const extras: { label: string; Icon: typeof Bot; more?: boolean }[] = [
    { label: t('versus.extra_ai', 'Agentes de IA'), Icon: Bot, more: true },
    { label: t('versus.extra_n8n', 'n8n · Automatizaciones'), Icon: Workflow, more: true },
    { label: t('versus.extra_apis', 'APIs externas de todo el mundo'), Icon: Globe, more: true },
    { label: t('versus.extra_tributario', 'Servicio tributario de capa país'), Icon: Landmark },
    { label: t('versus.extra_bd', 'Base de datos propia'), Icon: Database },
    { label: t('versus.extra_pagos', 'Pagos y facturación'), Icon: CreditCard },
    { label: t('versus.extra_recibos', 'Recibos electrónicos'), Icon: Receipt },
    { label: t('versus.extra_dashboard', 'Dashboard de analítica'), Icon: BarChart3 },
    { label: t('versus.extra_webhooks', 'Webhooks propios'), Icon: Webhook },
    { label: t('versus.extra_notificaciones', 'Push & notificaciones'), Icon: Bell },
    { label: t('versus.extra_agenda', 'Reservas y agenda'), Icon: Calendar },
    { label: t('versus.extra_maps', 'Mapas y ubicación'), Icon: MapPin },
    { label: t('versus.extra_backups', 'Backups automáticos'), Icon: HardDriveDownload },
    { label: t('versus.extra_roles', 'Accesos y roles'), Icon: KeyRound },
    { label: t('versus.extra_pwa', 'App móvil / PWA'), Icon: Smartphone },
    { label: t('versus.extra_seo', 'SEO integrado'), Icon: Search },
    { label: t('versus.extra_redes', 'Redes conectadas'), Icon: Share2 },
    { label: t('versus.extra_emails', 'Emails transaccionales'), Icon: Send },
    { label: t('versus.extra_import', 'Importar/exportar datos'), Icon: FileSpreadsheet },
    { label: t('versus.extra_crm', 'CRM de clientes'), Icon: Users },
    { label: t('versus.extra_soporte', 'Soporte y tickets'), Icon: Headphones },
    { label: t('versus.extra_videollamada', 'Video llamadas'), Icon: Video },
    { label: t('versus.extra_idiomas', 'Multi-idioma'), Icon: Languages },
    { label: t('versus.extra_planes', 'Planes y suscripciones'), Icon: Coins },
    { label: t('versus.extra_blog', 'Blog / contenidos'), Icon: PenLine },
    { label: t('versus.extra_seguridad', 'Seguridad reforzada'), Icon: LockKeyhole },
    { label: t('versus.extra_reportes', 'Reportes automáticos'), Icon: ChartLine },
    { label: t('versus.extra_proteccion', 'Protección anti-DDoS'), Icon: ShieldAlert },
    { label: t('versus.extra_mail', 'Email corporativo'), Icon: Mail },
    { label: t('versus.extra_whatsapp', 'WhatsApp'), Icon: MessageCircle },
    { label: t('versus.extra_chat', 'Chat propio'), Icon: MessageSquare },
    { label: t('versus.extra_mas', '+ Mucho más…'), Icon: Plus, more: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="card-own relative rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden group transition-all flex flex-col"
    >
      {/* Encabezado de la card */}
      <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-border/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-own-500/15 text-own-700 dark:text-own-400 border border-own-border">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-own-700 dark:text-own-400">
              {t('versus.propiedad_brand', 'EXEPAGINASWEB')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t('versus.propiedad_titulo', 'Modelo de Propiedad Real')}
            </h3>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-full border border-own-border text-own-700 dark:text-own-400 uppercase tracking-wider">
          {t('versus.propiedad_tag', '100% Tuyo')}
        </span>
      </div>

      {/* Documento / Escritura */}
      <div ref={docRef} className="dark-card dark-card-own relative rounded-xl p-4 sm:p-6">
        {/* Escáner oficial: barrido decorativo detrás del contenido (nunca opaca el texto) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 z-10"
          initial={{ top: '5%', opacity: 0 }}
          animate={{ top: ['5%', '88%'], opacity: [0, 1, 0.9, 0] }}
          transition={{
            duration: 1.3,
            times: [0, 0.4, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 3.6,
            delay: 1.1,
            ease: 'easeInOut',
          }}
        >
          <div className="h-px w-full bg-own-400/90 shadow-[0_0_12px_var(--own-400),0_0_30px_var(--own-glow)]" />
          <div className="h-10 w-full -mt-5 bg-gradient-to-b from-transparent via-own-400/10 to-transparent" />
        </motion.div>

        {/* Sello de verificación */}
        <motion.div
          initial={{ opacity: 0, scale: 2.4, rotate: -16 }}
          animate={verified ? { opacity: 1, scale: 1, rotate: -12 } : {}}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center gap-1.5 rounded-md border border-own-400/70 bg-surface-2/90 px-2.5 py-1 shadow-[0_0_18px_var(--own-glow)]"
        >
          <BadgeCheck className="w-3.5 h-3.5 text-own-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-hi">
            {t('versus.extra_verificado', 'Documento Verificado')}
          </span>
        </motion.div>
        {/* Sello animado: marca de agua centrada detrás de los datos */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center select-none"
          initial={{ opacity: 0, scale: 2.2, rotate: -26 }}
          whileInView={{ opacity: 0.9, scale: 1, rotate: -12 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 }}
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-[3px] border-own-400/80 text-own-300 flex items-center justify-center text-center p-3 shadow-[0_0_25px_var(--own-glow)]">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] leading-tight">
              {t('versus.escritura_estampa', '100% TUYO')}
            </span>
          </div>
        </motion.div>

        <div className="relative z-30 flex items-center justify-center gap-2 text-own-400/90 mb-3">
          <Landmark className="w-4 h-4" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.28em]">
            {t('versus.escritura_thumb', 'REPÚBLICA DE EXEPAGINASWEB')}
          </span>
        </div>
        <p className="relative z-30 text-center text-[9px] font-bold uppercase tracking-[0.35em] text-own-400/80 mb-4">
          — {t('versus.escritura_badge', 'ESCRITURA DIGITAL DE PROPIEDAD')} —
        </p>

        <div className="relative z-30 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm">
          {fields.map((f, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-2 ${i % 2 === 1 ? 'sm:pl-6 sm:border-l sm:border-own-500/20' : ''}`}
            >
              <span className="uppercase tracking-wider text-[10px] text-own-400/80 shrink-0 min-w-[92px]">
                {f.label}
              </span>
              <span
                className={`font-semibold ${f.mono ? 'font-mono text-own-300' : 'text-text-hi'}`}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* Mini sitio vivo */}
        <div className="mt-5 relative z-30">
          <SiteSkeleton url={t('versus.escritura_url', 'tudominio.com')} tone="emerald" />
          {alive && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl border-2 border-own-400/70 bg-own-500/10 backdrop-blur-[1px] flex items-center justify-center"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-own-500/20 border border-own-400/60 text-own-300 font-bold text-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-own-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-own-400" />
                  </span>
                  {t('versus.sigue_vivo', 'Sigue en línea. Es tuyo.')}
                </div>
              </motion.div>
              <div className="mt-3 flex items-start gap-2 text-own-300/90 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-own-400" />
                <span>
                  {t(
                    'versus.sigue_vivo_desc',
                    'Nada cambió: tu sistema, tu código y tus datos siguen intactos.'
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botón simétrico "Dejá de pagar" (acción primaria) */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => setAlive((v) => !v)}
          className="btn-own-primary w-full px-4 py-2.5 rounded-xl text-sm active:scale-[0.98]"
        >
          <Power className="w-4 h-4" />
          {t('versus.pagar_boton', 'Dejá de pagar')}
        </button>
      </div>

      {/* Steps compactos */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-own-700 dark:text-own-400 shrink-0" />
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Extensibilidad — ticker neón */}
      <div className="mt-5">
        <h4 className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-own-800 dark:text-own-400 mb-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-own-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-own-400 shadow-[0_0_8px_var(--own-400)]" />
          </span>
          {t('versus.extra_titulo', 'Todo lo que podés sumarle')}
        </h4>

        <div
          ref={wrapRef}
          className="marquee-edge-mask marquee-ticker relative rounded-2xl border border-own-border bg-own-tint dark:bg-own-500/10"
        >
          <div className="absolute -inset-10 bg-own-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(16,185,129,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div ref={trackRef} className="relative w-max flex will-change-transform">
            {[0, 1].map((track) => (
              <div
                key={track}
                aria-hidden={track === 1}
                className="flex items-center gap-3.5 pr-3.5 shrink-0"
              >
                {extras.map((e) =>
                  e.more ? (
                    <span
                      key={e.label}
                      className="chip-brand relative shrink-0 rounded-full p-px select-none cursor-default"
                      style={{
                        backgroundImage: 'var(--own-accent)',
                        backgroundSize: '200% auto',
                        animation: 'gradientShift 6s linear infinite',
                      }}
                    >
                      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-own-500 via-accent-brand to-own-600 opacity-30 blur-md" />
                      <span className="relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-surface-1">
                        <Sparkles className="w-4 h-4 text-own-400 animate-pulse" />
                        <span className="text-[13px] font-bold whitespace-nowrap text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--accent-brand),var(--own-400))]">
                          {e.label}
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span
                      key={e.label}
                      className="marquee-chip group/chip relative shrink-0 rounded-full border border-own-border bg-own-500/10 dark:bg-own-500/[0.07] pl-3 pr-3.5 py-2 flex items-center gap-2 backdrop-blur transition-colors hover:border-own-500 hover:bg-own-500/15 dark:hover:bg-own-500/15 hover:shadow-[0_0_20px_var(--own-glow)] select-none cursor-default"
                    >
                      <e.Icon className="w-4 h-4 text-own-700 dark:text-own-300 transition-colors" />
                      <span className="text-[13px] font-semibold text-own-900 dark:text-own-300 whitespace-nowrap">
                        {e.label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-own-400 shadow-[0_0_6px_var(--own-400)]" />
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-2.5 text-[11px] text-muted-foreground leading-relaxed">
          {t(
            'versus.extra_footer',
            'Y mucho más: cuando el proyecto es tuyo, se puede agregar todo. Sin límites de plataforma.'
          )}
        </p>
      </div>

      <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-own-tint border border-own-border flex items-start gap-3">
        <FileSignature className="w-5 h-5 sm:w-6 sm:h-6 text-own-700 dark:text-own-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-semibold text-own-900 dark:text-own-300">
          {t(
            'versus.propiedad_footer',
            'Te entregamos el código fuente completo, documentación y todos los recursos. Tu negocio es dueño absoluto de su tecnología.'
          )}
        </p>
      </div>
    </motion.div>
  )
}

/* ============================================================
   Card 2 — Alquiler: sitio que se desintegra al "dejar de pagar"
   ============================================================ */
type MockPhase = 'idle' | 'glitch' | 'grey' | 'dead'

function RentalCard() {
  const { t } = useTranslation()
  const [phase, setPhase] = React.useState<MockPhase>('idle')
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const runDestroy = () => {
    if (phase === 'dead') return
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setPhase('glitch')
    timers.current.push(
      window.setTimeout(() => setPhase('grey'), 480),
      window.setTimeout(() => setPhase('dead'), 1250)
    )
  }

  const resetDemo = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setPhase('idle')
  }

  const brokenList = [
    t('versus.alquiler_step1', 'Pagás mensualidad'),
    t('versus.alquiler_step3', 'Funciones predeterminadas'),
    t('versus.alquiler_step5', 'Dependencia de la Plataforma'),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="card-rent relative rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden group transition-all flex flex-col"
    >
      <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-border/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-rent-500/15 text-rent-700 dark:text-rent-400 border border-rent-border">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rent-700 dark:text-rent-400">
              {t('versus.alquiler_brand', 'PLATAFORMAS TRADICIONALES')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t('versus.alquiler_titulo', 'Modelo de Alquiler / Plantilla')}
            </h3>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-full bg-rent-500/15 text-rent-700 dark:text-rent-400 border border-rent-border uppercase tracking-wider">
          {t('versus.alquiler_tag', 'Rehén Mensual')}
        </span>
      </div>

      {/* Demo interactiva */}
      <div className="dark-card dark-card-rent rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-rent-400/80">
            {t('versus.alquiler_plantilla', 'PLANTILLA #312 — IDÉNTICA A MILES')}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-rent-400/80">
            <MousePointerClick className="w-3.5 h-3.5" />
            {t('versus.demo_label', 'DEMO')}
          </span>
        </div>

        {phase === 'dead' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-xl overflow-hidden border border-rent-border bg-surface-1 text-center py-10 px-4"
          >
            <div className="text-rent-400 font-black font-mono text-5xl sm:text-6xl tracking-widest">
              404
            </div>
            <div className="mt-3 text-text-hi font-black uppercase tracking-[0.2em] text-xs sm:text-sm">
              {t('versus.sitio_404', 'ESTE SITIO YA NO EXISTE')}
            </div>
            <div className="mt-3 max-w-xs mx-auto text-xs text-text-mid dark:text-muted-foreground leading-relaxed">
              {t(
                'versus.alquiler_footer',
                'Si dejás de pagar la suscripción mensual, tu sitio desaparece y perdés todo el trabajo acumulado.'
              )}
            </div>
            <button
              type="button"
              onClick={resetDemo}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rent-border text-rent-300 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('versus.reintentar_demo', 'Volver a activar demo')}
            </button>
          </motion.div>
        ) : (
          <motion.div
            animate={
              phase === 'glitch'
                ? {
                    x: [0, -9, 9, -5, 5, 0],
                    filter: 'grayscale(40%) hue-rotate(12deg) saturate(1.7)',
                  }
                : phase === 'grey'
                  ? {
                      x: 0,
                      scale: 0.985,
                      filter: 'grayscale(100%) contrast(1.35) brightness(0.75)',
                    }
                  : { x: 0, scale: 1, filter: 'grayscale(0%) contrast(1)' }
            }
            transition={
              phase === 'glitch'
                ? { duration: 0.45 }
                : { type: 'spring', stiffness: 200, damping: 22 }
            }
            className="relative"
          >
            <SiteSkeleton url={t('versus.alquiler_url', 'tupagina.plataforma.com')} tone="rose" />

            {/* Overlay de pixelado al desintegrarse */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10"
              animate={{ opacity: phase === 'grey' ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, color-mix(in srgb, var(--rent-500) 12%, transparent) 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--rent-500) 12%, transparent) 0 6px, transparent 6px 12px)`,
              }}
            />
            {phase === 'grey' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <span className="text-text-hi font-mono text-[10px] tracking-[0.3em] font-bold uppercase">
                  {t('versus.desintegrando', 'desintegrando…')}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Botón simétrico "Dejá de pagar" (comportamiento bloqueado) */}
      <div className="mt-5">
        <button
          type="button"
          onClick={runDestroy}
          className="btn-rent-blocked w-full px-4 py-2.5 rounded-xl text-sm active:scale-[0.98]"
        >
          <Power className="w-4 h-4" />
          {t('versus.pagar_boton', 'Dejá de pagar')}
        </button>
      </div>

      {/* Puntos débiles */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {brokenList.map((s, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium"
          >
            <XCircle className="w-4 h-4 text-rent-700 dark:text-rent-400 shrink-0" />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ============================================================
   Cierre — Gráfico de costo acumulado (alquiler vs. propia)
   ============================================================ */
function CostCard() {
  const { t } = useTranslation()
  const [year, setYear] = React.useState(5)
  const liveRef = React.useRef<HTMLDivElement>(null)
  const liveInView = useInView(liveRef, { once: true, amount: 0.4 })
  const [liveExtra, setLiveExtra] = React.useState(0)

  React.useEffect(() => {
    if (!liveInView) return
    const id = window.setInterval(() => setLiveExtra((v) => v + 0.02), 80)
    return () => window.clearInterval(id)
  }, [liveInView])

  const VIEW_W = 320
  const VIEW_H = 170
  const PAD_L = 10
  const PAD_R = 10
  const PAD_T = 14
  const PAD_B = 24
  const MAX_VAL = 3200

  const plotW = VIEW_W - PAD_L - PAD_R
  const plotH = VIEW_H - PAD_T - PAD_B
  const yBot = PAD_T + plotH

  const yFor = (c: number) => yBot - (c / MAX_VAL) * plotH
  const xFor = (y: number) => PAD_L + ((y - 1) / (YEARS - 1)) * plotW

  const rentalPoints = Array.from({ length: YEARS }, (_, i) => {
    const y = i + 1
    return `${xFor(y).toFixed(1)},${yFor(rentalCost(y)).toFixed(1)}`
  }).join(' ')
  const ownPoints = Array.from({ length: YEARS }, (_, i) => {
    const y = i + 1
    return `${xFor(y).toFixed(1)},${yFor(DEV_COST).toFixed(1)}`
  }).join(' ')

  const guideX = xFor(year)
  const rentY = yFor(rentalCost(year))
  const ownY = yFor(DEV_COST)
  const crossed = rentalCost(year) > DEV_COST

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute -top-20 right-10 w-64 h-64 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 mb-3">
            <TrendingDown className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-cyan">
              {t('versus.costo_badge', 'LOS NÚMEROS')}
            </span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black font-display tracking-tight text-foreground">
            {t('versus.costo_titulo', 'Costo acumulado a 5 años')}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            {t(
              'versus.costo_sub',
              'El alquiler se paga todos los meses, para siempre. La herramienta propia se paga una sola vez.'
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs font-semibold">
          <span className="flex items-center gap-2 text-rent-700 dark:text-rent-400">
            <i className="w-4 h-0.5 rounded bg-rent-600 dark:bg-rent-400" />
            {t('versus.costo_alquiler', 'Alquiler / plantilla')}
            <span className="text-muted-foreground font-normal">
              ({t('versus.costo_mensual_alquiler', '$49/mes')})
            </span>
          </span>
          <span className="flex items-center gap-2 text-own-700 dark:text-own-400">
            <i className="w-4 h-0.5 rounded bg-own-600 dark:bg-own-400" />
            {t('versus.costo_propia', 'Desarrollo propio')}
            <span className="text-muted-foreground font-normal">
              ({t('versus.costo_unica', 'inversión única')})
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
        {/* Gráfico SVG */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full h-auto block"
            role="img"
            aria-label={t('versus.costo_aria', 'Gráfico de costo acumulado')}
          >
            {/* Guías horizontales */}
            {[1000, 2000, 3000].map((g) => (
              <g key={g}>
                <line
                  x1={PAD_L}
                  y1={yFor(g)}
                  x2={PAD_L + plotW}
                  y2={yFor(g)}
                  stroke="var(--border)"
                  strokeOpacity={0.45}
                  strokeDasharray="3 4"
                />
                <text
                  x={PAD_L - 4}
                  y={yFor(g) + 3}
                  textAnchor="end"
                  fontSize="7"
                  fill="var(--muted-foreground)"
                  fontFamily="var(--font-mono)"
                >
                  {g.toLocaleString('en-US')}
                </text>
              </g>
            ))}

            {/* Año seleccionado */}
            <line
              x1={guideX}
              y1={PAD_T}
              x2={guideX}
              y2={yBot}
              stroke="var(--accent-cyan)"
              strokeOpacity={0.5}
              strokeDasharray="2 3"
            />

            {/* Línea alquiler */}
            <motion.polyline
              points={rentalPoints}
              fill="none"
              stroke="var(--chart-rose)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
            {/* Línea propia */}
            <motion.polyline
              points={ownPoints}
              fill="none"
              stroke="var(--chart-emerald)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
            />

            {/* Dots del año seleccionado */}
            <motion.circle
              r={4.5}
              fill="var(--chart-rose)"
              stroke="var(--chart-dot-ring)"
              strokeWidth={2}
              initial={{ cx: guideX, cy: rentY }}
              animate={{ cx: guideX, cy: rentY }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            />
            <motion.circle
              r={4.5}
              fill="var(--chart-emerald)"
              stroke="var(--chart-dot-ring)"
              strokeWidth={2}
              initial={{ cx: guideX, cy: ownY }}
              animate={{ cx: guideX, cy: ownY }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            />

            {/* Labels de años */}
            {Array.from({ length: YEARS }, (_, i) => i + 1).map((y) => (
              <text
                key={y}
                x={xFor(y)}
                y={VIEW_H - 8}
                textAnchor="middle"
                fontSize="8"
                fontWeight={y === year ? 800 : 500}
                fill={y === year ? 'var(--accent-cyan)' : 'var(--muted-foreground)'}
                fontFamily="var(--font-mono)"
              >
                {y}
              </text>
            ))}
          </svg>

          <input
            type="range"
            min={1}
            max={YEARS}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label={t('versus.costo_titulo', 'Costo acumulado a 5 años')}
            className="mt-2 w-full accent-[var(--accent-cyan)] cursor-pointer"
          />
          <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
            <MousePointerClick className="w-3 h-3" />
            {t('versus.costo_demo_hint', 'Arrastrá para ver en qué año se cruza la balanza')}
          </p>
        </div>

        {/* Números */}
        <div className="lg:min-w-[280px] flex flex-col gap-3">
          <div
            ref={liveRef}
            className="rounded-xl border border-rent-border bg-rent-tint dark:bg-rent-500/10 p-4"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-rent-700 dark:text-rent-400 mb-1">
              {t('versus.costo_alquiler', 'Alquiler / plantilla')}
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-rent-700 dark:text-rent-400">
              <motion.span key={year} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {fmtUsd(rentalCost(year))}
              </motion.span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-rent-800 dark:text-rent-300/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rent-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rent-400" />
              </span>
              {t('versus.extra_en_vivo', 'EN VIVO')}
              <span className="font-mono text-rent-700 dark:text-rent-300 tabular-nums transition-none">
                +{fmtUsdC(liveExtra)}
              </span>
              <span className="text-rent-700/70 dark:text-rent-300/60 font-medium">
                {t('versus.extra_en_vivo_desc', 'mientras mirás, nunca se detiene')}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-own-border bg-own-tint dark:bg-own-500/10 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-own-800 dark:text-own-400 mb-1">
              {t('versus.costo_propia', 'Desarrollo propio')}
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-own-800 dark:text-own-400">
              <motion.span
                key={`own-${year}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {fmtUsd(DEV_COST)}
              </motion.span>
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 transition-colors ${
              crossed
                ? 'border-own-border bg-own-tint dark:bg-own-500/10'
                : 'border-border bg-muted/40'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-1">
              <Activity
                className={`w-3.5 h-3.5 ${crossed ? 'text-own-700 dark:text-own-400' : 'text-muted-foreground'}`}
              />
              {t('versus.costo_ahorro', 'Ahorro acumulado')} · {t('versus.costo_año', 'año')} {year}
            </div>
            <div
              className={`text-3xl sm:text-4xl font-black font-mono ${crossed ? 'text-own-800 dark:text-own-400' : 'text-muted-foreground'}`}
            >
              <motion.span
                key={`ahorro-${year}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {fmtUsd(savingsAt(year))}
              </motion.span>
            </div>
            {!crossed && (
              <p className="mt-1 text-[10px] text-muted-foreground">
                {t(
                  'versus.costo_amortizando',
                  'Año {{year}}: la inversión inicial todavía se está amortizando.',
                  {
                    year,
                  }
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   Letrero neón — "100% TUYO" vs "SUSPENDIDO"
   ============================================================ */
type NeonColor = 'emerald' | 'rose'

function NeonSign({
  text,
  color,
  active,
  delay,
  onClick,
}: {
  text: string
  color: NeonColor
  active: boolean
  delay: string
  onClick: () => void
}) {
  const [hovering, setHovering] = React.useState(false)
  const isRose = color === 'rose'
  const glow = active
    ? isRose
      ? 'var(--neon-rose)'
      : 'var(--neon-emerald)'
    : hovering
      ? isRose
        ? 'var(--neon-rose-hover)'
        : 'var(--neon-emerald-hover)'
      : 'none'

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-pressed={active}
      style={{ textShadow: glow, animationDelay: delay }}
      className={`font-black uppercase tracking-[0.14em] select-none cursor-pointer rounded-md transition-[text-shadow,color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-surface-0 text-[26px] sm:text-4xl ${
        active ? 'animate-[neon-flicker_8s_steps(1)_infinite]' : ''
      } ${isRose ? (active ? 'text-rent-500 dark:text-rent-400/95' : 'text-rent-500/30 dark:text-rent-400/25') : active ? 'text-own-700 dark:text-own-400/95' : 'text-own-700/30 dark:text-own-400/25'}`}
    >
      {text}
    </button>
  )
}

function NeonDuel({
  t,
  mode,
  onSelect,
}: {
  t: (k: string, f: string) => string
  mode: TermMode
  onSelect: (m: TermMode) => void
}) {
  return (
    <div className="relative flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-16 gap-y-4 py-10">
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[min(90%,560px)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <NeonSign
        color="emerald"
        text={t('versus.extra_neon_status_a', '100% TUYO')}
        active={mode === 'tuyo'}
        delay="-4.2s"
        onClick={() => onSelect('tuyo')}
      />
      <span className="text-sm font-black text-muted-foreground/50 tracking-[0.3em] animate-pulse select-none">
        {t('versus.extra_vs', 'VS')}
      </span>
      <NeonSign
        color="rose"
        text={t('versus.extra_neon_status_b', 'SUSPENDIDO')}
        active={mode === 'suspendido'}
        delay="-1.7s"
        onClick={() => onSelect('suspendido')}
      />
    </div>
  )
}

/* ============================================================
   Terminal de liberación del código
   ============================================================ */
type TermMode = 'tuyo' | 'suspendido'

type TermPart = { text: string; strike?: boolean }
type TermLine = {
  kind: 'cmd' | 'ok' | 'err' | 'warn' | 'html'
  parts: TermPart[]
  glitch?: boolean
}

function textOfLine(line: TermLine): string {
  return line.parts.map((p) => p.text).join('')
}

function lineKindClass(kind: TermLine['kind']): string {
  switch (kind) {
    case 'cmd':
      return 'text-text-mid'
    case 'ok':
      return 'text-own-400'
    case 'err':
      return 'text-rent-400'
    case 'warn':
      return 'text-amber-300/90'
    case 'html':
      return 'text-rent-300/90'
  }
}

function buildLines(t: (k: string, f: string) => string, mode: TermMode): TermLine[] {
  if (mode === 'suspendido') {
    return [
      { kind: 'cmd', parts: [{ text: '$ curl https://plataforma.com/tu-sitio' }] },
      {
        kind: 'err',
        parts: [{ text: t('versus.extra_terminal_b_curl', '✗ 402 Payment Required') }],
      },
      { kind: 'cmd', parts: [{ text: '$ ls /codigo' }] },
      { kind: 'err', parts: [{ text: t('versus.extra_terminal_b_ls', 'ls: permission denied') }] },
      { kind: 'cmd', parts: [{ text: '$ cat plantilla.html' }] },
      {
        kind: 'html',
        parts: [
          { text: '<div class="block1"> ' },
          { text: t('versus.extra_terminal_noeditar', '<!-- NO EDITAR -->'), strike: true },
        ],
      },
      {
        kind: 'err',
        parts: [
          {
            text: t(
              'versus.extra_terminal_b_typeerror',
              '✗ TypeError: Cannot read properties of undefined'
            ),
          },
        ],
        glitch: true,
      },
      { kind: 'cmd', parts: [{ text: '$ exportar --datos' }] },
      {
        kind: 'err',
        parts: [
          { text: t('versus.extra_terminal_b_export', '✗ exportación bloqueada · plan vencido') },
        ],
      },
      { kind: 'cmd', parts: [{ text: '$ systemctl status sitio' }] },
      {
        kind: 'warn',
        parts: [
          {
            text: t('versus.extra_terminal_b_status', '● inactivo (dead) — suscripción cancelada'),
          },
        ],
      },
    ]
  }

  return [
    { kind: 'cmd', parts: [{ text: '$ git clone https://exepaginasweb.com/tu-negocio.git' }] },
    {
      kind: 'ok',
      parts: [
        { text: t('versus.extra_terminal_out_clone', '✓ código fuente en tu poder — 418 commits') },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ npm run lint && npm test' }] },
    {
      kind: 'ok',
      parts: [{ text: t('versus.extra_terminal_out_lint', '✓ 0 errores · 142/142 tests pasando') }],
    },
    { kind: 'cmd', parts: [{ text: '$ npm run build' }] },
    {
      kind: 'ok',
      parts: [
        { text: t('versus.extra_terminal_out_build', '✓ build OK · 0 warnings · deploy listo') },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ cat ESCRITURA_2026.txt' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_cat',
            '→ software a medida + código fuente + documentación. 100% tuyo.'
          ),
        },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ systemctl status libertad' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_status',
            '● activo — sin cuotas, sin ataduras, sin permanencias'
          ),
        },
      ],
    },
  ]
}

function CodeLiberationTerminal({ mode }: { mode: TermMode }) {
  const { t } = useTranslation()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduceMotion = useReducedMotion()

  const [phase, setPhase] = React.useState<'typing' | 'done'>('typing')
  const [chars, setChars] = React.useState(0)
  const [replayKey, setReplayKey] = React.useState(0)
  const intervalRef = React.useRef<number | null>(null)

  const lines = React.useMemo(() => buildLines(t, mode), [t, mode])
  const full = React.useMemo(() => lines.map((l) => textOfLine(l)).join('\n'), [lines])

  React.useEffect(() => {
    if (!inView) return
    setChars(0)
    setPhase('typing')

    if (reduceMotion === true) {
      setChars(full.length)
      setPhase('done')
      return
    }

    const total = full.length
    if (total === 0) {
      setPhase('done')
      return
    }

    const tickMs = 30
    const totalTicks = Math.max(1, Math.round(1500 / tickMs))
    const step = Math.max(1, Math.ceil(total / totalTicks))
    let remaining = total

    intervalRef.current = window.setInterval(() => {
      remaining = Math.max(0, remaining - step)
      setChars(total - remaining)
      if (remaining <= 0) {
        if (intervalRef.current) window.clearInterval(intervalRef.current)
        intervalRef.current = null
        setPhase('done')
      }
    }, tickMs)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [inView, full, replayKey, reduceMotion])

  const completeNow = React.useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setChars(full.length)
    setPhase('done')
  }, [full.length])

  const handleConsoleClick = () => {
    if (reduceMotion === true) return
    if (phase === 'typing') {
      completeNow()
    } else {
      setReplayKey((k) => k + 1)
    }
  }

  let remaining = chars
  const rows = lines.map((line) => {
    const text = textOfLine(line)
    const take = Math.max(0, Math.min(remaining, text.length))
    remaining -= take
    return { line, take }
  })

  const isSuspendido = mode === 'suspendido'
  const cursorClass = isSuspendido ? 'bg-rent-400/90' : 'bg-own-400/90'

  return (
    <div ref={ref} className="dark-card dark-card-own relative rounded-2xl sm:rounded-3xl">
      <div className="absolute -inset-x-20 -top-24 h-52 bg-own-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-20 p-4 sm:p-6">
        {/* Barra de ventana */}
        <div className="flex items-center gap-2 px-1 pb-3 border-b border-border/70">
          <span className="w-2.5 h-2.5 rounded-full bg-rent-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-own-400/70" />
          <Terminal className="w-3.5 h-3.5 text-own-400/80" />
          <span className="ml-1 text-[10px] font-mono text-own-400/80 tracking-widest uppercase">
            {t('versus.extra_terminal_titulo', 'Terminal de Liberación')}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[9px] font-bold text-own-300/80">
            <span className="w-1.5 h-1.5 rounded-full bg-own-400 animate-pulse" />
            {t('versus.extra_terminal_run', 'PROPY-RUN')}
          </span>
        </div>

        {/* Cuerpo */}
        <div
          role="button"
          tabIndex={0}
          aria-label={t(
            'versus.extra_terminal_done',
            'Liberación completada ✓ — hacé click para repetir'
          )}
          onClick={handleConsoleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleConsoleClick()
            }
          }}
          className="mt-3.5 rounded-lg bg-black/40 border border-border/50 px-3.5 py-3 font-mono text-[11px] sm:text-[13px] leading-5 whitespace-pre-wrap cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-own-400/50"
        >
          <div className="text-own-500/60 text-[10px] sm:text-[11px] mb-2">
            # {t('versus.extra_terminal_hint', 'click en TUYO / SUSPENDIDO para comparar')}
          </div>
          {rows.map(({ line, take }, i) => {
            const isLast = i === rows.length - 1
            const segments: React.ReactNode[] = []
            let budget = take
            line.parts.forEach((part, pi) => {
              if (budget <= 0) return
              const shown = part.text.slice(0, budget)
              budget -= shown.length
              if (!shown) return
              segments.push(
                <span
                  key={`${pi}-${shown.length}`}
                  className={part.strike ? 'line-through decoration-rent-400/70' : undefined}
                >
                  {shown}
                </span>
              )
            })
            return (
              <div
                key={i}
                className={
                  line.glitch ? 'animate-[terminal-glitch_3.5s_steps(1)_infinite]' : undefined
                }
              >
                <span className={lineKindClass(line.kind)}>
                  {segments}
                  {isLast ? (
                    <span
                      className={`inline-block w-2 h-3.5 align-middle ml-1 ${cursorClass} ${
                        reduceMotion === true ? '' : 'animate-pulse'
                      }`}
                    />
                  ) : null}
                </span>
                {i < rows.length - 1 ? '\n' : ''}
              </div>
            )
          })}
          {phase === 'done' && (
            <div className="flex items-center justify-between gap-3 mt-1 pt-1 border-t border-border/50">
              <span className="text-[10px] text-own-400/90 font-bold uppercase tracking-widest">
                {isSuspendido
                  ? t(
                      'versus.extra_terminal_done_b',
                      'Sistema suspendido ✗ — hacé click para reintentar'
                    )
                  : t(
                      'versus.extra_terminal_done',
                      'Liberación completada ✓ — hacé click para repetir'
                    )}
              </span>
              <RefreshCw className="w-3.5 h-3.5 text-own-400/80 animate-[spin_3s_linear_infinite]" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Sección completa
   ============================================================ */
export const OwnershipVsSubscription: React.FC = () => {
  const { t } = useTranslation()
  const [terminalMode, setTerminalMode] = React.useState<TermMode>('tuyo')

  return (
    <section id="comparativa" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,color-mix(in_oklab,var(--own-500)_6%,transparent),transparent_60%),radial-gradient(60%_50%_at_80%_20%,color-mix(in_oklab,var(--rent-500)_6%,transparent),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 backdrop-blur-md mb-4">
            <Landmark className="w-4 h-4 text-accent-cyan" />
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

        {/* Demo: Escritura vs. robot cautivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6">
          <DeedCard />
          <RentalCard />
        </div>

        {/* Letrero neón: 100% TUYO vs SUSPENDIDO */}
        <NeonDuel t={t} mode={terminalMode} onSelect={setTerminalMode} />

        {/* Terminal de liberación del código */}
        <div className="max-w-4xl mx-auto mb-14 sm:mb-20">
          <CodeLiberationTerminal mode={terminalMode} />
        </div>

        {/* Cierre con números */}
        <CostCard />
      </div>
    </section>
  )
}

export default OwnershipVsSubscription
