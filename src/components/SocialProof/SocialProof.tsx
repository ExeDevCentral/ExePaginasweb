import {
  Store,
  Dumbbell,
  Coffee,
  Scissors,
  Building2,
  Briefcase,
  Car,
  GraduationCap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CLIENTS = [
  { icon: Store, idx: 1 },
  { icon: Dumbbell, idx: 2 },
  { icon: Coffee, idx: 3 },
  { icon: Scissors, idx: 4 },
  { icon: Building2, idx: 5 },
  { icon: Briefcase, idx: 6 },
  { icon: Car, idx: 7 },
  { icon: GraduationCap, idx: 8 },
]

const SocialProof = () => {
  const { t } = useTranslation()
  return (
    <section className="py-8 border-y border-border bg-primary-bg/60 backdrop-blur-md overflow-hidden z-10 relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-primary-secondary/80 mb-6">
        {t('socialproof.texto')}
      </p>

      <div className="flex w-full overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => {
            const Icon = client.icon
            return (
              <div
                key={i}
                className="flex items-center gap-3 mx-8 opacity-40 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-default"
              >
                <Icon className="w-5 h-5 text-accent-cyan" />
                <span className="text-base font-bold font-montserrat text-foreground">
                  {t(`socialproof.client_${client.idx}`)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SocialProof
