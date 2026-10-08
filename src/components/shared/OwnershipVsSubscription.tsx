/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  CyberRealPropertyShield,
  CyberCheckMark,
  CyberCrossMark,
  CyberInsignia,
  CyberRefreshIcon,
  CyberTechCode,
  CyberPowerSwitch,
  CyberWarningHazard,
} from '@/components/ui/MagnificentIcons'

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
      return 'text-emerald-400'
    case 'err':
      return 'text-rose-400'
    case 'warn':
      return 'text-amber-300/90'
    case 'html':
      return 'text-rose-300/90'
  }
}

function buildLines(t: (k: string, f: string) => string, mode: TermMode): TermLine[] {
  if (mode === 'suspendido') {
    return [
      { kind: 'cmd', parts: [{ text: '$ curl https://plataforma-alquiler.com/tu-sitio' }] },
      {
        kind: 'err',
        parts: [
          { text: t('versus.extra_terminal_b_curl', '✗ 402 Payment Required · Plan cancelado') },
        ],
      },
      { kind: 'cmd', parts: [{ text: '$ ls /codigo-fuente' }] },
      {
        kind: 'err',
        parts: [
          { text: t('versus.extra_terminal_b_ls', 'ls: permission denied (código cautivo)') },
        ],
      },
      { kind: 'cmd', parts: [{ text: '$ exportar-clientes-db' }] },
      {
        kind: 'err',
        parts: [
          {
            text: t(
              'versus.extra_terminal_b_typeerror',
              '✗ Error: Exportación bloqueada · Acceso suspendido'
            ),
          },
        ],
        glitch: true,
      },
      { kind: 'cmd', parts: [{ text: '$ systemctl status tienda' }] },
      {
        kind: 'warn',
        parts: [
          {
            text: t('versus.extra_terminal_b_status', '● inactivo (dead) — 0 ventas posibles'),
          },
        ],
      },
    ]
  }

  return [
    { kind: 'cmd', parts: [{ text: '$ git clone https://github.com/tu-empresa/sistema-web.git' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_clone',
            '✓ Repositorio propio transferido — 100% en tu control'
          ),
        },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ npm run lint && npm test' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t('versus.extra_terminal_out_lint', '✓ 0 errores · Tests de arquitectura pasando'),
        },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ npm run deploy' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_build',
            '✓ Despliegue en producción OK · 0 comisiones a terceros'
          ),
        },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ cat TITULARIDAD_2025.txt' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_cat',
            '→ Código TypeScript + Base PostgreSQL dedicada. 100% TUYO.'
          ),
        },
      ],
    },
    { kind: 'cmd', parts: [{ text: '$ systemctl status soberania' }] },
    {
      kind: 'ok',
      parts: [
        {
          text: t(
            'versus.extra_terminal_out_status',
            '● activo (running) — Tu negocio online sin alquileres de por vida'
          ),
        },
      ],
    },
  ]
}

