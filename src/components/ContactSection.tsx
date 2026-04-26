import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { Mail, MessageCircle, Globe, ArrowRight, CheckCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const ContactSection = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const channels = [
    { icon: Mail, label: 'Email', value: 'Exemetal@hotmail.com', href: 'mailto:Exemetal@hotmail.com', color: '#00ffff' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+54 9 341 6874786', href: 'https://wa.me/5493416874786', color: '#22c55e' },
    { icon: Globe, label: 'Web', value: 'Exepaginasweb.com', href: 'https://Exepaginasweb.com', color: '#a855f7' },
  ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setFeedback('')

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error')
      setFeedback('Error de configuración: faltan credenciales de EmailJS.')
      return
    }

    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        publicKey
      )

      if (result.status === 200) {
        setStatus('success')
        setFeedback('Mensaje enviado correctamente. Te respondemos lo antes posible.')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        throw new Error('Respuesta inesperada de EmailJS')
      }
    } catch (err) {
      console.error('[EmailJS] Error:', err)
      setStatus('error')
      setFeedback('No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.')
    }
  }

  return (
    <section
      id="contact"
      className="relative px-4 py-28 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    >
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
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-cyan/80">Contacto</p>
          <h2 className="font-montserrat text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Hablemos de
            <br />
            <span className="relative inline-block">
              tu nueva web
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
            className="lg:col-span-2 rounded-3xl border border-white/8 bg-white/3 p-8 backdrop-blur-sm"
          >
            {status === 'success' ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <CheckCircle className="h-16 w-16 text-accent-cyan" />
                </motion.div>
                <h3 className="text-2xl font-bold">¡Mensaje enviado!</h3>
                <p className="text-primary-secondary">{feedback}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium hover:bg-white/8 transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <p className="text-sm text-primary-secondary mb-2">
                  Estructura simple y moderna: eliges plan, definimos estilo y arrancamos tu página en tiempo récord.
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
                      className="peer w-full rounded-xl border border-white/10 bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-accent-cyan/60 focus:bg-slate-100"
                    />
                    <label htmlFor="contact-name" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70">
                      Nombre
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
                      className="peer w-full rounded-xl border border-white/10 bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-accent-cyan/60 focus:bg-slate-100"
                    />
                    <label htmlFor="contact-email" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70">
                      Correo electrónico
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
                    className="peer w-full rounded-xl border border-white/10 bg-slate-100/95 px-4 pb-3 pt-6 text-sm text-slate-900 outline-none transition-all resize-none placeholder:text-slate-400 focus:border-accent-cyan/60 focus:bg-slate-100"
                  />
                  <label htmlFor="contact-message" className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:tracking-widest peer-focus:text-accent-cyan/70">
                    ¿Qué tipo de web necesitas?
                  </label>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-accent-magenta">{feedback}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/6 px-6 py-4 font-semibold text-white transition-all hover:border-accent-cyan/50 hover:bg-accent-cyan/10 disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar propuesta
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
                  className="group flex flex-1 flex-col justify-between rounded-3xl border border-white/8 bg-white/3 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/6"
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-1">{ch.label}</p>
                    <p className="text-sm font-semibold text-white leading-snug break-all">{ch.value}</p>
                  </div>
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-medium opacity-0 transition-all group-hover:opacity-100"
                    style={{ color: ch.color }}
                  >
                    Abrir <ArrowRight className="h-3 w-3" />
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

