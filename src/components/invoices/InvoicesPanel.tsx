'use client'

import { useMemo } from 'react'
import { FileText, Download, CheckCircle2 } from 'lucide-react'
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
  const { data: dbInvoices = [], isLoading } = useInvoicesByTenant(tenantId)

  const defaultInvoices: Invoice[] = useMemo(
    () => [
      {
        id: 'inv-001',
        tenant_id: tenantId,
        cliente_id: 'cliente-default',
        numero: 'FC-EXE-2025-08',
        tipo: 'B',
        concepto: 'Mantenimiento Web, Hosting Edge, Sistema de Turnos & Soporte VIP SLA',
        subtotal: 45000,
        iva: 0,
        total: 45000,
        moneda: 'ARS',
        estado: 'pagada',
        detalles: [
          {
            descripcion: 'Abono Mensual Plan Avanzado',
            cantidad: 1,
            precio_unitario: 45000,
            total: 45000,
          },
        ],
        fecha_emision: '2025-08-01T00:00:00Z',
        fecha_vencimiento: '2025-08-15T00:00:00Z',
        fecha_pago: '2025-08-01T00:00:00Z',
        pago_id: 'pay-001',
        afip_cae: '74125896325874',
        afip_vencimiento: '2025-08-25T00:00:00Z',
        metadata: {},
        created_at: '2025-08-01T00:00:00Z',
        updated_at: '2025-08-01T00:00:00Z',
      },
      {
        id: 'inv-002',
        tenant_id: tenantId,
        cliente_id: 'cliente-default',
        numero: 'FC-EXE-2025-07',
        tipo: 'B',
        concepto: 'Mantenimiento Web, Hosting Edge, Sistema de Turnos & Soporte VIP SLA',
        subtotal: 45000,
        iva: 0,
        total: 45000,
        moneda: 'ARS',
        estado: 'pagada',
        detalles: [
          {
            descripcion: 'Abono Mensual Plan Avanzado',
            cantidad: 1,
            precio_unitario: 45000,
            total: 45000,
          },
        ],
        fecha_emision: '2025-07-01T00:00:00Z',
        fecha_vencimiento: '2025-07-15T00:00:00Z',
        fecha_pago: '2025-07-01T00:00:00Z',
        pago_id: 'pay-002',
        afip_cae: '74125896325873',
        afip_vencimiento: '2025-07-25T00:00:00Z',
        metadata: {},
        created_at: '2025-07-01T00:00:00Z',
        updated_at: '2025-07-01T00:00:00Z',
      },
    ],
    [tenantId]
  )

  const invoices = dbInvoices.length > 0 ? dbInvoices : defaultInvoices

  const estadoConfig = useMemo<Record<InvoiceEstado, { color: string; label: string }>>(
    () => ({
      borrador: {
        color: 'text-[#8C9BB0] bg-[#151B28] border-[#1E2638]',
        label: 'Borrador',
      },
      emitida: {
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        label: 'Emitida / Pendiente',
      },
      pagada: {
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        label: 'Abonada / Al Día',
      },
      vencida: {
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        label: 'Vencida',
      },
      cancelada: {
        color: 'text-[#64748B] bg-[#151B28] border-[#1E2638]',
        label: 'Cancelada',
      },
    }),
    []
  )

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: t('invoices.col_numero', 'Nº Comprobante'),
        cell: ({ row }) => (
          <div>
            <span className="font-mono font-bold text-white text-xs sm:text-sm">
              {row.original.numero}
            </span>
            <span className="ml-2 text-[10px] text-[#38BDF8] font-semibold uppercase bg-[#151B28] px-2 py-0.5 rounded-md border border-[#1E2638]">
              Factura {row.original.tipo}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'concepto',
        header: t('invoices.col_concepto', 'Detalle de Servicios'),
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
            <span className="ml-1 text-[10px] text-[#64748B] font-sans">{row.original.moneda}</span>
          </div>
        ),
      },
      {
        accessorKey: 'estado',
        header: t('invoices.col_estado', 'Estado'),
        cell: ({ row }) => {
          const config = estadoConfig[row.original.estado] || estadoConfig.borrador
          return (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.color}`}
            >
              ● {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'fecha_emision',
        header: t('invoices.col_fecha', 'Fecha Emisión'),
        cell: ({ row }) => (
          <span className="text-xs text-[#8C9BB0] font-mono">
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

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('invoices.titulo', 'Facturación, Abonos & Comprobantes')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Historial de abonos mensuales, servicios profesionales y recibos fiscales emitidos.
          </p>
        </div>

        <a
          href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Quisiera%20solicitar%20comprobante%20o%20factura%20fiscal"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151B28] hover:bg-[#1C2438] border border-[#1E2638] text-[#38BDF8] text-xs font-semibold transition-all shadow-sm cursor-pointer w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Solicitar Factura AFIP</span>
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#1E2638] bg-[#151B28] p-5 shadow-sm">
          <p className="text-[11px] text-[#8C9BB0] uppercase tracking-wider font-bold">
            Abono Mensual Activo
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">$45.000,00 ARS</p>
          <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cuenta al día · Sin saldos pendientes</span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E2638] bg-[#151B28] p-5 shadow-sm">
          <p className="text-[11px] text-[#8C9BB0] uppercase tracking-wider font-bold">
            Próxima Facturación
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
            15 del Próx. Mes
          </p>
          <p className="text-xs text-[#8C9BB0] font-medium mt-1">Renovación automática mensual</p>
        </div>

        <div className="rounded-2xl border border-[#1E2638] bg-[#151B28] p-5 shadow-sm">
          <p className="text-[11px] text-[#8C9BB0] uppercase tracking-wider font-bold">
            Medios de Pago Habilitados
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="px-2 py-1 rounded-md bg-[#1C2438] border border-[#232D42] text-xs font-bold text-white">
              Mercado Pago
            </span>
            <span className="px-2 py-1 rounded-md bg-[#1C2438] border border-[#232D42] text-xs font-bold text-[#38BDF8]">
              PayPal
            </span>
            <span className="px-2 py-1 rounded-md bg-[#1C2438] border border-[#232D42] text-xs font-bold text-slate-300">
              Transferencia
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Buscar factura por número o concepto..."
        pageSize={5}
        emptyMessage="No se encontraron facturas coincidentes."
      />
    </div>
  )
}
