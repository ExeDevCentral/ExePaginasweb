'use client'

import { useEffect, useRef } from 'react'

const DARK_COLORS = ['#60a5fa', '#c084fc', '#34d399']
const LIGHT_COLORS = ['#0284c7', '#7c3aed', '#059669']

const NODE_COUNT = 90
const MOBILE_NODE_COUNT = 22
const LINK_DIST = 140
const MOUSE_RADIUS = 170

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
    this.vx = (Math.random() - 0.5) * 0.45
    this.vy = (Math.random() - 0.5) * 0.45
    this.r = Math.random() * 2 + 1.2
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
      if (dist < MOUSE_RADIUS) {
        const force = (1 - dist / MOUSE_RADIUS) * 0.7
        this.vx += (dx / dist) * force
        this.vy += (dy / dist) * force
        this.r = this.baseR + (1 - dist / MOUSE_RADIUS) * 3.5
      } else {
        this.r += (this.baseR - this.r) * 0.1
      }
    } else {
      this.r += (this.baseR - this.r) * 0.1
    }

    // Fricción suave
    this.vx *= 0.98
    this.vy *= 0.98

    // Movimiento mínimo constante
    const speed = Math.hypot(this.vx, this.vy)
    if (speed < 0.15) {
      this.vx += (Math.random() - 0.5) * 0.06
      this.vy += (Math.random() - 0.5) * 0.06
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    const palette = isDark ? DARK_COLORS : LIGHT_COLORS
    const color = palette[this.colorIdx]

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = color
    if (!this.isMobile) {
      ctx.shadowBlur = isDark ? 8 : 4
      ctx.shadowColor = color
    }
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const mouse = { x: -9999, y: -9999, active: false }
    const nodeCount = isMobile ? MOBILE_NODE_COUNT : NODE_COUNT
    const nodes = Array.from({ length: nodeCount }, () => new Node(w, h, isMobile))

    const burst = () => {
      nodes.forEach((n) => {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 260) {
          const force = (1 - dist / 260) * 7
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

    const handleMouseDown = () => {
      burst()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
        mouse.active = true
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
        mouse.active = true
        burst()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    const drawLinks = () => {
      const darkTheme = document.documentElement.classList.contains('dark')
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < LINK_DIST) {
            const factor = 1 - dist / LINK_DIST
            const opacity = darkTheme ? factor * 0.45 : factor * 0.35
            const lineColor = darkTheme
              ? `rgba(148, 163, 184, ${opacity})`
              : `rgba(71, 85, 105, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = darkTheme ? 0.6 : 0.8
            ctx.stroke()
          }
        }
      }
    }

    let animId: number
    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      if (!isMobile) drawLinks()
      const darkTheme = document.documentElement.classList.contains('dark')
      nodes.forEach((n) => {
        n.update(w, h, mouse)
        n.draw(ctx, darkTheme)
      })

      animId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500 bg-background">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

export default PremiumBackground
