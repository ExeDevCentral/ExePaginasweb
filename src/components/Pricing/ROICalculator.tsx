import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calculator, Hourglass, TrendingUp, Sparkles } from 'lucide-react'

interface ROICalculatorProps {
  currency: 'ARS' | 'USD'
}

export default function ROICalculator({ currency }: ROICalculatorProps) {
  const { t } = useTranslation()
  const [hours, setHours] = useState(15) // Horas semanales perdidas

  // Costos por hora configurables según la moneda
  const defaultHourlyCost = currency === 'ARS' ? 3500 : 30
  const minHourlyCost = currency === 'ARS' ? 1000 : 10
  const maxHourlyCost = currency === 'ARS' ? 10000 : 100
  const stepHourlyCost = currency === 'ARS' ? 500 : 5

  const [hourlyCost, setHourlyCost] = useState(defaultHourlyCost)

  // Ajustar costo por hora automáticamente si cambia la moneda
  React.useEffect(() => {
    setHourlyCost(currency === 'ARS' ? 3500 : 30)
  }, [currency])

  // Cálculos
  const yearlyHoursSaved = hours * 52
  const yearlyMoneySaved = yearlyHoursSaved * hourlyCost

  // Costo promedio anual estimado de nuestro servicio (setup + mantenimiento)
  const ourEstimatedSetup = currency === 'ARS' ? 450000 : 900
  const ourEstimatedMonthly = currency === 'ARS' ? 25000 : 50
  const ourYearlyCost = ourEstimatedSetup + ourEstimatedMonthly * 12

  // Retorno de Inversión %
  const netSavings = Math.max(0, yearlyMoneySaved - ourYearlyCost)
  const roiPercentage = Math.round((netSavings / ourYearlyCost) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto rounded-[2.5rem] bg-card border border-border p-8 md:p-12 relative overflow-hidden shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent-cyan/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent-magenta/5 blur-[100px] pointer-events-none" />

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan text-xs font-bold uppercase tracking-wider">
            <Calculator size={12} />
            {t('calculador.badge')}
          </div>
          <h3 className="text-2xl md:text-3xl font-outfit font-black text-foreground">
            {t('calculador.heading')}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {t('calculador.descripcion')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Controles / Sliders */}
        <div className="space-y-8">
          {/* Slider Horas */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-accent-cyan animate-pulse" />
                {t('calculador.horas_label')}
              </label>
              <span className="text-xl font-mono font-black text-foreground bg-muted px-3 py-1 rounded-lg border border-border">
                {hours} hs
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-accent-cyan bg-muted h-2 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {t('calculador.horas_desc')}
            </p>
          </div>

          {/* Slider Costo por hora */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent-magenta" />
                {t('calculador.valor_label')}
              </label>
              <span className="text-xl font-mono font-black text-foreground bg-muted px-3 py-1 rounded-lg border border-border">
                {currency === 'ARS' ? '$' : 'u$s'} {hourlyCost.toLocaleString('es-AR')}
              </span>
            </div>
            <input
              type="range"
              min={minHourlyCost}
              max={maxHourlyCost}
              step={stepHourlyCost}
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value))}
              className="w-full accent-accent-magenta bg-muted h-2 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {t('calculador.valor_desc')}
            </p>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="rounded-3xl bg-muted border border-border p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            {/* Horas Recuperadas */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                {t('calculador.resultado_horas')}
              </p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-outfit font-black text-accent-cyan font-mono">
                  {yearlyHoursSaved}
                </h4>
                <span className="text-sm font-bold text-muted-foreground">{t('calculador.resultado_horas_unidad')}</span>
              </div>
            </div>

            {/* Ahorro de Dinero */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                {t('calculador.resultado_ahorro')}
              </p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-4xl md:text-5xl font-outfit font-black text-emerald-400 font-mono">
                  {currency === 'ARS' ? '$' : 'u$s'} {yearlyMoneySaved.toLocaleString('es-AR')}
                </h4>
              </div>
            </div>

            {/* Retorno de inversión (ROI) */}
            {netSavings > 0 && (
              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-magenta/15 border border-accent-magenta/20 flex items-center justify-center text-accent-magenta">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-accent-magenta">
                    {t('calculador.roi_titulo')}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {t('calculador.roi_texto', { pct: roiPercentage })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground leading-relaxed pt-6 mt-6 border-t border-border italic">
            {t('calculador.nota')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
