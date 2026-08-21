'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

export const CoffeePortal3D = ({
  isVisible,
  onDismiss,
}: {
  isVisible: boolean
  onDismiss?: () => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showSkip, setShowSkip] = useState(false)
  const [beanPhase, setBeanPhase] = useState<'orbit' | 'explode'>('orbit')
  const phaseRef = useRef<'orbit' | 'explode'>('orbit')
  phaseRef.current = beanPhase

  useEffect(() => {
    if (!isVisible) {
      setBeanPhase('orbit')
      setShowSkip(false)
      return
    }
    const skipTimer = setTimeout(() => setShowSkip(true), 400)
    const explodeTimer = setTimeout(() => setBeanPhase('explode'), 600)
    return () => {
      clearTimeout(skipTimer)
      clearTimeout(explodeTimer)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 10)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    } catch {
      return
    }

    const disposables: { dispose: () => void }[] = []

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const pointLight = new THREE.PointLight(0xfbbf24, 2, 25)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Cup Group
    const cupGroup = new THREE.Group()
    cupGroup.rotation.x = 0.5
    scene.add(cupGroup)

    const cupGeo = new THREE.CylinderGeometry(1.5, 1.2, 2, 32)
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.1,
      transmission: 0.1,
      thickness: 0.5,
    })
    const cupMesh = new THREE.Mesh(cupGeo, cupMat)
    cupGroup.add(cupMesh)

    const handleGeo = new THREE.TorusGeometry(0.5, 0.15, 16, 32, Math.PI)
    const handleMat = new THREE.MeshStandardMaterial({ color: '#ffffff' })
    const handleMesh = new THREE.Mesh(handleGeo, handleMat)
    handleMesh.position.set(1.5, 0, 0)
    handleMesh.rotation.z = Math.PI / 2
    cupGroup.add(handleMesh)

    const liquidGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.1, 32)
    const liquidMat = new THREE.MeshStandardMaterial({
      color: '#2a1508',
      emissive: '#1a0f0a',
      emissiveIntensity: 0.5,
    })
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat)
    liquidMesh.position.set(0, 0.8, 0)
    cupGroup.add(liquidMesh)

    disposables.push(cupGeo, cupMat, handleGeo, handleMat, liquidGeo, liquidMat)

    // Beans
    const beanCount = 20
    const beanMeshes: THREE.Mesh[] = []
    const beanData: {
      orbitAngle: number
      orbitRadius: number
      yOffset: number
      speed: number
      rotSpeed: number
      explodeDir: THREE.Vector3
      explodeSpeed: number
    }[] = []

    const beanGeo = new THREE.SphereGeometry(0.25, 12, 8)
    disposables.push(beanGeo)

    for (let i = 0; i < beanCount; i++) {
      const hue = 0.07 + Math.random() * 0.04
      const lightness = 0.12 + Math.random() * 0.1
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.5, lightness),
        roughness: 0.6,
        metalness: 0.1,
      })
      disposables.push(mat)

      const mesh = new THREE.Mesh(beanGeo, mat)
      scene.add(mesh)
      beanMeshes.push(mesh)

      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const explodeDir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).normalize()

      beanData.push({
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 1.5 + Math.random() * 2.5,
        yOffset: (Math.random() - 0.5) * 2,
        speed: 0.2 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        explodeDir,
        explodeSpeed: 3 + Math.random() * 5,
      })
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer?.setSize(width, height, false)
    }
    window.addEventListener('resize', handleResize)

    let animId: number
    const clock = new THREE.Clock()
    let explodeStartTime: number | null = null

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      cupGroup.rotation.y = t * 0.4
      cupGroup.position.y = Math.sin(t * 2) * 0.2

      const phase = phaseRef.current

      if (phase === 'explode') {
        if (explodeStartTime === null) explodeStartTime = t
        const elapsed = t - explodeStartTime
        const ease = 1 - Math.exp(-elapsed * 3)

        for (let i = 0; i < beanCount; i++) {
          const m = beanMeshes[i]
          const d = beanData[i]
          const dist = ease * d.explodeSpeed
          m.position.copy(d.explodeDir).multiplyScalar(dist)
          m.rotation.x += d.rotSpeed * 4
          m.rotation.y += d.rotSpeed * 6
        }
      } else {
        explodeStartTime = null
        for (let i = 0; i < beanCount; i++) {
          const m = beanMeshes[i]
          const d = beanData[i]
          const angle = d.orbitAngle + t * d.speed
          const bob = Math.sin(t * 0.8) * 0.3
          m.position.set(
            Math.cos(angle) * d.orbitRadius,
            d.yOffset + bob,
            Math.sin(angle) * d.orbitRadius
          )
          m.rotation.x += d.rotSpeed
          m.rotation.y += d.rotSpeed * 1.5
        }
      }

      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      disposables.forEach((d) => d.dispose())
      renderer?.dispose()
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] bg-amber-950/30 backdrop-blur-sm cursor-pointer"
          onClick={onDismiss}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {showSkip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
              <div className="px-6 py-3 bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-full text-amber-200 text-sm font-semibold hover:bg-black/80 transition-colors pointer-events-auto">
                Click para continuar
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CoffeePortal3D
