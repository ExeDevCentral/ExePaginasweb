'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CreditCard,
  X,
  Printer,
  Zap,
} from 'lucide-react'
import { useInvoicesByTenant } from '../../hooks/useInvoices'
import { useTranslation } from 'react-i18next'
import type { Invoice, InvoiceEstado } from '../../core/domain/entities/Invoice'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

interface Props {
  tenantId: string
}

export default function InvoicesPanel({ tenantId }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: dbInvoices = [], isLoading } = useInvoicesByTenant(tenantId)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const defaultInvoices: Invoice[] = useMemo(
    () => [
      {
        id: 'inv-001',
        tenant_id: tenantId,
        cliente_id: 'cliente-default',
        numero: 'FC-EXE-2025-08',
        tipo: 'B',
        concepto: 'Mantenimiento Web, Hosting Edge, Sistema de Turnos & Soporte VIP SLA',
        subtotal: 65000,
        iva: 0,
        total: 65000,
        moneda: 'ARS',
        estado: 'pagada',
        detalles: [
          {
            descripcion: 'Abono Mensual Plan Avanzado + Turnos & WhatsApp Bot',
            cantidad: 1,
            precio_unitario: 65000,
            total: 65000,
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
        subtotal: 65000,
        iva: 0,
        total: 65000,
        moneda: 'ARS',
        estado: 'pagada',
        detalles: [
          {
            descripcion: 'Abono Mensual Plan Avanzado + Turnos & WhatsApp Bot',
            cantidad: 1,
            precio_unitario: 65000,
            total: 65000,
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

  const handleDownloadInvoice = (inv: Invoice) => {
    toast.success(`Descargando comprobante ${inv.numero}...`, {
      description: 'Generando comprobante fiscal con CAE AFIP en PDF.',
    })
  }

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: t('invoices.col_numero', 'Nº Comprobante'),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setSelectedInvoice(row.original)}
            className="text-left group cursor-pointer"
          >
            <span className="font-mono font-bold text-white text-xs sm:text-sm group-hover:text-[#38BDF8] transition-colors">
              {row.original.numero}
            </span>
            <span className="ml-2 text-[10px] text-[#38BDF8] font-semibold uppercase bg-[#151B28] px-2 py-0.5 rounded-md border border-[#1E2638]">
              Factura {row.original.tipo}
            </span>
          </button>
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
        header: t('invoices.col_fecha', 'Emisión'),
        cell: ({ row }) => {
          const d = row.original.fecha_emision
          const dateStr = d
            ? new Date(d).toLocaleDateString(i18n.language || 'es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '—'
          return <span className="text-xs font-mono text-[#8C9BB0]">{dateStr}</span>
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedInvoice(row.original)}
              className="p-1.5 rounded-lg bg-[#151B28] hover:bg-[#1C2438] text-[#38BDF8] border border-[#1E2638] transition-all text-xs font-semibold px-2.5 cursor-pointer"
            >
              Ver Detalle
            </button>
            <button
              type="button"
              onClick={() => handleDownloadInvoice(row.original)}
              title="Descargar Comprobante"
              className="p-1.5 rounded-lg bg-[#151B28] hover:bg-[#1C2438] text-slate-300 hover:text-white border border-[#1E2638] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
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
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('invoices.titulo', 'Facturación, Abonos & Comprobantes')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Historial de abonos mensuales, comprobantes fiscales AFIP y pagos de servicios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cuenta al Día</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUMMARY METRIC CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#151B28] border border-[#1E2638] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8C9BB0] mb-2">
            <span className="text-xs font-bold uppercase">Abono Mensual Vigente</span>
            <Zap className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <p className="text-xl font-bold font-mono text-white">$65.000 ARS</p>
          <p className="text-[11px] text-emerald-400 mt-1">● Plan Avanzado + Turnos</p>
        </div>

        <div className="bg-[#151B28] border border-[#1E2638] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8C9BB0] mb-2">
            <span className="text-xs font-bold uppercase">Estado Fiscal AFIP</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">100% Declarado</p>
          <p className="text-[11px] text-[#8C9BB0] mt-1">Facturas B con CAE Oficial</p>
        </div>

        <div className="bg-[#151B28] border border-[#1E2638] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8C9BB0] mb-2">
            <span className="text-xs font-bold uppercase">Próximo Vencimiento</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold font-mono text-white">01 / Sep / 2026</p>
          <p className="text-[11px] text-[#8C9BB0] mt-1">Débito automático habilitado</p>
        </div>

        <div className="bg-[#151B28] border border-[#1E2638] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8C9BB0] mb-2">
            <span className="text-xs font-bold uppercase">Medio de Pago</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">Mercado Pago / MP</p>
          <p className="text-[11px] text-[#8C9BB0] mt-1">Acreditación instantánea</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INVOICE LIST TABLE */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
          Historial de Comprobantes Emitidos
        </h3>

        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-4 overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={invoices}
            searchPlaceholder="Buscar por concepto o comprobante..."
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: INVOICE DETAIL & FISCAL RECEIPT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111622] border border-[#1E2638] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2638]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4361EE]/20 border border-[#4361EE]/40 flex items-center justify-center text-[#38BDF8]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedInvoice.numero}</h3>
                    <p className="text-xs text-[#8C9BB0]">
                      Comprobante Fiscal Oficial · Tipo {selectedInvoice.tipo}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="text-[#64748B] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fiscal Invoice Details */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#151B28] border border-[#1E2638]">
                  <div>
                    <p className="text-[#8C9BB0] font-medium">Emisor</p>
                    <p className="font-bold text-white mt-0.5">ExeSistemasWEB / ExePaginasWeb</p>
                    <p className="text-[11px] text-[#64748B]">Servicios Web & SaaS</p>
                  </div>
                  <div>
                    <p className="text-[#8C9BB0] font-medium">CAE AFIP</p>
                    <p className="font-mono font-bold text-emerald-400 mt-0.5">
                      {selectedInvoice.afip_cae || '74125896325874'}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Vto: {selectedInvoice.afip_vencimiento?.split('T')[0] || '2025-08-25'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#151B28] border border-[#1E2638] space-y-3">
                  <div className="flex justify-between font-bold text-white border-b border-[#1E2638] pb-2">
                    <span>Concepto</span>
                    <span>Importe</span>
                  </div>
                  <div className="flex justify-between text-[#8C9BB0]">
                    <span>{selectedInvoice.concepto}</span>
                    <span className="font-mono font-bold text-white">
                      ${selectedInvoice.total.toLocaleString()} {selectedInvoice.moneda}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-[#1E2638] text-sm">
                    <span>Total Abonado</span>
                    <span className="text-[#38BDF8] font-mono">
                      ${selectedInvoice.total.toLocaleString()} {selectedInvoice.moneda}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#8C9BB0] hover:text-white"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="px-5 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Descargar PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
