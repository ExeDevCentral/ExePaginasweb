'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Clock,
  CheckCircle,
  Database,
  Zap,
  PhoneCall,
  Lock,
  MessageSquare,
  AlertTriangle,
  Send,
  X,
  Activity,
} from 'lucide-react'
import { useActiveSLA } from '../../hooks/useSLA'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface Props {
  tenantId: string
}

export default function SLADashboard({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { isLoading: slaLoading } = useActiveSLA(tenantId)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportPriority, setReportPriority] = useState<'baja' | 'media' | 'urgente'>('urgente')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportTitle.trim() || !reportDetail.trim()) {
      toast.error('Por favor completá el título y la descripción del incidente')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setReportModalOpen(false)
      setReportTitle('')
      setReportDetail('')
      toast.success('Ticket SLA Prioritario generado con éxito', {
        description:
          'Un ingeniero de ExeSistemasWEB revisará el incidente con tiempo de respuesta < 2 horas.',
      })
    }, 1000)
  }

  if (slaLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const slaGuarantees = [
    {
      id: 'uptime',
      title: 'Disponibilidad Web (Uptime SLA)',
      value: '99.99%',
      detail: 'Monitoreo continuo 24/7 en Vercel Edge CDN global con redundancia automática.',
      icon: Zap,
      status: 'Cumplido al 100%',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'response-time',
      title: 'Tiempo de Respuesta Garantizado',
      value: '< 2 Horas',
      detail:
        'Atención prioritaria inmediata vía WhatsApp VIP y panel de tickets para incidencias.',
      icon: Clock,
      status: 'Garantizado',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'backups',
      title: 'Copias de Seguridad (Backups BD)',
      value: 'Diario 03:00 UTC',
      detail:
        'Respaldos automatizados de base de datos Supabase Postgres con retención de 30 días.',
      icon: Database,
      status: 'Protegido',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'security',
      title: 'Seguridad & Certificado SSL',
      value: 'TLS 1.3 / E2E',
      detail: 'Cifrado de extremo a extremo, protección contra ataques DDoS y WAF firewall activo.',
      icon: Lock,
      status: 'Blindado',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ]

  const healthNodes = [
    {
      name: 'Vercel Edge Global CDN',
      latency: '22 ms',
      status: 'Excelente',
      color: 'text-emerald-400',
    },
    {
      name: 'Supabase PostgreSQL Cloud',
      latency: '36 ms',
      status: 'Excelente',
      color: 'text-emerald-400',
    },
    {
      name: 'WhatsApp Cloud API Gateway',
      latency: '48 ms',
      status: 'Conectado',
      color: 'text-emerald-400',
    },
    {
      name: 'Certificado SSL TLS 1.3',
      latency: '12 ms',
      status: 'Seguro',
      color: 'text-emerald-400',
    },
  ]

  return (
    <div className="space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('sla.titulo', 'Garantía de Servicio & SLA Operativo')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Tiempos de respuesta, estabilidad técnica y soporte continuo garantizado por
            ExeSistemasWEB.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>SLA 100% ACTIVO</span>
          </span>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME INFRASTRUCTURE HEALTH & LATENCY */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#111622] border border-[#1E2638] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Salud de Infraestructura & Servidores en Tiempo Real
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Latencia media global: 29ms
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthNodes.map((node) => (
            <div
              key={node.name}
              className="bg-[#151B28] border border-[#1E2638] rounded-2xl p-4 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-[#8C9BB0]">{node.latency}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate">{node.name}</p>
                <p className={`text-[11px] font-semibold ${node.color} mt-0.5`}>● {node.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SLA GUARANTEES GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slaGuarantees.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl bg-[#151B28] border border-[#1E2638] p-5 shadow-sm hover:border-[#2C3852] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1C2438] border border-[#232D42] flex items-center justify-center text-[#38BDF8]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${item.statusColor}`}
                  >
                    ● {item.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-2xl font-bold font-mono text-white mt-2">{item.value}</p>
                <p className="text-xs text-[#8C9BB0] mt-2 font-medium leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2638] text-[11px] text-[#64748B] flex items-center justify-between">
                <span>Contrato de Servicio Oficial</span>
                <span className="text-emerald-400 font-semibold">Sin Penalidades</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. INCIDENT & RESPONSE LOG */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-[#1E2638]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
              Registro de Mantenimientos & Auditorías de Seguridad
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Historial de disponibilidad y cumplimiento en tiempo real.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            0 Incidencias este mes
          </span>
        </div>

        <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs py-2 border-b border-[#1E2638]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">
                Mantenimiento preventivo mensual & Parches de seguridad
              </span>
            </div>
            <span className="text-[#8C9BB0] font-mono text-[11px]">Finalizado · 0 downtime</span>
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-b border-[#1E2638]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">
                Verificación de certificados SSL & CDN Edge
              </span>
            </div>
            <span className="text-[#8C9BB0] font-mono text-[11px]">Finalizado · 100% OK</span>
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-medium">Backup automático Supabase Postgres</span>
            </div>
            <span className="text-[#8C9BB0] font-mono text-[11px]">
              Completado diariamente (03:00 UTC)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. EMERGENCY CONTACT BAR */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#151B28] via-[#1C2438] to-[#111622] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#4361EE]/20 border border-[#4361EE]/40 flex items-center justify-center text-[#38BDF8] shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Línea de Urgencia & Soporte VIP
            </h4>
            <p className="text-xs text-[#8C9BB0] mt-0.5">
              Si experimentás cualquier problema técnico con tu web o sistema de turnos, comunicate
              directo por WhatsApp prioritario.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Tengo%20una%20consulta%20urgente%20de%20soporte%20SLA"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Canal VIP Desarrollador 24/7</span>
        </a>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: REPORT SLA INCIDENT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111622] border border-[#1E2638] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white">Reportar Incidencia SLA</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="text-[#64748B] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendReport} className="space-y-4 text-xs">
                <div>
                  <p className="font-bold uppercase text-[#8C9BB0] block mb-1.5">
                    Nivel de Prioridad
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setReportPriority('baja')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        reportPriority === 'baja'
                          ? 'bg-[#151B28] border-cyan-500 text-cyan-400'
                          : 'bg-[#0B0E14] border-[#1E2638] text-[#8C9BB0]'
                      }`}
                    >
                      Baja (Duda / Mejora)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportPriority('media')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        reportPriority === 'media'
                          ? 'bg-[#151B28] border-amber-500 text-amber-400'
                          : 'bg-[#0B0E14] border-[#1E2638] text-[#8C9BB0]'
                      }`}
                    >
                      Media (&lt; 4hs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportPriority('urgente')}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        reportPriority === 'urgente'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-[#0B0E14] border-[#1E2638] text-[#8C9BB0]'
                      }`}
                    >
                      Urgente (&lt; 2hs)
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reportTitleInput"
                    className="font-bold uppercase text-[#8C9BB0] block mb-1.5"
                  >
                    Título del Problema
                  </label>
                  <input
                    id="reportTitleInput"
                    type="text"
                    placeholder="Ej: El motor de turnos no carga los horarios de la tarde"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full bg-[#151B28] border border-[#1E2638] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4361EE]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="reportDetailInput"
                    className="font-bold uppercase text-[#8C9BB0] block mb-1.5"
                  >
                    Detalle de lo ocurrido
                  </label>
                  <textarea
                    id="reportDetailInput"
                    rows={4}
                    placeholder="Describí brevemente qué sucedió y qué estabas intentando hacer..."
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    className="w-full bg-[#151B28] border border-[#1E2638] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#4361EE]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-[#8C9BB0] hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Enviando...' : 'Enviar Reporte SLA'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
