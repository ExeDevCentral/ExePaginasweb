'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Code2, MessageSquare, MonitorSmartphone, Send, Sparkles } from 'lucide-react'

const MobileLanding: React.FC = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleCopyQuote = () => {
    const quoteText = t(
      'versus.cita_destacada',
      '¿Por qué pagar indefinidamente por una plantilla que se parece a miles de otras tiendas, si podés tener una plataforma hecha específicamente para tu negocio y además recibir el código?'
    )
    navigator.clipboard.writeText(`"${quoteText}" — ExePaginasweb`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmitComment = () => {
    if (!comment.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setComment('')
    }, 3000)
  }

  return (
    <section className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
        {/* Badge MODELO DE NEGOCIO 2026 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-950/40 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            MODELO DE NEGOCIO 2026
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-black font-montserrat text-center text-slate-900 dark:text-white leading-tight"
        >
          Software Diseñado Alrededor de Tu Negocio
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm text-center text-slate-700 dark:text-slate-300 font-semibold leading-relaxed"
        >
          No te alquilamos una página. Te construimos una herramienta digital que es tuya.
        </motion.p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Title: Plataforma de alquiler vs. Herramienta propia */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-lg font-bold text-center text-slate-900 dark:text-white"
        >
          Plataforma de alquiler vs. Herramienta propia
        </motion.h2>

        {/* Diferencial Estratégico Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="w-full p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 backdrop-blur-2xl relative overflow-hidden shadow-[0_10px_40px_rgba(6,182,212,0.12)]"
        >
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Diferencial Estratégico</span>
            </div>

            <blockquote className="text-sm font-extrabold text-white leading-relaxed text-center font-display tracking-tight">
              &ldquo;¿Por qué pagar indefinidamente por una plantilla que se parece a miles de otras
              tiendas, si podés tener una plataforma hecha específicamente para tu negocio y además
              recibir el código?&rdquo;
            </blockquote>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-cyan-400/80 uppercase tracking-widest">
              <span className="w-6 h-px bg-gradient-to-r from-transparent to-cyan-400/60" />
              <span>Código Propio • Libertad Absoluta • Sin Mensualidades Ocultas</span>
              <span className="w-6 h-px bg-gradient-to-l from-transparent to-cyan-400/60" />
            </div>

            {/* Copy Button */}
            <motion.button
              type="button"
              onClick={handleCopyQuote}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-slate-900/80 text-cyan-300 text-[11px] font-bold transition-all duration-300 active:bg-cyan-500 active:text-slate-950"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Copiado!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3 h-3" />
                  <span>Copiar Frase Clave</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 100% CÓDIGO indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            100% CÓDIGO
          </span>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />

        {/* Comment Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Comentario
            </span>
          </div>

          <div className="flex gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribí tu comentario o consulta..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
            <motion.button
              type="button"
              onClick={handleSubmitComment}
              whileTap={{ scale: 0.92 }}
              disabled={!comment.trim()}
              className="self-end px-3 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:bg-cyan-700 transition-all"
            >
              <Send className="w-3 h-3" />
            </motion.button>
          </div>

          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-emerald-500 font-semibold mt-1.5"
            >
              Enviado! Gracias por tu comentario.
            </motion.p>
          )}
        </motion.div>

        {/* Mobile Version Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="w-full mt-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2.5"
        >
          <MonitorSmartphone className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Esta es la{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">versión móvil</span>{' '}
            optimizada. Abrí desde una{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">PC o tablet</span> para
            ver el sitio completo con todo su potencial.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default MobileLanding
