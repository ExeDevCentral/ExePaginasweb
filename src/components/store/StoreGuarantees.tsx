/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CyberRocketLaunch,
  CyberServerUptime,
  CyberRealPropertyShield,
  CyberPaymentCard,
  CyberTechCode,
  CyberChevron,
  CyberSparkleIcon,
} from '@/components/ui/MagnificentIcons'
import { useTranslation } from 'react-i18next'
import { storeAudio } from '../../core/utils/storeAudio'

export const StoreGuarantees: React.FC = () => {
  const { t } = useTranslation()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: t('store.faq1_q'),
      a: t('store.faq1_a'),
      icon: CyberPaymentCard,
    },
    {
      q: t('store.faq2_q'),
      a: t('store.faq2_a'),
      icon: CyberTechCode,
    },
    {
      q: t('store.faq3_q'),
      a: t('store.faq3_a'),
      icon: CyberRocketLaunch,
    },
    {
      q: t('store.faq4_q'),
      a: t('store.faq4_a'),
      icon: CyberRealPropertyShield,
    },
  ]

  const toggleFaq = (index: number) => {
    storeAudio.playToggle()
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <section className="max-w-6xl mx-auto my-16">
      {/* 3 Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-accent-cyan/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <CyberRocketLaunch size={24} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">{t('store.pillar1_title')}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{t('store.pillar1_desc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <CyberServerUptime size={24} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">{t('store.pillar2_title')}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{t('store.pillar2_desc')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-pink-500/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <CyberRealPropertyShield size={24} className="text-pink-600 dark:text-pink-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">{t('store.pillar3_title')}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{t('store.pillar3_desc')}</p>
        </motion.div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-3xl bg-card/80 backdrop-blur-2xl border border-border p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
            <CyberSparkleIcon size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{t('store.faq_heading')}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{t('store.faq_subheading')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            const Icon = faq.icon
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/70 overflow-hidden bg-background/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-foreground text-sm sm:text-base hover:text-accent-cyan transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-accent-cyan shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <CyberChevron
                    isOpen={isOpen}
                    size={16}
                    className={isOpen ? 'text-accent-cyan' : 'text-muted-foreground'}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StoreGuarantees
