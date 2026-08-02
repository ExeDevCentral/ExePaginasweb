import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { damp3, dampC } from 'maath/easing'

interface BlockState {
  chaosPos: [number, number, number]
  chaosRot: [number, number, number]
  gridPos: [number, number, number]
  targetHeight: number
}

function generateBlocks(cols: number, rows: number, isLowTier: boolean): BlockState[] {
  const count = cols * rows
  const tile = 1.4

  return Array.from({ length: count }, (_, i) => {
    const gx = i % cols
    const gy = Math.floor(i / cols)

    return {
      chaosPos: [(Math.random() - 0.5) * 14, Math.random() * 3.5 + 0.5, (Math.random() - 0.5) * 14],
      chaosRot: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        isLowTier ? 0 : Math.random() * Math.PI,
      ],
      gridPos: [(gx - cols / 2 + 0.5) * tile, 0, (gy - rows / 2 + 0.5) * tile],
      targetHeight: 0.6 + Math.random() * 2.0,
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

  const coolGray = useMemo(() => new THREE.Color('#64748b'), [])
  const cleanCyan = useMemo(() => new THREE.Color('#22d3ee'), [])
  const currentColor = useMemo(() => new THREE.Color(), [])

  useFrame(({ pointer }, delta) => {
    if (!meshRef.current) return

    const rawProgress = reducedMotion ? 1 : progressRef.current
    const ep = easedProgress(rawProgress)

    // Update block matrix transformations directly without React setState
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
      dummy.scale.set(1, currentScaleY, 1)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true

    // Directional Light Pointer Parallax & Color Interpolation
    if (lightRef.current) {
      if (!reducedMotion) {
        damp3(lightRef.current.position, [pointer.x * 3.5, 5, pointer.y * 3.5 + 4], 0.25, delta)
      } else {
        lightRef.current.position.set(2, 5, 4)
      }

      currentColor.copy(coolGray).lerp(cleanCyan, ep)
      dampC(lightRef.current.color, currentColor, 0.2, delta)
    }
  })

  return (
    <group>
      <ambientLight intensity={0.35} />
      <directionalLight
        ref={lightRef}
        position={[2, 5, 4]}
        intensity={1.8}
        castShadow={!isLowTier}
      />
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow={!isLowTier}
        receiveShadow={!isLowTier}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.25}
          metalness={0.8}
          envMapIntensity={1.2}
        />
      </instancedMesh>
    </group>
  )
}

export default CityBlocks
