import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, Mail, CheckCircle, ChevronLeft } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    id: string
    nombre: string
    precio: number
    moneda: string
    duracion: string
    icono: string
  } | null
}

const AVAILABLE_TIMES = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00']

export default function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'calendar' | 'form' | 'confirming' | 'success'>(
    'details'
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const currentDayNum = today.getDate()
  const monthName = today.toLocaleDateString('es-AR', { month: 'long' })

  const reset = useCallback(() => {
    setStep('details')
    setSelectedDay(null)
    setSelectedTime(null)
    setName('')
    setEmail('')
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleSubmit = useCallback(() => {
    if (!name || !email || !selectedDay || !selectedTime || !service) return
    setStep('confirming')
    setTimeout(() => setStep('success'), 2000)
  }, [name, email, selectedDay, selectedTime, service])

  if (!service) return null

  const canProceedCalendar = selectedDay !== null && selectedTime !== null
  const canSubmitForm = name.trim().length > 2 && email.includes('@')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg"
            >
              <div className="relative bg-gradient-to-br from-[#0a0a1a] to-[#12122a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{service.icono}</span>
                      <div>
                        <h3 className="text-white font-bold text-lg">{service.nombre}</h3>
                        <p className="text-white/40 text-sm">
                          {service.duracion} · ${service.precio} {service.moneda}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="flex gap-1.5 mt-4">
                    {['details', 'calendar', 'form'].map((s, i) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                          (step === 'details' && i === 0) ||
                          (step === 'calendar' && i <= 1) ||
                          ((step === 'form' || step === 'confirming' || step === 'success') &&
                            i <= 2)
                            ? 'bg-accent-cyan'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 min-h-[320px]">
                  <AnimatePresence mode="wait">
                    {/* STEP 1: Details */}
                    {step === 'details' && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div className="text-center py-4">
                          <div className="text-6xl mb-4">{service.icono}</div>
                          <h4 className="text-white font-bold text-xl mb-2">{service.nombre}</h4>
                          <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                            Reservá tu turno en segundos. Elegí fecha, horario y completá tus datos.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <Clock size={16} className="text-accent-cyan mb-2" />
                            <p className="text-white/40 text-xs">Duración</p>
                            <p className="text-white font-bold text-sm">{service.duracion}</p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <Calendar size={16} className="text-accent-magenta mb-2" />
                            <p className="text-white/40 text-xs">Precio</p>
                            <p className="text-white font-bold text-sm">
                              ${service.precio} {service.moneda}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setStep('calendar')}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-blue-500 text-white font-bold text-sm hover:brightness-110 transition-all"
                        >
                          Elegir fecha y horario
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 2: Calendar */}
                    {step === 'calendar' && (
                      <motion.div
                        key="calendar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setStep('details')}
                            className="text-white/40 hover:text-white flex items-center gap-1 text-sm"
                          >
                            <ChevronLeft size={14} /> Atrás
                          </button>
                          <p className="text-white font-bold text-sm capitalize">
                            {monthName} {today.getFullYear()}
                          </p>
                          <div className="w-16" />
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-1">
                          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((d) => (
                            <div
                              key={d}
                              className="text-center text-[10px] text-white/30 font-bold py-1"
                            >
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({
                            length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1,
                          }).map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                            const isPast = day < currentDayNum
                            const isSelected = selectedDay === day
                            return (
                              <button
                                key={day}
                                disabled={isPast}
                                onClick={() => setSelectedDay(day)}
                                className={`aspect-square rounded-xl text-xs font-bold transition-all ${
                                  isPast
                                    ? 'text-white/10 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-accent-cyan text-white shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>

                        {/* Time slots */}
                        {selectedDay && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <p className="text-white/40 text-xs font-bold mb-2 uppercase tracking-wider">
                              Horarios disponibles
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {AVAILABLE_TIMES.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => setSelectedTime(time)}
                                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedTime === time
                                      ? 'bg-accent-cyan text-white shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        <button
                          disabled={!canProceedCalendar}
                          onClick={() => setStep('form')}
                          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                            canProceedCalendar
                              ? 'bg-gradient-to-r from-accent-cyan to-blue-500 text-white hover:brightness-110'
                              : 'bg-white/5 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          Continuar
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 3: Form */}
                    {step === 'form' && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <button
                          onClick={() => setStep('calendar')}
                          className="text-white/40 hover:text-white flex items-center gap-1 text-sm"
                        >
                          <ChevronLeft size={14} /> Elegir otro horario
                        </button>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-white font-bold text-sm">{service.nombre}</p>
                            <p className="text-white/40 text-xs">
                              {selectedDay} de {monthName} · {selectedTime}
                            </p>
                          </div>
                          <p className="text-accent-cyan font-bold">${service.precio}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="relative">
                            <User
                              size={14}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                            />
                            <input
                              type="text"
                              placeholder="Tu nombre"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                            />
                          </div>
                          <div className="relative">
                            <Mail
                              size={14}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                            />
                            <input
                              type="email"
                              placeholder="Tu email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                            />
                          </div>
                        </div>

                        <button
                          disabled={!canSubmitForm}
                          onClick={handleSubmit}
                          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                            canSubmitForm
                              ? 'bg-gradient-to-r from-accent-cyan to-blue-500 text-white hover:brightness-110'
                              : 'bg-white/5 text-white/20 cursor-not-allowed'
                          }`}
                        >
                          Confirmar reserva
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 4: Confirming */}
                    {step === 'confirming' && (
                      <motion.div
                        key="confirming"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-8 space-y-4"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-12 h-12 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full"
                        />
                        <p className="text-white/60 text-sm">Procesando tu reserva...</p>
                        <div className="space-y-1.5 text-xs text-white/30 font-mono">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Verificando disponibilidad...
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            Confirmando turno...
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                          >
                            Enviando confirmación...
                          </motion.p>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 5: Success */}
                    {step === 'success' && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center py-8 space-y-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                          className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                        >
                          <CheckCircle size={28} className="text-emerald-400" />
                        </motion.div>
                        <div className="text-center">
                          <h4 className="text-white font-bold text-lg">Reserva confirmada</h4>
                          <p className="text-white/40 text-sm mt-1">
                            {service.nombre} · {selectedDay} de {monthName} a las {selectedTime}
                          </p>
                          <p className="text-white/30 text-xs mt-2">
                            Recibirás un email de confirmación en {email}
                          </p>
                        </div>
                        <button
                          onClick={handleClose}
                          className="px-8 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition-colors"
                        >
                          Cerrar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
