import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const err = params.get('error')
      const errDesc = params.get('error_description')

      const type = params.get('type')
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      const isRecovery = type === 'recovery' || hashParams.get('type') === 'recovery'

      const isPopup = window.opener && !window.opener.closed

      if (err) {
        const msg = errDesc || err
        if (isPopup) {
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_ERROR', error: msg },
            window.location.origin
          )
          window.close()
        } else {
          navigate('/login?error=' + encodeURIComponent(msg), { replace: true })
        }
        return
      }

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          if (data?.session) {
            if (isPopup) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin)
              window.close()
              return
            } else {
              const target = isRecovery ? '/login?mode=update-password' : '/dashboard'
              navigate(target, { replace: true })
              return
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Error al intercambiar código'
          if (isPopup) {
            window.opener.postMessage(
              { type: 'GOOGLE_AUTH_ERROR', error: msg },
              window.location.origin
            )
            window.close()
            return
          } else {
            navigate('/login?error=' + encodeURIComponent(msg), { replace: true })
            return
          }
        }
      }

      // Fallback check existing session
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session) {
        if (isPopup) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin)
          window.close()
        } else {
          const target = isRecovery ? '/login?mode=update-password' : '/dashboard'
          navigate(target, { replace: true })
        }
      } else {
        if (isPopup) {
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_ERROR', error: 'no_session' },
            window.location.origin
          )
          window.close()
        } else {
          navigate('/login?error=no_session', { replace: true })
        }
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-card/50 border border-border backdrop-blur-xl flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/logo.webp" alt="Logo" width="48" height="48" className="opacity-80" />
          </motion.div>
        </motion.div>

        <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-medium">Autenticando con Google...</p>
        <p className="text-xs text-muted-foreground/50 mt-2 font-mono">auth.exe · handshake</p>
      </motion.div>
    </div>
  )
}
