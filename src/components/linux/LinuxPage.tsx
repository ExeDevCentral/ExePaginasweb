/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Terminal,
  Server,
  Cpu,
  HardDrive,
  WifiOff,
  Check,
  Calculator,
  ArrowUpRight,
  Sliders,
  Lock,
  Activity,
} from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import LinuxBusinessSection from '@/components/landing/LinuxBusinessSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/layout/Footer'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

interface LinuxServiceItem {
  id: string
  code: string
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  accentText: string
  accentBorder: string
  accentBg: string
  specs: string[]
  quoteHref: string
}

const LINUX_SERVICES: LinuxServiceItem[] = [
  {
    id: 'kiosk-pos',
    code: 'SRV-LNX-01 // TERMINALES DE CAJA',
    title: 'Terminales Linux POS & Modo Quiosco Blindado',
    subtitle: 'Mostradores, gastronomía, farmacias y retail de alto tráfico',
    description:
      'Convertimos la PC de tu caja en un electrodoméstico dedicado: enciende en 4.5 segundos directo a tu sistema de cobro o comandas, sin escritorio distraído, sin actualizaciones forzadas en hora pico y con reglas permanentes para impresoras térmicas.',
    icon: Terminal,
    accentText: 'text-emerald-700 dark:text-emerald-400',
    accentBorder: 'border-emerald-500/30 hover:border-emerald-500/60',
    accentBg: 'bg-emerald-500/10',
    specs: [
      'Arranque determinista en 4.5s (systemd-boot)',
      'Reglas udev fijas para impresoras ESC/POS y lectores láser',
      'Bloqueo de sistema contra cierres accidentales o virus',
    ],
    quoteHref: '/cotizador?plan=linux&type=linux-pos',
  },
  {
    id: 'pc-rescue',
    code: 'SRV-LNX-02 // MIGRACIÓN DE FLOTA',
    title: 'Rescate y Migración de PCs de Oficina / Administración',
    subtitle: 'Extendé 5+ años la vida útil de tu hardware x86_64 actual',
    description:
      'Antes de gastar millones renovando computadoras lentas por culpa de sistemas operativos pesados, migramos tus estaciones a Linux LTS optimizado: consumen apenas 480 MB de RAM en reposo y vuelan en tareas administrativas, ERP web y ofimática.',
    icon: Cpu,
    accentText: 'text-cyan-700 dark:text-cyan-400',
    accentBorder: 'border-cyan-500/30 hover:border-cyan-500/60',
    accentBg: 'bg-cyan-500/10',
    specs: [
      '480 MB RAM en reposo (revive PCs con 4GB u 8GB RAM)',
      '$0 en licencias anuales de sistema operativo y antivirus',
      'Navegador aislado, suite ofimática completa y cero telemetría',
    ],
    quoteHref: '/cotizador?plan=linux&type=linux-pos',
  },
  {
    id: 'lan-node',
    code: 'SRV-LNX-03 // CONTINUIDAD OPERATIVA',
    title: 'Nodo Servidor Local LAN & PostgreSQL Offline-First',
    subtitle: 'Operación ininterrumpida a 0.4ms aunque se corte internet',
    description:
      'Instalamos un nodo servidor Linux físico dentro de tu comercio o planta con PostgreSQL local y sincronización asíncrona hacia la nube. Tus cajas, KDS de cocina y terminales internas siguen operando a velocidad de cable de red sin depender del proveedor de fibra.',
    icon: Server,
    accentText: 'text-violet-700 dark:text-violet-400',
    accentBorder: 'border-violet-500/30 hover:border-violet-500/60',
    accentBg: 'bg-violet-500/10',
    specs: [
      'Latencia sub-milisegundo (<0.4ms) en red local LAN',
      'Replicación automática en segundo plano al volver internet',
      'Backups diarios encriptados locales + copia en la nube',
    ],
    quoteHref: '/cotizador?plan=linux&type=edge-server',
  },
  {
    id: 'ssh-guard',
    code: 'SRV-LNX-04 // BLINDAJE & RESCATE',
    title: 'Guardia Remota SSH, Hardening & Llave USB Física',
    subtitle: 'Recuperación ante desastres en 3 minutos sin depender de nadie',
    description:
      'Cada despliegue incluye firewall nftables, monitoreo predictivo de salud de discos (S.M.A.R.T.) y la entrega en mano de un pendrive físico booteable configurado a medida para restaurar una terminal completa al estado exacto de fábrica en 3 minutos.',
    icon: HardDrive,
    accentText: 'text-amber-700 dark:text-amber-400',
    accentBorder: 'border-amber-500/30 hover:border-amber-500/60',
    accentBg: 'bg-amber-500/10',
    specs: [
      'Pendrive físico Live USB (Timeshift / imagen clonada)',
      'Túnel seguro WireGuard / SSH con llave criptográfica Ed25519',
      'Ventanas de mantenimiento atómicas fuera de horario comercial',
    ],
    quoteHref: '/cotizador?plan=linux&type=linux-pos',
  },
]

