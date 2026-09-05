'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { isDashboardView, setTabInUrl, DashboardView } from '../components/dashboard/DashboardView'

export type { DashboardView }
export type DashboardMode = 'admin' | 'client'

export interface UseDashboardNavigationResult {
  activeView: DashboardView
  viewMode: DashboardMode
  visitedTabs: Set<DashboardView>
  setViewMode: (mode: DashboardMode) => void
  handleTabChange: (tabId: DashboardView) => void
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
}

export function useDashboardNavigation(): UseDashboardNavigationResult {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as DashboardView | null

  const [activeView, setActiveView] = useState<DashboardView>(
    isDashboardView(tabParam) ? tabParam : 'overview'
  )
  const [viewMode, setViewMode] = useState<DashboardMode>('admin')
  const [visitedTabs, setVisitedTabs] = useState<Set<DashboardView>>(
    () => new Set([isDashboardView(tabParam) ? tabParam : 'overview'])
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sync activeView with searchParams tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (isDashboardView(tab)) {
      setActiveView(tab)
      setVisitedTabs((prev) => {
        if (prev.has(tab)) return prev
        const next = new Set(prev)
        next.add(tab)
        return next
      })
    }
  }, [searchParams])

  const handleTabChange = useCallback((tabId: DashboardView) => {
    setActiveView((current) => {
      if (current === tabId) return current
      return tabId
    })
    setVisitedTabs((prev) => {
      if (prev.has(tabId)) return prev
      const next = new Set(prev)
      next.add(tabId)
      return next
    })
    if (typeof window !== 'undefined') {
      const { pathname, search } = setTabInUrl(tabId, window.location.href)
      window.history.replaceState(null, '', pathname + search)
    }
    setSidebarOpen(false)
  }, [])

  return {
    activeView,
    viewMode,
    visitedTabs,
    setViewMode,
    handleTabChange,
    sidebarOpen,
    setSidebarOpen,
  }
}
