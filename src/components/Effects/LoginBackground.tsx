import { useEffect, useRef, useCallback } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import LoginScene from './LoginScene'

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number

  constructor(canvasW: number, canvasH: number, colors: string[]) {
    this.x = Math.random() * canvasW
    this.y = Math.random() * canvasH
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = -Math.random() * 0.4 - 0.1
    this.size = Math.random() * 2.5 + 0.5
    this.alpha = 0
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.life = 0
    this.maxLife = 300 + Math.random() * 500
  }

  update(mouseX: number, mouseY: number, mouseActive: boolean) {
    this.life++
    const lifeRatio = this.life / this.maxLife
    this.alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1
    this.alpha *= 0.6

    if (mouseActive) {
      const dx = this.x - mouseX
      const dy = this.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 200) {
        const force = (200 - dist) / 200
        this.vx += (dx / dist) * force * 0.15
        this.vy += (dy / dist) * force * 0.15
      }
    }

    this.vx *= 0.98
    this.vy *= 0.98
    this.x += this.vx
    this.y += this.vy
  }

  isDead(canvasW: number, canvasH: number) {
    return (
      this.life >= this.maxLife ||
      this.x < -20 ||
      this.x > canvasW + 20 ||
      this.y < -20 ||
      this.y > canvasH + 20
    )
  }
}

function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)

  const n00 = noise2D(ix, iy)
  const n10 = noise2D(ix + 1, iy)
  const n01 = noise2D(ix, iy + 1)
  const n11 = noise2D(ix + 1, iy + 1)

  const nx0 = n00 * (1 - sx) + n10 * sx
  const nx1 = n01 * (1 - sx) + n11 * sx

  return nx0 * (1 - sy) + nx1 * sy
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency)
    amplitude *= 0.5
    frequency *= 2
  }
  return value
}

export default function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const isMobile = useIsMobile()

  const COLORS = [
    'rgba(99,102,241,',
    'rgba(129,140,248,',
    'rgba(139,92,246,',
    'rgba(168,85,247,',
    'rgba(14,165,233,',
    'rgba(192,132,252,',
  ]

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
    mouseRef.current.active = true
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    const maxParticles = isMobile ? 40 : 120
    const spawnRate = isMobile ? 0.15 : 0.4

    let time = 0

    const drawAurora = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      time += 0.003

      const bands = [
        {
          y: 0.18,
          height: 0.25,
          color1: [99, 102, 241],
          color2: [14, 165, 233],
          speed: 0.7,
          amplitude: 0.08,
        },
        {
          y: 0.42,
          height: 0.3,
          color1: [139, 92, 246],
          color2: [236, 72, 153],
          speed: 0.5,
          amplitude: 0.1,
        },
        {
          y: 0.7,
          height: 0.22,
          color1: [99, 102, 241],
          color2: [168, 85, 247],
          speed: 0.6,
          amplitude: 0.06,
        },
      ]

      for (const band of bands) {
        const bandY = h * band.y
        const bandH = h * band.height

        for (let x = 0; x < w; x += 3) {
          const nx = x / w
          const noiseVal = fbm(nx * 3 + time * band.speed, band.y * 2 + time * 0.3, 4)
          const wave = Math.sin(nx * Math.PI * 2 + time * band.speed * 2) * band.amplitude
          const distortion = (noiseVal - 0.5) * 0.15

          const startY = bandY + (wave + distortion) * h
          const peakAlpha = 0.08 + noiseVal * 0.07

          const gradient = ctx.createLinearGradient(
            x,
            startY - bandH * 0.3,
            x,
            startY + bandH * 0.7
          )
          gradient.addColorStop(0, `rgba(${band.color1.join(',')},0)`)
          gradient.addColorStop(0.3, `rgba(${band.color1.join(',')},${peakAlpha * 0.5})`)
          gradient.addColorStop(0.5, `rgba(${band.color2.join(',')},${peakAlpha})`)
          gradient.addColorStop(0.7, `rgba(${band.color1.join(',')},${peakAlpha * 0.4})`)
          gradient.addColorStop(1, `rgba(${band.color2.join(',')},0)`)

          ctx.fillStyle = gradient
          ctx.fillRect(x, startY - bandH * 0.3, 3, bandH)
        }
      }

      const mouse = mouseRef.current
      if (mouse.active) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250)
        gradient.addColorStop(0, 'rgba(99,102,241,0.06)')
        gradient.addColorStop(0.4, 'rgba(139,92,246,0.03)')
        gradient.addColorStop(1, 'rgba(99,102,241,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(mouse.x - 250, mouse.y - 250, 500, 500)
      }

      if (Math.random() < spawnRate && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(new Particle(w, h, COLORS))
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.update(mouse.x, mouse.y, mouse.active)

        if (p.isDead(w, h)) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + (p.alpha * 0.7).toFixed(2) + ')'
        ctx.fill()

        if (p.size > 1.5 && p.alpha > 0.3) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = p.color + (p.alpha * 0.08).toFixed(2) + ')'
          ctx.fill()
        }
      }

      if (!isMobile) {
        for (let i = 0; i < 80; i++) {
          const sx = noise2D(i * 0.1, time * 0.1) * w * 1.2 - w * 0.1
          const sy = noise2D(i * 0.1 + 50, time * 0.08) * h * 1.2 - h * 0.1
          const twinkle = (Math.sin(time * 3 + i * 1.7) + 1) * 0.5
          const starAlpha = 0.15 + twinkle * 0.25
          const starSize = 0.5 + twinkle * 1

          ctx.beginPath()
          ctx.arc(sx, sy, starSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,210,255,${starAlpha.toFixed(2)})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(drawAurora)
    }

    drawAurora()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isMobile, handleMouseMove, handleMouseLeave])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#050508]" />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />

      <LoginScene />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-[3]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 15%, transparent 65%)',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050508_85%)] pointer-events-none z-[4]" />
    </div>
  )
}
