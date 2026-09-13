'use client'

import { useEffect, useRef } from 'react'
import Delaunator from 'delaunator'

const DARK_COLORS = ['#38bdf8', '#818cf8', '#34d399']
const LIGHT_COLORS = ['#0284c7', '#6366f1', '#10b981']

// ── Density-aware constants ───────────────────────────────────────────────────
// More points → smaller link radius so visual density stays constant.
// Formula: LINK_DIST_BASE / sqrt(nodeCount / BASE_COUNT)
const BASE_COUNT = 20 // original reference
const LINK_DIST_BASE = 140 // px at BASE_COUNT nodes
const NODE_COUNT = 63 // desktop (+15% over previous 55)
const MOBILE_NODE_COUNT = 21 // mobile (+15% over previous 18)

function linkDist(count: number): number {
  return LINK_DIST_BASE * Math.sqrt(BASE_COUNT / count)
}

const MOUSE_RADIUS = 150

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
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.r = Math.random() * 1.5 + 1.0
    this.colorIdx = Math.floor(Math.random() * DARK_COLORS.length)
    this.baseR = this.r
    this.isMobile = isMobile
  }

  update(w: number, h: number, mouse: { x: number; y: number; active: boolean }) {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > w) this.vx *= -1
    if (this.y < 0 || this.y > h) this.vy *= -1

    if (mouse.active) {
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const dist = Math.hypot(dx, dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_RADIUS) * 0.5
        this.vx += (dx / dist) * force
        this.vy += (dy / dist) * force
        this.r = this.baseR + (1 - dist / MOUSE_RADIUS) * 2
      } else {
        this.r += (this.baseR - this.r) * 0.05
      }
    } else {
      this.r += (this.baseR - this.r) * 0.05
    }

    // Fricción suave
    this.vx *= 0.985
    this.vy *= 0.985

    // Movimiento base constante muy relajado
    const speed = Math.hypot(this.vx, this.vy)
    if (speed < 0.08) {
      this.vx += (Math.random() - 0.5) * 0.02
      this.vy += (Math.random() - 0.5) * 0.02
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    const palette = isDark ? DARK_COLORS : LIGHT_COLORS
    const color = palette[this.colorIdx]!

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Si el usuario prefiere movimiento reducido, dibujamos un frame sutil estático y no ejecutamos el loop
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const mouse = { x: -9999, y: -9999, active: false }
    const nodeCount = isMobile ? MOBILE_NODE_COUNT : NODE_COUNT
    const maxDist = isMobile ? linkDist(MOBILE_NODE_COUNT) : linkDist(NODE_COUNT)
    const nodes = Array.from({ length: nodeCount }, () => new Node(w, h, isMobile))

    let isDocumentVisible = true
    let isSleeping = false
    let lastActivityTime = performance.now()
    let animId: number | null = null

    const wakeUp = () => {
      lastActivityTime = performance.now()
      if (isSleeping) {
        isSleeping = false
        if (!animId) {
          loop()
        }
      }
    }

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      wakeUp()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const burst = () => {
      wakeUp()
      nodes.forEach((n) => {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 200) {
          const force = (1 - dist / 200) * 4
          n.vx += (dx / dist) * force
          n.vy += (dy / dist) * force
        }
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
      wakeUp()
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0]!.clientX
        mouse.y = e.touches[0]!.clientY
        mouse.active = true
        wakeUp()
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', burst, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', burst, { passive: true })

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible'
      if (isDocumentVisible) {
        wakeUp()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // ── Delaunay triangulation mesh ───────────────────────────────────────────
    // Builds a triangulation each frame, then draws only the edges whose
    // endpoint distance ≤ maxDist — giving a clean low-poly faceted network.
    const drawDelaunay = () => {
      const darkTheme = document.documentElement.classList.contains('dark')

      // Flat [x0,y0, x1,y1, ...] coords for delaunator
      const coords = new Float64Array(nodes.length * 2)
      for (let i = 0; i < nodes.length; i++) {
        coords[i * 2] = nodes[i]!.x
        coords[i * 2 + 1] = nodes[i]!.y
      }

      const del = new Delaunator(coords)
      const tris = del.triangles // indices: every 3 entries = one triangle

      // Collect unique edges from the triangulation
      // Use a Set<string> to skip duplicates (each interior edge appears twice)
      const drawn = new Set<string>()

      for (let t = 0; t < tris.length; t += 3) {
        const [a, b, c] = [tris[t]!, tris[t + 1]!, tris[t + 2]!]
        const pairs: [number, number][] = [
          [Math.min(a, b), Math.max(a, b)],
          [Math.min(b, c), Math.max(b, c)],
          [Math.min(a, c), Math.max(a, c)],
        ]

        for (const [i, j] of pairs) {
          const key = `${i}-${j}`
          if (drawn.has(key)) continue
          drawn.add(key)

          const na = nodes[i]!
          const nb = nodes[j]!
          const dx = na.x - nb.x
          const dy = na.y - nb.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Skip long edges — keeps the mesh local and avoids crossing diagonals
          if (dist > maxDist) continue

          const factor = 1 - dist / maxDist
          const opacity = darkTheme ? factor * 0.22 : factor * 0.1

          // Cyan/teal tint for edges — matches site accent palette
          ctx.beginPath()
          ctx.moveTo(na.x, na.y)
          ctx.lineTo(nb.x, nb.y)
          ctx.strokeStyle = darkTheme
            ? `rgba(56, 189, 248, ${opacity})` // sky-400 (cyan)
            : `rgba(14, 116, 144, ${opacity})` // teal-700
          ctx.lineWidth = 0.55
          ctx.stroke()
        }
      }
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, w, h)
      drawDelaunay()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.draw(ctx, darkTheme)
      })
    }

    if (prefersReducedMotion) {
      renderFrame()
      return () => {
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

      // Si el usuario no ha interactuado en más de 2.5s y el ratón no está activo, suspender el RAF
      const now = performance.now()
      if (!mouse.active && now - lastActivityTime > 2500) {
        isSleeping = true
        animId = null
        return
      }

      animId = requestAnimationFrame(loop)

      ctx.clearRect(0, 0, w, h)
      drawDelaunay()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.update(w, h, mouse)
        n.draw(ctx, darkTheme)
      })
    }

    loop()

    return () => {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', burst)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', burst)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500 bg-background">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

export default PremiumBackground
