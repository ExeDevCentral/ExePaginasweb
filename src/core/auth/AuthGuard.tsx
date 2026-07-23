import { Navigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-mono">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>
}
