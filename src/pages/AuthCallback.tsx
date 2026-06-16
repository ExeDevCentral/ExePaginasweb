import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../core/infra/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()
  const handled = useRef(false)
  const [debugMsg, setDebugMsg] = useState('auth.callback · handshake')

  useEffect(() => {
    let mounted = true

    const timeout = setTimeout(() => {
      if (!handled.current) {
        setDebugMsg('auth.error · timeout_15s')
        setTimeout(() => {
          if (mounted) navigate('/login?error=timeout', { replace: true })
        }, 2000)
      }
    }, 15_000)

    // Verificar si ya hay sesión PRIMERO (el exchange pudo haber ocurrido ya)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || handled.current) return
      if (session) {
        handled.current = true
        clearTimeout(timeout)
        setDebugMsg('auth.ok · sesión encontrada')
        setTimeout(() => {
          if (mounted) navigate('/dashboard', { replace: true })
        }, 500)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || handled.current) return
      console.log('AuthCallback event:', event, !!session)

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        handled.current = true
        clearTimeout(timeout)
        subscription.unsubscribe()
        setDebugMsg('auth.ok · redirigiendo...')
        setTimeout(() => {
          if (mounted) navigate('/dashboard', { replace: true })
        }, 500)
      }

      if (event === 'SIGNED_OUT') {
        handled.current = true
        clearTimeout(timeout)
        subscription.unsubscribe()
        setDebugMsg('auth.error · signed_out')
        setTimeout(() => {
          if (mounted) navigate('/login?error=signed_out', { replace: true })
        }, 2000)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 max-w-lg w-full bg-card border border-border rounded-3xl backdrop-blur-xl">
        <div className="w-12 h-12 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground font-medium text-lg">Verificando sesión segura...</p>
        <p className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-4 rounded-xl border border-border text-left break-all">
          {debugMsg}
        </p>
      </div>
    </div>
  )
}
