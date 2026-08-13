import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import * as Sentry from '@sentry/react'
import { supabase } from '../infra/supabase/client'

type AuthSessionContextValue = {
  ready: boolean
  session: Session | null
}

const AuthSessionContext = createContext<AuthSessionContextValue>({
  ready: false,
  session: null,
})

export function useAuthSession() {
  return useContext(AuthSessionContext)
}

export function AuthSessionProvider({ children }: { readonly children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let mounted = true

    const syncSentryUser = (currentSession: Session | null) => {
      if (currentSession?.user) {
        Sentry.setUser({ id: currentSession.user.id, email: currentSession.user.email })
      } else {
        Sentry.setUser(null)
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      syncSentryUser(nextSession)
      setReady(true)
    })

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      syncSentryUser(data.session)
      setReady(true)
    }

    init()

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ ready, session }), [ready, session])

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}
