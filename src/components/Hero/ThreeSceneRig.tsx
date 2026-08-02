import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSceneProgress(targetElementId: string = 'home') {
  const progressRef = useRef(0)

  useEffect(() => {
    const el = document.getElementById(targetElementId)
    if (!el) return

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    return () => {
      st.kill()
    }
  }, [targetElementId])

  return progressRef
}

export default useSceneProgress
