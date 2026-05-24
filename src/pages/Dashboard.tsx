import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'
import { Sparkles, ShieldCheck, User, RefreshCw } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

function formatDate(d?: string | null) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { loading, error, cliente, suscripciones, isPremium, refresh } = useDashboard()

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

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-cyan font-bold">Cliente Premium</p>
            <h1 className="text-4xl sm:text-5xl font-montserrat font-black text-white mt-2">
              {cliente?.nombre ? `Hola, ${cliente.nombre}` : 'Tu Dashboard'}
            </h1>
            <p className="mt-3 text-primary-secondary">Estado premium según suscripciones.</p>
            <button
              onClick={handleLogout}
              className="mt-4 text-xs font-bold text-accent-magenta/80 hover:text-accent-magenta transition-colors inline-flex items-center gap-2"
            >
              Cerrar Sesión
            </button>
          </div>

          <button 
            onClick={refresh}
            disabled={loading}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-accent-cyan hover:bg-white/10 transition-all disabled:opacity-30"
            title="Actualizar datos"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-primary-bg/40 backdrop-blur-xl px-6 py-5 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isPremium ? 'bg-accent-cyan/20 border border-accent-cyan/30' : 'bg-white/5 border border-white/10'
                }`}
              >
                {isPremium ? (
                  <ShieldCheck className="w-6 h-6 text-accent-cyan" />
                ) : (
                  <User className="w-6 h-6 text-white/60" />
                )}
              </div>
              <div>
                <p className="text-sm text-white/70">Estado</p>
                <p className="text-2xl font-black text-white">
                  {isPremium ? 'Premium ✅' : 'No Premium'}
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/60">
              {isPremium ? 'Tenés acceso al panel premium.' : 'Completá una suscripción para desbloquear.'}
            </div>
          </motion.div>
        </div>

        {/* Premium cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/5 border border-accent-cyan/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
          >
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
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/5 border border-accent-magenta/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-lg font-bold text-white">Tus datos</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Email</span>
                <span className="text-white font-semibold">{cliente?.email ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Teléfono</span>
                <span className="text-white font-semibold">{cliente?.telefono ?? '—'}</span>
              </div>
            </div>

            <div
              className="mt-6 w-full rounded-2xl border border-white/5 bg-white/5 py-3 text-center text-white/40 text-xs font-bold"
            >
              Próximamente: Editar Perfil
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-lg font-bold text-white">Suscripciones</h2>
            <div className="mt-4 space-y-3">
              {suscripciones.length === 0 ? (
                <p className="text-sm text-primary-secondary">No hay suscripciones activas.</p>
              ) : (
                suscripciones.slice(0, 3).map((s) => (
                  <div key={s.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-white font-semibold">
                      {s.plan?.nombre ?? 'Plan'}
                    </p>
                    <p className="text-xs text-white/60 mt-1">Inicio: {formatDate(s.fecha_inicio)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        {!isPremium && (
          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-accent-magenta/20 bg-gradient-to-br from-accent-magenta/10 to-accent-cyan/10 backdrop-blur-xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white">Acceso premium bloqueado</h2>
              <p className="mt-2 text-primary-secondary">
                Cuando crees/actives una suscripción en <span className="text-white/80 font-semibold">suscripciones</span>, se desbloqueará automáticamente.
              </p>
              <button
                onClick={() => navigate('/tienda')}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-2xl text-primary-bg font-bold hover:opacity-90 transition-opacity"
              >
                Ver planes (próximo)
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
