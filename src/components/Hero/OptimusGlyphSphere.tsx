/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Esfera 3D Holográfica de Glifos & Red Tecnológica Multi-Canal
 *
 * Mejoras Neo Mini-LEDs & Conexiones Polícromas:
 * - Canales de interconexión polícromos (Cian, Esmeralda, Violeta, Rosa/Magenta, Ámbar y Azul Cobalto).
 * - "Mini LEDs largos" viajeros tipo fibra óptica / láser con gradiente de cola difuminada y diodo focal blanco.
 * - Volumen esférico 3D tangible con sombreado atmosférico direccional y aro perimetral Fresnel.
 * - Malla de paralelos (latitudes) y meridianos (longitudes) proyectados en perspectiva 3D real.
 * - Red estructural de constelación persistente (triangulación de vecinos espaciales).
 * - Tipografía y glifos mono de alto contraste y color reactivo.
 * - Anillo orbital 3D exterior con baliza satelital de seguimiento.
 * - Rendimiento 60-120 FPS con requestAnimationFrame, DPR Retina y desconexión por IntersectionObserver.
 */
'use client'

import React, { useEffect, useRef } from 'react'

interface NeoColor {
  hex: string
  rgb: [number, number, number]
  lightHex: string
  lightRgb: [number, number, number]
}

interface Point3D {
  baseX: number
  baseY: number
  baseZ: number
  x: number
  y: number
  z: number
  char: string
  size: number
  energy: number // 0 a 1 (destello)
  energySpeed: number
  colorIdx: number
  isGlyph: boolean
}

interface Edge {
  p1: number
  p2: number
  colorIdx: number
}

interface EnergyPulse {
  edgeIdx: number
  progress: number // 0 a 1+
  lengthRatio: number // Largo del mini LED (20% a 45% del segmento)
  speed: number
  colorIdx: number
}

interface ProjectedPoint {
  point: Point3D
  screenX: number
  screenY: number
  scale: number
  depth: number
}

const GLYPHS = ['0', '1', '+', '◇', '▲', '●', '▪', '✦', '—', 'λ', '⬡', '//', '◈']

// Paleta Neo Multi-Canal (Cian, Esmeralda, Violeta, Magenta/Rosa, Ámbar, Azul Cobalto)
const NEO_PALETTE: NeoColor[] = [
  {
    hex: '#00f0ff', // Neo Cyan
    rgb: [0, 240, 255],
    lightHex: '#0284c7', // Sky / Cyan profundo
    lightRgb: [2, 132, 199],
  },
  {
    hex: '#10b981', // Neo Emerald / Matrix Green
    rgb: [16, 185, 129],
    lightHex: '#059669', // Esmeralda alto contraste
    lightRgb: [5, 150, 105],
  },
  {
    hex: '#c084fc', // Neo Purple / Violet
    rgb: [192, 132, 252],
    lightHex: '#7c3aed', // Violeta profundo
    lightRgb: [124, 58, 237],
  },
  {
    hex: '#fb7185', // Neo Rose / Coral
    rgb: [251, 113, 133],
    lightHex: '#e11d48', // Rubí / Rose profundo
    lightRgb: [225, 29, 72],
  },
  {
    hex: '#fbbf24', // Neo Amber / Gold
    rgb: [251, 191, 36],
    lightHex: '#d97706', // Ámbar tostado
    lightRgb: [217, 119, 6],
  },
  {
    hex: '#38bdf8', // Neo Electric Blue
    rgb: [56, 189, 248],
    lightHex: '#1d4ed8', // Azul Cobalto nítido
    lightRgb: [29, 78, 216],
  },
]

// Ángulos de paralelos (latitudes) y meridianos (longitudes) para la cuadrícula 3D
const LATITUDES = [-62, -42, -22, 0, 22, 42, 62].map((deg) => (deg * Math.PI) / 180)
const MERIDIANS = [0, 30, 60, 90, 120, 150].map((deg) => (deg * Math.PI) / 180)

