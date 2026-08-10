import React, { useRef, useEffect, useCallback } from 'react'

export interface Photo3DCardProps {
  imageSrc?: string
  title?: string
  subtitle?: string
  tag?: string
  badgeText?: string
  onCardClick?: () => void
}

export const Photo3DCard: React.FC<Photo3DCardProps> = ({
  imageSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
  title = 'Foto 3D Ultra AAA',
  subtitle = 'Física de resortes, lámina holográfica iridiscente y múltiples capas de profundidad Z.',
  tag = 'Edición Artesanal Pro',
  badgeText = '3D LIVE',
  onCardClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const holoRef = useRef<HTMLDivElement>(null)
  const subjectRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const borderGlowRef = useRef<HTMLDivElement>(null)

  const stateRef = useRef({
    targetRX: 0,
    targetRY: 0,
    targetTZ: 0,
    currentRX: 0,
    currentRY: 0,
    currentTZ: 0,
    isPressed: false,
    isHovered: false,
  })

  useEffect(() => {
    let animId: number
    const damping = 0.08

    const renderLoop = () => {
      const s = stateRef.current
      s.currentRX += (s.targetRX - s.currentRX) * damping
      s.currentRY += (s.targetRY - s.currentRY) * damping
      s.currentTZ += (s.targetTZ - s.currentTZ) * damping

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `rotateX(${s.currentRX.toFixed(2)}deg) rotateY(${s.currentRY.toFixed(2)}deg) translateZ(${s.currentTZ.toFixed(2)}px)`
      }

      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.12) translateX(${(s.currentRY * -1.5).toFixed(2)}px) translateY(${(s.currentRX * 1.5).toFixed(2)}px) translateZ(-20px)`
      }

      if (subjectRef.current) {
        subjectRef.current.style.transform = `translateX(${(s.currentRY * 1.2).toFixed(2)}px) translateY(${(s.currentRX * -1.2).toFixed(2)}px) translateZ(55px)`
      }

      if (contentRef.current) {
        contentRef.current.style.transform = `translateX(${(s.currentRY * 0.6).toFixed(2)}px) translateY(${(s.currentRX * -0.6).toFixed(2)}px) translateZ(85px)`
      }

      if (chipRef.current) {
        chipRef.current.style.transform = `translateX(${(s.currentRY * 1.8).toFixed(2)}px) translateY(${(s.currentRX * -1.8).toFixed(2)}px) translateZ(110px)`
      }

      if (shadowRef.current) {
        shadowRef.current.style.transform = `translateZ(-90px) translateX(${(s.currentRY * 3.5).toFixed(2)}px) translateY(${(-s.currentRX * 3.5).toFixed(2)}px) scale(${1 + Math.abs(s.currentRX + s.currentRY) * 0.005})`
      }

      const holoAngle = s.currentRY * 8 + s.currentRX * 8 + 135
      if (holoRef.current) {
        holoRef.current.style.setProperty('--holo-angle', `${holoAngle}deg`)
      }
      if (borderGlowRef.current) {
        borderGlowRef.current.style.setProperty('--border-angle', `${holoAngle * 2}deg`)
      }

      animId = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    const handleGyro = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        stateRef.current.targetRY = Math.max(-25, Math.min(25, e.gamma * 0.7))
        stateRef.current.targetRX = Math.max(-25, Math.min(25, (e.beta - 45) * -0.7))
      }
    }

    window.addEventListener('deviceorientation', handleGyro)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('deviceorientation', handleGyro)
    }
  }, [])

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    stateRef.current.targetRX = -((y - centerY) / centerY) * 22
    stateRef.current.targetRY = ((x - centerX) / centerX) * 22

    if (glareRef.current) {
      const posX = (x / rect.width) * 100
      const posY = (y / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 35%, transparent 70%)`
      glareRef.current.style.opacity = '1'
    }

    if (holoRef.current) {
      holoRef.current.style.opacity = '0.65'
    }
  }, [])

  return (
    <div style={{ perspective: 1200, transformStyle: 'preserve-3d' }}>
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onCardClick?.()
          }
        }}
        onMouseMove={(e) => {
          stateRef.current.isHovered = true
          if (!stateRef.current.isPressed) stateRef.current.targetTZ = 20
          handlePointerMove(e.clientX, e.clientY)
        }}
        onMouseLeave={() => {
          stateRef.current.isHovered = false
          stateRef.current.targetRX = 0
          stateRef.current.targetRY = 0
          stateRef.current.targetTZ = 0
          if (glareRef.current) glareRef.current.style.opacity = '0'
          if (holoRef.current) holoRef.current.style.opacity = '0.35'
        }}
        onMouseDown={() => {
          stateRef.current.isPressed = true
          stateRef.current.targetTZ = -25
        }}
        onMouseUp={() => {
          stateRef.current.isPressed = false
          stateRef.current.targetTZ = stateRef.current.isHovered ? 20 : 0
        }}
        className="relative w-[340px] h-[480px] cursor-pointer will-change-transform select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Sombra 3D */}
        <div
          ref={shadowRef}
          className="absolute inset-[10px] rounded-[36px] bg-[radial-gradient(circle,rgba(56,189,248,0.4)_0%,rgba(0,0,0,0.8)_70%)] blur-[35px] -z-10 opacity-60 transition-opacity duration-300 pointer-events-none"
        />

        {/* Cuerpo principal */}
        <div
          className="absolute inset-0 rounded-[24px] bg-[#0f172a] overflow-hidden border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Fondo */}
          <img
            ref={bgRef}
            src={imageSrc}
            alt="3D Photo"
            className="absolute -inset-[15%] w-[130%] h-[130%] object-cover filter contrast-[1.05] brightness-[0.95]"
          />

          {/* Lámina Holográfica */}
          <div
            ref={holoRef}
            className="absolute inset-0 mix-blend-color-dodge opacity-35 pointer-events-none transition-opacity duration-300"
            style={{
              background: `linear-gradient(var(--holo-angle, 135deg), rgba(255,0,128,0.25) 0%, rgba(0,255,200,0.25) 25%, rgba(255,230,0,0.25) 50%, rgba(150,0,255,0.25) 75%, rgba(255,0,128,0.25) 100%)`,
            }}
          />

          {/* Marco Vidrio */}
          <div className="absolute inset-[12px] rounded-[16px] border border-white/20 bg-gradient-to-br from-white/10 to-white/0 pointer-events-none shadow-lg" />

          {/* Sujeto 3D */}
          <div
            ref={subjectRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[140px] h-[140px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.9)_0%,rgba(99,102,241,0.8)_100%)] flex items-center justify-center shadow-[0_15px_35px_rgba(56,189,248,0.5),inset_0_2px_10px_rgba(255,255,255,0.6)] -translate-y-8 backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                className="w-[70px] h-[70px] fill-none stroke-white stroke-[1.8] stroke-linecap-round stroke-linejoin-round drop-shadow-md"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Contenido */}
          <div
            ref={contentRef}
            className="absolute bottom-0 inset-x-0 p-7 bg-gradient-to-t from-[#070913]/95 via-[#070913]/60 to-transparent pointer-events-none"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/50 color-sky-400 text-xs font-bold uppercase tracking-wider mb-2 text.sky-400">
              {tag}
            </span>
            <h3 className="m-0 text-2xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              {title}
            </h3>
            <p className="m-0 mt-1 text-sm text-slate-400 leading-snug">{subtitle}</p>
          </div>

          {/* Chip flotante */}
          <div
            ref={chipRef}
            className="absolute top-6 right-6 px-3.5 py-2 rounded-xl bg-slate-900/85 border border-white/25 backdrop-blur-md text-xs font-bold text-slate-100 flex items-center gap-1.5 shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span>{badgeText}</span>
          </div>

          {/* Glare */}
          <div
            ref={glareRef}
            className="absolute inset-0 mix-blend-overlay opacity-0 pointer-events-none transition-opacity duration-300"
          />

          {/* Borde neón */}
          <div
            ref={borderGlowRef}
            className="absolute inset-0 rounded-[24px] p-[2px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            style={{
              background: `conic-gradient(from var(--border-angle, 0deg), transparent 0%, #38bdf8 25%, #ec4899 50%, #8b5cf6 75%, transparent 100%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        </div>
      </div>
    </div>
  )
}
