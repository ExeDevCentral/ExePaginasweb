function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

import {
  validateOnboardingStep1,
  computeTrialInfo,
  buildDefaultWorkGroups,
} from './workspaceOnboarding'

/**
 * Puerta de entrada del onboarding: valida, deriva trial/grupos y persiste el
 * workspace a través del repositorio de tenants.
 */
export class WorkspaceOnboardingService {
  constructor(tenantRepo) {
    this.tenantRepo = tenantRepo
  }

  async createWorkspace(params) {
    const validationError = validateOnboardingStep1(params.form.nombre, params.form.slug)
    if (validationError) throw new Error(validationError)

    const trial = computeTrialInfo(
      params.planTier,
      _nullishCoalesce(params.now, () => new Date())
    )

    const workGroups = params.form.createDefaultGroups
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
