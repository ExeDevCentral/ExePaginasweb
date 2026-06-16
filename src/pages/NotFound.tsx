import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Helmet>
        <title>{t('notfound.meta_title')}</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-black text-accent-cyan/30">404</p>
        <h1 className="text-3xl font-bold text-white mt-4">{t('notfound.titulo')}</h1>
        <p className="text-primary-secondary mt-2">{t('notfound.descripcion')}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-2xl text-primary-bg font-bold hover:opacity-90 transition-opacity"
        >
          {t('notfound.boton')}
        </button>
      </motion.div>
    </div>
  )
}
