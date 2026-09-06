import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../infra/supabase/client'
import { getAuthRedirectUrl } from './siteUrl'
import { useAuthSession } from './AuthSessionProvider'

export type AppUser = {
  id: string
  email: string | null
}

export type Role = 'admin' | 'client' | 'work_member' | 'unknown'

let cachedRole: Role | null = null
let cachedUserId: string | null = null

export function useAuthRole() {
  const { ready, session } = useAuthSession()
  const [user, setUser] = useState<AppUser | null>(null)
  const [role, setRole] = useState<Role>('unknown')
  const [loading, setLoading] = useState(true)

  const resolveRole = useCallback(async (userId: string): Promise<Role> => {
    if (cachedUserId === userId && cachedRole) return cachedRole
    try {
      const { data: isAdmin, error } = await supabase.rpc('is_admin')
      if (error) throw error
      const resolved = isAdmin === true ? 'admin' : 'client'
      cachedUserId = userId
      cachedRole = resolved
      return resolved
    } catch (error) {
      console.error('[auth] Could not resolve user role:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!ready) return

    const u = session?.user
    if (!u) {
      setUser(null)
      setRole('unknown')
      setLoading(false)
      cachedRole = null
      cachedUserId = null
      return () => {
        cancelled = true
      }
    }

    const appUser = { id: u.id, email: u.email ?? null }
    setUser(appUser)

    resolveRole(u.id)
      .then((resolvedRole) => {
        if (cancelled) return
        setRole(resolvedRole)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setRole('unknown')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [ready, session, resolveRole])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl('/auth/callback'),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    cachedRole = null
    cachedUserId = null
    await supabase.auth.signOut()
  }

  return { user, role, loading: !ready || loading, signInWithGoogle, signOut }
}
