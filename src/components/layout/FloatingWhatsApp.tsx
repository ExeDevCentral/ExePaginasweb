/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Botón flotante directo de WhatsApp (Fricción Cero)
 */
'use client'

import { motion } from 'framer-motion'
import { getWhatsAppUrl } from '../../core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

// Ícono SVG oficial de WhatsApp para máxima nitidez y reconocimiento instantáneo
const WhatsAppIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.484 2 12.018c0 1.907.534 3.69 1.464 5.215L2 22l4.914-1.424A9.972 9.972 0 0012.031 22c5.536 0 10.031-4.484 10.031-10.018C22.062 6.484 17.567 2 12.031 2zm0 18.286c-1.636 0-3.18-.45-4.524-1.233l-.324-.19-2.923.848.868-2.846-.21-.334a8.23 8.23 0 01-1.282-4.513c0-4.568 3.717-8.284 8.29-8.284 4.572 0 8.289 3.716 8.289 8.284 0 4.569-3.717 8.286-8.29 8.286zm4.545-6.208c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.124-1.052-.388-2.003-1.237-.741-.66-1.241-1.476-1.386-1.725-.145-.249-.015-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.125-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.756 2.68 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.071 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.291z" />
  </svg>
)

export default function FloatingWhatsApp() {
  const customMessage = 'Hola Exequiel, vi tu web y quiero consultar por una página para mi negocio'
  const whatsappLink = getWhatsAppUrl(customMessage)

  const handleClick = () => {
    trackEvent('contact_whatsapp_clicked', {
      source: 'floating_button',
      message: customMessage,
    })
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center group select-none"
    >
      {/* Píldora de texto en desktop */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Hablar directo con Exequiel por WhatsApp"
        className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-full bg-slate-900/90 dark:bg-slate-950/90 text-white border border-emerald-500/30 shadow-xl backdrop-blur-md hover:border-emerald-400 hover:bg-slate-900 transition-all duration-300"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
        <span className="text-xs font-semibold tracking-tight text-white">Hablar con Exequiel</span>
        <span className="text-[10px] text-emerald-400 font-mono font-medium ml-0.5">WhatsApp</span>
      </a>

      {/* Botón Circular Verde WhatsApp (Fricción Cero) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Contactar a Exequiel por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/80 transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
      >
        {/* Anillo de pulso radar */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35 pointer-events-none" />

        <WhatsAppIcon className="w-8 h-8 text-white drop-shadow-md group-hover:scale-105 transition-transform duration-300" />

        {/* Punto de estado disponible en móvil */}
        <span className="sm:hidden absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-300 border-2 border-slate-950" />
      </a>
    </motion.div>
  )
}
