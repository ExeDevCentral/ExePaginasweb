import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import Header from '../components/layout/Header'

const PremiumBackground = lazy(() => import('../components/Effects/PremiumBackground'))

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Suspense fallback={null}>
        <PremiumBackground />
      </Suspense>
      <Header />
      <div className="relative z-10 pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('privacypolicy.boton_volver')}
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-accent-cyan" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-bold mb-1">
                Legal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                {t('privacypolicy.titulo_main')}{' '}
                <span className="text-gradient">{t('privacypolicy.titulo_span')}</span>
              </h1>
            </div>
          </div>

          <div className="space-y-8 leading-relaxed">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card/50 border border-border p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                <span className="w-1 h-5 bg-accent-cyan rounded-full" />
                {t('privacypolicy.sec1_titulo')}
              </h2>
              <p className="text-muted-foreground">{t('privacypolicy.sec1_texto')}</p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card/50 border border-border p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                <span className="w-1 h-5 bg-accent-magenta rounded-full" />
                {t('privacypolicy.sec2_titulo')}
              </h2>
              <p className="text-muted-foreground mb-4">{t('privacypolicy.sec2_texto')}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 shrink-0" />
                  {t('privacypolicy.sec2_li1')}
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta mt-2 shrink-0" />
                  {t('privacypolicy.sec2_li2')}
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 shrink-0" />
                  {t('privacypolicy.sec2_li3')}
                </li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card/50 border border-border p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                <span className="w-1 h-5 bg-accent-cyan rounded-full" />
                {t('privacypolicy.sec3_titulo')}
              </h2>
              <p className="text-muted-foreground">{t('privacypolicy.sec3_texto')}</p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-card/50 border border-border p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-3">
                <span className="w-1 h-5 bg-accent-magenta rounded-full" />
                {t('privacypolicy.sec4_titulo')}
              </h2>
              <p className="text-muted-foreground">{t('privacypolicy.sec4_texto')}</p>
            </motion.section>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-accent-cyan/5 to-accent-magenta/5 border border-border mt-12"
            >
              <p className="text-sm text-muted-foreground">{t('privacypolicy.footer_alerta')}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
