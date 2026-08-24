'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
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
  Coins,
  Star,
  Info,
  ShieldCheck,
} from 'lucide-react'
import Header from '../layout/Header'
import dynamic from 'next/dynamic'

const Quote3DCanvas = dynamic(() => import('./Quote3DCanvas'), { ssr: false })

interface PlanData {
  id: string
  name: string
  description: string
  setup: { ARS: string; USD: string }
  monthly: { ARS: string; USD: string }
  features: string[]
  popular: boolean
  icon: typeof Layout
}

function getPlans(t: (key: string) => string): PlanData[] {
  return [
    {
      id: 'plan-landing',
      name: t('cotizador.plan_landing_name'),
      description: t('cotizador.plan_landing_desc'),
      setup: { ARS: '$350.000', USD: 'u$s 300' },
      monthly: { ARS: '$10.000', USD: 'u$s 20' },
      features: [
        t('cotizador.plan_landing_feat_1'),
        t('cotizador.plan_landing_feat_2'),
        t('cotizador.plan_landing_feat_3'),
        t('cotizador.plan_landing_feat_4'),
        t('cotizador.plan_landing_feat_5'),
        t('cotizador.plan_landing_feat_6'),
      ],
      popular: false,
      icon: Layout,
    },
    {
      id: 'plan-ecommerce',
      name: t('cotizador.plan_ecommerce_name'),
      description: t('cotizador.plan_ecommerce_desc'),
      setup: { ARS: '$600.000', USD: 'u$s 700' },
      monthly: { ARS: '$25.000', USD: 'u$s 50' },
      features: [
        t('cotizador.plan_ecommerce_feat_1'),
        t('cotizador.plan_ecommerce_feat_2'),
        t('cotizador.plan_ecommerce_feat_3'),
        t('cotizador.plan_ecommerce_feat_4'),
        t('cotizador.plan_ecommerce_feat_5'),
        t('cotizador.plan_ecommerce_feat_6'),
      ],
      popular: true,
      icon: ShoppingCart,
    },
  ]
}

interface ProjectType {
  id: string
  label: string
  icon: typeof Layout
  description: string
  basePrice: number
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    label: 'Landing Page',
    icon: Layout,
    description: 'Sitio de una página, ideal para campañas o presentación',
    basePrice: 350000,
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

interface Feature {
  id: string
  label: string
  price: number
  popular?: boolean
  hasAsterisk?: boolean
  description: string
}

const FEATURES: Feature[] = [
  {
    id: 'admin',
    label: 'Panel Administrador',
    price: 100000,
    popular: true,
    description: 'Gestión total de contenidos, publicaciones y clientes a medida.',
  },
  {
    id: 'payments',
    label: 'Pasarela de Pagos',
    price: 80000,
    hasAsterisk: true,
    description:
      'Integración técnica de cobros (Mercado Pago, Stripe). Comisiones y alta comercial a cargo de la pasarela.*',
  },
  {
    id: 'domain',
    label: 'Registro / Gestión de Dominio',
    price: 50000,
    hasAsterisk: true,
    description:
      'Gestión y alta anual (.com / .com.ar). Sujeto a disponibilidad en registrador oficial.*',
  },
  {
    id: 'chatbot',
    label: 'Chatbot con IA',
    price: 120000,
    hasAsterisk: true,
    description:
      'Entrenamiento del bot y prompt a medida. Consumo de API / Tokens mediante cuenta propia del cliente.*',
  },
  {
    id: 'database',
    label: 'Base de Datos Cloud',
    price: 60000,
    description: 'Almacenamiento seguro, copias de seguridad y esquemas relacionales optimizados.',
  },
  {
    id: 'api',
    label: 'API / Integraciones Externas',
    price: 100000,
    hasAsterisk: true,
    description:
      'Conexión con ERP, CRM o APIs externas. API Keys/licencias de terceros a cargo del cliente o evaluadas según complejidad.*',
  },
  {
    id: 'dashboard',
    label: 'Dashboard con Gráficos',
    price: 80000,
    description: 'Métricas clave, reportes visuales y analítica interactiva.',
  },
  {
    id: 'multicurrency',
    label: 'Multimoneda',
    price: 50000,
    description: 'Cotizaciones automáticas y conversión de divisas en tiempo real.',
  },
  {
    id: 'i18n',
    label: 'Multi-idioma',
    price: 50000,
    description: 'Internacionalización completa (ES, EN, PT, etc.) con selector integrado.',
  },
  {
    id: 'notifications',
    label: 'Notificaciones Email & Mail Corp.',
    price: 40000,
    hasAsterisk: true,
    description:
      'Emails transaccionales y casillas de empresa (Google Workspace, Zoho, Resend). Costos de suscripción según proveedor.*',
  },
  {
    id: 'roles',
    label: 'Usuarios y Roles',
    price: 80000,
    description:
      'Permisos granulares, autenticación y niveles de acceso (Admin, Operador, Cliente).',
  },
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

interface Particle {
  x: number
  y: number
  color: string
  size: number
  rotation: number
  shape: number
}

function ConfettiBurst({ trigger, intensity = 24 }: { trigger: number; intensity?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    setParticles(
      Array.from({ length: intensity }).map((_, i) => {
        const angle = (i / intensity) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const distance = 60 + Math.random() * (intensity <= 24 ? 120 : 200)
        const colors = ['#22d3ee', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#f97316']
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 30,
          color: colors[i % colors.length],
          size: 3 + Math.random() * 7,
          rotation: Math.random() * 720,
          shape: i % 3,
        }
      })
    )
  }, [trigger, intensity])

  return (
    <div className="absolute inset-0 pointer-events-none z-50" key={trigger}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 1,
            rotate: p.rotation,
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.6,
            ease: 'easeOut',
            delay: Math.random() * 0.12,
          }}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius:
              p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '30% 70% 70% 30% / 30% 30% 70% 70%',
          }}
        />
      ))}
    </div>
  )
}

