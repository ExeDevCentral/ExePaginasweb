import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, Terminal, User, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import { useTranslation } from 'react-i18next'

export default function BookingDemo() {
  const { t, i18n } = useTranslation()

  const AUTOMATION_LOGS = useMemo(
    () => [
      { text: `⚡ ${t('bookingdemo.log_1')}`, delay: 0 },
      { text: `🔍 ${t('bookingdemo.log_2')}`, delay: 1000 },
      { text: `📅 ${t('bookingdemo.log_3')}`, delay: 2000 },
      { text: `💾 ${t('bookingdemo.log_4')}`, delay: 3000 },
      { text: `✉️ ${t('bookingdemo.log_5')}`, delay: 4200 },
      { text: `🟢 ${t('bookingdemo.log_6')}`, delay: 5300 },
      { text: `🎫 ${t('bookingdemo.log_7')}`, delay: 6500 },
      { text: `✨ ${t('bookingdemo.log_8')}`, delay: 7500 },
    ],
    []
  )

  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [logIndex, setLogIndex] = useState(-1)
  const [step, setStep] = useState<'calendar' | 'form' | 'console' | 'success'>('calendar')

  // Obtener los días del mes actual para renderizar en el calendario
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const currentDayNum = today.getDate()

  const availableHours = ['09:30', '11:00', '14:00', '16:30', '18:00']

  // Ejecución asíncrona de los logs en la terminal simulada
  useEffect(() => {
    if (step !== 'console') return

    setLogs([])
    setLogIndex(0)
  }, [step])

  useEffect(() => {
    if (step !== 'console' || logIndex === -1 || logIndex >= AUTOMATION_LOGS.length) {
      if (logIndex >= AUTOMATION_LOGS.length) {
        const timeout = setTimeout(() => {
          setStep('success')
        }, 1200)
        return () => clearTimeout(timeout)
      }
      return
    }

    const currentLog = AUTOMATION_LOGS[logIndex]
    const timeout = setTimeout(
      () => {
        setLogs((prev) => [...prev, currentLog.text])
        setLogIndex((prev) => prev + 1)
      },
      logIndex === 0 ? 500 : 1200
    )

    return () => clearTimeout(timeout)
  }, [step, logIndex, AUTOMATION_LOGS])

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !name || !email) return

    supabase
      .from('leads')
      .insert({
        email,
        lead_type: 'booking_demo',
        name,
        metadata: { selectedDate, selectedTime },
      })
      .then(() => {})

    setStep('console')
  }

  const resetDemo = () => {
    setSelectedDate(null)
    setSelectedTime(null)
    setName('')
    setEmail('')
    setLogs([])
    setLogIndex(-1)
    setStep('calendar')
  }

  return (
    <section id="booking-demo" className="py-32 px-4 relative overflow-hidden bg-background z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-accent-magenta/5 via-background to-background pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent-magenta font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            {t('bookingdemo.seccion_titulo')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-foreground tracking-tight"
          >
            {t('bookingdemo.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {t('bookingdemo.descripcion')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Panel Izquierdo: Interfaz de Calendario o Formulario */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-card border border-border p-8 flex flex-col justify-between relative overflow-hidden min-h-[480px] shadow-2xl">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-accent-magenta/5 blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {step === 'calendar' && (
                <motion.div
                  key="calendar-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h4 className="text-foreground font-bold text-lg flex items-center gap-2">
                      <CalendarIcon className="text-accent-magenta w-5 h-5" />
                      {t('bookingdemo.step1_titulo')}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {today.toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Grid Calendario */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground mb-6">
                    <div>{t('bookingdemo.dia_dom')}</div>
                    <div>{t('bookingdemo.dia_lun')}</div>
                    <div>{t('bookingdemo.dia_mar')}</div>
                    <div>{t('bookingdemo.dia_mie')}</div>
                    <div>{t('bookingdemo.dia_jue')}</div>
                    <div>{t('bookingdemo.dia_vie')}</div>
                    <div>{t('bookingdemo.dia_sab')}</div>

                    {/* Generar celdas vacías previas para alinear el día 1 (Ejemplo simplificado) */}
                    {Array.from({
                      length: new Date(today.getFullYear(), today.getMonth(), 1).getDay(),
                    }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {daysArray.map((day) => {
                      const isPast = day < currentDayNum
                      const isSelected = selectedDate === day

                      return (
                        <button
                          key={`day-${day}`}
                          disabled={isPast}
                          onClick={() => {
                            setSelectedDate(day)
                            setSelectedTime(null)
                          }}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-mono transition-all font-bold ${
                            isSelected
                              ? 'bg-accent-magenta text-foreground shadow-lg shadow-accent-magenta/20 scale-105'
                              : isPast
                                ? 'text-foreground cursor-not-allowed opacity-20'
                                : 'text-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>

                  {/* Horarios si hay fecha seleccionada */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-border"
                    >
                      <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent-cyan" />
                        {t('bookingdemo.horarios_titulo', { date: selectedDate })}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {availableHours.map((time) => {
                          const isTimeSelected = selectedTime === time
                          return (
                            <button
                              key={`time-${time}`}
                              onClick={() => setSelectedTime(time)}
                              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                                isTimeSelected
                                  ? 'bg-accent-cyan text-black border-accent-cyan shadow-lg shadow-accent-cyan/25 scale-105'
                                  : 'bg-muted text-foreground border-border hover:border-border hover:bg-muted'
                              }`}
                            >
                              {time} {t('bookingdemo.horario_hs')}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {selectedDate && selectedTime && (
                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={() => setStep('form')}
                        className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg"
                      >
                        {t('bookingdemo.continuar')}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'form' && (
                <motion.div
                  key="form-step"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <h4 className="text-foreground font-bold text-lg">
                      {t('bookingdemo.step2_titulo')}
                    </h4>
                    <span className="text-xs text-accent-cyan font-mono ml-auto">
                      {t('bookingdemo.fecha_hora', { date: selectedDate, time: selectedTime })}
                    </span>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <User size={12} /> {t('bookingdemo.nombre_label')}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={t('bookingdemo.nombre_placeholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-accent-magenta text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Mail size={12} /> {t('bookingdemo.email_label')}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder={t('bookingdemo.email_placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-accent-magenta text-sm transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setStep('calendar')}
                        className="px-5 py-3 rounded-xl border border-border text-foreground/80 hover:bg-muted transition-colors text-sm font-bold"
                      >
                        {t('bookingdemo.atras')}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold text-sm hover:opacity-95 transition-all flex-1 shadow-lg"
                      >
                        {t('bookingdemo.confirmar')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {(step === 'console' || step === 'success') && (
                <motion.div
                  key="done-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-8 space-y-6"
                >
                  {step === 'success' ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                        <CheckCircle size={36} className="animate-bounce" />
                      </div>
                      <h4 className="text-2xl font-outfit font-black text-foreground">
                        {t('bookingdemo.success_titulo')}
                      </h4>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        {t('bookingdemo.success_desc')}
                      </p>
                      <button
                        onClick={resetDemo}
                        className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all mt-4"
                      >
                        {t('bookingdemo.volver')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin mb-4" />
                      <h4 className="text-lg font-bold text-foreground">
                        {t('bookingdemo.procesando')}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        {t('bookingdemo.procesando_desc')}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panel Derecho: Consola de ejecución de logs */}
          <div className="lg:col-span-5 rounded-[2.5rem] bg-background border border-border p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative min-h-[380px] font-mono">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-4 text-xs text-muted-foreground">
              <Terminal size={14} className="text-accent-cyan" />
              <span>{t('bookingdemo.log_titulo')}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 text-xs md:text-[11px] leading-relaxed scrollbar-thin text-muted-foreground pr-2">
              {logs.length === 0 && (
                <div className="text-muted-foreground italic py-8 text-center">
                  {t('bookingdemo.log_esperando')}
                </div>
              )}
              {logs.map((log, i) => {
                const isCompleted = log.startsWith('✨') || log.startsWith('🎉')
                return (
                  <motion.div
                    key={`log-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={isCompleted ? 'text-accent-cyan font-bold pt-2' : 'text-foreground'}
                  >
                    <span className="text-muted-foreground mr-1.5">&gt;</span>
                    {log}
                  </motion.div>
                )
              })}
            </div>

            <div className="border-t border-border pt-4 mt-4 text-[10px] text-muted-foreground flex justify-between">
              <span>
                {t('bookingdemo.estado_label')}:{' '}
                {step === 'console'
                  ? t('bookingdemo.estado_procesando')
                  : step === 'success'
                    ? t('bookingdemo.estado_inactivo')
                    : t('bookingdemo.estado_esperando')}
              </span>
              <span>
                SEC: {logs.length} / {AUTOMATION_LOGS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
