import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Product = {
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  price: string
  color: string
  demoLink: string
  tKey: string
}

export default function ProductCard({
  product,
  onOpenDemo,
}: {
  product: Product
  onOpenDemo: () => void
}) {
  const { t } = useTranslation()
  const Icon = product.icon

  const cardRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const edgeRef = useRef<HTMLDivElement>(null)

  const [isHovered, setIsHovered] = useState(false)

  const stateRef = useRef({
    targetRX: 0,
    targetRY: 0,
    curRX: 0,
    curRY: 0,
  })

  useEffect(() => {
    let animId: number
    const damping = 0.12

    const renderLoop = () => {
      const s = stateRef.current
      s.curRX += (s.targetRX - s.curRX) * damping
      s.curRY += (s.targetRY - s.curRY) * damping

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${s.curRX.toFixed(2)}deg) rotateY(${s.curRY.toFixed(2)}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`
      }

      if (shadowRef.current) {
        shadowRef.current.style.transform = `translateZ(-80px) translateX(${(s.curRY * 2.2).toFixed(2)}px) translateY(${(-s.curRX * 2.2).toFixed(2)}px)`
      }

      if (edgeRef.current) {
        edgeRef.current.style.setProperty('--angle', `${s.curRY * 6 + 45}deg`)
      }

      animId = requestAnimationFrame(renderLoop)
    }

    renderLoop()
    return () => cancelAnimationFrame(animId)
  }, [isHovered])

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    stateRef.current.targetRX = -((y - centerY) / centerY) * 14
    stateRef.current.targetRY = ((x - centerX) / centerX) * 14

    if (glareRef.current) {
      const posX = (x / rect.width) * 100
      const posY = (y / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255,255,255,0.35) 0%, transparent 55%)`
      glareRef.current.style.opacity = '1'
    }
  }, [])

  return (
    <div
      className="relative w-full group cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={onOpenDemo}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        stateRef.current.targetRX = 0
        stateRef.current.targetRY = 0
        if (glareRef.current) glareRef.current.style.opacity = '0'
      }}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
        }
      }}
    >
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        {/* Sombra 3D dinámica separada */}
        <div
          ref={shadowRef}
          className="absolute -inset-4 rounded-[28px] bg-black/40 dark:bg-black/70 blur-[25px] -z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"
          style={{ transform: 'translateZ(-80px)' }}
        />

        {/* Cuerpo Principal de la Tarjeta 3D */}
        <div
          ref={cardRef}
          className="h-full p-8 bg-card/90 dark:bg-card/70 backdrop-blur-xl border border-border rounded-2xl transition-all duration-300 overflow-hidden relative shadow-xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Filo holográfico que recorre el borde */}
          <div
            ref={edgeRef}
            className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `conic-gradient(from var(--angle, 0deg), transparent, rgba(56,189,248,0.8), rgba(236,72,153,0.8), transparent 40%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Marco flotante intermedio */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/15 dark:border-white/10 pointer-events-none"
            style={{ transform: 'translateZ(20px)' }}
          />

          {/* Brillo especular dinámico */}
          <div
            ref={glareRef}
            className="absolute inset-0 opacity-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{ transform: 'translateZ(70px)' }}
          />

          {/* Resplandor de color flotante en la esquina */}
          <div
            className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-[0.12] rounded-bl-full transition-opacity duration-500 pointer-events-none`}
            style={{ transform: 'translateZ(10px)' }}
          />

          {/* Icono de producto (Capa 3D: Z=40px) */}
          <div className="relative mb-6" style={{ transform: 'translateZ(40px)' }}>
            <motion.div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.color} p-3 shadow-lg group-hover:scale-105 group-hover:shadow-accent-cyan/30 transition-all duration-300`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon className="h-full w-full text-foreground group-hover:text-white transition-colors duration-300" />
            </motion.div>
            <div className="absolute -bottom-1 left-5 w-10 h-0.5 rounded-full bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/40 to-accent-cyan/0 blur-sm" />
          </div>

          {/* Título y Descripción (Capa 3D: Z=60px) */}
          <div style={{ transform: 'translateZ(60px)' }}>
            <h3 className="text-xl font-bold mb-3 font-montserrat text-foreground group-hover:text-accent-cyan transition-colors duration-300">
              {t(`products.${product.tKey}_titulo`)}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t(`products.${product.tKey}_desc`)}
            </p>

            <ul className="space-y-3 mb-8">
              {product.features.map((_feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs text-muted-foreground font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>{t(`products.${product.tKey}_feat_${idx + 1}`)}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6 flex items-center gap-3">
              <div
                className={`h-1 flex-1 rounded-full bg-gradient-to-r ${product.color} opacity-70`}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-border">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-bold">
                  {t('products.inversion')}
                </p>
                <p className="text-lg font-extrabold text-accent-cyan">{product.price}</p>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenDemo()
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg text-sm font-bold shadow-md shadow-accent-cyan/15 hover:shadow-accent-cyan/35 transition-all cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('products.ver_demo')} <ExternalLink size={13} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
