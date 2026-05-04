/**
 * IDs de secciones para navegación
 */
export const SECTION_IDS = ['home', 'products', 'features', 'contact'] as const

/**
 * Tipo para los IDs de sección
 */
export type SectionId = typeof SECTION_IDS[number]

/**
 * Items del menú de navegación
 */
export interface NavItem {
  label: string
  id: SectionId
  href: string
}

/**
 * Lista de items del menú
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', id: 'home' as SectionId, href: '#home' },
  { label: 'Sistemas', id: 'products' as SectionId, href: '#products' },
  { label: 'Features', id: 'features' as SectionId, href: '#features' },
  { label: 'Contacto', id: 'contact' as SectionId, href: '#contact' },
] as const

/**
 * Offset para scroll suave (en px)
 */
export const SCROLL_OFFSET = 80