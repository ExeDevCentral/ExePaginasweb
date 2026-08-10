import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Brain, Sparkles, Send, Zap, Clock, Smartphone, MessageSquare } from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import { toast } from 'sonner'

const QUESTIONS = [
  { id: 'industry', qIdx: 1 },
  { id: 'pain_point', qIdx: 2 },
  { id: 'contact_channel', qIdx: 3 },
]

const OPTIONS = {
  industry: [
    { id: 'servicios', oIdx: 1 },
    { id: 'salud', oIdx: 2 },
    { id: 'comercio', oIdx: 3 },
    { id: 'educacion', oIdx: 4 },
  ],
  pain_point: [
    { id: 'soporte', oIdx: 1 },
    { id: 'turnos', oIdx: 2 },
    { id: 'pagos', oIdx: 3 },
    { id: 'stock', oIdx: 4 },
  ],
  contact_channel: [
    { id: 'whatsapp', oIdx: 1 },
    { id: 'instagram', oIdx: 2 },
    { id: 'web', oIdx: 3 },
    { id: 'llamada', oIdx: 4 },
  ],
}

export default function AutomationAudit() {
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'quiz' | 'email' | 'loading' | 'report'>('quiz')

  const currentQ = QUESTIONS[currentQuestion]
  const currentOptions = OPTIONS[currentQ.id as keyof typeof OPTIONS]

  const handleOptionSelect = (value: string) => {
    const qKey = currentQ.id
    setAnswers((prev) => ({ ...prev, [qKey]: value }))

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setStep('email')
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    supabase
      .from('leads')
      .insert({
        email,
        lead_type: 'automation_audit',
        metadata: { answers },
      })
      .then(() => {})

    setStep('loading')
    setTimeout(() => {
      setStep('report')
      toast.success('Reporte listo', {
        description: 'Tu auditoría de automatización está disponible',
      })
    }, 3000)
  }

  const resetAudit = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setEmail('')
    setStep('quiz')
  }

  const getReport = () => {
    const pain = answers.pain_point || 'default'
    const tKey = (key: string) => t(`audit.report_${pain}_${key}`)

    const iconMap: Record<string, JSX.Element> = {
      default: <Zap className="w-8 h-8 text-accent-cyan" />,
      soporte: <MessageSquare className="w-8 h-8 text-accent-cyan" />,
      turnos: <Clock className="w-8 h-8 text-accent-magenta" />,
      pagos: <Sparkles className="w-8 h-8 text-yellow-400" />,
      stock: <Smartphone className="w-8 h-8 text-emerald-400" />,
    }

    return {
      title: tKey('titulo'),
      description: tKey('desc'),
      recommendation: tKey('recomendacion'),
      icon: iconMap[pain] || iconMap.default,
    }
  }

  const reportData = step === 'report' ? getReport() : null

  return (
    <section
      id="automation-audit"
      className="py-32 px-4 relative overflow-hidden bg-transparent border-t border-border z-10"
    >
      {/* Mesh gradient background — two overlapping radial gradients for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-accent-cyan/[0.08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,_var(--tw-gradient-stops))] from-accent-magenta/[0.06] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,_var(--tw-gradient-stops))] from-accent-cyan/[0.04] via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Brain size={12} />
            {t('audit.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-outfit font-black text-foreground tracking-tight"
          >
            {t('audit.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-muted-foreground max-w-xl mx-auto text-base"
          >
            {t('audit.descripcion')}
          </motion.p>
        </div>

        <div className="rounded-[2.5rem] bg-card/60 backdrop-blur-xl p-8 md:p-12 min-h-[360px] flex flex-col justify-center relative overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.1),0_32px_64px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] before:absolute before:inset-0 before:rounded-[2.5rem] before:p-[1px] before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude]">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent-cyan/[0.06] blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent-magenta/[0.04] blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 'quiz' && (
              <motion.div
                key="quiz-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-black">
                    {t('audit.pregunta_label', {
                      current: currentQuestion + 1,
                      total: QUESTIONS.length,
                    })}
                  </span>
                  <div className="relative flex gap-1 h-2 w-28 bg-muted/50 rounded-full overflow-hidden ring-1 ring-white/[0.04]">
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background: 'linear-gradient(90deg, #00d4ff, #ff00ff, #00d4ff)',
                        backgroundSize: '200% 100%',
                      }}
                      animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    {QUESTIONS.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`relative flex-1 rounded-full ${
                          i <= currentQuestion
                            ? 'bg-accent-cyan shadow-[0_0_6px_rgba(0,212,255,0.5)]'
                            : 'bg-white/[0.06]'
                        }`}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {t(`audit.q_${currentQ.qIdx}_titulo`)}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-white/[0.06] hover:border-accent-cyan/40 hover:bg-accent-cyan/[0.03] text-primary-secondary hover:text-foreground transition-colors text-sm font-semibold flex items-center justify-between group shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,212,255,0.08),0_1px_2px_rgba(0,0,0,0.05)]"
                    >
                      <span>{t(`audit.q_${currentQ.qIdx}_op_${option.oIdx}`)}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-accent-cyan transition-all ml-2 shrink-0 -translate-x-1 group-hover:translate-x-0">
                        →
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'email' && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">
                    {t('audit.email_titulo')}
                  </h4>
                  <p className="text-muted-foreground text-sm">{t('audit.email_desc')}</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 pt-4">
                  <input
                    required
                    type="email"
                    placeholder={t('audit.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent-cyan text-sm transition-all"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-4 rounded-xl bg-accent-cyan text-black font-bold text-sm hover:shadow-[0_8px_24px_rgba(0,212,255,0.35)] transition-shadow flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/25 shrink-0"
                  >
                    {t('audit.email_boton')}
                    <Send size={14} />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div
                key="loading-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
              >
                <div className="relative w-20 h-20">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-accent-cyan/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-accent-magenta"
                    style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-accent-cyan">
                    <Brain size={28} className="animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="text-foreground font-bold text-sm">{t('audit.loading_titulo')}</h5>
                  <p className="text-xs text-muted-foreground font-mono">
                    {t('audit.loading_desc')}
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'report' && reportData && (
              <motion.div
                key="report-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                <div className="md:col-span-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0">
                      {reportData.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-accent-cyan font-bold uppercase tracking-widest">
                        {t('audit.report_sugerida')}
                      </span>
                      <h4 className="text-xl md:text-2xl font-outfit font-black text-foreground">
                        {reportData.title}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {reportData.description}
                    </p>
                    <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Zap size={14} className="text-accent-cyan" /> {t('audit.recomendacion')}
                      </p>
                      <p className="text-xs text-primary-secondary leading-relaxed font-sans">
                        {reportData.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 rounded-2xl bg-card border border-border p-6 space-y-4 text-center md:text-left self-stretch flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground">{t('audit.que_sigue')}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {t('audit.que_sigue_desc')}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-4">
                    <motion.a
                      href="#booking-demo"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full py-3 rounded-xl bg-accent-cyan text-black font-bold text-center text-xs hover:shadow-[0_8px_24px_rgba(0,212,255,0.35)] transition-shadow shadow-lg shadow-accent-cyan/20"
                    >
                      {t('audit.agendar')}
                    </motion.a>
                    <motion.button
                      onClick={resetAudit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full py-3 rounded-xl border border-white/[0.08] text-foreground/80 font-bold text-center text-xs hover:bg-white/[0.04] hover:text-foreground hover:border-white/[0.12] transition-colors"
                    >
                      {t('audit.rehacer')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
