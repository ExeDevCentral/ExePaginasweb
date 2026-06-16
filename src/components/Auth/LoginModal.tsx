import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Mail } from 'lucide-react'
import { useAuthRole } from '../../core/auth/userAuth'
import { ADMIN_EMAILS } from '../../core/auth/roleConfig'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { role, loading, signInWithGoogle } = useAuthRole(ADMIN_EMAILS)

  const statusText = useMemo(() => {
    if (loading) return 'Cargando sesión...'
    if (role === 'admin') return 'Admin detectado ✅'
    if (role === 'client') return 'Sesión iniciada ✅'
    return 'Inicia sesión para continuar'
  }, [loading, role])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 14 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-md w-full bg-gradient-to-br from-card to-muted backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center bg-muted hover:bg-muted/80 border border-border hover:border-border/80 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">Acceso requerido</h3>
          <p className="text-sm text-muted-foreground">{statusText}</p>

          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar con Google
            </motion.button>

            <p className="text-xs text-muted-foreground">
              Clientes pueden crear su cuenta desde el login de Google / iPhone.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
