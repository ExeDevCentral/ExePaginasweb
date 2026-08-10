export type InvoiceTipo = 'A' | 'B' | 'C' | 'ticket' | 'proforma'
export type InvoiceEstado = 'borrador' | 'emitida' | 'pagada' | 'vencida' | 'cancelada'

export interface InvoiceLineItem {
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
}

export interface Invoice {
  id: string
  tenant_id: string
  cliente_id: string
  numero: string
  tipo: InvoiceTipo
  estado: InvoiceEstado
  subtotal: number
  iva: number
  total: number
  moneda: string
  concepto: string
  detalles: InvoiceLineItem[]
  fecha_emision: string | null
  fecha_vencimiento: string | null
  fecha_pago: string | null
  pago_id: string | null
  afip_cae: string | null
  afip_vencimiento: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
