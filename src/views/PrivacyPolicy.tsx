/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Shield,
  Lock,
  Globe,
  Database,
  UserCheck,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const COUNTRIES = [
  { id: 'ar', flag: '🇦🇷', label: 'Argentina / LATAM' },
  { id: 'us', flag: '🇺🇸', label: 'USA / Global' },
  { id: 'eu', flag: '🇪🇺', label: 'Unión Europea (DE/FR)' },
  { id: 'br', flag: '🇧🇷', label: 'Brasil' },
  { id: 'cn', flag: '🇨🇳', label: 'China (中国)' },
  { id: 'me', flag: '🇸🇦', label: 'Middle East (الشرق الأوسط)' },
]

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation()
  const [selectedCountry, setSelectedCountry] = useState('ar')

  const sections = [
    {
      id: 'sec1',
      icon: Shield,
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10',
      border: 'border-accent-cyan/20',
    },
    {
      id: 'sec2',
      icon: Lock,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
    },
    {
      id: 'sec3',
      icon: Database,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
    },
    {
      id: 'sec4',
      icon: Globe,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
    },
    {
      id: 'sec5',
      icon: UserCheck,
      color: 'text-accent-magenta',
      bg: 'bg-accent-magenta/10',
      border: 'border-accent-magenta/20',
    },
    {
      id: 'sec6',
      icon: Building2,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col justify-between">
      <Header />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('privacypolicy.boton_volver') || '← Volver al inicio'}
          </Link>

          {/* Title Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-accent-cyan" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t('privacypolicy.badge_legal') || 'Protección de Datos & Privacidad Global'}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                {t('privacypolicy.titulo_main')}{' '}
                <span className="text-gradient">{t('privacypolicy.titulo_span')}</span>
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-3xl leading-relaxed">
            {t('privacypolicy.subtitulo')}
          </p>

          {/* General Privacy Sections 1 to 6 */}
          <div className="space-y-6 leading-relaxed mb-14">
            {sections.map((sec, index) => {
              const Icon = sec.icon
              return (
                <motion.section
                  key={sec.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * (index + 1) }}
                  className="rounded-2xl bg-card/60 border border-border/80 hover:border-accent-cyan/40 p-6 backdrop-blur-md transition-all shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${sec.bg} border ${sec.border} shrink-0 mt-0.5`}
                    >
                      <Icon className={`w-5 h-5 ${sec.color}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                        {t(`privacypolicy.${sec.id}_titulo`)}
                      </h2>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {t(`privacypolicy.${sec.id}_texto`)}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )
            })}
          </div>

          {/* Country-Specific Privacy Legal Adaptation Interactive Matrix */}
          <div className="rounded-3xl bg-card/80 border border-accent-magenta/30 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl mb-12">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent-magenta/5 rounded-full blur-3xl -z-10" />

            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-6 h-6 text-accent-magenta" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {t('privacypolicy.paises_titulo')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('privacypolicy.paises_subtitulo')}
            </p>

            {/* Country Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {COUNTRIES.map((c) => {
                const isActive = selectedCountry === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountry(c.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent-magenta text-white font-semibold shadow-md shadow-accent-magenta/20 scale-105'
                        : 'bg-muted/40 hover:bg-muted/80 text-foreground/80 border border-border'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Country Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCountry}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-5 sm:p-6 rounded-2xl bg-background/80 border border-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {t(`privacypolicy.pais_${selectedCountry}_titulo`)}
                  </h4>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
                    {t(`privacypolicy.pais_${selectedCountry}_badge`)}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t(`privacypolicy.pais_${selectedCountry}_texto`)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Notice */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs sm:text-sm text-muted-foreground text-center">
            {t('privacypolicy.footer_alerta')}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
