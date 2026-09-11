'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Scissors, Wheat, Shirt, Volleyball, Menu, X, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import UtilityDock from './UtilityDock'

const solutions = [
  { href: '/soluciones#peluqueria', label: 'Peluquerías', detail: 'Turnos y fidelización', icon: Scissors },
  { href: '/soluciones#panaderia', label: 'Panaderías', detail: 'Pedidos y catálogo', icon: Wheat },
  { href: '/soluciones#indumentaria', label: 'Indumentaria', detail: 'E-commerce a medida', icon: Shirt },
  { href: '/soluciones#canchas', label: 'Canchas', detail: 'Reservas y ocupación', icon: Volleyball },
]

const linkClass =
  'rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white'

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050508]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMobile}>
          <Logo size={32} className="h-8 w-auto" />
          <span className="text-sm font-black tracking-tight text-white">
            EXE<span className="text-yellow-400">//</span>PAGINASWEB<span className="text-cyan-400">.COM</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkClass}>Inicio</Link>
          <div className="relative">
            <button
              type="button"
              className={`${linkClass} inline-flex items-center gap-1`}
              aria-expanded={solutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setSolutionsOpen((open) => !open)}
            >
              Soluciones <ChevronDown size={15} className={solutionsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
            <div
              id="solutions-menu"
              className={`absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3 transition-all ${
                solutionsOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#0c0e18] p-3 shadow-2xl">
                {solutions.map(({ href, label, detail, icon: Icon }) => (
                  <Link key={href} href={href} className="group rounded-xl border border-white/5 p-3 hover:border-cyan-400/40 hover:bg-white/5">
                    <Icon size={19} className="mb-2 text-cyan-400" />
                    <span className="block text-sm font-bold text-white">{label}</span>
                    <span className="text-xs text-slate-400">{detail}</span>
                  </Link>
                ))}
                <Link href="/soluciones" className="col-span-2 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-bold text-cyan-300">
                  Ver los 4 rubros <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
          <Link href="/portafolio" className={linkClass}>Portafolio</Link>
          <Link href="/precios" className={linkClass}>Precios</Link>
          <Link href="/#contact" className={linkClass}>Contacto</Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <UtilityDock />
          <Link href="/cotizador" className="rounded-full border border-emerald-400/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-400/10">Cotizador</Link>
          <Link href="/tienda" className="rounded-full border border-cyan-400/40 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-400/10">Tienda</Link>
          <Link href="/#contact" className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-cyan-300">Hablemos</Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <UtilityDock className="rounded-xl" />
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-site-menu" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} className="rounded-xl border border-white/15 p-2 text-white">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-site-menu" className={`lg:hidden overflow-hidden border-t border-white/10 bg-[#07080f] transition-[max-height,opacity] duration-300 ${mobileOpen ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav aria-label="Navegación móvil" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
          <Link href="/" className={linkClass} onClick={closeMobile}>Inicio</Link>
          <button type="button" className={`${linkClass} flex items-center justify-between text-left`} aria-expanded={solutionsOpen} onClick={() => setSolutionsOpen((open) => !open)}>
            Soluciones <ChevronDown size={16} className={solutionsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
          <div className={`grid grid-cols-2 gap-2 overflow-hidden pl-2 transition-[max-height,opacity] duration-300 ${solutionsOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
            {solutions.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={closeMobile} className="rounded-lg bg-white/5 p-3 text-xs font-bold text-slate-200"><Icon size={16} className="mb-1 text-cyan-400" />{label}</Link>)}
          </div>
          <Link href="/portafolio" className={linkClass} onClick={closeMobile}>Portafolio</Link>
          <Link href="/precios" className={linkClass} onClick={closeMobile}>Precios</Link>
          <Link href="/#contact" className={linkClass} onClick={closeMobile}>Contacto</Link>
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
            <Link href="/cotizador" onClick={closeMobile} className="flex-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-center text-xs font-bold text-emerald-300">Cotizador</Link>
            <Link href="/tienda" onClick={closeMobile} className="flex-1 rounded-lg bg-cyan-400/10 px-3 py-2 text-center text-xs font-bold text-cyan-300">Tienda</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
