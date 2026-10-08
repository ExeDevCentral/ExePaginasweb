function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../infra/supabase/client'
import { getAuthRedirectUrl } from './siteUrl'
import { useAuthSession } from './AuthSessionProvider'

let cachedRole = null
let cachedUserId = null

export function useAuthRole() {
  const { ready, session } = useAuthSession()
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('unknown')
  const [loading, setLoading] = useState(true)

  const resolveRole = useCallback(async (userId) => {
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

    const u = _optionalChain([session, 'optionalAccess', (_) => _.user])
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

    const appUser = { id: u.id, email: _nullishCoalesce(u.email, () => null) }
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
