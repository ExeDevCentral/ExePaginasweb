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
    tone: 'emerald' as const,
    laser: 'via-emerald-500/90 dark:via-emerald-400',
    border:
      'border-emerald-500/35 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-400',
    hoverShadow:
      'hover:shadow-[0_24px_50px_-12px_rgba(16,185,129,0.25),0_0_25px_rgba(16,185,129,0.12)]',
    spotlight: 'rgba(16,185,129,0.15)',
    cornerHover: 'group-hover:text-emerald-500',
    numColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    iconStyle:
      'bg-linear-to-b from-emerald-50 to-emerald-100/80 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.18)]',
    badgeStyle:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40',
    dotColor: 'bg-emerald-500',
    checkColor: 'text-emerald-600 dark:text-emerald-400',
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
    tone: 'amber' as const,
    laser: 'via-amber-500/90 dark:via-amber-400',
    border:
      'border-amber-500/35 dark:border-white/10 hover:border-amber-500 dark:hover:border-amber-400',
    hoverShadow:
      'hover:shadow-[0_24px_50px_-12px_rgba(245,158,11,0.25),0_0_25px_rgba(245,158,11,0.12)]',
    spotlight: 'rgba(245,158,11,0.15)',
    cornerHover: 'group-hover:text-amber-500',
    numColor: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    iconStyle:
      'bg-linear-to-b from-amber-50 to-amber-100/80 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 shadow-[0_4px_14px_rgba(245,158,11,0.18)]',
    badgeStyle:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/40',
    dotColor: 'bg-amber-500',
    checkColor: 'text-amber-600 dark:text-amber-400',
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
    tone: 'cyan' as const,
    laser: 'via-cyan-500/90 dark:via-cyan-400',
    border:
      'border-cyan-500/35 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400',
    hoverShadow:
      'hover:shadow-[0_24px_50px_-12px_rgba(6,182,212,0.25),0_0_25px_rgba(6,182,212,0.12)]',
    spotlight: 'rgba(6,182,212,0.15)',
    cornerHover: 'group-hover:text-cyan-500',
    numColor: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    iconStyle:
      'bg-linear-to-b from-cyan-50 to-cyan-100/80 dark:from-cyan-950/40 dark:to-cyan-900/20 border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 shadow-[0_4px_14px_rgba(6,182,212,0.18)]',
    badgeStyle:
      'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/40',
    dotColor: 'bg-cyan-500',
    checkColor: 'text-cyan-600 dark:text-cyan-400',
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

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`group relative rounded-2xl p-6 sm:p-7 bg-white/95 dark:bg-[#0c1224]/90 backdrop-blur-xl border ${item.border} shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.02)] ${item.hoverShadow} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
            >
              {/* Haz láser perimetral superior (efecto visual holográfico continuo) */}
              <div
                className={`pointer-events-none absolute top-0 inset-x-0 h-0.75 bg-linear-to-r from-transparent ${item.laser} to-transparent group-hover:h-1 transition-all duration-300`}
              />

              {/* Resplandor radial interno interactivo suave */}
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(350px circle at 50% 0%, ${item.spotlight}, transparent 70%)`,
                }}
              />

              {/* Marcas de esquina técnicas (+) con brillo sutil */}
              <span
                className={`absolute top-2 left-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none ${item.cornerHover} transition-colors`}
              >
                +
              </span>
              <span
                className={`absolute top-2 right-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none ${item.cornerHover} transition-colors`}
              >
                +
              </span>
              <span
                className={`absolute bottom-2 left-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none ${item.cornerHover} transition-colors`}
              >
                +
              </span>
              <span
                className={`absolute bottom-2 right-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none ${item.cornerHover} transition-colors`}
              >
                +
              </span>

              <div>
                {/* Cabecera técnica de lámina: Fase + Badge */}
                <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-2xl font-black text-slate-400 dark:text-white/30 ${item.numColor} transition-colors select-none`}
                    >
                      {item.step}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40">
                      {item.phase}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${item.badgeStyle}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${item.dotColor}`}
                    />
                    {item.badge}
                  </span>
                </div>

                {/* Ícono de cota */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border transition-transform duration-300 group-hover:scale-110 ${item.iconStyle}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Título y subtítulo */}
                <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] font-mono uppercase tracking-wider mt-1 font-semibold text-slate-600 dark:text-slate-400">
                  {item.subtitle}
                </p>

                {/* Descripción */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>

                {/* Especificaciones clave */}
                <ul className="mt-5 space-y-2 border-t border-slate-200/80 dark:border-white/10 pt-4">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón directo poco convencional en cada fase */}
              <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-white/10">
                {item.step === '01' && (
                  <LiveSystemLauncherButton
                    label="CHARLA 15M DIRECTA"
                    sublabel="DIAGNÓSTICO CON EXEQUIEL"
                    href={whatsappUrl}
                    icon={
                      <PhoneCall size={14} className="text-emerald-600 dark:text-emerald-400" />
                    }
                    color="emerald"
                    compact
                    className="w-full justify-between"
                  />
                )}
                {item.step === '02' && (
                  <LiveSystemLauncherButton
                    label="VER TIENDA 3D CELSTORE"
                    sublabel="VALIDACIÓN EN VIVO"
                    href="https://celstore.com/catalogo"
                    icon={
                      <LayoutDashboard size={14} className="text-amber-600 dark:text-amber-400" />
                    }
                    color="amber"
                    compact
                    className="w-full justify-between"
                  />
                )}
                {item.step === '03' && (
                  <LiveSystemLauncherButton
                    label="PROBAR PÁDEL EN VIVO"
                    sublabel="SISTEMA ENTREGADO"
                    href="https://sportmanager-playhub.vercel.app"
                    icon={<CyberPitchRadarIcon size={14} />}
                    color="cyan"
                    compact
                    className="w-full justify-between"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* MÓDULOS DE ACCESO RÁPIDO */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Auditoría en video */}
        <div className="group relative p-5.5 rounded-2xl bg-white/95 dark:bg-[#0c1224]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 shadow-lg shadow-slate-900/5 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.18)] transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden">
          <div className="pointer-events-none absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 block">
                AUDITORÍA DE PRECISIÓN · 5 MINUTOS
              </span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">
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
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs shadow-md shadow-emerald-600/25 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 hover:scale-102 active:scale-98"
          >
            <span>Pedir video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Opción 2: Cotizador en 30 segundos */}
        <div className="group relative p-5.5 rounded-2xl bg-white/95 dark:bg-[#0c1224]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 hover:border-cyan-500/50 shadow-lg shadow-slate-900/5 hover:shadow-[0_16px_36px_-10px_rgba(6,182,212,0.18)] transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden">
          <div className="pointer-events-none absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-700 dark:text-cyan-400 block">
                COTIZACIÓN PARAMÉTRICA INMEDIATA
              </span>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">
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
