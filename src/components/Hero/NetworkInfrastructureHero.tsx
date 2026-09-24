/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Red de Infraestructura Viva: Del Local Físico al Satélite Global
 */
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Store, Server, Radio, Orbit, Activity, Zap } from 'lucide-react'

interface NodeData {
  id: string
  title: string
  subtitle: string
  tag: string
  role: string
  image: string
  icon: React.ComponentType<{ className?: string }>
  badgeColor: string
  stats: string
}

const NODES: NodeData[] = [
  {
    id: 'local',
    title: 'Local Comercial',
    subtitle: 'Tu Negocio Físico',
    tag: 'ORIGEN',
    role: 'Captura clientes, pedidos y citas físicas',
    image: '/assets/infrastructure/local-store.jpg',
    icon: Store,
    badgeColor: 'from-fuchsia-500 to-pink-500',
    stats: 'Ventas en tiempo real',
  },
  {
    id: 'server',
    title: 'Servidor Web & BD',
    subtitle: 'El Cerebro Digital',
    tag: 'PROCESAMIENTO',
    role: 'Sistemas a medida, inventario y catálogo 24/7',
    image: '/assets/infrastructure/server-rack.jpg',
    icon: Server,
    badgeColor: 'from-cyan-500 to-blue-500',
    stats: 'Latencia < 15ms',
  },
  {
    id: 'tower',
    title: 'Torre Cloud Edge',
    subtitle: 'Conexión Ultrarrápida',
    tag: 'DISTRIBUCIÓN',
    role: 'Red CDN y fibra que acelera cada visita',
    image: '/assets/infrastructure/cloud-tower.jpg',
    icon: Radio,
    badgeColor: 'from-cyan-400 to-teal-400',
    stats: 'CDN global distribuida',
  },
  {
    id: 'satellite',
    title: 'Satélite Orbital',
    subtitle: 'Alcance Sin Fronteras',
    tag: 'EXPANSIÓN',
    role: 'Tu negocio visible en Google y todo el mundo',
    image: '/assets/infrastructure/satellite.jpg',
    icon: Orbit,
    badgeColor: 'from-purple-500 to-indigo-500',
    stats: 'Uptime 99.98% garantizado',
  },
]

