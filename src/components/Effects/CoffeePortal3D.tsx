import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

const Bean = ({ phase }: { phase: 'orbit' | 'explode' }) => {
  const ref = useRef<THREE.Mesh>(null)

  const orbitAngle = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbitRadius = useMemo(() => 1.5 + Math.random() * 2.5, [])
  const yOffset = useMemo(() => (Math.random() - 0.5) * 2, [])
  const speed = useMemo(() => 0.2 + Math.random() * 0.3, [])
  const rotSpeed = useMemo(() => (Math.random() - 0.5) * 0.015, [])
  const phaseVal = useMemo(() => Math.random() * Math.PI * 2, [])
  const hue = useMemo(() => 0.07 + Math.random() * 0.04, [])
  const lightness = useMemo(() => 0.12 + Math.random() * 0.1, [])

  const explodeDir = useMemo(() => {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    return new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ).normalize()
  }, [])
  const explodeSpeed = useMemo(() => 3 + Math.random() * 5, [])
  const explodeStartTime = useRef<number | null>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phaseVal

    if (phase === 'explode') {
      if (explodeStartTime.current === null) explodeStartTime.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - explodeStartTime.current
      const ease = 1 - Math.exp(-elapsed * 3)
      const dist = ease * explodeSpeed
      ref.current.position.x = explodeDir.x * dist
      ref.current.position.y = explodeDir.y * dist
      ref.current.position.z = explodeDir.z * dist
      ref.current.rotation.x += rotSpeed * 4
      ref.current.rotation.y += rotSpeed * 6
      ref.current.rotation.z += rotSpeed * 2
    } else {
      explodeStartTime.current = null
      const angle = orbitAngle + t
      const bob = Math.sin(t * 0.8) * 0.3
      ref.current.position.x = Math.cos(angle) * orbitRadius
      ref.current.position.z = Math.sin(angle) * orbitRadius
      ref.current.position.y = yOffset + bob
      ref.current.rotation.x += rotSpeed
      ref.current.rotation.y += rotSpeed * 1.5
      ref.current.rotation.z += rotSpeed * 0.5
    }
  })

  return (
    <mesh ref={ref} position={[orbitRadius, yOffset, 0]}>
      <sphereGeometry args={[0.25, 12, 8]} />
      <meshStandardMaterial
        color={new THREE.Color().setHSL(hue, 0.5, lightness)}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  )
}

const StylizedCup = () => {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <group position={[0, 0, 0]} rotation={[0.5, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1.5, 1.2, 2, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.1} thickness={0.5} />
        </mesh>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.1, 32]} />
          <meshStandardMaterial color="#2a1508" emissive="#1a0f0a" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

export const CoffeePortal3D = ({
  isVisible,
  onDismiss,
}: {
  isVisible: boolean
  onDismiss?: () => void
}) => {
  const beans = useMemo(() => Array.from({ length: 30 }).map((_, i) => i), [])
  const [beanPhase, setBeanPhase] = useState<'orbit' | 'explode'>('orbit')
  const [showSkip, setShowSkip] = useState(false)

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
          <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#fbbf24" />
            <spotLight
              position={[-10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              castShadow
            />

            <Environment preset="city" />

            <group>
              <StylizedCup />
              {beans.map((id) => (
                <Bean key={id} phase={beanPhase} />
              ))}
            </group>

            <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
          </Canvas>

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
