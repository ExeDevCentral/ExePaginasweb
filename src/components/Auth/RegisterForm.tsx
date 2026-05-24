import { useState } from 'react'
import { supabase } from '../../core/infra/supabase/client'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      })

      if (error) throw error
      
      setMessage({ 
        type: 'success', 
        text: '¡Registro exitoso! Por favor revisa tu email para confirmar tu cuenta.' 
      })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al registrarse' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@ejemplo.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-cyan/50 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-white/60 ml-1 uppercase tracking-wider">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-cyan/50 transition-colors"
          />
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-sm font-bold border ${
            message.type === 'error' 
              ? 'bg-accent-magenta/10 border-accent-magenta/20 text-accent-magenta' 
              : 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="w-full bg-white text-primary-bg py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-accent-cyan transition-colors disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Crear mi cuenta'}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </form>
  )
}