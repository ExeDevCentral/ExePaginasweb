/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobilePricingView:
 * Vista de precios y simulador de ahorro BigInt optimizada exclusivamente para celulares (< 768px).
 */
'use client'

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { ArrowUpRight, Calculator, Check, ShieldCheck, TrendingUp } from 'lucide-react'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

type Currency = 'ARS' | 'USD'

interface MobilePlan {
  readonly id: 'landing' | 'ecommerce' | 'linux'
  readonly name: string
  readonly tag?: string
  readonly setupARS: string
  readonly setupUSD: string
  readonly monthlyARS: string
  readonly monthlyUSD: string
  readonly features: readonly string[]
  readonly quoteHref: string
}

const PLANS: readonly MobilePlan[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    setupARS: '$450.000',
    setupUSD: 'u$s 380',
    monthlyARS: '$15.000/mes',
    monthlyUSD: 'u$s 25/mes',
    features: [
      'Diseño a medida ultra rápido',
      'WhatsApp directo + SEO técnico',
      'Código 100% tuyo, sin cuotas cautivas',
    ],
    quoteHref: '/cotizador?plan=landing',
  },
  {
    id: 'ecommerce',
    name: 'Tienda / Reservas',
    tag: 'Recomendado',
    setupARS: '$850.000',
    setupUSD: 'u$s 780',
    monthlyARS: '$42.000/mes',
    monthlyUSD: 'u$s 48/mes',
    features: [
      'Catálogo + carrito o agenda 24/7',
      'Cobros directos sin comisiones (0% fee)',
      'Panel de administración + PostgreSQL',
      'Soporte SLA y propiedad total del código',
    ],
    quoteHref: '/cotizador?plan=ecommerce',
  },
  {
    id: 'linux',
    name: 'Terminal Linux POS',
    setupARS: '$520.000',
    setupUSD: 'u$s 450',
    monthlyARS: '$48.000/mes',
    monthlyUSD: 'u$s 42/mes',
    features: [
      'Recupera PCs de caja (arranque en 4.5s)',
      'Modo quiosco blindado · $0 en licencias',
      'Impresoras ESC/POS + USB de rescate',
    ],
    quoteHref: '/cotizador?plan=linux',
  },
]

export default function MobilePricingView() {
  const { t } = useTranslation()
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [monthlyRevenueMillions, setMonthlyRevenueMillions] = useState<number>(6)

  // Cálculo de ahorro anual con BigInt monetario (3% comisión típica + abono SaaS mensual)
  const annualSavingsFormatted = useMemo(() => {
    const monthlyRevenueCents = BigInt(monthlyRevenueMillions) * BigInt(1_000_000) * BigInt(100)
    const monthlyCommissionCents = (monthlyRevenueCents * BigInt(3)) / BigInt(100)
    const monthlyRentCents = BigInt(65_000) * BigInt(100)
    const annualTotalCents = (monthlyCommissionCents + monthlyRentCents) * BigInt(12)

    if (currency === 'USD') {
      const usdUnits = annualTotalCents / BigInt(100) / BigInt(1150)
      return `u$s ${usdUnits.toLocaleString('es-AR')}`
    }
    const arsUnits = annualTotalCents / BigInt(100)
    return `$${arsUnits.toLocaleString('es-AR').replaceAll(',', '.')}`
  }, [monthlyRevenueMillions, currency])

  return (
    <div
      data-mobile-pricing="true"
      className="relative z-10 min-h-screen bg-transparent text-foreground pt-20 pb-28 px-4 overflow-x-clip"
    >
      <div className="max-w-sm mx-auto space-y-5">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
              Precios claros
            </p>
            <h1 className="text-2xl font-display font-bold tracking-tight mt-0.5">
              1 solo pago, tuyo
            </h1>
          </div>

          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 shrink-0 mt-1">
            {(['ARS', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                  currency === curr
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Lista limpia de planes */}
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-2xl border space-y-3.5 ${
                plan.tag
                  ? 'bg-white dark:bg-[#0c1324] border-emerald-500/45 shadow-md'
                  : 'bg-white dark:bg-[#0b101d] border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-foreground">{plan.name}</h2>
                    {plan.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold">
                        {plan.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Mant. opcional {currency === 'ARS' ? plan.monthlyARS : plan.monthlyUSD}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl font-display font-black text-foreground leading-none">
                    {currency === 'ARS' ? plan.setupARS : plan.setupUSD}
                  </p>
                  <p className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    Pago único
                  </p>
                </div>
              </div>

              <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/8">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={getWhatsAppUrl(
                    `¡Hola Exequiel! Quiero consultar por el plan ${plan.name} (${currency === 'ARS' ? plan.setupARS : plan.setupUSD}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('contact_whatsapp_clicked', {
                      source: 'mobile_pricing_card',
                      plan: plan.id,
                    })
                  }
                  className="h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 active:scale-[0.98] transition-transform"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href={`${plan.quoteHref}&currency=${currency}`}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-foreground font-semibold text-xs flex items-center justify-center gap-1 active:scale-[0.98] transition-transform"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cotizar</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Simulador rápido de ahorro anual (BigInt) */}
        <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#0d1424] border border-slate-800 dark:border-cyan-500/25 text-white space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              {t('mobile.savings_vs_rent')}
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              ${monthlyRevenueMillions}M/mes
            </span>
          </div>

          <label className="block">
            <span className="sr-only">{t('mobile.monthly_revenue_sr')}</span>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={monthlyRevenueMillions}
              onChange={(e) => setMonthlyRevenueMillions(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </label>

          <div className="flex items-baseline justify-between pt-1 border-t border-white/10">
            <span className="text-xs text-slate-300">{t('mobile.annual_savings')}</span>
            <span className="text-xl font-display font-black text-emerald-400">
              {annualSavingsFormatted}
            </span>
          </div>
        </div>

        {/* Garantía */}
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{t('mobile.maintenance_optional')}</span>
        </div>
      </div>
    </div>
  )
}
