/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * MagnificentIcons: Sistema de iconografía de alta ingeniería visual.
 * Cero iconos genéricos: capas vectoriales duotono, auras neón OKLCH/RGB,
 * micro-retículas láser y aceleración 100% por hardware GPU (transform: translateZ(0)) a 120 FPS.
 */
'use client'

import React from 'react'

export interface IconBaseProps {
  className?: string
  size?: number
}

// 1. Radar Beacon para el Badge de Disponibilidad en Vivo (120 FPS puro en CSS)
export function CyberRadarBeacon({ className = '', size = 10 }: Readonly<IconBaseProps>) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* Onda expansiva acústica 1 */}
      <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping" />
      {/* Halo estático brillante */}
      <span className="absolute -inset-1 rounded-full bg-cyan-400/40 blur-xs" />
      {/* Núcleo de alta luminancia */}
      <span className="relative w-2 h-2 rounded-full bg-white dark:bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
    </span>
  )
}

// 2. Chevron Aeroespacial Dinámico con Reflejo Gradiente
export function CyberChevron({
  isOpen = false,
  className = '',
  size = 14,
}: Readonly<IconBaseProps & { isOpen?: boolean }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ease-out ${
        isOpen ? 'rotate-180' : 'rotate-0'
      } ${className}`}
      style={{ transformOrigin: 'center', willChange: 'transform' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cyberChevronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path
        d="m6 9 6 6 6-6"
        stroke="url(#cyberChevronGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="1.5" fill="#22d3ee" className="animate-pulse" />
    </svg>
  )
}

// 3. Botón Burger / Close Cinético de 2 Pistas Láser
export function CyberBurgerIcon({
  isOpen = false,
  className = '',
  size = 18,
}: Readonly<IconBaseProps & { isOpen?: boolean }>) {
  return (
    <span
      className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* Pista superior */}
      <span
        className={`block h-0.5 w-4 rounded-full bg-linear-to-r from-cyan-400 to-sky-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] transition-all duration-300 ease-out origin-center ${
          isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.75'
        }`}
      />
      {/* Pista inferior */}
      <span
        className={`block h-0.5 w-4 rounded-full bg-linear-to-r from-sky-400 to-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] transition-all duration-300 ease-out origin-center ${
          isOpen ? '-rotate-45 -translate-y-px' : 'translate-y-0.75'
        }`}
      />
    </span>
  )
}

// 4. Globo Holográfico Orbital para Selector de Idiomas
export function CyberGlobeIcon({ className = '', size = 15 }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cyberGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      {/* Círculo perimetral */}
      <circle cx="12" cy="12" r="9.5" stroke="url(#cyberGlobeGrad)" strokeWidth="1.8" />
      {/* Meridiano elíptico */}
      <ellipse
        cx="12"
        cy="12"
        rx="4.5"
        ry="9.5"
        stroke="url(#cyberGlobeGrad)"
        strokeWidth="1.4"
        opacity="0.85"
      />
      {/* Ecuador horizontal */}
      <line
        x1="2.5"
        y1="12"
        x2="21.5"
        y2="12"
        stroke="url(#cyberGlobeGrad)"
        strokeWidth="1.4"
        opacity="0.85"
      />
      {/* Polar diodes */}
      <circle cx="12" cy="2.5" r="1.2" fill="#22d3ee" />
      <circle cx="12" cy="21.5" r="1.2" fill="#34d399" />
    </svg>
  )
}

// 5. Sparkle Geométrico Isométrico (Alineación con botón CTA)
export function CyberSparkleIcon({ className = '', size = 13 }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 animate-pulse ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

// 6. Solución 1: Turnos Online (Peluquerías / Estética)
export function CyberAppointmentIcon({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Marco de calendario de cristal */}
      <rect
        x="4"
        y="6"
        width="24"
        height="22"
        rx="6"
        stroke="url(#appGrad)"
        strokeWidth="2"
        fill="rgba(6,182,212,0.12)"
      />
      {/* Línea de cabecera */}
      <line x1="4" y1="13" x2="28" y2="13" stroke="url(#appGrad)" strokeWidth="1.8" opacity="0.6" />
      {/* Pines de montura */}
      <circle cx="10" cy="5" r="1.5" fill="#22d3ee" />
      <circle cx="22" cy="5" r="1.5" fill="#22d3ee" />
      {/* Reloj con manecillas de precisión */}
      <circle
        cx="16"
        cy="20"
        r="5"
        stroke="#38bdf8"
        strokeWidth="1.5"
        fill="rgba(14,165,233,0.2)"
      />
      <path d="M16 17.5V20L18 21.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// 7. Solución 2: Comandas & Gastronomía (Panaderías / Salón)
export function CyberComandaIcon({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="comandaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Ticket digital perforado */}
      <path
        d="M6 5C6 3.89543 6.89543 3 8 3H24C25.1046 3 26 3.89543 26 5V27L22.5 25L19.5 27L16 25L12.5 27L9.5 25L6 27V5Z"
        stroke="url(#comandaGrad)"
        strokeWidth="2"
        fill="rgba(245,158,11,0.12)"
      />
      {/* Código de barras / comanda */}
      <line x1="10" y1="8" x2="22" y2="8" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
      <line
        x1="10"
        y1="12"
        x2="18"
        y2="12"
        stroke="#fcd34d"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Llama o KDS Check */}
      <circle
        cx="16"
        cy="18"
        r="3.5"
        fill="rgba(245,158,11,0.25)"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />
      <path
        d="M14.5 18L15.5 19L17.5 17"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 8. Solución 3: Catálogo Vivo (Indumentaria / Talles)
export function CyberCatalogIcon({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="catalogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Capa trasera isométrica */}
      <rect
        x="9"
        y="4"
        width="17"
        height="17"
        rx="4"
        stroke="url(#catalogGrad)"
        strokeWidth="1.5"
        opacity="0.45"
      />
      {/* Capa frontal con tag de producto */}
      <rect
        x="5"
        y="9"
        width="18"
        height="18"
        rx="4"
        stroke="url(#catalogGrad)"
        strokeWidth="2"
        fill="rgba(16,185,129,0.14)"
      />
      <circle cx="10" cy="14" r="1.5" fill="#34d399" />
      <line
        x1="14"
        y1="14"
        x2="19"
        y2="14"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="19"
        x2="19"
        y2="19"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <line
        x1="9"
        y1="22"
        x2="15"
        y2="22"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

// 9. Solución 4: Canchas & Ocupación 24/7 (Deportes / Turnos continuos)
export function CyberPitchRadarIcon({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Límites de cancha */}
      <rect
        x="4"
        y="6"
        width="24"
        height="20"
        rx="4"
        stroke="url(#pitchGrad)"
        strokeWidth="2"
        fill="rgba(59,130,246,0.12)"
      />
      {/* Línea media y círculo central */}
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="26"
        stroke="#93c5fd"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <circle
        cx="16"
        cy="16"
        r="4.5"
        stroke="url(#pitchGrad)"
        strokeWidth="1.5"
        fill="rgba(96,165,250,0.2)"
      />
      {/* Radar sweep dot */}
      <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
      <circle cx="23" cy="12" r="1.5" fill="#60a5fa" className="animate-ping" />
    </svg>
  )
}

// 10. Cotizador Interactivo: Calculadora Cuántica
export function CyberCalculatorIcon({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="4"
        stroke="url(#calcGrad)"
        strokeWidth="2"
        fill="rgba(16,185,129,0.14)"
      />
      <rect
        x="7"
        y="5"
        width="10"
        height="4"
        rx="1.5"
        fill="#064e3b"
        stroke="#34d399"
        strokeWidth="1.2"
      />
      <circle cx="8.5" cy="13" r="1" fill="#6ee7b7" />
      <circle cx="12" cy="13" r="1" fill="#6ee7b7" />
      <circle cx="15.5" cy="13" r="1" fill="#6ee7b7" />
      <circle cx="8.5" cy="17" r="1" fill="#6ee7b7" />
      <circle cx="12" cy="17" r="1" fill="#6ee7b7" />
      <circle cx="15.5" cy="17" r="1" fill="#a7f3d0" />
    </svg>
  )
}

// 11. Tienda Online: Cyber Bag con Nodo de Token
export function CyberShopBagIcon({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path
        d="M6 7H18L19.5 20C19.5 20.5523 19.0523 21 18.5 21H5.5C4.94772 21 4.5 20.5523 4.5 20L6 7Z"
        stroke="url(#bagGrad)"
        strokeWidth="2"
        fill="rgba(6,182,212,0.12)"
      />
      <path
        d="M9 9V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V9"
        stroke="#38bdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="2" fill="#22d3ee" className="animate-pulse" />
    </svg>
  )
}

// 12. RESTOia Engine Micro-chip
export function RestoiaEngineIcon({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="restoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3.5"
        stroke="url(#restoGrad)"
        strokeWidth="2"
        fill="rgba(6,182,212,0.16)"
      />
      <circle cx="12" cy="12" r="3" fill="#22d3ee" />
      <line x1="12" y1="1" x2="12" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="12" y1="20" x2="12" y2="23" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="1" y1="12" x2="4" y2="12" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="20" y1="12" x2="23" y2="12" stroke="#38bdf8" strokeWidth="1.5" />
    </svg>
  )
}

// 13. WhatsApp Neón Esmeralda en Vivo
export function WhatsAppLiveIcon({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="url(#waGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(16,185,129,0.18)"
      />
      <circle cx="12" cy="12" r="2.5" fill="#34d399" className="animate-ping" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// 14. Rayo Cinético Fotónico (Edge CDN Metric)
export function CyberMetricLightning({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path
        d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"
        fill="url(#boltGrad)"
        stroke="#38bdf8"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="12" r="1.2" fill="#ffffff" />
    </svg>
  )
}

// 15. Escudo de Autonomía Total (100% Tuyo Metric)
export function CyberMetricShield({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        fill="rgba(6,182,212,0.15)"
        stroke="url(#shieldGrad)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="#34d399"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 16. Procesador Cuántico Autónomo (Autónomo 24/7 Metric)
export function CyberMetricProcessor({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="3"
        stroke="url(#chipGrad)"
        strokeWidth="1.8"
        fill="rgba(6,182,212,0.12)"
      />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#38bdf8" />
      <path
        d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3M19 9h3m-3 6h3"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 17. Flecha de Telemetría Aeroespacial
export function CyberArrowRight({ size = 16, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M4 12h14m-5-5 5 5-5 5"
        stroke="url(#arrGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="12" r="1.5" fill="#22d3ee" />
    </svg>
  )
}

// 18. Delta Play Láser para Portafolio
export function CyberPlayIcon({ size = 14, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M6 4.5v15l13.5-7.5L6 4.5Z"
        fill="url(#cyberSparkleGrad)"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// 19. Micro-check SLA Láser
export function CyberCheckMark({ size = 14, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.5" fill="rgba(16,185,129,0.15)" />
      <path
        d="m5 8 2 2 4-4"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 20. Estrella de Calificación Facetada
export function CyberRatingStar({ size = 14, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#starGrad)"
        stroke="#fbbf24"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.5" r="1.5" fill="#ffffff" opacity="0.8" />
    </svg>
  )
}

// 21. Tacómetro de Alta Velocidad (LCP Instantáneo)
export function CyberSpeedGauge({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="M12 3a9 9 0 0 0-9 9c0 2.5 1 4.7 2.7 6.4L7 17a7 7 0 0 1 10 0l1.3 1.4A8.96 8.96 0 0 0 21 12a9 9 0 0 0-9-9Z"
        stroke="url(#gaugeGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line x1="12" y1="12" x2="17" y2="7" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
      <circle cx="12" cy="12" r="1" fill="#ffffff" />
    </svg>
  )
}

// 22. Escudo de Propiedad Real 100% Tuyo (Biselado 3D multicapa con aura esmeralda y facetas de titanio)
export function CyberRealPropertyShield({ size = 32, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradiente exterior titanio esmeralda */}
        <linearGradient id="shieldFacetL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="40%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="shieldFacetR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        {/* Resplandor neón esmeralda */}
        <filter id="propShieldGlowUltra" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6" />
        </filter>
        <linearGradient id="laserCheckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Aura de energía posterior */}
      <path
        d="M18 3 5.5 8v9c0 8.5 6.2 14.8 12.5 16.5 6.3-1.7 12.5-8 12.5-16.5V8L18 3Z"
        fill="rgba(16,185,129,0.15)"
        filter="url(#propShieldGlowUltra)"
      />

      {/* Faceta Izquierda (Luz) */}
      <path
        d="M18 3.5 6.5 8.2v8.5c0 7.8 5.6 13.8 11.5 15.3V3.5Z"
        fill="url(#shieldFacetL)"
        opacity="0.9"
      />

      {/* Faceta Derecha (Sombra metálica) */}
      <path
        d="M18 3.5 29.5 8.2v8.5c0 7.8-5.6 13.8-11.5 15.3V3.5Z"
        fill="url(#shieldFacetR)"
        opacity="0.95"
      />

      {/* Bisel perimetral de titanio pulido */}
      <path
        d="M18 3.5 6.5 8.2v8.5c0 7.8 5.6 13.8 11.5 15.3 5.9-1.5 11.5-7.5 11.5-15.3V8.2L18 3.5Z"
        stroke="#6ee7b7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Escudo interior flotante */}
      <path
        d="M18 7.5 9.5 11.2v5.5c0 5.6 4.1 10.2 8.5 11.5 4.4-1.3 8.5-5.9 8.5-11.5v-5.5L18 7.5Z"
        fill="#042f2e"
        fillOpacity="0.85"
        stroke="#34d399"
        strokeWidth="1.4"
      />

      {/* Rejilla de telemetría interior */}
      <path
        d="M18 10v14.5M12.5 14h11"
        stroke="rgba(52,211,153,0.35)"
        strokeWidth="0.8"
        strokeDasharray="2 1.5"
      />

      {/* Checkmark Holográfico 3D */}
      <path
        d="m12.5 18 3.5 3.5 8-8"
        stroke="url(#laserCheckGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nodos de anclaje de energía (4 micro-diodos luminosos) */}
      <circle cx="18" cy="4.8" r="1.2" fill="#ffffff" />
      <circle cx="8" cy="9.2" r="1" fill="#6ee7b7" />
      <circle cx="28" cy="9.2" r="1" fill="#6ee7b7" />
      <circle cx="18" cy="30.5" r="1.2" fill="#6ee7b7" />
    </svg>
  )
}

// 23. Candado Trampa de Alquiler / Rehén Mensual (Crimson/Ruby con cadenas de cautiverio y hazard stripes)
export function CyberPlatformTrapLock({ size = 32, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradiente carmesí de advertencia */}
        <linearGradient id="trapBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>
        <linearGradient id="shackleRubyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        {/* Resplandor neón peligro carmesí */}
        <filter id="trapGlowUltra" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.65" />
        </filter>
        <pattern
          id="hazardPattern"
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4c0519" strokeWidth="2.5" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#fb7185" strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* Grillete de cautiverio superior con muesca de corte / fractura */}
      <path
        d="M11 16V10a7 7 0 0 1 14 0v6"
        stroke="url(#shackleRubyGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Fractura de alerta en el grillete */}
      <circle cx="21" cy="7" r="1.2" fill="#ffffff" />
      <line
        x1="19.5"
        y1="6"
        x2="22.5"
        y2="8"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Cuerpo principal blindado del candado */}
      <rect
        x="6"
        y="15"
        width="24"
        height="18"
        rx="4.5"
        fill="url(#trapBodyGrad)"
        filter="url(#trapGlowUltra)"
      />

      {/* Franja de advertencia Hazard diagonal */}
      <rect
        x="7.5"
        y="16.5"
        width="21"
        height="15"
        rx="3.5"
        fill="url(#hazardPattern)"
        fillOpacity="0.45"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.8"
      />

      {/* Rejas de celda cautiva */}
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="30"
        stroke="#fda4af"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      <line
        x1="24"
        y1="18"
        x2="24"
        y2="30"
        stroke="#fda4af"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Placa central con ojo de cerradura iluminado */}
      <circle cx="18" cy="22.5" r="2.8" fill="#4c0519" stroke="#fda4af" strokeWidth="1" />
      <circle cx="18" cy="22.5" r="1.6" fill="#ffffff" />
      <path d="M16.8 23.5 16 28h4l-.8-4.5" fill="#4c0519" stroke="#fda4af" strokeWidth="0.8" />

      {/* Micro-tornillos de advertencia en las 4 esquinas */}
      <circle cx="9" cy="18" r="0.9" fill="#fda4af" />
      <circle cx="27" cy="18" r="0.9" fill="#fda4af" />
      <circle cx="9" cy="30" r="0.9" fill="#fda4af" />
      <circle cx="27" cy="30" r="0.9" fill="#fda4af" />
    </svg>
  )
}

// 24. Terminal de Código Puro & Arquitectura (TechStack / Code2)
export function CyberTechCode({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="m8 6-5 6 5 6m8-12 5 6-5 6"
        stroke="url(#codeGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="14" y1="4" x2="10" y2="20" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <circle cx="3" cy="12" r="1.2" fill="#38bdf8" />
      <circle cx="21" cy="12" r="1.2" fill="#6366f1" />
    </svg>
  )
}

// 25. Base de Datos Cuántica Cilindro (TechStack / Database)
export function CyberTechDatabase({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <ellipse
        cx="12"
        cy="5"
        rx="9"
        ry="3"
        stroke="url(#dbGrad)"
        strokeWidth="2"
        fill="rgba(6,182,212,0.2)"
      />
      <path
        d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5m-18 6v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"
        stroke="url(#dbGrad)"
        strokeWidth="2"
      />
      <circle cx="12" cy="11" r="1.5" fill="#38bdf8" />
      <circle cx="12" cy="17" r="1.5" fill="#38bdf8" />
    </svg>
  )
}

// 26. Cerebro Bot Neuronal / IA (TechStack / Bot)
export function CyberTechBot({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="3.5"
        stroke="url(#botGrad)"
        strokeWidth="2"
        fill="rgba(244,114,182,0.15)"
      />
      <circle cx="9" cy="12" r="1.8" fill="#f472b6" />
      <circle cx="15" cy="12" r="1.8" fill="#f472b6" />
      <line
        x1="9"
        y1="16"
        x2="15"
        y2="16"
        stroke="#f472b6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 2v4M2 13h2M20 13h2" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 27. Curva de Retorno de Inversión / ROI (Pricing / ROICalculator)
export function CyberRoiTrend({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trendGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="m3 17 6-6 4 4 8-9"
        stroke="url(#trendGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6h4v4"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11" r="1.5" fill="#38bdf8" />
      <circle cx="13" cy="15" r="1.5" fill="#34d399" />
      <circle cx="21" cy="6" r="2" fill="#10b981" className="animate-ping" opacity="0.6" />
      <circle cx="21" cy="6" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// 28. Tarjeta de Pago Inteligente con Chip (WhatsApp / Store)
export function CyberPaymentCard({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="3"
        stroke="url(#cardGrad)"
        strokeWidth="2"
        fill="rgba(6,182,212,0.12)"
      />
      <line x1="2" y1="10" x2="22" y2="10" stroke="#0284c7" strokeWidth="2" />
      <rect x="5" y="13" width="3.5" height="2.5" rx="0.5" fill="#fbbf24" />
      <circle cx="17" cy="14" r="1.2" fill="#38bdf8" />
    </svg>
  )
}

// 29. Reloj de Arena Cuántico (ROICalculator / Hourglass)
export function CyberHourglass({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M5 2h14M5 22h14M6 2v6l6 4-6 4v6m12-20v6l-6 4 6 4v6"
        stroke="url(#sandGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1" fill="#fbbf24" />
      <circle cx="12" cy="17" r="1.5" fill="#fbbf24" />
    </svg>
  )
}

// 30. Cohete de Despliegue & Migración 100% Bonificada (StoreGuarantees / Rocket)
export function CyberRocketLaunch({ size = 24, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3m5-5 3 3"
        stroke="url(#rocketGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 12a22.2 22.2 0 0 1 7-9 22.2 22.2 0 0 1-2 14l-5-5z"
        fill="rgba(6,182,212,0.15)"
        stroke="url(#rocketGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="9" r="1.5" fill="#ffffff" />
    </svg>
  )
}

// 31. Servidor Blade Uptime 99.9% (StoreGuarantees / Server)
export function CyberServerUptime({ size = 24, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="servGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="3"
        width="20"
        height="7"
        rx="2"
        stroke="url(#servGrad)"
        strokeWidth="2"
        fill="rgba(16,185,129,0.12)"
      />
      <rect
        x="2"
        y="14"
        width="20"
        height="7"
        rx="2"
        stroke="url(#servGrad)"
        strokeWidth="2"
        fill="rgba(16,185,129,0.12)"
      />
      <circle cx="6" cy="6.5" r="1" fill="#34d399" />
      <circle cx="6" cy="17.5" r="1" fill="#34d399" />
      <line
        x1="10"
        y1="6.5"
        x2="18"
        y2="6.5"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="17.5"
        x2="18"
        y2="17.5"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 32. Monedas Duales de Divisa (Pricing / Currency Toggle ARS & USD)
export function CyberCoinCurrency({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="coinG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="coinG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <circle
        cx="15"
        cy="9"
        r="6"
        stroke="url(#coinG1)"
        strokeWidth="1.5"
        fill="rgba(245,158,11,0.18)"
      />
      <path d="M15 6.5v5m-1.5-3.5h3" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" />
      <circle
        cx="9"
        cy="15"
        r="6.5"
        stroke="url(#coinG2)"
        strokeWidth="1.8"
        fill="rgba(6,182,212,0.22)"
      />
      <path
        d="M9 11.5v7m-2-4.5c0-1.2 1-1.5 2-1.5s2 .5 2 1.5-1 1.5-2 1.5-2 .5-2 1.5 1 1.5 2 1.5"
        stroke="#38bdf8"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 35. Cruz Muted para Features No Incluidas
export function CyberCrossMark({ size = 16, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="rgba(100,116,139,0.15)"
        stroke="rgba(148,163,184,0.3)"
        strokeWidth="1.2"
      />
      <path d="m7.5 7.5 5 5m0-5-5 5" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// 36. Proceso: Descubrimiento & Diagnóstico Estratégico (Process Step 1)
export function CyberProcessDiscovery({ size = 36, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="discGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke="url(#discGrad)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <circle
        cx="18"
        cy="18"
        r="9"
        fill="rgba(6,182,212,0.15)"
        stroke="url(#discGrad)"
        strokeWidth="2"
      />
      <path
        d="M13 13.5c0-.83.67-1.5 1.5-1.5h1.2c.4 0 .76.24.9.6l.8 2a1.5 1.5 0 0 1-.34 1.63l-.7.7a9.2 9.2 0 0 0 3.8 3.8l.7-.7a1.5 1.5 0 0 1 1.64-.34l2 .8c.36.14.6.5.6.9v1.2c0 .83-.67 1.5-1.5 1.5-6.07 0-11-4.93-11-11v-.5Z"
        fill="url(#discGrad)"
      />
      <circle cx="25" cy="11" r="2" fill="#22d3ee" />
    </svg>
  )
}

// 37. Proceso: Arquitectura & Ingeniería Real (Process Step 2)
export function CyberProcessCode({ size = 36, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect
        x="5"
        y="6"
        width="26"
        height="24"
        rx="5"
        fill="rgba(168,85,247,0.12)"
        stroke="url(#engGrad)"
        strokeWidth="2"
      />
      <path
        d="M12 15l-4 3 4 3m12-6l4 3-4 3m-9 3l3-9"
        stroke="url(#engGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9.5" r="1.2" fill="#06b6d4" />
      <circle cx="13" cy="9.5" r="1.2" fill="#a855f7" />
      <circle cx="17" cy="9.5" r="1.2" fill="#ec4899" />
    </svg>
  )
}

// 38. Proceso: Despliegue & Producción (Process Step 3)
export function CyberProcessRocket({ size = 36, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rockStepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <path d="M10 26c-1.5 2-2 5-2 5s3-.5 5-2l-3-3Z" fill="#f97316" />
      <path d="M12 24c-1 1-1.5 3-1.5 3s1.8-.2 2.7-1.1l-1.2-1.9Z" fill="#facc15" />
      <path
        d="M26 10c0 0-4-3-11 2l-4 4c-1.5 1.5-1.5 4 0 5.5l1.5 1.5c1.5 1.5 4 1.5 5.5 0l4-4c5-7 4-9 4-9Z"
        fill="rgba(245,158,11,0.15)"
        stroke="url(#rockStepGrad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M13 21l-3 4 5-1"
        stroke="url(#rockStepGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 13l4-3-1 5"
        stroke="url(#rockStepGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="21" cy="15" r="2.2" fill="#ffffff" />
    </svg>
  )
}

// 39. Proceso: Soporte & Hipercuidado 24/7 (Process Step 4)
export function CyberProcessHypercare({ size = 36, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="careGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d="M8 20V16a10 10 0 0 1 20 0v4"
        stroke="url(#careGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="18"
        width="4"
        height="8"
        rx="2"
        fill="rgba(249,115,22,0.25)"
        stroke="url(#careGrad)"
        strokeWidth="1.8"
      />
      <rect
        x="26"
        y="18"
        width="4"
        height="8"
        rx="2"
        fill="rgba(249,115,22,0.25)"
        stroke="url(#careGrad)"
        strokeWidth="1.8"
      />
      <path
        d="M28 26v2a3 3 0 0 1-3 3h-5"
        stroke="url(#careGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="31" r="1.8" fill="#facc15" />
      <path d="M15 17v-2m3 4v-6m3 4v-2" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 40. Radar SEO Técnico & Core Web Vitals (TechStack Card 4)
export function CyberSeoRadar({ size = 24, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="seoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <circle
        cx="11"
        cy="11"
        r="7.5"
        stroke="url(#seoGrad)"
        strokeWidth="1.8"
        fill="rgba(192,132,252,0.12)"
      />
      <rect x="7" y="12" width="2" height="4" rx="0.5" fill="#a855f7" />
      <rect x="10" y="9.5" width="2" height="6.5" rx="0.5" fill="#c084fc" />
      <rect x="13" y="7" width="2" height="9" rx="0.5" fill="#e9d5ff" />
      <path d="m16.5 16.5 4.5 4.5" stroke="url(#seoGrad)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="14" cy="7" r="1" fill="#ffffff" />
    </svg>
  )
}

// 41. Cubo Isométrico 3D / WebGL & Framer Motion (TechStack Card 7)
export function Cyber3dCube({ size = 24, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cubeG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cubeG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5 19.5 6.8 12 11.2 4.5 6.8 12 2.5Z"
        fill="rgba(251,191,36,0.22)"
        stroke="url(#cubeG2)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 6.8v8.6L12 19.8v-8.6L4.5 6.8Z"
        fill="rgba(217,119,6,0.18)"
        stroke="url(#cubeG1)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 6.8v8.6L12 19.8v-8.6l7.5-4.4Z"
        fill="rgba(245,158,11,0.28)"
        stroke="url(#cubeG1)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.2" r="1.4" fill="#ffffff" />
      <circle cx="12" cy="2.5" r="1" fill="#fde68a" />
      <circle cx="19.5" cy="6.8" r="1" fill="#fde68a" />
      <circle cx="4.5" cy="6.8" r="1" fill="#fde68a" />
      <circle cx="12" cy="19.8" r="1" fill="#fde68a" />
    </svg>
  )
}

// 42. Plan Básico: Estación de Trabajo Edge / Display Flotante
export function CyberPlanBasic({ size = 28, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="planBasicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="5"
        width="26"
        height="17"
        rx="3.5"
        fill="rgba(14,165,233,0.18)"
        stroke="url(#planBasicGrad)"
        strokeWidth="1.8"
      />
      <path
        d="M7 16h5m2 0h11M7 19.5h18"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <rect
        x="7"
        y="9"
        width="7"
        height="4.5"
        rx="1.5"
        fill="rgba(56,189,248,0.3)"
        stroke="#38bdf8"
        strokeWidth="1"
      />
      <circle cx="18" cy="11" r="1.5" fill="#38bdf8" />
      <circle cx="22" cy="11" r="1.5" fill="#bae6fd" />
      <path
        d="M12 22v4m8-4v4m-12 2h16"
        stroke="url(#planBasicGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="28" r="1.2" fill="#38bdf8" />
    </svg>
  )
}

// 43. Plan Avanzado: Cluster de Servidores & Base de Datos Reactiva
export function CyberPlanAdvanced({ size = 28, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="planAdvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="24"
        height="6.5"
        rx="2"
        fill="rgba(168,85,247,0.18)"
        stroke="url(#planAdvGrad)"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="12.5"
        width="24"
        height="6.5"
        rx="2"
        fill="rgba(168,85,247,0.22)"
        stroke="url(#planAdvGrad)"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="21"
        width="24"
        height="6.5"
        rx="2"
        fill="rgba(168,85,247,0.26)"
        stroke="url(#planAdvGrad)"
        strokeWidth="1.6"
      />
      <circle cx="8" cy="7.25" r="1.2" fill="#22d3ee" />
      <circle cx="11.5" cy="7.25" r="1.2" fill="#a855f7" />
      <circle cx="8" cy="15.75" r="1.2" fill="#22d3ee" />
      <circle cx="11.5" cy="15.75" r="1.2" fill="#a855f7" />
      <circle cx="8" cy="24.25" r="1.2" fill="#22d3ee" />
      <circle cx="11.5" cy="24.25" r="1.2" fill="#a855f7" />
      <line
        x1="16"
        y1="7.25"
        x2="24"
        y2="7.25"
        stroke="#e9d5ff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="15.75"
        x2="24"
        y2="15.75"
        stroke="#e9d5ff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="24.25"
        x2="24"
        y2="24.25"
        stroke="#e9d5ff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 44. Plan Premium: Núcleo Cuántico Empresarial con Anillos Orbitales
export function CyberPlanPremium({ size = 28, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="planPremGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#a855f7" />
          <stop offset="80%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="url(#planPremGrad)"
        strokeWidth="1.5"
        strokeDasharray="3 2.5"
        opacity="0.6"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.5"
        stroke="url(#planPremGrad)"
        strokeWidth="1.4"
        transform="rotate(-25 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5.5"
        stroke="url(#planPremGrad)"
        strokeWidth="1.4"
        transform="rotate(25 16 16)"
        opacity="0.75"
      />
      <circle
        cx="16"
        cy="16"
        r="6"
        fill="rgba(244,63,94,0.25)"
        stroke="#fbbf24"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="16" r="3" fill="#ffffff" />
      <circle cx="27" cy="12" r="1.5" fill="#f43f5e" />
      <circle cx="5" cy="20" r="1.5" fill="#fbbf24" />
    </svg>
  )
}

// 45. Insignia Soberana Republicana (Reemplaza Landmark genérico por Blasón Digital)
export function CyberInsignia({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="insigniaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      {/* Frontón triangular de arquitectura soberana */}
      <path
        d="M12 2.5 3 7.5h18L12 2.5Z"
        fill="rgba(34,211,238,0.2)"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="5.2" r="1" fill="#ffffff" />
      {/* Columnatas de orden corintio digital */}
      <line
        x1="5.5"
        y1="8"
        x2="5.5"
        y2="17"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9.8"
        y1="8"
        x2="9.8"
        y2="17"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14.2"
        y1="8"
        x2="14.2"
        y2="17"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="18.5"
        y1="8"
        x2="18.5"
        y2="17"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Estilóbato / Base escalonada */}
      <rect
        x="2"
        y="17.5"
        width="20"
        height="2"
        rx="0.5"
        fill="rgba(34,211,238,0.25)"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.3"
      />
      <line
        x1="1"
        y1="21.5"
        x2="23"
        y2="21.5"
        stroke="url(#insigniaGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 46. Interruptor de Potencia Cyber (Simulador Maestro / Autonomía)
export function CyberPowerSwitch({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pwrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="url(#pwrGrad)"
        strokeWidth="1.5"
        strokeDasharray="37 13"
        strokeDashoffset="12"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="3.5"
        x2="10"
        y2="9.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="1.5" fill="#38bdf8" />
    </svg>
  )
}

// 47. Alerta de Peligro Cyber con Núcleo Pulsante (Rental Danger)
export function CyberWarningHazard({ size = 18, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hazardWarnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path
        d="M10 2.5 18.5 17H1.5L10 2.5Z"
        fill="rgba(244,63,94,0.18)"
        stroke="url(#hazardWarnGrad)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="7.5"
        x2="10"
        y2="12"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.8" r="1" fill="#ffffff" />
    </svg>
  )
}

// 48. Guión Menos Cyber para Comparativas
export function CyberMinusIcon({ size = 16, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="rgba(148,163,184,0.12)"
        stroke="rgba(148,163,184,0.25)"
        strokeWidth="1.2"
      />
      <line
        x1="6.5"
        y1="10"
        x2="13.5"
        y2="10"
        stroke="#94a3b8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// 49. Base de Datos Cilindro Blindado
export function CyberDatabaseCore({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <ellipse
        cx="12"
        cy="5"
        rx="8"
        ry="3"
        fill="rgba(99,102,241,0.2)"
        stroke="url(#dbGrad)"
        strokeWidth="1.6"
      />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="url(#dbGrad)" strokeWidth="1.6" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="url(#dbGrad)" strokeWidth="1.6" />
      <circle cx="7" cy="8" r="0.9" fill="#38bdf8" />
      <circle cx="7" cy="14" r="0.9" fill="#818cf8" />
      <circle cx="7" cy="19" r="0.9" fill="#c084fc" />
    </svg>
  )
}

// 50. Capas Arquitectónicas Estratificadas (Stack Layers)
export function CyberStackLayers({ size = 22, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 2 7 12 12 22 7 12 2"
        fill="rgba(6,182,212,0.22)"
        stroke="url(#layerGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polyline
        points="2 12 12 17 22 12"
        stroke="url(#layerGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="2 17 12 22 22 17"
        stroke="url(#layerGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="1.2" fill="#ffffff" />
    </svg>
  )
}

// 51. Ícono de Traducción Multi-Idioma Holográfico
export function CyberLanguageTranslate({ size = 20, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="transGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="url(#transGrad)"
        strokeWidth="1.6"
        fill="rgba(6,182,212,0.12)"
      />
      <path
        d="M3.5 12h17M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"
        stroke="url(#transGrad)"
        strokeWidth="1.3"
        opacity="0.65"
      />
      <path
        d="M8 8.5h4.5m-2.25 0v5m-1.5-1.5 3-3"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="15" r="1.5" fill="#38bdf8" />
    </svg>
  )
}

// 52. Micro-Banderas Vectoriales HD de Alta Fidelidad (Castellano = Argentina, Cero Emojis Borrosos)
export function CyberCountryFlag({
  code,
  size = 20,
  className = '',
}: Readonly<{
  code: string
  size?: number
  className?: string
}>) {
  const norm = code.toLowerCase()
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[3px] overflow-hidden ring-1 ring-black/15 dark:ring-white/25 shadow-xs bg-slate-900/10 ${className}`}
      style={{ width: size, height: Math.round(size * 0.67) }}
      aria-hidden="true"
    >
      {/* 🇦🇷 Argentina para Castellano / Español */}
      {norm === 'es' && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="24" height="5.33" fill="#74ACDF" />
          <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="5.33" fill="#74ACDF" />
          {/* Sol de Mayo Vectorial Nítido con Rayos */}
          <g transform="translate(12, 8)">
            <path
              d="M0 -3.2 L0 3.2 M-3.2 0 L3.2 0 M-2.3 -2.3 L2.3 2.3 M-2.3 2.3 L2.3 -2.3"
              stroke="#F6B40E"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <circle r="1.8" fill="#F6B40E" stroke="#D97706" strokeWidth="0.45" />
            <circle r="0.9" fill="#FFFBEB" />
          </g>
        </svg>
      )}

      {/* 🇺🇸 Estados Unidos para Inglés */}
      {(norm === 'en' || norm === 'en-us') && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="24" height="16" fill="#B22234" />
          <rect y="1.23" width="24" height="1.23" fill="#FFFFFF" />
          <rect y="3.69" width="24" height="1.23" fill="#FFFFFF" />
          <rect y="6.15" width="24" height="1.23" fill="#FFFFFF" />
          <rect y="8.61" width="24" height="1.23" fill="#FFFFFF" />
          <rect y="11.07" width="24" height="1.23" fill="#FFFFFF" />
          <rect y="13.53" width="24" height="1.23" fill="#FFFFFF" />
          <rect width="10" height="8.61" fill="#3C3B6E" />
          <g fill="#FFFFFF" opacity="0.95">
            <circle cx="2" cy="1.8" r="0.55" />
            <circle cx="5" cy="1.8" r="0.55" />
            <circle cx="8" cy="1.8" r="0.55" />
            <circle cx="3.5" cy="4.3" r="0.55" />
            <circle cx="6.5" cy="4.3" r="0.55" />
            <circle cx="2" cy="6.8" r="0.55" />
            <circle cx="5" cy="6.8" r="0.55" />
            <circle cx="8" cy="6.8" r="0.55" />
          </g>
        </svg>
      )}

      {/* 🇧🇷 Brasil para Português */}
      {(norm === 'pt' || norm === 'pt-br') && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="24" height="16" fill="#009C3B" />
          <polygon points="12,2.2 21.6,8 12,13.8 2.4,8" fill="#FFDF00" />
          <circle cx="12" cy="8" r="3.4" fill="#002776" />
          <path
            d="M9.2 8.3 C10.8 7.3, 13.2 7.3, 14.8 8.7"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="11.4" cy="9.2" r="0.35" fill="#FFFFFF" />
          <circle cx="12.6" cy="9.5" r="0.35" fill="#FFFFFF" />
        </svg>
      )}

      {/* 🇫🇷 Francia para Français */}
      {norm === 'fr' && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="8" height="16" fill="#002654" />
          <rect x="8" width="8" height="16" fill="#FFFFFF" />
          <rect x="16" width="8" height="16" fill="#ED2939" />
        </svg>
      )}

      {/* 🇩🇪 Alemania para Deutsch */}
      {norm === 'de' && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="24" height="5.33" fill="#000000" />
          <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
          <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
        </svg>
      )}

      {/* 🇨🇳 China para 简体中文 */}
      {(norm === 'zh' || norm === 'zh-cn') && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="24" height="16" fill="#DE2910" />
          <polygon
            points="4.5,2.5 4.9,3.9 6.4,4 5.2,5 5.6,6.5 4.5,5.6 3.4,6.5 3.8,5 2.6,4 4.1,3.9"
            fill="#FFDE00"
          />
          <circle cx="8" cy="2.5" r="0.65" fill="#FFDE00" />
          <circle cx="9.2" cy="4" r="0.65" fill="#FFDE00" />
          <circle cx="9.2" cy="6" r="0.65" fill="#FFDE00" />
          <circle cx="8" cy="7.5" r="0.65" fill="#FFDE00" />
        </svg>
      )}

      {/* 🇦🇪/🇸🇦 Árabe (Tricolor Panárabe de Alta Resolución) */}
      {norm === 'ar' && (
        <svg viewBox="0 0 24 16" className="w-full h-full block">
          <rect width="6" height="16" fill="#CE1126" />
          <rect x="6" width="18" height="5.33" fill="#007A3D" />
          <rect x="6" y="5.33" width="18" height="5.34" fill="#FFFFFF" />
          <rect x="6" y="10.67" width="18" height="5.33" fill="#000000" />
        </svg>
      )}
    </span>
  )
}

