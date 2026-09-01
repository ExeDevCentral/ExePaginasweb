'use client'

import { useMemo } from 'react'
import { FileText, Clock, AlertCircle, CheckCircle, XCircle, CreditCard, Plus } from 'lucide-react'
import { useInvoicesByTenant } from '../../hooks/useInvoices'
import { useTranslation } from 'react-i18next'
import type { Invoice, InvoiceEstado } from '../../core/domain/entities/Invoice'
import type { Pago } from '../../hooks/useDashboard'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Props {
  tenantId: string
  pagos?: Pago[]
  onOpenTicket?: () => void
}

export default function InvoicesPanel({ tenantId, pagos = [], onOpenTicket }: Readonly<Props>) {
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

  const totalPaidInvoices = invoices
    .filter((i: Invoice) => i.estado === 'pagada')
    .reduce((sum: number, i: Invoice) => sum + i.total, 0)

  const totalPaidFromPagos = pagos
    .filter((p) => p.estado === 'aprobado' || p.estado === 'approved')
    .reduce((sum, p) => sum + Number(p.monto || 0), 0)

  const effectiveTotalPaid = totalPaidInvoices > 0 ? totalPaidInvoices : totalPaidFromPagos

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
            <span>{t('invoices.titulo', 'Facturación & Comprobantes')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            {invoices.length > 0
              ? `${invoices.length} ${t('invoices.facturas_registradas', 'facturas registradas')}`
              : 'Control de abonos mensuales y estado de cuenta contable'}
          </p>
        </div>

        {onOpenTicket && (
          <button
            type="button"
            onClick={onOpenTicket}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Consultar Facturación</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm">
          <p className="text-xs text-[#8C9BB0] uppercase tracking-wider font-bold">
            {t('invoices.total_pagado', 'Total Abonado')}
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
            $
            {effectiveTotalPaid.toLocaleString(i18n.language || 'es-AR', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">Cuenta al día · Sin deudas</p>
        </div>
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm">
          <p className="text-xs text-[#8C9BB0] uppercase tracking-wider font-bold">
            {t('invoices.pendientes', 'Facturas Pendientes')}
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">{pendingCount}</p>
          <p className="text-xs text-[#8C9BB0] font-medium mt-1">
            {pendingCount === 0 ? 'Sin importes pendientes de pago' : 'Facturas por abonar'}
          </p>
        </div>
      </div>

      {/* Invoice Table or Informative Empty State */}
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
        <div className="text-center py-14 border border-dashed border-[#1E2638] bg-[#111622] rounded-2xl p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151B28] border border-[#1E2638] flex items-center justify-center mx-auto text-[#38BDF8]">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              No hay facturas creadas por el momento
            </h3>
            <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1.5 max-w-md mx-auto leading-relaxed">
              Actualmente no registrás facturas pendientes ni emitidas. Cuando se emitan tus
              comprobantes fiscales o abonos mensuales, los verás reflejados automáticamente aquí.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Estado de cuenta al día · Sin saldos adeudados
          </div>
        </div>
      )}

      {/* Historial de Pagos si existen registros en la base de datos */}
      {pagos.length > 0 && (
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#1E2638]">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Comprobantes y Pagos Registrados</h3>
          </div>

          <div className="divide-y divide-[#1E2638]">
            {pagos.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-semibold text-white">
                    {p.plan_nombre || 'Abono de Servicios'}
                  </p>
                  <p className="text-[11px] text-[#8C9BB0] mt-0.5">
                    {new Date(p.created_at).toLocaleDateString(i18n.language || 'es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm">
                    ${p.monto} {p.moneda}
                  </span>
                  <span className="block text-[10px] font-semibold text-emerald-400 uppercase">
                    ● {p.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
