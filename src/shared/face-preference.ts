/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Shared Face Preference persistence module (Classic vs V2 AWS Utility).
 */
'use client'

import { useCallback, useEffect, useState } from 'react'

export type SiteFace = 'classic' | 'v2'

export const FACE_STORAGE_KEY = 'exe:face' as const

export function isValidFace(value: unknown): value is SiteFace {
  return value === 'classic' || value === 'v2'
}

export function readStoredFace(storage?: Pick<Storage, 'getItem'> | null): SiteFace | null {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return null
    const raw = target.getItem(FACE_STORAGE_KEY)
    return isValidFace(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredFace(
  face: SiteFace,
  storage?: Pick<Storage, 'setItem'> | null
): boolean {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return false
    target.setItem(FACE_STORAGE_KEY, face)
    return true
  } catch {
    return false
  }
}

export function clearStoredFace(storage?: Pick<Storage, 'removeItem'> | null): boolean {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return false
    target.removeItem(FACE_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export interface UseFacePreferenceResult {
  face: SiteFace | null
  isReady: boolean
  setFace: (next: SiteFace) => boolean
  clearFace: () => boolean
}

export function useFacePreference(): UseFacePreferenceResult {
  const [face, setFaceState] = useState<SiteFace | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setFaceState(readStoredFace())
    setIsReady(true)
  }, [])

  const setFace = useCallback((next: SiteFace): boolean => {
    setFaceState(next)
    return writeStoredFace(next)
  }, [])

  const clearFace = useCallback((): boolean => {
    setFaceState(null)
    return clearStoredFace()
  }, [])

  return { face, isReady, setFace, clearFace }
}
