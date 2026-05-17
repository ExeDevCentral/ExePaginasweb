

const DashboardMock = () => {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-[#0A0A0F]/80 p-6 backdrop-blur-xl shadow-2xl shadow-accent-cyan/5 overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-cyan/10 rounded-full blur-[50px] group-hover:bg-accent-cyan/20 transition-all duration-500" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-white/40 ml-2 font-mono">dashboard_v1.0.tsx</span>
        </div>
        <div className="text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Live Data
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Stat 1 */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-white/40 mb-1">Reservas Hoy</p>
          <p className="text-2xl font-bold text-white">127</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <span>↑</span> +12% vs ayer
          </p>
        </div>
        {/* Stat 2 */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-xs text-white/40 mb-1">Eficiencia</p>
          <p className="text-2xl font-bold text-white">94.2%</p>
          <p className="text-xs text-accent-cyan mt-1 flex items-center gap-1">
            <span>↑</span> Optimizado
          </p>
        </div>
      </div>

      {/* Chart Mock */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
        <p className="text-xs text-white/40 mb-4">Rendimiento Semanal</p>
        <div className="h-32 flex items-end gap-2">
          {[40, 60, 45, 80, 55, 90, 70].map((height, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-accent-cyan/20 to-accent-cyan/80 rounded-t-lg transition-all duration-500 hover:to-accent-magenta"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/30 font-mono">
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <p className="text-xs text-white/40 mb-3">Últimas Automatizaciones</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white/80">Reserva confirmada</span>
            </div>
            <span className="text-white/30 font-mono">hace 2m</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span className="text-white/80">Recordatorio enviado</span>
            </div>
            <span className="text-white/30 font-mono">hace 15m</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMock
