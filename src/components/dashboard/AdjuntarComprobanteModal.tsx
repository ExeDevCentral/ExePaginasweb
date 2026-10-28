/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Upload,
  CheckCircle2,
  FileText,
  Building,
  Hash,
  Loader2,
  MessageCircle,
} from 'lucide-react'
import { useAuthSession } from '../../core/auth/AuthSessionProvider'
import type { Pago } from '../../hooks/useDashboard'
import HudButton from '../HudButton'

interface AdjuntarComprobanteModalProps {
  open: boolean
  onClose: () => void
  pagos?: Pago[]
  onSuccess?: (() => void) | undefined
}

export default function AdjuntarComprobanteModal({
  open,
  onClose,
  pagos = [],
  onSuccess,
}: Readonly<AdjuntarComprobanteModalProps>) {
  const { session } = useAuthSession()
  const [selectedPagoId, setSelectedPagoId] = useState<string>(() => pagos[0]?.id || '')
  const [numeroOperacion, setNumeroOperacion] = useState('')
  const [bancoOrigen, setBancoOrigen] = useState('')
  const [notas, setNotas] = useState('')
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const pendingPagos = pagos.filter((p) => p.estado === 'pendiente')
  const availablePagos = pendingPagos.length > 0 ? pendingPagos : pagos
  const currentPago = availablePagos.find((p) => p.id === selectedPagoId) || availablePagos[0]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no debe superar los 10MB.')
        return
      }
      setError('')
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.access_token) {
      setError('Debes iniciar sesión para adjuntar tu comprobante.')
      return
    }

    if (!numeroOperacion.trim() && !fileName.trim()) {
      setError('Ingresá el número de operación o seleccioná un comprobante.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const resp = await fetch('/api/submit-comprobante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          pagoId: currentPago?.id || null,
          numeroOperacion: numeroOperacion.trim() || null,
          bancoOrigen: bancoOrigen.trim() || null,
          notas: notas.trim() || null,
          fileName: fileName.trim() || null,
        }),
      })

      const data = (await resp.json().catch(() => ({}))) as { error?: string }
      if (!resp.ok) {
        setError(data?.error || 'No se pudo registrar el comprobante.')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      console.error('Error submitting comprobante:', err)
      setError('Error de conexión al enviar el comprobante.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsAppNotify = () => {
    const planName = currentPago?.plan_nombre || 'Abono'
    const ref = numeroOperacion.trim() ? ` (Ref: ${numeroOperacion.trim()})` : ''
    const msg = `¡Hola Exequiel! Ya adjunté el comprobante para ${planName}${ref} desde el dashboard.`
    window.open(
      `https://wa.me/5493416874786?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Adjuntar Comprobante de Pago</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Subí tu comprobante para acelerar la verificación y activación
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  ¡Comprobante recibido con éxito!
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Tu comprobante ha sido registrado y asociado a tu cuenta. El equipo revisará y
                  activará el servicio a la brevedad.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
                <HudButton
                  type="button"
                  variant="primary"
                  className="w-full justify-center"
                  onClick={onClose}
                >
                  Entendido
                </HudButton>
                <button
                  type="button"
                  onClick={handleWhatsAppNotify}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Avisar por WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {availablePagos.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Seleccionar Abono / Pago
                  </label>
                  <select
                    value={selectedPagoId}
                    onChange={(e) => setSelectedPagoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    {availablePagos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.plan_nombre || 'Abono'} — ${p.monto} {p.moneda} ({p.estado})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentPago && (
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">
                      {currentPago.plan_nombre || 'Abono de Servicios'}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Estado: {currentPago.estado}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#38BDF8]">
                    ${currentPago.monto} {currentPago.moneda}
                  </span>
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Archivo del comprobante (Captura o PDF)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border hover:border-primary rounded-2xl bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-1.5" />
                  <span className="text-xs font-medium text-foreground">
                    {fileName ? fileName : 'Hacé clic para seleccionar o arrastrá el archivo'}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    JPG, PNG o PDF hasta 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Número de comprobante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="num-operacion"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <Hash className="w-3.5 h-3.5" />
                    Nº de Operación / Ref
                  </label>
                  <input
                    id="num-operacion"
                    type="text"
                    value={numeroOperacion}
                    onChange={(e) => setNumeroOperacion(e.target.value)}
                    placeholder="Ej: 19823482"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="banco-origen"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <Building className="w-3.5 h-3.5" />
                    Banco o Billetera
                  </label>
                  <input
                    id="banco-origen"
                    type="text"
                    value={bancoOrigen}
                    onChange={(e) => setBancoOrigen(e.target.value)}
                    placeholder="Ej: Personal Pay, MP, Galicia"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Notas opcionales */}
              <div className="space-y-1">
                <label
                  htmlFor="comprobante-notas"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Comentarios adicionales
                </label>
                <textarea
                  id="comprobante-notas"
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalles sobre el titular de la cuenta o aclaraciones..."
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <HudButton
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  icon={
                    submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {submitting ? 'Enviando...' : 'Adjuntar Comprobante'}
                </HudButton>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
