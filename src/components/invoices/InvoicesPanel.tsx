import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { useInvoicesByTenant } from '../../hooks/useInvoices'
import type { Invoice, InvoiceEstado } from '../../core/domain/entities/Invoice'

const ESTADO_CONFIG: Record<
  InvoiceEstado,
  { icon: typeof CheckCircle; color: string; label: string }
> = {
  borrador: { icon: Clock, color: 'text-gray-400', label: 'Borrador' },
  emitida: { icon: AlertCircle, color: 'text-yellow-400', label: 'Emitida' },
  pagada: { icon: CheckCircle, color: 'text-emerald-400', label: 'Pagada' },
  vencida: { icon: XCircle, color: 'text-red-400', label: 'Vencida' },
  cancelada: { icon: XCircle, color: 'text-gray-400', label: 'Cancelada' },
}

interface Props {
  tenantId: string
}

export default function InvoicesPanel({ tenantId }: Props) {
  const { data: invoices = [], isLoading } = useInvoicesByTenant(tenantId)

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
          Facturas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{invoices.length} facturas emitidas</p>
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

      {/* Invoice List */}
      {invoices.length > 0 ? (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Número
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Concepto
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice: Invoice, i: number) => (
                <InvoiceRow key={invoice.id} invoice={invoice} index={i} />
              ))}
            </tbody>
          </table>
        </div>
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

function InvoiceRow({ invoice, index }: { invoice: Invoice; index: number }) {
  const config = ESTADO_CONFIG[invoice.estado] || ESTADO_CONFIG.borrador
  const Icon = config.icon

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
    >
      <td className="px-4 py-3">
        <span className="text-sm font-mono font-bold text-foreground">{invoice.numero}</span>
        <span className="ml-2 text-[10px] text-muted-foreground uppercase">{invoice.tipo}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-foreground">{invoice.concepto}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-bold text-foreground">
          ${invoice.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">{invoice.moneda}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs text-muted-foreground">
          {invoice.fecha_emision
            ? new Date(invoice.fecha_emision).toLocaleDateString('es-AR')
            : '—'}
        </span>
      </td>
    </motion.tr>
  )
}
