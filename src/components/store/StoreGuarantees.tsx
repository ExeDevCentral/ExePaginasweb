'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CreditCard,
  Code2,
} from 'lucide-react'
import { storeAudio } from '../../core/utils/storeAudio'

interface FAQItem {
  q: string
  a: string
  icon: React.ElementType
}

const FAQS: FAQItem[] = [
  {
    q: '¿Cómo funciona la facturación y qué métodos de pago aceptan?',
    a: 'Para Argentina podés abonar mensualmente vía Transferencia Bancaria Directa o Mercado Pago con Factura Fiscal A o B. Para clientes internacionales aceptamos PayPal o transferencia internacional en USD.',
    icon: CreditCard,
  },
  {
    q: '¿Qué sucede si necesito cambios o nuevas funcionalidades?',
    a: 'El Abono Premium incluye 2 horas mensuales de desarrollo de nuevas funciones. Para los planes Básico y Avanzado, contás con un 20% de descuento preferencial en horas de ingeniería de software.',
    icon: Code2,
  },
  {
    q: '¿Cómo es el proceso de migración si ya tengo mi web en otro hosting?',
    a: 'Nosotros nos encargamos del 100% del traslado (código, base de datos, correos corporativos y registros DNS) de forma bonificada, garantizando 0 tiempo de inactividad durante la migración.',
    icon: Rocket,
  },
  {
    q: '¿Tengo algún contrato de permanencia obligatoria?',
    a: 'No, ninguno. Podés cancelar, pausar o cambiar de nivel de abono en cualquier momento desde tu panel de cliente o avisándonos con un mensaje por WhatsApp sin penalizaciones.',
    icon: FileCheck,
  },
]

export const StoreGuarantees: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

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
            <Rocket className="w-6 h-6 text-cyan-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">Migración 100% Bonificada</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trasladamos tu sitio, bases de datos y DNS sin interrumpir tus ventas ni un solo minuto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">Uptime Garantizado 99.98%</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Infraestructura Edge distribuida globalmente con redundancia y monitoreo proactivo 24/7.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:border-pink-500/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <RefreshCw className="w-6 h-6 text-pink-400" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">Sin Permanencias</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Libertad absoluta. Podés pausar, mejorar o dar de baja tu abono cuando quieras con 1
            clic.
          </p>
        </motion.div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-3xl bg-card/80 backdrop-blur-2xl border border-border p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Preguntas Frecuentes sobre Abonos
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Todo lo que necesitás saber sobre la contratación y soporte
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
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
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-accent-cyan shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
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
