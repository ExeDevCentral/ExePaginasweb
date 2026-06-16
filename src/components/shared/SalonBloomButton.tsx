import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SalonBloomButtonProps {
  href?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

export const SalonBloomButton: React.FC<SalonBloomButtonProps> = ({ href, onClick }) => {
  const { t } = useTranslation()
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative group p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-indigo-500 to-accent-magenta animate-spin-slow opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative px-8 py-4 bg-background/90 backdrop-blur-xl rounded-2xl flex items-center gap-3">
        <span className="text-foreground font-montserrat font-bold tracking-wider text-sm">
          {t('hero.cta_demo')}
        </span>

        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-accent-cyan group-hover:stroke-white transition-colors"
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <path
            d="M5 12h14m-7-7l7 7-7 7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-foreground transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.a>
  )
}

export default SalonBloomButton
