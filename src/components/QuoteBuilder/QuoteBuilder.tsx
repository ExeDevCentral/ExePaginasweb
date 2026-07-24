import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Send,
  MessageCircle,
  Layout,
  ShoppingCart,
  Calendar,
  Code,
  BarChart3,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Header from '../layout/Header'
import PremiumBackground from '../Effects/PremiumBackground'

interface ProjectType {
  id: string
  label: string
  icon: typeof Layout
  description: string
  basePrice: number
}

interface Feature {
  id: string
  label: string
  price: number
  popular?: boolean
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    label: 'Landing Page',
    icon: Layout,
    description: 'Sitio de una página, ideal para campañas o presentación',
    basePrice: 150000,
  },
  {
    id: 'institucional',
    label: 'Sitio Web Institucional',
    icon: Smartphone,
    description: '5-10 páginas, diseño profesional, blog',
    basePrice: 350000,
  },
  {
    id: 'ecommerce',
    label: 'Tienda Online',
    icon: ShoppingCart,
    description: 'Catálogo, carrito, pasarela de pagos, stock',
    basePrice: 600000,
  },
  {
    id: 'reservas',
    label: 'Sistema de Reservas',
    icon: Calendar,
    description: 'Calendario, turnos, notificaciones, disponibilidad',
    basePrice: 500000,
  },
  {
    id: 'webapp',
    label: 'Aplicación Web',
    icon: Code,
    description: 'SaaS, dashboard, usuarios, lógica de negocio a medida',
    basePrice: 800000,
  },
  {
    id: 'crm',
    label: 'CRM / Panel Gestión',
    icon: BarChart3,
    description: 'Clientes, ventas, reportes, equipo',
    basePrice: 700000,
  },
]

const FEATURES: Feature[] = [
  { id: 'admin', label: 'Panel Administrador', price: 100000, popular: true },
  { id: 'payments', label: 'Pasarela de Pagos', price: 80000 },
  { id: 'chatbot', label: 'Chatbot IA', price: 120000 },
  { id: 'database', label: 'Base de Datos', price: 60000 },
  { id: 'api', label: 'API / Integraciones', price: 100000 },
  { id: 'dashboard', label: 'Dashboard con Gráficos', price: 80000 },
  { id: 'multicurrency', label: 'Multimoneda', price: 50000 },
  { id: 'i18n', label: 'Multi-idioma', price: 50000 },
  { id: 'notifications', label: 'Notificaciones Email', price: 40000 },
  { id: 'roles', label: 'Usuarios y Roles', price: 80000 },
]

const DESIGN_TIERS = [
  {
    id: 'template',
    label: 'Template Personalizado',
    price: 0,
    description: 'Sobre base existente, colores y contenido',
  },
  {
    id: 'custom',
    label: 'Diseño UI/UX desde Cero',
    price: 150000,
    description: 'Wireframes, prototipo, diseño exclusivo',
  },
  {
    id: 'branding',
    label: 'Branding Completo',
    price: 250000,
    description: 'Logo, paleta, tipografía, identidad visual',
  },
]

const WHAATSAPP_NUMBER = '5493416874786'

function formatPrice(n: number): string {
  return '$ ' + n.toLocaleString('es-AR')
}

