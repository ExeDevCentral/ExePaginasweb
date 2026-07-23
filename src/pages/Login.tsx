import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft, Mail, User, Check, X } from 'lucide-react'
import { supabase } from '../core/infra/supabase/client'
import { getAuthRedirectUrl } from '../core/auth/siteUrl'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import LoginBackground from '../components/Effects/LoginBackground'

type Mode = 'login' | 'register'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { ready, session } = useAuthSession()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(searchParams.get('error'))
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [sentVerification, setSentVerification] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (ready && session) navigate('/dashboard', { replace: true })
  }, [ready, session, navigate])

  const passwordRules = [
    { label: '8+ caracteres', test: (p: string) => p.length >= 8 },
    { label: 'Mayúscula', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Minúscula', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Número', test: (p: string) => /\d/.test(p) },
  ]

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'login' ? 'register' : 'login'))
    setError(null)
    setSentVerification(false)
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)

      const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      })

      if (!data?.url) throw new Error('No se pudo obtener la URL de autenticación')

      const url = new URL(import.meta.env.VITE_SUPABASE_URL)
      const storageKey = `sb-${url.hostname.split('.')[0]}-auth-token-code-verifier`
      const verifierRaw = localStorage.getItem(storageKey)
      if (verifierRaw) {
        try {
          window.name = JSON.parse(verifierRaw)
        } catch {
          /* ignore */
        }
      }

      const popup = window.open(data.url, 'google-login', 'width=600,height=700')
      if (!popup || popup.closed) {
        window.location.href = data.url
        return
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        if (event.data.type === 'PKCE_CODE') {
          window.removeEventListener('message', handleMessage)
          clearTimeout(timeoutId)
          completeGoogleAuth(event.data.code)
        }
        if (event.data.type === 'PKCE_ERROR') {
          window.removeEventListener('message', handleMessage)
          clearTimeout(timeoutId)
          if (!popup.closed) popup.close()
          setError(event.data.error)
          setLoading(false)
        }
      }
      window.addEventListener('message', handleMessage)

      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleMessage)
        if (!popup.closed) popup.close()
        setLoading(false)
        setError('La autenticación tardó demasiado. Intenta de nuevo.')
      }, 300000)
    } catch (e) {
      const message = e instanceof Error ? e.message : t('login.err_iniciar_sesion')
      setError(message)
      setLoading(false)
    }
  }

  const completeGoogleAuth = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      if (data.session) {
        toast.success('Bienvenido', { description: 'Inicio de sesión exitoso' })
        navigate('/dashboard', { replace: true })
      } else {
        setError('No se pudo establecer la sesión')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al completar la autenticación')
    } finally {
      setLoading(false)
    }
  }

  const validateAndSubmit = async () => {
    setError(null)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá un email válido')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (mode === 'register') {
      if (!name.trim()) {
        setError('Ingresá tu nombre')
        return
      }
      if (name.trim().length < 2) {
        setError('El nombre debe tener al menos 2 caracteres')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: getAuthRedirectUrl('/auth/callback'),
          },
        })
        if (signUpError) throw signUpError
        setSentVerification(true)
        toast.success('Revisá tu email', {
          description: `Enviamos un link de confirmación a ${email}`,
        })
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        toast.success('Bienvenido', { description: 'Inicio de sesión exitoso' })
        navigate('/dashboard', { replace: true })
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error'
      if (msg.includes('rate_limit') || msg.toLowerCase().includes('too many requests')) {
        setError('Demasiados intentos. Esperá un momento y volvé a intentar.')
      } else if (msg.includes('Email not confirmed')) {
        setSentVerification(true)
        setError('Confirmá tu email antes de iniciar sesión')
      } else if (mode === 'register') {
        setError(msg)
      } else {
        setError('Email o contraseña incorrectos')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) validateAndSubmit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <LoginBackground />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors text-accent-magenta hover:text-accent-cyan"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} />
          {t('login.volver_inicio')}
        </motion.a>

        <motion.div
          className="rounded-3xl shadow-2xl p-8 sm:p-10 bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-accent-magenta/20">
              <Lock className="w-7 h-7 text-accent-magenta" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black tracking-tight text-foreground font-serif">
                {mode === 'login' ? t('login.entrar') : 'Crear cuenta'}
              </h2>
              <p className="text-sm mt-0.5 text-muted-foreground">
                {mode === 'login' ? t('login.acceso_directo') : 'Registrate con email'}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={signInWithGoogle}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 border-2 bg-accent-magenta text-white border-accent-magenta"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
                {t('login.redirigiendo')}
              </div>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#fff"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#fff"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fff"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#fff"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('login.continuar_google')}
              </>
            )}
          </motion.button>

          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative px-4 text-xs uppercase tracking-[0.2em] font-medium bg-card text-muted-foreground">
              {t('login.separador_o')}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {sentVerification ? (
              <motion.div
                key="verification-sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-6"
              >
                <Mail className="w-12 h-12 mx-auto mb-4 text-accent-magenta" />
                <h3 className="text-lg font-bold text-foreground mb-2">Revisá tu email</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Enviamos un link de confirmación a{' '}
                  <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  No lo recibiste? Revisá la carpeta de spam o intentá con otro email
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSentVerification(false)
                    setMode('login')
                  }}
                  className="w-full py-3 rounded-2xl font-semibold text-sm bg-accent-magenta text-white"
                >
                  Ir a iniciar sesión
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="text-xs font-medium ml-1 text-foreground">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="reg-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        autoComplete="name"
                        className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none ring-1 ring-border focus:ring-accent-magenta transition-all bg-muted text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="text-xs font-medium ml-1 text-foreground">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    autoComplete="email"
                    className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none ring-1 ring-border focus:ring-accent-magenta transition-all bg-muted text-foreground placeholder:text-muted-foreground/50"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-pass" className="text-xs font-medium ml-1 text-foreground">
                    {t('login.contrasena')}
                  </label>
                  <div className="relative">
                    <input
                      id="login-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      className="w-full rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none ring-1 ring-border focus:ring-accent-magenta transition-all bg-muted text-foreground placeholder:text-muted-foreground/50"
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1.5 pt-1"
                  >
                    <p className="text-xs font-medium text-muted-foreground ml-1">
                      La contraseña debe tener:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {passwordRules.map((rule) => {
                        const pass = rule.test(password)
                        return (
                          <div
                            key={rule.label}
                            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors ${
                              password.length === 0
                                ? 'text-muted-foreground'
                                : pass
                                  ? 'text-green-500'
                                  : 'text-red-400'
                            }`}
                          >
                            {password.length === 0 ? (
                              <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground" />
                            ) : pass ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                            {rule.label}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    onClick={validateAndSubmit}
                    className="w-full py-3 rounded-2xl font-semibold text-sm transition-all bg-accent-magenta text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
                        {mode === 'login' ? 'Ingresando...' : 'Creando cuenta...'}
                      </div>
                    ) : mode === 'login' ? (
                      t('login.iniciar_sesion')
                    ) : (
                      'Crear cuenta'
                    )}
                  </motion.button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-xs text-muted-foreground hover:text-accent-magenta transition-colors underline underline-offset-2"
                  >
                    {mode === 'login'
                      ? 'No tenés cuenta? Registrate'
                      : 'Ya tenés cuenta? Iniciá sesión'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm font-medium p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-xs leading-relaxed text-center text-muted-foreground"
          >
            {t('login.footer_aviso_1')}{' '}
            <span className="font-semibold text-foreground">{t('login.footer_aviso_span')}</span>.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
