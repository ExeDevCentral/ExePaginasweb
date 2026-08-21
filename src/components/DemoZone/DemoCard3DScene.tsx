'use client'

import React, { useRef, useMemo, memo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface DemoCard3DSceneProps {
  type: 'salon' | 'neofit' | 'aura' | 'coffee'
  isHovered: boolean
}

// 1. SALON BLOOM: 3D Torus Knot de Cristal con Destellos Rosa/Magenta
function SalonBloom3D({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const speed = isHovered ? 1.8 : 0.8
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.4 * speed
      meshRef.current.rotation.y = t * 0.6 * speed
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5 * speed
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <group position={[0, 0, 0]} scale={isHovered ? 1.15 : 1}>
        {/* Anillo exterior orbitante */}
        <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#fb7185"
            emissive="#f43f5e"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Torusknot de cristal rosa */}
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[0.75, 0.22, 100, 16]} />
          <meshPhysicalMaterial
            color="#f43f5e"
            emissive="#be123c"
            emissiveIntensity={isHovered ? 0.6 : 0.25}
            roughness={0.15}
            metalness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.3}
            thickness={0.8}
            wireframe={false}
          />
        </mesh>
      </group>
    </Float>
  )
}

// 2. NEOFIT STUDIO: Icosaedro Cyberpunk con Anillos de Energía Verde Neón
function NeoFit3D({ isHovered }: { isHovered: boolean }) {
  const icoRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const speed = isHovered ? 2.2 : 1.0
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.5 * speed
      icoRef.current.rotation.y = t * 0.7 * speed
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.9 * speed
      const scale = 0.5 + Math.sin(t * 3) * 0.08
      coreRef.current.scale.setScalar(scale)
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8 * speed
      ring1Ref.current.rotation.z = t * 0.4 * speed
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.7 * speed
      ring2Ref.current.rotation.z = t * 0.6 * speed
    }
  })

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1.4}>
      <group position={[0, 0, 0]} scale={isHovered ? 1.15 : 1}>
        {/* Estructura Wireframe Icosaedro */}
        <mesh ref={icoRef}>
          <icosahedronGeometry args={[0.95, 1]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={isHovered ? 1.2 : 0.6}
            wireframe
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Núcleo de energía de pulso */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#6ee7b7"
            emissive="#059669"
            emissiveIntensity={1.5}
            roughness={0.1}
            metalness={0.7}
          />
        </mesh>

        {/* Anillos orbitales giratorios */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.35, 0.025, 16, 64]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.2, 0.025, 16, 64]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

// 3. CASA AURA: Estructura Arquitectónica 3D & Prisma Inmobiliario Cyan
function CasaAura3D({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const speed = isHovered ? 1.5 : 0.7
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4 * speed
      groupRef.current.rotation.x = 0.25 + Math.sin(t * 0.5) * 0.1
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.6 * speed
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <group ref={groupRef} position={[0, 0, 0]} scale={isHovered ? 1.15 : 1}>
        {/* Prisma base de vidrio arquitectónico */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.1, 0.8, 1.1]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            roughness={0.1}
            metalness={0.3}
            transmission={0.4}
            thickness={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Techo flotante angular */}
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.0, 0.6, 4]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0369a1"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Retícula Blueprint flotante */}
        <mesh ref={wireRef} position={[0, 0, 0]}>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </Float>
  )
}

// 4. PIXEL COFFEE: Taza 3D y Granos de Café Flotantes con Vapor Ámbar
function PixelCoffee3D({ isHovered }: { isHovered: boolean }) {
  const cupGroup = useRef<THREE.Group>(null)
  const steamRing = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const speed = isHovered ? 2.0 : 0.9
    if (cupGroup.current) {
      cupGroup.current.rotation.y = t * 0.5 * speed
      cupGroup.current.rotation.z = Math.sin(t * 0.8) * 0.08
    }
    if (steamRing.current) {
      steamRing.current.rotation.x = Math.PI / 2 + Math.sin(t * 2) * 0.15
      steamRing.current.position.y = 0.7 + Math.sin(t * 2.5) * 0.15
      const s = 0.8 + Math.sin(t * 2) * 0.2
      steamRing.current.scale.set(s, s, s)
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <group ref={cupGroup} position={[0, -0.1, 0]} scale={isHovered ? 1.15 : 1}>
        {/* Cuerpo de la taza */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.5, 0.9, 32]} />
          <meshPhysicalMaterial
            color="#fef3c7"
            emissive="#f59e0b"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.1}
            clearcoat={0.8}
          />
        </mesh>

        {/* Asa de la taza */}
        <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#fde68a" roughness={0.3} />
        </mesh>

        {/* Superficie del café negro/espresso */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.05, 32]} />
          <meshStandardMaterial
            color="#451a03"
            emissive="#78350f"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>

        {/* Anillo de vapor dorado */}
        <mesh ref={steamRing} position={[0, 0.7, 0]}>
          <torusGeometry args={[0.4, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#fbbf24"
            emissiveIntensity={1.2}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Micro-partículas ambientales para dar vida y atmósfera a la escena
function CardParticles({ color, count = 35 }: { color: string; count?: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 4.5
      p[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      p[i * 3 + 2] = (Math.random() - 0.5) * 3.0
    }
    return p
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.12
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.08
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const DemoCard3DScene: React.FC<DemoCard3DSceneProps> = memo(({ type, isHovered }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const config = useMemo(() => {
    switch (type) {
      case 'salon':
        return {
          lightColor: '#f43f5e',
          particleColor: '#fb7185',
          comp: <SalonBloom3D isHovered={isHovered} />,
        }
      case 'neofit':
        return {
          lightColor: '#10b981',
          particleColor: '#34d399',
          comp: <NeoFit3D isHovered={isHovered} />,
        }
      case 'aura':
        return {
          lightColor: '#38bdf8',
          particleColor: '#7dd3fc',
          comp: <CasaAura3D isHovered={isHovered} />,
        }
      case 'coffee':
        return {
          lightColor: '#f59e0b',
          particleColor: '#fbbf24',
          comp: <PixelCoffee3D isHovered={isHovered} />,
        }
    }
  }, [type, isHovered])

  if (!mounted) return <div className="w-full h-44 rounded-2xl" />

  return (
    <div className="w-full h-44 relative overflow-hidden pointer-events-none select-none rounded-2xl">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={config.lightColor} />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[0, 4, 2]} intensity={0.9} />

        {config.comp}
        <CardParticles color={config.particleColor} />
      </Canvas>
    </div>
  )
})

export default DemoCard3DScene
