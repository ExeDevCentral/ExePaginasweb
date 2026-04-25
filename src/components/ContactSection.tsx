import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { Mail, MessageCircle, PhoneCall } from 'lucide-react'

const ContactSection = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const channels = [
    { icon: Mail, label: 'Email', value: 'Exemetal@hotmail.com' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+54 9 341 6874786' },
    { icon: PhoneCall, label: 'Web', value: 'https://Exepaginasweb.com' },
  ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'No se pudo enviar el mensaje.')
      }

      setStatus('success')
      setFeedback('Mensaje enviado. Te respondemos por correo lo antes posible.')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setFeedback('No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.')
    }
  }

  return (
    <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-accent-magenta/35 bg-gradient-to-br from-primary-bg/80 to-primary-bg/40 p-8 shadow-2xl shadow-accent-magenta/10 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-accent-cyan">Contact</p>
          <h2 className="mt-3 font-montserrat text-4xl font-extrabold tracking-tight md:text-5xl">Hablemos de tu nueva web</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-secondary">
            Estructura simple y moderna: eliges plan, definimos estilo y arrancamos tu pagina en tiempo record.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <article
                key={channel.label}
                className="group flex flex-col items-center text-center rounded-2xl border border-accent-cyan/25 bg-primary-bg/55 p-6 transition duration-300 hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/5"
              >
                <div className="p-3 rounded-full bg-accent-cyan/10 text-accent-cyan transition-colors group-hover:bg-accent-cyan group-hover:text-primary-bg">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-primary-secondary font-medium">{channel.label}</p>
                <p className="mt-2 text-lg font-bold tracking-tight">{channel.value}</p>
              </article>
            )
          })}
        </div>

        <form className="mt-10 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Nombre"
            className="rounded-xl border border-accent-cyan/25 bg-primary-bg/60 px-4 py-3 outline-none transition focus:border-accent-cyan"
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="Correo"
            className="rounded-xl border border-accent-cyan/25 bg-primary-bg/60 px-4 py-3 outline-none transition focus:border-accent-cyan"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            placeholder="Cuentanos que tipo de web necesitas"
            className="md:col-span-2 min-h-28 rounded-xl border border-accent-cyan/25 bg-primary-bg/60 px-4 py-3 outline-none transition focus:border-accent-cyan"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary md:col-span-2 justify-self-start disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar propuesta'}
          </button>
          {feedback && (
            <p
              className={`md:col-span-2 text-sm ${
                status === 'success' ? 'text-accent-cyan' : 'text-accent-magenta'
              }`}
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default ContactSection
