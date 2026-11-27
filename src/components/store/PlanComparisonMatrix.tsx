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
    title: t('store.matrix_cat1'),
    icon: CyberMetricLightning,
    rows: [
      {
        id: 'hosting',
        name: t('store.matrix_row_hosting'),
        tooltip: t('store.matrix_row_hosting_desc'),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'ssl',
        name: t('store.matrix_row_ssl'),
        tooltip: t('store.matrix_row_ssl_desc'),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'domain',
        name: t('store.matrix_row_domain'),
        tooltip: t('store.matrix_row_domain_desc'),
        basico: false,
        avanzado: t('store.matrix_bonificado'),
        premium: t('store.matrix_bonificado'),
      },
      {
        id: 'cdn',
        name: t('store.matrix_row_cdn'),
        tooltip: t('store.matrix_row_cdn_desc'),
        basico: t('store.matrix_standard'),
        avanzado: t('store.matrix_accelerated'),
        premium: t('store.matrix_edge_priority'),
      },
    ],
  },
  {
    id: 'cat_sec',
    title: t('store.matrix_cat2'),
    icon: CyberRealPropertyShield,
    rows: [
      {
        id: 'security_patches',
        name: t('store.matrix_row_sec'),
        tooltip: t('store.matrix_row_sec_desc'),
        basico: true,
        avanzado: true,
        premium: true,
      },
      {
        id: 'backups',
        name: t('store.matrix_row_backups'),
        tooltip: t('store.matrix_row_backups_desc'),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'gateways',
        name: t('store.matrix_row_gateways'),
        tooltip: t('store.matrix_row_gateways_desc'),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'waf',
        name: t('store.matrix_row_waf'),
        tooltip: t('store.matrix_row_waf_desc'),
        basico: t('store.matrix_val_basic'),
        avanzado: t('store.matrix_val_advanced'),
        premium: t('store.matrix_val_enterprise'),
      },
    ],
  },
  {
    id: 'cat_db',
    title: t('store.matrix_cat3'),
    icon: CyberDatabaseCore,
    rows: [
      {
        id: 'db_mgmt',
        name: t('store.matrix_row_db'),
        tooltip: t('store.matrix_row_db_desc'),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'query_opt',
        name: t('store.matrix_row_indexes'),
        tooltip: t('store.matrix_row_indexes_desc'),
        basico: false,
        avanzado: true,
        premium: true,
      },
      {
        id: 'data_migrations',
        name: t('store.matrix_row_migrations'),
        tooltip: t('store.matrix_row_migrations_desc'),
        basico: false,
        avanzado: false,
        premium: true,
      },
    ],
  },
  {
    id: 'cat_support',
    title: t('store.matrix_cat4'),
    icon: CyberStackLayers,
    rows: [
      {
        id: 'support_channel',
        name: t('store.matrix_row_support'),
        tooltip: t('store.matrix_row_support_desc'),
        basico: t('store.matrix_val_email_ticket'),
        avanzado: t('store.matrix_val_wa_ticket'),
        premium: t('store.matrix_val_wa_priority'),
      },
      {
        id: 'incident_sla',
        name: t('store.matrix_row_sla'),
        tooltip: t('store.matrix_row_sla_desc'),
        basico: t('store.matrix_val_24h'),
        avanzado: t('store.matrix_val_6h'),
        premium: t('store.matrix_val_2h'),
      },
      {
        id: 'dev_hours',
        name: t('store.matrix_row_hours'),
        tooltip: t('store.matrix_row_hours_desc'),
        basico: false,
        avanzado: t('store.matrix_val_disc_20'),
        premium: t('store.matrix_val_2h_inc'),
      },
      {
        id: 'account_manager',
        name: t('store.matrix_row_manager'),
        tooltip: t('store.matrix_row_manager_desc'),
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
          <span>{isOpen ? t('store.matrix_toggle_close') : t('store.matrix_toggle_open')}</span>
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
                      {t('store.matrix_col_features')}
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-cyan-700 dark:text-cyan-400">
                        {t('store.abono_basico_title')}
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5 bg-purple-500/10 rounded-t-2xl">
                      <span className="text-purple-700 dark:text-purple-400">
                        {t('store.abono_avanzado_title')}
                      </span>
                      <span className="block text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold uppercase mt-0.5">
                        {t('store.mas_elegido')}
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center font-black text-slate-900 dark:text-white text-base w-1/5">
                      <span className="text-pink-700 dark:text-pink-400">
                        {t('store.abono_premium_title')}
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
                  <span className="text-cyan-500 font-bold">*</span> {t('store.matrix_domain_note')}
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
