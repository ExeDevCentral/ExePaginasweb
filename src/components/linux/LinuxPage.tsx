/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
} from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/layout/Footer'
import { smoothScrollTo } from '@/components/shared/scrollUtils'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

type StationId = 'catalogo-linux' | 'simulador-ahorro' | 'consola-tecnica' | 'planes-linux'
type SnippetKey = 'pos' | 'fleet' | 'lan'

const LINUX_STATION_IDS: readonly StationId[] = [
  'catalogo-linux',
  'simulador-ahorro',
  'consola-tecnica',
  'planes-linux',
] as const

interface LinuxStation {
  id: StationId
  num: string
  heroLabel: string
  dockLabel: string
  mobileLabel: string
  activePillClass: string
  heroActiveClass: string
  progressColorClass: string
}

interface KernelSnippet {
  label: string
  path: string
  lines: string[]
}

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

export default function LinuxPage() {
  const { t } = useTranslation()
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [pcCount, setPcCount] = useState<number>(4)
  const [osMode, setOsMode] = useState<'linux' | 'comercial'>('linux')
  const [snippetKey, setSnippetKey] = useState<SnippetKey>('pos')
  const [activeStationIdx, setActiveStationIdx] = useState<number>(0)
  const [isDockVisible, setIsDockVisible] = useState<boolean>(false)

  const linuxStations: readonly LinuxStation[] = useMemo(
    () => [
      {
        id: 'catalogo-linux',
        num: '01',
        heroLabel: t('linux_page.station_1_hero', '1. Servicios Linux'),
        dockLabel: t('linux_page.station_1_dock', 'Servicios'),
        mobileLabel: t('linux_page.station_1_mobile', 'POS'),
        activePillClass:
          'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-[0_4px_14px_rgba(16,185,129,0.35)]',
        heroActiveClass:
          'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 border-emerald-600 dark:border-emerald-400 shadow-sm',
        progressColorClass: 'bg-emerald-500',
      },
      {
        id: 'simulador-ahorro',
        num: '02',
        heroLabel: t('linux_page.station_2_hero', '2. Simulador de Flota'),
        dockLabel: t('linux_page.station_2_dock', 'Simulador'),
        mobileLabel: t('linux_page.station_2_mobile', 'Flota'),
        activePillClass:
          'bg-cyan-600 dark:bg-cyan-400 text-white dark:text-slate-950 shadow-[0_4px_14px_rgba(6,182,212,0.35)]',
        heroActiveClass:
          'bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-slate-950 border-cyan-600 dark:border-cyan-400 shadow-sm',
        progressColorClass: 'bg-cyan-500',
      },
      {
        id: 'consola-tecnica',
        num: '03',
        heroLabel: t('linux_page.station_3_hero', '3. Telemetría Kernel'),
        dockLabel: t('linux_page.station_3_dock', 'Kernel'),
        mobileLabel: t('linux_page.station_3_mobile', 'TTY'),
        activePillClass:
          'bg-teal-600 dark:bg-teal-400 text-white dark:text-slate-950 shadow-[0_4px_14px_rgba(20,184,166,0.35)]',
        heroActiveClass:
          'bg-teal-600 hover:bg-teal-500 dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 border-teal-600 dark:border-teal-400 shadow-sm',
        progressColorClass: 'bg-teal-500',
      },
      {
        id: 'planes-linux',
        num: '04',
        heroLabel: t('linux_page.station_4_hero', '4. Planes & Precios'),
        dockLabel: t('linux_page.station_4_dock', 'Planes'),
        mobileLabel: t('linux_page.station_4_mobile', 'Planes'),
        activePillClass:
          'bg-violet-600 dark:bg-violet-500 text-white dark:text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)]',
        heroActiveClass:
          'bg-violet-600 hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400 text-white dark:text-white border-violet-600 dark:border-violet-400 shadow-sm',
        progressColorClass: 'bg-violet-500',
      },
    ],
    [t]
  )

  const kernelSnippets: Record<SnippetKey, KernelSnippet> = useMemo(
    () => ({
      pos: {
        label: 'tty1:pos-kiosk',
        path: '/etc/udev/rules.d/99-escpos.rules',
        lines: [
          t(
            'linux_page.snippet_pos_comment_1',
            '# Puerto fijo permanente para impresora térmica ESC/POS y lector láser'
          ),
          'SUBSYSTEM=="usb", ATTR{idVendor}=="04b8", MODE="0660", GROUP="lp", SYMLINK+="escpos0"',
          t(
            'linux_page.snippet_pos_comment_2',
            '# Servicio gráfico aislado (Wayland Cage · reinicio automático en 5s)'
          ),
          'ExecStart=/usr/bin/cage -s -- chromium --kiosk --noerrdialogs --app=https://pos.local',
        ],
      },
      fleet: {
        label: 'tty2:zram-fleet',
        path: '/etc/systemd/zram-generator.conf',
        lines: [
          t(
            'linux_page.snippet_fleet_comment_1',
            '# Compresión zstd en memoria RAM: multiplica fluidez en PCs de 4GB / 8GB'
          ),
          '[zram0] zram-size = ram / 2 | compression-algorithm = zstd',
          t(
            'linux_page.snippet_fleet_comment_2',
            '# Snapshot automático en disco previo a cualquier parche nocturno'
          ),
          'timeshift --create --comments "Nightly Atomic Point" --scripted',
        ],
      },
      lan: {
        label: 'tty3:lan-postgres',
        path: '/etc/systemd/system/exe-outbox-sync.service',
        lines: [
          t(
            'linux_page.snippet_lan_comment_1',
            '# PostgreSQL 15 en red local LAN (<0.3ms) + réplica asíncrona hacia la nube'
          ),
          'pg_isready -h 127.0.0.1 -p 5432 && systemctl status exe-outbox-sync.service',
          t(
            'linux_page.snippet_lan_comment_2',
            '# Respuesta local ininterrumpida ante corte total de fibra óptica:'
          ),
          '64 bytes from 192.168.1.10 (pos-server.local): icmp_seq=1 ttl=64 time=0.19 ms',
        ],
      },
    }),
    [t]
  )

  const linuxServices: LinuxServiceItem[] = useMemo(
    () => [
      {
        id: 'kiosk-pos',
        code: t('linux_page.srv_1_code', 'SRV-LNX-01 // TERMINALES DE CAJA'),
        title: t('linux_page.srv_1_title', 'Terminales Linux POS & Modo Quiosco Blindado'),
        subtitle: t(
          'linux_page.srv_1_subtitle',
          'Mostradores, gastronomía, farmacias y retail de alto tráfico'
        ),
        description: t(
          'linux_page.srv_1_desc',
          'Convertimos la PC de tu caja en un electrodoméstico dedicado: enciende en 4.5 segundos directo a tu sistema de cobro o comandas, sin escritorio distraído, sin actualizaciones forzadas en hora pico y con reglas permanentes para impresoras térmicas.'
        ),
        icon: Terminal,
        accentText: 'text-emerald-700 dark:text-emerald-400',
        accentBorder: 'border-emerald-500/30 hover:border-emerald-500/60',
        accentBg: 'bg-emerald-500/10',
        specs: [
          t('linux_page.srv_1_spec_1', 'Arranque determinista en 4.5s (systemd-boot)'),
          t(
            'linux_page.srv_1_spec_2',
            'Reglas udev fijas para impresoras ESC/POS y lectores láser'
          ),
          t('linux_page.srv_1_spec_3', 'Bloqueo de sistema contra cierres accidentales o virus'),
        ],
        quoteHref: '/cotizador?plan=linux&type=linux-pos',
      },
      {
        id: 'pc-rescue',
        code: t('linux_page.srv_2_code', 'SRV-LNX-02 // MIGRACIÓN DE FLOTA'),
        title: t(
          'linux_page.srv_2_title',
          'Rescate y Migración de PCs de Oficina / Administración'
        ),
        subtitle: t(
          'linux_page.srv_2_subtitle',
          'Extendé 5+ años la vida útil de tu hardware x86_64 actual'
        ),
        description: t(
          'linux_page.srv_2_desc',
          'Antes de gastar millones renovando computadoras lentas por culpa de sistemas operativos pesados, migramos tus estaciones a Linux LTS optimizado: consumen apenas 480 MB de RAM en reposo y vuelan en tareas administrativas, ERP web y ofimática.'
        ),
        icon: Cpu,
        accentText: 'text-cyan-700 dark:text-cyan-400',
        accentBorder: 'border-cyan-500/30 hover:border-cyan-500/60',
        accentBg: 'bg-cyan-500/10',
        specs: [
          t('linux_page.srv_2_spec_1', '480 MB RAM en reposo (revive PCs con 4GB u 8GB RAM)'),
          t('linux_page.srv_2_spec_2', '$0 en licencias anuales de sistema operativo y antivirus'),
          t(
            'linux_page.srv_2_spec_3',
            'Navegador aislado, suite ofimática completa y cero telemetría'
          ),
        ],
        quoteHref: '/cotizador?plan=linux&type=linux-pos',
      },
      {
        id: 'lan-node',
        code: t('linux_page.srv_3_code', 'SRV-LNX-03 // CONTINUIDAD OPERATIVA'),
        title: t('linux_page.srv_3_title', 'Nodo Servidor Local LAN & PostgreSQL Offline-First'),
        subtitle: t(
          'linux_page.srv_3_subtitle',
          'Operación ininterrumpida a 0.4ms aunque se corte internet'
        ),
        description: t(
          'linux_page.srv_3_desc',
          'Instalamos un nodo servidor Linux físico dentro de tu comercio o planta con PostgreSQL local y sincronización asíncrona hacia la nube. Tus cajas, KDS de cocina y terminales internas siguen operando a velocidad de cable de red sin depender del proveedor de fibra.'
        ),
        icon: Server,
        accentText: 'text-violet-700 dark:text-violet-400',
        accentBorder: 'border-violet-500/30 hover:border-violet-500/60',
        accentBg: 'bg-violet-500/10',
        specs: [
          t('linux_page.srv_3_spec_1', 'Latencia sub-milisegundo (<0.4ms) en red local LAN'),
          t(
            'linux_page.srv_3_spec_2',
            'Replicación automática en segundo plano al volver internet'
          ),
          t('linux_page.srv_3_spec_3', 'Backups diarios encriptados locales + copia en la nube'),
        ],
        quoteHref: '/cotizador?plan=linux&type=edge-server',
      },
      {
        id: 'ssh-guard',
        code: t('linux_page.srv_4_code', 'SRV-LNX-04 // BLINDAJE & RESCATE'),
        title: t('linux_page.srv_4_title', 'Guardia Remota SSH, Hardening & Llave USB Física'),
        subtitle: t(
          'linux_page.srv_4_subtitle',
          'Recuperación ante desastres en 3 minutos sin depender de nadie'
        ),
        description: t(
          'linux_page.srv_4_desc',
          'Cada despliegue incluye firewall nftables, monitoreo predictivo de salud de discos (S.M.A.R.T.) y la entrega en mano de un pendrive físico booteable configurado a medida para restaurar una terminal completa al estado exacto de fábrica en 3 minutos.'
        ),
        icon: HardDrive,
        accentText: 'text-amber-700 dark:text-amber-400',
        accentBorder: 'border-amber-500/30 hover:border-amber-500/60',
        accentBg: 'bg-amber-500/10',
        specs: [
          t('linux_page.srv_4_spec_1', 'Pendrive físico Live USB (Timeshift / imagen clonada)'),
          t(
            'linux_page.srv_4_spec_2',
            'Túnel seguro WireGuard / SSH con llave criptográfica Ed25519'
          ),
          t(
            'linux_page.srv_4_spec_3',
            'Ventanas de mantenimiento atómicas fuera de horario comercial'
          ),
        ],
        quoteHref: '/cotizador?plan=linux&type=linux-pos',
      },
    ],
    [t]
  )

  const heroNavRef = useRef<HTMLDivElement | null>(null)
  const linuxZoneRef = useRef<HTMLDivElement | null>(null)
  const programmaticScrollUntilRef = useRef<number>(0)

  const jumpToStation = useCallback((idx: number) => {
    const safeIdx =
      ((idx % LINUX_STATION_IDS.length) + LINUX_STATION_IDS.length) % LINUX_STATION_IDS.length
    const targetId = LINUX_STATION_IDS[safeIdx]
    if (!targetId) return

    programmaticScrollUntilRef.current = Date.now() + 900
    setActiveStationIdx(safeIdx)

    const isCompactViewport = typeof window !== 'undefined' && window.innerWidth < 1024
    const scrollOffset = isCompactViewport ? -136 : -92
    smoothScrollTo(`#${targetId}`, scrollOffset)

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${targetId}`)
    }
  }, [])

  // Visibilidad flotante estrictamente acotada a la zona Linux + Scroll-Spy en vivo
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDockAndActiveStation = () => {
      const heroEl = heroNavRef.current
      const zoneEl = linuxZoneRef.current

      if (heroEl && zoneEl) {
        const heroRect = heroEl.getBoundingClientRect()
        const zoneRect = zoneEl.getBoundingClientRect()
        // Aparece apenas la barra del Hero queda oculta tras el navbar y desaparece al salir de #planes-linux
        const shouldShow = heroRect.bottom < 96 && zoneRect.bottom > 240
        setIsDockVisible((prev) => (prev === shouldShow ? prev : shouldShow))
      }

      if (Date.now() > programmaticScrollUntilRef.current) {
        const probeY = window.innerHeight * 0.36
        let detectedIdx = 0
        for (let i = 0; i < LINUX_STATION_IDS.length; i++) {
          const stationId = LINUX_STATION_IDS[i]
          if (!stationId) continue
          const secEl = document.getElementById(stationId)
          if (!secEl) continue
          if (secEl.getBoundingClientRect().top <= probeY) {
            detectedIdx = i
          }
        }
        setActiveStationIdx((prev) => (prev === detectedIdx ? prev : detectedIdx))
      }
    }

    updateDockAndActiveStation()
    window.addEventListener('scroll', updateDockAndActiveStation, { passive: true })
    window.addEventListener('resize', updateDockAndActiveStation, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateDockAndActiveStation)
      window.removeEventListener('resize', updateDockAndActiveStation)
    }
  }, [])

  // Atajos rápidos 1–4 por teclado mientras se explora la sección Linux
  useEffect(() => {
    if (!isDockVisible || typeof window === 'undefined') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const activeTag = (document.activeElement as HTMLElement | null)?.tagName
      if (
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        (document.activeElement as HTMLElement | null)?.isContentEditable
      ) {
        return
      }
      if (e.key >= '1' && e.key <= '4') {
        jumpToStation(Number(e.key) - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDockVisible, jumpToStation])

  // Cálculo conservador y transparente de ahorro de CAPEX/OPEX frente a recambio de hardware + licencias
  const newPcCostUSD = 620 // PC comercial nueva + licencia Pro + setup
  const linuxMigrationUSD = pcCount === 1 ? 320 : 320 + (pcCount - 1) * 140
  const savedUSD = Math.max(0, pcCount * newPcCostUSD - linuxMigrationUSD)

  const newPcCostARS = 720000
  const linuxMigrationARS = pcCount === 1 ? 350000 : 350000 + (pcCount - 1) * 155000
  const savedARS = Math.max(0, pcCount * newPcCostARS - linuxMigrationARS)

  const formatARS = (val: number) => '$' + val.toLocaleString('es-AR')
  const formatUSD = (val: number) => 'u$s ' + val.toLocaleString('en-US')

  const currentStation = linuxStations[activeStationIdx] ?? linuxStations[0]!
  const nextStationIdx = (activeStationIdx + 1) % linuxStations.length
  const nextStation = linuxStations[nextStationIdx] ?? linuxStations[0]!
  const isLastStation = activeStationIdx === linuxStations.length - 1

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
              <span>
                {t(
                  'linux_page.hero_badge',
                  'DIVISIÓN INFRAESTRUCTURA LINUX // POS · FLOTAS · NODOS LAN'
                )}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
              {t('linux_page.hero_title_1', 'Tus cajas y computadoras actuales,')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-teal-300">
                {t('linux_page.hero_title_highlight', 'blindadas con Linux dedicado')}
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t(
                'linux_page.hero_subtitle',
                'Transformamos PCs lentas de mostrador u oficina en terminales de misión crítica con arranque en 4.5s, cero licencias, soporte nativo para impresoras térmicas y servidores locales que siguen facturando aunque se corte internet.'
              )}
            </p>

            {/* Barra inicial sincronizada (al scrollear se transforma en el Dock Flotante) */}
            <div
              ref={heroNavRef}
              className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
            >
              {linuxStations.map((st, idx) => {
                const isActive = activeStationIdx === idx
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => jumpToStation(idx)}
                    className={`px-4 py-2 rounded-xl border font-mono text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                      isActive
                        ? `${st.heroActiveClass} font-bold`
                        : 'bg-white dark:bg-white/[0.05] border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-emerald-500/60 hover:-translate-y-0.5 font-semibold shadow-2xs'
                    }`}
                  >
                    {st.heroLabel}
                  </button>
                )
              })}

              <div
                role="group"
                aria-label={t('linux_page.currency_selector_aria', 'Seleccionar moneda')}
                className="inline-flex items-center rounded-xl bg-slate-200/80 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 p-1 ml-0 sm:ml-2 font-mono text-xs"
              >
                <button
                  type="button"
                  onClick={() => setCurrency('ARS')}
                  title={t(
                    'linux_page.currency_ars_title',
                    'Ver precios en Pesos Argentinos (ARS)'
                  )}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    currency === 'ARS'
                      ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t('linux_page.currency_ars_label', 'ARS ($)')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  title={t(
                    'linux_page.currency_usd_title',
                    'Ver precios en Dólares Estadounidenses (USD)'
                  )}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t('linux_page.currency_usd_label', 'USD (u$s)')}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ZONA INTERACTIVA LINUX (Acota estrictamente la aparición del Dock Flotante) */}
        <div ref={linuxZoneRef} className="relative">
          {/* ==============================================================
              2. CATÁLOGO DE LOS 4 SERVICIOS LINUX EMPRESARIALES
             ============================================================== */}
          <section
            id="catalogo-linux"
            className="scroll-mt-36 lg:scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {linuxServices.map((srv, idx) => {
                const Icon = srv.icon
                return (
                  <motion.div
                    key={srv.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className={`rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#070b14]/90 backdrop-blur-xl border border-slate-300 dark:border-white/[0.08] ${srv.accentBorder} shadow-[0_14px_34px_-12px_rgba(15,23,42,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)] flex flex-col justify-between transition-all duration-300`}
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
                        <span>{t('linux_page.srv_cta_quote', 'Cotizar este módulo')}</span>
                      </Link>

                      <a
                        href={getWhatsAppUrl(
                          t('linux_page.srv_whatsapp_msg', {
                            title: srv.title,
                            defaultValue:
                              '¡Hola Exequiel! Estoy viendo el portal /linux y me interesa el servicio: {{title}}.',
                          })
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent('contact_whatsapp_clicked', { source: `linux_page_${srv.id}` })
                        }
                        className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>{t('linux_page.srv_cta_consult', 'Consultar ingeniería')}</span>
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
          <section
            id="simulador-ahorro"
            className="scroll-mt-36 lg:scroll-mt-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-emerald-500/25 bg-white dark:bg-[#070b14]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="lg:w-7/12 space-y-4">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>
                      {t(
                        'linux_page.sim_badge',
                        'SIMULADOR TCO // RECUPERACIÓN DE HARDWARE EXISTENTE'
                      )}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t(
                      'linux_page.sim_title',
                      '¿Cuántas PCs de caja u oficina tenés hoy funcionando lentas?'
                    )}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t(
                      'linux_page.sim_subtitle',
                      'La mayoría de los comercios descartan computadoras con procesadores Intel/AMD totalmente sanos sólo porque el sistema tradicional satura la memoria y el disco. Deslizá para estimar el capital que retenés migrando tu flota actual:'
                    )}
                  </p>

                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t(
                          'linux_page.sim_slider_label',
                          'CANTIDAD DE TERMINALES / PCS A BLINDAR:'
                        )}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                        {pcCount}{' '}
                        {pcCount === 1
                          ? t('linux_page.sim_unit_singular', 'equipo')
                          : t('linux_page.sim_unit_plural', 'equipos')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={pcCount}
                      onChange={(e) => setPcCount(Number(e.target.value))}
                      aria-label={t('linux_page.sim_slider_aria', 'Cantidad de terminales o PCs')}
                      className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-white/10"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
                      <span>{t('linux_page.sim_scale_1', '1 Caja / PC')}</span>
                      <span>{t('linux_page.sim_scale_5', '5 Equipos')}</span>
                      <span>{t('linux_page.sim_scale_10', '10 Equipos')}</span>
                      <span>{t('linux_page.sim_scale_20', '20 Equipos (Sucursales)')}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-5/12 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200/80 dark:border-white/[0.08] p-5 sm:p-6 space-y-4 font-mono">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('linux_page.sim_row_replace', 'Recambio + Licencias:')}
                    </span>
                    <motion.span
                      key={`old-${currency}-${pcCount}`}
                      initial={{ opacity: 0.4, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-rose-600 dark:text-rose-400 line-through font-semibold"
                    >
                      {currency === 'ARS'
                        ? formatARS(pcCount * newPcCostARS)
                        : formatUSD(pcCount * newPcCostUSD)}
                    </motion.span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                    <span className="text-slate-600 dark:text-slate-300">
                      {t('linux_page.sim_row_migration', 'Migración Linux Determinista:')}
                    </span>
                    <motion.span
                      key={`mig-${currency}-${pcCount}`}
                      initial={{ opacity: 0.4, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-slate-900 dark:text-white font-bold"
                    >
                      {currency === 'ARS'
                        ? formatARS(linuxMigrationARS)
                        : formatUSD(linuxMigrationUSD)}
                    </motion.span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                      {t('linux_page.sim_saved_label', 'CAPITAL DIRECTO AHORRADO POR TU NEGOCIO')}
                    </span>
                    <motion.div
                      key={`save-${currency}-${pcCount}`}
                      initial={{ opacity: 0.35, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 origin-left"
                    >
                      {currency === 'ARS' ? formatARS(savedARS) : formatUSD(savedUSD)}
                    </motion.div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans">
                      {t(
                        'linux_page.sim_footnote',
                        'Incluye aprovisionamiento en lote, reglas ESC/POS y pendrive físico de rescate.'
                      )}
                    </p>
                  </div>

                  <Link
                    href={`/cotizador?plan=linux&type=linux-pos&currency=${currency}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>
                      {pcCount === 1
                        ? t('linux_page.sim_cta_single', {
                            count: pcCount,
                            defaultValue: 'Armar Presupuesto para {{count}} Equipo',
                          })
                        : t('linux_page.sim_cta_plural', {
                            count: pcCount,
                            defaultValue: 'Armar Presupuesto para {{count}} Equipos',
                          })}
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ==============================================================
              4. TELEMETRÍA KERNEL & BENCHMARK COMPACTO (CERO REPETICIÓN)
             ============================================================== */}
          <section
            id="consola-tecnica"
            className="scroll-mt-36 lg:scroll-mt-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="rounded-2xl border border-slate-300 dark:border-emerald-500/30 bg-[#05080f] text-slate-100 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.22)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden font-mono">
              {/* Barra de ventana TTY */}
              <div className="px-4 sm:px-6 py-3 bg-[#0a101d] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {t(
                      'linux_page.tty_window_title',
                      'root@exe-pos-node:~ (Linux 6.12-LTS x86_64 · Benchmark en mismo hardware 8GB NVMe)'
                    )}
                  </span>
                </div>

                <div className="inline-flex rounded-lg bg-black/50 p-1 border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setOsMode('linux')}
                    className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                      osMode === 'linux'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('linux_page.tty_mode_linux', 'LINUX LTS DEDICADO')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOsMode('comercial')}
                    className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                      osMode === 'comercial'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-rose-300'
                    }`}
                  >
                    {t('linux_page.tty_mode_commercial', 'OS COMERCIAL ESTÁNDAR')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {/* Barras htop comparativas */}
                <div className="lg:col-span-6 p-5 sm:p-6 space-y-4 text-xs bg-[#03060c]">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">
                        {t('linux_page.tty_metric_ram_label', 'MEM[||] Consumo RAM en reposo')}
                      </span>
                      <span
                        className={`font-bold ${
                          osMode === 'linux' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {osMode === 'linux'
                          ? t('linux_page.tty_metric_ram_linux', '480 MB / 8192 MB (5.8%)')
                          : t('linux_page.tty_metric_ram_commercial', '4310 MB / 8192 MB (52.6%)')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          osMode === 'linux' ? 'w-[7%] bg-emerald-400' : 'w-[54%] bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">
                        {t('linux_page.tty_metric_boot_label', 'BOOT[|] Encendido → Caja lista')}
                      </span>
                      <span
                        className={`font-bold ${
                          osMode === 'linux' ? 'text-cyan-400' : 'text-amber-400'
                        }`}
                      >
                        {osMode === 'linux'
                          ? t('linux_page.tty_metric_boot_linux', '4.5s (systemd-analyze)')
                          : t(
                              'linux_page.tty_metric_boot_commercial',
                              '48s – 90s (I/O bloqueante)'
                            )}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          osMode === 'linux' ? 'w-[9%] bg-cyan-400' : 'w-[82%] bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400">
                        {t(
                          'linux_page.tty_metric_irq_label',
                          'IRQ[0] Reinicios en horario comercial'
                        )}
                      </span>
                      <span
                        className={`font-bold ${
                          osMode === 'linux' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {osMode === 'linux'
                          ? t('linux_page.tty_metric_irq_linux', '0 (Ventana nocturna)')
                          : t('linux_page.tty_metric_irq_commercial', 'Actualizaciones forzadas')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          osMode === 'linux' ? 'w-[2%] bg-emerald-400' : 'w-[88%] bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    {osMode === 'linux' ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          {t(
                            'linux_page.tty_status_linux',
                            'NODO DETERMINISTA ACTIVO · UPTIME 99.98% · INMUNE A .EXE'
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-[11px]">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {t(
                            'linux_page.tty_status_commercial',
                            'DEGRADACIÓN DE I/O Y RIESGO DE BLOQUEO EN HORA PICO'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspector de configuración auditable */}
                <div className="lg:col-span-6 p-5 sm:p-6 bg-[#070b14] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] text-cyan-400 font-bold">
                        {t('linux_page.tty_config_header', 'CONFIGURACIÓN AUDITABLE:')}
                      </span>
                      <div className="flex items-center gap-1">
                        {(Object.keys(kernelSnippets) as SnippetKey[]).map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setSnippetKey(k)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                              snippetKey === k
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                                : 'text-slate-400 hover:text-white border border-transparent'
                            }`}
                          >
                            {kernelSnippets[k].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 mb-2">
                      $ cat {kernelSnippets[snippetKey].path}
                    </div>
                    <pre className="p-3.5 rounded-xl bg-black/80 border border-white/10 text-[11px] text-emerald-300/95 overflow-x-auto leading-relaxed">
                      {kernelSnippets[snippetKey].lines.join('\n')}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {t(
                      'linux_page.tty_config_footer',
                      'Código y scripts bash 100% documentados y transferidos con acceso root completo a tu comercio o equipo IT, sin cajas negras ni ataduras.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ==============================================================
              5. PLANES CLAROS DE DESPLIEGUE Y GUARDIA LINUX
             ============================================================== */}
          <section
            id="planes-linux"
            className="scroll-mt-36 lg:scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {t('linux_page.plans_eyebrow', 'ESQUEMA TRANSPARENTE // SIN COSTOS OCULTOS')}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                {t('linux_page.plans_heading', 'Modalidades de Implementación y Guardia')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1: Estación POS / PC */}
              <div className="rounded-2xl p-6 bg-white dark:bg-[#070b14]/90 border border-slate-300 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-cyan-700 dark:text-cyan-400 font-bold mb-2">
                    <span>{t('linux_page.plan_1_badge_left', 'ESTACIÓN INDIVIDUAL')}</span>
                    <span>{t('linux_page.plan_1_badge_right', 'PAGO ÚNICO')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {t('linux_page.plan_1_title', 'Terminal Linux POS / Workstation')}
                  </h3>
                  <motion.div
                    key={`plan1-${currency}`}
                    initial={{ opacity: 0.4, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white my-3"
                  >
                    {currency === 'ARS' ? '$350.000' : 'u$s 320'}
                  </motion.div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_1_feat_1', 'Modo Quiosco o Escritorio Productivo')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_1_feat_2', 'Drivers térmicos ESC/POS y lectores')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_1_feat_3', 'Pendrive USB físico de rescate (3 min)')}
                      </span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/cotizador?plan=linux&type=linux-pos&currency=${currency}`}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/15 hover:border-cyan-500 text-slate-900 dark:text-white font-mono text-xs font-bold text-center transition-colors"
                >
                  {t('linux_page.plan_1_cta', 'Configurar Terminal')}
                </Link>
              </div>

              {/* Plan 2: Nodo Servidor LAN Offline-First */}
              <div className="rounded-2xl p-6 bg-white dark:bg-[#09111f] border-2 border-emerald-500/50 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.18)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                    <span className="inline-flex items-center gap-1">
                      <WifiOff className="w-3.5 h-3.5" />
                      {t('linux_page.plan_2_badge_left', 'MISIÓN CRÍTICA LAN')}
                    </span>
                    <span>{t('linux_page.plan_2_badge_right', 'PAGO ÚNICO')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {t('linux_page.plan_2_title', 'Nodo Servidor Local Offline-First')}
                  </h3>
                  <motion.div
                    key={`plan2-${currency}`}
                    initial={{ opacity: 0.4, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 my-3"
                  >
                    {currency === 'ARS' ? '$680.000' : 'u$s 620'}
                  </motion.div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_2_feat_1', 'PostgreSQL en red local (<0.4ms)')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_2_feat_2', 'Sincronización asíncrona con la nube')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_2_feat_3', 'Firewall nftables + Backups encriptados')}
                      </span>
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/cotizador?plan=linux&type=edge-server&currency=${currency}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-mono text-xs font-bold text-center transition-colors"
                >
                  {t('linux_page.plan_2_cta', 'Cotizar Nodo Local LAN')}
                </Link>
              </div>

              {/* Plan 3: Guardia Remota SSH & Monitoreo S.M.A.R.T. */}
              <div className="rounded-2xl p-6 bg-white dark:bg-[#070b14]/90 border border-slate-300 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-violet-700 dark:text-violet-400 font-bold mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      {t('linux_page.plan_3_badge_left', 'GUARDIA PREVENTIVA')}
                    </span>
                    <span>{t('linux_page.plan_3_badge_right', '100% OPCIONAL')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {t('linux_page.plan_3_title', 'Telemetría S.M.A.R.T. & Soporte SSH')}
                  </h3>
                  <motion.div
                    key={`plan3-${currency}`}
                    initial={{ opacity: 0.4, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white my-3"
                  >
                    {currency === 'ARS' ? '$32.000' : 'u$s 28'}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {' '}
                      {t('linux_page.plan_3_period', '/mes')}
                    </span>
                  </motion.div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 font-mono">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_3_feat_1', 'Alertas tempranas de desgaste SSD/NVMe')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_3_feat_2', 'Parches de seguridad en horario nocturno')}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span>
                        {t('linux_page.plan_3_feat_3', 'Asistencia remota directa por túnel SSH')}
                      </span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/tienda#linux"
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/15 hover:border-violet-500 text-slate-900 dark:text-white font-mono text-xs font-bold text-center transition-colors"
                >
                  {t('linux_page.plan_3_cta', 'Ver en Tienda de Abonos')}
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* ==============================================================
            DOCK FLOTANTE INTERACTIVO (ACOTADO SOLO A LA ZONA LINUX)
            Se oculta automáticamente al bajar a Contacto / Footer
           ============================================================== */}
        <AnimatePresence>
          {isDockVisible && (
            <motion.nav
              aria-label={t('linux_page.dock_aria_label', 'Navegación rápida de secciones Linux')}
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 26, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="fixed top-[68px] sm:top-[76px] lg:top-auto lg:bottom-6 inset-x-0 flex justify-center lg:justify-start xl:justify-center px-2.5 lg:px-6 xl:px-0 z-40 pointer-events-none select-none"
            >
              <div className="pointer-events-auto relative overflow-hidden rounded-2xl bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-300/95 dark:border-white/15 ring-1 ring-slate-900/[0.06] dark:ring-emerald-500/20 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.24),0_4px_16px_-2px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.92)] p-1.5 flex items-center gap-1.5 font-mono">
                {/* Línea láser superior de progreso por estación (25% → 100%) */}
                <div className="absolute top-0 inset-x-0 h-[2.5px] bg-slate-200/80 dark:bg-white/[0.06]">
                  <motion.div
                    className={`h-full ${currentStation.progressColorClass}`}
                    initial={false}
                    animate={{
                      width: `${((activeStationIdx + 1) / linuxStations.length) * 100}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                </div>

                {/* 4 Estaciones con píldora elástica (layoutId) */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/[0.07] rounded-xl p-0.5">
                  {linuxStations.map((st, idx) => {
                    const isActive = activeStationIdx === idx
                    return (
                      <motion.button
                        key={st.id}
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => jumpToStation(idx)}
                        title={t('linux_page.dock_station_title', {
                          label: st.heroLabel,
                          key: idx + 1,
                          defaultValue: 'Ir a {{label}} (Tecla {{key}})',
                        })}
                        className={`relative px-2 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'text-white dark:text-slate-950'
                            : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="linux-dock-pill"
                            transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                            className={`absolute inset-0 rounded-lg ${st.activePillClass}`}
                          />
                        )}
                        <span
                          className={`relative z-10 text-[9px] opacity-80 ${
                            isActive && st.id === 'planes-linux' ? 'text-white/90' : ''
                          }`}
                        >
                          {st.num}
                        </span>
                        <span
                          className={`relative z-10 hidden sm:inline ${
                            isActive && st.id === 'planes-linux' ? 'text-white' : ''
                          }`}
                        >
                          {st.dockLabel}
                        </span>
                        <span
                          className={`relative z-10 sm:hidden ${
                            isActive && st.id === 'planes-linux' ? 'text-white' : ''
                          }`}
                        >
                          {st.mobileLabel}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Botón rápido lúdico para saltar al siguiente paso con 1 clic */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => jumpToStation(nextStationIdx)}
                  title={
                    isLastStation
                      ? t('linux_page.dock_reset_title', 'Volver al inicio de Servicios Linux')
                      : t('linux_page.dock_next_title', {
                          label: nextStation.heroLabel,
                          defaultValue: 'Avanzar a {{label}}',
                        })
                  }
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/[0.1] dark:hover:bg-white/[0.16] text-white border border-slate-800 dark:border-white/15 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className="hidden md:inline">
                    {isLastStation
                      ? t('linux_page.dock_reset_label', 'Inicio')
                      : t('linux_page.dock_next_label', {
                          num: nextStation.num,
                          defaultValue: 'Sig · {{num}}',
                        })}
                  </span>
                  {isLastStation ? (
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </motion.button>

                {/* Selector de moneda ARS / USD en vivo */}
                <div className="hidden sm:inline-flex items-center rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-300/90 dark:border-white/10 p-0.5 text-[11px]">
                  {(['ARS', 'USD'] as const).map((curr) => {
                    const activeCurr = currency === curr
                    return (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setCurrency(curr)}
                        title={
                          curr === 'ARS'
                            ? t(
                                'linux_page.currency_ars_title',
                                'Ver precios en Pesos Argentinos (ARS)'
                              )
                            : t(
                                'linux_page.currency_usd_title',
                                'Ver precios en Dólares Estadounidenses (USD)'
                              )
                        }
                        className={`relative px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                          activeCurr
                            ? 'text-slate-950 dark:text-slate-950'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {activeCurr && (
                          <motion.span
                            layoutId="linux-dock-currency"
                            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                            className="absolute inset-0 rounded-lg bg-white dark:bg-emerald-400 border border-slate-300/80 dark:border-transparent shadow-2xs"
                          />
                        )}
                        <span className="relative z-10">
                          {curr === 'ARS'
                            ? t('linux_page.dock_currency_ars', '$ ARS')
                            : t('linux_page.dock_currency_usd', 'u$s')}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Botón compacto 1-clic de moneda en pantallas móviles estrechas */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setCurrency((c) => (c === 'ARS' ? 'USD' : 'ARS'))}
                  aria-label={t(
                    'linux_page.dock_currency_mobile_aria',
                    'Cambiar moneda entre ARS y USD'
                  )}
                  className="sm:hidden px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-300 dark:border-white/15 text-[10px] font-bold text-slate-900 dark:text-emerald-300 cursor-pointer"
                >
                  {currency === 'ARS'
                    ? t('linux_page.dock_currency_ars', '$ ARS')
                    : t('linux_page.dock_currency_usd', 'u$s')}
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <ContactSection />
        <Footer />
      </main>
    </div>
  )
}
