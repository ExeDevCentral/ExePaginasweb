/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Esfera 3D de Glifos Corporativa (Arquitectura Fibonacci Sobria y Estable)
 *
 * - Auto-centrado automático: En reposo o al salir el cursor, se centra sola con un eje erguido y estable.
 * - Giro autónomo continuo: Rota de manera soberbia, fluida y constante sobre su eje Y sin tambaleos.
 * - Alta seriedad visual: Paleta curada de alta fidelidad (azules tecnológicos, cian y blanco hielo), sin estridencias.
 * - Interacción por mouse refinada: Sutil inclinación de perspectiva al pasar el cursor; arrastre amortiguado.
 * - Impulso por scroll controlado: El scroll acelera suavemente la rotación sin desestabilizar la inclinación ni el centro.
 */
'use client'

import React, { useEffect, useRef } from 'react'

interface Point3D {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
  char: string
  size: number
  energy: number // 0 a 1 (destello)
  energySpeed: number
  pulseColor: string
}

interface ActiveConnection {
  p1: number
  p2: number
  life: number // 1 a 0
  maxLife: number
  speed: number
  color: string
}

const GLYPHS = ['+', 'T', '|', 'L', '—', '·', '1', '0', ':', '/', '▪']
const PULSE_COLORS_DARK = ['#06b6d4', '#38bdf8', '#3b82f6', '#60a5fa', '#ffffff']
const PULSE_COLORS_LIGHT = ['#0284c7', '#0369a1', '#1d4ed8', '#0284c7', '#2563eb']

