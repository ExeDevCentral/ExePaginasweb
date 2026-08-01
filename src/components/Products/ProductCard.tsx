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

  return (
    <div className="relative w-full group cursor-pointer" onClick={onOpenDemo}>
      <div className="relative">
        {/* Sombra */}
        <div className="absolute -inset-4 rounded-[28px] bg-black/40 dark:bg-black/70 blur-[25px] -z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

        {/* Cuerpo Principal de la Tarjeta */}
        <div className="h-full p-8 bg-gradient-to-br from-[#fbf2e0] to-[#f2e2c7] dark:from-[#171729] dark:via-[#111122] dark:to-[#0c0c15] backdrop-blur-xl border border-border rounded-2xl transition-all duration-300 relative shadow-xl overflow-hidden dark:border-white/10 dark:shadow-[0_0_60px_rgba(14,165,233,0.07)]">
          {/* Línea de acento superior */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent dark:via-accent-cyan/60" />

          {/* Brillo superior en dark */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent dark:from-accent-cyan/10 dark:to-transparent pointer-events-none" />

          {/* Filo holográfico que recorre el borde */}
          <div
            className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 dark:opacity-30 dark:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 45deg, transparent, rgba(56,189,248,0.8), rgba(236,72,153,0.8), transparent 40%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Marco flotante intermedio */}
          <div className="absolute inset-0 rounded-2xl border border-white/15 dark:border-white/10 pointer-events-none" />

          {/* Resplandor de color flotante en la esquina */}
          <div
            className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-[0.12] dark:opacity-20 dark:group-hover:opacity-30 rounded-bl-full transition-opacity duration-500 pointer-events-none blur-2xl`}
          />

          {/* Resplandor inferior en dark */}
          <div
            className={`absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr ${product.color} opacity-0 dark:opacity-15 dark:group-hover:opacity-30 rounded-tr-full transition-opacity duration-500 pointer-events-none blur-3xl`}
          />

          {/* Icono de producto */}
          <div className="relative mb-6">
            <div
              className={`absolute -inset-3 bg-gradient-to-br ${product.color} opacity-25 blur-xl rounded-full group-hover:opacity-50 transition-opacity duration-300`}
            />
            <motion.div
              className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.color} p-3 shadow-lg group-hover:scale-105 group-hover:shadow-accent-cyan/30 transition-all duration-300 dark:ring-1 dark:ring-white/20`}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon className="h-full w-full text-white transition-colors duration-300" />
            </motion.div>
            <div className="absolute -bottom-1 left-5 w-10 h-0.5 rounded-full bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/40 to-accent-cyan/0 blur-sm" />
          </div>

          {/* Título y Descripción */}
          <div>
            <h3 className="text-xl font-bold mb-3 font-montserrat text-foreground group-hover:text-accent-cyan transition-colors duration-300">
              {t(`products.${product.tKey}_titulo`)}
            </h3>
            <p className="text-sm text-[#5a5145] dark:text-slate-300/90 mb-6 leading-relaxed">
              {t(`products.${product.tKey}_desc`)}
            </p>

            <ul className="space-y-3 mb-8">
              {product.features.map((_feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs text-[#5a5145] dark:text-slate-300/80 font-medium"
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

            <div className="flex items-center justify-between pt-5 border-t border-border dark:border-white/10">
              <div>
                <p className="text-[10px] text-[#6b6152] dark:text-slate-400/90 uppercase tracking-wider mb-0.5 font-bold">
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
