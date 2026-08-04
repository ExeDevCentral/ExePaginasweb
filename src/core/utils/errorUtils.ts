/**
 * Utilidades para manejo seguro de errores en TypeScript sin recurrir a casteos `any`.
 */

export interface SupabaseErrorLike {
  message?: string
  code?: string
  details?: string
  hint?: string
}

/**
 * Determina de forma segura si un valor es un objeto con propiedades de error.
 */
export function isObjectWithErrorProperties(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null
}

/**
 * Extrae un mensaje de error legible y descriptivo de cualquier tipo de excepción o respuesta de error.
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado'
): string {
  if (typeof error === 'string' && error.trim() !== '') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (isObjectWithErrorProperties(error)) {
    if (typeof error.message === 'string' && error.message.trim() !== '') {
      return error.message
    }
    if (typeof error.error_description === 'string' && error.error_description.trim() !== '') {
      return error.error_description
    }
    if (typeof error.details === 'string' && error.details.trim() !== '') {
      return error.details
    }
  }

  return fallbackMessage
}

/**
 * Inspecciona un error de Supabase para registro/log detallado sin `any`.
 */
export function formatSupabaseErrorDetails(error: unknown): SupabaseErrorLike {
  if (!isObjectWithErrorProperties(error)) {
    return { message: getErrorMessage(error) }
  }

  return {
    message: typeof error.message === 'string' ? error.message : undefined,
    code: typeof error.code === 'string' ? error.code : undefined,
    details: typeof error.details === 'string' ? error.details : undefined,
    hint: typeof error.hint === 'string' ? error.hint : undefined,
  }
}
