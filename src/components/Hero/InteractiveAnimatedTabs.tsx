/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Consola Interactiva con Typewriter Espacial y Difuminado Progresivo (Blur-in)
 *
 * - Escritura secuencial carácter por carácter y línea por línea (cadencia espacial lenta y envolvente).
 * - Difuminado cósmico (blur 8px -> 0px) con resplandor suave de transmisión cuántica.
 * - Activación automática al scrollear a la consola (useInView) y botón de re-ejecución instantánea.
 * - Resaltado sintáctico completo y cursor terminal titilante neón.
 */
'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Terminal, Globe, Database, Zap, Check, Copy, Code2, RotateCw } from 'lucide-react'

interface TabContent {
  id: string
  label: string
  filename: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
  code: string[]
}

const TABS: TabContent[] = [
  {
    id: 'landing',
    label: 'Páginas Web',
    filename: 'web.config.ts',
    icon: Globe,
    badge: 'ALTA CONVERSIÓN',
    code: [
      '// 1. Despliegue de Página Web de Alto Impacto',
      'export const siteConfig = {',
      '  brand: "Tu Negocio",',
      '  seo: { score: 100, googleIndexing: "instantánea" },',
      '  loadTime: "0.38s", // Edge CDN Global',
      '  conversionOptimization: true,',
      '  responsive: ["Mobile First", "Tablet", "UltraWide 4K"],',
      '  tracking: { analytics: "en tiempo real", privacyFirst: true },',
      '}',
      '',
      '// Tu web vende las 24 horas sin caídas.',
    ],
  },
  {
    id: 'sistema',
    label: 'Sistemas a Medida',
    filename: 'dashboard.module.ts',
    icon: Database,
    badge: 'PROCESOS AUTOMATIZADOS',
    code: [
      '// 2. Plataforma y Sistema Web a Medida',
      'import { createSystem } from "@exepaginasweb/core"',
      '',
      'export default createSystem({',
      '  modulos: ["Ventas", "Inventario", "Facturación", "Clientes"],',
      '  database: "Postgres + Supabase con RLS de alta seguridad",',
      '  roles: ["Administrador", "Vendedor", "Contador"],',
      '  propiedadDelCodigo: "100% tuyo sin mensualidades cautivas",',
      '})',
    ],
  },
  {
    id: 'automation',
    label: 'Automatización',
    filename: 'webhook.notifications.ts',
    icon: Zap,
    badge: 'NOTIFICACIONES 24/7',
    code: [
      '// 3. Webhooks y Conexión Automática',
      'onNewOrder(async ({ cliente, pedido, total }) => {',
      '  await Promise.all([',
      '    sendWhatsAppNotification(cliente.telefono, `¡Pedido #${pedido.id} confirmado!`),',
      '    generateElectronicInvoice(pedido),',
      '    updateInventoryStock(pedido.items),',
      '  ])',
      '})',
    ],
  },
  {
    id: 'deploy',
    label: 'Despliegue Cloud',
    filename: 'deploy.sh',
    icon: Terminal,
    badge: 'TURBOPACK 16',
    code: [
      '# 4. Infraestructura en producción',
      'exe-cloud deploy --production --global-cdn',
      '✓ Compilado en 280ms con Turbopack',
      '✓ Edge Cache activado en 320 regiones',
      '✓ Certificados SSL y protección anti-DDoS activa',
      '● SISTEMA LISTO EN https://tunegocio.com',
    ],
  },
]

