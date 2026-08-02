import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import CityBlocks from './CityBlocks'

const StaticHeroFallback: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-magenta/15" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-cyan/15 blur-[140px]" />
    <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-accent-magenta/10 blur-[100px]" />
  </div>
)

interface ThreeHeroSceneProps {
  progressRef: React.MutableRefObject<number>
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({ progressRef }) => {
  const { tier } = useDeviceCapabilities()
  const reducedMotion = useReducedMotion()

  if (tier === 'no-webgl') {
    return <StaticHeroFallback />
  }

  const isLowTier = tier === 'low'

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [7, 7, 10], fov: 40 }}
        gl={{
          antialias: !isLowTier,
          powerPreference: isLowTier ? 'low-power' : 'high-performance',
          alpha: true,
        }}
        dpr={isLowTier ? [1, 1] : [1, 1.5]}
      >
        <Suspense fallback={null}>
          <CityBlocks
            progressRef={progressRef}
            isLowTier={isLowTier}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        {tier === 'high' && !reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.15} luminanceSmoothing={0.9} />
          </EffectComposer>
        )}

        {import.meta.env.DEV && <Stats className="!left-auto !right-4 !top-4" />}
      </Canvas>
    </div>
  )
}

export default ThreeHeroScene
