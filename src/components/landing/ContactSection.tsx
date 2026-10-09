/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, type SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, ArrowRight, CheckCircle, Mail, Send } from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import { toast } from 'sonner'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'
import HudButton from '@/components/HudButton'

const ContactSection = () => {
  const { t, i18n } = useTranslation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('exe_visitor_name')
      if (stored) {
        setName((curr) => curr || stored)
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, [])

  const channels = [
    {
      icon: MessageCircle,
      tag: 'WHATSAPP DIRECTO',
      value: DISPLAY_WHATSAPP_NUMBER,
      href: getWhatsAppUrl(
        '¡Hola ExeSistemasWEB! Me contacto desde la sección de contacto de la web.'
      ),
      tone: 'brand' as const,
    },
    {
      icon: Mail,
      tag: 'CONTACTO & SOPORTE',
      value: 'Contacto@exepaginasweb.com',
      href: 'mailto:Exemetal@hotmail.com?subject=Contacto%20y%20Soporte%20ExeSistemasWEB&body=Hola%20ExeSistemasWEB,%20quisiera%20hacer%20una%20consulta:',
      tone: 'neutral' as const,
    },
    {
      icon: Send,
      tag: 'VENTAS & PROYECTOS',
      value: 'Ventas@exepaginasweb.com',
      href: 'mailto:Exemetal@hotmail.com?subject=Ventas%20y%20Proyectos%20ExeSistemasWEB&body=Hola%20ExeSistemasWEB,%20quisiera%20cotizar%20un%20proyecto:',
      tone: 'signal' as const,
    },
  ]

  const [ticketId, setTicketId] = useState('')

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setFeedback('')
    setTicketId('')

    if (name.trim()) {
      try {
        localStorage.setItem('exe_visitor_name', name.trim())
      } catch {
        // Ignorar errores de localStorage
      }
    }

    const apiUrl = '/api/contact'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, lang: i18n.language }),
      })

      const data = await res.json()

      if (res.ok) {
        supabase
          .from('leads')
          .insert({
            email,
            lead_type: 'contact',
            name,
            message,
          })
          .then(() => {})

        if (data.ticketId) {
          setTicketId(data.ticketId)
        }

        trackEvent('contact_form_submitted', {
          lang: i18n.language,
          ticketId: data.ticketId || 'none',
        })

        setStatus('success')
        const successMsg = data.message || t('contact.form_exito')
        setFeedback(successMsg)
        toast.success(t('contact.success_titulo'), {
          description: data.ticketId
            ? `Ticket generado: ${data.ticketId}. Revisa tu casilla de correo.`
            : successMsg,
        })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }
    } catch (err) {
      console.error('[Contact] Error:', err)
      const errorMsg = err instanceof Error ? err.message : t('contact.form_error_conexion')
      setStatus('error')
      setFeedback(`${t('contact.form_error_prefix')} ${errorMsg}`)
    }
  }

  return (
    <section
      id="contact"
      className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden z-10 border-t border-slate-200/80 dark:border-white/10"
    >
      <span id="contacto" className="absolute top-0" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header Editorial / Plano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand/10 border border-brand/25 text-brand dark:text-emerald-400 font-mono text-[11px] uppercase tracking-widest font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-emerald-400 animate-pulse" />
            <span>FIG. 03 — REGISTRO DE REQUERIMIENTOS // 2025</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            {t('contact.heading_1')}
            <br />
            <span className="font-serif italic font-normal text-brand dark:text-emerald-400">
              {t('contact.heading_2')}
            </span>
          </h2>
        </motion.div>

        {/* Bento grid de especificación técnica */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* FORM — Lámina Principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c1224]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06),0_4px_16px_rgba(6,182,212,0.06)] hover:border-cyan-500/50 hover:shadow-[0_24px_50px_-12px_rgba(6,182,212,0.18)] transition-all duration-300 relative overflow-hidden"
          >
            {/* Haz láser perimetral superior */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-0.75 bg-linear-to-r from-transparent via-cyan-500/80 to-transparent" />

            {/* Resplandor radial interno suave */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-40 bg-[radial-gradient(400px_circle_at_50%_0%,rgba(6,182,212,0.08),transparent_70%)]" />

            {/* Marcas de esquina técnicas (+) */}
            <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none">
              +
            </span>
            <span className="absolute top-2 right-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none">
              +
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none">
              +
            </span>
            <span className="absolute bottom-2 right-2 font-mono text-[10px] text-slate-300 dark:text-white/20 select-none pointer-events-none">
              +
            </span>

            {status === 'success' ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 py-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="rounded-sm bg-brand/10 p-3.5 border border-brand/30"
                >
                  <CheckCircle className="h-12 w-12 text-brand dark:text-emerald-400" />
                </motion.div>

                {ticketId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-sm border border-brand/35 bg-brand/10 px-3.5 py-1.5 font-mono text-xs font-bold text-brand dark:text-emerald-300 tracking-wider"
                  >
                    <span>TICKET //</span>
                    <span className="underline">{ticketId}</span>
                  </motion.div>
                )}

                <h3 className="text-2xl font-bold text-slate-950 dark:text-white font-display">
                  {t('contact.success_titulo')}
                </h3>
                <p className="max-w-md text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feedback}
                </p>

                <div className="w-full max-w-sm rounded-sm border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-left font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>ESTADO:</span>
                    <span className="font-bold text-brand dark:text-emerald-400">
                      INGRESADO & REGISTRADO
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>RESPUESTA ESTIMADA:</span>
                    <span className="font-bold text-signal">&lt; 2 HORAS HÁBILES</span>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(
                    `¡Hola ExePaginasWeb! Envié mi consulta desde la web. Ticket: ${ticketId || 'EXE-CNT'}. Nombre: ${name}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-brand hover:bg-brand/90 text-white font-mono font-bold px-5 py-3 text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Chat Directo en WhatsApp ({DISPLAY_WHATSAPP_NUMBER})</span>
                </a>

                <HudButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setStatus('idle')}
                  label={t('contact.success_otro')}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3 mb-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-white/40">
                    PLIEGO DE ENTRADA · ESPECIFICACIÓN DE PROYECTO
                  </span>
                  <span className="font-mono text-[10px] text-brand dark:text-emerald-400 font-bold">
                    [REQ-ONLINE]
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                  {t('contact.form_desc')}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group relative">
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 pb-2.5 pt-5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-muted-foreground focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-white/10 shadow-2xs"
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute left-4 top-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-cyan-600 dark:peer-focus:text-emerald-400"
                    >
                      {t('contact.form_nombre')}
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 pb-2.5 pt-5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-muted-foreground focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-white/10 shadow-2xs"
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute left-4 top-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-cyan-600 dark:peer-focus:text-emerald-400"
                    >
                      {t('contact.form_email')}
                    </label>
                  </div>
                </div>

                <div className="relative flex-1">
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder=" "
                    rows={5}
                    className="peer w-full rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 pb-2.5 pt-5 text-sm text-slate-900 dark:text-white outline-none transition-all resize-none placeholder:text-muted-foreground focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-white/10 shadow-2xs"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-4 top-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-cyan-600 dark:peer-focus:text-emerald-400"
                  >
                    {t('contact.form_mensaje')}
                  </label>
                </div>

                {status === 'error' && <p className="text-xs font-mono text-state">{feedback}</p>}

                <HudButton
                  type="submit"
                  disabled={status === 'sending'}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  label={
                    status === 'sending' ? t('contact.form_enviando') : t('contact.form_submit')
                  }
                  icon={
                    status === 'sending' ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )
                  }
                  iconPosition="right"
                />
              </form>
            )}
          </motion.div>

          {/* RIGHT COLUMN — Canales de comunicación directa */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {channels.map((ch, i) => {
              const Icon = ch.icon
              const isBrand = ch.tone === 'brand'
              const isSignal = ch.tone === 'signal'

              const channelLaser = isBrand
                ? 'via-emerald-400'
                : isSignal
                  ? 'via-amber-400'
                  : 'via-cyan-400'

              const channelHoverBorder = isBrand
                ? 'hover:border-emerald-500/60'
                : isSignal
                  ? 'hover:border-amber-500/60'
                  : 'hover:border-cyan-500/60'

              const channelHoverShadow = isBrand
                ? 'hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.22)]'
                : isSignal
                  ? 'hover:shadow-[0_16px_36px_-10px_rgba(245,158,11,0.22)]'
                  : 'hover:shadow-[0_16px_36px_-10px_rgba(6,182,212,0.22)]'

              const channelCornerHover = isBrand
                ? 'group-hover:text-emerald-500'
                : isSignal
                  ? 'group-hover:text-amber-500'
                  : 'group-hover:text-cyan-500'

              return (
                <motion.a
                  key={ch.tag}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex flex-1 flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c1224]/90 backdrop-blur-xl p-5.5 ${channelHoverBorder} shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] ${channelHoverShadow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                >
                  {/* Haz láser de borde */}
                  <div
                    className={`pointer-events-none absolute top-0 inset-x-0 h-0.75 bg-linear-to-r from-transparent ${channelLaser} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Marcas de cota técnica */}
                  <span
                    className={`absolute top-2 right-2.5 font-mono text-[9px] text-slate-300 dark:text-white/20 select-none ${channelCornerHover} transition-colors`}
                  >
                    +
                  </span>
                  <span
                    className={`absolute bottom-2 right-2.5 font-mono text-[9px] text-slate-300 dark:text-white/20 select-none ${channelCornerHover} transition-colors`}
                  >
                    +
                  </span>

                  <div
                    className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 shadow-inner ${
                      isBrand
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                        : isSignal
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                          : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1">
                      {ch.tag}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug break-all group-hover:text-brand dark:group-hover:text-emerald-400 transition-colors">
                      {ch.value}
                    </p>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1.5 font-mono text-xs font-bold text-brand dark:text-emerald-400 transition-all duration-200 group-hover:translate-x-1">
                    <span>{t('contact.abrir')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
