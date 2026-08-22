'use client'

import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Coffee } from 'lucide-react'

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

    const skipTimer = setTimeout(() => setShowSkip(true), 300)
    const explodeTimer = setTimeout(() => setBeanPhase('explode'), 600)

    // Auto-transition to demo after explosion completes (2.5s)
    const autoDismissTimer = setTimeout(() => {
      if (onDismiss) onDismiss()
    }, 2600)

    return () => {
      clearTimeout(skipTimer)
      clearTimeout(explodeTimer)
      clearTimeout(autoDismissTimer)
    }
  }, [isVisible, onDismiss])

  useEffect(() => {
    if (!isVisible) return
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    } catch {
      return
    }

    const disposables: { dispose: () => void }[] = []

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const pointLight = new THREE.PointLight(0xfbbf24, 3, 30)
    pointLight.position.set(5, 8, 8)
    scene.add(pointLight)

    const pointLightWarm = new THREE.PointLight(0xd97706, 2.5, 25)
    pointLightWarm.position.set(-8, -4, 6)
    scene.add(pointLightWarm)

    // Cup Group
    const cupGroup = new THREE.Group()
    cupGroup.rotation.x = 0.45
    scene.add(cupGroup)

    const cupGeo = new THREE.CylinderGeometry(1.4, 1.0, 1.8, 32)
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: '#fef3c7',
      emissive: '#78350f',
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    })
    const cupMesh = new THREE.Mesh(cupGeo, cupMat)
    cupGroup.add(cupMesh)

    const handleGeo = new THREE.TorusGeometry(0.48, 0.12, 16, 32, Math.PI)
    const handleMat = new THREE.MeshStandardMaterial({ color: '#fde68a', roughness: 0.2 })
    const handleMesh = new THREE.Mesh(handleGeo, handleMat)
    handleMesh.position.set(1.4, 0, 0)
    handleMesh.rotation.z = Math.PI / 2
    cupGroup.add(handleMesh)

    const liquidGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.08, 32)
    const liquidMat = new THREE.MeshStandardMaterial({
      color: '#261206',
      emissive: '#451a03',
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.3,
    })
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat)
    liquidMesh.position.set(0, 0.72, 0)
    cupGroup.add(liquidMesh)

    // Golden steam ring
    const steamGeo = new THREE.TorusGeometry(0.7, 0.04, 16, 32)
    const steamMat = new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      emissive: '#f59e0b',
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.7,
    })
    const steamMesh = new THREE.Mesh(steamGeo, steamMat)
    steamMesh.position.set(0, 1.1, 0)
    steamMesh.rotation.x = Math.PI / 2
    cupGroup.add(steamMesh)

    disposables.push(cupGeo, cupMat, handleGeo, handleMat, liquidGeo, liquidMat, steamGeo, steamMat)

    // Realistic Roasted Coffee Beans
    const beanCount = 42
    const beanMeshes: THREE.Mesh[] = []
    const beanData: {
      orbitAngle: number
      orbitRadius: number
      yOffset: number
      speed: number
      rotSpeedX: number
      rotSpeedY: number
      rotSpeedZ: number
      explodeDir: THREE.Vector3
      explodeSpeed: number
    }[] = []

    const beanGeo = new THREE.SphereGeometry(0.26, 14, 10)
    disposables.push(beanGeo)

    const roastColors = ['#2b1307', '#3d1c0b', '#4e2510', '#5f3014', '#1f0d04', '#7c3f1d']

    for (let i = 0; i < beanCount; i++) {
      const colorHex = roastColors[i % roastColors.length]
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.45,
        metalness: 0.15,
      })
      disposables.push(mat)

      const mesh = new THREE.Mesh(beanGeo, mat)
      // Ellipsoid coffee bean shape
      mesh.scale.set(0.85, 1.25, 0.75)
      scene.add(mesh)
      beanMeshes.push(mesh)

      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const explodeDir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta) * 0.9,
        Math.cos(phi) * 1.1
      ).normalize()

      beanData.push({
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 1.6 + Math.random() * 2.8,
        yOffset: (Math.random() - 0.5) * 2.5,
        speed: 0.35 + Math.random() * 0.45,
        rotSpeedX: (Math.random() - 0.5) * 0.04,
        rotSpeedY: (Math.random() - 0.5) * 0.05,
        rotSpeedZ: (Math.random() - 0.5) * 0.03,
        explodeDir,
        explodeSpeed: 4.5 + Math.random() * 7.5,
      })
    }

    // Sparkle & Aroma Dust Particles
    const sparkCount = 80
    const sparkPositions = new Float32Array(sparkCount * 3)
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 4
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 4
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    const sparkGeo = new THREE.BufferGeometry()
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3))
    const sparkMat = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
    const sparkMesh = new THREE.Points(sparkGeo, sparkMat)
    scene.add(sparkMesh)
    disposables.push(sparkGeo, sparkMat)

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

      cupGroup.rotation.y = t * 0.5
      cupGroup.position.y = Math.sin(t * 2.2) * 0.15

      steamMesh.scale.setScalar(1 + Math.sin(t * 3) * 0.2)
      steamMesh.position.y = 1.1 + Math.sin(t * 2.5) * 0.15

      const phase = phaseRef.current

      if (phase === 'explode') {
        explodeStartTime ??= t
        const elapsed = t - explodeStartTime
        const ease = 1 - Math.exp(-elapsed * 3.5)

        for (let i = 0; i < beanCount; i++) {
          const m = beanMeshes[i]
          const d = beanData[i]
          const dist = ease * d.explodeSpeed
          m.position.copy(d.explodeDir).multiplyScalar(dist)
          m.rotation.x += d.rotSpeedX * 8
          m.rotation.y += d.rotSpeedY * 10
          m.rotation.z += d.rotSpeedZ * 8
        }

        // Expand cup and sparkles
        cupGroup.scale.lerp(new THREE.Vector3(1.25, 1.25, 1.25), 0.05)
        sparkMesh.scale.lerp(new THREE.Vector3(2.5, 2.5, 2.5), 0.08)
        sparkMat.opacity = Math.max(0, 0.85 - elapsed * 0.4)
      } else {
        explodeStartTime = null
        for (let i = 0; i < beanCount; i++) {
          const m = beanMeshes[i]
          const d = beanData[i]
          const angle = d.orbitAngle + t * d.speed
          const bob = Math.sin(t * 1.2 + i) * 0.35
          m.position.set(
            Math.cos(angle) * d.orbitRadius,
            d.yOffset + bob,
            Math.sin(angle) * d.orbitRadius
          )
          m.rotation.x += d.rotSpeedX
          m.rotation.y += d.rotSpeedY
          m.rotation.z += d.rotSpeedZ
        }

        sparkMesh.rotation.y = t * 0.2
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
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md cursor-pointer flex items-center justify-center overflow-hidden"
          onClick={onDismiss}
        >
          {/* Background Atmospheric Amber Aura */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-600/20 blur-[140px] pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/15 blur-[100px] pointer-events-none" />

          {/* 3D WebGL Canvas */}
          <canvas ref={canvasRef} className="w-full h-full block absolute inset-0 z-0" />

          {/* Center Cyber-Artisanal Header */}
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>E-COMMERCE HIGH PERFORMANCE</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            </div>

            <h2 className="text-4xl sm:text-6xl font-montserrat font-black text-white tracking-tight drop-shadow-[0_4px_25px_rgba(245,158,11,0.5)]">
              Pixel <span className="text-amber-400">Coffee</span>
            </h2>

            <p className="text-xs sm:text-sm font-mono text-amber-200/80 mt-1 font-semibold">
              💥 Estallido 3D de granos y arquitectura de alta conversión
            </p>
          </motion.div>

          {/* Bottom Action / Skip Button */}
          {showSkip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onDismiss) onDismiss()
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-[0_0_35px_rgba(245,158,11,0.6)] flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
              >
                <span>Entrar a la tienda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CoffeePortal3D
