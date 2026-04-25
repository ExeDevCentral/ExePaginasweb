import { motion } from 'framer-motion'
import { Gift, Sparkles, Ticket, X } from 'lucide-react'
import { useState } from 'react'

const promoOptions = [
  { percent: 10, code: 'EXEWEB10' },
  { percent: 15, code: 'EXEWEB15' },
  { percent: 20, code: 'EXEWEB20' },
  { percent: 25, code: 'EXEWEB25' },
]

const GiftPromo = () => {
  const [offer, setOffer] = useState<{ percent: number; code: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const claimOffer = () => {
    const randomOffer = promoOptions[Math.floor(Math.random() * promoOptions.length)]
    setOffer(randomOffer)
    setCopied(false)
    setShowModal(true)
  }

  const copyCode = async () => {
    if (!offer) return
    try {
      await navigator.clipboard.writeText(offer.code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const closeModal = () => setShowModal(false)

  return (
    <motion.div
      className="pointer-events-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.85)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-cyan to-accent-magenta text-white shadow-lg shadow-accent-cyan/20">
          <Gift className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Paquete regalo</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Promos aleatorias</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Haz clic y descubre hasta <span className="font-semibold text-white">25% de descuento</span> en tu primera web.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/95 p-4 text-sm text-slate-300">
        {offer ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">¡Oferta desbloqueada!</p>
                <p className="mt-2 text-2xl font-bold text-white">{offer.percent}% OFF</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-950/90 px-4 py-3 text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Código</p>
              <p className="mt-1 text-lg font-semibold">{offer.code}</p>
            </div>
            <button
              onClick={copyCode}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              <Ticket className="h-4 w-4" />
              {copied ? 'Código copiado' : 'Copiar código'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent-cyan/50 hover:bg-white/10"
            >
              Ver regalo completo
            </button>
          </div>
        ) : (
          <button
            onClick={claimOffer}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta px-4 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            Abrir regalo
          </button>
        )}
      </div>

      {showModal && offer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <motion.div
            className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Regalo ampliado</p>
                <h3 className="mt-2 text-3xl font-bold text-white">Tu promo exclusiva</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Usa este descuento en tu primera web con ExepaginasWeb. Copia el código y aprovecha el precio especial.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-6 rounded-[1.75rem] bg-slate-900/95 p-6">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Descuento desbloqueado</p>
                  <p className="mt-3 text-5xl font-black text-white">{offer.percent}%</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-cyan to-accent-magenta text-white">
                  <Sparkles className="h-7 w-7" />
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/90 p-5 text-slate-200">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Código especial</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm shadow-slate-950/30">
                    {offer.code}
                  </span>
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                  >
                    <Ticket className="h-4 w-4" />
                    {copied ? 'Código copiado' : 'Copiar código'}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 p-5 text-slate-300">
                <p className="text-sm leading-6">
                  Al aplicar este código, tu primera página recibirá un descuento aleatorio de hasta 25% en diseño, animaciones y optimización. Ideal para emprendedores y marcas que quieren salida rápida con estilo premium.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default GiftPromo
