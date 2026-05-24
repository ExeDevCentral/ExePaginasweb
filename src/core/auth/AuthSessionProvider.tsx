import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../infra/supabase/client'
import { resolveAuthSession } from './resolveAuthSession'

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

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        await resolveAuthSession()
        const { data } = await supabase.auth.getSession()
        if (mounted) setSession(data.session)
      } finally {
        if (mounted) setReady(true)
      }
    }

    bootstrap()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession)
      if (mounted) setReady(true)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthSessionContext.Provider value={{ ready, session }}>
      {children}
    </AuthSessionContext.Provider>
  )
}
