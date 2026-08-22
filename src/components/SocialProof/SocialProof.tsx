import React from 'react'
import {
  Store,
  Dumbbell,
  Coffee,
  Scissors,
  Building2,
  Briefcase,
  Car,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ClientItem {
  icon: React.ElementType
  idx: number
  accent: 'cyan' | 'amber'
  code: string
}

const CLIENTS: ClientItem[] = [
  { icon: Store, idx: 1, accent: 'cyan', code: 'SYS-01' },
  { icon: Dumbbell, idx: 2, accent: 'amber', code: 'SYS-02' },
  { icon: Coffee, idx: 3, accent: 'cyan', code: 'SYS-03' },
  { icon: Scissors, idx: 4, accent: 'amber', code: 'SYS-04' },
  { icon: Building2, idx: 5, accent: 'cyan', code: 'SYS-05' },
  { icon: Briefcase, idx: 6, accent: 'amber', code: 'SYS-06' },
  { icon: Car, idx: 7, accent: 'cyan', code: 'SYS-07' },
  { icon: GraduationCap, idx: 8, accent: 'amber', code: 'SYS-08' },
]

const SocialProof = () => {
  const { t } = useTranslation()

  // Duplicamos los items para asegurar un loop infinito continuo y fluido al -50%
  const marqueeItems = [...CLIENTS, ...CLIENTS]

  return (
    <section className="py-10 relative overflow-hidden z-10 border-y border-border/30 bg-transparent">
      {/* Background Glow Beams */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative tech grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Fades laterales para transición suave */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background/60 to-transparent z-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Section Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-8 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              {t('socialproof.texto')}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500/80" />
          </div>
        </div>

        {/* Infinite Marquee Container */}
        <div className="flex w-full overflow-hidden py-2">
          <div className="flex animate-marquee gap-3.5 whitespace-nowrap w-max">
            {marqueeItems.map((client, i) => {
              const Icon = client.icon
              const isCyan = client.accent === 'cyan'

              return (
                <div
                  key={i}
                  className={`group/card relative flex flex-col items-center justify-between p-4 rounded-xl border transition-all duration-300 ease-out cursor-pointer overflow-hidden shrink-0 w-40 sm:w-44 ${
                    isCyan
                      ? 'border-border/60 dark:border-white/10 bg-card/40 dark:bg-slate-900/40 hover:border-cyan-500/60 hover:bg-cyan-500/[0.08] hover:shadow-[0_0_25px_rgba(14,165,233,0.22)] hover:-translate-y-1'
                      : 'border-border/60 dark:border-white/10 bg-card/40 dark:bg-slate-900/40 hover:border-amber-500/60 hover:bg-amber-500/[0.08] hover:shadow-[0_0_25px_rgba(245,158,11,0.22)] hover:-translate-y-1'
                  }`}
                >
                  {/* Radial Glow Layer on Hover */}
                  <div
                    className={`absolute -inset-full rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl ${
                      isCyan
                        ? 'bg-gradient-to-tr from-cyan-500/25 via-sky-400/10 to-transparent'
                        : 'bg-gradient-to-tr from-amber-500/25 via-orange-400/10 to-transparent'
                    }`}
                  />

                  {/* Top Index & LED */}
                  <div className="w-full flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 group-hover/card:text-muted-foreground transition-colors mb-2">
                    <span>{client.code}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isCyan
                          ? 'bg-cyan-500/40 group-hover/card:bg-cyan-400 group-hover/card:shadow-[0_0_6px_#0ea5e9]'
                          : 'bg-amber-500/40 group-hover/card:bg-amber-400 group-hover/card:shadow-[0_0_6px_#f59e0b]'
                      }`}
                    />
                  </div>

                  {/* Icon Container */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 my-1 ${
                      isCyan
                        ? 'border-border/50 dark:border-white/10 bg-background/80 dark:bg-white/[0.03] group-hover/card:border-cyan-500/40 group-hover/card:bg-cyan-500/15 group-hover/card:scale-110'
                        : 'border-border/50 dark:border-white/10 bg-background/80 dark:bg-white/[0.03] group-hover/card:border-amber-500/40 group-hover/card:bg-amber-500/15 group-hover/card:scale-110'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isCyan
                          ? 'text-slate-400 group-hover/card:text-cyan-400'
                          : 'text-slate-400 group-hover/card:text-amber-400'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-semibold text-foreground/80 group-hover/card:text-foreground text-center transition-colors line-clamp-2 mt-2 font-sans leading-tight whitespace-normal">
                    {t(`socialproof.client_${client.idx}`)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialProof
