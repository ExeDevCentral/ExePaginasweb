import type { Cliente } from '../entities/Cliente'
import type { ITenantRepository } from '../repositories/ITenantRepository'
import {
  OnboardingFormData,
  OnboardingWorkGroup,
  validateOnboardingStep1,
  computeTrialInfo,
  buildDefaultWorkGroups,
} from './workspaceOnboarding'

export interface CreaWorkspaceParams {
  form: OnboardingFormData
  cliente: Cliente
  planTier: string
  now?: Date
}

/**
 * Puerta de entrada del onboarding: valida, deriva trial/grupos y persiste el
 * workspace a través del repositorio de tenants.
 */
export class WorkspaceOnboardingService {
  constructor(private readonly tenantRepo: ITenantRepository) {}

  async createWorkspace(params: CreaWorkspaceParams): Promise<void> {
    const validationError = validateOnboardingStep1(params.form.nombre, params.form.slug)
    if (validationError) throw new Error(validationError)

    const trial = computeTrialInfo(params.planTier, params.now ?? new Date())

    const workGroups: OnboardingWorkGroup[] = params.form.createDefaultGroups
      ? buildDefaultWorkGroups(params.form.color)
      : []

    await this.tenantRepo.createWorkspace({
      slug: params.form.slug,
      nombre: params.form.nombre.trim(),
      duenoId: params.cliente.id,
      estado: trial.estado,
      trialEndsAt: trial.trialEndsAt,
      settings: {
        brandColor: params.form.color,
        theme: params.form.theme,
        language: params.form.lang,
      },
      clienteNombre: params.cliente.full_name,
      clienteEmail: params.cliente.email,
      createDefaultGroups: params.form.createDefaultGroups,
      workGroups,
    })
  }
}
