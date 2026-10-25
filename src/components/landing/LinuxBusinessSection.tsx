/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * LinuxBusinessSection:
 * Terminal / Workbench de Ingeniería Linux (Zero-Card Layout) diseñada tanto para
 * dueños de negocio como para Arquitectos de Software, Ingenieros en Sistemas y Analistas IT.
 * Estética inspirada en un entorno Linux real (tmux / htop / systemd / man-page) sin repetir
 * las tarjetas del resto de la web, y 100% reactiva a los 7 idiomas (ES, EN, DE, ZH-CN, PT-BR, FR, AR).
 */
'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Terminal,
  HardDrive,
  ShieldCheck,
  Cpu,
  WifiOff,
  Lock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Code2,
  Layers,
  Calculator,
} from 'lucide-react'
import HudButton from '@/components/HudButton'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

type OsComparisonMode = 'linux' | 'windows'
type ProfileId = 'caja-pos' | 'reciclaje-pc' | 'servidor-local'
type SpecDepthMode = 'executive' | 'architect'

export default function LinuxBusinessSection() {
  const { t } = useTranslation()
  const [osMode, setOsMode] = useState<OsComparisonMode>('linux')
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>('caja-pos')
  const [specDepth, setSpecDepth] = useState<SpecDepthMode>('architect')

  const profiles = useMemo(
    () => [
      {
        id: 'caja-pos' as const,
        code: '01',
        tty: 'tty1:pos-kiosk',
        badge: t('linux_pos.tab_1_badge', 'TERMINAL POS QUIOSCO'),
        title: t(
          'linux_pos.tab_1_title',
          'Estación de Punto de Venta Inmutable (Wayland / X11 Kiosk)'
        ),
        subtitle: t(
          'linux_pos.tab_1_sub',
          'Para cajas gastronómicas, retail, farmacias y mostradores de alta rotación'
        ),
        problem: t(
          'linux_pos.tab_1_problem',
          'En hora pico el sistema operativo actualiza en segundo plano, el navegador colapsa la RAM o el operador altera la configuración de impresoras térmicas y puertos COM/USB.'
        ),
        solution: t(
          'linux_pos.tab_1_solution',
          'Sesión gráfica dedicada sin entorno de escritorio distractivo: bootea en 4.5s directo al cliente POS/KDS. Reglas udev fijas para impresoras ESC/POS y lectores de códigos.'
        ),
        specs: t(
          'linux_pos.tab_1_specs',
          'Arranque en 4.5s vía systemd-boot + dracut|Reglas udev estáticas para periféricos ESC/POS y balanzas|Usuario sin privilegios (nopasswd acotado) y FS protegido|Rollback instantáneo con Timeshift RSYNC + llave USB'
        ).split('|'),
        archStack: t(
          'linux_pos.tab_1_arch_stack',
          'Kernel: linux-lts + zram-generator | Display: Cage / Chromium Kiosk --kiosk --noerrdialogs | Periféricos: CUPS / udev rules persistentes (/dev/ttyUSB0 fijo) | Seguridad: nftables drop-by-default + AppArmor.'
        ),
        cliSnippet: [
          '# /etc/udev/rules.d/99-escpos-thermal.rules',
          'SUBSYSTEM=="usb", ATTR{idVendor}=="04b8", MODE="0660", GROUP="lp", SYMLINK+="escpos0"',
          '# systemd unit: exe-pos-kiosk.service (Restart=always, WatchdogSec=5s)',
          'ExecStart=/usr/bin/cage -s -- chromium --kiosk --app=https://pos.local',
        ],
        savings: t(
          'linux_pos.tab_1_savings',
          '$0 en licencias perpetuas de OS y antivirus corporativo'
        ),
        whatsappPrompt: t(
          'linux_pos.tab_1_wa',
          '¡Hola Exequiel! Quiero consultar por la implementación de Terminales Linux POS / Modo Quiosco para mi negocio o proyecto.'
        ),
      },
      {
        id: 'reciclaje-pc' as const,
        code: '02',
        tty: 'tty2:x86-fleet',
        badge: t('linux_pos.tab_2_badge', 'RESCATE HARDWARE x86'),
        title: t(
          'linux_pos.tab_2_title',
          'Reacondicionamiento de Flota PC para Oficinas y Consultorios'
        ),
        subtitle: t(
          'linux_pos.tab_2_sub',
          'Extensión de vida útil (CAPEX $0) para parques informáticos con CPUs Intel/AMD previos'
        ),
        problem: t(
          'linux_pos.tab_2_problem',
          'Presupuestos millonarios para descartar PCs funcionales solo porque no cumplen los requisitos artificiales de TPM 2.0 o RAM de Windows 11.'
        ),
        solution: t(
          'linux_pos.tab_2_solution',
          'Migración transparente de toda la flota actual a estaciones Linux empresariales optimizadas: 4x más velocidad de respuesta en ERP web, planillas, PDF, firma digital y WhatsApp.'
        ),
        specs: t(
          'linux_pos.tab_2_specs',
          'Reutilización del 100% del parque de PCs y notebooks actuales|Inmunidad nativa contra ransomware y malware binario (.exe/.msi)|Automatización de backups incrementales (rsync / Borg)|Administración remota vía SSH con claves Ed25519'
        ).split('|'),
        archStack: t(
          'linux_pos.tab_2_arch_stack',
          'Gestión de paquetes: pacman / Flatpak sandboxed | Compresión en RAM: zstd zram | Sistema de archivos: ext4 (noatime) / Btrfs con snapshots | Telemetría: node_exporter / systemd-journald persistente.'
        ),
        cliSnippet: [
          '# /etc/systemd/zram-generator.conf — Compresión zstd en RAM',
          '[zram0] zram-size = ram / 2 | compression-algorithm = zstd',
          '# Snapshot automático previo a cada actualización de paquetes',
          'timeshift --create --comments "Pre-Update Hook" --scripted',
        ],
        savings: t(
          'linux_pos.tab_2_savings',
          'Ahorro del 100% en CAPEX de recambio de computadoras'
        ),
        whatsappPrompt: t(
          'linux_pos.tab_2_wa',
          '¡Hola Exequiel! Quiero evaluar la migración y optimización de nuestra flota de PCs a estaciones Linux empresariales.'
        ),
      },
      {
        id: 'servidor-local' as const,
        code: '03',
        tty: 'tty3:edge-node',
        badge: t('linux_pos.tab_3_badge', 'NODO EDGE OFFLINE-FIRST'),
        title: t(
          'linux_pos.tab_3_title',
          'Servidor Local de Misión Crítica + Sincronización Cloud'
        ),
        subtitle: t(
          'linux_pos.tab_3_sub',
          'Arquitectura híbrida para negocios e ingenieros que exigen 0% downtime ante cortes de fibra'
        ),
        problem: t(
          'linux_pos.tab_3_problem',
          'Cuando se corta el enlace del ISP un viernes a la noche, un SaaS exclusivamente en la nube deja al local ciego: sin comandas de cocina, sin stock y sin arqueo de caja.'
        ),
        solution: t(
          'linux_pos.tab_3_solution',
          'Desplegamos un micro-servidor Linux on-premise en la LAN del comercio (< 0.3ms de latencia) con PostgreSQL local y cola de eventos idempotente que replica a Supabase/Cloud al volver la red.'
        ),
        specs: t(
          'linux_pos.tab_3_specs',
          'Continuidad operativa 100% offline en red local (LAN)|PostgreSQL 15+ local con replicación y colas transaccionales|Backups cifrados SHA-256 horarios en disco y USB externo|Túnel WireGuard / Tailscale para auditoría de arquitectura'
        ).split('|'),
        archStack: t(
          'linux_pos.tab_3_arch_stack',
          'Runtime: Docker / Podman rootless + systemd units | DB: PostgreSQL 15 (WAL archiving) + Redis local | Red: Nginx reverse proxy con TLS local + mDNS (Avahi) | Sync: Outbox pattern con reintentos exponenciales.'
        ),
        cliSnippet: [
          '# Réplica local PostgreSQL + Outbox Sync Worker hacia Supabase Cloud',
          'pg_isready -h 127.0.0.1 -p 5432 && systemctl status exe-outbox-sync.service',
          '# Latencia en red local (LAN) ante caída total de fibra óptica:',
          '64 bytes from 192.168.1.10 (pos-server.local): icmp_seq=1 ttl=64 time=0.19 ms',
        ],
        savings: t(
          'linux_pos.tab_3_savings',
          'Cero lucro cesante por caídas de internet o proveedores cloud'
        ),
        whatsappPrompt: t(
          'linux_pos.tab_3_wa',
          '¡Hola Exequiel! Soy arquitecto/analista o dueño de negocio y quiero implementar un nodo servidor Linux local Offline-First.'
        ),
      },
    ],
    [t]
  )

  const activeProfile = profiles.find((p) => p.id === selectedProfile) ?? profiles[0]!

  return (
    <section
      id="sistemas-linux"
      data-linux-business="true"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-24 border-t border-slate-200/80 dark:border-white/10"
    >
      {/* Cabecera Editorial Sobria y Técnica */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] uppercase tracking-widest font-bold mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>
            {t(
              'linux_pos.eyebrow',
              'INFRAESTRUCTURA LINUX // TERMINALES POS, WORKSTATIONS & NODOS LOCALES'
            )}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
          {t('linux_pos.title_1', 'Infraestructura Linux y Terminales Dedicadas')}{' '}
          <span className="font-serif italic font-normal text-emerald-600 dark:text-emerald-400 block sm:inline">
            {t('linux_pos.title_2', 'para puntos de venta y equipos de ingeniería')}
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t(
            'linux_pos.subtitle',
            'Configuramos estaciones de trabajo, terminales en modo quiosco y servidores locales sobre tu hardware x86_64 actual. Arranque con systemd-boot, aislamiento de procesos, base de datos local con sincronización asíncrona y recuperación en vivo por USB.'
          )}
        </p>
      </div>

      {/* =======================================================================
          ENTORNO LINUX WORKBENCH (TMUX / HTOP / SYSTEMD MAN-PAGE)
          Cero repetición de cards: Una única ventana de terminal dividida en paneles
         ======================================================================= */}
      <div className="rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-[#05080f] text-slate-100 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden font-mono">
        {/* 1. BARRA SUPERIOR TMUX / TTY CON TABS DE MÓDULO Y SELECTOR DE PROFUNDIDAD */}
        <div className="px-3 sm:px-5 py-2.5 bg-[#0a101d] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </span>
            <span className="text-emerald-400 font-bold truncate text-[11px]">
              {t(
                'linux_pos.session_hdr',
                'tty1 — root@exe-pos-node:~ (Linux 6.12-LTS x86_64 · systemd 256)'
              )}
            </span>
          </div>

          {/* Switch de nivel técnico: Vista Gerencial / ROI vs Especificación Arquitectos & Ing. Sistemas */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded border border-white/10 text-[10px]">
            <button
              type="button"
              onClick={() => setSpecDepth('architect')}
              className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                specDepth === 'architect'
                  ? 'bg-cyan-500 text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>{t('linux_pos.view_architect', '[02: ARQUITECTURA & STACK]')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpecDepth('executive')}
              className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                specDepth === 'executive'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{t('linux_pos.view_executive', '[01: OPERACIÓN & COSTOS]')}</span>
            </button>
          </div>
        </div>

        {/* 2. BARRA DE VENTANAS TMUX (SELECCIÓN DE LOS 3 ESCENARIOS DE INGENIERÍA) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-white/10 bg-[#070b14] divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs">
          {profiles.map((prof) => {
            const isSelected = prof.id === selectedProfile
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSelectedProfile(prof.id)}
                className={`px-4 py-3 text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-500/12 text-emerald-300 border-b-2 border-b-emerald-400 font-bold'
                    : 'text-slate-400 hover:bg-white/3 hover:text-slate-200'
                }`}
              >
                <span className="truncate">
                  [{prof.code}] {prof.badge}
                </span>
                <span className="text-[10px] opacity-60 ml-2 shrink-0">{prof.tty}</span>
              </button>
            )
          })}
        </div>

        {/* 3. PANEL PRINCIPAL DIVIDIDO (HTOP TELEMETRY A LA IZQUIERDA | ESPECIFICACIÓN TÉCNICA A LA DERECHA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Panel Izquierdo: Monitor estilo htop / systemd-analyze (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#03060c] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 mb-4 border-b border-white/10">
                <span className="text-cyan-400 font-bold">
                  {t(
                    'linux_pos.bench_header',
                    'TELEMETRÍA DE PROCESOS (htop) // MISMO NODO (8GB DDR4 · NVMe)'
                  )}
                </span>
              </div>

              {/* Selector de Kernel / OS */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded bg-white/5 border border-white/10 mb-6 text-[11px]">
                <button
                  type="button"
                  onClick={() => setOsMode('linux')}
                  className={`py-2 px-2 rounded-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    osMode === 'linux'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="truncate">
                    {t('linux_pos.mode_linux', 'LINUX POS (KERNEL LTS)')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOsMode('windows')}
                  className={`py-2 px-2 rounded-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    osMode === 'windows'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <span className="truncate">
                    {t('linux_pos.mode_win', 'OS COMERCIAL ESTÁNDAR')}
                  </span>
                </button>
              </div>

              {/* Barras estilo htop ASCII / progreso técnico */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">
                      MEM[||] {t('linux_pos.metric_ram', 'Huella de memoria en reposo (RSS)')}
                    </span>
                    <span
                      className={`font-bold ${
                        osMode === 'linux' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {osMode === 'linux'
                        ? t('linux_pos.metric_ram_linux', '480 MB / 8192 MB (5.8%)')
                        : t('linux_pos.metric_ram_win', '4310 MB / 8192 MB (52.6%)')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        osMode === 'linux' ? 'w-[7%] bg-emerald-400' : 'w-[54%] bg-rose-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">
                      BOOT[|] {t('linux_pos.metric_boot', 'Cold Boot → Socket POS activo')}
                    </span>
                    <span
                      className={`font-bold ${
                        osMode === 'linux' ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {osMode === 'linux'
                        ? t('linux_pos.metric_boot_linux', '4.5s (systemd-analyze)')
                        : t('linux_pos.metric_boot_win', '48s – 90s (I/O bloqueante)')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        osMode === 'linux' ? 'w-[9%] bg-cyan-400' : 'w-[82%] bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">
                      IRQ[0] {t('linux_pos.metric_upd', 'Interrupciones por actualización')}
                    </span>
                    <span
                      className={`font-bold ${
                        osMode === 'linux' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {osMode === 'linux'
                        ? t('linux_pos.metric_upd_linux', '0 (Ventana atómica programada)')
                        : t('linux_pos.metric_upd_win', 'Reinicios forzados / CPU throttling')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        osMode === 'linux' ? 'w-[2%] bg-emerald-400' : 'w-[90%] bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Bloque de comandos / Reglas reales de Ingeniería (Visible en modo Arquitecto) */}
              {specDepth === 'architect' && (
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2">
                    $ cat /etc/exe-architecture/{activeProfile.id}.conf
                  </div>
                  <pre className="p-3 rounded bg-black/80 border border-white/10 text-[11px] text-emerald-300/90 overflow-x-auto leading-relaxed">
                    {activeProfile.cliSnippet.join('\n')}
                  </pre>
                </div>
              )}
            </div>

            {/* Estado del Demonio / Kernel */}
            <div className="mt-5 pt-4 border-t border-white/10 text-xs">
              {osMode === 'linux' ? (
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {t(
                        'linux_pos.status_linux_title',
                        'STATUS: NODO DETERMINISTA ACTIVO (UPTIME 99.98%)'
                      )}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                    {t(
                      'linux_pos.status_linux_desc',
                      'Sin demonios de telemetría comercial ni antivirus consumiendo IOPS. Incluye imagen de recuperación en vivo (Ventoy + arch-chroot / Timeshift) en USB.'
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-400">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {t(
                        'linux_pos.status_win_title',
                        'WARN: DEGRADACIÓN DE I/O Y SUPERFICIE DE ATAQUE .EXE'
                      )}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                    {t(
                      'linux_pos.status_win_desc',
                      'Más del 50% de la RAM se pierde en servicios de fondo. Cualquier binario .exe ejecutado desde correo o USB compromete la facturación.'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Hoja de Especificación de Sistemas (7 cols, estilo Man-Page / ADR Técnico) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white dark:bg-[#070c18] text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between">
            <motion.div
              key={activeProfile.id + '-' + specDepth}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <span>
                    SECTION {activeProfile.code} // {activeProfile.badge}
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400">ARCH: x86_64</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950 dark:text-white mt-1">
                  {activeProfile.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeProfile.subtitle}
                </p>
              </div>

              {/* Diagnóstico vs Arquitectura en 2 columnas editoriales (sin encerrar en cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-1">
                <div className="border-l-2 border-rose-500/80 pl-3.5">
                  <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">
                    {t('linux_pos.label_problem', '✗ CUELLO DE BOTELLA OPERATIVO')}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeProfile.problem}
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3.5">
                  <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
                    {t('linux_pos.label_solution', '✓ IMPLEMENTACIÓN TÉCNICA')}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {activeProfile.solution}
                  </p>
                </div>
              </div>

              {/* Bloque de Arquitectura de Sistema */}
              {specDepth === 'architect' && (
                <div className="p-3.5 rounded bg-slate-100 dark:bg-cyan-950/20 border-l-2 border-cyan-500 font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block mb-1">
                    {t(
                      'linux_pos.label_arch_spec',
                      'ARQUITECTURA DE SISTEMA Y CONFIGURACIÓN BASE:'
                    )}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {activeProfile.archStack}
                  </p>
                </div>
              )}

              {/* Parámetros de Entrega y Auditoría */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2.5">
                  {t('linux_pos.label_deliverables', 'CRITERIOS DE ENTREGA Y AUDITORÍA:')}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {activeProfile.specs.map((spec) => (
                    <div
                      key={spec}
                      className="flex items-start gap-2 text-xs font-mono text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Pie del panel derecho: Impacto TCO/CAPEX y CTA directo */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                    {t('linux_pos.label_impact', 'IMPACTO FINANCIERO (TCO / CAPEX)')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                    {activeProfile.savings}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <HudButton
                  label={t('linux_pos.cta_quote', 'Cotizar en línea')}
                  href={
                    activeProfile.id === 'servidor-local'
                      ? '/cotizador?type=edge-server'
                      : '/cotizador?type=linux-pos'
                  }
                  variant="secondary"
                  size="sm"
                  icon={<Calculator className="w-4 h-4" />}
                />
                <HudButton
                  label={t('linux_pos.cta_consult', 'Solicitar especificación o despliegue')}
                  href={getWhatsAppUrl(activeProfile.whatsappPrompt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  icon={<MessageCircle className="w-4 h-4" />}
                  onClick={() =>
                    trackEvent('contact_whatsapp_clicked', {
                      source: `linux_business_${activeProfile.id}`,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. BARRA DE ESTADO INFERIOR (STATUS BAR TMUX) CON LAS 3 GARANTÍAS DE INGENIERÍA */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#04070e] border-t border-white/10 text-xs font-sans">
          <div className="p-4 flex items-start gap-3">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono text-white text-[11px] block">
                {t('linux_pos.strip_1_title', '1. Live USB de Recuperación (Ventoy + Chroot)')}
              </strong>
              <span className="text-slate-400 text-[11px] leading-snug block mt-0.5">
                {t(
                  'linux_pos.strip_1_desc',
                  'Entregamos un pendrive físico booteable con tus paquetes, fstab, scripts y restauración automática en 3 minutos.'
                )}
              </span>
            </div>
          </div>

          <div className="p-4 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono text-white text-[11px] block">
                {t('linux_pos.strip_2_title', '2. Entorno Determinista & Sin Lock-in')}
              </strong>
              <span className="text-slate-400 text-[11px] leading-snug block mt-0.5">
                {t(
                  'linux_pos.strip_2_desc',
                  'Documentación técnica completa, scripts bash auditables y control root 100% transferido a tu equipo IT o negocio.'
                )}
              </span>
            </div>
          </div>

          <div className="p-4 flex items-start gap-3">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono text-white text-[11px] block">
                {t('linux_pos.strip_3_title', '3. Integración Vertical Software + Metal')}
              </strong>
              <span className="text-slate-400 text-[11px] leading-snug block mt-0.5">
                {t(
                  'linux_pos.strip_3_desc',
                  'Diseñamos el sistema web/SaaS y aprovisionamos el sistema operativo base para garantizar latencia sub-milisegundo.'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
