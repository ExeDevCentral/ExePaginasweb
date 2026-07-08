import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { supabase } from '../core/infra/supabase/client'
import { getAuthRedirectUrl } from '../core/auth/siteUrl'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTranslation } from 'react-i18next'
import { sileo } from 'sileo'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { ready, session } = useAuthSession()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(searchParams.get('error'))
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (ready && session) navigate('/dashboard', { replace: true })
  }, [ready, session, navigate])

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

      return () => {
        window.removeEventListener('message', handleMessage)
        clearTimeout(timeoutId)
        if (!popup.closed) popup.close()
      }
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
        sileo.success({ title: 'Bienvenido', description: 'Inicio de sesión exitoso' })
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

  const handleSignUp = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) throw signUpError
      sileo.success({
        title: 'Registro exitoso',
        description: 'Revisá tu correo para confirmar la cuenta',
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('login.err_registro'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      sileo.success({ title: 'Bienvenido', description: 'Inicio de sesión exitoso' })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('login.err_credenciales'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#2D3A1F' }}
    >
      {/* decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-[0.04] bg-[#B8A678] blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.04] bg-[#B8A678] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.02] bg-[#F4F1E8] blur-3xl" />

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
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: '#B8A678' }}
          whileHover={{ scale: 1.05, color: '#F4F1E8' }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} />
          {t('login.volver_inicio')}
        </motion.a>

        <motion.div
          className="rounded-3xl shadow-2xl p-8 sm:p-10"
          style={{ backgroundColor: '#F4F1E8' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#2D3A1F' }}
            >
              <Lock className="w-7 h-7" style={{ color: '#B8A678' }} />
            </div>
            <div className="text-left">
              <h2
                className="text-2xl font-black tracking-tight"
                style={{
                  fontFamily: "'Special Gothic Expanded One', sans-serif",
                  color: '#2D3A1F',
                }}
              >
                {t('login.entrar')}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#2D3A1F' }}>
                {t('login.acceso_directo')}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={signInWithGoogle}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 border-2"
            style={{
              backgroundColor: '#2D3A1F',
              color: '#F4F1E8',
              borderColor: '#2D3A1F',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: '#F4F1E8', borderTopColor: 'transparent' }}
                />
                {t('login.redirigiendo')}
              </div>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#F4F1E8"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#F4F1E8"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#F4F1E8"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#F4F1E8"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('login.continuar_google')}
              </>
            )}
          </motion.button>

          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#B8A678' }} />
            </div>
            <span
              className="relative px-4 text-xs uppercase tracking-[0.2em] font-medium"
              style={{ backgroundColor: '#F4F1E8', color: '#B8A678' }}
            >
              {t('login.separador_o')}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium ml-1" style={{ color: '#2D3A1F' }}>
                {t('login.email_pruebas')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: '#E8E2D0',
                  color: '#2D3A1F',
                  border: '1px solid transparent',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#B8A678'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium ml-1" style={{ color: '#2D3A1F' }}>
                {t('login.contrasena')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3 pr-10 text-sm focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#E8E2D0',
                    color: '#2D3A1F',
                    border: '1px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#B8A678'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#2D3A1F' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.button
                type="button"
                disabled={loading}
                onClick={handleSignUp}
                className="w-full py-3 rounded-2xl font-semibold text-xs transition-all border-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#2D3A1F',
                  borderColor: '#2D3A1F',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('login.registrar')}
              </motion.button>
              <motion.button
                type="button"
                disabled={loading}
                onClick={handleSignIn}
                className="w-full py-3 rounded-2xl font-semibold text-xs transition-all"
                style={{
                  backgroundColor: '#2D3A1F',
                  color: '#F4F1E8',
                }}
                whileHover={{ opacity: 0.9, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('login.iniciar_sesion')}
              </motion.button>
            </div>
          </div>

          {error && (
            <p
              className="mt-4 text-sm font-bold p-3 rounded-lg border"
              style={{
                color: '#2D3A1F',
                backgroundColor: '#E8E2D0',
                borderColor: '#B8A678',
              }}
            >
              {error}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-xs leading-relaxed text-center"
            style={{ color: '#2D3A1F' }}
          >
            {t('login.footer_aviso_1')}{' '}
            <span className="font-semibold" style={{ color: '#2D3A1F' }}>
              {t('login.footer_aviso_span')}
            </span>
            .
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
