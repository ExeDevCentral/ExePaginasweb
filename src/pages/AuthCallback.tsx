import { useEffect, useRef, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'

const PremiumBackground = lazy(() => import('../components/Effects/PremiumBackground'))

export default function AuthCallback() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const err = params.get('error')
      const errDesc = params.get('error_description')

      if (err) {
        const msg = errDesc || err
        if (window.opener) {
          window.opener.postMessage({ type: 'PKCE_ERROR', error: msg }, window.location.origin)
          window.close()
        } else {
          navigate('/login?error=' + encodeURIComponent(msg), { replace: true })
        }
        return
      }

      if (!code) {
        if (window.opener) {
          window.opener.postMessage(
            { type: 'PKCE_ERROR', error: 'No code in URL' },
            window.location.origin
          )
          window.close()
        } else {
          navigate('/login?error=no_code', { replace: true })
        }
        return
      }

      // Popup mode: send code to opener and close
      if (window.opener) {
        window.opener.postMessage({ type: 'PKCE_CODE', code }, window.location.origin)
        window.close()
        return
      }

      // Redirect mode (popup blocked / mobile): try window.name fallback
      const verifier = window.name
      window.name = ''
      if (verifier) {
        const url = new URL(import.meta.env.VITE_SUPABASE_URL)
        const storageKey = `sb-${url.hostname.split('.')[0]}-auth-token-code-verifier`
        localStorage.setItem(storageKey, JSON.stringify(verifier))
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (data?.session) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/login?error=' + encodeURIComponent(error?.message || 'no_session'), {
            replace: true,
          })
        }
      } catch (e) {
        navigate('/login?error=' + encodeURIComponent(e instanceof Error ? e.message : 'error'), {
          replace: true,
        })
      }
    }

    run()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <Suspense fallback={null}>
        <PremiumBackground />
      </Suspense>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Logo animated */}
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
        <p className="text-muted-foreground text-sm font-medium">Autenticando...</p>
        <p className="text-xs text-muted-foreground/50 mt-2 font-mono">auth.exe · handshake</p>
      </motion.div>
    </div>
  )
}
