'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthSession } from './AuthSessionProvider'
import { useAuthRole, type Role } from './userAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: Role
  fallback?: string
}

export function AuthGuard({ children, requiredRole, fallback = '/login' }: AuthGuardProps) {
  const { ready, session } = useAuthSession()
  const { role, loading } = useAuthRole()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!ready || loading) return

    if (!session) {
      router.replace(`${fallback}?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }

    if (requiredRole && role !== requiredRole && role !== 'admin') {
      router.replace('/')
    }
  }, [ready, loading, session, role, requiredRole, fallback, router, pathname])

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-mono">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return null
  }

  return <>{children}</>
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>
}