function GlowCard({
  children,
  className = '',
  popular = false,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  popular?: boolean
  onClick?: () => void
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  function handleMouseMove(e: React.MouseEvent) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    mouseX.set(x)
    mouseY.set(y)
    rotateX.set(((y - height / 2) / height) * -8)
    rotateY.set(((x - width / 2) / width) * 8)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' as const, perspective: 1000 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 backdrop-blur-xl ${
        popular
          ? 'border-accent-cyan/80 bg-accent-cyan/[0.05] shadow-[0_0_30px_rgba(34,211,238,0.18)] ring-1 ring-accent-cyan/30'
          : 'border-border/80 bg-card/60 hover:border-accent-cyan/40 hover:bg-card/80 hover:shadow-xl hover:shadow-accent-cyan/5'
      } ${className}`}
    >
      {popular && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent pointer-events-none" />
      )}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${popular ? 'rgba(34,211,238, 0.18)' : 'rgba(34,211,238, 0.08)'}, transparent 80%)`,
        }}
      />
      <div style={{ transform: 'translateZ(18px)' }}>{children}</div>
    </motion.div>
  )
}

function PlanCard({
  plan,
  currency,
  onSelect,
  index,
}: {
  plan: PlanData
  currency: 'ARS' | 'USD'
  onSelect: () => void
  index: number
}) {
  const { t } = useTranslation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const Icon = plan.icon

  function handleMouseMove(e: React.MouseEvent) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top
    mouseX.set(x)
    mouseY.set(y)
    rotateX.set(((y - height / 2) / height) * -6)
    rotateY.set(((x - width / 2) / width) * 6)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' as const, perspective: 1000 }}
      className={`group relative rounded-[2.5rem] bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl border overflow-hidden transition-shadow duration-500 hover:-translate-y-2 p-8 flex flex-col ${
        plan.popular
          ? 'border-accent-magenta/50 shadow-2xl shadow-accent-magenta/10 hover:shadow-accent-magenta/20'
          : 'border-border hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/5'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${plan.popular ? 'rgba(236,72,153, 0.15)' : 'rgba(34,211,238, 0.1)'}, transparent 80%)`,
        }}
      />

      {plan.popular && (
        <>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-magenta to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-xs font-bold text-foreground uppercase tracking-wider shadow-lg z-10"
          >
            {t('cotizador.mas_elegido')}
          </motion.div>
        </>
      )}

      <div className="relative z-10 flex-1 flex flex-col" style={{ transform: 'translateZ(32px)' }}>
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 flex items-center justify-center mb-4 relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 via-accent-magenta/10 to-accent-cyan/10 bg-[length:200%_200%] animate-gradient-shift" />
          <Icon className="w-7 h-7 text-accent-cyan relative z-10" />
        </motion.div>

        <h3 className="text-2xl font-montserrat font-black text-foreground mb-2">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

        <div className="mb-6 p-5 rounded-2xl bg-muted/80 border border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/[0.03] to-transparent" />
          <div className="relative z-10">
            <div className="mb-3 pb-3 border-b border-border/50">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                {t('cotizador.desarrollo_unico')}
              </p>
              <p className="text-3xl font-montserrat font-black text-foreground">
                {plan.setup[currency]}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  {t('cotizador.mantenimiento_mes')}
                </p>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {t('cotizador.monthly_opcional_badge')}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xl font-montserrat font-bold text-accent-cyan ml-auto">
                  {plan.monthly[currency]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feat, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-sm text-muted-foreground">{feat}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSelect}
          className={`w-full py-4 rounded-xl text-center font-bold transition-all duration-300 relative overflow-hidden group/btn ${
            plan.popular
              ? 'bg-gradient-to-r from-accent-cyan via-accent-cyan/90 to-accent-magenta text-foreground shadow-lg shadow-accent-cyan/20 hover:shadow-xl hover:shadow-accent-magenta/20 bg-[length:200%_200%] animate-gradient-shift'
              : 'border border-border bg-card/50 text-foreground hover:border-accent-cyan/40 hover:bg-card/80'
          }`}
        >
          <span className="relative z-10">{t('cotizador.elegir_plan')}</span>
          {plan.popular && (
            <motion.div
              className="absolute inset-0 -translate-x-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2" />
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function QuoteBuilder() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const plans = useMemo(() => getPlans(t), [t])
  const [mode, setMode] = useState<'plans' | 'custom'>('plans')
  const [step, setStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [designTier, setDesignTier] = useState<string>('template')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sending, setSending] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [planConfetti, setPlanConfetti] = useState(0)

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
    const featureNames = FEATURES.filter((f) => selectedFeatures.has(f.id)).map(
      (f) => f.label + (f.hasAsterisk ? ' (*)' : '')
    )
    const designName = DESIGN_TIERS.find((d) => d.id === designTier)?.label ?? ''
    let msg = `¡Hola ExeSistemasWEB! Quiero solicitar una cotización:%0A%0A`
    msg += `*Proyecto:* ${typeName}%0A`
    msg += `*Diseño:* ${designName}%0A`
    if (featureNames.length) msg += `*Funcionalidades:* ${featureNames.join(', ')}%0A`
    msg += `*Presupuesto estimado:* ${formatPrice(total)}%0A`
    if (name) msg += `%0A*Nombre:* ${name}%0A`
    if (email) msg += `*Email:* ${email}%0A`
    if (company) msg += `*Empresa:* ${company}%0A`
    msg += `%0A_(Presupuesto base orientativo sujeto a diagnóstico técnico previo)_`
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
          isDiagnostic: true,
          projectType: selectedTypeData?.label ?? 'Sistema Web a Medida',
          total: formatPrice(total),
          message: `Cotización / Diagnóstico IA:\nProyecto: ${selectedTypeData?.label ?? ''}\nDiseño: ${DESIGN_TIERS.find((d) => d.id === designTier)?.label ?? ''}\nFuncionalidades: ${FEATURES.filter(
            (f) => selectedFeatures.has(f.id)
          )
            .map((f) => f.label + (f.hasAsterisk ? ' (*)' : ''))
            .join(
              ', '
            )}\nPresupuesto: ${formatPrice(total)}\nEmpresa: ${company || '-'}\nNota: Presupuesto orientativo sujeto a diagnóstico técnico previo.`,
        }),
      })
      toast.success('Cotización enviada con éxito', {
        description: 'Te respondo en menos de 24 horas.',
      })
    } catch {
      toast.error('Error al enviar', {
        description: 'Probá enviando por WhatsApp directo.',
      })
    }
    setSending(false)
    setTimeout(() => navigate('/'), 1200)
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setPlanConfetti((c) => c + 1)
    if (planId === 'plan-landing') {
      setSelectedType('landing')
      setSelectedFeatures(new Set(['admin', 'notifications']))
      setDesignTier('template')
    } else {
      setSelectedType('ecommerce')
      setSelectedFeatures(new Set(['admin', 'payments', 'dashboard', 'database']))
      setDesignTier('custom')
    }
    setTimeout(() => {
      setMode('custom')
      setStep(3)
    }, 600)
  }

  const goToCustom = () => {
    setMode('custom')
    setStep(0)
    setConfettiTrigger((c) => c + 1)
  }

  const changeStep = (newStep: number) => {
    setStep(newStep)
    setConfettiTrigger((c) => c + 1)
  }

  const stepLabels = [
    t('cotizador.paso_1'),
    t('cotizador.paso_2'),
    t('cotizador.paso_3'),
    t('cotizador.paso_4'),
  ]

  return (
    <div className="min-h-screen bg-transparent text-primary-text relative overflow-hidden">
      <Quote3DCanvas />
      <Header />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-36 pb-24">
        {mode === 'plans' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('cotizador.planes_tag')}
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-montserrat font-black text-foreground tracking-tight mb-6"
              >
                {t('cotizador.modelo_hibrido')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground max-w-2xl mx-auto text-lg"
              >
                {t('cotizador.modelo_hibrido_desc')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-muted/80 border border-border rounded-2xl p-1.5">
                <button
                  onClick={() => setCurrency('ARS')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
                    currency === 'ARS'
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-cyan/80 text-black shadow-lg shadow-accent-cyan/25 bg-[length:200%_200%] animate-gradient-shift'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <Coins size={14} />
                  ARS ($)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
                    currency === 'USD'
                      ? 'bg-gradient-to-r from-accent-magenta to-accent-magenta/80 text-foreground shadow-lg shadow-accent-magenta/25 bg-[length:200%_200%] animate-gradient-shift'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <Coins size={14} />
                  USD (u$s)
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
              {plans.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currency={currency}
                  index={i}
                  onSelect={() => handlePlanSelect(plan.id)}
                />
              ))}
            </div>

            {/* Cartel Aclaratorio de Mantenimiento Opcional */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-semibold shadow-lg shadow-emerald-500/5">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{t('cotizador.opcional_nota')}</span>
              </div>
            </div>

            <ConfettiBurst trigger={planConfetti} intensity={20} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-background text-muted-foreground text-sm">
                    {t('cotizador.o')}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToCustom}
                className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/15 to-accent-magenta/20 border border-accent-cyan/30 text-foreground font-bold transition-all bg-[length:200%_200%] animate-gradient-shift hover:from-accent-cyan/30 hover:to-accent-magenta/30 hover:shadow-lg hover:shadow-accent-cyan/10"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_4s_ease-in-out_infinite]" />
                <Star className="w-5 h-5 text-accent-cyan relative z-10" />
                <span className="relative z-10">{t('cotizador.arma_proyecto_medida')}</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {mode === 'custom' && (
          <>
            <div className="flex items-center gap-2 mb-12 justify-center">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <motion.div
                    animate={
                      i === step
                        ? {
                            scale: [1, 1.18, 1],
                            boxShadow: [
                              '0 0 20px rgba(34,211,238,0.3)',
                              '0 0 40px rgba(236,72,153,0.4)',
                              '0 0 20px rgba(34,211,238,0.3)',
                            ],
                            transition: { repeat: Infinity, duration: 2 },
                          }
                        : {}
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i <= step
                        ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground shadow-lg shadow-accent-cyan/20 bg-[length:200%_200%] animate-gradient-shift'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </motion.div>
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
              <ConfettiBurst key={`step-${step}`} trigger={confettiTrigger} intensity={16} />

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
                      {t('cotizador.que_necesitas')}
                    </h1>
                    <p className="text-muted-foreground">{t('cotizador.que_necesitas_desc')}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROJECT_TYPES.map((pt) => {
                      const Icon = pt.icon
                      const isSelected = selectedType === pt.id
                      return (
                        <GlowCard
                          key={pt.id}
                          onClick={() => setSelectedType(pt.id)}
                          popular={isSelected}
                        >
                          <div className={`p-6 ${isSelected ? 'bg-accent-cyan/5' : ''}`}>
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                                isSelected
                                  ? 'bg-accent-cyan/20 text-accent-cyan'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {t('cotizador.tipo_' + pt.id, pt.label)}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {t('cotizador.tipo_' + pt.id + '_desc', pt.description)}
                            </p>
                            <p className="text-xl font-black font-montserrat text-accent-cyan">
                              {formatPrice(pt.basePrice)}
                            </p>
                          </div>
                        </GlowCard>
                      )
                    })}
                  </div>
                  <div className="flex justify-center mt-10">
                    <button
                      disabled={!selectedType}
                      onClick={() => changeStep(1)}
                      className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-cyan to-accent-magenta text-foreground font-bold disabled:opacity-30 transition-all bg-[length:200%_200%] animate-gradient-shift hover:shadow-lg hover:shadow-accent-magenta/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
                      <span className="relative z-10">{t('cotizador.siguiente')}</span>{' '}
                      <ArrowRight className="w-4 h-4 relative z-10" />
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
                      {t('cotizador.funcionalidades')}
                    </h2>
                    <p className="text-muted-foreground">{t('cotizador.funcionalidades_desc')}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                    {FEATURES.map((feat) => {
                      const isSelected = selectedFeatures.has(feat.id)
                      return (
                        <GlowCard
                          key={feat.id}
                          onClick={() => toggleFeature(feat.id)}
                          popular={isSelected}
                        >
                          <div
                            className={`flex flex-col justify-between p-4 h-full transition-colors ${
                              isSelected ? 'bg-accent-cyan/5' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-accent-cyan bg-accent-cyan'
                                      : 'border-border'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 flex-wrap">
                                    {t('cotizador.feat_' + feat.id, feat.label)}
                                    {feat.hasAsterisk && (
                                      <span
                                        className="text-accent-magenta font-bold text-sm leading-none"
                                        title="Requiere evaluación o servicios de terceros"
                                      >
                                        *
                                      </span>
                                    )}
                                  </span>
                                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                                    {t('cotizador.feat_' + feat.id + '_desc', feat.description)}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-accent-cyan shrink-0 whitespace-nowrap ml-2">
                                + {formatPrice(feat.price)}
                              </span>
                            </div>
                          </div>
                        </GlowCard>
                      )
                    })}
                  </div>

                  {/* Banner de Transparencia y Respaldo Mutuo */}
                  <div className="mb-10 p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-2">
                        <span>
                          {t('cotizador.clarificacion_titulo', 'Transparencia & Alcance Técnico')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-semibold lowercase">
                          acuerdo previo
                        </span>
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(
                          'cotizador.clarificacion_desc',
                          'Los ítems marcados con asterisco (*) involucran plataformas o consumos de terceros (como API Keys de Inteligencia Artificial, licencias de correo corporativo, pasarelas de pago o registros de dominio). Nuestro valor cotizado cubre la arquitectura, diseño, desarrollo e integración completa. El alcance exacto y las cuentas de proveedores se validan en una breve reunión técnica inicial para total transparencia y seguridad de ambas partes.'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => changeStep(0)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t('cotizador.atras')}
                    </button>
                    <button
                      onClick={() => changeStep(2)}
                      className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-cyan to-accent-magenta text-foreground font-bold transition-all bg-[length:200%_200%] animate-gradient-shift hover:shadow-lg hover:shadow-accent-magenta/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
                      <span className="relative z-10">{t('cotizador.siguiente')}</span>{' '}
                      <ArrowRight className="w-4 h-4 relative z-10" />
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
                      {t('cotizador.diseno')}
                    </h2>
                    <p className="text-muted-foreground">{t('cotizador.diseno_desc')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {DESIGN_TIERS.map((d) => {
                      const isSelected = designTier === d.id
                      return (
                        <GlowCard
                          key={d.id}
                          onClick={() => setDesignTier(d.id)}
                          popular={isSelected}
                        >
                          <div className={`p-6 ${isSelected ? 'bg-accent-cyan/5' : ''}`}>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {t('cotizador.design_' + d.id, d.label)}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {t('cotizador.design_' + d.id + '_desc', d.description)}
                            </p>
                            <p className="text-xl font-black font-montserrat text-accent-cyan">
                              {d.price === 0 ? t('cotizador.incluido') : formatPrice(d.price)}
                            </p>
                          </div>
                        </GlowCard>
                      )
                    })}
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => changeStep(1)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t('cotizador.atras')}
                    </button>
                    <button
                      onClick={() => changeStep(3)}
                      className="relative overflow-hidden inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-cyan to-accent-magenta text-foreground font-bold transition-all bg-[length:200%_200%] animate-gradient-shift hover:shadow-lg hover:shadow-accent-magenta/20"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
                      <span className="relative z-10">{t('cotizador.ver_cotizacion')}</span>{' '}
                      <ArrowRight className="w-4 h-4 relative z-10" />
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
                      {t('cotizador.tu_cotizacion')}
                    </h2>
                    <p className="text-muted-foreground">{t('cotizador.completa_datos')}</p>
                  </div>

                  {selectedPlan && (
                    <div className="max-w-lg mx-auto mb-8 p-4 rounded-2xl bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border border-accent-cyan/20 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-accent-cyan mb-1">
                        {t('cotizador.plan_seleccionado')}
                      </p>
                      <p className="text-lg font-black text-foreground">
                        {plans.find((p) => p.id === selectedPlan)?.name}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                      <div className="rounded-2xl border border-border bg-muted/50 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                          {t('cotizador.resumen')}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {t('cotizador.proyecto')}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {selectedTypeData ? t('cotizador.tipo_' + selectedTypeData.id) : ''}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {t('cotizador.diseno_label')}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {t('cotizador.design_' + designTier)}
                            </span>
                          </div>
                          {FEATURES.filter((f) => selectedFeatures.has(f.id)).map((f) => (
                            <div key={f.id} className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                {t('cotizador.feat_' + f.id, f.label)}
                                {f.hasAsterisk && (
                                  <span className="text-accent-magenta font-bold text-xs">*</span>
                                )}
                              </span>
                              <span className="text-sm font-bold text-accent-cyan">
                                + {formatPrice(f.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                          <span className="text-lg font-black text-foreground">
                            {t('cotizador.total_estimado')}
                          </span>
                          <span className="text-3xl font-black font-montserrat text-foreground">
                            {formatPrice(total)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('cotizador.nota_estimado')}
                        </p>

                        <div className="mt-4 p-3.5 rounded-xl bg-accent-magenta/5 border border-accent-magenta/20 text-xs text-muted-foreground flex items-start gap-2.5">
                          <Info className="w-4 h-4 shrink-0 text-accent-magenta mt-0.5" />
                          <span className="leading-relaxed">
                            {t(
                              'cotizador.resumen_aviso_legal',
                              '* Presupuesto base orientativo. Los ítems con (*) corresponden a desarrollos con integración a servicios externos (APIs, plataformas de cobro, casillas corporativas o dominios). El alcance técnico final y las credenciales se coordinan en una charla previa sin sorpresas.'
                            )}
                          </span>
                        </div>

                        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span>{t('cotizador.opcional_nota')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="rounded-2xl border border-border bg-muted/50 p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                          {t('cotizador.tus_datos')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={t('cotizador.placeholder_nombre')}
                              className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                            />
                          </div>
                          <div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={t('cotizador.placeholder_email')}
                              className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder={t('cotizador.placeholder_empresa')}
                              className="w-full rounded-xl border border-border bg-slate-100/95 px-4 py-3 text-sm text-slate-900 outline-none focus:border-accent-cyan/60"
                            />
                          </div>

                          <button
                            onClick={handleSendQuote}
                            disabled={sending || !name || !email}
                            className="relative overflow-hidden w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-cyan to-accent-magenta text-foreground font-bold disabled:opacity-30 transition-all bg-[length:200%_200%] animate-gradient-shift hover:shadow-lg hover:shadow-accent-magenta/20"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
                            {sending ? (
                              <span className="relative z-10">{t('cotizador.enviando')}</span>
                            ) : (
                              <span className="relative z-10 flex items-center gap-3">
                                <Send className="w-4 h-4" /> {t('cotizador.enviar_cotizacion')}
                              </span>
                            )}
                          </button>

                          <a
                            href={`https://wa.me/${WHAATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold transition-all text-sm shadow-md"
                          >
                            <MessageCircle className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                            {t('cotizador.enviar_whatsapp')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start mt-8">
                    <button
                      onClick={() => changeStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t('cotizador.atras')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
