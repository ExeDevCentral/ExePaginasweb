import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '../../core/utils/whatsappUtils'

export default function FloatingWhatsApp() {
  const whatsappLink = getWhatsAppUrl('¡Hola ExePaginasWeb! Quiero hacer una consulta.')

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      {/* Tooltip */}
      <span className="mr-3 hidden sm:inline-block px-3 py-1.5 rounded-xl bg-card border border-border text-foreground text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        ¡Hablemos por WhatsApp! ⚡
      </span>

      {/* Button Link */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />

        <MessageCircle className="w-7 h-7 fill-slate-950 stroke-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </motion.div>
  )
}
