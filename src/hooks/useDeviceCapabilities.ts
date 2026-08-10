import { useState, useEffect } from 'react'

export interface DeviceCapabilities {
  isLowTier: boolean
  prefersReducedMotion: boolean
  hasWebGL: boolean
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>(() => {
    return {
      isLowTier: false,
      prefersReducedMotion: false,
      hasWebGL: true,
    }
  })

  useEffect(() => {
    let webglSupported = false
    try {
      const canvas = document.createElement('canvas')
      webglSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
      )
    } catch {
      webglSupported = false
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobileTouch = window.matchMedia('(pointer: coarse)').matches
    const concurrency = navigator.hardwareConcurrency || 4
    const isLowConcurrency = concurrency <= 4

    const lowTier = isMobileTouch || isLowConcurrency

    setCaps({
      isLowTier: lowTier,
      prefersReducedMotion: reducedMotion,
      hasWebGL: webglSupported,
    })
  }, [])

  return caps
}

export default useDeviceCapabilities
