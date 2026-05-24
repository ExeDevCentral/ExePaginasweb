import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, UserRoundPlus } from 'lucide-react'
import { supabase } from '../core/infra/supabase/client'
import { RegisterForm } from '../components/Auth/RegisterForm'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirigir al dashboard si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) navigate('/dashboard')
    }
    checkSession()
  }, [navigate])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al iniciar sesión'
      setError(message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-6xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-montserrat font-black text-white">
            Ingreso / <span className="text-accent-cyan">Registro</span>
          </h1>
          <p className="mt-3 text-primary-secondary">Acceso de clientes para activar el dashboard premium.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-primary-bg/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">Entrar</h2>
                <p className="text-sm text-primary-secondary">Login rápido con Google.</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={() => { signInWithGoogle() }}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 rounded-2xl font-bold text-primary-bg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-primary-bg border-t-transparent rounded-full animate-spin" /> Redirigiendo...</div> : 'Continuar con Google'}
            </motion.button>

            {error && (
              <p className="mt-4 text-accent-magenta text-sm font-bold bg-accent-magenta/10 p-3 rounded-lg border border-accent-magenta/20">
                {error}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-xs text-white/60 leading-relaxed"
            >
              Al iniciar sesión, se creará/actualizará tu perfil en <span className="text-white/80 font-semibold">clientes</span>.
            </motion.div>
          </motion.div>

          <div className="lg:sticky lg:top-[100px] self-start">
            <div className="bg-primary-bg/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-2">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
                    <UserRoundPlus className="w-6 h-6 text-primary-bg" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Crear cuenta</h2>
                    <p className="text-sm text-primary-secondary">Se vincula con tu email.</p>
                  </div>
                </div>

                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
