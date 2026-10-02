/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useTranslation } from 'react-i18next'
import { Code2, Mail, Zap, Shield, Send, MessageSquare } from 'lucide-react'
import Link from 'next/link'

import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { MatrixScramble } from '@/components/Effects/MatrixText'
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

  return (
    <footer className="relative border-t border-foreground/10 bg-background/80 backdrop-blur-xl pt-16 pb-28 sm:pb-28 lg:pb-24 z-10 overflow-hidden dark:bg-[#050508]/85 dark:border-white/10">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-accent-magenta/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main 12-column Navigation Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={42} className="h-10 w-auto" />
              <span className="font-montserrat font-black text-2xl tracking-tight text-foreground">
                ExePaginas<span className="text-yellow-400">WEB.com</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-sm">
              {t('footer.descripcion') ||
                'Sistemas web boutique, software a medida y plataformas cloud de alta conversión. Desarrollamos con 100% código propio para negocios que quieren escalar sin alquileres cautivos.'}
            </p>

            {/* Live studio status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{t('footer.cupos_disponibles') || 'Cupos abiertos para desarrollo 2026'}</span>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com/ExeDevCentral"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-card border border-foreground/10 text-muted-foreground hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors shadow-sm"
                aria-label="GitHub"
                title="GitHub ExeDevCentral"
              >
                <GithubIcon size={17} />
              </a>
              <a
                href="https://www.linkedin.com/in/exequiel-echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-card border border-foreground/10 text-muted-foreground hover:text-sky-400 hover:border-sky-400/40 transition-colors shadow-sm"
                aria-label="LinkedIn"
                title="LinkedIn Exequiel Echevarria"
              >
                <LinkedinIcon size={17} />
              </a>
              <a
                href="https://www.instagram.com/exequiel.echevarria/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-card border border-foreground/10 text-muted-foreground hover:text-accent-magenta hover:border-accent-magenta/40 transition-colors shadow-sm"
                aria-label="Instagram"
                title="Instagram @exequiel.echevarria"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={getWhatsAppUrl('¡Hola! Me contacto desde el pie de ExePaginasWeb.')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-card border border-foreground/10 text-muted-foreground hover:text-emerald-400 hover:border-emerald-400/40 transition-colors shadow-sm"
                aria-label="WhatsApp"
                title="WhatsApp Directo"
              >
                <MessageSquare size={17} />
              </a>
            </div>
          </div>

          {/* Col 2: Soluciones SaaS (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {t('footer.soluciones_saas') || 'Soluciones SaaS'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/soluciones"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_sistemas') || 'Sistemas Web a Medida'}
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_tienda') || 'Tienda Online & E-Commerce'}
                </Link>
              </li>
              <li>
                <Link
                  href="/soluciones#peluqueria"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_turnos') || 'Turnos & Reservas 24/7'}
                </Link>
              </li>
              <li>
                <Link
                  href="/soluciones#canchas"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_canchas') || 'Canchas & Ocupación en Vivo'}
                </Link>
              </li>
              <li>
                <Link
                  href="/soluciones"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_paneles') || 'Paneles de Gestión & ERP'}
                </Link>
              </li>
              <li>
                <Link
                  href="/cotizador"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_cotizador') || 'Cotizador Interactivo'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Plataforma (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              {t('footer.plataforma') || 'Plataforma'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.nav_inicio') || 'Inicio'}
                </Link>
              </li>
              <li>
                <Link
                  href="/demos"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_demo') || 'Demo Interactiva'}
                </Link>
              </li>
              <li>
                <Link
                  href="/portafolio"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_portafolio') || 'Portafolio de Casos'}
                </Link>
              </li>
              <li>
                <Link
                  href="/precios"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_precios') || 'Precios & Planes'}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  {t('footer.nav_auditoria') || 'Auditoría Gratuita'}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ExeDevCentral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {t('footer.nav_github_org') || 'GitHub Org'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Canales & Legal (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('footer.canales_legal') || 'Canales & Legal'}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:Exemetal@hotmail.com?subject=Contacto%20ExePaginasWeb&body=Hola%20ExePaginasWeb,%20quisiera%20hacer%20una%20consulta:"
                  className="group flex items-center gap-2.5 text-muted-foreground hover:text-accent-cyan transition-colors"
                  title="Contacto directo a Exemetal@hotmail.com"
                >
                  <Mail size={15} className="text-accent-cyan shrink-0" />
                  <span className="break-all font-medium">Contacto@exepaginasweb.com</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Exemetal@hotmail.com?subject=Ventas%20y%20Cotizaciones%20ExePaginasWeb&body=Hola%20ExePaginasWeb,%20quisiera%20cotizar%20un%20proyecto:"
                  className="group flex items-center gap-2.5 text-muted-foreground hover:text-accent-magenta transition-colors"
                  title="Ventas directo a Exemetal@hotmail.com"
                >
                  <Send size={15} className="text-accent-magenta shrink-0" />
                  <span className="break-all font-medium">Ventas@exepaginasweb.com</span>
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl('¡Hola! Me gustaría cotizar un sistema a medida.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-muted-foreground hover:text-emerald-400 transition-colors"
                >
                  <MessageSquare size={15} className="text-emerald-400 shrink-0" />
                  <span className="font-medium">WhatsApp: {DISPLAY_WHATSAPP_NUMBER}</span>
                </a>
              </li>
              <li className="pt-2 flex items-center gap-4 border-t border-foreground/10 dark:border-white/5 text-xs">
                <Link
                  href="/terminos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.terminos') || 'Términos del Servicio'}
                </Link>
                <span className="text-foreground/20">·</span>
                <Link
                  href="/privacidad"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.privacidad') || 'Política de Privacidad'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Infrastructure Telemetry Strip - 4 Balanced Modules */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-card border border-foreground/10 shadow-lg dark:bg-[#0b0c16]/80 dark:border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-foreground/10 dark:divide-white/5">
            {/* 1. Uptime */}
            <div className="flex items-center gap-3 pr-2">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  {t('footer.telemetry_sistemas') || 'Sistemas 100% Operativos'}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    99.99%
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t('footer.telemetry_red_edge') || 'Red Edge Vercel Global'}
                </p>
              </div>
            </div>

            {/* 2. Latency */}
            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4 sm:pr-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-foreground">
                  {t('footer.telemetry_latencia') || 'Latencia < 45ms'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t('footer.telemetry_turbopack') || 'Next.js 16 + Turbopack'}
                </p>
              </div>
            </div>

            {/* 3. Security */}
            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4 sm:pr-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-foreground">
                  {t('footer.telemetry_cifrado') || 'Cifrado SSL 256-Bit'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t('footer.telemetry_supabase') || 'Supabase Postgres Seguro'}
                </p>
              </div>
            </div>

            {/* 4. Ownership & SLA */}
            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-foreground">
                  {t('footer.telemetry_codigo') || '100% Código Propio'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t('footer.telemetry_sla') || 'SLA Soporte < 2h'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Crafted Signature, and Built By */}
        <div className="pt-6 border-t border-foreground/10 dark:border-white/10">
          {/* Gradient accent scanline */}
          <div className="relative mb-5 h-px w-full overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent-cyan/40 to-transparent sm:animate-gradient-x" />
          </div>

          {/* 3-Column Balanced Bottom Bar: No awkward wrapping, clean alignment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4 text-xs">
            {/* Left: Copyright con ícono ExePaginasWeb en una sola línea prolija */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-muted-foreground text-[11px] font-mono tracking-wide shrink-0">
              <Logo size={18} variant="dark" />
              <p className="whitespace-nowrap select-none">
                © 2026 <span className="text-foreground font-semibold">ExePaginasWEB.com</span>
                <span className="hidden sm:inline">
                  {' · '}
                  {t('footer.derechos') || 'Todos los derechos reservados.'}
                </span>
              </p>
            </div>

            {/* Center: Crafted signature */}
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

            {/* Right: GitHub profile + Language Switcher */}
            <div className="flex items-center justify-center lg:justify-end gap-3 lg:pr-12 xl:pr-0">
              <a
                href="https://github.com/ExeDevCentral"
                target="_blank"
                rel="noopener noreferrer"
                title="ExeDevCentral en GitHub"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-muted-foreground hover:text-accent-cyan transition-colors group/gh whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span>ExeDevCentral</span>
                <GithubIcon className="w-3.5 h-3.5 opacity-70 group-hover/gh:opacity-100 transition-opacity" />
              </a>

              <span className="text-foreground/20 dark:text-white/20 select-none">|</span>

              <div className="rounded-full bg-card/90 dark:bg-slate-900/90 border border-foreground/15 dark:border-white/10 px-2 py-0.5 shadow-xs hover:border-accent-cyan/40 transition-colors flex items-center shrink-0">
                <LanguageSwitcher direction="up" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
