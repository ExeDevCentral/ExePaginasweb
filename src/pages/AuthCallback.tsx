import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../core/infra/supabase/client'

/**
 * Ruta intermedia que procesa el callback de Google OAuth (PKCE).
 *
 * Flujo:
 * 1. Google redirige aquí con ?code=xxx en la URL.
 * 2. El SDK de Supabase detecta el code e intercambia por una sesión real.
 * 3. onAuthStateChange dispara SIGNED_IN con la sesión confirmada.
 * 4. Recién ahí navegamos a /dashboard — sin loop.
 *
 * Si algo sale mal (timeout o error), redirige a /login con mensaje.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const handled = useRef(false)

  useEffect(() => {
    // Timeout de seguridad: si en 10s no hay sesión, volvemos al login
    const timeout = setTimeout(() => {
      if (!handled.current) {
        handled.current = true
        console.error('AuthCallback: timeout esperando sesión')
        navigate('/login?error=timeout', { replace: true })
      }
    }, 10_000)

    // Escuchamos el evento de autenticación del SDK
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (handled.current) return

      console.log('AuthCallback event:', event)

      if (event === 'SIGNED_IN' && session) {
        handled.current = true
        clearTimeout(timeout)
        subscription.unsubscribe()
        // Sesión 100% confirmada → navegamos al dashboard limpiamente
        navigate('/dashboard', { replace: true })
        return
      }

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Evento inesperado — redirigimos al login de forma segura
        if (!session) {
          handled.current = true
          clearTimeout(timeout)
          subscription.unsubscribe()
          navigate('/login', { replace: true })
        }
      }
    })

    // También revisamos si ya hay sesión activa (por si el evento ya fue disparado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (handled.current) return
      if (session) {
        handled.current = true
        clearTimeout(timeout)
        subscription.unsubscribe()
        navigate('/dashboard', { replace: true })
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-primary-secondary font-medium">Verificando sesión...</p>
        <p className="mt-2 text-xs text-white/30 font-mono">auth.callback · handshake</p>
      </div>
    </div>
  )
}
