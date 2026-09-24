import React from 'react'
import ChaosToSystemHero from '@/components/Hero/ChaosToSystemHero'

export const metadata = {
  title: 'Preview: Del Caos al Sistema | ExePaginasWeb Upgrade',
  description: 'Prototipo Hero Upgrade: Del Caos al Sistema en 3 Actos con animación scroll-driven',
}

export default function HeroUpgradePreviewPage() {
  return (
    <main className="bg-[#030308] min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
      <ChaosToSystemHero />
    </main>
  )
}