export const OptimusGlyphSphere: React.FC<{
  className?: string
  sphereRadius?: number
}> = ({ className = '', sphereRadius = 260 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360)
    let height = (canvas.height = canvas.parentElement?.clientHeight || width || 360)

    // Retina display support
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // 480 puntos distribuidos uniformemente con espiral áurea de Fibonacci (densidad balanceada)
    const NUM_POINTS = 480
    const points: Point3D[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle

    for (let i = 0; i < NUM_POINTS; i++) {
      const y = 1 - (i / (NUM_POINTS - 1)) * 2 // -1 a 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        char: GLYPHS[i % GLYPHS.length] ?? '+',
        size: 8.5 + (i % 4) * 1.5,
        energy: 0.04 + Math.random() * 0.08,
        energySpeed: 0.01 + Math.random() * 0.015,
        pulseColor: PULSE_COLORS_DARK[i % PULSE_COLORS_DARK.length] ?? '#06b6d4',
      })
    }

    // Red de conexiones vivas
    let connections: ActiveConnection[] = []

    // ========================================================
    // FÍSICA DE ROTACIÓN SOBRIA, CENTRADA Y AUTÓNOMA
    // ========================================================
    // Inclinación vertical (pitch: eje X). Centrada en 0.06 rad (~3.5°) para vista 3D digna
    const CENTER_PITCH = 0.06
    let pitch = CENTER_PITCH
    let targetPitch = CENTER_PITCH

    // Rotación sobre eje horizontal Y (yaw)
    let yaw = 0
    // Velocidad de giro autónomo base (sedosa, continua y constante: 0.0022 rad/frame)
    const BASE_SPIN_SPEED = 0.0022
    let extraSpinSpeed = 0
    let scrollEnergy = 0

    // Control de interacción del mouse
    let isHovering = false
    let isDragging = false
    let lastMouseX = 0
    let lastMouseY = 0
    let mouseCanvasX = -9999
    let mouseCanvasY = -9999

    // Activación controlada de ráfagas luminosas por scroll (sin cabeceos de rotación)
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      const absDelta = Math.abs(delta)
      lastScrollY = currentScrollY

      if (absDelta > 1) {
        // El scroll acelera suavemente el giro sobre el eje Y sin tocar la inclinación vertical
        extraSpinSpeed = Math.min(extraSpinSpeed + absDelta * 0.00018, 0.007)
        scrollEnergy = Math.min(scrollEnergy + absDelta * 0.03, 2.0)

        // Encender algunos nodos aleatorios
        const count = Math.min(6, Math.floor(absDelta / 6))
        for (let k = 0; k < count; k++) {
          const idx = Math.floor(Math.random() * points.length)
          const pt = points[idx]
          if (pt) pt.energy = 0.9
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 5) {
        extraSpinSpeed = Math.min(extraSpinSpeed + Math.abs(e.deltaY) * 0.00008, 0.006)
        scrollEnergy = Math.min(scrollEnergy + 0.4, 2.0)
      }
    }

    const handleMouseEnter = () => {
      isHovering = true
    }

    const handleMouseLeave = () => {
      isHovering = false
      isDragging = false
      mouseCanvasX = -9999
      mouseCanvasY = -9999
      // Auto-centrado inmediato: regresa con suavidad a la inclinación neutra
      targetPitch = CENTER_PITCH
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseCanvasX = e.clientX - rect.left
      mouseCanvasY = e.clientY - rect.top

      if (isDragging) {
        const dx = e.clientX - lastMouseX
        const dy = e.clientY - lastMouseY
        yaw += dx * 0.004
        targetPitch = Math.max(-0.35, Math.min(0.45, targetPitch - dy * 0.0035))
        lastMouseX = e.clientX
        lastMouseY = e.clientY
      } else {
        // Sutil inclinación de perspectiva al pasar el cursor (muy fina: max ±0.08 rad)
        const offsetY = mouseCanvasY - height / 2
        targetPitch = CENTER_PITCH - (offsetY / height) * 0.16
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      lastMouseX = e.clientX
      lastMouseY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
      if (!isHovering) {
        targetPitch = CENTER_PITCH
      }
    }

    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.parentElement.clientWidth || 360
      height = canvas.parentElement.clientHeight || width || 360
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && e.touches[0]) {
        isDragging = true
        lastMouseX = e.touches[0].clientX
        lastMouseY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1 && e.touches[0]) {
        const touch = e.touches[0]
        const dx = touch.clientX - lastMouseX
        const dy = touch.clientY - lastMouseY
        yaw += dx * 0.005
        targetPitch = Math.max(-0.35, Math.min(0.45, targetPitch - dy * 0.0035))
        lastMouseX = touch.clientX
        lastMouseY = touch.clientY
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
      targetPitch = CENTER_PITCH
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Bucle de renderizado continuo (60-120 FPS)
    const render = () => {
      // Desaceleración suave del impulso por scroll
      if (extraSpinSpeed > 0) {
        extraSpinSpeed *= 0.95
        if (extraSpinSpeed < 0.00005) extraSpinSpeed = 0
      }
      if (scrollEnergy > 0) {
        scrollEnergy *= 0.95
        if (scrollEnergy < 0.02) scrollEnergy = 0
      }

      // Auto-centrado suave hacia targetPitch (cuando no hay mouse, vuelve exactamente a CENTER_PITCH)
      pitch += (targetPitch - pitch) * 0.045
      // Giro autónomo constante sobre el eje vertical
      yaw += BASE_SPIN_SPEED + extraSpinSpeed

      ctx.clearRect(0, 0, width, height)

      // Centro fijo y contenido
      const centerX = width / 2
      const centerY = height / 2
      // Radio monumental ocupando casi la mitad de la pantalla con margen de seguridad
      const radius = Math.min(width, height) * 0.42
      const isDark =
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

      // Matrices de rotación 3D (pitch = eje X, yaw = eje Y)
      const cosP = Math.cos(pitch)
      const sinP = Math.sin(pitch)
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)

      // Proyectar todos los puntos
      const projected = points.map((p) => {
        // Rotación eje Y (giro autónomo)
        const x1 = p.baseX * cosY + p.baseZ * sinY
        const z1 = -p.baseZ * sinY + p.baseX * cosY

        // Rotación eje X (inclinación auto-centrada)
        const y2 = p.baseY * cosP - z1 * sinP
        const z2 = p.baseY * sinP + z1 * cosP

        p.x = x1
        p.y = y2
        p.z = z2

        // Proyección de perspectiva focal limpia
        const fov = 2.6
        const scale = fov / (fov + z2)
        const screenX = centerX + x1 * radius * scale
        const screenY = centerY + y2 * radius * scale

        // Decaimiento sutil de energía
        if (p.energy > 0.05) {
          p.energy -= p.energySpeed
        } else {
          p.energy = 0.05
        }

        return {
          point: p,
          screenX,
          screenY,
          scale,
          depth: z2,
        }
      })

      // ========================================================
      // 1. RED DE INTERCONEXIÓN SOBRIA & CONTINUA
      // Siempre mantiene de 36 a 44 enlaces serenos y de alta precisión
      // ========================================================
      const targetConnections = scrollEnergy > 0.4 ? 50 : 38
      if (connections.length < targetConnections) {
        const idx1 = Math.floor(Math.random() * points.length)
        const p1 = points[idx1]
        if (p1 && p1.z > -0.55) {
          let bestIdx = -1
          let bestDist = 999
          for (let s = 0; s < 18; s++) {
            const candIdx = Math.floor(Math.random() * points.length)
            if (candIdx === idx1) continue
            const p2 = points[candIdx]
            if (!p2) continue
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z)
            if (dist > 0.12 && dist < 0.52 && dist < bestDist) {
              bestDist = dist
              bestIdx = candIdx
            }
          }

          if (bestIdx !== -1) {
            const palette = isDark ? PULSE_COLORS_DARK : PULSE_COLORS_LIGHT
            const color = palette[Math.floor(Math.random() * palette.length)] ?? '#06b6d4'
            connections.push({
              p1: idx1,
              p2: bestIdx,
              life: 1.0,
              maxLife: 45 + Math.random() * 35,
              speed: 1.1 + Math.random() * 0.7,
              color,
            })
            p1.energy = Math.max(p1.energy, 0.7)
            const pBest = points[bestIdx]
            if (pBest) pBest.energy = Math.max(pBest.energy, 0.7)
          }
        }
      }

      // ILUMINACIÓN MAGNÉTICA SUTIL AL POSAR EL MOUSE
      if (isHovering && mouseCanvasX > 0 && mouseCanvasY > 0) {
        for (const item of projected) {
          if (item.depth > -0.3) {
            const dist = Math.hypot(item.screenX - mouseCanvasX, item.screenY - mouseCanvasY)
            if (dist < 80) {
              const boost = (1 - dist / 80) * 0.85
              item.point.energy = Math.max(item.point.energy, boost)
            }
          }
        }
      }

      // Ordenar por profundidad (z-order)
      projected.sort((a, b) => a.depth - b.depth)

      // ========================================================
      // 2. DIBUJAR LÍNEAS DE ENLACE TECNOLÓGICAS (FINAS Y DEFINIDAS)
      // ========================================================
      connections = connections.filter((conn) => {
        conn.life -= 1 / conn.maxLife
        if (conn.life <= 0) return false

        const p1Proj = projected.find((item) => item.point === points[conn.p1])
        const p2Proj = projected.find((item) => item.point === points[conn.p2])

        if (!p1Proj || !p2Proj) return false
        if (p1Proj.depth < -0.4 && p2Proj.depth < -0.4) return true

        const alpha =
          Math.min(conn.life * 1.5, 1) * Math.max(0.12, (p1Proj.scale + p2Proj.scale) / 2)

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1Proj.screenX, p1Proj.screenY)
        ctx.lineTo(p2Proj.screenX, p2Proj.screenY)

        // Gradiente sobrio tecnológico
        const gradient = ctx.createLinearGradient(
          p1Proj.screenX,
          p1Proj.screenY,
          p2Proj.screenX,
          p2Proj.screenY
        )
        if (isDark) {
          gradient.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.85})`)
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.95})`)
          gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.85})`)
          ctx.shadowColor = '#06b6d4'
        } else {
          gradient.addColorStop(0, `rgba(2, 132, 199, ${alpha * 0.9})`)
          gradient.addColorStop(0.5, `rgba(3, 105, 161, ${alpha * 0.95})`)
          gradient.addColorStop(1, `rgba(29, 78, 216, ${alpha * 0.9})`)
          ctx.shadowColor = '#0284c7'
        }

        ctx.strokeStyle = gradient
        ctx.lineWidth = (isDark ? 0.95 : 1.1) * p1Proj.scale
        ctx.shadowBlur = 5 * alpha
        ctx.stroke()

        // Fotón viajero con cadencia elegante
        const progress = ((1 - conn.life) * conn.speed * 1.5) % 1
        const packetX = p1Proj.screenX + (p2Proj.screenX - p1Proj.screenX) * progress
        const packetY = p1Proj.screenY + (p2Proj.screenY - p1Proj.screenY) * progress

        ctx.beginPath()
        ctx.arc(packetX, packetY, (isDark ? 1.6 : 1.8) * p1Proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? '#ffffff' : '#0284c7'
        ctx.shadowColor = isDark ? '#38bdf8' : '#0369a1'
        ctx.shadowBlur = 6
        ctx.fill()

        ctx.restore()
        return true
      })

      // ========================================================
      // 3. DIBUJAR GLIFOS FIBONACCI
      // ========================================================
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const item of projected) {
        const { point, screenX, screenY, scale, depth } = item
        const normZ = (depth + 1) / 2
        const isFront = depth > 0

        const fontSize = Math.max(7, Math.round(point.size * scale))
        ctx.font = `${point.energy > 0.35 ? 'bold' : 'normal'} ${fontSize}px "Geist Mono", monospace`

        ctx.save()

        if (point.energy > 0.3) {
          // NODO ILUMINADO / ACTIVO
          ctx.shadowColor = isDark ? point.pulseColor : '#0284c7'
          ctx.shadowBlur = (isDark ? 10 : 7) * point.energy
          ctx.fillStyle =
            point.energy > 0.65
              ? isDark
                ? '#ffffff'
                : '#0284c7'
              : isDark
                ? point.pulseColor
                : '#0369a1'
          ctx.fillText(point.char, screenX, screenY)
        } else {
          // GLIFO EN REPOSO: MATRIZ ELEGANTE Y NÍTIDA (OPACIDAD SUAVE PARA NO COMPETIR)
          const baseAlpha = isDark
            ? isFront
              ? 0.28 + normZ * 0.32
              : 0.08 + normZ * 0.12
            : isFront
              ? 0.35 + normZ * 0.25
              : 0.12 + normZ * 0.18
          const rgb = isDark ? '203, 213, 225' : '71, 85, 105'
          ctx.fillStyle = `rgba(${rgb}, ${baseAlpha})`
          ctx.fillText(point.char, screenX, screenY)
        }

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [sphereRadius])

  return (
    <div
      className={`relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center pointer-events-auto select-none ${className}`}
    >
      {/* Halo ambiental suave detrás de la esfera (sin marco ni borde) */}
      <div className="absolute inset-4 rounded-full bg-cyan-500/5 dark:bg-cyan-400/[0.04] blur-[80px] pointer-events-none" />

      {/* Sutil órbita concéntrica tenue de fondo */}
      <div className="absolute inset-8 rounded-full border border-dashed border-cyan-500/10 dark:border-cyan-400/10 pointer-events-none animate-spin-slower" />

      {/* CANVAS 3D INTERACTIVO CON TOUCH-ACTION PAN-Y */}
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full h-full cursor-grab active:cursor-grabbing z-10 touch-pan-y"
      />
    </div>
  )
}

export default OptimusGlyphSphere
