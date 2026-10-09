/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Sección "Cómo trabajamos" — Protocolo de desarrollo técnico, láminas de especificación y accesos directos
 */
'use client'

import React from 'react'
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
import { CyberKineticArrowIcon, CyberPitchRadarIcon } from '@/components/ui/MagnificentIcons'
import HudButton from '@/components/HudButton'
import LiveSystemLauncherButton from '@/components/ui/LiveSystemLauncherButton'

const STEPS = [
  {
    step: '01',
    phase: 'FASE 01 / 03',
    badge: '15 MIN · DIAGNÓSTICO',
    title: 'Charla técnica de 15 minutos',
    subtitle: 'Relevamiento del modelo de negocio',
    desc: 'Sin tecnicismos innecesarios. Analizamos tu oferta, perfil de cliente y objetivos de conversión para proyectar la arquitectura exacta de software.',
    icon: PhoneCall,
    tone: 'brand' as const,
    points: [
      'Diagnóstico de tu negocio',
      'Propuesta de arquitectura clara',
      'Cero compromiso inicial',
    ],
  },
  {
    step: '02',
    phase: 'FASE 02 / 03',
    badge: 'VALIDACIÓN · PROTOTIPO',
    title: 'Diseño e ingeniería de interfaz',
    subtitle: 'Revisión interactiva antes de desplegar',
    desc: 'Construimos la estructura optimizada para ventas y performance. Inspeccionamos cada módulo y flujo juntos para que apruebes con total tranquilidad.',
    icon: LayoutDashboard,
    tone: 'signal' as const,
    points: [
      'Entregas iterativas visibles',
      'Ajustes guiados de precisión',
      'Sin sorpresas en entrega',
    ],
  },
  {
    step: '03',
    phase: 'FASE 03 / 03',
    badge: 'PRODUCCIÓN · 100% TUYO',
    title: 'Lanzamiento y transferencia',
    subtitle: 'Infraestructura online lista para facturar',
    desc: 'Desplegamos tu sitio con métricas Core Web Vitals optimizadas. Te entregamos el acceso total y te capacitamos para operar cobros y pedidos.',
    icon: Rocket,
    tone: 'brand' as const,
    points: [
      'Puesta en línea de alta velocidad',
      'Video instructivo personalizado',
      'Soporte de arquitectura post-lanzamiento',
    ],
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
    <section
      id="proceso"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24 border-t border-slate-200/80 dark:border-white/10"
    >
      {/* Encabezado Editorial / Plano */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand/10 border border-brand/25 text-brand dark:text-emerald-400 font-mono text-[11px] uppercase tracking-widest font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-emerald-400 animate-pulse" />
          <span>FIG. 01 — PROTOCOLO DE DESARROLLO // 2025</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight font-display">
          Cómo construimos:{' '}
          <span className="font-serif italic font-normal text-brand dark:text-emerald-400">
            3 fases sin fricción
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Del primer relevamiento de necesidades al sistema en producción captando operaciones
          comerciales.
        </p>
      </div>

      {/* Grid de las 3 fases — Láminas Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {STEPS.map((item, idx) => {
          const Icon = item.icon
          const isSignal = item.tone === 'signal'

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative rounded-sm p-6 sm:p-7 bg-white dark:bg-[#0c0f1d] border border-slate-300/90 dark:border-white/10 hover:border-brand/60 dark:hover:border-emerald-500/60 shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Marcas de esquina técnicas (+) */}
              <span className="absolute top-1.5 left-1.5 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none pointer-events-none">
                +
              </span>
              <span className="absolute top-1.5 right-1.5 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none pointer-events-none">
                +
              </span>
              <span className="absolute bottom-1.5 left-1.5 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none pointer-events-none">
                +
              </span>
              <span className="absolute bottom-1.5 right-1.5 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none pointer-events-none">
                +
              </span>

              <div>
                {/* Cabecera técnica de lámina: Fase + Badge */}
                <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-black text-slate-400 dark:text-white/30 group-hover:text-brand dark:group-hover:text-emerald-400 transition-colors select-none">
                      {item.step}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40">
                      {item.phase}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-sm border ${
                      isSignal
                        ? 'bg-signal/10 text-signal border-signal/30'
                        : 'bg-brand/10 text-brand dark:text-emerald-300 border-brand/30 dark:border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Ícono de cota */}
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 border transition-transform duration-300 group-hover:scale-105 ${
                    isSignal
                      ? 'bg-signal/10 border-signal/25 text-signal'
                      : 'bg-brand/10 border-brand/25 text-brand dark:text-emerald-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Título y subtítulo */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p
                  className={`text-[11px] font-mono uppercase tracking-wider mt-1 ${
                    isSignal ? 'text-signal' : 'text-brand dark:text-emerald-400'
                  }`}
                >
                  {item.subtitle}
                </p>

                {/* Descripción */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                {/* Especificaciones clave */}
                <ul className="mt-5 space-y-2 border-t border-slate-200 dark:border-white/10 pt-4">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand dark:text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón directo poco convencional en Fase 03 */}
                {item.step === '03' && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
                    <LiveSystemLauncherButton
                      label="PROBAR PÁDEL EN VIVO"
                      sublabel="SISTEMA ENTREGADO"
                      href="https://sportmanager-playhub.vercel.app"
                      icon={<CyberPitchRadarIcon size={16} />}
                      color="cyan"
                      compact
                      className="w-full justify-between"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* MÓDULOS DE ACCESO RÁPIDO — ESTÉTICA TÉCNICA (1px border, 4px radio) */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Auditoría en video */}
        <div className="relative p-5 rounded-sm bg-white dark:bg-[#0c0f1d] border border-slate-300 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-brand/10 border border-brand/25 text-brand dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand dark:text-emerald-400 block">
                AUDITORÍA DE PRECISIÓN · 5 MINUTOS
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Diagnóstico en video de tu web o perfil
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
            className="px-3.5 py-2 rounded-sm bg-brand hover:bg-brand/90 text-white font-mono font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Pedir video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Opción 2: Cotizador en 30 segundos */}
        <div className="relative p-5 rounded-sm bg-white dark:bg-[#0c0f1d] border border-slate-300 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-signal/10 border border-signal/25 text-signal flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-signal block">
                COTIZACIÓN PARAMÉTRICA INMEDIATA
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Calculá tu inversión en 30 segundos
              </h4>
            </div>
          </div>
          <HudButton
            label="Cotizar"
            href="/cotizador"
            variant="secondary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() =>
              trackEvent('cotizador_plan_selected', { source: 'how_we_work_cotizador_bar' })
            }
          />
        </div>
      </div>

      {/* Botón principal centrado (HUD Chaflanado) */}
      <div className="mt-10 text-center flex justify-center">
        <HudButton
          label="Coordinar charla de 15 minutos"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          icon={<CyberKineticArrowIcon size={15} />}
          onClick={handleCtaClick}
        />
      </div>
    </section>
  )
}
