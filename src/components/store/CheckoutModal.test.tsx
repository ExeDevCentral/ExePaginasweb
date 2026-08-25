import { describe, it, expect } from 'vitest'
import { Monitor } from 'lucide-react'
import type { PlanData } from './PlanCard'
import { calculateDiscount } from '../../core/domain/financial/financialEngine'

describe('Store & Checkout Model Unit Tests', () => {
  const samplePlan: PlanData = {
    id: 'basico',
    title: 'Plan Básico',
    description: 'Ideal para pequeños negocios',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
    border: 'border-blue-500/30',
    features: ['Soporte 24/7', 'Hosting incluido'],
    popular: false,
    price: '$29.000',
    priceUSD: 'USD 29',
    rawPriceARS: 29000,
    rawPriceUSD: 29,
    period: 'mes',
  }

  it('valida la estructura de datos y precio base del plan de checkout', () => {
    expect(samplePlan.title).toBe('Plan Básico')
    expect(samplePlan.priceUSD).toBe('USD 29')
    expect(samplePlan.id).toBe('basico')
  })

  it('calcula descuentos promocionales en el checkout correctamente', () => {
    const rawPriceNumeric = 29
    const discountedPrice = calculateDiscount(rawPriceNumeric, 10) // 10% OFF
    expect(discountedPrice).toBe(26.1)
  })
})
