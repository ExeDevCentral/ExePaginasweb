import { describe, it, expect } from 'vitest'
import { DASHBOARD_VIEWS, isDashboardView, setTabInUrl } from './DashboardView'

describe('DashboardView', () => {
  it('reconoce vistas válidas', () => {
    expect(isDashboardView('overview')).toBe(true)
    expect(isDashboardView('admin')).toBe(true)
    expect(isDashboardView('settings')).toBe(true)
  })

  it('rechaza vistas inválidas y null', () => {
    expect(isDashboardView('bogus')).toBe(false)
    expect(isDashboardView(null)).toBe(false)
    expect(isDashboardView('')).toBe(false)
  })

  it('lista todas las vistas del dashboard', () => {
    expect(DASHBOARD_VIEWS).toEqual([
      'overview',
      'services',
      'workgroups',
      'sla',
      'invoices',
      'settings',
      'admin',
    ])
  })

  it('setTabInUrl reemplaza el tab existente', () => {
    const { pathname, search } = setTabInUrl('services', '/dashboard?tab=overview')
    expect(pathname).toBe('/dashboard')
    expect(search).toBe('?tab=services')
  })

  it('setTabInUrl agrega el tab cuando no existe', () => {
    const { pathname, search } = setTabInUrl('sla', 'https://exe.dev/dashboard')
    expect(pathname).toBe('/dashboard')
    expect(search).toBe('?tab=sla')
  })
})
