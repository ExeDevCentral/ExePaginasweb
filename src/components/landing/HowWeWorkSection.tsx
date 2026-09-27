/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Sección "Cómo trabajamos" — Proceso claro, tarjetas de alto contraste y accesos directos
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PhoneCall,
  LayoutDashboard,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Video,
  Calculator,
} from 'lucide-react'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

const STEPS = [
  {
    step: '01',
    badge: '15 min · Sin costo',
    title: 'Charla de 15 minutos',
    subtitle: 'Entendemos qué vende tu negocio',
    desc: 'Sin tecnicismos complicados. Nos contás qué hacés, quién es tu cliente y qué metas querés alcanzar para diseñar la solución exacta.',
    icon: PhoneCall,
    color: 'cyan' as const,
    points: ['Diagnóstico de tu negocio', 'Propuesta clara sin vueltas', 'Cero compromiso'],
  },
  {
    step: '02',
    badge: 'Validación en vivo',
    title: 'Diseño y validación',
    subtitle: 'Te mostramos el avance antes de publicar',
    desc: 'Construimos la estructura pensada en ventas. Revisamos juntos cada detalle para que des tu visto bueno con total tranquilidad.',
    icon: LayoutDashboard,
    color: 'fuchsia' as const,
    points: ['Avances visibles paso a paso', 'Ajustes a tu gusto', 'Sin sorpresas al final'],
  },
  {
    step: '03',
    badge: '100% Tuyo',
    title: 'Lanzamiento y capacitación',
    subtitle: 'Tu web online lista para facturar',
    desc: 'Publicamos tu sitio en alta velocidad y te enseñamos a gestionar tus consultas, pedidos y precios directo desde tu celular.',
    icon: Rocket,
    color: 'emerald' as const,
    points: ['Puesta online rápida', 'Video tutorial explicativo', 'Soporte post-lanzamiento'],
  },
]

export default function HowWeWorkSection() {
  const whatsappUrl = getWhatsAppUrl(
    'Hola Exequiel, me gustaría coordinar una charla de 15 minutos para consultar por mi proyecto web'
  )
  const auditWhatsAppUrl = getWhatsAppUrl(
    'Hola Exequiel, quisiera pedir la auditoría gratuita de 5 minutos en video para analizar mi web o Instagram.'
  )

  const handleCtaClick = () => {
    trackEvent('contact_whatsapp_clicked', {
      source: 'how_we_work_cta',
      message: 'Charla 15 min',
    })
  }

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 border-t border-slate-200/80 dark:border-white/10">
      {/* Encabezado */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Proceso Simple & Transparente</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
          Cómo trabajamos:{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 via-sky-400 to-fuchsia-500">
            3 pasos sin vueltas
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Del primer contacto a tu web funcionando y captando clientes.
        </p>
      </div>

      {/* Grid de los 3 pasos con BORDES NÍTIDOS DE ALTO CONTRASTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {STEPS.map((item, idx) => {
          const Icon = item.icon
          const colorStyles =
            item.color === 'cyan'
              ? {
                  border: 'hover:border-cyan-400 dark:hover:border-cyan-400',
                  badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
                  iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
                  accent: 'text-cyan-600 dark:text-cyan-400',
                }
              : item.color === 'fuchsia'
                ? {
                    border: 'hover:border-fuchsia-400 dark:hover:border-fuchsia-400',
                    badge:
                      'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30',
                    iconBg: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400',
                    accent: 'text-fuchsia-600 dark:text-fuchsia-400',
                  }
                : {
                    border: 'hover:border-emerald-400 dark:hover:border-emerald-400',
                    badge:
                      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                    accent: 'text-emerald-600 dark:text-emerald-400',
                  }

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`group relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c0f1d] border-2 border-slate-300/80 dark:border-white/20 shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.7)] ${colorStyles.border} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                {/* Paso número y Badge con alto contraste */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="font-mono text-3xl font-black text-slate-400 dark:text-white/30 select-none">
                    {item.step}
                  </span>
                  <span
                    className={`inline-flex items-center text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${colorStyles.badge}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Ícono */}
                <div
                  className={`w-11 h-11 rounded-2xl ${colorStyles.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Título y subtítulo */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mt-1 ${colorStyles.accent}`}
                >
                  {item.subtitle}
                </p>

                {/* Descripción */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                {/* Puntos clave */}
                <ul className="mt-5 space-y-2 border-t border-slate-200 dark:border-white/10 pt-4">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* BARRA COMPACTA: AUDITORÍA GRATUITA + COTIZADOR EN 30S (Sin sobrecargar la página) */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Auditoría en video */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/20 border-2 border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 block">
                100% Gratuita · 5 minutos
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Auditoría en video de tu web o Instagram
              </h4>
            </div>
          </div>
          <a
            href={auditWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('contact_whatsapp_clicked', { source: 'how_we_work_audit_bar' })
            }
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Pedir video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Opción 2: Cotizador en 30 segundos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-fuchsia-50/80 dark:bg-fuchsia-950/20 border-2 border-fuchsia-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-fuchsia-600 dark:text-fuchsia-400 block">
                Cotización online inmediata
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Calculá tu presupuesto en 30 segundos
              </h4>
            </div>
          </div>
          <Link
            href="/cotizador"
            onClick={() =>
              trackEvent('cotizador_plan_selected', { source: 'how_we_work_cotizador_bar' })
            }
            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Cotizar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Botón principal centrado */}
      <div className="mt-8 text-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-102 active:scale-95 cursor-pointer"
        >
          <span>Coordinar mi charla de 15 minutos</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
