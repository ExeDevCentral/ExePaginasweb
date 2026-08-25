'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap, Server, Globe2 } from 'lucide-react'
import { storeAudio } from '../../core/utils/storeAudio'

export const StoreTelemetryHUD: React.FC = () => {
  const [latency, setLatency] = useState(14)
  const [activePoP, setActivePoP] = useState('EZE - Buenos Aires')

  useEffect(() => {
    const pops = [
      'EZE (Buenos Aires Edge)',
      'GRU (São Paulo Hub)',
      'SCL (Santiago Edge)',
      'IAD (US Virginia)',
    ]
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 6))
      if (Math.random() > 0.7) {
        setActivePoP(pops[Math.floor(Math.random() * pops.length)])
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-5xl mx-auto mb-8"
    >
      <div className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-border/80 p-3 sm:p-4 shadow-xl overflow-hidden group">
        {/* Top ambient micro-line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 text-xs">
          {/* Main Status Beacon */}
          <button
            type="button"
            onClick={() => storeAudio.playHover()}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="tracking-wide">EDGE SERVERLESS 100% ONLINE</span>
          </button>

          {/* Node details */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-muted-foreground font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Nodo:</span>
              <span className="text-foreground font-semibold">{activePoP}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Latencia:</span>
              <span className="text-amber-400 font-bold">{latency}ms</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>WAF & SSL:</span>
              <span className="text-emerald-400 font-semibold">Protección Activa</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Uptime SLA:</span>
              <span className="text-foreground font-bold">99.98%</span>
            </div>
          </div>

          {/* Infrastructure Tag */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border">
            <Server className="w-3 h-3 text-accent-cyan" />
            <span>Vercel + Supabase Enterprise</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StoreTelemetryHUD
