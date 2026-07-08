import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'

const TermsOfService: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-gray-300 pt-32 pb-20 px-6 font-inter">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-montserrat text-4xl md:text-5xl font-black mb-8 text-white">
            {t('termsofservice.titulo_main')}{' '}
            <span className="text-[#00FFFF]">{t('termsofservice.titulo_span')}</span>
          </h1>

          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
                {t('termsofservice.sec1_titulo')}
              </h2>
              <p>{t('termsofservice.sec1_texto')}</p>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
                {t('termsofservice.sec2_titulo')}
              </h2>
              <p>{t('termsofservice.sec2_texto')}</p>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
                {t('termsofservice.sec3_titulo')}
              </h2>
              <p>{t('termsofservice.sec3_texto')}</p>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
                {t('termsofservice.sec4_titulo')}
              </h2>
              <p>{t('termsofservice.sec4_texto')}</p>
            </section>

            <section className="p-6 rounded-2xl bg-card border border-border mt-12">
              <p className="text-sm italic">{t('termsofservice.footer_alerta')}</p>
            </section>

            <motion.div
              className="flex justify-center pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                to="/"
                className="px-8 py-3 rounded-full border border-[#00FFFF]/50 text-white font-montserrat font-bold hover:bg-[#00FFFF]/10 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300"
              >
                {t('termsofservice.boton_volver')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default TermsOfService
