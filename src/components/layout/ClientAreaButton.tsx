'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ChevronRight } from 'lucide-react'

interface ClientAreaButtonProps {
  onClick: () => void
  label: string
  variant?: 'desktop' | 'mobile'
}

export default function ClientAreaButton({
  onClick,
  label,
  variant = 'desktop',
}: ClientAreaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    ref.current?.style.setProperty('--spot-x', `${x}%`)
    ref.current?.style.setProperty('--spot-y', `${y}%`)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples((prev) => [...prev, { id, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 700)
    }
    onClick()
  }

  if (variant === 'mobile') {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className="relative w-full overflow-hidden py-3.5 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow-lg shadow-cyan-500/30 cursor-pointer flex items-center justify-center gap-2 group bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600"
      >
        <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.25)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
        <UserIcon />
        <span className="relative z-10">{label}</span>
        <ChevronRight
          size={14}
          className="relative z-10 group-hover:translate-x-1 transition-transform"
        />
      </motion.button>
    )
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        ref.current?.style.removeProperty('--spot-x')
        ref.current?.style.removeProperty('--spot-y')
      }}
      whileTap={{ scale: 0.96 }}
      className="relative group overflow-hidden h-11 pl-5 pr-4 rounded-full text-white text-[13px] font-black tracking-wide shadow-[0_0_24px_-4px_rgba(6,182,212,0.55)] hover:shadow-[0_0_36px_-2px_rgba(6,182,212,0.75)] transition-shadow duration-500 flex items-center gap-2.5 shrink-0 select-none cursor-pointer isolate"
    >
      {/* Animated gradient background */}
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-sky-500 via-50% to-blue-600 animate-gradient-x bg-[length:200%_100%]" />

      {/* Moving spotlight */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.35) 0%, transparent 45%)',
        }}
      />

      {/* Shimmer sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:animate-shimmer-sweep bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.3)_50%,transparent_70%)]" />

      {/* Border glow */}
      <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />

      {/* Ripple container */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/40 animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}
      </span>

      {/* Live status dot */}
      <span className="relative z-10 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </span>
        <Sparkles size={14} className="text-white/90" />
        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">{label}</span>
      </span>

      {/* Arrow with hover animation */}
      <span className="relative z-10 flex items-center justify-center h-6 w-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
        <ChevronRight
          size={14}
          className="text-white group-hover:translate-x-0.5 transition-transform duration-300"
        />
      </span>
    </motion.button>
  )
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
