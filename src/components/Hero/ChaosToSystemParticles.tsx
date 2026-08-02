import React, { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ChaosToSystemParticlesProps {
  isLowTier?: boolean
  prefersReducedMotion?: boolean
}

export const ChaosToSystemParticles: React.FC<ChaosToSystemParticlesProps> = ({
  isLowTier = false,
  prefersReducedMotion = false,
}) => {
  const count = isLowTier ? 300 : 1200
  const pointsRef = useRef<THREE.Points>(null)
  const progressRef = useRef(0)

  // Generate Chaos and System 3D coordinate positions
  const { initialPositions, targetPositions, currentPositions, colors } = useMemo(() => {
    const init = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const current = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const cyanColor = new THREE.Color('#00f0ff')
    const magentaColor = new THREE.Color('#ff007f')
    const whiteColor = new THREE.Color('#ffffff')

    // Grid size for target (System) arrangement
    const side = Math.cbrt(count)
    const gridSize = Math.ceil(side)
    const spacing = 0.4

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // 1. Chaos Position: Random cloud in 3D sphere
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.cbrt(Math.random()) * 4.5

      init[i3] = r * Math.sin(phi) * Math.cos(theta)
      init[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      init[i3 + 2] = (Math.random() - 0.5) * 4

      // 2. System Position: Ordered 3D Matrix Grid
      const xIndex = i % gridSize
      const yIndex = Math.floor(i / gridSize) % gridSize
      const zIndex = Math.floor(i / (gridSize * gridSize))

      target[i3] = (xIndex - gridSize / 2) * spacing
      target[i3 + 1] = (yIndex - gridSize / 2) * spacing
      target[i3 + 2] = (zIndex - gridSize / 2) * spacing

      // Initial current positions start as Chaos
      current[i3] = init[i3]
      current[i3 + 1] = init[i3 + 1]
      current[i3 + 2] = init[i3 + 2]

      // Colors gradient (cyan to magenta / white)
      const mixRatio = Math.random()
      const particleColor = mixRatio < 0.4 ? cyanColor : mixRatio < 0.8 ? magentaColor : whiteColor
      col[i3] = particleColor.r
      col[i3 + 1] = particleColor.g
      col[i3 + 2] = particleColor.b
    }

    return {
      initialPositions: init,
      targetPositions: target,
      currentPositions: current,
      colors: col,
    }
  }, [count])

  // GSAP ScrollTrigger to drive progressRef smoothly with scroll
  useEffect(() => {
    if (prefersReducedMotion) {
      progressRef.current = 1
      return
    }

    const heroElement = document.getElementById('home')
    if (!heroElement) return

    const trigger = ScrollTrigger.create({
      trigger: heroElement,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    return () => {
      trigger.kill()
    }
  }, [prefersReducedMotion])

  // R3F render loop: Direct buffer manipulation & zero React re-renders
  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry
    const posAttribute = geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttribute.array as Float32Array

    const p = prefersReducedMotion ? 1 : progressRef.current
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Linear interpolation from Chaos to System
      const startX = initialPositions[i3]
      const startY = initialPositions[i3 + 1]
      const startZ = initialPositions[i3 + 2]

      const endX = targetPositions[i3]
      const endY = targetPositions[i3 + 1]
      const endZ = targetPositions[i3 + 2]

      // Subtle noise wave when in chaotic state
      const noiseX = (1 - p) * Math.sin(elapsedTime * 1.5 + i) * 0.08
      const noiseY = (1 - p) * Math.cos(elapsedTime * 1.5 + i) * 0.08

      posArray[i3] = THREE.MathUtils.lerp(startX, endX, p) + noiseX
      posArray[i3 + 1] = THREE.MathUtils.lerp(startY, endY, p) + noiseY
      posArray[i3 + 2] = THREE.MathUtils.lerp(startZ, endZ, p)
    }

    posAttribute.needsUpdate = true

    // Mouse Parallax & Idle Rotation
    if (!prefersReducedMotion && !isLowTier) {
      const targetRotX = pointer.y * 0.25
      const targetRotY = pointer.x * 0.35 + elapsedTime * 0.05
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        targetRotX,
        0.05
      )
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.rotation.y,
        targetRotY,
        0.05
      )
    } else {
      pointsRef.current.rotation.y = elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isLowTier ? 0.06 : 0.045}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default ChaosToSystemParticles