// Tokenizador de sintaxis de alto contraste para código
function tokenizeLine(line: string): Array<{ text: string; colorClass: string }> {
  const trimmed = line.trim()
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    return [{ text: line, colorClass: 'text-slate-400 dark:text-slate-500 italic' }]
  }

  if (trimmed.startsWith('✓') || trimmed.startsWith('●')) {
    return [{ text: line, colorClass: 'text-emerald-600 dark:text-emerald-400 font-semibold' }]
  }

  const regex =
    /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\b(?:export|const|default|import|from|async|await|return|true|false|\d+)\b|[{}()[\]:,;=><]|[^\s"'{}[\]:,;=><]+|\s+)/g
  const tokens: Array<{ text: string; colorClass: string }> = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(line)) !== null) {
    const raw = match[0]
    let colorClass = 'text-slate-800 dark:text-slate-200'

    if (raw.startsWith('//')) {
      colorClass = 'text-slate-400 dark:text-slate-500 italic'
    } else if (raw.startsWith('"') || raw.startsWith("'") || raw.startsWith('`')) {
      colorClass = 'text-emerald-600 dark:text-emerald-300 font-medium'
    } else if (/^(export|const|default|import|from|async|await|return)$/.test(raw)) {
      colorClass = 'text-purple-600 dark:text-fuchsia-400 font-semibold'
    } else if (/^(true|false|\d+)$/.test(raw)) {
      colorClass = 'text-amber-600 dark:text-amber-300 font-mono'
    } else if (/^[{}()[\]]$/.test(raw)) {
      colorClass = 'text-cyan-600 dark:text-cyan-400 font-bold'
    } else if (
      /^(siteConfig|brand|seo|score|googleIndexing|loadTime|conversionOptimization|responsive|tracking|analytics|privacyFirst|modulos|database|roles|propiedadDelCodigo)$/.test(
        raw
      )
    ) {
      colorClass = 'text-sky-600 dark:text-sky-300'
    } else if (
      /^(createSystem|onNewOrder|sendWhatsAppNotification|generateElectronicInvoice|updateInventoryStock|Promise|all)$/.test(
        raw
      )
    ) {
      colorClass = 'text-blue-600 dark:text-cyan-400 font-semibold'
    }

    tokens.push({ text: raw, colorClass })
  }

  return tokens.length > 0
    ? tokens
    : [{ text: line, colorClass: 'text-slate-800 dark:text-slate-200' }]
}

interface AnimatedChar {
  char: string
  delay: number
  colorClass: string
  key: string
}

interface AnimatedLine {
  lineIndex: number
  isEmpty: boolean
  chars: AnimatedChar[]
}

