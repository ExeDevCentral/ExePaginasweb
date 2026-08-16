import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MorphIcon } from 'morphicons/react'
import { CheckCircle as CheckCircleData, Clock as ClockData, XCircle as XCircleData } from 'lucide'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../shared/DataTable'
import type { AdminPago, AdminCliente } from '../../../hooks/useAdminDashboard'

interface AdminPagosTableProps {
  pagos: AdminPago[]
  clientes: AdminCliente[]
}

export function AdminPagosTable({ pagos, clientes }: AdminPagosTableProps) {
  const getClienteDetails = useCallback(
    (clienteId: string) => {
      const found = clientes.find((c) => c.id === clienteId)
      return found
        ? { full_name: found.full_name ?? 'Sin nombre', email: found.email }
        : { full_name: 'Desconocido', email: 'N/A' }
    },
    [clientes]
  )

  const columns = useMemo<ColumnDef<AdminPago, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID Pago',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground select-all">
            {row.original.id.substring(0, 8)}...
          </span>
        ),
      },
      {
        id: 'cliente',
        header: 'Cliente',
        accessorFn: (row) => {
          const client = getClienteDetails(row.cliente_id)
          return `${client.full_name} ${client.email}`
        },
        cell: ({ row }) => {
          const client = getClienteDetails(row.original.cliente_id)
          return (
            <div>
              <h4 className="text-foreground font-bold text-sm">{client.full_name}</h4>
              <p className="text-muted-foreground text-xs select-all">{client.email}</p>
            </div>
          )
        },
      },
      {
        accessorKey: 'plan_nombre',
        header: 'Plan / Detalle',
        cell: ({ row }) => (
          <div>
            <p className="text-foreground font-semibold text-sm">
              {row.original.plan_nombre || 'Servicio personalizado'}
            </p>
            <p className="text-muted-foreground text-xs font-mono">
              {row.original.plan_slug || 'n/a'}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'monto',
        header: 'Monto',
        cell: ({ row }) => (
          <span className="font-bold text-sm text-foreground">
            ${Number(row.original.monto).toLocaleString('es-AR')} {row.original.moneda}
          </span>
        ),
      },
      {
        accessorKey: 'metodo_pago',
        header: 'Método',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.metodo_pago || 'n/a'}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const estado = row.original.estado
          const isApproved = estado === 'approved' || estado === 'aprobado'
          const isPending = estado === 'pendiente' || estado === 'pending'
          const icon = isApproved ? CheckCircleData : isPending ? ClockData : XCircleData

          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                isApproved
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : isPending
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              <MorphIcon icon={icon} size={11} spring="snappy" />
              {estado}
            </span>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs font-mono">
            {new Date(row.original.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        ),
      },
    ],
    [getClienteDetails]
  )

  return (
    <motion.div
      key="pagos-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <DataTable
        columns={columns}
        data={pagos}
        searchPlaceholder="Buscar pago por ID, cliente, plan..."
        pageSize={8}
        emptyMessage="No se han registrado pagos en el sistema."
      />
    </motion.div>
  )
}
