import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, Terminal } from 'lucide-react'
import { supabase } from '../core/infra/supabase/client'
import { getAuthRedirectUrl } from '../core/auth/siteUrl'
import { useAuthSession } from '../core/auth/AuthSessionProvider'

export default function Login() {
  const navigate = useNavigate()
  const { ready, session } = useAuthSession()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Estados para el acceso alternativo de desarrollo
  const [showDev, setShowDev] = useState(false)
  const [email, setEmail] = useState('echevarria270@gmail.com')
  const [password, setPassword] = useState('Password123!')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (ready && session) navigate('/dashboard', { replace: true })
  }, [ready, session, navigate])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: getAuthRedirectUrl('/auth/callback') },
      })
      if (oauthError) throw oauthError
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al iniciar sesión'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDevSignUp = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Exe Dev Admin'
          }
        }
      })
      if (signUpError) throw signUpError
      alert('¡Cuenta de pruebas creada con éxito! Ahora puedes hacer clic en "Iniciar Sesión".')
    } catch (e: any) {
      setError(e.message || 'Error al crear la cuenta de pruebas.')
    } finally {
      setLoading(false)
    }
  }

  const handleDevSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
      navigate('/dashboard', { replace: true })
    } catch (e: any) {
      setError(e.message || 'Credenciales de pruebas incorrectas.')
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

        <div className="flex justify-center">
          <motion.div
            className="bg-primary-bg/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full"
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
                <p className="text-sm text-primary-secondary">Acceso directo al panel premium.</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={() => { signInWithGoogle() }}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 rounded-2xl font-bold text-primary-bg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-bg border-t-transparent rounded-full animate-spin" />
                  Redirigiendo...
                </div>
              ) : (
                'Continuar con Google'
              )}
            </motion.button>

            {/* Separador de acceso alternativo */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-3 bg-[#0a0a0f] text-xs text-white/40 uppercase tracking-[0.2em]">O BIEN</span>
            </div>

            {/* Botón para abrir Modo Desarrollador */}
            <button
              type="button"
              onClick={() => setShowDev(!showDev)}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Terminal size={16} className="text-accent-cyan" />
              {showDev ? 'Ocultar Acceso Alternativo' : 'Acceso Directo (Contraseña)'}
            </button>

            {/* Formulario de Acceso Alternativo */}
            <AnimatePresence>
              {showDev && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs text-white/55 font-medium ml-1">Email de pruebas</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@ejemplo.com"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/55 font-medium ml-1">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-accent-cyan/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDevSignUp}
                      className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-xs hover:bg-white/10 transition-colors"
                    >
                      Registrar
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDevSignIn}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500/80 to-purple-600/80 text-white font-semibold text-xs hover:opacity-90 transition-opacity"
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="mt-4 text-accent-magenta text-sm font-bold bg-accent-magenta/10 p-3 rounded-lg border border-accent-magenta/20">
                {error}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-xs text-white/60 leading-relaxed text-center"
            >
              Al iniciar sesión, accederás a tu panel en <span className="text-white/80 font-semibold">clientes</span>.
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
