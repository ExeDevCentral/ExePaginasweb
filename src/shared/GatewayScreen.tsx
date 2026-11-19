/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Gateway Screen: Split-Screen Executive Choice con Spotlight reactivo al puntero,
 * Aurora Mesh sutil, paleta unificada (Obsidian #050811 + Cyan #38bdf8 + Violet #a855f7 + Emerald #047857)
 * y atajos de teclado directos (1 = Classic, 2 = V2).
 */
'use client'

import { type MouseEvent, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Check, Lock, Mail, Sparkles, Terminal } from 'lucide-react'
import { type SiteFace, useFacePreference } from '@/shared/face-preference'
import { getArgentinaDeskStatus, type ArtDeskStatus } from '@/faces/v2/v2-i18n'

function prefetchFaceChunk(face: SiteFace): void {
  if (face === 'classic') {
    void import('@/faces/classic/ClassicFaceView')
  } else {
    void import('@/faces/v2/V2CloudUtilityApp')
  }
}

function ExeLogo({ dotColor, className }: { dotColor: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 535 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
        fill="currentColor"
      />
      <path
        d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
        fill="currentColor"
      />
      <path
        d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
        fill="currentColor"
      />
      <rect x="493" y="165" width="35" height="35" fill={dotColor} rx="3" />
    </svg>
  )
}

export default function GatewayScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { face, isReady, setFace } = useFacePreference()
  const [navigatingTo, setNavigatingTo] = useState<SiteFace | null>(null)
  const [deskStatus, setDeskStatus] = useState<ArtDeskStatus>(() => getArgentinaDeskStatus())
  const [spotlight, setSpotlight] = useState<{ x: number; y: number }>({ x: 50, y: 30 })

  const forceChoose = searchParams?.get('choose') === '1'

  useEffect(() => {
    setDeskStatus(getArgentinaDeskStatus())
  }, [])

  useEffect(() => {
    if (!isReady || forceChoose) return
    if (face === 'classic' || face === 'v2') {
      router.replace(`/${face}`)
    }
  }, [face, forceChoose, isReady, router])

  const handleSelectFace = useCallback(
    (selected: SiteFace) => {
      setNavigatingTo(selected)
      setFace(selected)
      router.push(`/${selected}`)
    },
    [router, setFace]
  )

  // Keyboard shortcuts: press "1" for Classic, "2" for V2
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.key === '1') handleSelectFace('classic')
      if (event.key === '2') handleSelectFace('v2')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSelectFace])

  const handlePrefetch = (target: SiteFace) => {
    prefetchFaceChunk(target)
    router.prefetch(`/${target}`)
  }

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })
  }

  return (
    <div
      data-face="gateway"
      onMouseMove={handlePointerMove}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#050811] text-slate-100"
    >
      {/* Ambient Grid + Aurora Mesh + Pointer Spotlight (100% GPU CSS, cero librerías) */}
      <div className="gw-grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="gw-aurora pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="gw-aurora pointer-events-none absolute -bottom-40 right-1/4 h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-[120px]"
        style={{ animationDelay: '3s' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(520px circle at ${spotlight.x}% ${spotlight.y}%, rgba(56, 189, 248, 0.09), transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Top Executive Bar — Marca viva con identidad real EXE // PAGINASWEB.COM */}
      <header className="relative z-10 overflow-hidden border-b border-white/[0.08] bg-[#050811]/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
        {/* Haz luminoso sutil recorriendo el borde inferior */}
        <div
          className="gw-header-beam pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-1/3 bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
          aria-hidden="true"
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="group flex items-center gap-3.5">
            <div className="relative flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 shadow-[0_0_20px_-6px_rgba(56,189,248,0.45)] transition-all duration-200 group-hover:border-sky-400/40 group-hover:shadow-[0_0_24px_-4px_rgba(56,189,248,0.65)]">
              <ExeLogo dotColor="#38bdf8" className="h-4 w-auto text-white" />
            </div>

            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1 text-[13px] font-extrabold tracking-wide text-white sm:text-[14px]">
                <span>EXE</span>
                <span className="font-black text-amber-400">{'//'}</span>
                <span>PAGINASWEB</span>
                <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  .COM
                </span>
              </div>
              <div className="mt-1 hidden items-center gap-1.5 text-[10.5px] font-medium tracking-wide text-slate-400 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>Arquitectura Web Propia · Est. 2025</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold md:inline-flex ${
                deskStatus.isOpen
                  ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-400/30 bg-amber-500/10 text-amber-300'
              }`}
            >
              {deskStatus.isOpen ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              ) : (
                <Lock className="h-3 w-3" aria-hidden="true" />
              )}
              <span>
                {deskStatus.isOpen ? 'Mesa Activa' : 'Solo Días Hábiles'} ·{' '}
                {deskStatus.artTimeFormatted}
              </span>
            </span>

            <a
              href="mailto:exemetal@hotmail.com"
              className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition-colors hover:border-sky-300/60 hover:bg-sky-500/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Executive Choice */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mb-9 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-fuchsia-200">
            <Sparkles className="h-3 w-3 text-fuchsia-300" aria-hidden="true" />
            <span>Exequiel Echevarría · Software &amp; Web Architect</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Dos formas de entrar a{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              ExePaginasWeb
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Elegí la experiencia que mejor encaja con tu visita hoy. Guardamos tu elección para el
            próximo ingreso y podés alternar cuando quieras.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          role="group"
          aria-label="Selector de versión del sitio"
        >
          {/* Puerta 1: Classic (Estudio Interactivo Completo — Paleta Cyan/Violeta fiel a tu sitio) */}
          <button
            type="button"
            onClick={() => handleSelectFace('classic')}
            onMouseEnter={() => handlePrefetch('classic')}
            onFocus={() => handlePrefetch('classic')}
            disabled={navigatingTo !== null}
            aria-label="Entrar a la versión Classic: Estudio Web Interactivo completo"
            className="group relative flex min-h-[310px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-sky-400/20 bg-[#0b1120]/85 p-6 text-left backdrop-blur-md transition-[transform,opacity,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-sky-400/60 hover:shadow-[0_20px_50px_-15px_rgba(56,189,248,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-60 sm:p-8"
          >
            <div>
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Classic · Estudio Completo
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <kbd className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300">
                    1
                  </kbd>
                  <span>/classic</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white">Explorar el Ecosistema</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                La experiencia inmersiva completa de ExePaginasWeb: portafolio interactivo, demos en
                vivo, cotizador, tienda y asistente IA integrado.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                  Portafolio interactivo, demos y arquitectura real
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden="true" />
                  Cotizador, tienda online y panel de cliente
                </li>
              </ul>

              {/* Micro-Preview vivo: Ecosistema interactivo */}
              <div
                aria-hidden="true"
                className="mt-5 flex items-center justify-between rounded-lg border border-sky-400/15 bg-[#050811]/80 px-3.5 py-2.5 font-mono text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="gw-dot-breathe h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                  <span className="gw-dot-breathe h-1.5 w-1.5 rounded-full bg-fuchsia-400 [animation-delay:600ms]" />
                  <span className="text-slate-300">interactive.studio</span>
                </div>
                <span className="text-[10px] text-sky-300/90">3D · Demos · AI Chat</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-sky-300">
              <span>{navigatingTo === 'classic' ? 'Abriendo Classic...' : 'Entrar a Classic'}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </button>

          {/* Puerta 2: V2 (Cloud Utility — Contraste Claro Ejecutivo + Esmeralda #047857) */}
          <button
            type="button"
            onClick={() => handleSelectFace('v2')}
            onMouseEnter={() => handlePrefetch('v2')}
            onFocus={() => handlePrefetch('v2')}
            disabled={navigatingTo !== null}
            aria-label="Entrar a la versión V2: Cloud Utility Directo y Empresarial"
            className="group relative flex min-h-[310px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#ecfdf5]/70 p-6 text-left text-[#0f172a] transition-[transform,opacity,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[#047857] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] disabled:opacity-60 sm:p-8"
          >
            <div>
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  V2 · Cloud Utility
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                  <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-700">
                    2
                  </kbd>
                  <span>/v2</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#0f172a]">Servicios Directos &amp; SLA</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                Interfaz ejecutiva estilo AWS Cloud Utility: matriz comparativa en vivo, precios
                transparentes, 7 idiomas y activación directa en 1 clic.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-[#334155]">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />
                  Matriz técnica interactiva + entrega y precios claros
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />7 idiomas,
                  horario ART en vivo y brief copiable
                </li>
              </ul>

              {/* Micro-Preview vivo: Matriz Cloud Utility */}
              <div
                aria-hidden="true"
                className="mt-5 flex items-center justify-between rounded-lg border border-emerald-600/20 bg-white px-3.5 py-2.5 font-mono text-[11px] shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="gw-dot-breathe h-2 w-2 rounded-full bg-[#047857]" />
                  <span className="font-semibold text-[#0f172a]">edge-latam · 14ms</span>
                </div>
                <span className="rounded bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-bold text-[#047857]">
                  ✓ 99.9% SLA
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200/90 pt-4 text-sm font-bold text-[#047857]">
              <span>{navigatingTo === 'v2' ? 'Abriendo V2...' : 'Entrar a V2 Cloud Utility'}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] px-4 py-4 text-xs text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>© 2025 Exequiel Echevarría — ExePaginasWeb</span>
          <span className="font-mono text-[11px] text-slate-500">
            Atajos: [1] Classic · [2] V2 Cloud Utility
          </span>
        </div>
      </footer>
    </div>
  )
}