// 52b. Micro-Giroscopio Cuántico Orbital para el CTA Navbar (Kinetic Beacon)
export function CyberQuantumGyroIcon({ size = 15, className = '' }: Readonly<IconBaseProps>) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Anillo exterior cinético con rotación suave y aceleración al hacer hover */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full animate-[spin_7s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite] transition-all"
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="5 3.5"
          opacity="0.85"
        />
        <circle cx="12" cy="2.5" r="1.8" fill="currentColor" />
        <circle cx="12" cy="21.5" r="1.3" fill="currentColor" opacity="0.7" />
      </svg>
      {/* Núcleo fotónico interior pulsante */}
      <span className="absolute w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor] animate-pulse" />
    </span>
  )
}

// 52c. Flecha Láser de Precisión Aeroespacial (Doble Chevrón Cinético)
export function CyberKineticArrowIcon({ size = 14, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3.5 10h10.5m0 0l-4.5-4m4.5 4l-4.5 4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
        className="transition-all duration-300 group-hover:opacity-100 group-hover:stroke-current"
      />
    </svg>
  )
}

// 53. Plus Expandible Cyber para FAQ
export function CyberPlusIcon({
  isOpen = false,
  size = 18,
  className = '',
}: Readonly<IconBaseProps & { isOpen?: boolean }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'} ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="rgba(6,182,212,0.14)"
        stroke="rgba(6,182,212,0.4)"
        strokeWidth="1.3"
      />
      <line
        x1="10"
        y1="5.5"
        x2="10"
        y2="14.5"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="5.5"
        y1="10"
        x2="14.5"
        y2="10"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="1.2" fill="#ffffff" />
    </svg>
  )
}

