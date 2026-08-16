import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Check } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../shared/DataTable'
import type { AdminTicket, AdminCliente } from '../../../hooks/useAdminDashboard'
import { TicketResolutionModal } from './TicketResolutionModal'

interface AdminTicketsTableProps {
  tickets: AdminTicket[]
  clientes: AdminCliente[]
  editingTicket: AdminTicket | null
  resolutionText: string
  updatingTicket: boolean
  setEditingTicket: (ticket: AdminTicket | null) => void
  setResolutionText: (text: string) => void
  handleResolveTicket: (e: React.FormEvent) => void
}

export function AdminTicketsTable({
  tickets,
  clientes,
  editingTicket,
  resolutionText,
  updatingTicket,
  setEditingTicket,
  setResolutionText,
  handleResolveTicket,
}: AdminTicketsTableProps) {
  const getClienteDetails = useCallback(
    (clienteId: string) => {
      const found = clientes.find((c) => c.id === clienteId)
      return found
        ? { full_name: found.full_name ?? 'Sin nombre', email: found.email }
        : { full_name: 'Desconocido', email: 'N/A' }
    },
    [clientes]
  )

  const columns = useMemo<ColumnDef<AdminTicket, unknown>[]>(
    () => [
      {
        accessorKey: 'prioridad',
        header: 'Prioridad',
        cell: ({ row }) => {
          const p = row.original.prioridad
          return (
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                p === 'urgente' || p === 'alta'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : p === 'normal'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {p}
            </span>
          )
        },
      },
      {
        id: 'ticket_info',
        header: 'Asunto / Mensaje',
        accessorFn: (row) => `${row.asunto} ${row.mensaje}`,
        cell: ({ row }) => {
          const t = row.original
          return (
            <div className="space-y-1 max-w-md">
              <h4 className="text-foreground font-bold text-sm">{t.asunto}</h4>
              <p className="text-muted-foreground text-xs line-clamp-2">{t.mensaje}</p>
              {t.respuesta_resolucion && (
                <div className="mt-1.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[11px]">
                  <p className="font-bold flex items-center gap-1">
                    <Check size={12} /> Resuelto:
                  </p>
                  <p className="text-foreground/70 italic line-clamp-1">{t.respuesta_resolucion}</p>
                </div>
              )}
            </div>
          )
        },
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
              <p className="text-foreground font-semibold text-xs">{client.full_name}</p>
              <p className="text-muted-foreground text-[11px] select-all">{client.email}</p>
            </div>
          )
        },
      },
      {
        accessorKey: 'categoria',
        header: 'Categoría',
        cell: ({ row }) => (
          <span className="text-xs font-mono text-muted-foreground">{row.original.categoria}</span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const e = row.original.estado
          return (
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                e === 'abierto'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : e === 'en_progreso'
                    ? 'bg-blue-400/20 text-blue-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {e.replace('_', ' ')}
            </span>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Calendar size={12} />
            {new Date(row.original.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acción',
        cell: ({ row }) => {
          const t = row.original
          const isClosed = t.estado === 'resuelto' || t.estado === 'cerrado'
          if (isClosed) return null

          return (
            <button
              type="button"
              onClick={() => {
                setEditingTicket(t)
                setResolutionText(t.respuesta_resolucion || '')
              }}
              className="px-3 py-1.5 rounded-lg bg-accent-magenta text-foreground text-xs font-bold hover:bg-accent-magenta/80 transition-colors shadow-md"
            >
              Responder
            </button>
          )
        },
      },
    ],
    [getClienteDetails, setEditingTicket, setResolutionText]
  )

  return (
    <motion.div
      key="tickets-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <DataTable
        columns={columns}
        data={tickets}
        searchPlaceholder="Buscar ticket por asunto, cliente, categoría..."
        pageSize={8}
        emptyMessage="No hay tickets de soporte registrados."
      />

      {editingTicket && (
        <TicketResolutionModal
          ticket={editingTicket}
          resolutionText={resolutionText}
          updatingTicket={updatingTicket}
          onResolutionTextChange={setResolutionText}
          onClose={() => setEditingTicket(null)}
          onSubmit={handleResolveTicket}
        />
      )}
    </motion.div>
  )
}
