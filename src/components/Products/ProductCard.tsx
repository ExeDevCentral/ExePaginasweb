import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ExternalLink,
  CheckCircle,
} from 'lucide-react'
import { useRef } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const Icon = product.icon

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / rect.width - 0.5
    const yPct = mouseY / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full perspective-1000 group"
      variants={{
        hidden: { y: 25, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
    >
      <motion.div
        className="h-full p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border rounded-2xl hover:border-accent-cyan/20 transition-all duration-500 overflow-hidden relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
      >
        {/* Gradient accent on hover */}
        <div
          className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-[0.06] rounded-bl-full transition-opacity duration-700`}
        />
        {/* Top glow line */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${product.color} to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

        {/* Icon */}
        <div className="relative mb-6">
          <motion.div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.color} p-3 shadow-lg group-hover:scale-105 group-hover:shadow-accent-cyan/20 transition-all duration-300`}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon className="h-full w-full text-foreground group-hover:text-white transition-colors duration-300" />
          </motion.div>
          <div className="absolute -bottom-1 left-5 w-10 h-0.5 rounded-full bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/30 to-accent-cyan/0 blur-sm" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 font-montserrat text-foreground group-hover:text-accent-cyan transition-colors duration-300">
          {t(`products.${product.tKey}_titulo`)}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {t(`products.${product.tKey}_desc`)}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {product.features.map((_feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-xs text-muted-foreground"
            >
              <CheckCircle className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
              <span>{t(`products.${product.tKey}_feat_${idx + 1}`)}</span>
            </li>
          ))}
        </ul>

        {/* Gradient bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${product.color} opacity-60`} />
          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-border">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              {t('products.inversion')}
            </p>
            <p className="text-lg font-bold text-accent-cyan">{product.price}</p>
          </div>
          <motion.button
            onClick={onOpenDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg text-sm font-bold shadow-md shadow-accent-cyan/15 hover:shadow-accent-cyan/35 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('products.ver_demo')} <ExternalLink size={13} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
