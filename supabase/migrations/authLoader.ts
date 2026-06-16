import { redirect } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * A loader to protect routes. If no session exists,
 * it redirects to the login page.
 */
export async function protectedRouteLoader() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }

  return { session }
}
