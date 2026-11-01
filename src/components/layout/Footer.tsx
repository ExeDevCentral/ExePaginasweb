/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useTranslation } from 'react-i18next'
import { Code2, Mail, Zap, Shield, Send, MessageSquare, MapPin } from 'lucide-react'
import Link from 'next/link'

import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { MatrixScramble, MatrixWordmark } from '@/components/Effects/MatrixText'
import { useTheme } from '@/core/theme/ThemeContext'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '@/core/utils/whatsappUtils'

interface SocialIconProps {
  className?: string
  size?: number
}

const GithubIcon = ({ className = 'w-4 h-4', size = 16 }: SocialIconProps) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = ({ className = 'w-4 h-4', size = 16 }: SocialIconProps) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const InstagramIcon = ({ className = 'w-4 h-4', size = 16 }: SocialIconProps) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const Footer = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <footer className="relative z-10 pt-8 pb-24 sm:pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Divisor superior sutil centrado sin corte brusco */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto mb-8 h-px max-w-xl bg-gradient-to-r from-transparent via-slate-300/70 dark:via-white/10 to-transparent"
      />

      {/* Contenedor Arquitectónico Compacto (max-w-5xl) */}
      <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-[#070b14]/90 backdrop-blur-xl shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* 1. BARRA SUPERIOR COMPACTA DE TELEMETRÍA Y AUTORÍA (1 SOLA LÍNEA LIMPIA) */}
        <div className="px-5 sm:px-7 py-3 bg-slate-100/95 dark:bg-[#050811]/90 border-b border-slate-300/85 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] font-mono">
          {/* Estado Operativo */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t('footer.telemetry_sistemas') || 'Sistemas Operativos'}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
              99.99%
            </span>
          </div>

          {/* Indicadores técnicos condensados */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Next.js 16 · &lt;45ms</span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-white/10">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>SSL 256-Bit · PostgreSQL</span>
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-white/10">·</span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>100% Código Propio · SLA &lt;2h</span>
            </span>
            <span className="hidden lg:inline text-slate-300 dark:text-white/10">·</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-violet-500 dark:text-violet-400 shrink-0" />
              <span>Exequiel Echevarría — Architect (Rosario, AR)</span>
            </span>
          </div>
        </div>

        {/* 2. DIRECTORIO PRINCIPAL COMPACTO Y EQUILIBRADO */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Col 1: Marca, Efecto Matrix en Título, Disponibilidad y Redes (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 mb-3 group focus:outline-none"
                >
                  <Logo size={34} className="h-8 w-auto shrink-0" />
                  <MatrixWordmark
                    parts={[
                      { text: 'ExePaginas', color: isLight ? '#0f172a' : '#ffffff' },
                      { text: 'WEB', color: isLight ? '#ca8a04' : '#facc15' },
                      { text: '.com', color: isLight ? '#0284c7' : '#22d3ee' },
                    ]}
                    className="font-montserrat font-black text-xl tracking-tight"
                  />
                </Link>

                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4 max-w-xs">
                  {t('footer.descripcion') ||
                    'Software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Privacidad blindada y código 100% tuyo.'}
                </p>

                {/* Badge único de disponibilidad y alcance global */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-medium mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {t('footer.cupos_disponibles') || 'Disponibilidad activa · Escala Global'}
                  </span>
                </div>
              </div>

              {/* Canales Sociales */}
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/ExeDevCentral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  aria-label="GitHub"
                  title="GitHub ExeDevCentral"
                >
                  <GithubIcon size={15} />
                </a>
                <a
                  href="https://www.linkedin.com/in/exequiel-echevarria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn Exequiel Echevarria"
                >
                  <LinkedinIcon size={15} />
                </a>
                <a
                  href="https://www.instagram.com/exequiel.echevarria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-fuchsia-500/40 transition-colors"
                  aria-label="Instagram"
                  title="Instagram @exequiel.echevarria"
                >
                  <InstagramIcon size={15} />
                </a>
                <a
                  href={getWhatsAppUrl('¡Hola! Me contacto desde el pie de ExePaginasWeb.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                  aria-label="WhatsApp"
                  title="WhatsApp Directo"
                >
                  <MessageSquare size={15} />
                </a>
              </div>
            </div>

            {/* Col 2: Soluciones SaaS (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="font-mono font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                {t('footer.soluciones_saas') || 'Soluciones SaaS'}
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/soluciones"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_sistemas') || 'Sistemas Web a Medida'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tienda"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_tienda') || 'Tienda Online & E-Commerce'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soluciones#peluqueria"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_turnos') || 'Turnos & Reservas 24/7'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soluciones#canchas"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_canchas') || 'Canchas & Ocupación en Vivo'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/linux"
                    className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {t('footer.nav_linux') || 'Terminales Linux POS & Nodos'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cotizador"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_cotizador') || 'Cotizador Interactivo'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Plataforma (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="font-mono font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {t('footer.plataforma') || 'Plataforma'}
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 font-semibold text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('footer.nav_dashboard') || 'Panel de Clientes'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t('footer.nav_inicio') || 'Inicio'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demos"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_demo') || 'Demo Interactiva'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portafolio"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_portafolio') || 'Portafolio de Casos'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/precios"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_precios') || 'Precios & Planes'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {t('footer.nav_auditoria') || 'Auditoría Gratuita'}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/ExeDevCentral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t('footer.nav_github_org') || 'GitHub Org'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Canales & Legal (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="font-mono font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t('footer.canales_legal') || 'Canales & Legal'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <a
                    href="mailto:Exemetal@hotmail.com?subject=Contacto%20ExePaginasWeb&body=Hola%20ExePaginasWeb,%20quisiera%20hacer%20una%20consulta:"
                    className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    title="Contacto directo a Exemetal@hotmail.com"
                  >
                    <Mail size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate font-medium">Contacto@exepaginasweb.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:Exemetal@hotmail.com?subject=Ventas%20y%20Cotizaciones%20ExePaginasWeb&body=Hola%20ExePaginasWeb,%20quisiera%20cotizar%20un%20proyecto:"
                    className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
                    title="Ventas directo a Exemetal@hotmail.com"
                  >
                    <Send size={14} className="text-fuchsia-600 dark:text-fuchsia-400 shrink-0" />
                    <span className="truncate font-medium">Ventas@exepaginasweb.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href={getWhatsAppUrl('¡Hola! Me gustaría cotizar un sistema a medida.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <MessageSquare
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                    <span className="font-medium">WhatsApp: {DISPLAY_WHATSAPP_NUMBER}</span>
                  </a>
                </li>
                <li className="pt-2.5 mt-2.5 flex items-center gap-3 border-t border-slate-200/80 dark:border-white/[0.06] text-[11px] font-mono">
                  <Link
                    href="/terminos"
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t('footer.terminos') || 'Términos'}
                  </Link>
                  <span className="text-slate-300 dark:text-white/20">·</span>
                  <Link
                    href="/privacidad"
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {t('footer.privacidad') || 'Privacidad'}
                  </Link>
                  <span className="text-slate-300 dark:text-white/20">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    WCAG AA
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. BARRA INFERIOR: COPYRIGHT, FIRMA INTERACTIVA MATRIX Y SELECTOR DE IDIOMA */}
          <div className="mt-7 pt-5 border-t border-slate-200/80 dark:border-white/[0.07]">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 text-xs">
              {/* Izquierda: Copyright */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-mono tracking-wide min-w-0">
                <Logo size={18} variant="auto" />
                <p className="select-none leading-snug">
                  © 2025{' '}
                  <span className="text-slate-900 dark:text-white font-semibold">
                    ExePaginasWEB.com
                  </span>
                  <span className="hidden sm:inline">
                    {' · '}
                    {t('footer.derechos') || 'Todos los derechos reservados.'}
                  </span>
                </p>
              </div>

              {/* Centro: Firma interactiva MatrixScramble (Intacta al pasar el mouse) */}
              <div className="flex items-center justify-center">
                <a
                  href="https://exepaginasweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Diseño & Desarrollo por Exepaginasweb.com"
                  className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent-cyan/30 dark:border-accent-cyan/20 bg-accent-cyan/6 dark:bg-white/3 hover:border-accent-cyan/60 dark:hover:border-accent-cyan/50 hover:bg-accent-cyan/10 dark:hover:bg-accent-cyan/7 transition-all duration-300 shadow-xs whitespace-nowrap"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                    <span className="hidden sm:inline">
                      {t('footer.crafted_by') || 'Crafted with precision by'}{' '}
                    </span>
                    <span className="sm:hidden">Crafted by </span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] whitespace-nowrap">
                    <MatrixScramble
                      text="Exepaginasweb.com"
                      palette="matrix"
                      letterClassName="font-black text-foreground"
                    />
                  </span>
                  <span className="inline-block w-1 h-2.5 bg-accent-cyan animate-pulse rounded-[1px]" />
                </a>
              </div>

              {/* Derecha: Perfil GitHub + Selector de Idioma */}
              <div className="flex items-center justify-center lg:justify-end gap-3">
                <a
                  href="https://github.com/ExeDevCentral"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="ExeDevCentral en GitHub"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group/gh whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                  <span>ExeDevCentral</span>
                  <GithubIcon className="w-3.5 h-3.5 opacity-70 group-hover/gh:opacity-100 transition-opacity" />
                </a>

                <span className="text-slate-300 dark:text-white/20 select-none">|</span>

                <div className="rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 px-2 py-0.5 shadow-xs hover:border-cyan-500/40 transition-colors flex items-center shrink-0">
                  <LanguageSwitcher direction="up" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
