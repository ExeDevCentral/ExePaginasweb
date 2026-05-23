import { motion } from 'framer-motion'
import { signInWithFacebook } from './authService'
import { Facebook } from 'lucide-react'


const AuthModal = () => {
  return (
    <div className="p-8 bg-primary-bg/80 backdrop-blur-xl border border-accent-cyan/30 rounded-[2.5rem] shadow-2xl max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-montserrat font-black text-white mb-2">
          Bienvenido a <span className="text-accent-cyan">ExeWeb</span>
        </h2>
        <p className="text-primary-secondary text-sm">Elige tu método preferido para ingresar</p>
      </div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.98 }}
         
          className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold transition-all"
        >
          <img src="https://www.gstatic.com/firebase/explore/google-logo.svg" className="w-5 h-5" alt="Google" />
          Continuar con Google
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(24, 119, 242, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={signInWithFacebook}
          className="w-full flex items-center justify-center gap-3 py-4 bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-2xl text-white font-semibold transition-all"
        >
          <Facebook className="text-[#1877F2]" size={20} />
          Continuar con Facebook
        </motion.button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-primary-secondary leading-relaxed">
          Al ingresar, aceptas nuestros <br />
          <a href="/terms" className="text-accent-magenta hover:underline">Términos de Servicio</a> y 
          <a href="/privacy" className="text-accent-magenta hover:underline ml-1">Privacidad</a>.
        </p>
      </div>
    </div>
  )
}

export default AuthModal