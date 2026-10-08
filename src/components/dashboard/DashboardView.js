/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */

export const DASHBOARD_VIEWS = [
  'overview',
  'services',
  'workgroups',
  'sla',
  'invoices',
  'settings',
  'admin',
]

export function isDashboardView(value) {
  return value !== null && DASHBOARD_VIEWS.includes(value)
}

export function setTabInUrl(tab, currentHref) {
  const url = currentHref.startsWith('http')
    ? new URL(currentHref)
    : new URL(currentHref, 'http://local')
  url.searchParams.set('tab', tab)
  return { pathname: url.pathname, search: url.search }
}
