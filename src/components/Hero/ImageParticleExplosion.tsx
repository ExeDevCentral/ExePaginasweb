import { useEffect, useRef, useCallback, useState } from 'react'

interface Particle {
  ox: number
  oy: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rot: number
  rotV: number
}

const SAMPLE_STEP = 3
const EXPLODE_FORCE = 8
const RETURN_FORCE = 0.04
const DRAG = 0.97
const FLOAT_AMP = 0.3

export default function ImageParticleExplosion({
  imgSrc,
  onPhaseChange,
}: {
  imgSrc: string
  onPhaseChange?: (phase: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef(0)
  const phaseRef = useRef<'idle' | 'exploding' | 'floating' | 'returning'>('idle')
  const timeRef = useRef(0)
  const scaleRef = useRef({ x: 1, y: 1 })
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'exploding' | 'floating' | 'returning'>('idle')

  const trigger = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    phaseRef.current = 'exploding'
    timeRef.current = 0
    setPhase('exploding')
    onPhaseChange?.('exploding')

    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgSrc
    img.onload = () => {
      const iw = img.naturalWidth || 400
      const ih = img.naturalHeight || 400
      const cssW = canvas.offsetWidth
      const cssH = canvas.offsetHeight
      const sx = cssW / iw
      const sy = cssH / ih
      scaleRef.current = { x: sx, y: sy }

      const offscreen = document.createElement('canvas')
      offscreen.width = iw
      offscreen.height = ih
      const octx = offscreen.getContext('2d')
      if (!octx) return
      octx.drawImage(img, 0, 0)
      const data = octx.getImageData(0, 0, iw, ih).data

      const cx = iw / 2
      const cy = ih / 2
      const particles: Particle[] = []
      for (let y = 0; y < ih; y += SAMPLE_STEP) {
        for (let x = 0; x < iw; x += SAMPLE_STEP) {
          const idx = (y * iw + x) * 4
          const r = data[idx],
            g = data[idx + 1],
            b = data[idx + 2],
            a = data[idx + 3]
          if (a < 30) continue
          const dx = x - cx,
            dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = EXPLODE_FORCE * (0.6 + Math.random() * 0.8)
          const pulse = 0.8 + Math.random() * 0.4
          particles.push({
            ox: x * sx,
            oy: y * sy,
            x: x * sx,
            y: y * sy,
            vx: (dx / dist) * force * pulse,
            vy: (dy / dist) * force * pulse,
            color: `rgb(${r},${g},${b})`,
            size: 1 + Math.random() * 1.5,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.1,
          })
        }
      }
      particlesRef.current = particles
      setReady(true)

      setTimeout(() => {
        phaseRef.current = 'floating'
        setPhase('floating')
        onPhaseChange?.('floating')
        timeRef.current = 0
      }, 800)

      setTimeout(() => {
        phaseRef.current = 'returning'
        setPhase('returning')
        onPhaseChange?.('returning')
        timeRef.current = 0
        particles.forEach((p) => {
          p.vx = 0
          p.vy = 0
        })
      }, 3500)

      setTimeout(() => {
        phaseRef.current = 'idle'
        setPhase('idle')
        onPhaseChange?.('idle')
        setReady(false)
        particlesRef.current = []
      }, 5500)
    }
  }, [imgSrc, onPhaseChange])

  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let running = true

    const loop = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      const particles = particlesRef.current
      timeRef.current++

      for (const p of particles) {
        if (phaseRef.current === 'exploding') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= DRAG
          p.vy *= DRAG
        } else if (phaseRef.current === 'floating') {
          p.x += Math.sin(timeRef.current * 0.02 + p.ox * 0.01) * FLOAT_AMP
          p.y += Math.cos(timeRef.current * 0.02 + p.oy * 0.01) * FLOAT_AMP
          p.vx *= 0.99
          p.vy *= 0.99
          p.x += p.vx
          p.y += p.vy
        } else if (phaseRef.current === 'returning') {
          const dx = p.ox - p.x
          const dy = p.oy - p.y
          p.vx += dx * RETURN_FORCE
          p.vy += dy * RETURN_FORCE
          p.vx *= 0.85
          p.vy *= 0.85
          p.x += p.vx
          p.y += p.vy
        }
        p.rot += p.rotV
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
      ctx.restore()
      animRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const cleanup = drawLoop()
    return cleanup
  }, [ready, drawLoop])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />
      <button
        type="button"
        onClick={trigger}
        disabled={phase !== 'idle'}
        className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-[10px] text-white/40 hover:text-white/70 hover:bg-white/10 transition-all font-mono"
      >
        {phase === 'idle'
          ? '✦ interactuar'
          : phase === 'exploding'
            ? '⚡'
            : phase === 'floating'
              ? '✦'
              : '↻'}
      </button>
    </>
  )
}
