import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './src/core/infra/supabase/client'

interface AuthContextType {
  user: any
  profile: any
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from('clientes').select('*').eq('id', userId).single()

      if (error) {
        console.warn('AuthProvider: No se encontró perfil en clientes:', error.message)
        return null
      }
      return data
    } catch {
      return null
    }
  }, [])

  const createProfileFallback = useCallback(async (user: any) => {
    try {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Nuevo Usuario'
      const { data, error } = await supabase
        .from('clientes')
        .insert([
          {
            id: user.id,
            email: user.email,
            nombre: name,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('AuthProvider: Error al crear perfil fallback:', error.message)
        return null
      }
      console.log('AuthProvider: Perfil fallback creado exitosamente.')
      return data
    } catch (err) {
      console.error('AuthProvider: Excepción al crear perfil fallback:', err)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return

      console.log('🔔 AUTH EVENT:', event)

      if (session?.user) {
        setUser(session.user)
        let data = await fetchProfile(session.user.id)

        // Si no se encuentra perfil, reintentamos después de un delay por si el trigger está trabajando
        if (!data && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          console.log('⏳ Esperando creación de perfil en DB...')
          setTimeout(async () => {
            if (!mounted) return
            data = await fetchProfile(session.user.id)

            // Si el reintento falla (el trigger de la base de datos no existe o falló),
            // creamos el perfil desde el frontend (mecanismo fail-safe)
            if (!data) {
              console.log('⚠️ Creando perfil fallback desde el cliente...')
              data = await createProfileFallback(session.user)
            }

            setProfile(data)
            setLoading(false)
          }, 2000)
          return
        }

        setProfile(data)
      } else {
        setUser(null)
        setProfile(null)
      }

      if (mounted) setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id).then((data) => {
          if (mounted) {
            setProfile(data)
            if (data) setLoading(false)
          }
        })
      } else {
        setLoading(false) // si no hay sesión, liberar inmediato
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, createProfileFallback])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
