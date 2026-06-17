import { useEffect, useState } from 'react'
import { supabase } from '../infra/supabase/client'
import { getAuthRedirectUrl } from './siteUrl'

export type AppUser = {
  id: string
  email: string | null
}

export type Role = 'admin' | 'client' | 'unknown'

export function useAuthRole() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [role, setRole] = useState<Role>('unknown')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function resolveRole(u: { id: string; email: string | null } | null): Promise<Role> {
      if (!u?.id) return 'unknown'
      try {
        const { data: isAdmin, error } = await supabase.rpc('is_admin')
        if (error) return 'unknown'
        return isAdmin === true ? 'admin' : 'client'
      } catch {
        return 'unknown'
      }
    }

    async function init() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const s = sessionData.session
        const u = s?.user
        const nextUser = u ? { id: u.id, email: u.email ?? null } : null
        const nextRole = await resolveRole(nextUser)

        if (isMounted) {
          setUser(nextUser)
          setRole(nextRole)
        }
      } catch {
        if (isMounted) {
          setRole('unknown')
          setUser(null)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user
      const nextUser = u ? { id: u.id, email: u.email ?? null } : null
      const nextRole = await resolveRole(nextUser)

      if (isMounted) {
        setUser(nextUser)
        setRole(nextRole)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl('/auth/callback'),
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, role, loading, signInWithGoogle, signOut }
}
