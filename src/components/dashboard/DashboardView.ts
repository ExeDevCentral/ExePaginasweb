export type DashboardView =
  | 'overview'
  | 'services'
  | 'workgroups'
  | 'sla'
  | 'invoices'
  | 'settings'
  | 'admin'

export const DASHBOARD_VIEWS: DashboardView[] = [
  'overview',
  'services',
  'workgroups',
  'sla',
  'invoices',
  'settings',
  'admin',
]

export function isDashboardView(value: string | null): value is DashboardView {
  return value !== null && (DASHBOARD_VIEWS as string[]).includes(value)
}

export function setTabInUrl(
  tab: DashboardView,
  currentHref: string
): { pathname: string; search: string } {
  const url = currentHref.startsWith('http')
    ? new URL(currentHref)
    : new URL(currentHref, 'http://local')
  url.searchParams.set('tab', tab)
  return { pathname: url.pathname, search: url.search }
}
