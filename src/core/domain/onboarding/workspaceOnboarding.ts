import type { TenantEstado } from '../entities/Tenant'

export interface OnboardingWorkGroup {
  nombre: string
  descripcion: string
  color: string
  icono: string
}

export interface OnboardingFormData {
  nombre: string
  slug: string
  color: string
  theme: 'dark' | 'light'
  lang: string
  createDefaultGroups: boolean
}

export const DEFAULT_BRAND_COLOR = '#6366f1'
export const TRIAL_DAYS = 14

export const BRAND_COLORS = [
  { name: 'Indigo Neon', value: '#6366f1' },
  { name: 'Cyan Eléctrico', value: '#0ea5e9' },
  { name: 'Rosa Cyberpunk', value: '#ec4899' },
  { name: 'Esmeralda Aurora', value: '#10b981' },
  { name: 'Ámbar Sol', value: '#f59e0b' },
]

export const EMPTY_ONBOARDING_FORM: OnboardingFormData = {
  nombre: '',
  slug: '',
  color: DEFAULT_BRAND_COLOR,
  theme: 'dark',
  lang: 'es',
  createDefaultGroups: true,
}

/**
 * Genera un slug a partir del nombre: minúsculas, sin caracteres especiales,
 * espacios convertidos en guiones y sin guiones repetidos.
 */
export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug)
}

/**
 * Valida el paso 1 del onboarding. Devuelve un mensaje de error o null si es válido.
 */
export function validateOnboardingStep1(nombre: string, slug: string): string | null {
  if (!nombre.trim()) {
    return 'Por favor, ingresá el nombre de tu empresa.'
  }
  if (!slug.trim() || !isValidSlug(slug)) {
    return 'El identificador solo puede contener letras minúsculas, números y guiones.'
  }
  return null
}

export function buildDefaultWorkGroups(brandColor: string): OnboardingWorkGroup[] {
  return [
    {
      nombre: 'Soporte',
      descripcion: 'Atención a clientes y resolución de tickets',
      color: brandColor,
      icono: 'shield',
    },
    {
      nombre: 'Desarrollo',
      descripcion: 'Construcción y despliegue de funcionalidades',
      color: '#ec4899',
      icono: 'code',
    },
  ]
}

export interface TrialInfo {
  estado: TenantEstado
  trialEndsAt: string | null
}

/**
 * Deriva el estado inicial del tenant y la fecha de fin de trial según el plan
 * contratado. Los planes sin suscripción ('none') arrancan en modo trial.
 */
export function computeTrialInfo(planTier: string, now: Date = new Date()): TrialInfo {
  if (planTier === 'none') {
    return {
      estado: 'trial',
      trialEndsAt: new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    }
  }
  return { estado: 'activo', trialEndsAt: null }
}