export default function LinuxPage() {
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [pcCount, setPcCount] = useState<number>(4)

  // Cálculo conservador y transparente de ahorro de CAPEX/OPEX frente a recambio de hardware + licencias
  const newPcCostUSD = 620 // PC comercial nueva + licencia Pro + setup
  const linuxMigrationUSD = pcCount === 1 ? 320 : 320 + (pcCount - 1) * 140
  const savedUSD = Math.max(0, pcCount * newPcCostUSD - linuxMigrationUSD)

  const newPcCostARS = 720000
  const linuxMigrationARS = pcCount === 1 ? 350000 : 350000 + (pcCount - 1) * 155000
  const savedARS = Math.max(0, pcCount * newPcCostARS - linuxMigrationARS)

  const formatARS = (val: number) => '$' + val.toLocaleString('es-AR')
  const formatUSD = (val: number) => 'u$s ' + val.toLocaleString('en-US')

  return (
    <div className="min-h-screen bg-transparent text-foreground relative">
      <SiteHeader />

      <main id="linux" className="relative z-10 pt-28 sm:pt-32">
        {/* ==============================================================
            1. HERO DEL PORTAL DE SERVICIOS LINUX (/linux)
           ============================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-5">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIVISIÓN INFRAESTRUCTURA LINUX // POS · FLOTAS · NODOS LAN</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
              Tus cajas y computadoras actuales,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-teal-300">
                blindadas con Linux dedicado
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transformamos PCs lentas de mostrador u oficina en terminales de misión crítica con
              arranque en 4.5s, cero licencias, soporte nativo para impresoras térmicas y servidores
              locales que siguen facturando aunque se corte internet.
            </p>

            {/* Barra rápida de navegación interna + Selector de moneda */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="#catalogo-linux"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-mono text-xs font-bold transition-colors shadow-sm"
              >
                Explorar Servicios Linux
              </a>
              <a
                href="#simulador-ahorro"
                className="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 font-mono text-xs font-semibold transition-colors"
              >
                Simular Ahorro de Flota
              </a>
              <a
                href="#consola-tecnica"
                className="px-4 py-2 rounded-xl bg-white/90 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 font-mono text-xs font-semibold transition-colors"
              >
                Especificación Kernel / TTY
              </a>

              <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 p-1 ml-0 sm:ml-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('ARS')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    currency === 'ARS'
                      ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  ARS ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  USD (u$s)
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ==============================================================
            2. CATÁLOGO DE LOS 4 SERVICIOS LINUX EMPRESARIALES
           ============================================================== */}
        <section id="catalogo-linux" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LINUX_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className={`rounded-2xl p-6 sm:p-7 bg-white/95 dark:bg-[#070b14]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.08] ${srv.accentBorder} shadow-[0_14px_34px_-12px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)] flex flex-col justify-between transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-wider ${srv.accentText}`}
                      >
                        {srv.code}
                      </span>
                      <div className={`p-2 rounded-xl ${srv.accentBg} ${srv.accentText}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                      {srv.title}
                    </h2>
                    <p className={`text-xs font-mono font-medium mb-3 ${srv.accentText}`}>
                      {srv.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {srv.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {srv.specs.map((spec) => (
                        <li
                          key={spec}
                          className="flex items-start gap-2 text-xs font-mono text-slate-700 dark:text-slate-300"
                        >
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${srv.accentText}`} />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between gap-3">
                    <Link
                      href={srv.quoteHref}
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold ${srv.accentText} hover:underline`}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Cotizar este módulo</span>
                    </Link>

                    <a
                      href={getWhatsAppUrl(
                        `¡Hola Exequiel! Estoy viendo el portal /linux y me interesa el servicio: ${srv.title}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent('contact_whatsapp_clicked', { source: `linux_page_${srv.id}` })
                      }
                      className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>Consultar ingeniería</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ==============================================================
            3. SIMULADOR INTERACTIVO DE AHORRO EN FLOTA DE PCS / CAJAS
           ============================================================== */}
        <section id="simulador-ahorro" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-emerald-500/25 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="lg:w-7/12 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>SIMULADOR TCO // RECUPERACIÓN DE HARDWARE EXISTENTE</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  ¿Cuántas PCs de caja u oficina tenés hoy funcionando lentas?
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  La mayoría de los comercios descartan computadoras con procesadores Intel/AMD
                  totalmente sanos sólo porque el sistema tradicional satura la memoria y el disco.
                  Deslizá para estimar el capital que retenés migrando tu flota actual:
                </p>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      CANTIDAD DE TERMINALES / PCS A BLINDAR:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                      {pcCount} {pcCount === 1 ? 'equipo' : 'equipos'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={pcCount}
                    onChange={(e) => setPcCount(Number(e.target.value))}
                    aria-label="Cantidad de terminales o PCs"
                    className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-white/10"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>1 Caja / PC</span>
                    <span>5 Equipos</span>
                    <span>10 Equipos</span>
                    <span>20 Equipos (Sucursales)</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-5/12 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200/80 dark:border-white/[0.08] p-5 sm:p-6 space-y-4 font-mono">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                  <span className="text-slate-500 dark:text-slate-400">Recambio + Licencias:</span>
                  <span className="text-rose-600 dark:text-rose-400 line-through font-semibold">
                    {currency === 'ARS'
                      ? formatARS(pcCount * newPcCostARS)
                      : formatUSD(pcCount * newPcCostUSD)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                  <span className="text-slate-600 dark:text-slate-300">
                    Migración Linux Determinista:
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {currency === 'ARS'
                      ? formatARS(linuxMigrationARS)
                      : formatUSD(linuxMigrationUSD)}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                    CAPITAL DIRECTO AHORRADO POR TU NEGOCIO
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {currency === 'ARS' ? formatARS(savedARS) : formatUSD(savedUSD)}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans">
                    Incluye aprovisionamiento en lote, reglas ESC/POS y pendrive físico de rescate.
                  </p>
                </div>

                <Link
                  href={`/cotizador?plan=linux&type=linux-pos&currency=${currency}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>
                    Armar Presupuesto para {pcCount} {pcCount === 1 ? 'Equipo' : 'Equipos'}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            4. CONSOLA INTERACTIVA DE ARQUITECTURA LINUX (WORKBENCH TTY1)
           ============================================================== */}
        <div id="consola-tecnica">
          <LinuxBusinessSection hidePortalLink />
        </div>

        {/* ==============================================================
            5. PLANES CLAROS DE DESPLIEGUE Y GUARDIA LINUX
           ============================================================== */}
        <section id="planes-linux" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              ESQUEMA TRANSPARENTE // SIN COSTOS OCULTOS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Modalidades de Implementación y Guardia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1: Estación POS / PC */}
            <div className="rounded-2xl p-6 bg-white/95 dark:bg-[#070b14]/90 border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-cyan-700 dark:text-cyan-400 font-bold mb-2">
                  <span>ESTACIÓN INDIVIDUAL</span>
                  <span>PAGO ÚNICO</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Terminal Linux POS / Workstation
                </h3>
                <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white my-3">
                  {currency === 'ARS' ? '$350.000' : 'u$s 320'}
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Modo Quiosco o Escritorio Productivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Drivers térmicos ESC/POS y lectores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Pendrive USB físico de rescate (3 min)</span>
                  </li>
                </ul>
              </div>
              <Link
                href={`/cotizador?plan=linux&type=linux-pos&currency=${currency}`}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/15 hover:border-cyan-500 text-slate-900 dark:text-white font-mono text-xs font-bold text-center transition-colors"
              >
                Configurar Terminal
              </Link>
            </div>

            {/* Plan 2: Nodo Servidor LAN Offline-First */}
            <div className="rounded-2xl p-6 bg-white dark:bg-[#09111f] border-2 border-emerald-500/50 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.18)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                  <span className="inline-flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" />
                    MISIÓN CRÍTICA LAN
                  </span>
                  <span>PAGO ÚNICO</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Nodo Servidor Local Offline-First
                </h3>
                <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 my-3">
                  {currency === 'ARS' ? '$680.000' : 'u$s 620'}
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>PostgreSQL en red local (&lt;0.4ms)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sincronización asíncrona con la nube</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Firewall nftables + Backups encriptados</span>
                  </li>
                </ul>
              </div>
              <Link
                href={`/cotizador?plan=linux&type=edge-server&currency=${currency}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-mono text-xs font-bold text-center transition-colors"
              >
                Cotizar Nodo Local LAN
              </Link>
            </div>

            {/* Plan 3: Guardia Remota SSH & Monitoreo S.M.A.R.T. */}
            <div className="rounded-2xl p-6 bg-white/95 dark:bg-[#070b14]/90 border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-violet-700 dark:text-violet-400 font-bold mb-2">
                  <span className="inline-flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    GUARDIA PREVENTIVA
                  </span>
                  <span>100% OPCIONAL</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Telemetría S.M.A.R.T. & Soporte SSH
                </h3>
                <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white my-3">
                  {currency === 'ARS' ? '$32.000' : 'u$s 28'}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {' '}
                    /mes
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span>Alertas tempranas de desgaste SSD/NVMe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span>Parches de seguridad en horario nocturno</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span>Asistencia remota directa por túnel SSH</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/tienda#linux"
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/15 hover:border-violet-500 text-slate-900 dark:text-white font-mono text-xs font-bold text-center transition-colors"
              >
                Ver en Tienda de Abonos
              </Link>
            </div>
          </div>
        </section>

        <ContactSection />
        <Footer />
      </main>
    </div>
  )
}
