/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * MobileLandingView:
 * Versión compacta y de alta conversión para dispositivos móviles (2 Secciones):
 * - Sección 1: Hero con el Globo 3D Holográfico interactivo + Título + Subtítulo + CTAs HUD.
 * - Sección 2: Soluciones clave con precios, comparativa 1 Solo Pago vs Alquiler, y Contacto Directo.
 */
'use client'

import React, { useState } from 'react'
import {
  Globe,
  ShoppingBag,
  Cpu,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import OptimusGlyphSphere from '../Hero/OptimusGlyphSphere'
import HudButton from '../HudButton'
import LiveSystemLauncherButton from '@/components/ui/LiveSystemLauncherButton'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'
import { toast } from 'sonner'
import {
  CyberRatingStar,
  CyberCheckMark,
  CyberPitchRadarIcon,
  CyberShopBagIcon,
  RestoiaEngineIcon,
} from '../ui/MagnificentIcons'

export default function MobileLandingView() {
  // Formulario rápido de contacto móvil
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !contacto.trim()) {
      toast.error('Por favor completa tu nombre y contacto.')
      return
    }

    setEnviando(true)
    trackEvent('contact_form_submitted', { source: 'mobile_landing' })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: contacto.includes('@') ? contacto.trim() : 'contacto-whatsapp@exepaginasweb.com',
          mensaje: `${mensaje.trim()}\n[Contacto Móvil: ${contacto.trim()}]`,
        }),
      })

      if (res.ok) {
        setEnviado(true)
        toast.success('¡Propuesta enviada con éxito! Te responderé en breve.')
      } else {
        toast.error('Hubo un error al enviar. Podés escribirme directo por WhatsApp.')
      }
    } catch {
      toast.error('Error de conexión. Contactame directo por WhatsApp.')
    } finally {
      setEnviando(false)
    }
  }

  const solutions = [
    {
      id: 'web',
      icon: Globe,
      badge: 'Más Vendido',
      title: 'Páginas Web & Landing Pages',
      desc: 'Carga instantánea en 0.38s, diseño premium que cautiva y SEO para que te encuentren primero en Google.',
      priceArs: '$450.000',
      priceUsd: 'u$s 450',
      features: ['Código 100% tuyo', 'Sin cuota mensual', 'Entrega en 7-10 días'],
      color: 'cyan',
    },
    {
      id: 'ecommerce',
      icon: ShoppingBag,
      badge: 'Cero Comisiones',
      title: 'Tienda Online & E-Commerce',
      desc: 'Ventas directas a tu banco o Mercado Pago sin pagar comisiones por cada venta.',
      priceArs: '$750.000',
      priceUsd: 'u$s 750',
      features: [
        'Cobros automáticos 24/7',
        'Catálogo autoadministrable',
        'Sin comisiones cautivas',
      ],
      color: 'emerald',
    },
    {
      id: 'saas',
      icon: Cpu,
      badge: 'Control Total',
      title: 'Sistemas a Medida & SaaS',
      desc: 'Paneles de gestión, turnos automáticos, facturación AFIP, control de clientes y automatización con IA.',
      priceArs: '$1.200.000',
      priceUsd: 'u$s 1.200',
      features: [
        'Turnos / Reservas en vivo',
        'Facturación AFIP & ERP',
        'SLA y soporte garantizado',
      ],
      color: 'purple',
    },
  ]

  return (
    <div className="w-full flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* ==============================================================
          SECCIÓN 1: HERO MÓVIL CON EL GLOBO 3D Y LLAMADAS A LA ACCIÓN
         ============================================================== */}
      <section
        id="hero-mobile"
        className="relative min-h-dvh flex flex-col justify-between pt-24 pb-12 px-4 border-b border-border/60"
      >
        {/* Glow de fondo ambiental */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow de Arquitectura */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-[11px] font-mono font-bold text-accent-cyan mb-4">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span>SOFTWARE &amp; WEB ARCHITECT · 2025</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15] text-foreground">
            Desarrollo Web &amp; Sistemas a Medida
          </h1>

          {/* Subtítulo Concreto */}
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Construimos software y plataformas cloud para empresas que no pueden fallar.{' '}
            <strong className="text-foreground font-semibold">Código 100% tuyo</strong>: control
            total, cero cuotas cautivas.
          </p>

          {/* GLOBO 3D HOLOGRÁFICO INTERACTIVO */}
          <div className="w-full max-w-[290px] sm:max-w-[340px] my-4 relative">
            <OptimusGlyphSphere
              className="w-full aspect-square"
              sphereRadius={220}
              radiusRatio={0.43}
            />
            <p className="text-[10px] font-mono text-muted-foreground/70 -mt-2">
              ⚡ Girá la esfera con tu dedo para interactuar
            </p>
          </div>

          {/* Botones HUD de Acción Rápida */}
          <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
            <HudButton
              variant="primary"
              size="md"
              className="w-full justify-center"
              href={getWhatsAppUrl(
                '¡Hola Exequiel! Vi tu web en mi celular y quiero cotizar mi proyecto.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('contact_whatsapp_clicked', { source: 'mobile_hero' })}
            >
              Hablemos de tu proyecto
            </HudButton>

            <HudButton
              variant="secondary"
              size="md"
              className="w-full justify-center"
              href="#soluciones-mobile"
              onClick={() => trackEvent('hero_cta_demo_clicked', { source: 'mobile_hero' })}
            >
              Ver Soluciones &amp; Precios ↓
            </HudButton>
          </div>

          {/* Micro Trust Bar */}
          <div className="mt-6 flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1 text-amber-400">
              <CyberRatingStar size={13} />
              <span className="font-bold text-foreground">4.9/5</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CyberCheckMark size={13} className="text-emerald-400" />
              <span>SLA por contrato</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CyberCheckMark size={13} className="text-cyan-400" />
              <span>Código tuyo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECCIÓN 2: "ALGO MÁS" — SOLUCIONES, COMPARATIVA & CONTACTO
         ============================================================== */}
      <section
        id="soluciones-mobile"
        className="relative py-12 px-4 space-y-10 bg-linear-to-b from-background via-surface-1/40 to-background"
      >
        {/* Cabecera de la Sección 2 */}
        <div className="text-center max-w-sm mx-auto">
          <span className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-wider">
            Soluciones Clave &amp; Transparencia
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1.5">
            Lo que necesitas para tu negocio
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Inversión única y definitiva. Sin comisiones mensuales obligatorias.
          </p>
        </div>

        {/* 1. Tarjetas de Soluciones Principales */}
        <div className="space-y-4 max-w-sm mx-auto">
          {solutions.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="relative p-5 rounded-2xl bg-card border border-border dark:border-emerald-500/35 dark:shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-accent-cyan/60 dark:hover:border-emerald-400/60 transition-all shadow-md overflow-hidden"
              >
                {/* Borde verde neón fino y alargado superior */}
                <div className="absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent pointer-events-none" />

                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center text-accent-cyan shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-accent-cyan">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold font-mono text-foreground">
                      {item.priceArs}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.priceUsd}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>

                <div className="grid grid-cols-1 gap-1.5 pt-2.5 border-t border-border/50 text-[11px] text-foreground/80 font-medium">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Botón táctil poco convencional para probar el sistema en vivo */}
                <div className="mt-3 pt-2.5 border-t border-border/50">
                  <LiveSystemLauncherButton
                    label={
                      item.id === 'web'
                        ? 'PROBAR PÁDEL EN VIVO'
                        : item.id === 'ecommerce'
                          ? 'PROBAR TIENDA 3D'
                          : 'PROBAR RESTOIA EN VIVO'
                    }
                    sublabel="DEMO REAL EN PRODUCCIÓN"
                    href={
                      item.id === 'web'
                        ? 'https://sportmanager-playhub.vercel.app'
                        : item.id === 'ecommerce'
                          ? 'https://multi-tiendas-celphone.vercel.app'
                          : 'https://kobe-sand.vercel.app/'
                    }
                    icon={
                      item.id === 'web' ? (
                        <CyberPitchRadarIcon size={16} />
                      ) : item.id === 'ecommerce' ? (
                        <CyberShopBagIcon size={16} />
                      ) : (
                        <RestoiaEngineIcon size={16} />
                      )
                    }
                    color={
                      item.id === 'web' ? 'cyan' : item.id === 'ecommerce' ? 'emerald' : 'amber'
                    }
                    compact
                    className="w-full justify-between"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* 2. Tarjeta Holográfica de Comparativa: 1 Solo Pago vs Cuota Eterna */}
        <div className="relative max-w-sm mx-auto p-5 rounded-2xl bg-card dark:bg-linear-to-br dark:from-cyan-950/30 dark:via-slate-900/50 dark:to-purple-950/20 border border-border dark:border-emerald-500/40 shadow-xl overflow-hidden">
          {/* Borde verde neón fino y alargado superior */}
          <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-foreground dark:text-white uppercase tracking-wider font-mono">
              La Diferencia Decisiva
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Con ExePaginasWeb (1 Solo Pago)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-100/80">
                El servidor y el código están a tu nombre. Tu web es tuya para siempre sin pagar
                cuotas eternas ni comisiones.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-200">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" />
                <span>Otras agencias / Tiendanube / Shopify</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-100/80">
                Pagás alquiler mensual y comisiones de por vida. Si dejás de pagar, te apagan el
                sitio y perdés tus clientes.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Contacto Rápido Móvil (WhatsApp 1-Tap + Formulario Ágil) */}
        <div className="relative max-w-sm mx-auto p-5 rounded-2xl bg-card border border-border dark:border-emerald-500/40 shadow-lg overflow-hidden">
          {/* Borde verde neón fino y alargado superior */}
          <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent pointer-events-none" />

          <div className="text-center mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">¿Hablamos de tu idea?</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Atención directa con Exequiel Echevarria. Respuesta en menos de 15 minutos.
            </p>
          </div>

          {/* Botón WhatsApp Directo */}
          <HudButton
            variant="primary"
            size="md"
            className="w-full justify-center mb-5"
            href={getWhatsAppUrl(
              '¡Hola Exequiel! Me interesa cotizar una página web o sistema para mi negocio.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('contact_whatsapp_clicked', { source: 'mobile_contact_section' })
            }
          >
            Abrir WhatsApp Directo
          </HudButton>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] text-muted-foreground font-mono uppercase">
              O enviame tus datos
            </span>
          </div>

          {/* Formulario Express */}
          {enviado ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-400 font-semibold space-y-2">
              <p>¡Gracias {nombre}! Recibí tu propuesta.</p>
              <p className="text-[11px] text-muted-foreground">
                Me pondré en contacto con vos a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="mob-nombre" className="sr-only">
                  Nombre
                </label>
                <input
                  id="mob-nombre"
                  type="text"
                  required
                  placeholder="Tu Nombre o Empresa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="mob-contacto" className="sr-only">
                  WhatsApp o Email
                </label>
                <input
                  id="mob-contacto"
                  type="text"
                  required
                  placeholder="WhatsApp o Email de contacto"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="mob-mensaje" className="sr-only">
                  ¿Qué necesitas?
                </label>
                <textarea
                  id="mob-mensaje"
                  rows={2}
                  placeholder="Contame brevemente tu proyecto o rubro..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:border-accent-cyan focus:outline-none resize-none"
                />
              </div>

              <HudButton
                type="submit"
                variant="primary"
                size="md"
                disabled={enviando}
                className="w-full justify-center"
                icon={
                  enviando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                {enviando ? 'Enviando propuesta...' : 'Enviar mi Propuesta'}
              </HudButton>
            </form>
          )}
        </div>

        {/* Footer Móvil Compacto */}
        <div className="pt-6 pb-4 border-t border-border/60 text-center space-y-3">
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
              className="hover:text-accent-cyan"
            >
              WhatsApp
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
        </div>
      </section>
    </div>
  )
}
