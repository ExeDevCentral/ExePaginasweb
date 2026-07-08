import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'

const PrivacyPolicy: React.FC = () => {
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
            {t('privacypolicy.titulo_main')}{' '}
            <span className="text-[#FF00FF]">{t('privacypolicy.titulo_span')}</span>
          </h1>

          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
                {t('privacypolicy.sec1_titulo')}
              </h2>
              <p>{t('privacypolicy.sec1_texto')}</p>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
                {t('privacypolicy.sec2_titulo')}
              </h2>
              <p>{t('privacypolicy.sec2_texto')}</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>{t('privacypolicy.sec2_li1')}</li>
                <li>{t('privacypolicy.sec2_li2')}</li>
                <li>{t('privacypolicy.sec2_li3')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
                {t('privacypolicy.sec3_titulo')}
              </h2>
              <p>{t('privacypolicy.sec3_texto')}</p>
            </section>

            <section>
              <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
                {t('privacypolicy.sec4_titulo')}
              </h2>
              <p>{t('privacypolicy.sec4_texto')}</p>
            </section>

            <section className="p-6 rounded-2xl bg-card/80 border border-border backdrop-blur-sm mt-12">
              <p className="text-sm">{t('privacypolicy.footer_alerta')}</p>
            </section>

            <motion.div
              className="flex justify-center pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                to="/"
                className="px-8 py-3 rounded-full border border-[#FF00FF]/50 text-white font-montserrat font-bold hover:bg-[#FF00FF]/10 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all duration-300"
              >
                {t('privacypolicy.boton_volver')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default PrivacyPolicy
