/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import {
  CyberCheckMark,
  CyberMinusIcon,
  CyberChevron,
  CyberMetricLightning,
  CyberRealPropertyShield,
  CyberDatabaseCore,
  CyberStackLayers,
} from '@/components/ui/MagnificentIcons'
import { storeAudio } from '../../core/utils/storeAudio'

interface FeatureRow {
  id: string
  name: string
  tooltip?: string
  basico: boolean | string
  avanzado: boolean | string
  premium: boolean | string
}

interface FeatureCategory {
  id: string
  title: string
  icon: React.ElementType
  rows: FeatureRow[]
}

const getComparisonCategories = (t: TFunction): FeatureCategory[] => [
  {
    id: 'cat_infra',
    title: t('store.matrix_cat1', 'Infraestructura Cloud & Velocidad'),
    icon: CyberMetricLightning,
    rows: [
      {
        id: 'hosting',
        name: t('store.matrix_row_hosting', 'Hosting Serverless Vercel Edge'),
        tooltip: t(
          'store.matrix_row_hosting_desc',
          'Despliegue ultra rápido en la red perimetral con 0 tiempo de inactividad.'
        ),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'ssl',
        name: t('store.matrix_row_ssl', 'Certificado SSL Automático'),
        tooltip: t('store.matrix_row_ssl_desc', 'Cifrado HTTPS bancario renovado automáticamente.'),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'domain',
        name: t('store.matrix_row_domain', 'Renovación de Dominio Anual'),
        tooltip: t(
          'store.matrix_row_domain_desc',
          'Gestión y costo de renovación de tu dominio (.com o .com.ar) 100% bonificado para suscriptores activos (antigüedad mínima de 6 meses).'
        ),
        basico: false,
        avanzado: t('store.matrix_bonificado', 'Bonificado*'),
        premium: t('store.matrix_bonificado', 'Bonificado*'),
      },
      {
        id: 'cdn',
        name: t('store.matrix_row_cdn', 'CDN Global Anycast Ultra-Rápido'),
        tooltip: t(
          'store.matrix_row_cdn_desc',
          'Carga instantánea desde el nodo geográfico más cercano al cliente.'
        ),
        basico: t('store.matrix_standard', 'Estándar'),
        avanzado: t('store.matrix_accelerated', 'Acelerado'),
        premium: t('store.matrix_edge_priority', 'Prioridad Edge Tier-1'),
      },
    ],
  },
  {
    id: 'cat_sec',
    title: t('store.matrix_cat2', 'Seguridad, Respaldos & Monitoreo'),
    icon: CyberRealPropertyShield,
    rows: [
      {
        id: 'security_patches',
        name: t('store.matrix_row_sec', 'Actualizaciones de Seguridad y Parches'),
        tooltip: t(
          'store.matrix_row_sec_desc',
          'Auditorías regulares de vulnerabilidades en Next.js, librerías y dependencias.'
        ),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'backups',
        name: t('store.matrix_row_backups', 'Backups Diarios Automáticos'),
        tooltip: t(
          'store.matrix_row_backups_desc',
          'Copias de seguridad automáticas en la nube con retención de 30 días.'
        ),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'gateways',
        name: t('store.matrix_row_gateways', 'Monitoreo de Pasarelas de Pago'),
        tooltip: t(
          'store.matrix_row_gateways_desc',
          'Verificación continua de webhooks y cobros con Mercado Pago / PayPal.'
        ),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'waf',
        name: t('store.matrix_row_waf', 'Protección Anti-DDoS y WAF'),
        tooltip: t(
          'store.matrix_row_waf_desc',
          'Escudo perimetral contra ataques de fuerza bruta e inyecciones.'
        ),
        basico: t('store.matrix_val_basic', 'Básico'),
        avanzado: t('store.matrix_val_advanced', 'Avanzado'),
        premium: t('store.matrix_val_enterprise', 'Empresarial Proactivo'),
      },
    ],
  },
  {
    id: 'cat_db',
    title: t('store.matrix_cat3', 'Base de Datos & Arquitectura'),
    icon: CyberDatabaseCore,
    rows: [
      {
        id: 'db_mgmt',
        name: t('store.matrix_row_db', 'Gestión y Monitoreo de Base de Datos'),
        tooltip: t(
          'store.matrix_row_db_desc',
          'Mantenimiento de instancias Supabase / PostgreSQL.'
        ),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'query_opt',
        name: t('store.matrix_row_indexes', 'Optimización de Consultas e Índices'),
        tooltip: t(
          'store.matrix_row_indexes_desc',
          'Ajustes en la base de datos para máxima velocidad en catálogos y reservas.'
        ),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'data_migrations',
        name: t('store.matrix_row_migrations', 'Migración y Esquemas de Datos'),
        tooltip: t(
          'store.matrix_row_migrations_desc',
          'Aplicación segura de migraciones SQL sin pérdida de datos.'
        ),
        basico: false,
        avanzado: false,
        premium: true,
      },
    ],
  },
  {
    id: 'cat_support',
    title: t('store.matrix_cat4', 'Soporte, Evolución & Horas de Desarrollo'),
    icon: CyberStackLayers,
    rows: [
      {
        id: 'support_channel',
        name: t('store.matrix_row_support', 'Canal de Soporte Técnico'),
        tooltip: t(
          'store.matrix_row_support_desc',
          'Canales de comunicación directa con nuestro equipo de ingeniería.'
        ),
        basico: t('store.matrix_val_email_ticket', 'Email / Ticket'),
        avanzado: t('store.matrix_val_wa_ticket', 'WhatsApp + Ticket'),
        premium: t('store.matrix_val_wa_priority', 'WhatsApp 24/7 Prioritario'),
      },
      {
        id: 'incident_sla',
        name: t('store.matrix_row_sla', 'SLA de Respuesta a Incidentes'),
        tooltip: t(
          'store.matrix_row_sla_desc',
          'Tiempo máximo de respuesta ante cualquier consulta técnica.'
        ),
        basico: t('store.matrix_val_24h', '< 24 Horas'),
        avanzado: t('store.matrix_val_6h', '< 6 Horas'),
        premium: t('store.matrix_val_2h', '< 2 Horas (Urgente)'),
      },
      {
        id: 'dev_hours',
        name: t('store.matrix_row_hours', 'Bolsa de Horas de Desarrollo Mensual'),
        tooltip: t(
          'store.matrix_row_hours_desc',
          'Horas mensuales acumulables para nuevos módulos, cambios visuales o ajustes.'
        ),
        basico: false,
        avanzado: t('store.matrix_val_disc_20', 'Descuento 20%'),
        premium: t('store.matrix_val_2h_inc', '2 Horas/mes Incluidas'),
      },
      {
        id: 'account_manager',
        name: t('store.matrix_row_manager', 'Account Manager & Consultoría Estratégica'),
        tooltip: t(
          'store.matrix_row_manager_desc',
          'Reunión mensual de crecimiento digital, análisis de métricas y nuevas ideas.'
        ),
        basico: false,
        avanzado: false,
        premium: true,
      },
    ],
  },
]

