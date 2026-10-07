/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Delaunator from 'delaunator'

const DARK_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6']
const LIGHT_COLORS = ['#0284c7', '#4f46e5', '#059669', '#d946ef']

// ── Density-aware constants ───────────────────────────────────────────────────
const BASE_COUNT = 20
const LINK_DIST_BASE = 145
const NODE_COUNT = 65
const MOBILE_NODE_COUNT = 24

function linkDist(count: number): number {
  return LINK_DIST_BASE * Math.sqrt(BASE_COUNT / count)
}

const MOUSE_RADIUS = 160

class Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  colorIdx: number
  baseR: number
  isMobile: boolean

  constructor(w: number, h: number, isMobile = false) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.4
    this.vy = (Math.random() - 0.5) * 0.4
    this.r = Math.random() * 1.5 + (isMobile ? 1.6 : 2.2)
    this.colorIdx = Math.floor(Math.random() * DARK_COLORS.length)
    this.baseR = this.r
    this.isMobile = isMobile
  }

  update(w: number, h: number, mouse: { x: number; y: number; active: boolean }, dt = 1) {
    this.x += this.vx * dt
    this.y += this.vy * dt

    if (this.x < 0 || this.x > w) this.vx *= -1
    if (this.y < 0 || this.y > h) this.vy *= -1

    if (mouse.active) {
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const dist = Math.hypot(dx, dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_RADIUS) * 0.6 * dt
        this.vx += (dx / dist) * force
        this.vy += (dy / dist) * force
        this.r = this.baseR + (1 - dist / MOUSE_RADIUS) * 2.2
      } else {
        this.r += (this.baseR - this.r) * 0.05 * dt
      }
    } else {
      this.r += (this.baseR - this.r) * 0.05 * dt
    }

    // Fricción suave normalizada por delta-time
    this.vx *= Math.pow(0.985, dt)
    this.vy *= Math.pow(0.985, dt)

    // Movimiento base constante relajado
    const speed = Math.hypot(this.vx, this.vy)
    if (speed < 0.1) {
      this.vx += (Math.random() - 0.5) * 0.03 * dt
      this.vy += (Math.random() - 0.5) * 0.03 * dt
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean, isScrolling = false) {
    const palette = isDark ? DARK_COLORS : LIGHT_COLORS
    const color = palette[this.colorIdx]!

    ctx.beginPath()
    ctx.arc(this.x, this.y, isDark ? this.r : Math.max(2.0, this.r * 1.1), 0, Math.PI * 2)
    ctx.fillStyle = color
    if (!isScrolling) {
      ctx.shadowColor = isDark ? color : 'rgba(2, 132, 199, 0.45)'
      ctx.shadowBlur = isDark ? 6 : 4
    }
    ctx.fill()
    if (!isScrolling) {
      ctx.shadowBlur = 0
    }
  }
}

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  const shouldRender =
    !pathname?.startsWith('/tienda') &&
    !pathname?.startsWith('/login') &&
    !pathname?.startsWith('/cotizador')

  useEffect(() => {
    if (!shouldRender) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const mouse = { x: -9999, y: -9999, active: false }
    const nodeCount = isMobile ? MOBILE_NODE_COUNT : NODE_COUNT
    const maxDist = isMobile ? linkDist(MOBILE_NODE_COUNT) : linkDist(NODE_COUNT)
    const nodes = Array.from({ length: nodeCount }, () => new Node(w, h, isMobile))
    const coords = new Float64Array(nodes.length * 2)

    let isDocumentVisible = true
    let isScrolling = false
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null
    let animId: number | null = null
    let frameCount = 0
    let lastTime = performance.now()
    let cachedPairs: [number, number][] = []

    const handleScroll = () => {
      isScrolling = true
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const burst = (e?: MouseEvent | TouchEvent) => {
      if (e && 'button' in e && e.button !== 0) return
      nodes.forEach((n) => {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 220) {
          const force = (1 - dist / 220) * 4.5
          n.vx += (dx / dist) * force
          n.vy += (dy / dist) * force
        }
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0]!.clientX
        mouse.y = e.touches[0]!.clientY
        mouse.active = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', burst, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', burst, { passive: true })

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible'
      if (isDocumentVisible && !animId && !prefersReducedMotion) {
        loop()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Observar cambio de tema claro/oscuro para redibujar de inmediato
    const observer = new MutationObserver(() => {
      if (prefersReducedMotion) {
        renderFrame()
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // ── Delaunay triangulation mesh optimizada con caché de aristas ──────────
    const drawDelaunay = () => {
      const darkTheme = document.documentElement.classList.contains('dark')

      // Solo recalcular Delaunator cada 2 frames y cuando no se esté scrolleando intensamente
      if (!isScrolling && (frameCount % 2 === 0 || cachedPairs.length === 0)) {
        for (let i = 0; i < nodes.length; i++) {
          coords[i * 2] = nodes[i]!.x
          coords[i * 2 + 1] = nodes[i]!.y
        }

        const del = new Delaunator(coords)
        const tris = del.triangles
        const pairsMap = new Map<number, Set<number>>()

        cachedPairs = []
        for (let t = 0; t < tris.length; t += 3) {
          const [a, b, c] = [tris[t]!, tris[t + 1]!, tris[t + 2]!]
          const triplets: [number, number][] = [
            [Math.min(a, b), Math.max(a, b)],
            [Math.min(b, c), Math.max(b, c)],
            [Math.min(a, c), Math.max(a, c)],
          ]
          for (const [i, j] of triplets) {
            let set = pairsMap.get(i)
            if (!set) {
              set = new Set<number>()
              pairsMap.set(i, set)
            }
            if (!set.has(j)) {
              set.add(j)
              cachedPairs.push([i, j])
            }
          }
        }
      }

      // Dibujar aristas trianguladas en un único trazo por lote (reducción masiva de draw-calls)
      ctx.beginPath()
      for (const pair of cachedPairs) {
        if (!pair) continue
        const [i, j] = pair
        const na = nodes[i]
        const nb = nodes[j]
        if (!na || !nb) continue

        const dx = na.x - nb.x
        const dy = na.y - nb.y
        const dist = Math.hypot(dx, dy)

        if (dist > maxDist) continue

        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
      }
      ctx.strokeStyle = darkTheme ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.35)'
      ctx.lineWidth = darkTheme ? 0.75 : 1.15
      ctx.stroke()

      // Conectar el cursor con las partículas cercanas al mover el mouse en un único trazo
      if (mouse.active) {
        ctx.beginPath()
        for (const n of nodes) {
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < MOUSE_RADIUS) {
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(n.x, n.y)
          }
        }
        ctx.strokeStyle = darkTheme ? 'rgba(56, 189, 248, 0.55)' : 'rgba(2, 132, 199, 0.7)'
        ctx.lineWidth = darkTheme ? 1.2 : 1.6
        ctx.stroke()
      }
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, w, h)
      drawDelaunay()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.draw(ctx, darkTheme, false)
      })
    }

    if (prefersReducedMotion || isMobile) {
      renderFrame()
      return () => {
        observer.disconnect()
        if (scrollTimeout) clearTimeout(scrollTimeout)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
        window.removeEventListener('mousedown', burst)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchstart', burst)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    const loop = () => {
      if (!isDocumentVisible) {
        animId = null
        return
      }

      animId = requestAnimationFrame(loop)

      const now = performance.now()
      const dtRatio = Math.max(0.2, Math.min(2.5, (now - lastTime) / 16.667))
      lastTime = now
      frameCount++

      ctx.clearRect(0, 0, w, h)
      drawDelaunay()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.update(w, h, mouse, dtRatio)
        n.draw(ctx, darkTheme, isScrolling)
      })
    }

    loop()

    return () => {
      if (animId) cancelAnimationFrame(animId)
      observer.disconnect()
      if (scrollTimeout) clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', burst)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', burst)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500 bg-background">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

export default PremiumBackground
