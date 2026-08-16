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

const ESTADO_CONFIG: Record<InvoiceEstado, { icon: IconNode; color: string; label: string }> = {
  borrador: { icon: ClockData, color: 'text-slate-600 dark:text-gray-400', label: 'Borrador' },
  emitida: {
    icon: AlertCircleData,
    color: 'text-amber-600 dark:text-yellow-400',
    label: 'Emitida',
  },
  pagada: {
    icon: CheckCircleData,
    color: 'text-emerald-600 dark:text-emerald-400',
    label: 'Pagada',
  },
  vencida: { icon: XCircleData, color: 'text-rose-600 dark:text-red-400', label: 'Vencida' },
  cancelada: { icon: XCircleData, color: 'text-slate-600 dark:text-gray-400', label: 'Cancelada' },
}

interface Props {
  tenantId: string
}

export default function InvoicesPanel({ tenantId }: Props) {
  const { t } = useTranslation()
  const { data: invoices = [], isLoading } = useInvoicesByTenant(tenantId)

  const columns = useMemo<ColumnDef<Invoice, any>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: 'Número',
        cell: ({ row }) => (
          <div>
            <span className="font-mono font-bold text-foreground">{row.original.numero}</span>
            <span className="ml-2 text-[10px] text-muted-foreground uppercase bg-muted/40 px-1.5 py-0.5 rounded">
              {row.original.tipo}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'concepto',
        header: 'Concepto',
        cell: ({ row }) => <span className="text-foreground">{row.original.concepto}</span>,
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <div className="font-bold text-foreground">
            ${row.original.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            <span className="ml-1 text-xs text-muted-foreground font-normal">
              {row.original.moneda}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const config = ESTADO_CONFIG[row.original.estado] || ESTADO_CONFIG.borrador
          return (
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${config.color}`}>
              <MorphIcon icon={config.icon} size={14} spring="snappy" />
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'fecha_emision',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.fecha_emision
              ? new Date(row.original.fecha_emision).toLocaleDateString('es-AR')
              : '—'}
          </span>
        ),
      },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-cyan" />
          {t('invoices.titulo')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{invoices.length} facturas registradas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total pagado</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${totalPaid.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">ARS</p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pendientes</p>
          <p className="text-2xl font-bold text-foreground mt-1">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">facturas por pagar</p>
        </div>
      </div>

      {/* Invoice Table with React Table */}
      {invoices.length > 0 ? (
        <DataTable
          columns={columns}
          data={invoices}
          searchPlaceholder="Buscar factura por número o concepto..."
          pageSize={5}
          emptyMessage="No se encontraron facturas coincidentes."
        />
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Sin facturas</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Las facturas se generan automáticamente con cada pago.
          </p>
        </div>
      )}
    </div>
  )
}
