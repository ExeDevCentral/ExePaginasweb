'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Minus,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  Zap,
  Database,
} from 'lucide-react'
import { storeAudio } from '../../core/utils/storeAudio'

interface FeatureRow {
  name: string
  tooltip?: string
  basico: boolean | string
  avanzado: boolean | string
  premium: boolean | string
}

interface FeatureCategory {
  title: string
  icon: React.ElementType
  rows: FeatureRow[]
}

const COMPARISON_CATEGORIES: FeatureCategory[] = [
  {
    title: 'Infraestructura Cloud & Velocidad',
    icon: Zap,
    rows: [
      {
        name: 'Hosting Serverless Vercel Edge',
        tooltip: 'Despliegue ultra rápido en la red perimetral con 0 tiempo de inactividad.',
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Certificado SSL Automático',
        tooltip: 'Cifrado HTTPS bancario renovado automáticamente.',
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Renovación de Dominio Anual',
        tooltip:
          'Gestión y costo de renovación de tu dominio (.com o .com.ar) 100% bonificado para suscriptores activos (antigüedad mínima de 6 meses).',
        basico: false,
        avanzado: 'Bonificado*',
        premium: 'Bonificado*',
      },
      {
        name: 'CDN Global Anycast Ultra-Rápido',
        tooltip: 'Carga instantánea desde el nodo geográfico más cercano al cliente.',
        basico: 'Estándar',
        avanzado: 'Acelerado',
        premium: 'Prioridad Edge Tier-1',
      },
    ],
  },
  {
    title: 'Seguridad, Respaldos & Monitoreo',
    icon: ShieldCheck,
    rows: [
      {
        name: 'Actualizaciones de Seguridad y Parches',
        tooltip: 'Auditorías regulares de vulnerabilidades en Next.js, librerías y dependencias.',
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Backups Diarios Automáticos',
        tooltip: 'Copias de seguridad automáticas en la nube con retención de 30 días.',
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Monitoreo de Pasarelas de Pago',
        tooltip: 'Verificación continua de webhooks y cobros con Mercado Pago / PayPal.',
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Protección Anti-DDoS y WAF',
        tooltip: 'Escudo perimetral contra ataques de fuerza bruta e inyecciones.',
        basico: 'Básico',
        avanzado: 'Avanzado',
        premium: 'Empresarial Proactivo',
      },
    ],
  },
  {
    title: 'Base de Datos & Arquitectura',
    icon: Database,
    rows: [
      {
        name: 'Gestión y Monitoreo de Base de Datos',
        tooltip: 'Mantenimiento de instancias Supabase / PostgreSQL.',
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Optimización de Consultas e Índices',
        tooltip: 'Ajustes en la base de datos para máxima velocidad en catálogos y reservas.',
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        name: 'Migración y Esquemas de Datos',
        tooltip: 'Aplicación segura de migraciones SQL sin pérdida de datos.',
        basico: false,
        avanzado: false,
        premium: true,
      },
    ],
  },
  {
    title: 'Soporte, Evolución & Horas de Desarrollo',
    icon: Layers,
    rows: [
      {
        name: 'Canal de Soporte Técnico',
        tooltip: 'Canales de comunicación directa con nuestro equipo de ingeniería.',
        basico: 'Email / Ticket',
        avanzado: 'WhatsApp + Ticket',
        premium: 'WhatsApp 24/7 Prioritario',
      },
      {
        name: 'SLA de Respuesta a Incidentes',
        tooltip: 'Tiempo máximo de respuesta ante cualquier consulta técnica.',
        basico: '< 24 Horas',
        avanzado: '< 6 Horas',
        premium: '< 2 Horas (Urgente)',
      },
      {
        name: 'Bolsa de Horas de Desarrollo Mensual',
        tooltip: 'Horas mensuales acumulables para nuevos módulos, cambios visuales o ajustes.',
        basico: false,
        avanzado: 'Descuento 20%',
        premium: '2 Horas/mes Incluidas',
      },
      {
        name: 'Account Manager & Consultoría Estratégica',
        tooltip: 'Reunión mensual de crecimiento digital, análisis de métricas y nuevas ideas.',
        basico: false,
        avanzado: false,
        premium: true,
      },
    ],
  },
]

export const PlanComparisonMatrix: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    storeAudio.playToggle()
    setIsOpen(!isOpen)
  }

  const renderValue = (val: boolean | string) => {
    if (val === true) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <Check className="w-3.5 h-3.5" />
        </div>
      )
    }
    if (val === false) {
      return (
        <div className="w-6 h-6 rounded-full bg-muted/60 text-muted-foreground/40 flex items-center justify-center mx-auto">
          <Minus className="w-3.5 h-3.5" />
        </div>
      )
    }
    return <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{val}</span>
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-16">
      {/* Expander Button */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={toggleOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border hover:border-accent-cyan/60 text-foreground font-bold text-sm shadow-xl transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4 text-accent-cyan group-hover:rotate-12 transition-transform" />
          <span>
            {isOpen
              ? 'Ocultar Tabla Comparativa Completa'
              : 'Comparar Todos los Beneficios Detallados'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-accent-cyan" />
          ) : (
            <ChevronDown className="w-4 h-4 text-accent-cyan" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden mt-8"
          >
            <div className="rounded-3xl bg-card/90 backdrop-blur-2xl border border-border shadow-2xl p-4 sm:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-border/80 pb-4">
                    <th className="py-4 px-4 text-sm font-bold uppercase tracking-wider text-muted-foreground w-2/5">
                      Prestaciones y Cobertura
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-cyan-500">Abono Básico</span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5 bg-purple-500/10 rounded-t-2xl">
                      <span className="text-purple-400">Abono Avanzado</span>
                      <span className="block text-[10px] font-mono text-purple-300 font-bold uppercase mt-0.5">
                        Más Elegido
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-pink-500">Abono Premium</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_CATEGORIES.map((cat, catIdx) => (
                    <React.Fragment key={catIdx}>
                      <tr className="bg-muted/40">
                        <td
                          colSpan={4}
                          className="py-3 px-4 text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2"
                        >
                          <cat.icon className="w-4 h-4 text-accent-cyan" />
                          <span>{cat.title}</span>
                        </td>
                      </tr>
                      {cat.rows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className="border-b border-border/40 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {row.name}
                            </p>
                            {row.tooltip && (
                              <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                                {row.tooltip}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">{renderValue(row.basico)}</td>
                          <td className="py-3.5 px-4 text-center bg-purple-500/5">
                            {renderValue(row.avanzado)}
                          </td>
                          <td className="py-3.5 px-4 text-center">{renderValue(row.premium)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="p-3.5 sm:p-4 border-t border-border/40 bg-slate-100/50 dark:bg-white/[0.02] text-xs text-slate-500 dark:text-slate-400">
                <p>
                  <span className="text-cyan-500 font-bold">*</span>{' '}
                  <strong>Renovación de Dominio:</strong> La bonificación del costo de renovación
                  anual (.com / .com.ar) aplica para clientes activos a partir del 6º mes
                  ininterrumpido de suscripción en Abonos Avanzado y Premium.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlanComparisonMatrix
