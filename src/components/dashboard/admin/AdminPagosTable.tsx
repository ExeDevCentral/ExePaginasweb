import { motion } from 'framer-motion'
import type { AdminPago, AdminCliente } from '../../../hooks/useAdminDashboard'

interface AdminPagosTableProps {
  pagos: AdminPago[]
  clientes: AdminCliente[]
}

export function AdminPagosTable({ pagos, clientes }: AdminPagosTableProps) {
  const getClienteDetails = (clienteId: string) => {
    const found = clientes.find((c) => c.id === clienteId)
    return found
      ? { full_name: found.full_name ?? 'Sin nombre', email: found.email }
      : { full_name: 'Desconocido', email: 'N/A' }
  }

  return (
    <motion.div
      key="pagos-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="px-6 py-3">ID Pago</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Plan / Detalle</th>
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Método</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                  No se han registrado pagos en el sistema.
                </td>
              </tr>
            ) : (
              pagos.map((p) => {
                const client = getClienteDetails(p.cliente_id)
                const isApproved = p.estado === 'approved' || p.estado === 'aprobado'

                return (
                  <tr key={p.id} className="bg-card hover:bg-muted transition-colors rounded-2xl">
                    <td className="px-6 py-4 rounded-l-2xl border-l border-y border-border text-xs font-mono text-muted-foreground select-all">
                      {p.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 border-y border-border">
                      <h4 className="text-foreground font-bold text-sm">{client.full_name}</h4>
                      <p className="text-muted-foreground text-xs select-all">{client.email}</p>
                    </td>
                    <td className="px-6 py-4 border-y border-border">
                      <p className="text-foreground font-semibold text-sm">
                        {p.plan_nombre || 'Servicio personalizado'}
                      </p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {p.plan_slug || 'n/a'}
                      </p>
                    </td>
                    <td className="px-6 py-4 border-y border-border font-bold text-sm text-foreground">
                      ${Number(p.monto).toLocaleString('es-AR')} {p.moneda}
                    </td>
                    <td className="px-6 py-4 border-y border-border text-xs text-muted-foreground font-mono">
                      {p.metodo_pago || 'n/a'}
                    </td>
                    <td className="px-6 py-4 border-y border-border">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : p.estado === 'pendiente' || p.estado === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 rounded-r-2xl border-r border-y border-border text-muted-foreground text-xs font-mono">
                      {new Date(p.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
