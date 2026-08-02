import { useEffect, useState } from 'react'

export type DeviceTier = 'high' | 'medium' | 'low' | 'no-webgl'

export function useDeviceCapabilities() {
  const [tier, setTier] = useState<DeviceTier>('high')
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(touch)

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
    try {
      const canvas = document.createElement('canvas')
      gl = (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    } catch {
      gl = null
    }

    if (!gl) {
      setTier('no-webgl')
      return
    }

    const cores = navigator.hardwareConcurrency || 4
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4

    if (touch && (cores <= 4 || mem <= 4)) {
      setTier('low')
    } else if (touch) {
      setTier('medium')
    } else {
      setTier('high')
    }
  }, [])

  return { tier, isTouch }
}

export default useDeviceCapabilities
