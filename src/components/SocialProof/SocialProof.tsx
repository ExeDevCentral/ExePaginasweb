import { Store, Dumbbell, Coffee, Scissors, Building2, Briefcase, Car, GraduationCap } from 'lucide-react'

const CLIENTS = [
  { icon: Store, name: 'Retail & Kioscos' },
  { icon: Dumbbell, name: 'Centros Deportivos' },
  { icon: Coffee, name: 'Gastronomía' },
  { icon: Scissors, name: 'Salones de Belleza' },
  { icon: Building2, name: 'Inmobiliarias' },
  { icon: Briefcase, name: 'Estudios Contables' },
  { icon: Car, name: 'Concesionarias' },
  { icon: GraduationCap, name: 'Educación' },
]

const SocialProof = () => {
  return (
    <section className="py-8 border-y border-white/5 bg-primary-bg/60 backdrop-blur-md overflow-hidden z-10 relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none" />
      
      <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-primary-secondary/80 mb-6">
        Sistemas escalables confiados en múltiples industrias
      </p>

      <div className="flex w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => {
            const Icon = client.icon
            return (
              <div key={i} className="flex items-center gap-3 mx-8 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default">
                <Icon className="w-5 h-5 text-accent-cyan" />
                <span className="text-base font-bold font-montserrat text-white">{client.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SocialProof
