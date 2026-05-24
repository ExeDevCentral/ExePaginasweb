import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'
import { Sparkles, ShieldCheck, User, RefreshCw, Crown, CreditCard } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'

const ADMIN_EMAILS = [
  'exemetal@hotmail.com',
  'echevarria270@gmail.com',
]

function formatDate(d?: string | null) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { loading, error, cliente, suscripciones, pagos, isPremium, refresh } = useDashboard()
  const { role } = useAuthRole(ADMIN_EMAILS)
  const isAdmin = role === 'admin'

  useEffect(() => {
    if (!loading && !cliente && !error) {
      navigate('/login')
    }
  }, [loading, cliente, error, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-secondary">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-primary-bg/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8"
        >
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="mt-3 text-accent-magenta text-sm font-bold">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 rounded-2xl font-bold text-primary-bg hover:opacity-90 transition-opacity"
          >
            Volver a Login
          </button>
        </motion.div>
      </div>
    )
  }

  const clientTier = suscripciones.length > 0
    ? suscripciones[0].plan?.nombre ?? 'Plan'
    : 'Sin plan'

  const clientTierColor = clientTier === 'Plan Enterprise'
    ? 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    : clientTier === 'Plan Pro'
      ? 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10'
      : clientTier === 'Plan Básico'
        ? 'text-green-400 border-green-500/30 bg-green-500/10'
        : 'text-white/50 border-white/10 bg-white/5'

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto"
      >
        {/* Admin Banner */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent backdrop-blur-xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-bold">Super Admin</p>
                <h1 className="text-3xl sm:text-4xl font-montserrat font-black text-white mt-1">
                  Panel de Administración
                </h1>
                <p className="mt-1 text-yellow-200/70 text-sm">Control total del sistema</p>
              </div>
              <button onClick={refresh} disabled={loading} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-yellow-400 hover:bg-white/10 transition-all disabled:opacity-30" title="Actualizar">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 uppercase tracking-wide">Clientes</p>
                <p className="text-2xl font-black text-white mt-1">—</p>
                <p className="text-xs text-white/40 mt-1">Próximamente</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 uppercase tracking-wide">Suscripciones</p>
                <p className="text-2xl font-black text-white mt-1">—</p>
                <p className="text-xs text-white/40 mt-1">Próximamente</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 uppercase tracking-wide">Ingresos</p>
                <p className="text-2xl font-black text-white mt-1">—</p>
                <p className="text-xs text-white/40 mt-1">Próximamente</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Client Dashboard */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-cyan font-bold">
              {isAdmin ? 'Administrador' : 'Cliente'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-montserrat font-black text-white mt-2">
              {cliente?.nombre ? `Hola, ${cliente.nombre}` : 'Tu Dashboard'}
            </h1>
            <p className="mt-3 text-primary-secondary">
              {isAdmin ? 'Gestioná el sistema desde acá.' : 'Panel de control de tu cuenta.'}
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 text-xs font-bold text-accent-magenta/80 hover:text-accent-magenta transition-colors inline-flex items-center gap-2"
            >
              Cerrar Sesión
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-primary-bg/40 backdrop-blur-xl px-6 py-5 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPremium ? 'bg-accent-cyan/20 border border-accent-cyan/30' : 'bg-white/5 border border-white/10'}`}>
                {isPremium ? <ShieldCheck className="w-6 h-6 text-accent-cyan" /> : <User className="w-6 h-6 text-white/60" />}
              </div>
              <div>
                <p className="text-sm text-white/70">Estado</p>
                <p className="text-2xl font-black text-white">{isPremium ? 'Premium ✅' : 'No Premium'}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/60">
              {isPremium ? `Plan: ${clientTier}` : 'Sin suscripción activa.'}
            </div>
          </motion.div>
        </div>

        {/* Client Tier Badge */}
        {!isAdmin && (
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${clientTierColor}`}>
              {clientTier === 'Plan Enterprise' && <Crown size={16} />}
              {clientTier}
            </span>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -6 }} className="bg-white/5 border border-accent-cyan/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-cyan" />
              </div>
              <h2 className="text-lg font-bold text-white">Beneficios</h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-primary-secondary">
              <li>✓ Dashboard premium con animaciones</li>
              <li>✓ Acceso a secciones avanzadas</li>
              <li>✓ Perfil de cliente</li>
              {isAdmin && <li className="text-yellow-400">✦ Acceso Super Admin</li>}
            </ul>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white/5 border border-accent-magenta/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-bold text-white">Tus datos</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Email</span>
                <span className="text-white font-semibold">{cliente?.email ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Rol</span>
                <span className={`font-semibold ${isAdmin ? 'text-yellow-400' : 'text-white'}`}>
                  {isAdmin ? 'Super Admin' : 'Cliente'}
                </span>
              </div>
            </div>
            <div className="mt-6 w-full rounded-2xl border border-white/5 bg-white/5 py-3 text-center text-white/40 text-xs font-bold">
              Próximamente: Editar Perfil
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-bold text-white">Suscripciones</h2>
            <div className="mt-4 space-y-3">
              {suscripciones.length === 0 ? (
                <p className="text-sm text-primary-secondary">No hay suscripciones activas.</p>
              ) : (
                suscripciones.slice(0, 3).map((s) => (
                  <div key={s.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-white font-semibold">{s.plan?.nombre ?? 'Plan'}</p>
                    <p className="text-xs text-white/60 mt-1">Inicio: {formatDate(s.fecha_inicio)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Payment History */}
        {pagos.length > 0 && (
          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-primary-bg/40 backdrop-blur-xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-accent-cyan" />
                <h2 className="text-lg font-bold text-white">Historial de Pagos</h2>
              </div>
              <div className="space-y-3">
                {pagos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div>
                      <p className="text-white font-semibold">{p.plan_nombre || 'Pago'}</p>
                      <p className="text-xs text-white/50 mt-0.5">{formatDate(p.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${p.monto} {p.moneda}
                      </p>
                      <span className={`text-xs font-semibold ${p.estado === 'aprobado' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {p.estado === 'aprobado' ? '✅ Aprobado' : '⏳ Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        {!isPremium && !isAdmin && (
          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-accent-magenta/20 bg-gradient-to-br from-accent-magenta/10 to-accent-cyan/10 backdrop-blur-xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white">Acceso premium bloqueado</h2>
              <p className="mt-2 text-primary-secondary">
                Contratá un plan para desbloquear todas las funcionalidades.
              </p>
              <button
                onClick={() => navigate('/tienda')}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-2xl text-primary-bg font-bold hover:opacity-90 transition-opacity"
              >
                Ver planes
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
