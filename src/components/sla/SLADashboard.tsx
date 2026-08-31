'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Clock,
  CheckCircle,
  Database,
  Zap,
  PhoneCall,
  Lock,
  MessageSquare,
} from 'lucide-react'
import { useActiveSLA } from '../../hooks/useSLA'
import { useTranslation } from 'react-i18next'

interface Props {
  tenantId: string
}

export default function SLADashboard({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { isLoading: slaLoading } = useActiveSLA(tenantId)

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

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>SLA 100% ACTIVO</span>
          </span>
        </div>
      </div>

      {/* SLA Guarantees Grid */}
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

      {/* Incident & Response Log */}
      <div className="pt-4 border-t border-[#1E2638]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
              Registro de Incidentes y Mantenimientos
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
            <span className="text-[#8C9BB0] font-mono text-[11px]">Completado diariamente</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#151B28] to-[#1C2438] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4361EE]/20 border border-[#4361EE]/40 flex items-center justify-center text-[#38BDF8] shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Línea de Urgencia & Soporte VIP</h4>
            <p className="text-xs text-[#8C9BB0] mt-0.5">
              Si experimentás cualquier problema técnico con tu web o sistema de turnos, comunicate
              directo.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Tengo%20una%20consulta%20de%20soporte%20SLA"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-bold transition-all shadow-sm shrink-0 w-fit"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contactar Soporte 24/7</span>
        </a>
      </div>
    </div>
  )
}
