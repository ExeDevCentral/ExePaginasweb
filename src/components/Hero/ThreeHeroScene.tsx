import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import ChaosToSystemParticles from './ChaosToSystemParticles'

const FallbackCSSBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-magenta/10" />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[120px] animate-pulse" />
  </div>
)

export const ThreeHeroScene: React.FC = () => {
  const { hasWebGL, isLowTier, prefersReducedMotion } = useDeviceCapabilities()

  if (!hasWebGL) {
    return <FallbackCSSBackground />
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{
          antialias: !isLowTier,
          powerPreference: isLowTier ? 'low-power' : 'high-performance',
          alpha: true,
        }}
        dpr={isLowTier ? [1, 1] : [1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#00f0ff" intensity={1.5} />

        <Suspense fallback={null}>
          <ChaosToSystemParticles
            isLowTier={isLowTier}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>

        {import.meta.env.DEV && <Stats className="!left-auto !right-4 !top-4" />}
      </Canvas>
    </div>
  )
}

export default ThreeHeroScene
