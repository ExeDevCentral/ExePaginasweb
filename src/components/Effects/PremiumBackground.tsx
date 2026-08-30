'use client'

import { useEffect, useRef } from 'react'

const DARK_COLORS = ['#38bdf8', '#818cf8', '#34d399']
const LIGHT_COLORS = ['#0284c7', '#6366f1', '#10b981']

const NODE_COUNT = 20
const MOBILE_NODE_COUNT = 8
const LINK_DIST = 140
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
    const color = palette[this.colorIdx]

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
    const nodes = Array.from({ length: nodeCount }, () => new Node(w, h, isMobile))

    let isDocumentVisible = true
    let isScrolling = false
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
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
        mouse.active = true
        wakeUp()
      }
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      isScrolling = true
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 100)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('mousedown', burst, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', burst, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible'
      if (isDocumentVisible) {
        wakeUp()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const drawLinks = () => {
      const darkTheme = document.documentElement.classList.contains('dark')
      const maxDist = isMobile ? 80 : LINK_DIST
      const len = nodes.length

      for (let i = 0; i < len; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < len; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          const maxDistSq = maxDist * maxDist

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq)
            const factor = 1 - dist / maxDist
            const opacity = darkTheme ? factor * 0.25 : factor * 0.12
            const lineColor = `rgba(148, 163, 184, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    const renderFrame = () => {
      ctx.clearRect(0, 0, w, h)
      drawLinks()
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
        window.removeEventListener('scroll', handleScroll)
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

      // Durante scroll rápido, saltar cálculo de enlaces para mantener el hilo libre
      if (isScrolling) return

      ctx.clearRect(0, 0, w, h)
      drawLinks()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.update(w, h, mouse)
        n.draw(ctx, darkTheme)
      })
    }

    loop()

    return () => {
      if (animId) cancelAnimationFrame(animId)
      clearTimeout(scrollTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', burst)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', burst)
      window.removeEventListener('scroll', handleScroll)
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
