import { motion } from 'framer-motion'
import type { AdminCliente, AdminSuscripcion } from '../../../hooks/useAdminDashboard'

interface AdminClientesTableProps {
  clientes: AdminCliente[]
  suscripciones: AdminSuscripcion[]
}

export function AdminClientesTable({ clientes, suscripciones }: AdminClientesTableProps) {
  return (
    <motion.div
      key="clientes-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Suscripción Activa</th>
              <th className="px-6 py-3">Registrado el</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-muted-foreground font-medium">
                  No se encontraron clientes que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              clientes.map((c) => {
                const activeSubs = suscripciones.filter(
                  (s) => s.cliente_id === c.id && s.estado === 'activa'
                )
                const hasPlan = activeSubs.length > 0
                const currentSlug = hasPlan ? activeSubs[0].plan_slug : 'ninguno'

                return (
                  <tr
                    key={c.id}
                    className="bg-card hover:bg-muted transition-colors rounded-2xl group"
                  >
                    <td className="px-6 py-4 rounded-l-2xl border-l border-y border-border">
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
                    </td>
                    <td className="px-6 py-4 border-y border-border">
                      <p className="text-foreground/80 text-sm select-all">{c.email}</p>
                    </td>
                    <td className="px-6 py-4 border-y border-border">
                      {hasPlan ? (
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
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                          Sin abono
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 rounded-r-2xl border-r border-y border-border text-muted-foreground text-sm font-mono">
                      {new Date(c.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
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