export const NetworkInfrastructureHero: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(0)
  const [utcTime, setUtcTime] = useState<string>('')

  // Reloj de telemetría UTC en tiempo real estilo COMPUTE
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Rotación suave del foco entre nodos para dar sensación de pulso
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % NODES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-6xl mx-auto my-8 overflow-hidden rounded-2xl md:rounded-3xl border border-cyan-500/20 bg-[#020205]/90 p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.12)]">
      {/* Fondo Grilla de Puntos y Resplandor Central */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 via-fuchsia-500/10 to-transparent blur-[110px] pointer-events-none" />

      {/* 1. BARRA DE TELEMETRÍA EN VIVO (ESTILO COMPUTE) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/[0.08] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-slate-200 font-semibold tracking-wider">
            RED DE INFRAESTRUCTURA WEB
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            EN LÍNEA
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="hidden md:flex items-center gap-1.5 text-cyan-400/90">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>FLUJO: 4.8 GB/s</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-fuchsia-400/90">
            <Zap className="w-3.5 h-3.5" />
            <span>PULSOS: ACTIVOS</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-slate-300">
            {utcTime || '2026-09-24 15:00:00 UTC'}
          </div>
        </div>
      </div>

      {/* 2. DIAGRAMA DE RED: CABLES CON DESTELLOS Y NODOS VIVOS */}
      <div className="relative z-10">
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
            Arquitectura Visual en Tiempo Real
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-2">
            De tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">
              Comercio Físico
            </span>{' '}
            a la{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
              Nube Mundial
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
            Visualiza cómo cada página web y sistema que creamos conecta tu negocio a servidores de
            alta potencia, redes de distribución y clientes de todo el planeta.
          </p>
        </div>

        {/* CONTENEDOR DE CABLES SVG Y NODOS */}
        <div className="relative mt-8">
          {/* CABLES SVG LUMINOSOS CON PULSOS VIAJEROS (DESKTOP) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 240"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="beamGradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beamGradientMagenta" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0" />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Cable 1: Local (x: 125, y: 120) -> Servidor (x: 375, y: 120) */}
              <path
                d="M 160 120 C 240 70, 260 170, 340 120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 160 120 C 240 70, 260 170, 340 120"
                stroke="url(#beamGradientMagenta)"
                strokeWidth="3.5"
                filter="url(#glowEffect)"
                strokeLinecap="round"
                className="cable-pulse-fast"
              />

              {/* Cable 2: Servidor (x: 375, y: 120) -> Torre (x: 625, y: 120) */}
              <path
                d="M 410 120 C 490 170, 510 70, 590 120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 410 120 C 490 170, 510 70, 590 120"
                stroke="url(#beamGradientCyan)"
                strokeWidth="3.5"
                filter="url(#glowEffect)"
                strokeLinecap="round"
                className="cable-pulse-medium"
              />

              {/* Cable 3: Torre (x: 625, y: 120) -> Satélite (x: 875, y: 120) */}
              <path
                d="M 660 120 C 740 70, 760 170, 840 120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 660 120 C 740 70, 760 170, 840 120"
                stroke="url(#beamGradientMagenta)"
                strokeWidth="3.5"
                filter="url(#glowEffect)"
                strokeLinecap="round"
                className="cable-pulse-fast"
              />
            </svg>
          </div>

          {/* GRID DE LAS 4 TARJETAS / NODOS */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {NODES.map((node, index) => {
              const isSelected = activeNode === index
              const Icon = node.icon

              return (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => setActiveNode(index)}
                  className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border text-left ${
                    isSelected
                      ? 'border-cyan-400 bg-white/6 shadow-[0_0_35px_rgba(6,182,212,0.25)] scale-[1.02]'
                      : 'border-white/8 bg-white/2 hover:border-cyan-500/40 hover:bg-white/4'
                  }`}
                >
                  {/* Badge de Rol / Etiqueta */}
                  <div className="flex items-center justify-between p-3 border-b border-white/6 bg-black/40 w-full">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}
                      />
                      <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
                        {`0${index + 1} // ${node.tag}`}
                      </span>
                    </div>
                    <Icon
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}
                    />
                  </div>

                  {/* Imagen 3D Render con resplandor */}
                  <div className="relative aspect-square w-full bg-black/60 overflow-hidden flex items-center justify-center">
                    <Image
                      src={node.image}
                      alt={node.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className={`object-cover transition-transform duration-700 ${
                        isSelected ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Halo de luz al centro en selección */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none mix-blend-screen" />
                    )}
                  </div>

                  {/* Datos del Nodo */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between bg-black/40">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-[11px] text-cyan-400/90 font-medium">{node.subtitle}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{node.role}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>MÉTRICA</span>
                      <span className="text-emerald-400 font-semibold">{node.stats}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. MÉTRICAS 3-COLUMNAS ESTILO COMPUTE */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              0.4s
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">
              Carga Ultrarrápida
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
              100%
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">
              Código Propio Sin Ataduras
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              99.98%
            </p>
            <p className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">
              Uptime Conectado al Mundo
            </p>
          </div>
        </div>
      </div>

      {/* ESTILOS CSS INLINE PARA LA ANIMACIÓN DE LOS PULSOS / CABLES */}
      <style jsx>{`
        .cable-pulse-fast {
          stroke-dasharray: 60 280;
          animation: pulseTravel 2.8s linear infinite;
        }
        .cable-pulse-medium {
          stroke-dasharray: 70 320;
          animation: pulseTravel 3.6s linear infinite;
        }
        @keyframes pulseTravel {
          from {
            stroke-dashoffset: 390;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default NetworkInfrastructureHero
