/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
export interface Plan {
  id: string
  slug?: string | null
  nombre: string | null
  precio: number | null
  caracteristicas: string | null
}
