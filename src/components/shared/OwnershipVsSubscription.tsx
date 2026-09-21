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
  const barColor = tone === 'emerald' ? 'bg-emerald-400/60' : 'bg-slate-400/50'
  return (
    <div className="rounded-xl overflow-hidden border border-border/80 bg-slate-900/95 shadow-inner">
      {/* Barra del navegador */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/80 bg-slate-950/80">
        <span className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <i className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="flex-1 mx-2 flex items-center justify-center">
          <span className="px-3 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 truncate max-w-full">
            {url}
          </span>
        </span>
      </div>
      {/* Contenido simulando el sitio */}
      <div className="p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <div className={`w-8 h-2 rounded ${barColor}`} />
          <div className="h-1.5 bg-slate-700/70 rounded flex-1 max-w-[40%]" />
          <div className="h-1.5 bg-slate-700/70 rounded flex-1 max-w-[15%]" />
          <div className="h-1.5 bg-slate-700/70 rounded flex-1 max-w-[15%]" />
        </div>
        <div className="h-8 rounded-md bg-slate-800/80" />
        <div className="h-2.5 w-3/4 rounded bg-slate-700/60" />
        <div className="h-2.5 w-1/2 rounded bg-slate-700/40" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="h-10 rounded-md bg-slate-800/80" />
          <div className="h-10 rounded-md bg-slate-800/80" />
          <div className="h-10 rounded-md bg-slate-800/80" />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Card 1 — Escritura Digital de Propiedad (modelo propio)
   ============================================================ */
function DeedCard() {
  const { t } = useTranslation()
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
    { label: t('versus.extra_ai', 'Agentes de IA'), Icon: Bot },
    { label: t('versus.extra_tributario', 'Servicio tributario de capa país'), Icon: Landmark },
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
      className="relative rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 bg-card/60 backdrop-blur-xl p-4 sm:p-7 overflow-hidden shadow-xl shadow-emerald-500/5 group hover:border-emerald-500/70 transition-all flex flex-col"
    >
      {/* Encabezado de la card */}
      <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-border/80 gap-3">
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
          {t('versus.propiedad_tag', '100% Tuyo')}
        </span>
      </div>

      {/* Documento / Escritura */}
      <div
        ref={docRef}
        className="relative rounded-xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-4 sm:p-6"
      >
        {/* Escáner oficial: barrido periódico sobre el documento */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 z-30"
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
          <div className="h-[2px] w-full bg-emerald-300/90 shadow-[0_0_12px_#34d399,0_0_30px_rgba(16,185,129,0.55)]" />
          <div className="h-10 w-full -mt-5 bg-gradient-to-b from-transparent via-emerald-400/15 to-transparent" />
        </motion.div>

        {/* Sello de verificación */}
        <motion.div
          initial={{ opacity: 0, scale: 2.4, rotate: -16 }}
          animate={verified ? { opacity: 1, scale: 1, rotate: -12 } : {}}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-center gap-1.5 rounded-md border border-emerald-400/70 bg-emerald-950/85 px-2.5 py-1 shadow-[0_0_18px_rgba(16,185,129,0.45)]"
        >
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
            {t('versus.extra_verificado', 'Documento Verificado')}
          </span>
        </motion.div>
        {/* Sello animado */}
        <motion.div
          className="pointer-events-none absolute top-3 right-3 z-20 select-none"
          initial={{ opacity: 0, scale: 2.2, rotate: -26 }}
          whileInView={{ opacity: 0.9, scale: 1, rotate: -12 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 }}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-emerald-400/90 text-emerald-300 flex items-center justify-center text-center p-2 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] leading-tight">
              {t('versus.escritura_estampa', '100% TUYO')}
            </span>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 text-emerald-400/80 mb-3">
          <Landmark className="w-4 h-4" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.28em]">
            {t('versus.escritura_thumb', 'REPÚBLICA DE EXEPAGINASWEB')}
          </span>
        </div>
        <p className="text-center text-[9px] font-bold uppercase tracking-[0.35em] text-emerald-500/70 mb-4">
          — {t('versus.escritura_badge', 'ESCRITURA DIGITAL DE PROPIEDAD')} —
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm">
          {fields.map((f, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-2 ${i % 2 === 1 ? 'sm:pl-6 sm:border-l sm:border-emerald-500/15' : ''}`}
            >
              <span className="uppercase tracking-wider text-[10px] text-emerald-500/70 shrink-0 min-w-[92px]">
                {f.label}
              </span>
              <span
                className={`text-foreground font-semibold ${f.mono ? 'font-mono text-emerald-300/90' : ''}`}
              >
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* Mini sitio vivo */}
        <div className="mt-5 relative">
          <SiteSkeleton url="tudominio.com" tone="emerald" />
          {alive && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl border-2 border-emerald-400/70 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-bold text-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  {t('versus.sigue_vivo', 'Sigue en línea. Es tuyo.')}
                </div>
              </motion.div>
              <div className="mt-3 flex items-start gap-2 text-emerald-300/90 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
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

      {/* Botón simétrico "Dejá de pagar" */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => setAlive((v) => !v)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 font-bold text-sm transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Extensibilidad — ticker neón */}
      <div className="mt-5">
        <h4 className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-400 mb-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>
          {t('versus.extra_titulo', 'Todo lo que podés sumarle')}
        </h4>

        <div className="relative group overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-950/30 p-3">
          <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(16,185,129,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.07)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="relative w-max flex gap-4 animate-marquee group-hover:[animation-play-state:paused] [animation-duration:22s] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
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
                      className="relative shrink-0 rounded-full p-px select-none cursor-default"
                      style={{
                        backgroundImage:
                          'linear-gradient(100deg,#06b6d4,#8b5cf6 50%,#d946ef,#06b6d4)',
                        backgroundSize: '200% auto',
                        animation: 'gradientShift 6s linear infinite',
                      }}
                    >
                      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 opacity-40 blur-md" />
                      <span className="relative flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-[#0b0f1e]/95">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                        <span className="text-[11px] font-bold whitespace-nowrap text-transparent bg-clip-text bg-[linear-gradient(90deg,#22d3ee,#a78bfa,#f472b6)]">
                          {e.label}
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span
                      key={e.label}
                      className="group/chip flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] backdrop-blur transition-all duration-200 hover:border-emerald-400/70 hover:bg-emerald-500/15 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 shrink-0 select-none cursor-default"
                    >
                      <e.Icon className="w-3.5 h-3.5 text-emerald-300 group-hover/chip:text-emerald-200 transition-colors" />
                      <span className="text-[11px] font-semibold text-emerald-100/90 whitespace-nowrap">
                        {e.label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
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

      <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
        <FileSignature className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-semibold text-emerald-300">
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
      className="relative rounded-2xl sm:rounded-3xl border border-rose-500/30 bg-card/40 backdrop-blur-xl p-4 sm:p-7 overflow-hidden shadow-xl shadow-rose-500/5 group hover:border-rose-500/50 transition-all flex flex-col"
    >
      <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-border/80 gap-3">
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
          {t('versus.alquiler_tag', 'Rehén Mensual')}
        </span>
      </div>

      {/* Demo interactiva */}
      <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-rose-500/80">
            {t('versus.alquiler_plantilla', 'PLANTILLA #312 — IDÉNTICA A MILES')}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400/80">
            <MousePointerClick className="w-3.5 h-3.5" />
            DEMO
          </span>
        </div>

        {phase === 'dead' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-xl overflow-hidden border border-rose-500/50 bg-slate-950 text-center py-10 px-4"
          >
            <div className="text-rose-400 font-black font-mono text-5xl sm:text-6xl tracking-widest drop-shadow-[0_0_18px_rgba(244,63,94,0.4)]">
              404
            </div>
            <div className="mt-3 text-rose-300 font-black uppercase tracking-[0.2em] text-xs sm:text-sm">
              {t('versus.sitio_404', 'ESTE SITIO YA NO EXISTE')}
            </div>
            <div className="mt-3 max-w-xs mx-auto text-xs text-muted-foreground leading-relaxed">
              {t(
                'versus.alquiler_footer',
                'Si dejás de pagar la suscripción mensual, tu sitio desaparece y perdés todo el trabajo acumulado.'
              )}
            </div>
            <button
              type="button"
              onClick={resetDemo}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-400/40 bg-rose-500/10 text-rose-300 text-xs font-bold hover:bg-rose-500/20 transition-all"
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
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(244,63,94,0.12) 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, rgba(244,63,94,0.12) 0 6px, transparent 6px 12px)',
              }}
            />
            {phase === 'grey' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <span className="text-rose-300/90 font-mono text-[10px] tracking-[0.3em] font-bold uppercase">
                  desintegrando…
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Botón simétrico "Dejá de pagar" */}
      <div className="mt-5">
        <button
          type="button"
          onClick={runDestroy}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-400/50 bg-rose-500/10 text-rose-300 font-bold text-sm transition-all hover:bg-rose-500/20 active:scale-[0.98]"
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
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
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
          <span className="flex items-center gap-2 text-rose-400">
            <i className="w-4 h-0.5 rounded bg-rose-400" />
            {t('versus.costo_alquiler', 'Alquiler / plantilla')}
            <span className="text-muted-foreground font-normal">
              ({t('versus.costo_mensual_alquiler', '$49/mes')})
            </span>
          </span>
          <span className="flex items-center gap-2 text-emerald-400">
            <i className="w-4 h-0.5 rounded bg-emerald-400" />
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
            aria-label="Gráfico de costo acumulado"
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
              stroke="#fb7185"
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
              stroke="#34d399"
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
              fill="#fb7185"
              stroke="#0f0f16"
              strokeWidth={2}
              initial={{ cx: guideX, cy: rentY }}
              animate={{ cx: guideX, cy: rentY }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            />
            <motion.circle
              r={4.5}
              fill="#34d399"
              stroke="#0f0f16"
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
            className="mt-2 w-full accent-cyan-500 cursor-pointer"
          />
          <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
            <MousePointerClick className="w-3 h-3" />
            {t('versus.costo_demo_hint', 'Arrastrá para ver en qué año se cruza la balanza')}
          </p>
        </div>

        {/* Números */}
        <div className="lg:min-w-[280px] flex flex-col gap-3">
          <div ref={liveRef} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-1">
              {t('versus.costo_alquiler', 'Alquiler / plantilla')}
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
              <motion.span key={year} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {fmtUsd(rentalCost(year))}
              </motion.span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-rose-300/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-400" />
              </span>
              {t('versus.extra_en_vivo', 'EN VIVO')}
              <span className="font-mono text-rose-300 tabular-nums transition-none">
                +{fmtUsdC(liveExtra)}
              </span>
              <span className="text-rose-300/60 font-medium">
                {t('versus.extra_en_vivo_desc', 'mientras mirás, nunca se detiene')}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
              {t('versus.costo_propia', 'Desarrollo propio')}
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
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
              crossed ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-border bg-muted/40'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-1">
              <Activity
                className={`w-3.5 h-3.5 ${crossed ? 'text-emerald-400' : 'text-muted-foreground'}`}
              />
              {t('versus.costo_ahorro', 'Ahorro acumulado')} · {t('versus.costo_año', 'año')} {year}
            </div>
            <div
              className={`text-3xl sm:text-4xl font-black font-mono ${crossed ? 'text-emerald-400' : 'text-muted-foreground'}`}
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
                {`Año ${year}: la inversión inicial todavía se está amortizando.`}
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
      ? '0 0 6px #f43f5e, 0 0 20px #f43f5e, 0 0 46px rgba(244,63,94,0.8), 0 0 90px rgba(244,63,94,0.45)'
      : '0 0 6px #10b981, 0 0 20px #10b981, 0 0 46px rgba(16,185,129,0.8), 0 0 90px rgba(16,185,129,0.5)'
    : hovering
      ? isRose
        ? '0 0 6px rgba(244,63,94,0.7), 0 0 22px rgba(244,63,94,0.4)'
        : '0 0 6px rgba(16,185,129,0.7), 0 0 22px rgba(16,185,129,0.4)'
      : 'none'

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-pressed={active}
      style={{ textShadow: glow, animationDelay: delay }}
      className={`font-black uppercase tracking-[0.14em] select-none cursor-pointer rounded-md transition-[text-shadow,color] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070f] text-[26px] sm:text-4xl ${
        active ? 'animate-[neon-flicker_8s_steps(1)_infinite]' : ''
      } ${isRose ? (active ? 'text-rose-400/95' : 'text-rose-400/25') : active ? 'text-emerald-400/95' : 'text-emerald-400/25'}`}
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
      return 'text-slate-300'
    case 'ok':
      return 'text-emerald-300/90'
    case 'err':
      return 'text-rose-300/90'
    case 'warn':
      return 'text-amber-300/90'
    case 'html':
      return 'text-rose-200/80'
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
        parts: [{ text: '<div class="block1"> ' }, { text: '<!-- NO EDITAR -->', strike: true }],
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
  const cursorClass = isSuspendido ? 'bg-rose-400/90' : 'bg-emerald-400/90'

  return (
    <div
      ref={ref}
      className="relative rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-[#05070f]/90 overflow-hidden shadow-2xl shadow-emerald-500/5"
    >
      <div className="absolute -inset-x-20 -top-24 h-52 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative p-4 sm:p-6">
        {/* Barra de ventana */}
        <div className="flex items-center gap-2 px-1 pb-3 border-b border-border/70">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <Terminal className="w-3.5 h-3.5 text-emerald-400/80" />
          <span className="ml-1 text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">
            {t('versus.extra_terminal_titulo', 'Terminal de Liberación')}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[9px] font-bold text-emerald-300/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PROPY-RUN
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
          className="mt-3.5 rounded-lg bg-black/40 border border-border/50 px-3.5 py-3 font-mono text-[11px] sm:text-[13px] leading-5 whitespace-pre-wrap cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        >
          <div className="text-emerald-500/60 text-[10px] sm:text-[11px] mb-2">
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
                  className={part.strike ? 'line-through decoration-rose-500/70' : undefined}
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
              <span className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-widest">
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
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400/80 animate-[spin_3s_linear_infinite]" />
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
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

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
