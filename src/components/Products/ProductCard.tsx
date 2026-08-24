import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  CheckCircle,
  Clock,
  Calculator,
  Plus,
  ArrowRight,
  Coffee,
  MessageCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Product = {
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  price: string
  color: string
  demoLink: string
  tKey: string
}

const ROI_BADGES: Record<string, { label: string; color: string }> = {
  peluqueria: {
    label: '💇 Agenda Llena 24/7',
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  panaderia: {
    label: '🥐 +40% Ventas Mostrador',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  ropa: {
    label: '👗 Control de Talles & Stock',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  padel: {
    label: '⚡ +45% Ocupación Canchas',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
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

  // Micro-Widget Local States
  const [stylist, setStylist] = useState('Sofía (Estilista)')
  const hairService = 'Corte & Peinado'

  const [bakeryItems, setBakeryItems] = useState(6)

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M')
  const [selectedColor, setSelectedColor] = useState('Negro')

  const [selectedSlot, setSelectedSlot] = useState('19:00 Hs')

  // Calculator Toggle State
  const [showCalculator, setShowCalculator] = useState(false)
  const [sucursales, setSucursales] = useState(1)
  const [includeWhatsAppBot, setIncludeWhatsAppBot] = useState(true)

  const roi = ROI_BADGES[product.tKey] || {
    label: '✨ Máximo Rendimiento',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  }

  const match = /(\d+)/.exec(product.price)
  const basePriceNum = match ? Number.parseInt(match[1], 10) : 300
  const estimatedTotal = basePriceNum * sucursales + (includeWhatsAppBot ? 80 : 0)

  return (
    <div className="relative w-full group">
      <div className="relative">
        {/* Sombra Glow adaptada al color */}
        <div className="absolute -inset-4 rounded-[28px] bg-black/40 dark:bg-black/70 blur-[25px] -z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

        {/* Cuerpo Principal de la Tarjeta */}
        <div className="h-full p-4.5 sm:p-7 md:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#171729] dark:via-[#111122] dark:to-[#0c0c15] backdrop-blur-xl border border-border rounded-2xl transition-all duration-300 relative shadow-xl overflow-hidden dark:border-white/10 dark:shadow-[0_0_60px_rgba(14,165,233,0.07)]">
          {/* Línea de acento superior */}
          <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${product.color}`} />

          {/* Brillo superior */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

          {/* Filo holográfico */}
          <div
            className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 dark:opacity-30 dark:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 45deg, transparent, rgba(236,72,153,0.8), rgba(56,189,248,0.8), transparent 40%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Top Bar with Icon & ROI Badge */}
          <div className="flex items-start justify-between mb-5 sm:mb-6">
            <div className="relative">
              <div
                className={`absolute -inset-3 bg-gradient-to-br ${product.color} opacity-30 blur-xl rounded-full group-hover:opacity-60 transition-opacity duration-300`}
              />
              <motion.div
                className={`relative inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${product.color} p-2.5 sm:p-3 shadow-lg group-hover:scale-105 transition-all duration-300 ring-1 ring-white/20`}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon className="h-full w-full text-white transition-colors duration-300" />
              </motion.div>
            </div>

            {/* ROI Badge */}
            <span
              className={`text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${roi.color}`}
            >
              {t(`products.${product.tKey}_roi`, roi.label)}
            </span>
          </div>

          {/* Título y Descripción */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 font-montserrat text-foreground group-hover:text-accent-cyan transition-colors duration-300">
              {t(`products.${product.tKey}_titulo`)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 sm:mb-6 leading-relaxed">
              {t(`products.${product.tKey}_desc`)}
            </p>

            {/* INTERACTIVE MICRO-WIDGET ADAPTED PER RUBRO */}
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-xl border border-white/10 bg-card/60 backdrop-blur-md shadow-inner">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent-cyan mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                {t('products.simulador_en_vivo', 'Simulador del Rubro en Vivo')}
              </p>

              {/* Peluquería / Beauty Widget */}
              {product.tKey === 'peluqueria' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-foreground font-medium">
                    <span>Seleccionar Estilista:</span>
                    <span className="text-pink-400 font-bold">✨ Disponible</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Sofía (Estilista)', 'Lucas (Barbero)'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setStylist(s)
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          stylist === s
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                            : 'bg-muted/40 border-border text-muted-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 text-muted-foreground">
                    <span>
                      Servicio: <strong className="text-foreground">{hairService}</strong>
                    </span>
                    <span className="text-pink-400 font-bold font-mono">$4.500 ARS</span>
                  </div>
                </div>
              )}

              {/* Panadería / Bakery Widget */}
              {product.tKey === 'panaderia' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-foreground font-medium">
                    <span>🥖 Tanda Recién Horneada:</span>
                    <span className="text-amber-400 font-bold font-mono">17:30 Hs (Listo)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-muted/30 p-2 rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      {bakeryItems} Facturas / Medialunas
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setBakeryItems((prev) => (prev >= 24 ? 6 : prev + 6))
                      }}
                      className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Sumar Docena
                    </button>
                  </div>
                </div>
              )}

              {/* Local de Ropa / Fashion Widget */}
              {product.tKey === 'ropa' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-foreground font-medium">
                    <span>Campera Eco-Cuero Urban:</span>
                    <span className="text-emerald-400 font-bold font-mono">Stock: 14 un.</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSize(size)
                          }}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all border ${
                            selectedSize === size
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-muted/40 border-border text-muted-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {['Negro', 'Beige'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedColor(col)
                          }}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                            selectedColor === col
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-muted/40 border-border text-muted-foreground'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pádel Widget */}
              {product.tKey === 'padel' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-foreground font-medium">
                    <span>Turno Cancha 1 (Sintético Blindex):</span>
                    <span className="text-cyan-400 font-bold">Disponible</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['17:30 Hs', '19:00 Hs', '20:30 Hs'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSlot(slot)
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          selectedSlot === slot
                            ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                            : 'bg-muted/40 border-border text-muted-foreground'
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feature Bullet points */}
            <ul className="space-y-2.5 mb-6">
              {product.features.map((_feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>{t(`products.${product.tKey}_feat_${idx + 1}`)}</span>
                </li>
              ))}
            </ul>

            {/* Instant Custom Calculator Toggle */}
            <AnimatePresence>
              {showCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden rounded-xl border border-accent-cyan/40 bg-accent-cyan/10 p-4 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-accent-cyan">
                    <span className="flex items-center gap-1.5">
                      <Calculator className="w-4 h-4" /> Cotizador para{' '}
                      {t(`products.${product.tKey}_titulo`)}
                    </span>
                    <span>Estimado: ${estimatedTotal} USD</span>
                  </div>
                  <div className="space-y-2 text-xs text-foreground">
                    <div className="flex items-center justify-between">
                      <span>Sucursales o Puntos de Atencion:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSucursales((s) => Math.max(1, s - 1))}
                          className="px-2 py-0.5 rounded bg-muted border border-border font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold w-4 text-center">{sucursales}</span>
                        <button
                          type="button"
                          onClick={() => setSucursales((s) => s + 1)}
                          className="px-2 py-0.5 rounded bg-muted border border-border font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={includeWhatsAppBot}
                        onChange={(e) => setIncludeWhatsAppBot(e.target.checked)}
                        className="rounded border-border text-accent-cyan focus:ring-accent-cyan"
                      />
                      <span>Incluir Notificaciones por WhatsApp automatizadas (+$80 USD)</span>
                    </label>
                  </div>
                  <a
                    href={`https://wa.me/5493416874786?text=${encodeURIComponent(
                      `Hola ExePaginasWeb! Quiero consultar para mi rubro por ${t(`products.${product.tKey}_titulo`)} para ${sucursales} sucursal(es). Presupuesto estimado: $${estimatedTotal} USD.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950 stroke-emerald-500" />
                    Enviar Consulta Directa por WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-border dark:border-white/10 gap-2">
              <div>
                <p className="text-[10px] text-[#6b6152] dark:text-slate-400/90 uppercase tracking-wider mb-0.5 font-bold">
                  {t('products.inversion')}
                </p>
                <p className="text-lg font-extrabold text-accent-cyan">{product.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCalculator((prev) => !prev)
                  }}
                  className="p-2.5 rounded-xl border border-border bg-card/60 hover:bg-accent-cyan/10 text-muted-foreground hover:text-accent-cyan transition-colors"
                  title="Calcular presupuesto a medida"
                >
                  <Calculator className="w-4 h-4" />
                </button>

                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDemo()
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${product.color} text-white text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t('products.ver_demo')} <ExternalLink size={13} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
