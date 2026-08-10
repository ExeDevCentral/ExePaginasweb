import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Building,
  Palette,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Languages,
  Monitor,
} from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import { useTheme } from '../../core/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { TenantEstado } from '../../core/domain/entities/Tenant'
import { toast } from 'sonner'

interface Props {
  cliente: Cliente
  planTier: string
  onComplete: () => void
}

const BRAND_COLORS = [
  { name: 'Indigo Neon', value: '#6366f1' },
  { name: 'Cyan Eléctrico', value: '#0ea5e9' },
  { name: 'Rosa Cyberpunk', value: '#ec4899' },
  { name: 'Esmeralda Aurora', value: '#10b981' },
  { name: 'Ámbar Sol', value: '#f59e0b' },
]

export default function OnboardingWizard({ cliente, planTier, onComplete }: Props) {
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()

  const [step, setStep] = useState(1)
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(theme)
  const [selectedLang, setSelectedLang] = useState(i18n.language)
  const [createDefaultGroups, setCreateDefaultGroups] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const handleNameChange = (val: string) => {
    setNombre(val)
    // Autogenerate slug: lowercase, replace spaces with hyphens, remove special characters
    const cleanSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(cleanSlug)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!nombre.trim()) {
        toast.error('Campo requerido', {
          description: 'Por favor, ingresá el nombre de tu empresa.',
        })
        return
      }
      if (!slug.trim() || !/^[a-z0-9-]+$/.test(slug)) {
        toast.error('Slug inválido', {
          description: 'El identificador solo puede contener letras minúsculas, números y guiones.',
        })
        return
      }
    }
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
  }

  const handleFinish = async () => {
    try {
      setSubmitting(true)

      // Apply theme + language immediately
      setTheme(selectedTheme)
      i18n.changeLanguage(selectedLang)
      localStorage.setItem('lang', selectedLang)

      const isTrial = planTier === 'none'
      const estado: TenantEstado = isTrial ? 'trial' : 'activo'
      const trialEnds = isTrial
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        : null

      const workGroups = createDefaultGroups
        ? [
            {
              nombre: 'Soporte',
              descripcion: 'Atención a clientes y resolución de tickets',
              color,
              icono: 'shield',
            },
            {
              nombre: 'Desarrollo',
              descripcion: 'Construcción y despliegue de funcionalidades',
              color: '#ec4899',
              icono: 'code',
            },
          ]
        : []

      const { error } = await supabase.rpc('create_workspace', {
        p_slug: slug,
        p_nombre: nombre.trim(),
        p_dueno_id: cliente.id,
        p_estado: estado,
        p_trial_ends_at: trialEnds,
        p_settings: { brandColor: color, theme: selectedTheme, language: selectedLang },
        p_cliente_nombre: cliente.full_name,
        p_cliente_email: cliente.email,
        p_create_groups: createDefaultGroups,
        p_work_groups: workGroups,
      })

      if (error) throw error

      toast.success('¡Workspace Creado!', {
        description: `Tu espacio "${nombre}" está listo.`,
      })
      await onComplete()
    } catch (e: unknown) {
      console.error('[Onboarding] Error creating workspace:', e)
      toast.error('Error de Onboarding', {
        description:
          e instanceof Error ? e.message : 'No se pudo configurar el espacio de trabajo.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-12">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-primary-bg/40 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-magenta/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Steps */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-cyan animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
                Configuración Inicial
              </p>
              <h2 className="text-lg font-bold text-foreground">Creá tu Workspace</h2>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta w-12'
                    : s < step
                      ? 'bg-accent-cyan/50'
                      : 'bg-muted/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Steps Content */}
        <div className="min-h-[280px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <Building className="w-6 h-6 text-accent-cyan" />
                    Identidad Corporativa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Contanos el nombre de tu empresa para configurar tu entorno multi-tenant aislado
                    y seguro.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="empresaNombre"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                    >
                      Nombre de la Empresa
                    </label>
                    <input
                      id="empresaNombre"
                      name="empresaNombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej. Acme Corporation"
                      className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-accent-cyan/60 outline-none text-foreground transition-all placeholder:text-muted-foreground/50 text-sm font-medium"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="empresaSlug"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"
                    >
                      Workspace URL / Identificador (Slug)
                    </label>
                    <div className="relative">
                      <input
                        id="empresaSlug"
                        name="empresaSlug"
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        placeholder="acme-corp"
                        className="w-full pl-5 pr-28 py-4 rounded-2xl bg-muted/40 border border-border focus:border-accent-cyan/60 outline-none text-foreground transition-all placeholder:text-muted-foreground/50 text-sm font-mono font-medium"
                        disabled={submitting}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground/60 select-none">
                        .exesistemas.web
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Usado para aislar tus endpoints y subdominios en producción.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <Palette className="w-6 h-6 text-accent-magenta" />
                    Diseño y Preferencias
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personalizá el look & feel, el tema y el idioma de tu espacio de trabajo.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      id="label-brandColor"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3"
                    >
                      Color Primario de tu Marca
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {BRAND_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setColor(c.value)}
                          className={`w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center ${
                            color === c.value
                              ? 'border-foreground scale-110 shadow-lg'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {color === c.value && (
                            <span className="w-2.5 h-2.5 bg-foreground rounded-full mix-blend-difference" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        id="label-theme"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        Tema
                      </label>
                      <div className="flex gap-3">
                        {(['dark', 'light'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedTheme(t)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                              selectedTheme === t
                                ? 'border-accent-cyan bg-accent-cyan/10 text-foreground'
                                : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                            }`}
                          >
                            {t === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        id="label-lang"
                        className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        Idioma
                      </label>
                      <div className="flex gap-3">
                        {[
                          { code: 'es', label: 'ES' },
                          { code: 'en', label: 'EN' },
                        ].map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => setSelectedLang(l.code)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                              selectedLang === l.code
                                ? 'border-accent-cyan bg-accent-cyan/10 text-foreground'
                                : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-muted/20 flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="defaultGroups"
                      name="defaultGroups"
                      checked={createDefaultGroups}
                      onChange={(e) => setCreateDefaultGroups(e.target.checked)}
                      className="mt-1 accent-accent-cyan w-4 h-4 rounded"
                      disabled={submitting}
                    />
                    <div>
                      <label
                        htmlFor="defaultGroups"
                        className="text-sm font-bold text-foreground cursor-pointer block select-none"
                      >
                        Crear grupos de soporte y desarrollo
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Crea automáticamente los canales primordiales de asignación de tickets:
                        "Soporte" y "Desarrollo".
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    Todo Listo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Confirmá los detalles para levantar tu entorno aislado del SaaS.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/15 p-6 space-y-4 font-medium text-sm">
                  <div className="flex justify-between pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Nombre Empresa</span>
                    <span className="text-foreground font-bold">{nombre}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Identificador (Slug)</span>
                    <span className="text-foreground font-mono">{slug}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Color de Marca</span>
                    <span className="flex items-center gap-2 font-bold text-foreground">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {BRAND_COLORS.find((c) => c.value === color)?.name || color}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Tema</span>
                    <span className="font-bold text-foreground">
                      {selectedTheme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Idioma</span>
                    <span className="font-bold text-foreground uppercase">
                      {selectedLang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suscripción Inicial</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 uppercase tracking-wider">
                      {planTier === 'none' ? 'Demo Trial (14 días)' : planTier}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wizard Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="px-6 py-3 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                Atrás
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-muted hover:bg-muted-foreground/10 text-sm font-bold text-foreground transition-all"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-[#050508] font-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando Espacio...
                  </>
                ) : (
                  'Crear Workspace'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
