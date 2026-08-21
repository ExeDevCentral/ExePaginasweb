'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const FloatingGeos = React.memo(function FloatingGeos() {
  const group = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.025
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.05
  })

  const shapes = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        pos: [(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, -6 + Math.random() * -4] as [
          number,
          number,
          number,
        ],
        color: i % 2 === 0 ? '#22d3ee' : '#ec4899',
        scale: 0.4 + Math.random() * 0.8,
        type: i % 4,
      })),
    []
  )

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          {s.type === 0 && <icosahedronGeometry args={[1, 0]} />}
          {s.type === 1 && <octahedronGeometry args={[1, 0]} />}
          {s.type === 2 && <dodecahedronGeometry args={[1, 0]} />}
          {s.type === 3 && <torusKnotGeometry args={[0.6, 0.2, 24, 12]} />}
          <meshPhysicalMaterial
            color={s.color}
            transparent
            opacity={0.12}
            roughness={0.1}
            metalness={0.9}
            wireframe
          />
        </mesh>
      ))}
    </group>
  )
})

export default function Quote3DCanvas() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-60">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={60} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <FloatingGeos />
      </Canvas>
    </div>
  )
}
