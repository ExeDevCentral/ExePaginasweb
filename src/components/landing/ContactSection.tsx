import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Globe, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import { sileo } from 'sileo'

const ContactSection = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+54 9 341 6874786',
      href: 'https://wa.me/5493416874786?text=¡Hola%20ExeSistemasWEB!%20Me%20contacto%20desde%20la%20web.%20Me%20interesa%20agendar%20una%20sesión%20de%20consultoría%20para%20automatizar%20las%20operaciones%20de%20mi%20negocio%20con%20un%20sistema%20a%20medida.',
      color: '#22c55e',
    },
    {
      icon: Globe,
      label: 'Web',
      value: 'Exepaginasweb.com',
      href: 'https://Exepaginasweb.com',
      color: '#a855f7',
    },
  ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setFeedback('')

    const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/contact' : '/api/contact'

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

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

        setStatus('success')
        setFeedback(t('contact.form_exito'))
        sileo.success({ title: t('contact.success_titulo'), description: t('contact.form_exito') })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        const data = await res.json()
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
    <section id="contact" className="relative px-4 py-28 sm:px-6 lg:px-8 overflow-hidden z-10">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-accent-cyan/8 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent-magenta/8 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">
            {t('contact.seccion_titulo')}
          </p>
          <h2 className="font-montserrat text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {t('contact.heading_1')}
            <br />
            <span className="relative inline-block">
              {t('contact.heading_2')}
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full" />
            </span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* FORM — big left card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 rounded-3xl border border-border bg-muted p-8 backdrop-blur-sm"
          >
            {status === 'success' ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <CheckCircle className="h-16 w-16 text-accent-cyan" />
                </motion.div>
                <h3 className="text-2xl font-bold">{t('contact.success_titulo')}</h3>
                <p className="text-primary-secondary">{feedback}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t('contact.success_otro')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <p className="text-sm text-primary-secondary mb-2">{t('contact.form_desc')}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group relative">
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-border bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all placeholder:text-muted-foreground focus:border-accent-cyan/60 focus:bg-slate-100"
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70"
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
                      className="peer w-full rounded-xl border border-border bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all placeholder:text-muted-foreground focus:border-accent-cyan/60 focus:bg-slate-100"
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70"
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
                    className="peer w-full rounded-xl border border-border bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all resize-none placeholder:text-muted-foreground focus:border-accent-cyan/60 focus:bg-slate-100"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70"
                  >
                    {t('contact.form_mensaje')}
                  </label>
                </div>

                {status === 'error' && <p className="text-sm text-accent-magenta">{feedback}</p>}

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-black/40 bg-muted px-6 py-4 font-semibold text-foreground transition-all hover:border-black hover:bg-accent-cyan/10 disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-border/30 border-t-foreground animate-spin" />
                      {t('contact.form_enviando')}
                    </>
                  ) : (
                    <>
                      {t('contact.form_submit')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* RIGHT COLUMN — contact chips */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {channels.map((ch, i) => {
              const Icon = ch.icon
              return (
                <motion.a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 flex-col justify-between rounded-3xl border border-border bg-muted p-6 backdrop-blur-sm transition-all hover:border-border hover:bg-muted"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                  whileHover={{ y: -2 }}
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${ch.color}15`, color: ch.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">
                      {ch.label === 'WhatsApp'
                        ? t('contact.whatsapp_label')
                        : t('contact.web_label')}
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-snug break-all">
                      {ch.value}
                    </p>
                  </div>
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-medium opacity-0 transition-all group-hover:opacity-100"
                    style={{ color: ch.color }}
                  >
                    {t('contact.abrir')} <ArrowRight className="h-3 w-3" />
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
