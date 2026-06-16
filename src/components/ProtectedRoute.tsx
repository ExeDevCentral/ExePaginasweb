import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../AuthContext'

export const ProtectedRoute = () => {
  const { user, profile, loading } = useAuth()

  // 1. MIENTRAS CARGA: No redirigir.
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        <p className="ml-4 font-montserrat">Verificando sesión...</p>
      </div>
    )
  }

  // 2. SIN USUARIO: Al inicio.
  if (!user) {
    return <Navigate to="/" replace />
  }

  // 3. CON USUARIO PERO SIN PERFIL TODAVÍA:
  // Mantenemos al usuario aquí. NO redirigimos a "/", sino se entra en loop.
  if (!profile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto mb-4"></div>
          <p className="font-montserrat text-xl mb-2">Preparando tu espacio...</p>
          <p className="text-gray-400 text-sm">Sincronizando datos de cliente...</p>
        </div>
      </div>
    )
  }

  // 4. TODO OK: Entra al Dashboard.
  return <Outlet />
}
