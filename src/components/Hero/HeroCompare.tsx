import React, { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function HeroCompare() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const afterRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef(false)
  const userInteractedRef = useRef(false)
  const demoRafRef = useRef<number | null>(null)

  const updatePosition = useCallback((percentage: number) => {
    const clamped = Math.max(0, Math.min(100, percentage))
    if (afterRef.current) {
      afterRef.current.style.clipPath = `inset(0 0 0 ${clamped}%)`
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${clamped}%`
    }
  }, [])

  const setPositionFromClientX = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const p = ((clientX - rect.left) / rect.width) * 100
      updatePosition(p)
    },
    [updatePosition]
  )

  const stopDemo = useCallback(() => {
    userInteractedRef.current = true
    if (demoRafRef.current) cancelAnimationFrame(demoRafRef.current)
    demoRafRef.current = null
  }, [])

  // Auto demo sweep al montar: animación fluida directa en DOM (cero re-renders de React)
  useEffect(() => {
    let demoTime = 0
    const sweep = () => {
      if (userInteractedRef.current) return
      demoTime += 0.025
      const p = 50 + Math.sin(demoTime) * 15
      if (demoTime < Math.PI * 2) {
        updatePosition(p)
        demoRafRef.current = requestAnimationFrame(sweep)
      } else {
        updatePosition(50)
      }
    }
    const timer = setTimeout(() => {
      demoRafRef.current = requestAnimationFrame(sweep)
    }, 600)
    return () => {
      clearTimeout(timer)
      if (demoRafRef.current) cancelAnimationFrame(demoRafRef.current)
    }
  }, [updatePosition])

  // Matrix Digital Rain Canvas Effect en el lado de Herramienta Digital
  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const chars = '01EXESYSWEB</>202610101'
    const fontSize = 12
    let columns = 0
    let drops: number[] = []

    const resize = () => {
      if (!canvas.parentElement) return
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
      columns = Math.max(1, Math.floor(canvas.width / fontSize))
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30))
    }

    resize()
    window.addEventListener('resize', resize)

    let lastDraw = 0
    const fpsInterval = 1000 / 30

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw)
      if (now - lastDraw < fpsInterval) return
      lastDraw = now

      ctx.fillStyle = 'rgba(10, 6, 20, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length))
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (i % 4 === 0) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)' // Cyan neon
        } else if (i % 6 === 0) {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.75)' // Violet
        } else {
          ctx.fillStyle = 'rgba(52, 211, 153, 0.8)' // Matrix emerald
        }

        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    stopDemo()
    setPositionFromClientX(e.clientX)
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      // safe fallback for older WebKit / mobile browsers
    }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    setPositionFromClientX(e.clientX)
  }
  const onPointerUp = () => {
    draggingRef.current = false
  }

  return (
    <div className="relative mt-16 w-full max-w-5xl mx-auto z-10">
      <motion.h2
        initial={{ opacity: 0.9, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl font-black font-montserrat text-foreground mb-8 text-center"
      >
        {t('hero.compare_titulo')}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0.95, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hc-compare"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* LADO ANTES: Plantilla alquilada, genérica y restringida */}
        <div className="hc-side hc-before">
          <div className="hc-browser-bar">
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-browser-url-before">https://tu-tienda.plantilla-alquilada.com</span>
          </div>
          <div className="hc-side-content">
            <div className="hc-before-inner">
              <span className="hc-badge">{t('hero.compare_before_badge')}</span>
              <h3>{t('hero.compare_before_titulo')}</h3>
              <p>{t('hero.compare_before_desc')}</p>

              <div className="hc-before-warnings">
                <span className="hc-warning-item">⚠ Límite mensual de visitas</span>
                <span className="hc-warning-item">⚠ Comisiones por venta</span>
                <span className="hc-warning-item">⚠ Sin acceso al código fuente</span>
              </div>

              <div className="hc-spinner-wrapper">
                <div className="hc-spinner" />
                <span className="hc-spinner-text">Cargando plugins lentos (3.8s)...</span>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DESPUÉS: Herramienta digital propia, estilo Matrix / Cyberpunk 2026 */}
        <div className="hc-side hc-after hc-after-clip" ref={afterRef}>
          <div className="hc-browser-bar">
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-browser-url">https://tu-sistema.exesistemasweb.com</span>
          </div>
          <div className="hc-side-content">
            {/* Matrix Digital Rain Effect */}
            <canvas ref={matrixCanvasRef} className="hc-matrix-canvas" tabIndex={-1} />
            <div className="hc-scanlines" aria-hidden="true" />
            <span className="hc-orb hc-orb1" />
            <span className="hc-orb hc-orb2" />
            <span className="hc-orb hc-orb3" />
            <span className="hc-shine" />

            <div className="hc-after-inner">
              {/* Mini HUD Terminal de Software */}
              <div className="hc-terminal-hud">
                <div className="hc-terminal-header">
                  <div className="hc-terminal-status">
                    <span className="hc-pulse-dot" />
                    <span className="hc-terminal-title">EXE-CORE v2026 // ULTRA EDGE ENGINE</span>
                  </div>
                  <span className="hc-terminal-pill">LATENCIA 0.3ms</span>
                </div>
                <div className="hc-terminal-body">
                  <code>
                    <span className="text-[#38BDF8]">const</span>{' '}
                    <span className="text-white">app</span> ={' '}
                    <span className="text-[#A78BFA]">createSystem</span>({'{'} scale:{' '}
                    <span className="text-[#34D399]">'100% tuyo'</span>, rent:{' '}
                    <span className="text-rose-400">false</span>, speed:{' '}
                    <span className="text-[#FBBF24]">'ultra'</span> {'}'})
                  </code>
                </div>
              </div>

              <div className="hc-title-wrapper">
                <span className="hc-badge hc-badge-after">{t('hero.compare_after_badge')}</span>
                <h3 className="hc-after-title">{t('hero.compare_after_titulo')}</h3>
                <p className="hc-after-desc">{t('hero.compare_after_desc')}</p>
              </div>

              <div className="hc-stats">
                <div className="hc-stat">
                  <div className="hc-num">0.3s</div>
                  <div className="hc-lbl">{t('hero.compare_stat_carga')}</div>
                </div>
                <div className="hc-stat">
                  <div className="hc-num">100%</div>
                  <div className="hc-lbl">{t('hero.compare_stat_tuyo')}</div>
                </div>
                <div className="hc-stat">
                  <div className="hc-num">∞</div>
                  <div className="hc-lbl">{t('hero.compare_stat_duracion')}</div>
                </div>
              </div>

              {/* Cyber Feature Badges */}
              <div className="hc-cyber-pills">
                <span className="hc-pill">⚡ Edge CDN Global</span>
                <span className="hc-pill">🔒 Cero Alquiler</span>
                <span className="hc-pill">✦ PostgreSQL Nativo</span>
                <span className="hc-pill">🤖 IA Ready</span>
              </div>
            </div>
          </div>
        </div>

        <span className="hc-tag hc-tag-left">{t('hero.compare_tag_antes')}</span>
        <span className="hc-tag hc-tag-right">{t('hero.compare_tag_despues')}</span>
        <div className="hc-handle" ref={handleRef} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-6 text-sm text-muted-foreground text-center"
      >
        {t('hero.compare_hint')}
      </motion.p>
    </div>
  )
}
