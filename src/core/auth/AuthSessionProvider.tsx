import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../infra/supabase/client'
import { resolveAuthSession } from './resolveAuthSession'
import { hasAuthCallbackInUrl } from './siteUrl'

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

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setReady(true)
    })

    async function bootstrap() {
      try {
        const isCallback = hasAuthCallbackInUrl()
        await resolveAuthSession()
        const { data } = await supabase.auth.getSession()
        if (mounted) setSession(data.session)
        if (!isCallback || data.session) {
          if (mounted) setReady(true)
        }
      } catch {
        if (mounted) setReady(true)
      }
    }

    bootstrap()

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
