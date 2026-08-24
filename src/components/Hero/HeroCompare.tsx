import React, { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function HeroCompare() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const afterRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    stopDemo()
    setPositionFromClientX(e.clientX)
    e.currentTarget.setPointerCapture?.(e.pointerId)
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl font-black font-montserrat text-foreground mb-8"
      >
        {t('hero.compare_titulo')}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="hc-compare"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="hc-side hc-before">
          <div className="hc-browser-bar">
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-dot" />
          </div>
          <div className="hc-side-content">
            <div>
              <span className="hc-badge">{t('hero.compare_before_badge')}</span>
              <h3>{t('hero.compare_before_titulo')}</h3>
              <p>{t('hero.compare_before_desc')}</p>
              <div className="hc-spinner" />
            </div>
          </div>
        </div>

        <div className="hc-side hc-after hc-after-clip" ref={afterRef}>
          <div className="hc-browser-bar">
            <span className="hc-dot" />
            <span className="hc-dot" />
            <span className="hc-dot" />
          </div>
          <div className="hc-side-content">
            <span className="hc-orb hc-orb1" />
            <span className="hc-orb hc-orb2" />
            <span className="hc-orb hc-orb3" />
            <span className="hc-shine" />
            <div className="hc-after-inner">
              <span className="hc-badge hc-badge-after">{t('hero.compare_after_badge')}</span>
              <h3 className="hc-after-title">{t('hero.compare_after_titulo')}</h3>
              <p className="hc-after-desc">{t('hero.compare_after_desc')}</p>
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
              <div className="hc-fast">
                <span className="hc-pulse-dot" />
                {t('hero.compare_fast')}
              </div>
            </div>
          </div>
        </div>

        <span className="hc-tag hc-tag-left">{t('hero.compare_tag_antes')}</span>
        <span className="hc-tag hc-tag-right">{t('hero.compare_tag_despues')}</span>
        <div className="hc-handle" ref={handleRef} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 text-sm text-muted-foreground"
      >
        {t('hero.compare_hint')}
      </motion.p>
    </div>
  )
}