export default function QuoteBuilder() {
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [designTier, setDesignTier] = useState<string>('template')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = useMemo(() => {
    const type = PROJECT_TYPES.find((t) => t.id === selectedType)
    const base = type?.basePrice ?? 0
    const features = FEATURES.filter((f) => selectedFeatures.has(f.id)).reduce(
      (s, f) => s + f.price,
      0
    )
    const design = DESIGN_TIERS.find((d) => d.id === designTier)?.price ?? 0
    return base + features + design
  }, [selectedType, selectedFeatures, designTier])

  const selectedTypeData = PROJECT_TYPES.find((t) => t.id === selectedType)

  const buildWhatsAppMessage = () => {
    const typeName = selectedTypeData?.label ?? ''
    const featureNames = FEATURES.filter((f) => selectedFeatures.has(f.id)).map((f) => f.label)
    const designName = DESIGN_TIERS.find((d) => d.id === designTier)?.label ?? ''
    let msg = `¡Hola ExeSistemasWEB! Quiero solicitar una cotización:%0A%0A`
    msg += `*Proyecto:* ${typeName}%0A`
    msg += `*Diseño:* ${designName}%0A`
    if (featureNames.length) msg += `*Funcionalidades:* ${featureNames.join(', ')}%0A`
    msg += `*Presupuesto estimado:* ${formatPrice(total)}%0A`
    if (name) msg += `%0A*Nombre:* ${name}%0A`
    if (email) msg += `*Email:* ${email}%0A`
    if (company) msg += `*Empresa:* ${company}%0A`
    return msg
  }

  const handleSendQuote = async () => {
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Sin nombre',
          email: email || 'Sin email',
          message: `Cotización automática:
Proyecto: ${selectedTypeData?.label ?? ''}
Diseño: ${DESIGN_TIERS.find((d) => d.id === designTier)?.label ?? ''}
Funcionalidades: ${FEATURES.filter((f) => selectedFeatures.has(f.id))
            .map((f) => f.label)
            .join(', ')}
Presupuesto: ${formatPrice(total)}
Empresa: ${company || '-'}`,
        }),
      })
    } catch {
      console.error('[QuoteBuilder] Error al enviar cotización')
    }
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-transparent text-primary-text relative">
        <PremiumBackground />
        <Header />
        <div className="flex items-center justify-center pt-36 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-montserrat font-black text-foreground mb-4">
              Cotización Enviada
            </h1>
            <p className="text-muted-foreground mb-8">
              Te voy a responder en menos de 24 horas. Mientras tanto, podés escribirme directo por
              WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WHAATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5" />
              Hablar por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-primary-text relative">
      <Helmet>
        <title>Cotizador Online | ExeSistemasWEB</title>
        <meta
          name="description"
          content="Cotizá tu proyecto web en minutos. Seleccioná tipo, funcionalidades y recibí un presupuesto estimado al instante."
        />
      </Helmet>
      <PremiumBackground />
      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-24">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-12 justify-center">
          {['Proyecto', 'Funcionalidades', 'Diseño', 'Resumen'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {label}
              </span>
              {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground/40" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="text-center mb-10">
                <Sparkles className="w-8 h-8 text-accent-cyan mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-montserrat font-black text-foreground mb-3">
                  ¿Qué necesitás?
                </h1>
                <p className="text-muted-foreground">
                  Elegí el tipo de proyecto y te doy un presupuesto estimado al instante
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROJECT_TYPES.map((pt) => {
                  const Icon = pt.icon
                  const isSelected = selectedType === pt.id
                  return (
                    <motion.button
                      key={pt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(pt.id)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-accent-cyan bg-accent-cyan/5 shadow-lg shadow-accent-cyan/10'
                          : 'border-border bg-muted/50 hover:border-border hover:bg-muted'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          isSelected
                            ? 'bg-accent-cyan/20 text-accent-cyan'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{pt.label}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{pt.description}</p>
                      <p className="text-xl font-black font-montserrat text-accent-cyan">
                        {formatPrice(pt.basePrice)}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex justify-center mt-10">
                <button
                  disabled={!selectedType}
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold disabled:opacity-30 transition-opacity"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-montserrat font-black text-foreground mb-3">
                  Funcionalidades
                </h2>
                <p className="text-muted-foreground">
                  Seleccioná las que necesites (podés cambiar después)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {FEATURES.map((feat) => {
                  const isSelected = selectedFeatures.has(feat.id)
                  return (
                    <motion.button
                      key={feat.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFeature(feat.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-accent-cyan bg-accent-cyan/5'
                          : 'border-border bg-muted/30 hover:border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-accent-cyan bg-accent-cyan' : 'border-border'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-foreground" />}
                        </div>
                        <span className="text-sm font-medium text-foreground">{feat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-accent-cyan">
                        + {formatPrice(feat.price)}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold transition-opacity"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-montserrat font-black text-foreground mb-3">
                  Diseño
                </h2>
                <p className="text-muted-foreground">
                  Elegí el nivel de diseño que quieras para tu proyecto
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {DESIGN_TIERS.map((d) => {
                  const isSelected = designTier === d.id
                  return (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDesignTier(d.id)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-accent-cyan bg-accent-cyan/5 shadow-lg shadow-accent-cyan/10'
                          : 'border-border bg-muted/50 hover:border-border hover:bg-muted'
                      }`}
                    >
                      <h3 className="text-lg font-bold text-foreground mb-2">{d.label}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{d.description}</p>
                      <p className="text-xl font-black font-montserrat text-accent-cyan">
                        {d.price === 0 ? 'Incluido' : formatPrice(d.price)}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold transition-opacity"
                >
                  Ver Cotización <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-montserrat font-black text-foreground mb-3">
                  Tu Cotización
                </h2>
                <p className="text-muted-foreground">Completá tus datos y recibí el presupuesto</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Resumen */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="rounded-2xl border border-border bg-muted/50 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Resumen
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Proyecto</span>
                        <span className="text-sm font-bold text-foreground">
                          {selectedTypeData?.label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Diseño</span>
                        <span className="text-sm font-bold text-foreground">
                          {DESIGN_TIERS.find((d) => d.id === designTier)?.label}
                        </span>
                      </div>
                      {FEATURES.filter((f) => selectedFeatures.has(f.id)).map((f) => (
                        <div key={f.id} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{f.label}</span>
                          <span className="text-sm font-bold text-accent-cyan">
                            + {formatPrice(f.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-lg font-black text-foreground">Total estimado</span>
                      <span className="text-3xl font-black font-montserrat text-foreground">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      *Presupuesto estimado. El precio final puede variar según requerimientos
                      específicos.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-border bg-muted/50 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Tus datos
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nombre *"
                          className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email *"
                          className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Empresa (opcional)"
                          className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                        />
                      </div>

                      <button
                        onClick={handleSendQuote}
                        disabled={sending || !name || !email}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground font-bold disabled:opacity-30 transition-opacity"
                      >
                        {sending ? (
                          'Enviando...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Enviar Cotización
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/${WHAATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        Enviar por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
