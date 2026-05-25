import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Helmet><title>404 - Página no encontrada | ExeSistemasWEB</title></Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-black text-accent-cyan/30">404</p>
        <h1 className="text-3xl font-bold text-white mt-4">Página no encontrada</h1>
        <p className="text-primary-secondary mt-2">La página que buscás no existe o fue movida.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-2xl text-primary-bg font-bold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </button>
      </motion.div>
    </div>
  )
}
