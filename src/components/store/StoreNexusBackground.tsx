'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from '../../core/theme/ThemeContext'

interface DataPacket {
  lineIndex: number
  isVertical: boolean
  progress: number
  speed: number
  color: string
  size: number
}

interface ParticleNode {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  size: number
  color: string
  pulsePhase: number
}

export const StoreNexusBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const isMobile = width < 768

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      active: false,
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX
        mouse.targetY = e.touches[0].clientY
        mouse.active = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Data packets on the cyber grid
    const packetColors = isDark
      ? ['#00f0ff', '#a855f7', '#ec4899', '#38bdf8']
      : ['#0284c7', '#7c3aed', '#db2777', '#06b6d4']

    const packetCount = isMobile ? 12 : 28
    const packets: DataPacket[] = Array.from({ length: packetCount }, () => ({
      lineIndex: Math.floor(Math.random() * 20),
      isVertical: Math.random() > 0.5,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.005,
      color: packetColors[Math.floor(Math.random() * packetColors.length)],
      size: 2 + Math.random() * 2.5,
    }))

    // Floating cyber nodes
    const nodeCount = isMobile ? 25 : 55
    const nodes: ParticleNode[] = Array.from({ length: nodeCount }, () => {
      const x = Math.random() * width
      const y = Math.random() * height
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: packetColors[Math.floor(Math.random() * packetColors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      }
    })

    let isDocumentVisible = true
    const handleVisibility = () => {
      isDocumentVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)

    let animationFrameId: number
    let time = 0

    const render = () => {
      animationFrameId = requestAnimationFrame(render)
      if (!isDocumentVisible) return

      time += 0.015

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      // Background ambient cyber radial glow
      const auroraGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        isMobile ? 320 : 560
      )

      if (isDark) {
        auroraGradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)')
        auroraGradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.05)')
        auroraGradient.addColorStop(0.8, 'rgba(236, 72, 153, 0.02)')
        auroraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        auroraGradient.addColorStop(0, 'rgba(2, 132, 199, 0.09)')
        auroraGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.04)')
        auroraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      }

      ctx.fillStyle = auroraGradient
      ctx.fillRect(0, 0, width, height)

      // 3D Perspective Digital Cyber Grid
      const horizonY = height * 0.15
      const gridSpacingX = isMobile ? 65 : 85
      const gridCountX = Math.ceil(width / gridSpacingX) + 6
      const gridStartX = -(gridSpacingX * 3)

      const gridSpacingY = isMobile ? 38 : 46
      const gridCountY = Math.ceil((height - horizonY) / gridSpacingY)

      ctx.lineWidth = isDark ? 0.7 : 0.85

      // Horizontal grid lines with sine perspective waves
      for (let j = 0; j <= gridCountY; j++) {
        const progress = j / gridCountY
        const y = horizonY + Math.pow(progress, 1.4) * (height - horizonY)
        const wave = Math.sin(time * 1.5 + j * 0.35) * (4 * progress)

        const distToMouse = Math.abs(y - mouse.y)
        const mouseFactor = Math.max(0, 1 - distToMouse / 280)
        const alpha = isDark
          ? 0.04 + progress * 0.12 + mouseFactor * 0.22
          : 0.03 + progress * 0.08 + mouseFactor * 0.18

        ctx.beginPath()
        ctx.moveTo(0, y + wave)

        for (let x = 0; x <= width; x += 40) {
          const xWave = Math.sin(x * 0.005 + time + j * 0.2) * (3 * progress)
          ctx.lineTo(x, y + wave + xWave)
        }

        ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(14, 116, 144, ${alpha})`
        ctx.stroke()
      }

      // Vertical perspective lines converging to horizon
      const vanishX = width * 0.5 + (mouse.x - width * 0.5) * 0.08

      for (let i = 0; i <= gridCountX; i++) {
        const bottomX = gridStartX + i * gridSpacingX
        const distToMouse = Math.abs(bottomX - mouse.x)
        const mouseFactor = Math.max(0, 1 - distToMouse / 250)

        const alpha = isDark ? 0.04 + mouseFactor * 0.2 : 0.03 + mouseFactor * 0.15

        ctx.beginPath()
        ctx.moveTo(vanishX + (bottomX - vanishX) * 0.05, horizonY)
        ctx.lineTo(bottomX, height)
        ctx.strokeStyle = isDark ? `rgba(168, 85, 247, ${alpha})` : `rgba(124, 58, 237, ${alpha})`
        ctx.stroke()
      }

      // Render traveling data packets along the grid
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed
        if (pkt.progress > 1) {
          pkt.progress = 0
          pkt.lineIndex = Math.floor(Math.random() * (pkt.isVertical ? gridCountX : gridCountY))
        }

        let px = 0
        let py = 0

        if (pkt.isVertical) {
          const bottomX = gridStartX + (pkt.lineIndex % gridCountX) * gridSpacingX
          const progressY = Math.pow(pkt.progress, 1.4)
          py = horizonY + progressY * (height - horizonY)
          px = vanishX + (bottomX - vanishX) * (0.05 + progressY * 0.95)
        } else {
          const progressY = Math.pow(pkt.lineIndex / gridCountY, 1.4)
          py = horizonY + progressY * (height - horizonY)
          px = pkt.progress * width
        }

        // Draw glowing packet pulse
        ctx.beginPath()
        ctx.arc(px, py, pkt.size, 0, Math.PI * 2)
        ctx.fillStyle = pkt.color
        ctx.shadowColor = pkt.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Update and draw floating cyber telemetry nodes
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > width) n.vx *= -1
        n.y += Math.sin(time + n.pulsePhase) * 0.2

        if (mouse.active) {
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 180 && dist > 0) {
            const force = (1 - dist / 180) * 1.5
            n.x += (dx / dist) * force
            n.y += (dy / dist) * force
          }
        }

        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + n.pulsePhase)
        const alpha = isDark ? 0.3 + pulse * 0.5 : 0.2 + pulse * 0.4

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size * (0.8 + pulse * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1.0
      })
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isDark])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />
    </div>
  )
}

export default StoreNexusBackground