export const InteractiveAnimatedTabs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: '-60px' })

  const getTabLabel = (id: string, defaultLabel: string) => {
    if (id === 'landing') return t('hero.tab_paginas_web') || defaultLabel
    if (id === 'sistema') return t('hero.tab_sistemas_medida') || defaultLabel
    if (id === 'automation') return t('hero.tab_automatizacion') || defaultLabel
    if (id === 'deploy') return t('hero.tab_despliegue_cloud') || defaultLabel
    return defaultLabel
  }

  const [activeTab, setActiveTab] = useState(TABS[0]?.id || 'landing')
  const [copied, setCopied] = useState(false)
  const [replayCount, setReplayCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  // Iniciar la animación cuando el componente entre en el viewport
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true)
    }
  }, [isInView, hasStarted])

  const currentTab = TABS.find((t) => t.id === activeTab) ?? (TABS[0] as TabContent)

  const handleCopy = () => {
    if (!currentTab) return
    navigator.clipboard.writeText(currentTab.code.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Precomputar la secuencia secuencial genuina de máquina de escribir espacial
  const { animatedLines, totalDurationMs: _totalDurationMs } = useMemo(() => {
    let cumulativeDelay = 120 // delay inicial tras seleccionar o entrar
    const CHAR_DELAY = 26 // 26ms por carácter: cadencia lenta, espacial y rítmica
    const LINE_PAUSE = 130 // 130ms de pausa al finalizar cada línea (salto de carro espacial)

    const lines: AnimatedLine[] = currentTab.code.map((lineText, li) => {
      if (!lineText.trim()) {
        cumulativeDelay += 90
        return { lineIndex: li, isEmpty: true, chars: [] }
      }

      const tokens = tokenizeLine(lineText)
      const chars: AnimatedChar[] = []

      let charIndex = 0
      for (const token of tokens) {
        for (const ch of token.text) {
          chars.push({
            char: ch,
            delay: cumulativeDelay,
            colorClass: token.colorClass,
            key: `char-${li}-${charIndex}-${ch}`,
          })
          cumulativeDelay += CHAR_DELAY
          charIndex++
        }
      }

      cumulativeDelay += LINE_PAUSE
      return { lineIndex: li, isEmpty: false, chars }
    })

    return { animatedLines: lines, totalDurationMs: cumulativeDelay }
  }, [currentTab])

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#050711]/95 backdrop-blur-2xl shadow-2xl dark:shadow-[0_0_60px_rgba(6,182,212,0.14)] ${className}`}
    >
      {/* AURA AMBIENTAL ESPACIAL DE FONDO */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none" />

      {/* 1. BARRA DE PESTAÑAS (TABS HEADER CON SLIDING INDICATOR) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-black/40">
        {/* Lista de Pestañas con shared layoutId */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  setHasStarted(true)
                }}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap outline-none cursor-pointer ${
                  isActive
                    ? 'text-slate-950 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {/* SLIDING TAB INDICATOR */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 shadow-xs dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    transition={{ type: 'spring', bounce: 0.16, duration: 0.45 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`}
                />
                <span className="relative z-10">{getTabLabel(tab.id, tab.label)}</span>
              </button>
            )
          })}
        </div>

        {/* Acciones del Header: Re-escribir y Copiar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <Code2 className="w-3 h-3 text-cyan-500" />
            {currentTab?.filename}
          </span>

          {/* Botón Re-escribir (Reinicia la máquina de escribir lenta/espacial) */}
          <button
            type="button"
            onClick={() => setReplayCount((c) => c + 1)}
            className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-transparent hover:border-cyan-500/30"
            title="Re-ejecutar animación de máquina de escribir espacial"
          >
            <RotateCw className="w-3 h-3 text-cyan-500" />
            <span>{t('hero.sub_replay') || 'Re-escribir'}</span>
          </button>

          {/* Botón Copiar */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/12 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-white/20"
            title="Copiar código al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t('common.copiado') || 'Copiado'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>{t('common.copiar') || 'Copiar'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. VENTANA DE LA CONSOLA (CON ALTO FIJO Y EFECTO ESPACIAL) */}
      <div className="relative z-10 w-full min-h-[350px] sm:min-h-[340px] p-4 sm:p-7 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
        {/* Telemetría superior de estado */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
              {currentTab?.badge}
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">
            Transmisión Cuántica // Latencia 0.38s
          </span>
        </div>

        {/* 3. CONTENEDOR TYPEWRITER CON DIFUMINADO ESPACIAL
            La key se resetea al cambiar tab, hacer replay o entrar en vista */}
        <div
          key={`${activeTab}-${replayCount}-${hasStarted ? 'run' : 'wait'}`}
          className="flex flex-col gap-1 select-text"
        >
          {animatedLines.map((lineData) => {
            const { lineIndex, isEmpty, chars } = lineData

            if (isEmpty) {
              return (
                <div
                  key={`empty-line-${lineIndex}`}
                  className="min-h-[1.7em] flex gap-3 items-center"
                >
                  <span className="text-slate-400 dark:text-slate-600 select-none w-5 text-right shrink-0 text-xs opacity-60">
                    {lineIndex + 1}
                  </span>
                </div>
              )
            }

            return (
              <div
                key={`code-line-${lineIndex}`}
                className="min-h-[1.7em] flex gap-3 items-start leading-[1.7]"
              >
                <span className="text-slate-400 dark:text-slate-600 select-none w-5 text-right shrink-0 text-xs opacity-60">
                  {lineIndex + 1}
                </span>

                <div className="flex-1 break-all">
                  {chars.map((item) => (
                    <span
                      key={item.key}
                      className={`spatial-typewriter-char ${item.colorClass}`}
                      style={{ animationDelay: `${item.delay}ms` }}
                    >
                      {item.char}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Cursor terminal parpadeante cósmico */}
        <div className="mt-2 flex items-center gap-2 text-cyan-500/80 text-xs font-mono">
          <span className="inline-block w-2.5 h-4 bg-cyan-400 dark:bg-cyan-300 shadow-[0_0_10px_#06b6d4] animate-pulse rounded-xs" />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Consola Activa
          </span>
        </div>
      </div>

      {/* ESTILOS CSS PARA DIFUMINADO + MÁQUINA DE ESCRIBIR ESPACIAL LENTA (100% GPU COMPOSITED) */}
      <style jsx>{`
        .spatial-typewriter-char {
          display: inline-block;
          white-space: pre;
          opacity: 0;
          transform: translate3d(0, 2px, 0);
          animation: spatialTypewriter 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: opacity, transform;
        }

        @keyframes spatialTypewriter {
          0% {
            opacity: 0;
            transform: translate3d(0, 2px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spatial-typewriter-char {
            opacity: 1;
            filter: blur(0px);
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default InteractiveAnimatedTabs