// 54. Refresh Láser Giratorio (Terminal / Recargar Demo)
export function CyberRefreshIcon({ size = 16, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="refGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M3.5 10a6.5 6.5 0 0 1 11.5-4.2L17 8m-14 4 2 2.2A6.5 6.5 0 0 0 16.5 10"
        stroke="url(#refGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 4v4h-4M3 16v-4h4"
        stroke="url(#refGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 55. Cronómetro Cuántico / Time Slot
export function CyberClockIcon({ size = 16, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clockRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="url(#clockRingGrad)"
        strokeWidth="1.5"
        strokeDasharray="3 1.5"
      />
      <circle cx="10" cy="10" r="6.2" fill="rgba(34,211,238,0.08)" />
      {/* Marcadores 12, 3, 6, 9 */}
      <line
        x1="10"
        y1="3"
        x2="10"
        y2="4.5"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="10"
        x2="15.5"
        y2="10"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="10"
        y1="17"
        x2="10"
        y2="15.5"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="10"
        x2="4.5"
        y2="10"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Agujas */}
      <polyline
        points="10,6.5 10,10 13,12"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="1.3" fill="#22d3ee" />
    </svg>
  )
}

// 56. Enlace Externo Láser Aeroespacial
export function CyberExternalLinkIcon({ size = 14, className = '' }: Readonly<IconBaseProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className}`}
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="extLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M9 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <polyline
        points="13 3 17 3 17 7"
        stroke="url(#extLinkGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="9.5"
        y1="10.5"
        x2="17"
        y2="3"
        stroke="url(#extLinkGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
