'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  User,
  Check,
  X,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react'
import { supabase } from '../core/infra/supabase/client'
import { getAuthRedirectUrl } from '../core/auth/siteUrl'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import LoginBackground from '../components/Effects/LoginBackground'
import Logo from '../components/layout/Logo'
import { getErrorMessage } from '../core/utils/errorUtils'

type Mode = 'login' | 'register' | 'forgot' | 'update-password'

export default function Login() {
  const router = useRouter()
  const navigate = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(path)
      } else {
        router.push(path)
      }
    },
    [router]
  )
  const searchParams = useSearchParams()
  const { ready, session } = useAuthSession()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(searchParams.get('error'))
  const [mode, setMode] = useState<Mode>(
    searchParams.get('mode') === 'update-password' ? 'update-password' : 'login'
  )
  const [loading, setLoading] = useState(false)
  const [sentVerification, setSentVerification] = useState(false)
  const [sentReset, setSentReset] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('mode') === 'update-password') {
      setMode('update-password')
    }
  }, [searchParams])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update-password')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (ready && session && mode !== 'update-password') {
      const target = searchParams.get('redirectTo') || '/dashboard'
      navigate(target, { replace: true })
    }
  }, [ready, session, navigate, mode, searchParams])

  const passwordRules = [
    { label: '8+ caracteres', test: (p: string) => p.length >= 8 },
    { label: 'Mayúscula', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Minúscula', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Número', test: (p: string) => /\d/.test(p) },
  ]

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode)
    setError(null)
    setSentVerification(false)
    setSentReset(false)
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)

      const target = searchParams.get('redirectTo') || searchParams.get('next') || '/dashboard'
      const redirectPath =
        target && target !== '/dashboard'
          ? `/auth/callback?next=${encodeURIComponent(target)}`
          : '/auth/callback'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(redirectPath),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    } catch (e) {
      const message = getErrorMessage(e, t('login.err_iniciar_sesion'))
      setError(message)
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresá tu email para restablecer la contraseña')
      return
    }
    setLoading(true)
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl('/auth/callback?type=recovery'),
      })
      if (resetErr) throw resetErr
      setSentReset(true)
      toast.success('Email de recuperación enviado', {
        description: `Enviamos las instrucciones a ${email}`,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al enviar el email de recuperación')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setError(null)
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password })
      if (updateErr) throw updateErr
      toast.success('Contraseña actualizada', {
        description: 'Tu nueva contraseña ha sido guardada correctamente',
      })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError(getErrorMessage(e, 'Error al actualizar la contraseña'))
    } finally {
      setLoading(false)
    }
  }

  const validateAndSubmit = async () => {
    setError(null)

    if (mode === 'forgot') {
      await handleResetPassword()
      return
    }

    if (mode === 'update-password') {
      await handleUpdatePassword()
      return
    }

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
      const msg = getErrorMessage(e, 'Error inesperado')
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
    <div className="dark min-h-screen flex flex-col justify-between px-4 py-6 sm:py-10 relative overflow-hidden bg-[#030308] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* 3D Canvas Background (Untouched) */}
      <LoginBackground />

      {/* Top Navbar Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 backdrop-blur-xl transition-all text-slate-200 hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft
            size={15}
            className="text-cyan-400 group-hover:-translate-x-0.5 transition-transform"
          />
          <span>{t('login.volver_inicio')}</span>
        </motion.a>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 backdrop-blur-xl px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold tracking-wider">CONEXIÓN CIFRADA SSL 256-BIT</span>
        </div>
      </header>

      {/* Center Auth Card Container with Animated Gradient Border */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-4">
        {/* Outer Glowing Aura */}
        <div className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-pink-500/40 shadow-[0_0_60px_-15px_rgba(14,165,233,0.3)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-[31px] bg-[#090a12]/90 border border-white/10 backdrop-blur-3xl p-7 sm:p-9 shadow-2xl overflow-hidden"
          >
            {/* Top Ambient Glow Spot inside Card */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* Header Tech Line */}
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-slate-400 mb-6 border-b border-white/10 pb-3.5">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> ACCESO SEGURO
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Brand Logo & Title */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-white/10 mb-4 shadow-inner"
              >
                <Logo
                  className="h-10 w-auto"
                  size={42}
                  variant="dark"
                  showText
                  animated
                  textClassName="text-white text-base font-black tracking-widest uppercase font-mono ml-1"
                />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                {mode === 'login'
                  ? 'Bienvenido de nuevo'
                  : mode === 'register'
                    ? 'Crear tu cuenta'
                    : mode === 'forgot'
                      ? 'Recuperar contraseña'
                      : 'Establecer nueva contraseña'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">
                {mode === 'login'
                  ? 'Ingresá al panel de control corporativo'
                  : mode === 'register'
                    ? 'Registrate para comenzar a construir tu sistema'
                    : mode === 'forgot'
                      ? 'Ingresá tu mail para enviarte instrucciones'
                      : 'Ingresá tu nueva contraseña para actualizar tu acceso'}
              </p>
            </div>

            {/* Segmented Mode Switcher Tabs */}
            {mode !== 'forgot' && mode !== 'update-password' && (
              <div
                role="tablist"
                aria-label="Modalidad de autenticación"
                className="grid grid-cols-2 p-1.5 bg-slate-950/80 border border-white/15 rounded-2xl mb-6 relative"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => switchMode('login')}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    mode === 'login'
                      ? 'text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_4px_20px_rgba(168,85,247,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => switchMode('register')}
                  className={`py-2.5 text-xs font-extrabold rounded-xl transition-all relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    mode === 'register'
                      ? 'text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_4px_20px_rgba(168,85,247,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>
            )}

            {/* Official Google OAuth Button */}
            {mode !== 'forgot' && mode !== 'update-password' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={signInWithGoogle}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.25)]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full animate-spin border-slate-950 border-t-transparent" />
                      <span>{t('login.redirigiendo')}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>{t('login.continuar_google')}</span>
                    </>
                  )}
                </motion.button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative px-3 text-[11px] uppercase tracking-widest font-mono text-slate-400 bg-[#090a12]">
                    o ingresar con email
                  </span>
                </div>
              </>
            )}

            {/* Form Fields */}
            <AnimatePresence mode="wait">
              {sentVerification ? (
                <motion.div
                  key="verification-sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-4 space-y-4"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Revisá tu casilla de email
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Enviamos un enlace de confirmación a{' '}
                      <strong className="text-cyan-400">{email}</strong>
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Si no lo encontrás en unos minutos, revisá la carpeta de Spam.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchMode('login')}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all shadow-lg"
                  >
                    Volver a iniciar sesión
                  </motion.button>
                </motion.div>
              ) : sentReset ? (
                <motion.div
                  key="reset-sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-4 space-y-4"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <KeyRound className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Instrucciones enviadas</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Te enviamos un email a <strong className="text-emerald-400">{email}</strong>{' '}
                      para restablecer tu contraseña.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => switchMode('login')}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white transition-all border border-white/20"
                  >
                    Volver al inicio de sesión
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  {/* Name Input */}
                  {mode === 'register' && (
                    <div className="space-y-1.5">
                      <label htmlFor="reg-name" className="text-xs font-bold text-slate-200 ml-1">
                        Nombre completo
                      </label>
                      <div
                        className={`relative rounded-2xl border transition-all duration-200 ${
                          focusedInput === 'name'
                            ? 'bg-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.25)]'
                            : 'bg-slate-950/80 border-white/15 hover:border-white/25'
                        }`}
                      >
                        <User
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'name' ? 'text-cyan-400' : 'text-slate-400'}`}
                        />
                        <input
                          id="reg-name"
                          type="text"
                          value={name}
                          onFocus={() => setFocusedInput('name')}
                          onBlur={() => setFocusedInput(null)}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tu nombre"
                          autoComplete="name"
                          className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input (hidden in update-password) */}
                  {mode !== 'update-password' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="login-email"
                        className="text-xs font-bold text-slate-200 ml-1"
                      >
                        Correo electrónico
                      </label>
                      <div
                        className={`relative rounded-2xl border transition-all duration-200 ${
                          focusedInput === 'email'
                            ? 'bg-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.25)]'
                            : 'bg-slate-950/80 border-white/15 hover:border-white/25'
                        }`}
                      >
                        <Mail
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'email' ? 'text-cyan-400' : 'text-slate-400'}`}
                        />
                        <input
                          id="login-email"
                          type="email"
                          value={email}
                          onFocus={() => setFocusedInput('email')}
                          onBlur={() => setFocusedInput(null)}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nombre@empresa.com"
                          autoComplete="email"
                          className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Input */}
                  {mode !== 'forgot' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <label htmlFor="login-pass" className="text-xs font-bold text-slate-200">
                          {mode === 'update-password' ? 'Nueva contraseña' : t('login.contrasena')}
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                          >
                            ¿Olvidaste tu contraseña?
                          </button>
                        )}
                      </div>
                      <div
                        className={`relative rounded-2xl border transition-all duration-200 ${
                          focusedInput === 'password'
                            ? 'bg-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.25)]'
                            : 'bg-slate-950/80 border-white/15 hover:border-white/25'
                        }`}
                      >
                        <Lock
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'password' ? 'text-cyan-400' : 'text-slate-400'}`}
                        />
                        <input
                          id="login-pass"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete={
                            mode === 'register' || mode === 'update-password'
                              ? 'new-password'
                              : 'current-password'
                          }
                          className="w-full rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password Input for update-password */}
                  {mode === 'update-password' && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="confirm-pass"
                        className="text-xs font-bold text-slate-200 ml-1"
                      >
                        Confirmar nueva contraseña
                      </label>
                      <div
                        className={`relative rounded-2xl border transition-all duration-200 ${
                          focusedInput === 'confirmPassword'
                            ? 'bg-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.25)]'
                            : 'bg-slate-950/80 border-white/15 hover:border-white/25'
                        }`}
                      >
                        <Lock
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedInput === 'confirmPassword' ? 'text-cyan-400' : 'text-slate-400'}`}
                        />
                        <input
                          id="confirm-pass"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onFocus={() => setFocusedInput('confirmPassword')}
                          onBlur={() => setFocusedInput(null)}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Rules */}
                  {(mode === 'register' || mode === 'update-password') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5 pt-1"
                    >
                      <p className="text-[11px] font-bold text-slate-300 ml-1">
                        Requisitos de seguridad:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {passwordRules.map((rule) => {
                          const pass = rule.test(password)
                          return (
                            <div
                              key={rule.label}
                              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-xl border transition-colors ${
                                password.length === 0
                                  ? 'bg-slate-950/60 border-white/10 text-slate-400'
                                  : pass
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                              }`}
                            >
                              {password.length === 0 ? (
                                <div className="w-3 h-3 rounded-full border border-current opacity-40 shrink-0" />
                              ) : pass ? (
                                <Check className="w-3 h-3 shrink-0" />
                              ) : (
                                <X className="w-3 h-3 shrink-0" />
                              )}
                              <span>{rule.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Primary Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      onClick={validateAndSubmit}
                      className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide uppercase transition-all bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
                          <span>
                            {mode === 'login'
                              ? 'Ingresando...'
                              : mode === 'register'
                                ? 'Creando cuenta...'
                                : 'Enviando email...'}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span>
                            {mode === 'login'
                              ? t('login.iniciar_sesion')
                              : mode === 'register'
                                ? 'Crear cuenta'
                                : mode === 'forgot'
                                  ? 'Enviar instrucciones'
                                  : 'Guardar nueva contraseña'}
                          </span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Toggle Back */}
                  {(mode === 'forgot' || mode === 'update-password') && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        ← Cancelar y volver al inicio de sesión
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notice */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-xs font-bold p-3 rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-300 flex items-start gap-2"
              >
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Trust Features Footer Grid */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-400">
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cifrado E2E</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Uptime 99.9%</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auth Supabase</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center text-[11px] text-slate-500 py-2 font-mono">
        © 2025 ExeSistemasWEB — Todos los derechos reservados.
      </footer>
    </div>
  )
}