export const OptimusGlyphSphere: React.FC<{
  className?: string
  sphereRadius?: number
  radiusRatio?: number
}> = ({ className = '', sphereRadius = 300, radiusRatio = 0.44 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isVisibleOnScreen = true
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400)
    let height = (canvas.height = canvas.parentElement?.clientHeight || width || 400)

    const isMobile = width < 640
    // Soporte Retina display optimizado (tope 2 para balance óptimo nitidez/GPU)
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // ========================================================
    // 1. GENERAR PUNTOS DE FIBONACCI (DISTRIBUCIÓN UNIFORME 3D)
    // ========================================================
    const NUM_POINTS = isMobile ? 85 : 230
    const points: Point3D[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle

    for (let i = 0; i < NUM_POINTS; i++) {
      const y = 1 - (i / (NUM_POINTS - 1)) * 2 // de 1 a -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      // Los nodos destacados muestran glifos tipográficos nítidos; los demás puntos son vértices de red
      const isGlyph = i % 3 === 0 || i % 7 === 0

      points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x,
        y,
        z,
        char: GLYPHS[i % GLYPHS.length] ?? '+',
        size: 9.0 + (i % 4) * 1.5,
        energy: 0.05 + Math.random() * 0.1,
        energySpeed: 0.012 + Math.random() * 0.015,
        colorIdx: i % NEO_PALETTE.length,
        isGlyph,
      })
    }

    // ========================================================
    // 2. CONSTRUIR MALLA ESTRUCTURAL DE ARISTAS CON CANALES DE COLOR
    // ========================================================
    const edges: Edge[] = []
    const edgeSet = new Set<string>()

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]
      if (!p1) continue

      const distances: { idx: number; distSq: number }[] = []
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue
        const p2 = points[j]
        if (!p2) continue
        const dx = p1.baseX - p2.baseX
        const dy = p1.baseY - p2.baseY
        const dz = p1.baseZ - p2.baseZ
        const dSq = dx * dx + dy * dy + dz * dz
        if (dSq < 0.22) {
          distances.push({ idx: j, distSq: dSq })
        }
      }

      distances.sort((a, b) => a.distSq - b.distSq)
      const connectCount = Math.min(distances.length, isMobile ? 2 : 3)
      for (let k = 0; k < connectCount; k++) {
        const target = distances[k]
        if (!target) continue
        const minIdx = Math.min(i, target.idx)
        const maxIdx = Math.max(i, target.idx)
        const key = `${minIdx}-${maxIdx}`
        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          // Asignar canal cromático único a cada arista para riqueza visual
          const colorIdx = (minIdx * 3 + maxIdx * 7) % NEO_PALETTE.length
          edges.push({ p1: minIdx, p2: maxIdx, colorIdx })
        }
      }
    }

    // ========================================================
    // 3. MINI LEDS LARGOS DINÁMICOS (NEO PULSOS VIAJEROS)
    // ========================================================
    const NUM_PULSES = isMobile ? 12 : 40
    const pulses: EnergyPulse[] = []
    for (let i = 0; i < NUM_PULSES; i++) {
      if (edges.length === 0) break
      pulses.push({
        edgeIdx: Math.floor(Math.random() * edges.length),
        progress: Math.random(),
        lengthRatio: 0.22 + Math.random() * 0.24, // Largo de 22% a 46% del tramo
        speed: 0.012 + Math.random() * 0.018,
        colorIdx: (i * 2 + Math.floor(Math.random() * 3)) % NEO_PALETTE.length,
      })
    }

    // ========================================================
    // 4. FÍSICA DE ROTACIÓN SUAVE E INTERACCIÓN
    // ========================================================
    const CENTER_PITCH = 0.12
    let pitch = CENTER_PITCH
    let targetPitch = CENTER_PITCH
    let yaw = 0
    const BASE_SPIN_SPEED = 0.002
    let extraSpinSpeed = 0
    let scrollEnergy = 0

    let isHovering = false
    let isDragging = false
    let lastMouseX = 0
    let lastMouseY = 0
    let mouseCanvasX = -9999
    let mouseCanvasY = -9999

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      const absDelta = Math.abs(delta)
      lastScrollY = currentScrollY

      if (absDelta > 1) {
        extraSpinSpeed = Math.min(extraSpinSpeed + absDelta * 0.00015, 0.008)
        scrollEnergy = Math.min(scrollEnergy + absDelta * 0.03, 2.0)

        // Energizar aleatoriamente algunos nodos al scrollear
        const count = Math.min(5, Math.floor(absDelta / 6))
        for (let k = 0; k < count; k++) {
          const idx = Math.floor(Math.random() * points.length)
          const pt = points[idx]
          if (pt) pt.energy = 0.95
        }
      }
    }
    let lastScrollY = window.scrollY

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 5) {
        extraSpinSpeed = Math.min(extraSpinSpeed + Math.abs(e.deltaY) * 0.00008, 0.006)
        scrollEnergy = Math.min(scrollEnergy + 0.35, 2.0)
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
        const offsetY = mouseCanvasY - height / 2
        targetPitch = CENTER_PITCH - (offsetY / height) * 0.18
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
      width = canvas.parentElement.clientWidth || 400
      height = canvas.parentElement.clientHeight || width || 400
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

    // ========================================================
    // BUCLE DE RENDERIZADO PRINCIPAL (60 - 120 FPS)
    // ========================================================
    const render = () => {
      if (extraSpinSpeed > 0) {
        extraSpinSpeed *= 0.95
        if (extraSpinSpeed < 0.00004) extraSpinSpeed = 0
      }
      if (scrollEnergy > 0) {
        scrollEnergy *= 0.95
        if (scrollEnergy < 0.02) scrollEnergy = 0
      }

      pitch += (targetPitch - pitch) * 0.045
      yaw += BASE_SPIN_SPEED + extraSpinSpeed

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      // Radio de la esfera: aprovecha armónicamente el ancho/alto con margen para auras
      const radius = Math.min(width, height) * radiusRatio

      const isDark =
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

      // Matrices de rotación 3D
      const cosP = Math.cos(pitch)
      const sinP = Math.sin(pitch)
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)
      const fov = 2.6

      // Función helper para rotar y proyectar cualquier punto unitario 3D
      const project3D = (bx: number, by: number, bz: number, r: number = radius) => {
        const x1 = bx * cosY + bz * sinY
        const z1 = -bz * sinY + bx * cosY
        const y2 = by * cosP - z1 * sinP
        const z2 = by * sinP + z1 * cosP

        const scale = fov / (fov + z2)
        const sx = centerX + x1 * r * scale
        const sy = centerY + y2 * r * scale
        return { sx, sy, z2, scale }
      }

      // ========================================================
      // CAPA 1: VOLUMEN ESFÉRICO 3D TANGIBLE (SOMBREO & ARO FRESNEL)
      // ========================================================
      ctx.save()
      const lightOffsetX = -radius * 0.28
      const lightOffsetY = -radius * 0.28
      const bodyGrad = ctx.createRadialGradient(
        centerX + lightOffsetX,
        centerY + lightOffsetY,
        radius * 0.05,
        centerX,
        centerY,
        radius * 1.01
      )

      if (isDark) {
        bodyGrad.addColorStop(0, 'rgba(34, 211, 238, 0.24)')
        bodyGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.14)')
        bodyGrad.addColorStop(0.72, 'rgba(15, 23, 42, 0.06)')
        bodyGrad.addColorStop(0.92, 'rgba(6, 182, 212, 0.35)')
        bodyGrad.addColorStop(1, 'rgba(34, 211, 238, 0.65)')
      } else {
        // Modo Claro: Esfera de cristal tecnológica con brillo nítido
        bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)')
        bodyGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.45)')
        bodyGrad.addColorStop(0.7, 'rgba(186, 230, 253, 0.22)')
        bodyGrad.addColorStop(0.92, 'rgba(14, 165, 233, 0.18)')
        bodyGrad.addColorStop(1, 'rgba(2, 132, 199, 0.38)')
      }

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = bodyGrad
      ctx.fill()

      // Borde / Aro Perimetral Fresnel de alta definición
      const enableGlow = !isMobile
      if (isDark) {
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.65)'
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = enableGlow ? 10 : 0
      } else {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.6)'
        ctx.shadowColor = 'rgba(2, 132, 199, 0.25)'
        ctx.shadowBlur = enableGlow ? 6 : 0
      }
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // ========================================================
      // CAPA 2: CUADRÍCULA HOLOGRÁFICA 3D (PARALELOS & MERIDIANOS)
      // ========================================================
      const drawGridLines = (drawFrontPass: boolean) => {
        const segments = isMobile ? 20 : 44
        ctx.save()

        // 2A. Paralelos (Latitudes)
        for (const lat of LATITUDES) {
          const isEquator = Math.abs(lat) < 0.05
          const rLat = Math.cos(lat)
          const yLat = Math.sin(lat)

          ctx.beginPath()
          let hasMoved = false

          for (let s = 0; s <= segments; s++) {
            const theta = (s / segments) * Math.PI * 2
            const bx = rLat * Math.cos(theta)
            const by = yLat
            const bz = rLat * Math.sin(theta)

            const proj = project3D(bx, by, bz)
            const isFront = proj.z2 >= -0.05

            if ((drawFrontPass && !isFront) || (!drawFrontPass && isFront)) {
              hasMoved = false
              continue
            }

            if (!hasMoved) {
              ctx.moveTo(proj.sx, proj.sy)
              hasMoved = true
            } else {
              ctx.lineTo(proj.sx, proj.sy)
            }
          }

          if (drawFrontPass) {
            if (isDark) {
              ctx.strokeStyle = isEquator ? 'rgba(34, 211, 238, 0.75)' : 'rgba(56, 189, 248, 0.45)'
              ctx.shadowColor = '#06b6d4'
              ctx.shadowBlur = enableGlow && isEquator ? 6 : 0
            } else {
              ctx.strokeStyle = isEquator ? 'rgba(2, 132, 199, 0.65)' : 'rgba(2, 132, 199, 0.38)'
              ctx.shadowBlur = 0
            }
            ctx.lineWidth = isEquator ? 1.4 : 0.9
          } else {
            ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.14)' : 'rgba(2, 132, 199, 0.15)'
            ctx.lineWidth = 0.75
            ctx.shadowBlur = 0
          }
          ctx.stroke()
        }

        // 2B. Meridianos (Longitudes)
        for (const lon of MERIDIANS) {
          ctx.beginPath()
          let hasMoved = false

          for (let s = 0; s <= segments; s++) {
            const theta = (s / segments) * Math.PI * 2
            const bx = Math.sin(theta) * Math.cos(lon)
            const by = Math.cos(theta)
            const bz = Math.sin(theta) * Math.sin(lon)

            const proj = project3D(bx, by, bz)
            const isFront = proj.z2 >= -0.05

            if ((drawFrontPass && !isFront) || (!drawFrontPass && isFront)) {
              hasMoved = false
              continue
            }

            if (!hasMoved) {
              ctx.moveTo(proj.sx, proj.sy)
              hasMoved = true
            } else {
              ctx.lineTo(proj.sx, proj.sy)
            }
          }

          if (drawFrontPass) {
            ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.42)' : 'rgba(2, 132, 199, 0.35)'
            ctx.lineWidth = 0.9
          } else {
            ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(2, 132, 199, 0.13)'
            ctx.lineWidth = 0.7
          }
          ctx.shadowBlur = 0
          ctx.stroke()
        }

        ctx.restore()
      }

      // Dibujar cuadrícula trasera
      drawGridLines(false)

      // ========================================================
      // CAPA 3: PROYECTAR PUNTOS Y ENERGÍA
      // ========================================================
      const projected: ProjectedPoint[] = []

      for (const p of points) {
        if (!p) continue

        const proj = project3D(p.baseX, p.baseY, p.baseZ)
        p.x = proj.sx
        p.y = proj.sy
        p.z = proj.z2

        if (p.energy > 0.05) {
          p.energy -= p.energySpeed
        } else {
          p.energy = 0.05
        }

        projected.push({
          point: p,
          screenX: proj.sx,
          screenY: proj.sy,
          scale: proj.scale,
          depth: proj.z2,
        })
      }

      // Iluminación magnética interactiva con el cursor
      if (isHovering && mouseCanvasX > 0 && mouseCanvasY > 0) {
        for (const item of projected) {
          if (item.depth > -0.25) {
            const dist = Math.hypot(item.screenX - mouseCanvasX, item.screenY - mouseCanvasY)
            if (dist < 100) {
              const boost = (1 - dist / 100) * 0.95
              item.point.energy = Math.max(item.point.energy, boost)
            }
          }
        }
      }

      // ========================================================
      // CAPA 4: MALLA ESTRUCTURAL DE ARISTAS CON CANALES POLÍCHROMOS
      // Cada canal aporta su propio color (Cian, Esmeralda, Violeta, etc.)
      // ========================================================
      const drawEdgesPass = (isFrontPass: boolean) => {
        ctx.save()
        for (const edge of edges) {
          const pt1 = projected[edge.p1]
          const pt2 = projected[edge.p2]
          if (!pt1 || !pt2) continue

          const avgDepth = (pt1.depth + pt2.depth) / 2
          const isFront = avgDepth >= -0.05

          if ((isFrontPass && !isFront) || (!isFrontPass && isFront)) continue

          const colorConfig = NEO_PALETTE[edge.colorIdx % NEO_PALETTE.length] ?? NEO_PALETTE[0]!
          const rgb = isDark ? colorConfig.rgb : colorConfig.lightRgb
          const avgScale = (pt1.scale + pt2.scale) / 2
          const maxEnergy = Math.max(pt1.point.energy, pt2.point.energy)

          ctx.beginPath()
          ctx.moveTo(pt1.screenX, pt1.screenY)
          ctx.lineTo(pt2.screenX, pt2.screenY)

          if (isFrontPass) {
            if (isDark) {
              const alpha = Math.min(1, 0.4 + avgDepth * 0.35 + maxEnergy * 0.45)
              ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
              ctx.shadowColor = colorConfig.hex
              ctx.shadowBlur = enableGlow && maxEnergy > 0.3 ? 7 : enableGlow ? 2 : 0
            } else {
              // Modo Claro: Líneas cromáticas de alta saturación y contraste
              const alpha = Math.min(1, 0.45 + avgDepth * 0.3 + maxEnergy * 0.35)
              ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
              ctx.shadowColor = colorConfig.lightHex
              ctx.shadowBlur = enableGlow && maxEnergy > 0.3 ? 4 : 0
            }
            ctx.lineWidth = (isDark ? 1.2 : 1.35) * avgScale
          } else {
            // Fondo
            const alpha = isDark ? 0.16 : 0.2
            ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
            ctx.lineWidth = 0.8 * avgScale
            ctx.shadowBlur = 0
          }

          ctx.stroke()
        }
        ctx.restore()
      }

      // Dibujar aristas traseras
      drawEdgesPass(false)

      // Dibujar cuadrícula frontal
      drawGridLines(true)

      // Dibujar aristas frontales polícromas
      drawEdgesPass(true)

      // ========================================================
      // CAPA 5: MINI LEDS LARGOS VIAJEROS (NEO FIBRA ÓPTICA LUMINOSA)
      // Trazos alargados con gradiente y diodo brillante en la punta
      // ========================================================
      ctx.save()
      for (const pulse of pulses) {
        pulse.progress += pulse.speed + extraSpinSpeed * 2.2
        if (pulse.progress >= 1 + pulse.lengthRatio) {
          pulse.progress = 0
          pulse.edgeIdx = Math.floor(Math.random() * edges.length)
          pulse.speed = 0.012 + Math.random() * 0.018
          pulse.lengthRatio = 0.22 + Math.random() * 0.24
          pulse.colorIdx = (pulse.colorIdx + 1) % NEO_PALETTE.length
          const edge = edges[pulse.edgeIdx]
          if (edge) {
            const pt = points[edge.p2]
            if (pt) pt.energy = Math.max(pt.energy, 0.85)
          }
        }

        const edge = edges[pulse.edgeIdx]
        if (!edge) continue
        const p1Proj = projected[edge.p1]
        const p2Proj = projected[edge.p2]
        if (!p1Proj || !p2Proj) continue

        const avgDepth = (p1Proj.depth + p2Proj.depth) / 2
        if (avgDepth < -0.32) continue // Evitar dibujar si está muy al fondo

        const color = NEO_PALETTE[pulse.colorIdx % NEO_PALETTE.length] ?? NEO_PALETTE[0]!
        const rgb = isDark ? color.rgb : color.lightRgb
        const scale = (p1Proj.scale + p2Proj.scale) / 2

        const tHead = Math.max(0, Math.min(1, pulse.progress))
        const tTail = Math.max(0, Math.min(1, pulse.progress - pulse.lengthRatio))

        if (tHead > tTail) {
          const headX = p1Proj.screenX + (p2Proj.screenX - p1Proj.screenX) * tHead
          const headY = p1Proj.screenY + (p2Proj.screenY - p1Proj.screenY) * tHead
          const tailX = p1Proj.screenX + (p2Proj.screenX - p1Proj.screenX) * tTail
          const tailY = p1Proj.screenY + (p2Proj.screenY - p1Proj.screenY) * tTail

          // Gradiente alargado para el cuerpo del Mini LED
          const ledGrad = ctx.createLinearGradient(tailX, tailY, headX, headY)
          if (isDark) {
            ledGrad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`)
            ledGrad.addColorStop(0.3, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.55)`)
            ledGrad.addColorStop(0.85, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.95)`)
            ledGrad.addColorStop(1, '#ffffff')
          } else {
            ledGrad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`)
            ledGrad.addColorStop(0.35, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6)`)
            ledGrad.addColorStop(0.85, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.95)`)
            ledGrad.addColorStop(1, color.lightHex)
          }

          // Trazo de cápsula LED alargada con puntas redondeadas
          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(headX, headY)
          ctx.strokeStyle = ledGrad
          ctx.lineCap = 'round'
          ctx.lineWidth = (isDark ? 2.8 : 3.0) * scale

          if (isDark) {
            ctx.shadowColor = color.hex
            ctx.shadowBlur = enableGlow ? 10 * scale : 0
          } else {
            ctx.shadowColor = color.lightHex
            ctx.shadowBlur = enableGlow ? 5 * scale : 0
          }
          ctx.stroke()

          // Diodo / Núcleo de alta intensidad en la punta del LED
          if (tHead > 0.05 && tHead < 0.98) {
            ctx.beginPath()
            ctx.arc(headX, headY, (isDark ? 2.5 : 2.2) * scale, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? '#ffffff' : color.lightHex
            ctx.shadowColor = isDark ? color.hex : color.lightHex
            ctx.shadowBlur = enableGlow ? (isDark ? 12 : 6) : 0
            ctx.fill()
          }
        }
      }
      ctx.restore()

      // ========================================================
      // CAPA 6: DIBUJAR VÉRTICES Y GLIFOS (ALTO CONTRASTE & POLÍCROMO)
      // ========================================================
      projected.sort((a, b) => a.depth - b.depth)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const item of projected) {
        const { point, screenX, screenY, scale, depth } = item
        const isFront = depth >= -0.05
        const normZ = (depth + 1) / 2
        const colorConfig = NEO_PALETTE[point.colorIdx % NEO_PALETTE.length] ?? NEO_PALETTE[0]!
        const rgb = isDark ? colorConfig.rgb : colorConfig.lightRgb

        ctx.save()

        // 6A. Punto / Vértice de conexión
        const dotRadius = (isFront ? 2.2 + point.energy * 2.4 : 1.3) * scale
        ctx.beginPath()
        ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2)

        if (isDark) {
          if (point.energy > 0.3) {
            ctx.fillStyle = '#ffffff'
            ctx.shadowColor = colorConfig.hex
            ctx.shadowBlur = enableGlow ? 12 * point.energy : 0
          } else if (isFront) {
            ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.85 + normZ * 0.15})`
            ctx.shadowColor = colorConfig.hex
            ctx.shadowBlur = enableGlow ? 4 : 0
          } else {
            ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.35)`
          }
        } else if (point.energy > 0.3) {
          ctx.fillStyle = colorConfig.lightHex
          ctx.shadowColor = colorConfig.lightHex
          ctx.shadowBlur = enableGlow ? 6 : 0
        } else if (isFront) {
          ctx.fillStyle =
            point.colorIdx % 3 === 0
              ? `rgba(15, 23, 42, ${0.85 + normZ * 0.15})` // Slate Navy
              : `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.85 + normZ * 0.15})`
        } else {
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.42)`
        }
        ctx.fill()

        // 6B. Glifo Tipográfico (para nodos destacados)
        if (point.isGlyph) {
          const fontSize = Math.max(9, Math.round((point.size || 11) * scale))
          ctx.font = `${isFront || point.energy > 0.3 ? 'bold' : 'normal'} ${fontSize}px "Geist Mono", monospace`

          let glyphFillColor: string
          if (point.energy > 0.28) {
            ctx.shadowColor = isDark ? colorConfig.hex : colorConfig.lightHex
            ctx.shadowBlur = enableGlow ? (isDark ? 12 : 6) * point.energy : 0
            if (isDark) {
              glyphFillColor = point.energy > 0.6 ? '#ffffff' : colorConfig.hex
            } else {
              glyphFillColor = point.energy > 0.6 ? '#0f172a' : colorConfig.lightHex
            }
          } else if (isDark && isFront) {
            glyphFillColor =
              point.colorIdx % 2 === 0
                ? `rgba(240, 249, 255, ${0.8 + normZ * 0.2})`
                : `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.85 + normZ * 0.15})`
            ctx.shadowColor = colorConfig.hex
            ctx.shadowBlur = enableGlow ? 3 * normZ : 0
          } else if (isDark) {
            glyphFillColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.35 + normZ * 0.25})`
          } else if (isFront) {
            glyphFillColor =
              point.colorIdx % 2 === 0
                ? `rgba(15, 23, 42, ${0.88 + normZ * 0.12})`
                : colorConfig.lightHex
          } else {
            glyphFillColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.45 + normZ * 0.25})`
          }
          ctx.fillStyle = glyphFillColor

          // Desplazar sutilmente el carácter respecto al punto para que ambos convivan con armonía
          ctx.fillText(point.char, screenX + 7 * scale, screenY - 5 * scale)
        }

        ctx.restore()
      }

      // ========================================================
      // CAPA 7: ANILLO ORBITAL 3D EXTERIOR CON BALIZA SATELITAL
      // ========================================================
      const orbitTilt = Math.PI * 0.2 // Inclinación 36°
      const orbitRadius = radius * 1.22
      const orbitSegments = 48
      const cosT = Math.cos(orbitTilt)
      const sinT = Math.sin(orbitTilt)

      for (let pass = 0; pass < 2; pass++) {
        const isFrontPass = pass === 1
        ctx.save()
        ctx.beginPath()
        let hasMoved = false

        for (let s = 0; s <= orbitSegments; s++) {
          const angle = (s / orbitSegments) * Math.PI * 2
          const rx0 = Math.cos(angle)
          const ry0 = Math.sin(angle) * sinT
          const rz0 = Math.sin(angle) * cosT

          const proj = project3D(rx0, ry0, rz0, orbitRadius)
          const isFront = proj.z2 >= -0.05

          if ((isFrontPass && !isFront) || (!isFrontPass && isFront)) {
            hasMoved = false
            continue
          }

          if (!hasMoved) {
            ctx.moveTo(proj.sx, proj.sy)
            hasMoved = true
          } else {
            ctx.lineTo(proj.sx, proj.sy)
          }
        }

        ctx.lineWidth = isFrontPass ? 1.2 : 0.75
        if (isFrontPass) {
          ctx.strokeStyle = isDark ? 'rgba(34, 211, 238, 0.55)' : 'rgba(2, 132, 199, 0.5)'
          if (isDark) {
            ctx.shadowColor = '#06b6d4'
            ctx.shadowBlur = enableGlow ? 6 : 0
          }
        } else {
          ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.16)' : 'rgba(2, 132, 199, 0.18)'
        }
        ctx.stroke()
        ctx.restore()
      }

      // Baliza de seguimiento en órbita
      const satAngle = yaw * 1.8
      const satX0 = Math.cos(satAngle)
      const satY0 = Math.sin(satAngle) * sinT
      const satZ0 = Math.sin(satAngle) * cosT
      const satProj = project3D(satX0, satY0, satZ0, orbitRadius)

      if (satProj.z2 >= -0.15) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(satProj.sx, satProj.sy, 3.5 * satProj.scale, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? '#ffffff' : '#0284c7'
        ctx.shadowColor = isDark ? '#38bdf8' : '#0284c7'
        ctx.shadowBlur = enableGlow ? 8 : 0
        ctx.fill()

        // Micro-etiqueta técnica de telemetría junto a la baliza
        ctx.font = `bold ${Math.max(8, Math.round(9 * satProj.scale))}px "Geist Mono", monospace`
        ctx.fillStyle = isDark ? 'rgba(240, 249, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)'
        ctx.shadowBlur = 0
        ctx.fillText('EXE.3D', satProj.sx + 10 * satProj.scale, satProj.sy - 5 * satProj.scale)
        ctx.restore()
      }

      if (isVisibleOnScreen) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const wasVisible = isVisibleOnScreen
        isVisibleOnScreen = entry ? entry.isIntersecting : true
        if (isVisibleOnScreen && !wasVisible) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = requestAnimationFrame(render)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    animationFrameId = requestAnimationFrame(render)

    return () => {
      observer.disconnect()
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
  }, [sphereRadius, radiusRatio])

  return (
    <div
      className={`relative w-full aspect-square mx-auto flex items-center justify-center pointer-events-auto select-none ${className}`}
    >
      {/* Halo ambiental multicapa detrás de la esfera (luminosidad y contraste en ambos modos) */}
      <div className="absolute inset-2 sm:inset-4 rounded-full bg-linear-to-tr from-cyan-500/25 via-blue-600/15 to-transparent dark:from-cyan-400/25 dark:via-blue-500/20 dark:to-transparent blur-[65px] pointer-events-none transition-opacity duration-500" />
      <div className="absolute inset-8 sm:inset-12 rounded-full bg-cyan-500/15 dark:bg-cyan-400/15 blur-2xl pointer-events-none" />

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
