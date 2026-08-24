'use client'

import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import {
  Clock as ClockData,
  AlertCircle as AlertCircleData,
  CheckCircle as CheckCircleData,
  XCircle as XCircleData,
  type IconNode,
} from 'lucide'
import { useInvoicesByTenant } from '../../hooks/useInvoices'
import { useTranslation } from 'react-i18next'
import type { Invoice, InvoiceEstado } from '../../core/domain/entities/Invoice'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Props {
  tenantId: string
}

export default function InvoicesPanel({ tenantId }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: invoices = [], isLoading } = useInvoicesByTenant(tenantId)

  const estadoConfig = useMemo<
    Record<InvoiceEstado, { icon: IconNode; color: string; label: string }>
  >(
    () => ({
      borrador: {
        icon: ClockData,
        color: 'text-slate-500 dark:text-gray-400',
        label: t('invoices.estado_borrador', 'Borrador'),
      },
      emitida: {
        icon: AlertCircleData,
        color: 'text-amber-600 dark:text-yellow-400',
        label: t('invoices.estado_emitida', 'Emitida'),
      },
      pagada: {
        icon: CheckCircleData,
        color: 'text-emerald-600 dark:text-emerald-400',
        label: t('invoices.estado_pagada', 'Pagada'),
      },
      vencida: {
        icon: XCircleData,
        color: 'text-rose-600 dark:text-red-400',
        label: t('invoices.estado_vencida', 'Vencida'),
      },
      cancelada: {
        icon: XCircleData,
        color: 'text-slate-500 dark:text-gray-400',
        label: t('invoices.estado_cancelada', 'Cancelada'),
      },
    }),
    [t]
  )

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: t('invoices.col_numero', 'Número'),
        cell: ({ row }) => (
          <div>
            <span className="font-mono font-black text-slate-900 dark:text-white">
              {row.original.numero}
            </span>
            <span className="ml-2 text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
              {row.original.tipo}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'concepto',
        header: t('invoices.col_concepto', 'Concepto'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {row.original.concepto}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: t('invoices.col_total', 'Total'),
        cell: ({ row }) => (
          <div className="font-black font-mono text-slate-900 dark:text-white">
            $
            {row.original.total.toLocaleString(i18n.language || 'es-AR', {
              minimumFractionDigits: 2,
            })}
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 font-normal font-sans">
              {row.original.moneda}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'estado',
        header: t('invoices.col_estado', 'Estado'),
        cell: ({ row }) => {
          const config = estadoConfig[row.original.estado] || estadoConfig.borrador
          return (
            <span className={`inline-flex items-center gap-1.5 text-xs font-black ${config.color}`}>
              <MorphIcon icon={config.icon} size={14} spring="snappy" />
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'fecha_emision',
        header: t('invoices.col_fecha', 'Fecha'),
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {row.original.fecha_emision
              ? new Date(row.original.fecha_emision).toLocaleDateString(i18n.language || 'es-AR')
              : '—'}
          </span>
        ),
      },
    ],
    [t, i18n.language, estadoConfig]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalPaid = invoices
    .filter((i: Invoice) => i.estado === 'pagada')
    .reduce((sum: number, i: Invoice) => sum + i.total, 0)

  const pendingCount = invoices.filter(
    (i: Invoice) => i.estado === 'emitida' || i.estado === 'vencida'
  ).length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          {t('invoices.titulo', 'Facturación y Recibos')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          {invoices.length} {t('invoices.facturas_registradas', 'facturas registradas')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 p-6 shadow-md dark:shadow-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
            {t('invoices.total_pagado', 'Total pagado')}
          </p>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
            ${totalPaid.toLocaleString(i18n.language || 'es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            ARS / {t('invoices.al_dia', 'Al día')}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 p-6 shadow-md dark:shadow-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
            {t('invoices.pendientes', 'Pendientes')}
          </p>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">
            {t('invoices.facturas_por_pagar', 'facturas por abonar')}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      {invoices.length > 0 ? (
        <DataTable
          columns={columns}
          data={invoices}
          searchPlaceholder={t(
            'invoices.buscar_placeholder',
            'Buscar factura por número o concepto...'
          )}
          pageSize={5}
          emptyMessage={t('invoices.sin_coincidencias', 'No se encontraron facturas coincidentes.')}
        />
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/15 bg-white/90 dark:bg-slate-950/80 rounded-3xl p-8 shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {t('invoices.sin_facturas', 'Sin facturas')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
            {t(
              'invoices.sin_facturas_desc',
              'Las facturas y comprobantes se generan automáticamente con cada pago.'
            )}
          </p>
        </div>
      )}
    </div>
  )
}
