/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * DesktopLandingView: Vista integral y profunda de arquitectura de software para escritorio.
 * Desacoplada de mobile para asegurar carga diferida y cero desperdicio de DOM en celulares.
 */
'use client'

import React from 'react'
import OptimusScaleHero from '@/components/Hero/OptimusScaleHero'
import HowWeWorkSection from '@/components/landing/HowWeWorkSection'
import OwnershipVsSubscription from '@/components/shared/OwnershipVsSubscription'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/layout/Footer'

export default function DesktopLandingView() {
  return (
    <>
      <OptimusScaleHero />
      <HowWeWorkSection />
      <OwnershipVsSubscription />
      <PortfolioSection featuredOnly />
      <ContactSection />
      <Footer />
    </>
  )
}
