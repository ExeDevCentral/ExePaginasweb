import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../core/infra/supabase/client'

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