function CodeLiberationTerminal({
  mode,
  onToggleMode,
}: {
  mode: TermMode
  onToggleMode: (m: TermMode) => void
}) {
  const { t } = useTranslation()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
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

    const tickMs = 25
    const totalTicks = Math.max(1, Math.round(1200 / tickMs))
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
  const cursorClass = isSuspendido ? 'bg-rose-400' : 'bg-emerald-400'

  return (
    <div
      ref={ref}
      className="relative rounded-2xl bg-[#03060f] border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Barra superior de la consola */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#070b16] border-b border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </span>
          <span className="text-slate-400 text-[11px] ml-2">bash — terminal@exepaginasweb:~</span>
        </div>

        {/* Selector de modo integrado en la barra */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleMode('tuyo')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono transition-all cursor-pointer ${
              !isSuspendido
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            [100% TUYO]
          </button>
          <button
            type="button"
            onClick={() => onToggleMode('suspendido')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono transition-all cursor-pointer ${
              isSuspendido
                ? 'bg-rose-600 text-white font-extrabold shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            [SUSPENDIDO]
          </button>
        </div>
      </div>

      {/* Salida del terminal */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleConsoleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleConsoleClick()
          }
        }}
        className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed select-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
      >
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
                className={part.strike ? 'line-through decoration-rose-400/70' : undefined}
              >
                {shown}
              </span>
            )
          })
          return (
            <div key={i} className={line.glitch ? 'animate-pulse' : undefined}>
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
            </div>
          )
        })}

        {phase === 'done' && (
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500">
            <span>
              {isSuspendido
                ? '✗ Simulación de alquiler sin pago — click para reintentar'
                : '✓ Simulación de activo propio — click para reiniciar'}
            </span>
            <CyberRefreshIcon size={13} className="text-slate-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Matriz Táctica de Ingeniería Real (4 Ejes)
   ============================================================ */
function TacticalEngineeringMatrix() {
  const rows = [
    {
      axis: 'Propiedad del Código Fuente',
      rental:
        'Código cerrado en servidores ajenos. Si dejás de pagar, tu inversión se pierde al 100%.',
      exepaginas:
        'Repositorio Git privado transferido a tu nombre. Código TypeScript/Next.js 100% tuyo.',
    },
    {
      axis: 'Base de Datos y Tus Clientes',
      rental: 'Base de datos compartida y cautiva bajo APIs propietarias con límites estrictos.',
      exepaginas:
        'PostgreSQL dedicada (Supabase). Tenés acceso root, backups automáticos y control total.',
    },
    {
      axis: 'Comisiones de Venta y Pasarelas',
      rental:
        'Impuesto adicional del 2% al 15% sobre tus ventas brutas además de la pasarela de pago.',
      exepaginas:
        '0% de comisiones extras para siempre. Tus cobros van directo desde la pasarela a tu banco.',
    },
    {
      axis: 'Continuidad Operativa',
      rental:
        'Si no pagás la cuota mensual, tu tienda se suspende en 24 horas y tus clientes no compran.',
      exepaginas:
        'Tu sistema sigue 100% online en tu infraestructura, sin cuotas extorsivas de alquiler.',
    },
  ]

  return (
    <div data-tactical-matrix="true" className="mb-14 sm:mb-16">
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-white/10 font-mono text-[11px]">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
          <CyberTechCode size={14} className="text-cyan-400" />
          <span>[MATRIZ TÁCTICA // 4 EJES DE INGENIERÍA]</span>
        </div>
        <span className="text-slate-500 text-[10px]">INGENIERÍA VS PLANTILLA</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 font-mono text-xs uppercase tracking-wider">
              <th className="py-3 px-3 text-slate-400 w-1/4">Eje Técnico</th>
              <th className="py-3 px-3 text-rose-400 w-[37.5%]">Plataforma Alquilada (SaaS)</th>
              <th className="py-3 px-3 text-emerald-400 w-[37.5%]">
                ExePaginasWeb (Propiedad Real)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-3 font-mono font-bold text-white align-top">
                  <span className="text-cyan-400 mr-2 text-[10px]">[0{idx + 1}]</span>
                  {row.axis}
                </td>
                <td className="py-3.5 px-3 text-rose-200/80 align-top leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CyberCrossMark size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>{row.rental}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-emerald-200/90 align-top leading-relaxed font-medium">
                  <div className="flex items-start gap-2">
                    <CyberCheckMark size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{row.exepaginas}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ============================================================
   Sello Notarial Criptográfico de Autoría Directa (Exequiel Echevarria 2025)
   ============================================================ */
function NotarialAuthorshipSeal() {
  return (
    <div
      data-notarial-seal="true"
      className="p-5 sm:p-6 rounded-xl bg-[#030712]/90 border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <CyberRealPropertyShield size={15} className="text-emerald-400" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            CERTIFICADO DE AUTORÍA DIRECTA // CÓDIGO PROPIO
          </span>
        </div>
        <span className="text-slate-400 text-[10px]">ORIGEN FORMAL: 2025</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <h4 className="text-base sm:text-lg font-bold font-montserrat text-white tracking-tight">
            Autoría Directa de Exequiel Echevarría — Sin Intermediarios
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            ExePaginasWeb (Fundada en 2025): Transferencia de Repositorio GitHub a tu nombre, base
            PostgreSQL dedicada en Supabase y 0% vendor lock-in.
          </p>
        </div>

        <div className="font-mono text-left sm:text-right shrink-0">
          <div className="text-xs font-bold text-emerald-400">EXEQUIEL ECHEVARRÍA</div>
          <div className="text-[10px] text-slate-400">Software & Web Architect</div>
          <div className="text-[9px] text-slate-500 mt-1 select-all font-mono">
            SHA-256: 7e25...d2025
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Sección Principal
   ============================================================ */
export const OwnershipVsSubscription: React.FC = () => {
  const [terminalMode, setTerminalMode] = React.useState<TermMode>('tuyo')
  const [decisionPhase, setDecisionPhase] = React.useState<'experimental' | 'escala'>('escala')

  return (
    <section id="comparativa" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,color-mix(in_oklab,var(--own-500)_6%,transparent),transparent_60%),radial-gradient(60%_50%_at_80%_20%,color-mix(in_oklab,var(--rent-500)_6%,transparent),transparent_60%)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header con Honestidad Brutal */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm border border-brand/25 bg-brand/10 backdrop-blur-md mb-3 font-mono">
            <CyberInsignia size={14} className="text-brand dark:text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand dark:text-emerald-400">
              AUDITORÍA DE ARQUITECTURA // HONESTIDAD BRUTAL
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-montserrat tracking-tight text-foreground mb-3">
            Software Diseñado Alrededor de Tu Negocio: ¿Cuándo Conviene Alquilar y Cuándo Ser Dueño?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Si estás experimentando sin ventas validadas: alquilá Shopify o Wix. No gastes en
            arquitectura a medida todavía. Pero si tu negocio ya factura y pagar comisiones
            mensuales drena tu margen: el alquiler es un impuesto silencioso a tu propio
            crecimiento.
          </p>
        </motion.div>

        {/* EFECTO 1 & 2: Escáner Holográfico y Telemetría de Retención */}
        <motion.div
          data-hologram-scanner="true"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-[#060b14]/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-xl relative overflow-hidden">
            {/* Línea láser de barrido holográfico */}
            <div className="pointer-events-none absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-70" />

            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 font-mono text-[11px]">
              <span className="text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                [DIAGNÓSTICO // ESCÁNER HOLOGRÁFICO]
              </span>
              <span className="text-slate-500 text-[10px]">VERSIÓN 2026.04</span>
            </div>

            {/* Selector de fase */}
            <div className="grid grid-cols-2 gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => setDecisionPhase('experimental')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  decisionPhase === 'experimental'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>[01 // FASE EXPERIMENTAL]</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionPhase('escala')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  decisionPhase === 'escala'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>[02 // FASE ESCALA]</span>
              </button>
            </div>

            {/* Diagnóstico condicional */}
            {decisionPhase === 'experimental' ? (
              <div className="text-left p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm leading-relaxed mb-4">
                <div className="font-mono font-bold text-amber-400 mb-1 flex items-center gap-2">
                  <CyberWarningHazard size={14} className="text-amber-400" />
                  <span>RECOMENDACIÓN HONESTA: ALQUILÁ UNA PLANTILLA</span>
                </div>
                <p>
                  Si todavía no probaste el producto o no sabés si hay demanda real,{' '}
                  <strong>no inviertas en desarrollo a medida todavía</strong>. Una plantilla de $25
                  USD/mes en Shopify o Tiendanube es perfecta para validar tus primeras ventas sin
                  comprometer capital.
                </p>
              </div>
            ) : (
              <div className="text-left p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm leading-relaxed mb-4">
                <div className="font-mono font-bold text-cyan-400 mb-1 flex items-center gap-2">
                  <CyberPowerSwitch size={14} className="text-cyan-400" />
                  <span>RECOMENDACIÓN ESTRATÉGICA: CONSTRUÍ TU ACTIVO PROPIO</span>
                </div>
                <p>
                  Si ya tenés clientes o facturás mes a mes, pagar comisiones del 2% al 15% más
                  cuotas obligatorias es un impuesto permanente.{' '}
                  <strong>ExePaginasWeb te construye un activo 100% tuyo con 0% comisiones</strong>,
                  base de datos propia y retorno directo a tu bolsillo.
                </p>
              </div>
            )}

            {/* EFECTO 2: Reactor de Telemetría */}
            <div
              data-energy-reactor="true"
              className="p-3 rounded-xl bg-black/50 border border-white/10 text-left"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>MONITOR DE RETENCIÓN DE CAPITAL</span>
                </span>
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  CAPITAL PROTEGIDO // 0% FUGAS
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full w-full bg-linear-to-r from-emerald-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_#10b981]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 1. Matriz Táctica de 4 Ejes (Especificación de Ingeniería, NO card) */}
        <TacticalEngineeringMatrix />

        {/* 2. Terminal CLI Interactiva de Liberación */}
        <div className="mb-12">
          <CodeLiberationTerminal mode={terminalMode} onToggleMode={setTerminalMode} />
        </div>

        {/* 3. Sello Notarial Criptográfico */}
        <NotarialAuthorshipSeal />
      </div>
    </section>
  )
}

export default OwnershipVsSubscription
