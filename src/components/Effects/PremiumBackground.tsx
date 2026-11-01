'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/core/theme/ThemeContext'

/**
 * Definición astronómica de una Casa del Zodíaco:
 * - coords normalizadas en [-1, 1] x [-1, 1] respetando la geometría real de cada constelación
 * - mag: magnitud estelar relativa (1.0 = estrella Alfa principal con halo, 0.5 = secundaria)
 * - edges: segmentos explícitos que trazan la figura astronómica clásica
 */
interface ConstellationDef {
  id: string
  name: string
  glyph: string
  colorDark: string
  colorLight: string
  stars: Array<[number, number, number]> // [nx, ny, importance (0.5 - 1.0)]
  edges: Array<[number, number]>
}

const ZODIAC_CONSTELLATIONS: ConstellationDef[] = [
  {
    id: 'aries',
    name: 'ARIES',
    glyph: '♈',
    colorDark: '#38bdf8',
    colorLight: '#0284c7',
    // Hamal (α), Sheratan (β), Mesarthim (γ), 41 Arietis (c)
    stars: [
      [-0.75, -0.35, 0.85], // 0: 41 Ari
      [0.15, -0.05, 1.0], // 1: Hamal (α)
      [0.62, 0.22, 0.85], // 2: Sheratan (β)
      [0.78, 0.48, 0.65], // 3: Mesarthim (γ)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: 'tauro',
    name: 'TAURO',
    glyph: '♉',
    colorDark: '#2dd4bf',
    colorLight: '#0d9488',
    // Aldebaran (α), Hyades V-shape, Elnath (β) & Tianguan (ζ) horns
    stars: [
      [-0.85, -0.58, 0.9], // 0: Elnath (β - cuerno norte)
      [-0.78, 0.12, 0.8], // 1: Tianguan (ζ - cuerno sur)
      [-0.08, -0.22, 0.75], // 2: Ain (ε)
      [0.05, 0.08, 1.0], // 3: Aldebaran (α)
      [0.32, 0.02, 0.7], // 4: Hyadum I (γ)
      [0.75, 0.35, 0.65], // 5: Lambda Tauri (λ)
    ],
    edges: [
      [0, 2],
      [2, 4],
      [1, 3],
      [3, 4],
      [4, 5],
    ],
  },
  {
    id: 'geminis',
    name: 'GÉMINIS',
    glyph: '♊',
    colorDark: '#818cf8',
    colorLight: '#4f46e5',
    // Castor (α) y Pollux (β) con cuerpos paralelos
    stars: [
      [-0.55, -0.68, 0.95], // 0: Castor (α)
      [-0.48, 0.55, 1.0], // 1: Pollux (β)
      [-0.05, -0.35, 0.75], // 2: Mebsuta (ε)
      [0.05, 0.32, 0.75], // 3: Wasat (δ)
      [0.65, -0.45, 0.7], // 4: Tejat (μ)
      [0.72, 0.42, 0.85], // 5: Alhena (γ)
    ],
    edges: [
      [0, 1],
      [0, 2],
      [2, 4],
      [1, 3],
      [3, 5],
    ],
  },
  {
    id: 'cancer',
    name: 'CÁNCER',
    glyph: '♋',
    colorDark: '#38bdf8',
    colorLight: '#0369a1',
    // Forma de Y invertida centrada en Asellus Borealis/Australis
    stars: [
      [-0.65, -0.42, 0.75], // 0: Iota Cancri (ι)
      [-0.08, -0.08, 0.7], // 1: Asellus Borealis (γ)
      [0.05, 0.14, 0.8], // 2: Asellus Australis (δ)
      [0.62, -0.32, 0.85], // 3: Acubens (α)
      [0.58, 0.58, 0.9], // 4: Al Tarf (β)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
    ],
  },
  {
    id: 'leo',
    name: 'LEO',
    glyph: '♌',
    colorDark: '#fbbf24',
    colorLight: '#d97706',
    // La Hoz (cabeza) + Regulus (α) + triángulo trasero con Denebola (β)
    stars: [
      [0.72, -0.48, 0.8], // 0: Ras Elased (ε)
      [0.45, -0.68, 0.7], // 1: Adhafera (ζ)
      [0.18, -0.32, 0.9], // 2: Algieba (γ)
      [0.25, 0.08, 0.7], // 3: Eta Leonis (η)
      [0.38, 0.48, 1.0], // 4: Regulus (α)
      [-0.32, -0.15, 0.8], // 5: Zosma (δ)
      [-0.28, 0.32, 0.75], // 6: Chertan (θ)
      [-0.82, 0.12, 0.95], // 7: Denebola (β)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [5, 6],
      [5, 7],
      [6, 7],
    ],
  },
  {
    id: 'virgo',
    name: 'VIRGO',
    glyph: '♍',
    colorDark: '#34d399',
    colorLight: '#059669',
    // Spica (α), Porrima (γ), Vindemiatrix (ε), Heze (ζ)
    stars: [
      [-0.68, 0.48, 1.0], // 0: Spica (α)
      [-0.35, -0.18, 0.75], // 1: Heze (ζ)
      [0.05, 0.08, 0.85], // 2: Porrima (γ)
      [0.22, -0.25, 0.75], // 3: Auva (δ)
      [0.45, -0.65, 0.85], // 4: Vindemiatrix (ε)
      [0.68, 0.25, 0.75], // 5: Zavijava (β)
    ],
    edges: [
      [0, 2],
      [0, 1],
      [1, 3],
      [2, 3],
      [3, 4],
      [2, 5],
    ],
  },
  {
    id: 'libra',
    name: 'LIBRA',
    glyph: '♎',
    colorDark: '#a78bfa',
    colorLight: '#7c3aed',
    // Zubeneschamali (β), Zubenelgenubi (α), Brachium (σ), Gamma (γ)
    stars: [
      [-0.08, -0.58, 0.95], // 0: Zubeneschamali (β)
      [0.58, -0.12, 0.9], // 1: Zubenelgenubi (α)
      [-0.58, 0.05, 0.75], // 2: Zubenelhakrabi (γ)
      [0.18, 0.58, 0.8], // 3: Brachium (σ)
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
  {
    id: 'escorpio',
    name: 'ESCORPIO',
    glyph: '♏',
    colorDark: '#f43f5e',
    colorLight: '#e11d48',
    // Pinzas + Antares (α) + curva en J del aguijón (Shaula λ)
    stars: [
      [0.72, -0.58, 0.8], // 0: Graffias (β)
      [0.62, -0.22, 0.85], // 1: Dschubba (δ)
      [0.52, 0.08, 0.75], // 2: Pi Scorpii (π)
      [0.22, -0.15, 1.0], // 3: Antares (α)
      [-0.08, 0.18, 0.8], // 4: Larawag (ε)
      [-0.25, 0.58, 0.85], // 5: Sargas (θ)
      [-0.62, 0.52, 0.75], // 6: Kappa (κ)
      [-0.52, 0.22, 0.95], // 7: Shaula (λ - aguijón)
    ],
    edges: [
      [0, 1],
      [2, 1],
      [1, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    id: 'sagitario',
    name: 'SAGITARIO',
    glyph: '♐',
    colorDark: '#38bdf8',
    colorLight: '#0284c7',
    // El famoso asterismo de "La Tetera" (Teapot): Kaus Borealis, Kaus Media, Kaus Australis, Alnasl, Nunki, Ascella
    stars: [
      [-0.05, -0.58, 0.85], // 0: Kaus Borealis (λ - tapa)
      [0.28, -0.05, 0.8], // 1: Kaus Media (δ)
      [0.18, 0.48, 1.0], // 2: Kaus Australis (ε - base)
      [0.72, 0.15, 0.8], // 3: Alnasl (γ - pico)
      [-0.28, -0.12, 0.75], // 4: Phi Sgr (φ)
      [-0.38, 0.42, 0.85], // 5: Ascella (ζ - base asa)
      [-0.68, -0.22, 0.95], // 6: Nunki (σ - tope asa)
    ],
    edges: [
      [0, 1],
      [0, 4],
      [1, 4],
      [1, 2],
      [4, 5],
      [2, 5],
      [1, 3],
      [2, 3],
      [4, 6],
      [5, 6],
    ],
  },
  {
    id: 'capricornio',
    name: 'CAPRICORNIO',
    glyph: '♑',
    colorDark: '#2dd4bf',
    colorLight: '#0d9488',
    // Triángulo cósmico / boomerang: Algedi (α), Dabih (β), Nashira (γ), Deneb Algedi (δ)
    stars: [
      [0.68, -0.45, 0.8], // 0: Algedi (α)
      [0.58, -0.18, 0.9], // 1: Dabih (β)
      [0.15, 0.48, 0.75], // 2: Omega Cap (ω)
      [-0.25, 0.25, 0.75], // 3: Zeta Cap (ζ)
      [-0.52, -0.12, 0.8], // 4: Nashira (γ)
      [-0.72, -0.28, 0.95], // 5: Deneb Algedi (δ)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 5],
      [5, 4],
      [4, 1],
    ],
  },
  {
    id: 'acuario',
    name: 'ACUARIO',
    glyph: '♒',
    colorDark: '#60a5fa',
    colorLight: '#2563eb',
    // Sadalmelik (α), Sadalsuud (β), Jarra de Agua (ζ) y corriente hacia Skat (δ)
    stars: [
      [0.58, -0.22, 0.95], // 0: Sadalsuud (β)
      [0.12, -0.45, 0.9], // 1: Sadalmelik (α)
      [-0.22, -0.35, 0.8], // 2: Sadachbia (γ)
      [-0.45, -0.42, 0.85], // 3: Zeta Aquarii (ζ - Jarra)
      [-0.28, 0.08, 0.75], // 4: Lambda Aquarii (λ)
      [-0.48, 0.55, 0.85], // 5: Skat (δ)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
  {
    id: 'piscis',
    name: 'PISCIS',
    glyph: '♓',
    colorDark: '#c084fc',
    colorLight: '#7c3aed',
    // Dos peces unidos en V por el nudo Alrescha (α)
    stars: [
      [0.62, 0.52, 0.95], // 0: Alrescha (α - el nudo)
      [0.42, 0.05, 0.75], // 1: Omicron Psc (ο)
      [0.25, -0.48, 0.85], // 2: Eta Psc (η)
      [0.48, -0.62, 0.7], // 3: Upsilon Psc (υ)
      [-0.05, 0.35, 0.75], // 4: Omega Psc (ω)
      [-0.48, 0.25, 0.8], // 5: Iota Psc (ι)
      [-0.68, 0.42, 0.8], // 6: Gamma Psc (γ)
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [4, 5],
      [5, 6],
    ],
  },
]

interface AmbientStar {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
}

/**
 * Fondo interactivo de precisión astronómica:
 * Representa las 12 Constelaciones del Zodíaco distribuidas armónicamente en el cielo
 * con su geometría real de estrellas y trazos, movimiento orbital sutil e interacción al cursor,
 * adaptado para Tema Claro (#FAF7F2) y Tema Oscuro (#080c14).
 */
export const PremiumBackground: React.FC = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDarkRef = useRef(isDark)
  const pathname = usePathname()

  const shouldRender =
    pathname === '/' ||
    (!pathname?.startsWith('/dashboard') &&
      !pathname?.startsWith('/tienda') &&
      !pathname?.startsWith('/login') &&
      !pathname?.startsWith('/cotizador'))

  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  useEffect(() => {
    if (!shouldRender) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mouse = { x: -1000, y: -1000, radius: 220 }

    // Estrellas de campo profundo suaves para dar profundidad sin saturar
    const ambientCount = width < 768 ? 16 : 32
    const ambientStars: AmbientStar[] = Array.from({ length: ambientCount }, (_, i) => ({
      x: ((i * 137.5) % 100) * 0.01 * width,
      y: ((i * 293.7) % 100) * 0.01 * height,
      vx: Math.cos(i * 1.7) * 0.08,
      vy: Math.sin(i * 2.3) * 0.08,
      size: 0.9 + (i % 3) * 0.45,
      phase: i * 0.85,
    }))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    let time = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      const dark = isDarkRef.current
      if (!prefersReducedMotion) {
        time += 0.008
      }

      // 1. Renderizar estrellas de campo profundo (ambient stars)
      ctx.fillStyle = dark ? 'rgba(226, 232, 240, 0.25)' : 'rgba(51, 65, 85, 0.18)'
      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i]!
        if (!prefersReducedMotion) {
          s.x += s.vx
          s.y += s.vy
          if (s.x < 0) s.x = width
          if (s.x > width) s.x = 0
          if (s.y < 0) s.y = height
          if (s.y > height) s.y = 0
        }
        const twinkle = 0.55 + 0.45 * Math.sin(time * 2.2 + s.phase)
        ctx.globalAlpha = twinkle * (dark ? 0.35 : 0.22)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // 2. Distribución en grilla celeste de las 12 Casas del Zodíaco (4x3 en desktop, 3x4 en mobile)
      const isPortrait = width < 768
      const cols = isPortrait ? 3 : 4
      const rows = isPortrait ? 4 : 3
      const cellW = width / cols
      const cellH = height / rows
      const scaleRadius = Math.min(cellW, cellH) * (isPortrait ? 0.31 : 0.34)

      for (let idx = 0; idx < ZODIAC_CONSTELLATIONS.length; idx++) {
        const constellation = ZODIAC_CONSTELLATIONS[idx]!
        const col = idx % cols
        const row = Math.floor(idx / cols)

        // Desplazamiento orgánico por celda para que no parezca una tabla rígida
        const jitterX = Math.sin(idx * 2.1 + 0.5) * (cellW * 0.08)
        const jitterY = Math.cos(idx * 1.7 + 0.3) * (cellH * 0.08)

        // Deriva celeste suave
        const driftX = Math.sin(time * 0.7 + idx * 0.9) * 8
        const driftY = Math.cos(time * 0.55 + idx * 1.1) * 7

        const centerX = (col + 0.5) * cellW + jitterX + driftX
        const centerY = (row + 0.5) * cellH + jitterY + driftY

        // Proximidad del mouse al centro de la constelación
        const dxCenter = centerX - mouse.x
        const dyCenter = centerY - mouse.y
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)
        const hoverFactor =
          distCenter < mouse.radius ? Math.pow(1 - distCenter / mouse.radius, 1.5) : 0

        const baseColor = dark ? constellation.colorDark : constellation.colorLight

        // Calcular posiciones en pantalla de cada estrella de la constelación
        const screenStars: Array<{ x: number; y: number; mag: number }> = []
        for (let sIdx = 0; sIdx < constellation.stars.length; sIdx++) {
          const [nx, ny, mag] = constellation.stars[sIdx]!
          // Respiración micro-orbital de cada estrella
          const microX = Math.sin(time * 1.3 + idx + sIdx * 1.9) * 1.6
          const microY = Math.cos(time * 1.1 + idx + sIdx * 2.3) * 1.6

          let sx = centerX + nx * scaleRadius + microX
          let sy = centerY + ny * scaleRadius + microY

          // Sutil atracción/interacción magnética cuando el cursor pasa cerca
          const sdx = sx - mouse.x
          const sdy = sy - mouse.y
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy)
          if (sDist < 140 && sDist > 1) {
            const push = ((140 - sDist) / 140) * 5
            sx += (sdx / sDist) * push
            sy += (sdy / sDist) * push
          }

          screenStars.push({ x: sx, y: sy, mag })
        }

        // 2A. Dibujar las líneas astronómicas de la constelación
        ctx.save()
        ctx.strokeStyle = baseColor
        ctx.lineWidth = (dark ? 0.9 : 0.85) + hoverFactor * 0.75
        ctx.globalAlpha = (dark ? 0.2 : 0.16) + hoverFactor * 0.42
        ctx.beginPath()
        for (let eIdx = 0; eIdx < constellation.edges.length; eIdx++) {
          const [a, b] = constellation.edges[eIdx]!
          const starA = screenStars[a]
          const starB = screenStars[b]
          if (starA && starB) {
            ctx.moveTo(starA.x, starA.y)
            ctx.lineTo(starB.x, starB.y)
          }
        }
        ctx.stroke()
        ctx.restore()

        // 2B. Dibujar cada estrella de la constelación con su magnitud real
        for (let sIdx = 0; sIdx < screenStars.length; sIdx++) {
          const st = screenStars[sIdx]!
          const twinkle = 0.78 + 0.22 * Math.sin(time * 2.8 + idx * 1.3 + sIdx * 2.1)
          const radius = (1.35 + st.mag * 1.45) * (1 + hoverFactor * 0.22)

          // Halo suave para las estrellas principales (Alfa/Beta) o al acercar el mouse
          if (st.mag >= 0.88 || hoverFactor > 0.15) {
            ctx.save()
            ctx.fillStyle = baseColor
            ctx.globalAlpha = ((dark ? 0.18 : 0.12) + hoverFactor * 0.25) * twinkle
            ctx.beginPath()
            ctx.arc(st.x, st.y, radius * 2.9, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }

          // Núcleo de la estrella
          ctx.save()
          ctx.fillStyle = st.mag >= 0.92 && dark ? '#f8fafc' : baseColor
          ctx.globalAlpha = ((dark ? 0.78 : 0.65) + hoverFactor * 0.22) * twinkle
          ctx.beginPath()
          ctx.arc(st.x, st.y, radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // 2C. Etiqueta astronómica discreta (Glifo + Nombre de la Casa del Zodíaco)
        const labelAlpha = (dark ? 0.18 : 0.2) + hoverFactor * 0.55
        ctx.save()
        ctx.font = '600 9px "JetBrains Mono", monospace'
        ctx.fillStyle = dark ? '#cbd5e1' : '#475569'
        ctx.globalAlpha = labelAlpha
        ctx.textAlign = 'center'
        ctx.fillText(
          `${constellation.glyph} ${constellation.name}`,
          centerX,
          centerY + scaleRadius * 0.88
        )
        ctx.restore()
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#080c14' : '#FAF7F2' }}
    >
      {/* 1. GRILLA SUTIL DE PRECISIÓN CON MÁSCARA RADIAL SUAVE */}
      <div
        data-cyber-grid="true"
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.22 : 0.35,
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(26,26,46,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,46,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 45%, black 35%, transparent 100%)',
        }}
      />

      {/* 2. GLOW ATMOSFÉRICO CONTINUO SIN CORTES HORIZONTALES */}
      <div
        className="cyber-horizon-glow absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full blur-[160px] transition-opacity duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, rgba(139, 92, 246, 0.04) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(14, 116, 144, 0.045) 0%, rgba(124, 58, 237, 0.03) 45%, transparent 72%)',
        }}
      />

      {/* 3. CANVAS DE LAS 12 CONSTELACIONES DEL ZODÍACO */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  )
}

export default PremiumBackground
