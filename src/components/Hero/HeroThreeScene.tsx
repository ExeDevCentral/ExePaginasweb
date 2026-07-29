import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Environment,
  ContactShadows,
  MeshDistortMaterial,
  Sparkles,
} from '@react-three/drei'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'

function CoreCrystal({ isClicked }: { isClicked?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    // Inclinación dinámica siguiendo el puntero del mouse (orientación 3D reactiva)
    const targetRx = -state.pointer.y * 0.45
    const targetRy = state.pointer.x * 0.6 + state.clock.elapsedTime * 0.2

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRx, 0.08)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRy, 0.08)
  })

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[1.4, 0]} />
      <MeshDistortMaterial
        color={isClicked ? '#00d4ff' : '#1a0a2e'}
        emissive={isClicked ? '#00d4ff' : '#f6a623'}
        emissiveIntensity={isClicked ? 0.8 : 0.15}
        wireframe
        transparent
        opacity={0.65}
        distort={isClicked ? 0.4 : 0.12}
        speed={isClicked ? 3 : 0.8}
      />
    </mesh>
  )
}

function InnerGlow({ isClicked }: { isClicked?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const pulse = 0.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.12 + (isClicked ? 0.5 : 0)
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
    mat.emissiveIntensity = pulse
    meshRef.current.rotation.y += 0.008
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.95, 0]} />
      <meshPhysicalMaterial
        color="#2a1a3e"
        emissive={isClicked ? '#00d4ff' : '#f6a623'}
        emissiveIntensity={0.25}
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

function OrbitingBlocks() {
  const groupRef = useRef<THREE.Group>(null)
  const count = 10

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  const blocks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 2.4 + Math.random() * 0.3
      const yOff = (Math.random() - 0.5) * 1.5
      const size = 0.12 + Math.random() * 0.1
      const hue = 0.08 + Math.random() * 0.04
      return { angle, radius, yOff, size, hue, delay: Math.random() * Math.PI * 2 }
    })
  }, [])

  return (
    <group ref={groupRef}>
      {blocks.map((b, i) => (
        <Float
          key={i}
          speed={0.8 + Math.random() * 0.5}
          rotationIntensity={0.8}
          floatIntensity={0.4}
        >
          <mesh position={[Math.cos(b.angle) * b.radius, b.yOff, Math.sin(b.angle) * b.radius]}>
            <boxGeometry args={[b.size, b.size, b.size]} />
            <meshPhysicalMaterial
              color={new THREE.Color().setHSL(b.hue, 0.8, 0.5)}
              emissive={new THREE.Color().setHSL(b.hue, 0.9, 0.3)}
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function GoldenKey() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15 + 0.3
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
  })

  const keyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f6a623',
        metalness: 0.95,
        roughness: 0.1,
        emissive: '#f6a623',
        emissiveIntensity: 0.15,
      }),
    []
  )

  return (
    <group ref={groupRef} position={[0, 0.3, 2.2]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={keyMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} material={keyMat}>
        <torusGeometry args={[0.14, 0.04, 8, 16]} />
      </mesh>
      <mesh position={[0.08, 0.4, 0]} rotation={[0, 0, 0]} material={keyMat}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.6} color="#f6a623" distance={3} />
    </group>
  )
}

function OrbitRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.4
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.0, 0.015, 16, 60]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
    </mesh>
  )
}

function HouseStructure() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2
  })

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.7, 0.1, 1.4]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 0.8, -0.35]}>
        <boxGeometry args={[1.5, 0.5, 0.08]} />
        <meshPhysicalMaterial
          color="#2a1a3e"
          emissive="#f6a623"
          emissiveIntensity={0.03}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.8, 0.35]}>
        <boxGeometry args={[1.5, 0.5, 0.08]} />
        <meshPhysicalMaterial
          color="#2a1a3e"
          emissive="#f6a623"
          emissiveIntensity={0.03}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh position={[-0.4, 0.8, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.64]} />
        <meshPhysicalMaterial
          color="#2a1a3e"
          emissive="#f6a623"
          emissiveIntensity={0.03}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh position={[0.4, 0.8, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.64]} />
        <meshPhysicalMaterial
          color="#2a1a3e"
          emissive="#f6a623"
          emissiveIntensity={0.03}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.1, 0.6, 4]} />
        <meshPhysicalMaterial
          color="#1a0a2e"
          emissive="#ff6b35"
          emissiveIntensity={0.05}
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.6, 0.72]}>
        <planeGeometry args={[0.3, 0.45]} />
        <meshBasicMaterial color="#f6a623" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function Scene({ isClicked }: { isClicked: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} color="#1a1a2e" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={isClicked ? 1.5 : 0.8}
        color={isClicked ? '#00d4ff' : '#f6a623'}
      />
      <directionalLight position={[-3, 2, -5]} intensity={0.5} color="#00d4ff" />
      <pointLight
        position={[0, 0, 0]}
        intensity={isClicked ? 1.2 : 0.4}
        color={isClicked ? '#00d4ff' : '#ff6b35'}
        distance={8}
      />

      <group position={[0, 0.3, 0]}>
        <CoreCrystal isClicked={isClicked} />
        <InnerGlow isClicked={isClicked} />
        <HouseStructure />
      </group>

      <OrbitingBlocks />
      <OrbitRing />
      <GoldenKey />

      <Sparkles
        count={isClicked ? 180 : 100}
        scale={7}
        size={isClicked ? 0.9 : 0.5}
        speed={isClicked ? 0.6 : 0.2}
        noise={0.15}
        color={isClicked ? '#00d4ff' : '#f6a623'}
        opacity={isClicked ? 0.6 : 0.25}
      />

      <Sparkles
        count={50}
        scale={5}
        size={0.25}
        speed={0.15}
        noise={0.08}
        color="#00d4ff"
        opacity={0.15}
      />

      <Environment preset="night" />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={10} blur={3} far={4} />
      <fog attach="fog" args={['#050510', 4, 12]} />
    </>
  )
}

export default function HeroThreeScene() {
  const [isClicked, setIsClicked] = useState(false)

  return (
    <div
      className="absolute inset-0 rounded-[inherit] cursor-pointer pointer-events-auto"
      onClick={() => {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 800)
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 42 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene isClicked={isClicked} />
      </Canvas>
    </div>
  )
}
