import { lazy, type ComponentType } from 'react'

/**
 * Carga perezosa (lazy) de un componente React con reintento automático mediante recarga de página
 * si falla la importación dinámica (ej. después de un nuevo despliegue en Vercel donde cambiaron los hashes de los chunks).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const pageHasBeenReloaded = sessionStorage.getItem('chunk_reload_attempted') === 'true'

    try {
      const component = await componentImport()
      sessionStorage.removeItem('chunk_reload_attempted')
      return component
    } catch (error) {
      if (!pageHasBeenReloaded) {
        console.warn(
          '[lazyWithRetry] Error al importar módulo dinámico. Recargando página para obtener los assets actualizados...',
          error
        )
        sessionStorage.setItem('chunk_reload_attempted', 'true')
        window.location.reload()
        return new Promise(() => {}) // Promesa pendiente mientras la página se recarga
      }
      sessionStorage.removeItem('chunk_reload_attempted')
      throw error
    }
  })
}
