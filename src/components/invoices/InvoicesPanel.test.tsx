import { describe, it, expect } from 'vitest'
import type { Invoice } from '../../core/domain/entities/Invoice'
import {
  calculateInvoiceTotals,
  resolvePaymentState,
} from '../../core/domain/financial/financialEngine'

describe('Invoices Data & Panel Calculation Unit Tests', () => {
  it('procesa y filtra facturas por tenant correctamente', () => {
    const invoices: Invoice[] = [
      {
        id: 'inv-1',
        tenant_id: 'tenant-123',
        cliente_id: 'c-1',
        numero: 'INV-2026-001',
        tipo: 'A',
        concepto: 'Suscripción Plan Avanzado',
        subtotal: 100,
        iva: 21,
        total: 121,
        moneda: 'ARS',
        estado: 'pagada',
        detalles: [],
        fecha_emision: '2026-08-01T00:00:00Z',
        fecha_vencimiento: null,
        fecha_pago: '2026-08-01T00:00:00Z',
        pago_id: null,
        afip_cae: null,
        afip_vencimiento: null,
        metadata: {},
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
      },
      {
        id: 'inv-2',
        tenant_id: 'tenant-123',
        cliente_id: 'c-1',
        numero: 'INV-2026-002',
        tipo: 'B',
        concepto: 'Mantenimiento Mensual',
        subtotal: 200,
        iva: 0,
        total: 200,
        moneda: 'ARS',
        estado: 'emitida',
        detalles: [],
        fecha_emision: '2026-08-02T00:00:00Z',
        fecha_vencimiento: null,
        fecha_pago: null,
        pago_id: null,
        afip_cae: null,
        afip_vencimiento: null,
        metadata: {},
        created_at: '2026-08-02T00:00:00Z',
        updated_at: '2026-08-02T00:00:00Z',
      },
    ]

    const items = invoices.map((inv) => ({
      id: inv.id,
      monto: inv.total,
      estado: inv.estado,
      moneda: inv.moneda,
    }))

    const summary = calculateInvoiceTotals(items)

    expect(summary.totalPaid).toBe(121)
    expect(summary.totalPending).toBe(200)
    expect(summary.pendingCount).toBe(1)
    expect(summary.paidCount).toBe(1)
  })

  it('mapea los estados de factura a la configuración visual de InvoicesPanel', () => {
    expect(resolvePaymentState('pagada')).toBe('pagada')
    expect(resolvePaymentState('emitida')).toBe('pendiente')
    expect(resolvePaymentState('vencida')).toBe('vencida')
  })
})
