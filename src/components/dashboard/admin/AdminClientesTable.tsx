import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../shared/DataTable'
import type { AdminCliente, AdminSuscripcion } from '../../../hooks/useAdminDashboard'

interface AdminClientesTableProps {
  clientes: AdminCliente[]
  suscripciones: AdminSuscripcion[]
}

export function AdminClientesTable({ clientes, suscripciones }: AdminClientesTableProps) {
  const getActiveSubscriptionSlug = useCallback(
    (clienteId: string) => {
      const activeSubs = suscripciones.filter(
        (s) => s.cliente_id === clienteId && s.estado === 'activa'
      )
      return activeSubs.length > 0 ? activeSubs[0].plan_slug : null
    },
    [suscripciones]
  )

  const columns = useMemo<ColumnDef<AdminCliente, unknown>[]>(
    () => [
      {
        id: 'cliente',
        header: 'Cliente',
        accessorFn: (row) => `${row.full_name ?? ''} ${row.email}`,
        cell: ({ row }) => {
          const c = row.original
          return (
            <div className="flex items-center gap-4">
              {c.avatar_url ? (
                <img
                  src={c.avatar_url}
                  alt={c.full_name ?? ''}
                  className="w-10 h-10 rounded-xl object-cover border border-border"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-magenta flex items-center justify-center font-bold text-primary-bg">
                  {(c.full_name ?? c.email).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-foreground font-bold text-sm">
                  {c.full_name || 'Nuevo Usuario'}
                </h4>
                <p className="text-muted-foreground text-xs font-mono select-all">
                  {c.id.substring(0, 8)}...
                </p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Contacto',
        cell: ({ row }) => (
          <span className="text-foreground/80 text-sm select-all">{row.original.email}</span>
        ),
      },
      {
        id: 'suscripcion',
        header: 'Suscripción Activa',
        accessorFn: (row) => getActiveSubscriptionSlug(row.id) ?? 'Sin abono',
        cell: ({ row }) => {
          const currentSlug = getActiveSubscriptionSlug(row.original.id)
          if (!currentSlug) {
            return (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                Sin abono
              </span>
            )
          }

          return (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                currentSlug.includes('premium')
                  ? 'bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20'
                  : currentSlug.includes('avanzado')
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
              }`}
            >
              {currentSlug.replace('mantenimiento-', '')}
            </span>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Registrado el',
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm font-mono">
            {new Date(row.original.created_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ),
      },
    ],
    [getActiveSubscriptionSlug]
  )

  return (
    <motion.div
      key="clientes-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <DataTable
        columns={columns}
        data={clientes}
        searchPlaceholder="Buscar cliente por nombre, email o ID..."
        pageSize={8}
        emptyMessage="No se encontraron clientes que coincidan con la búsqueda."
      />
    </motion.div>
  )
}