export const PlanComparisonMatrix: React.FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const categories = useMemo(() => getComparisonCategories(t), [t])

  const toggleOpen = () => {
    storeAudio.playToggle()
    setIsOpen(!isOpen)
  }

  const renderValue = (val: boolean | string) => {
    if (val === true) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
          <CyberCheckMark size={14} className="text-emerald-400" />
        </div>
      )
    }
    if (val === false) {
      return (
        <div className="w-6 h-6 rounded-full bg-muted/60 text-muted-foreground/40 flex items-center justify-center mx-auto">
          <CyberMinusIcon size={14} />
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
          <CyberStackLayers
            size={16}
            className="text-accent-cyan group-hover:rotate-12 transition-transform"
          />
          <span>
            {isOpen
              ? t('store.matrix_toggle_close', 'Ocultar Tabla Comparativa Completa')
              : t('store.matrix_toggle_open', 'Comparar Todos los Beneficios Detallados')}
          </span>
          <CyberChevron isOpen={isOpen} size={15} className="text-accent-cyan" />
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
              <table className="w-full text-left border-collapse min-w-160">
                <thead>
                  <tr className="border-b border-border/80 pb-4">
                    <th className="py-4 px-4 text-sm font-bold uppercase tracking-wider text-muted-foreground w-2/5">
                      {t('store.matrix_col_features', 'Prestaciones y Cobertura')}
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-cyan-700 dark:text-cyan-400">
                        {t('store.abono_basico_title', 'Abono Básico')}
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5 bg-purple-500/10 rounded-t-2xl">
                      <span className="text-purple-700 dark:text-purple-400">
                        {t('store.abono_avanzado_title', 'Abono Avanzado')}
                      </span>
                      <span className="block text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold uppercase mt-0.5">
                        {t('store.mas_elegido', 'Más Elegido')}
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-pink-700 dark:text-pink-400">
                        {t('store.abono_premium_title', 'Abono Premium')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      <tr className="bg-muted/40">
                        <td
                          colSpan={4}
                          className="py-3 px-4 text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2"
                        >
                          <cat.icon className="w-4 h-4 text-accent-cyan" />
                          <span>{cat.title}</span>
                        </td>
                      </tr>
                      {cat.rows.map((row) => (
                        <tr
                          key={row.id}
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
              <div className="p-3.5 sm:p-4 border-t border-border/40 bg-slate-100/50 dark:bg-white/2 text-xs text-slate-500 dark:text-slate-400">
                <p>
                  <span className="text-cyan-500 font-bold">*</span>{' '}
                  {t(
                    'store.matrix_domain_note',
                    'Renovación de Dominio: La bonificación del costo de renovación anual (.com / .com.ar) aplica para clientes activos a partir del 6º mes ininterrumpido de suscripción en Abonos Avanzado y Premium.'
                  )}
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
