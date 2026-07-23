import { useRef, useMemo, memo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const viewport = useThree((s) => s.viewport)

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.position.x = (pointer.x * viewport.width) / 2
      lightRef.current.position.y = (pointer.y * viewport.height) / 2
    }
  })

  return <pointLight ref={lightRef} color="#818cf8" intensity={2} distance={12} decay={2} />
}

function CrystalBall() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.15
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={[0, 0.2, 0]} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.8}
          distort={0.2}
          speed={1.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.3
      ref.current.rotation.z = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={[-3.5, 1.5, -2]} scale={0.6}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial
          color="#a855f7"
          emissive="#9333ea"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.7}
          distort={0.15}
          speed={2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  )
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.4
      ref.current.rotation.x = clock.getElapsedTime() * 0.25
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref} position={[3.8, -1, -1.5]} scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.3}
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  )
}

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = -clock.getElapsedTime() * 0.2
      ref.current.rotation.z = clock.getElapsedTime() * 0.15
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[-3, -2, -3]} scale={0.35}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.6}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  )
}

function FloatingDodecahedron() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.35
      ref.current.rotation.y = -clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={[2.5, 2.5, -4]} scale={0.25}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#e879f9"
          emissive="#d946ef"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  )
}

function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)

  const { positions, scales, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sc = new Float32Array(count)
    const col = new Float32Array(count * 3)
    const palette = [
      [0.39, 0.4, 0.95],
      [0.55, 0.36, 0.97],
      [0.5, 0.55, 0.97],
      [0.75, 0.53, 0.99],
      [0.06, 0.65, 0.92],
    ]

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2
      sc[i] = Math.random() * 0.03 + 0.01
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c[0]
      col[i * 3 + 1] = c[1]
      col[i * 3 + 2] = c[2]
    }
    return { positions: pos, scales: sc, colors: col }
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime() * 0.1
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3] + Math.sin(t + i * 0.5) * 0.3
      const y = positions[i * 3 + 1] + Math.cos(t + i * 0.3) * 0.2
      const z = positions[i * 3 + 2] + Math.sin(t + i * 0.7) * 0.15
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scales[i] + Math.sin(t * 2 + i) * 0.005)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]}>
        <instancedBufferAttribute attach="attributes-instanceColor" args={[colors, 3]} />
      </sphereGeometry>
      <meshBasicMaterial transparent opacity={0.6} />
    </instancedMesh>
  )
}

function Scene() {
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    camera.position.set(0, 0, 6)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.15} color="#c7d2fe" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#a855f7" />
      <pointLight position={[0, 3, -3]} intensity={0.3} color="#e879f9" />
      <MouseLight />
      <CrystalBall />
      <FloatingTorus />
      <FloatingOctahedron />
      <FloatingIcosahedron />
      <FloatingDodecahedron />
      <Particles count={200} />
    </>
  )
}

const LoginScene = memo(function LoginScene() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0, 6], fov: 50 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
})

export default LoginScene
