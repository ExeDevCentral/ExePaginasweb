'use client'

import { useMemo } from 'react'
import { FileText, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
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
    Record<InvoiceEstado, { icon: typeof CheckCircle; color: string; label: string }>
  >(
    () => ({
      borrador: {
        icon: Clock,
        color: 'text-[#8C9BB0]',
        label: t('invoices.estado_borrador', 'Borrador'),
      },
      emitida: {
        icon: AlertCircle,
        color: 'text-amber-400',
        label: t('invoices.estado_emitida', 'Emitida'),
      },
      pagada: {
        icon: CheckCircle,
        color: 'text-emerald-400',
        label: t('invoices.estado_pagada', 'Pagada'),
      },
      vencida: {
        icon: XCircle,
        color: 'text-rose-400',
        label: t('invoices.estado_vencida', 'Vencida'),
      },
      cancelada: {
        icon: XCircle,
        color: 'text-[#64748B]',
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
            <span className="font-mono font-bold text-white text-xs sm:text-sm">
              {row.original.numero}
            </span>
            <span className="ml-2 text-[10px] text-[#38BDF8] font-bold uppercase bg-[#151B28] border border-[#1E2638] px-2 py-0.5 rounded-md">
              {row.original.tipo}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'concepto',
        header: t('invoices.col_concepto', 'Concepto'),
        cell: ({ row }) => (
          <span className="text-xs text-[#8C9BB0] font-medium block max-w-sm sm:max-w-md truncate">
            {row.original.concepto}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: t('invoices.col_total', 'Total'),
        cell: ({ row }) => (
          <div className="font-bold font-mono text-white text-xs sm:text-sm">
            $
            {row.original.total.toLocaleString(i18n.language || 'es-AR', {
              minimumFractionDigits: 2,
            })}
            <span className="ml-1 text-[10px] text-[#64748B] font-sans font-normal">
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
          const Icon = config.icon
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'fecha_emision',
        header: t('invoices.col_fecha', 'Fecha'),
        cell: ({ row }) => (
          <span className="text-xs text-[#8C9BB0] font-medium">
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
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('invoices.titulo', 'Facturación y Recibos')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            {invoices.length} {t('invoices.facturas_registradas', 'facturas registradas')}
          </p>
        </div>

        <a
          href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Tengo%20una%20consulta%20sobre%20facturación"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer w-fit"
        >
          <span>Consultar Administración</span>
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm">
          <p className="text-xs text-[#8C9BB0] uppercase tracking-wider font-bold">
            {t('invoices.total_pagado', 'Total pagado')}
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
            ${totalPaid.toLocaleString(i18n.language || 'es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">
            ARS / {t('invoices.al_dia', 'Al día')}
          </p>
        </div>
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm">
          <p className="text-xs text-[#8C9BB0] uppercase tracking-wider font-bold">
            {t('invoices.pendientes', 'Pendientes')}
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">{pendingCount}</p>
          <p className="text-xs text-[#8C9BB0] font-medium mt-1">
            {t('invoices.facturas_por_pagar', 'facturas por abonar')}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      {invoices.length > 0 ? (
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-4 overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={invoices}
            searchPlaceholder={t(
              'invoices.buscar_placeholder',
              'Buscar factura por número o concepto...'
            )}
            pageSize={5}
            emptyMessage={t(
              'invoices.sin_coincidencias',
              'No se encontraron facturas coincidentes.'
            )}
          />
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-[#1E2638] bg-[#111622] rounded-2xl p-8 shadow-sm">
          <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
          <h3 className="text-base font-bold text-white">
            {t('invoices.sin_facturas', 'Sin facturas')}
          </h3>
          <p className="text-xs text-[#8C9BB0] mt-2 font-medium">
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
