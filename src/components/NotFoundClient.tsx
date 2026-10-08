/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import HudButton from '@/components/HudButton'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

export default function NotFoundClient() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Switcher superior */}
      <div className="absolute top-6 right-6 z-30">
        <div className="rounded-sm bg-card/90 backdrop-blur-xl border border-border p-1 shadow-xs flex items-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Retícula sutil de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Lámina Central de Error 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg rounded-sm border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c0f1d] p-8 sm:p-10 shadow-xl text-center overflow-hidden"
      >
        {/* Marcas de esquina técnicas (+) */}
        <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none">
          +
        </span>
        <span className="absolute top-2 right-2 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none">
          +
        </span>
        <span className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none">
          +
        </span>
        <span className="absolute bottom-2 right-2 font-mono text-[10px] text-slate-400 dark:text-white/20 select-none">
          +
        </span>

        {/* Eyebrow de calibración */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-signal/10 border border-signal/30 text-signal font-mono text-[10px] uppercase tracking-widest font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          <span>ERROR 404 // COORDENADAS FUERA DE PLANO</span>
        </div>

        {/* 404 Técnico Mono */}
        <div className="font-mono text-7xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-widest select-none mb-2">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
          Plano no{' '}
          <span className="font-serif italic font-normal text-brand dark:text-emerald-400">
            encontrado
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 max-w-sm mx-auto leading-relaxed">
          {t(
            'notfound.descripcion',
            'La coordenada solicitada no se encuentra proyectada en los planos de arquitectura del sistema.'
          )}
        </p>

        {/* Cajetín técnico de diagnóstico */}
        <div className="mt-6 mb-8 text-left rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-white/40">
            <span>ESTADO:</span>
            <span className="text-signal font-bold">DESVIACIÓN DE RUTA</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-white/40">
            <span>SISTEMA:</span>
            <span className="text-slate-800 dark:text-slate-200">EXEPAGINASWEB // 2025</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-white/40">
            <span>PROTOCOLO:</span>
            <span className="text-brand dark:text-emerald-400 font-bold">
              RETORNO A PLANO MATRIZ
            </span>
          </div>
        </div>

        {/* Botón de retorno */}
        <div className="flex justify-center">
          <HudButton
            href="/"
            label={t('notfound.boton', 'Volver al plano principal')}
            size="lg"
            variant="primary"
            icon={<Home className="w-4 h-4" />}
            iconPosition="left"
          />
        </div>
      </motion.div>
    </div>
  )
}
