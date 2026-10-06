/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * DeferredChatWidget — Lazy wrapper para AIChatWidget
 * Carga el motor completo de AI (@ai-sdk/react + ai) bajo demanda para
 * reducir hasta 150 KiB del bundle crítico inicial de la página.
 */
'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Logo from '../layout/Logo'

const FullAIChatWidget = dynamic(() => import('./AIChatWidget'), {
  ssr: false,
})

export default function DeferredChatWidget() {
  const [shouldLoad, setShouldLoad] = useState(false)

  // En celulares no forzamos la carga del motor de IA hasta que el usuario interactúe
  // Esto elimina 3 tareas largas de ~75ms y 150 KiB de descarga en redes móviles
  useEffect(() => {
    // Si estamos en desktop de alta potencia, podemos precargar en idle tardío (>15s)
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  if (shouldLoad) {
    return <FullAIChatWidget />
  }

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 select-none">
      <button
        type="button"
        onMouseEnter={() => setShouldLoad(true)}
        onTouchStart={() => setShouldLoad(true)}
        onClick={() => setShouldLoad(true)}
        aria-label="Abrir canales de atención"
        className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#0a0d14]/95 text-white border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl backdrop-blur-2xl transition-all duration-300 shadow-cyan-500/20 cursor-pointer active:scale-95"
      >
        <span className="absolute -inset-0.5 rounded-full bg-linear-to-r from-cyan-500 via-sky-400 to-emerald-400 opacity-20 group-hover:opacity-60 blur-xs transition-opacity duration-300" />

        <div className="relative w-9 h-9 rounded-full bg-[#0a0f1d] border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
          <div className="flex items-center justify-center">
            <Logo size={26} variant="dark" />
          </div>
        </div>

        <div className="text-left hidden sm:block pr-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              SYS // CANALES EN VIVO
            </span>
          </div>
          <span className="text-xs font-bold tracking-tight text-white block">
            WhatsApp & Asistente IA
          </span>
        </div>

        <div className="sm:hidden flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white">Canales</span>
        </div>
      </button>
    </div>
  )
}
