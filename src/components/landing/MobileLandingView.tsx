/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileLandingView:
 * Versión móvil ultracorta y de alto impacto comercial (2 Pantallas exactas):
 * - Pantalla 1 (El Gancho): Hero de autoridad con Globo 3D Holográfico interactivo + Hook claro + WhatsApp 1-Tap.
 * - Pantalla 2 (Cierre Comercial): 3 Demos reales en vivo (E-commerce 3D, Gestión Deportiva, RestoAI) +
 *   Comparativa 1 Solo Pago vs Alquiler + Contacto directo sin fricción.
 */
'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import HudButton from '../HudButton'
import LiveSystemLauncherButton from '@/components/ui/LiveSystemLauncherButton'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'
import {
  CyberRatingStar,
  CyberCheckMark,
  CyberPitchRadarIcon,
  CyberShopBagIcon,
  RestoiaEngineIcon,
} from '../ui/MagnificentIcons'

// Carga diferida del canvas 3D para maximizar FPS y tiempo de primer pintado en móviles
const OptimusGlyphSphere = dynamic(() => import('../Hero/OptimusGlyphSphere'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full aspect-square flex items-center justify-center rounded-full bg-accent-cyan/5 border border-accent-cyan/20 animate-pulse"
    >
      <span className="text-[11px] font-mono text-accent-cyan/60">Cargando 3D...</span>
    </div>
  ),
})

interface DemoItem {
  readonly id: string
  readonly title: string
  readonly badge: string
  readonly desc: string
  readonly tech: string
  readonly href: string
  readonly launcherLabel: string
  readonly color: 'cyan' | 'emerald' | 'amber'
  readonly iconType: 'radar' | 'shop' | 'resto'
}

const getLiveDemos = (t: TFunction): readonly DemoItem[] => [
  {
    id: 'ecommerce',
    title: t('mobile.demo_ecommerce_title', 'Tienda 3D & E-Commerce'),
    badge: 'Three.js · Next.js 14',
    desc: t(
      'mobile.demo_ecommerce_desc',
      'Catálogo interactivo en 3D, stock sincronizado y pagos directos a tu banco sin comisiones.'
    ),
    tech: 'Three.js / React Three Fiber',
    href: 'https://multi-tiendas-celphone.vercel.app',
    launcherLabel: t('mobile.demo_ecommerce_btn', 'PROBAR TIENDA 3D'),
    color: 'emerald',
    iconType: 'shop',
  },
  {
    id: 'sports',
    title: t('mobile.demo_sports_title', 'Gestión Deportiva & Canchas'),
    badge: 'Turnos en Vivo · Supabase',
    desc: t(
      'mobile.demo_sports_desc',
      'Reservas automáticas 24/7 con seña online, control de clientes y panel de administración.'
    ),
    tech: 'React / Vite / Supabase',
    href: 'https://sportmanager-playhub.vercel.app',
    launcherLabel: t('mobile.demo_sports_btn', 'PROBAR PÁDEL EN VIVO'),
    color: 'cyan',
    iconType: 'radar',
  },
  {
    id: 'restoai',
    title: t('mobile.demo_resto_title', 'Sistema Gastronómico con IA'),
    badge: 'Carta Dinámica · Automatización',
    desc: t(
      'mobile.demo_resto_desc',
      'Carta inteligente con pedidos directos a cocina y sugerencias con IA en tiempo real.'
    ),
    tech: 'Next.js / AI Engine',
    href: 'https://kobe-sand.vercel.app/',
    launcherLabel: t('mobile.demo_resto_btn', 'PROBAR RESTOAI EN VIVO'),
    color: 'amber',
    iconType: 'resto',
  },
]

function renderDemoIcon(iconType: 'radar' | 'shop' | 'resto') {
  if (iconType === 'radar') return <CyberPitchRadarIcon size={16} />
  if (iconType === 'shop') return <CyberShopBagIcon size={16} />
  return <RestoiaEngineIcon size={16} />
}

