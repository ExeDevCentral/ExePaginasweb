import { useTranslation } from 'react-i18next'

const DashboardMock = () => {
  const { t } = useTranslation()
  return (
    <div className="relative rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl shadow-2xl shadow-accent-cyan/5 overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-cyan/10 rounded-full blur-[50px] group-hover:bg-accent-cyan/20 transition-all duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-foreground/40 ml-2 font-mono">{t('dashboard.nombre_archivo')}</span>
        </div>
        <div className="text-xs text-foreground/60 bg-muted px-3 py-1 rounded-full border border-border">
          {t('dashboard.live_data')}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Stat 1 */}
        <div className="bg-muted rounded-xl p-4 border border-border">
          <p className="text-xs text-foreground/40 mb-1">{t('dashboard.reservas_hoy')}</p>
          <p className="text-2xl font-bold text-foreground">127</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <span>↑</span> {t('dashboard.vs_ayer')}
          </p>
        </div>
        {/* Stat 2 */}
        <div className="bg-muted rounded-xl p-4 border border-border">
          <p className="text-xs text-foreground/40 mb-1">{t('dashboard.eficiencia')}</p>
          <p className="text-2xl font-bold text-foreground">94.2%</p>
          <p className="text-xs text-accent-cyan mt-1 flex items-center gap-1">
            <span>↑</span> {t('dashboard.optimizado')}
          </p>
        </div>
      </div>

      {/* Chart Mock */}
      <div className="bg-muted rounded-xl p-4 border border-border mb-6">
        <p className="text-xs text-foreground/40 mb-4">{t('dashboard.rendimiento_semanal')}</p>
        <div className="h-32 flex items-end gap-2">
          {[40, 60, 45, 80, 55, 90, 70].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-accent-cyan/20 to-accent-cyan/80 rounded-t-lg transition-all duration-500 hover:to-accent-magenta"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-foreground/30 font-mono">
          <span>L</span>
          <span>M</span>
          <span>M</span>
          <span>J</span>
          <span>V</span>
          <span>S</span>
          <span>D</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-muted rounded-xl p-4 border border-border">
        <p className="text-xs text-foreground/40 mb-3">{t('dashboard.ultimas_automatizaciones')}</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-foreground/80">{t('dashboard.reserva_confirmada')}</span>
            </div>
            <span className="text-foreground/30 font-mono">hace 2m</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span className="text-foreground/80">{t('dashboard.recordatorio_enviado')}</span>
            </div>
            <span className="text-foreground/30 font-mono">hace 15m</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMock
