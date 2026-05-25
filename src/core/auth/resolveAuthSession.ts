import { supabase } from '../infra/supabase/client'

export async function resolveAuthSession(): Promise<void> {
  const { hash, search } = window.location

  const code =
    new URLSearchParams(search).get('code') ||
    new URLSearchParams(hash.replace('#', '?')).get('code')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth] Error exchanging PKCE code:', error.message)
    }
    // Limpiar el código de la URL
    const cleanUrl = window.location.pathname
    window.history.replaceState(window.history.state, '', cleanUrl)
    return
  }

  await supabase.auth.getSession()
}
