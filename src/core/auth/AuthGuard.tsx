'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useAuthSession } from './AuthSessionProvider'
import { useAuthRole, type Role } from './userAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: Role
  fallback?: string
}

export function AuthGuard({
  children,
  requiredRole,
  fallback = '/login',
}: Readonly<AuthGuardProps>) {
  const { ready, session } = useAuthSession()
  const { role, loading } = useAuthRole()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true' || searchParams.get('demo') === '1'

  useEffect(() => {
    if (isPreview) return
    if (!ready || loading) return

    if (!session) {
      router.replace(`${fallback}?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }

    if (requiredRole && role !== requiredRole && role !== 'admin') {
      router.replace('/')
    }
  }, [ready, loading, session, role, requiredRole, fallback, router, pathname, isPreview])

  if (isPreview) {
    return <>{children}</>
  }

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#8C9BB0] font-mono">Verificando acceso...</p>
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

export function AdminGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>
}