export default function MobileLandingView() {
  const { t } = useTranslation()
  const liveDemos = useMemo(() => getLiveDemos(t), [t])

  const whatsappHeroUrl = getWhatsAppUrl(
    '¡Hola Exequiel! Vi tu web en mi celular y quiero cotizar mi proyecto.'
  )
  const whatsappContactUrl = getWhatsAppUrl(
    '¡Hola Exequiel! Quiero hablar de una página web / sistema a medida para mi negocio.'
  )

  return (
    <div className="w-full flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* ==============================================================
          PANTALLA 1: EL GANCHO (HERO DE ALTO IMPACTO & AUTORIDAD)
         ============================================================== */}
      <section
        id="hero-mobile"
        className="relative min-h-[92dvh] flex flex-col justify-between pt-24 pb-8 px-4 border-b border-border/60"
      >
        {/* Glow ambiental de fondo */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow de Autoridad Directa */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-[11px] font-mono font-bold text-accent-cyan mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span>{t('mobile.eyebrow', 'EXEQUIEL ECHEVARRÍA · ARCHITECT · 2025')}</span>
          </div>

          {/* Titular de Alto Impacto */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.12] text-foreground">
            {t('mobile.h1', 'Tu Web & Software a Medida')}
          </h1>

          {/* Propuesta de Valor en 1 Línea */}
          <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
            {t('mobile.desc_1', 'Código 100% tuyo · ')}
            <strong className="text-foreground font-semibold">
              {t('mobile.desc_bold', '1 Solo Pago')}
            </strong>
            {t(
              'mobile.desc_2',
              '. Sin alquileres de software, comisiones cautivas ni intermediarios.'
            )}
          </p>

          {/* GLOBO 3D HOLOGRÁFICO INTERACTIVO */}
          <div className="w-full max-w-70 sm:max-w-[320px] my-3 relative">
            <OptimusGlyphSphere
              className="w-full aspect-square"
              sphereRadius={210}
              radiusRatio={0.42}
            />
            <p className="text-[10px] font-mono text-muted-foreground/75 -mt-2">
              {t('mobile.interact_hint', '⚡ Girá la esfera con tu dedo para interactuar')}
            </p>
          </div>

          {/* Botones de Acción Inmediata (1-Tap WhatsApp + Ver Demos) */}
          <div className="flex flex-col gap-2.5 w-full max-w-xs mt-1">
            <HudButton
              variant="primary"
              size="md"
              className="w-full justify-center"
              icon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('contact_whatsapp_clicked', { source: 'mobile_hero_cta' })}
            >
              {t('mobile.cta_whatsapp', 'Cotizar por WhatsApp (15 min)')}
            </HudButton>

            <HudButton
              variant="secondary"
              size="md"
              className="w-full justify-center"
              href="#demos-mobile"
              onClick={() => trackEvent('hero_cta_demo_clicked', { source: 'mobile_hero_scroll' })}
            >
              {t('mobile.cta_demos', 'Ver Demos en Vivo ↓')}
            </HudButton>
          </div>

          {/* Micro Trust Bar */}
          <div className="mt-5 flex items-center justify-center gap-3 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1 text-amber-400">
              <CyberRatingStar size={13} />
              <span className="font-bold text-foreground">4.9/5</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CyberCheckMark size={13} className="text-emerald-400" />
              <span>{t('mobile.trust_sla', 'SLA por contrato')}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CyberCheckMark size={13} className="text-cyan-400" />
              <span>{t('mobile.trust_code', 'Código tuyo')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          PANTALLA 2: DEMOS EN VIVO, COMPARATIVA & CIERRE COMERCIAL
         ============================================================== */}
      <section
        id="demos-mobile"
        className="relative py-10 px-4 space-y-8 bg-linear-to-b from-background via-surface-1/30 to-background"
      >
        {/* Cabecera Demos */}
        <div className="text-center max-w-sm mx-auto">
          <span className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-wider">
            {t('mobile.demos_badge', 'Sistemas Reales en Producción')}
          </span>
          <h2 className="text-2xl font-extrabold text-foreground mt-1">
            {t('mobile.demos_title', 'Tocá y probalos en vivo')}
          </h2>
          <p className="text-xs text-muted-foreground mt-1.5">
            {t(
              'mobile.demos_desc',
              'Plataformas reales desarrolladas para clientes. Cero maquetas vacías.'
            )}
          </p>
        </div>

        {/* Tarjetas de Demos con LiveSystemLauncherButton */}
        <div className="space-y-3.5 max-w-sm mx-auto">
          {liveDemos.map((demo) => {
            const icon = renderDemoIcon(demo.iconType)

            return (
              <div
                key={demo.id}
                className="relative p-4 rounded-2xl bg-card border border-border dark:border-emerald-500/30 shadow-md overflow-hidden hover:border-accent-cyan/50 transition-all"
              >
                {/* Micro indicador luminoso superior */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 inset-x-6 h-[1.5px] bg-linear-to-r from-transparent via-accent-cyan/80 to-transparent pointer-events-none"
                />

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-foreground leading-snug">{demo.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan font-semibold shrink-0">
                    {demo.badge}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{demo.desc}</p>

                <LiveSystemLauncherButton
                  label={demo.launcherLabel}
                  sublabel={t('mobile.btn_sublabel', 'PROBAR EN PRODUCCIÓN')}
                  href={demo.href}
                  icon={icon}
                  color={demo.color}
                  compact
                  className="w-full justify-between"
                />
              </div>
            )
          })}
        </div>

        {/* Micro Comparativa: 1 Solo Pago vs Cuota Eterna */}
        <div className="relative max-w-sm mx-auto p-4 rounded-2xl bg-card border border-border dark:border-emerald-500/35 shadow-lg overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-8 h-[1.5px] bg-linear-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none"
          />

          <div className="flex items-center gap-2 mb-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
              La Diferencia Decisiva
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Con ExePaginasWeb (1 Solo Pago)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                El servidor, la base de datos y el código son 100% tuyos. Sin cuotas eternas ni
                comisiones.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 mb-0.5">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Otras plataformas (Shopify / Tiendanube)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Pagás alquiler mensual y comisiones de por vida. Si no pagás, te apagan el sitio.
              </p>
            </div>
          </div>
        </div>

        {/* Cierre Comercial: WhatsApp 1-Tap Directo */}
        <div className="relative max-w-sm mx-auto p-5 rounded-2xl bg-card border border-border dark:border-emerald-500/40 shadow-xl text-center space-y-3.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-foreground">¿Hablamos de tu proyecto?</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Atención directa con Exequiel Echevarria. Recibí tu cotización técnica y alcance en
              menos de 15 minutos.
            </p>
          </div>

          <HudButton
            variant="primary"
            size="md"
            className="w-full justify-center"
            icon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
            href={whatsappContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('contact_whatsapp_clicked', { source: 'mobile_contact_footer' })
            }
          >
            Abrir WhatsApp Directo
          </HudButton>

          <p className="text-[10px] font-mono text-muted-foreground/80">
            Sin intermediarios · Presupuesto formal en el día
          </p>
        </div>

        {/* Footer Móvil Compacto */}
        <footer className="pt-4 pb-2 border-t border-border/60 text-center space-y-2">
          <p className="text-xs font-bold text-foreground">
            ExePaginas<span className="text-yellow-400">WEB</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Arquitectura de Software &amp; Plataformas Cloud · {DISPLAY_WHATSAPP_NUMBER}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-mono">
            <a
              href="https://wa.me/5491124036054"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-cyan flex items-center gap-1"
            >
              WhatsApp <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/exequiel-echevarria/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-cyan"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a
              href="https://github.com/ExeDevCentral"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-cyan"
            >
              GitHub
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-mono">
            © 2025 Exequiel Echevarria. Todos los derechos reservados.
          </p>
        </footer>
      </section>
    </div>
  )
}
