'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const FallbackCSSBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-magenta/10" />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[120px] animate-pulse" />
  </div>
)

export const ThreeHeroScene: React.FC = () => {
  const { hasWebGL, isLowTier, prefersReducedMotion } = useDeviceCapabilities()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!hasWebGL) return
    const canvas = canvasRef.current
    if (!canvas) return

    let width = canvas.parentElement?.clientWidth || window.innerWidth
    let height = canvas.parentElement?.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(0, 0, 7)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isLowTier,
        powerPreference: isLowTier ? 'low-power' : 'high-performance',
      })
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(isLowTier ? 1 : Math.min(window.devicePixelRatio || 1, 1.5))
    } catch {
      return
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(10, 10, 5)
    scene.add(dirLight)
    const pointLight = new THREE.PointLight(0x00f0ff, 1.5, 20)
    pointLight.position.set(-10, -10, -5)
    scene.add(pointLight)

    // Particles Generation
    const count = isLowTier ? 300 : 1000
    const init = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const current = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const cyanColor = new THREE.Color('#00f0ff')
    const magentaColor = new THREE.Color('#ff007f')
    const whiteColor = new THREE.Color('#ffffff')

    const side = Math.cbrt(count)
    const gridSize = Math.ceil(side)
    const spacing = 0.45

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Chaos
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.cbrt(Math.random()) * 4.5

      init[i3] = r * Math.sin(phi) * Math.cos(theta)
      init[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      init[i3 + 2] = (Math.random() - 0.5) * 4

      // Target Matrix
      const xIndex = i % gridSize
      const yIndex = Math.floor(i / gridSize) % gridSize
      const zIndex = Math.floor(i / (gridSize * gridSize))

      target[i3] = (xIndex - gridSize / 2) * spacing
      target[i3 + 1] = (yIndex - gridSize / 2) * spacing
      target[i3 + 2] = (zIndex - gridSize / 2) * spacing

      current[i3] = init[i3]
      current[i3 + 1] = init[i3 + 1]
      current[i3 + 2] = init[i3 + 2]

      const mixRatio = Math.random()
      const particleColor = mixRatio < 0.4 ? cyanColor : mixRatio < 0.8 ? magentaColor : whiteColor
      colors[i3] = particleColor.r
      colors[i3 + 1] = particleColor.g
      colors[i3 + 2] = particleColor.b
    }

    const geometry = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(current, 3)
    geometry.setAttribute('position', posAttr)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: isLowTier ? 0.05 : 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // GSAP ScrollTrigger
    let trigger: ScrollTrigger | null = null
    if (!prefersReducedMotion) {
      const heroEl = document.getElementById('home') || document.body
      trigger = ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
    } else {
      progressRef.current = 1
    }

    // Resize Handler
    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.parentElement.clientWidth
      height = canvas.parentElement.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer?.setSize(width, height, false)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const p = progressRef.current

      // Interpolate positions between Chaos and System
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const wave = Math.sin(t * 1.2 + init[i3]) * (1 - p) * 0.15
        arr[i3] = init[i3] + (target[i3] - init[i3]) * p
        arr[i3 + 1] = init[i3 + 1] + (target[i3 + 1] - init[i3 + 1]) * p + wave
        arr[i3 + 2] = init[i3 + 2] + (target[i3 + 2] - init[i3 + 2]) * p
      }
      posAttr.needsUpdate = true

      points.rotation.y = t * 0.05
      points.rotation.x = Math.sin(t * 0.03) * 0.05

      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      trigger?.kill()
      geometry.dispose()
      material.dispose()
      renderer?.dispose()
    }
  }, [hasWebGL, isLowTier, prefersReducedMotion])

  if (!hasWebGL) {
    return <FallbackCSSBackground />
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}

export default ThreeHeroScene
