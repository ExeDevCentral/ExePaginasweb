import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { damp3, dampC } from 'maath/easing'

interface BlockState {
  chaosPos: [number, number, number]
  chaosRot: [number, number, number]
  gridPos: [number, number, number]
  targetHeight: number
  color: THREE.Color
}

function generateBlocks(cols: number, rows: number, isLowTier: boolean): BlockState[] {
  const count = cols * rows
  const tile = 1.5

  const cyan = new THREE.Color('#38bdf8')
  const magenta = new THREE.Color('#e0e7ff')
  const blue = new THREE.Color('#60a5fa')
  const slate = new THREE.Color('#334155')

  return Array.from({ length: count }, (_, i) => {
    const gx = i % cols
    const gy = Math.floor(i / cols)

    const rand = Math.random()
    const blockColor = rand < 0.4 ? cyan : rand < 0.7 ? blue : rand < 0.9 ? magenta : slate

    return {
      chaosPos: [(Math.random() - 0.5) * 12, Math.random() * 3.5 + 1.0, (Math.random() - 0.5) * 12],
      chaosRot: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        isLowTier ? 0 : Math.random() * Math.PI,
      ],
      gridPos: [(gx - cols / 2 + 0.5) * tile, 0, (gy - rows / 2 + 0.5) * tile],
      targetHeight: 0.8 + Math.random() * 2.2,
      color: blockColor,
    }
  })
}

function easedProgress(p: number): number {
  if (p <= 0.35) return 0
  if (p >= 0.55) return 1
  const t = (p - 0.35) / 0.2
  return t * t * (3 - 2 * t)
}

interface CityBlocksProps {
  progressRef: React.MutableRefObject<number>
  isLowTier?: boolean
  reducedMotion?: boolean
}

export const CityBlocks: React.FC<CityBlocksProps> = ({
  progressRef,
  isLowTier = false,
  reducedMotion = false,
}) => {
  const cols = isLowTier ? 4 : 6
  const rows = isLowTier ? 4 : 6
  const count = cols * rows

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const blocks = useMemo(() => generateBlocks(cols, rows, isLowTier), [cols, rows, isLowTier])

  const coolGray = useMemo(() => new THREE.Color('#38bdf8'), [])
  const cleanCyan = useMemo(() => new THREE.Color('#22d3ee'), [])
  const currentColor = useMemo(() => new THREE.Color(), [])

  const instanceColors = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      array[i * 3] = blocks[i].color.r
      array[i * 3 + 1] = blocks[i].color.g
      array[i * 3 + 2] = blocks[i].color.b
    }
    return array
  }, [count, blocks])

  useFrame(({ pointer }, delta) => {
    if (!meshRef.current) return

    const rawProgress = reducedMotion ? 1 : progressRef.current
    const ep = easedProgress(rawProgress)

    for (let i = 0; i < count; i++) {
      const b = blocks[i]

      const currentScaleY = THREE.MathUtils.lerp(1, b.targetHeight, ep)
      const targetY = THREE.MathUtils.lerp(b.chaosPos[1], b.targetHeight / 2, ep)

      const x = THREE.MathUtils.lerp(b.chaosPos[0], b.gridPos[0], ep)
      const y = targetY
      const z = THREE.MathUtils.lerp(b.chaosPos[2], b.gridPos[2], ep)

      const rotX = THREE.MathUtils.lerp(b.chaosRot[0], 0, ep)
      const rotY = THREE.MathUtils.lerp(b.chaosRot[1], 0, ep)
      const rotZ = THREE.MathUtils.lerp(b.chaosRot[2], 0, ep)

      dummy.position.set(x, y, z)
      dummy.rotation.set(rotX, rotY, rotZ)
      dummy.scale.set(0.85, currentScaleY * 0.85, 0.85)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    if (lightRef.current) {
      if (!reducedMotion) {
        damp3(lightRef.current.position, [pointer.x * 5 + 6, 9, pointer.y * 5 + 8], 0.25, delta)
      } else {
        lightRef.current.position.set(6, 9, 8)
      }

      currentColor.copy(coolGray).lerp(cleanCyan, ep)
      dampC(lightRef.current.color, currentColor, 0.2, delta)
    }
  })

  return (
    <group>
      {/* High-visibility hemisphere and ambient lights */}
      <ambientLight intensity={1.8} />
      <hemisphereLight args={['#38bdf8', '#1e1b4b', 2.2]} />

      {/* Main Directional Key Light */}
      <directionalLight
        ref={lightRef}
        position={[6, 9, 8]}
        intensity={3.5}
        castShadow={!isLowTier}
      />

      {/* Secondary Rim Directional Light */}
      <directionalLight position={[-6, 4, -6]} color="#d946ef" intensity={2.2} />

      {/* Cyber Neon Point Light Grid Center */}
      <pointLight position={[0, 5, 0]} color="#00f0ff" intensity={5.0} distance={25} />
      <pointLight position={[0, -1, 0]} color="#d946ef" intensity={3.0} distance={20} />

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow={!isLowTier}
        receiveShadow={!isLowTier}
      >
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[instanceColors, 3]} />
        </boxGeometry>
        <meshStandardMaterial
          vertexColors
          roughness={0.2}
          metalness={0.2}
          emissive="#0284c7"
          emissiveIntensity={0.35}
        />
      </instancedMesh>
    </group>
  )
}

export default CityBlocks
