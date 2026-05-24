import { supabase } from '../infra/supabase/client'
import { hasAuthCallbackInUrl } from './siteUrl'

/**
 * Intercambia el ?code= de OAuth (PKCE) por sesión y limpia la URL.
 * Debe ejecutarse una vez al arrancar la app en cualquier ruta.
 */
export async function resolveAuthSession(): Promise<void> {
  const { error } = await supabase.auth.getSession()
  if (error) {
    console.error('[auth] Error resolviendo sesión:', error.message)
    return
  }

  if (!hasAuthCallbackInUrl()) return

  const cleanPath = window.location.pathname + window.location.search
  window.history.replaceState(window.history.state, '', cleanPath)
}
