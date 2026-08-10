import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler from '../../api/paypal-webhook.js'
import {
  paymentConfirmation,
  paymentNotification,
  renewalNotice,
  invoiceReceipt,
  emailVerification,
  slaBreachAlert,
  aiDiagnosticAutoReply,
} from '../../lib/email/templates.js'
import {
  calculateInvoiceTotals,
  calculateTenantMRR,
  formatCurrency,
  resolvePaymentState,
  calculateDiscount,
} from '../../src/core/domain/financial/financialEngine'

// Mock de dependencias externas (Supabase y Resend Email)
const mockSupabaseInstance = {
  from: vi.fn(),
  auth: {
    admin: {
      listUsers: vi.fn(),
    },
  },
  rpc: vi.fn(),
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseInstance),
}))

vi.mock('../../lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'msg_test_123' }),
  ADMIN_EMAIL: 'admin@exepaginasweb.com',
}))

function setupSupabaseMock() {
  mockSupabaseInstance.auth.admin.listUsers = vi.fn().mockResolvedValue({
    data: { users: [{ id: 'auth_user_777', email: 'nuevo.cliente@empresa.com' }] },
    error: null,
  })
  mockSupabaseInstance.rpc = vi.fn().mockResolvedValue({ data: 'INV-2026-0001', error: null })

  mockSupabaseInstance.from = vi.fn().mockImplementation((tabla) => {
    return {
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({
            data:
              tabla === 'planes'
                ? [{ id: 'plan_pro_01', slug: 'mantenimiento-pro', nombre: 'Plan Pro' }]
                : tabla === 'pagos'
                  ? [{ cliente_id: 'cli_refund_1' }]
                  : [],
          }),
        })),
        ilike: vi.fn().mockImplementation(() => ({
          limit: vi.fn().mockResolvedValue({
            data: [{ id: 'plan_pro_01', slug: 'mantenimiento-pro', nombre: 'Plan Pro' }],
          }),
        })),
        single: vi.fn().mockResolvedValue({ data: { id: `${tabla}_id_123` }, error: null }),
      })),
      insert: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: `${tabla}_id_123` }, error: null }),
        })),
      })),
      update: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
    }
  })
}

describe('🛡️ SUITE DE PRUEBAS RIGUROSA: Clientes, Tokens, Lista de Pagos, Mensualidades y Recordatorios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.PAYPAL_WEBHOOK_ID = 'wh_mock_id_12345'
    process.env.PAYPAL_CLIENT_ID = 'paypal_client_mock'
    process.env.PAYPAL_CLIENT_SECRET = 'paypal_secret_mock'
    process.env.VITE_SUPABASE_URL = 'https://mock.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_key'
    setupSupabaseMock()
  })

  // ==========================================
  // BLOQUE 1: CREACIÓN DE CLIENTES Y TENANTS
  // ==========================================
  describe('1. 👤 Creación de Clientes y Tenants', () => {
    it('debe crear un perfil de cliente e iniciar su tenant aislado cuando no existe previamente', async () => {
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/v1/oauth2/token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ access_token: 'mock_paypal_token' }),
          })
        }
        if (url.includes('/verify-webhook-signature')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ verification_status: 'SUCCESS' }),
          })
        }
        if (url.includes('/checkout/orders/')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              status: 'COMPLETED',
              id: 'PAYPAL_ORDER_999',
              payer: { email_address: 'nuevo.cliente@empresa.com', name: { given_name: 'Carlos' } },
              purchase_units: [
                {
                  custom_id: 'mantenimiento-pro|nuevo.cliente@empresa.com|saas',
                  amount: { value: '99.00' },
                  description: 'Plan Mantenimiento Pro',
                },
              ],
            }),
          })
        }
        return Promise.resolve({ ok: true, json: async () => ({}) })
      })

      const payload = JSON.stringify({
        event_type: 'CHECKOUT.ORDER.APPROVED',
        resource: { id: 'PAYPAL_ORDER_999' },
      })

      const req = {
        method: 'POST',
        headers: {
          'paypal-auth-algo': 'SHA256withRSA',
          'paypal-cert-url': 'https://api.paypal.com/v1/notifications/certs/cert.pem',
          'paypal-transmission-id': 'trans_123',
          'paypal-transmission-sig': 'sig_123',
          'paypal-transmission-time': '2026-08-10T15:00:00Z',
        },
        on: (event, cb) => {
          if (event === 'data') cb(Buffer.from(payload))
          if (event === 'end') cb()
        },
      }

      const res = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        end: vi.fn(),
      }

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('clientes')
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('tenants')
    })
  })

  // ==========================================
  // BLOQUE 2: USO DE DASHBOARD TOKENS
  // ==========================================
  describe('2. 🔑 Uso de Tokens del Dashboard', () => {
    it('debe generar la plantilla de correo de verificación de token con enlace y expirar en 24 horas', () => {
      const html = emailVerification({
        name: 'Ana Gómez',
        verificationUrl: 'https://exepaginasweb.com/dashboard?token=TK-889900',
        token: '889900',
      })

      expect(html).toContain('Ana Gómez')
      expect(html).toContain('889900')
      expect(html).toContain('https://exepaginasweb.com/dashboard?token=TK-889900')
      expect(html).toContain('Válido por 24 horas')
      expect(html).toContain('Verificación de Cuenta')
    })

    it('debe desinfectar y prevenir vulnerabilidades XSS en tokens y URLs de verificación', () => {
      const html = emailVerification({
        name: '<script>alert("xss")</script>',
        verificationUrl: 'https://exepaginasweb.com/dashboard?token="><script>evil()</script>',
        token: '<b>999</b>',
      })

      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('debe generar la plantilla hermosa, cálida y moderna de Diagnóstico con Inteligencia Artificial', () => {
      const html = aiDiagnosticAutoReply({
        name: 'Martín Palermo',
        message: 'Quiero un sistema de reservas y turnos con pasarela de pagos',
        ticketId: 'EXE-AI-99887',
        projectType: 'Sistema de Reservas',
        total: '$ 500.000',
        lang: 'es',
      })

      expect(html).toContain('Martín Palermo')
      expect(html).toContain('EXE-AI-99887')
      expect(html).toContain('DIAGNÓSTICO INTELIGENTE FINALIZADO')
      expect(html).toContain('Sistema de Reservas')
      expect(html).toContain('$ 500.000')
      expect(html).toContain('¿Querés mejorar o ajustar tu diagnóstico?')
      expect(html).toContain('https://wa.me/5493416874786')
    })
  })

  // ==========================================
  // BLOQUE 3: LISTA DE PAGOS Y MOTOR FINANCIERO
  // ==========================================
  describe('3. 📋 Lista de Pagos y Motor Financiero', () => {
    it('debe calcular los totales de facturas pagadas y pendientes correctamente', () => {
      const items = [
        { id: '1', monto: 150, estado: 'aprobado', moneda: 'USD' },
        { id: '2', monto: 200, estado: 'approved', moneda: 'USD' },
        { id: '3', monto: 50, estado: 'pendiente', moneda: 'USD' },
        { id: '4', monto: 80, estado: 'emitida', moneda: 'USD' },
        { id: '5', monto: 120, estado: 'cancelada', moneda: 'USD' },
      ]

      const totals = calculateInvoiceTotals(items, 'USD')

      expect(totals.totalPaid).toBe(350)
      expect(totals.paidCount).toBe(2)
      expect(totals.totalPending).toBe(130)
      expect(totals.pendingCount).toBe(2)
      expect(totals.currency).toBe('USD')
    })

    it('debe resolver estados de pago heterogéneos a una categoría estándar', () => {
      expect(resolvePaymentState('approved')).toBe('pagada')
      expect(resolvePaymentState('aprobado')).toBe('pagada')
      expect(resolvePaymentState('paid')).toBe('pagada')
      expect(resolvePaymentState('PENDIENTE')).toBe('pendiente')
      expect(resolvePaymentState('emitida')).toBe('pendiente')
      expect(resolvePaymentState('overdue')).toBe('vencida')
      expect(resolvePaymentState('vencida')).toBe('vencida')
      expect(resolvePaymentState('reembolsado')).toBe('cancelada')
    })

    it('debe formatear importes financieros en moneda ARS y USD adecuadamente', () => {
      const formattedUSD = formatCurrency(1250.5, 'USD', 'en-US')
      const formattedARS = formatCurrency(50000, 'ARS', 'es-AR')

      expect(formattedUSD).toContain('1,250.50')
      expect(formattedARS).toContain('50.000,00')
    })

    it('debe aplicar porcentajes de descuento de forma segura', () => {
      expect(calculateDiscount(100, 20)).toBe(80)
      expect(calculateDiscount(100, 0)).toBe(100)
      expect(calculateDiscount(100, 100)).toBe(0)
      expect(calculateDiscount(100, 150)).toBe(0)
    })
  })

  // ==========================================
  // BLOQUE 4: PAGO DE MENSUALIDADES Y SUSCRIPCIONES
  // ==========================================
  describe('4. 💳 Cobro de Mensualidades y Suscripciones Recurrentes', () => {
    it('debe calcular el Ingreso Mensual Recurrente (MRR) solo a partir de suscripciones activas', () => {
      const suscripciones = [
        { estado: 'activa', monto: 150 },
        { estado: 'active', monto: 300 },
        { estado: 'cancelada', monto: 150 },
        { estado: 'pendiente', monto: 90 },
      ]

      const mrr = calculateTenantMRR(suscripciones)
      expect(mrr).toBe(450) // 150 + 300
    })
  })

  // ==========================================
  // BLOQUE 5: RECORDATORIOS DE PAGO Y AVISOS DE RENOVACIÓN
  // ==========================================
  describe('5. 📅 Recordatorios de Pago y Avisos de Renovación', () => {
    it('debe generar el correo de aviso de renovación próxima con fecha y monto de servicio', () => {
      const html = renewalNotice({
        tenantName: 'Clínica Odontológica Central',
        serviceName: 'SaaS Mantenimiento Enterprise',
        price: 299.0,
        currency: 'USD',
        renewalDate: '2026-09-01',
        dashboardUrl: 'https://exepaginasweb.com/dashboard/services',
      })

      expect(html).toContain('Clínica Odontológica Central')
      expect(html).toContain('SaaS Mantenimiento Enterprise')
      expect(html).toContain('USD 299')
      expect(html).toContain('2026-09-01')
      expect(html).toContain('Renovación Automática')
      expect(html).toContain('Aviso de Renovación')
    })

    it('debe generar el recibo de factura electrónica con número de comprobante y CAE de AFIP', () => {
      const html = invoiceReceipt({
        tenantName: 'Estudio Jurídico Morales',
        invoiceNumber: '0001-00000042',
        invoiceType: 'B',
        amount: 85000,
        date: '10/08/2026',
        cae: '74382910483920',
        caeDueDate: '20/08/2026',
        dashboardUrl: 'https://exepaginasweb.com/dashboard/invoices',
      })

      expect(html).toContain('0001-00000042')
      expect(html).toContain('Tipo B')
      expect(html).toContain('85000 ARS')
      expect(html).toContain('74382910483920')
      expect(html).toContain('20/08/2026')
      expect(html).toContain('Tu Factura Electrónica está lista')
    })

    it('debe generar alertas de incumplimiento de SLA cuando un ticket o pago está fuera de término', () => {
      const html = slaBreachAlert({
        tenantName: 'Distribuidora del Sur',
        ticketId: 'EXE-SLA-991',
        subject: 'Fallo crítico en sincronización de pagos',
        priority: 'CRITICAL',
        breachTime: '10/08/2026 14:00',
        dashboardUrl: 'https://exepaginasweb.com/dashboard/tickets',
      })

      expect(html).toContain('Incumplimiento de SLA')
      expect(html).toContain('EXE-SLA-991')
      expect(html).toContain('CRITICAL')
      expect(html).toContain('Distribuidora del Sur')
    })
  })

  // ==========================================
  // BLOQUE 6: CONFIRMACIONES DE PAGO Y REEMBOLSOS
  // ==========================================
  describe('6. ✅ Confirmaciones de Pago, Notificaciones y Reembolsos', () => {
    it('debe generar el correo de confirmación de pago para el cliente con ID de orden', () => {
      const html = paymentConfirmation({
        name: 'Roberto Gómez',
        plan: 'Mantenimiento Básico',
        amount: '49.00',
        currency: 'USD',
        orderId: 'PAYPAL_ORDER_12345',
        dashboardUrl: 'https://exepaginasweb.com/dashboard',
      })

      expect(html).toContain('Roberto Gómez')
      expect(html).toContain('Mantenimiento Básico')
      expect(html).toContain('USD 49.00')
      expect(html).toContain('PAYPAL_ORDER_12345')
      expect(html).toContain('¡Pago aprobado!')
      expect(html).toContain('Aprobado')
    })

    it('debe generar el correo de notificación de nueva venta para el Administrador', () => {
      const html = paymentNotification({
        name: 'María Fernández',
        email: 'maria@empresa.com',
        plan: 'Plan Mantenimiento Pro',
        slug: 'mantenimiento-pro',
        amount: '99.00',
        tipoProyecto: 'ecommerce',
        orderId: 'PAYPAL_ORDER_67890',
      })

      expect(html).toContain('María Fernández')
      expect(html).toContain('maria@empresa.com')
      expect(html).toContain('mantenimiento-pro')
      expect(html).toContain('$99.00 USD')
      expect(html).toContain('PAYPAL_ORDER_67890')
      expect(html).toContain('¡Nueva venta!')
    })

    it('debe procesar el evento PAYMENT.CAPTURE.REFUNDED actualizando el estado del pago y cancelando la suscripción', async () => {
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/v1/oauth2/token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ access_token: 'mock_paypal_token' }),
          })
        }
        if (url.includes('/verify-webhook-signature')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ verification_status: 'SUCCESS' }),
          })
        }
        return Promise.resolve({ ok: true, json: async () => ({}) })
      })

      const payload = JSON.stringify({
        event_type: 'PAYMENT.CAPTURE.REFUNDED',
        resource: { id: 'PAYPAL_ORDER_REFUND_99', amount: { value: '49.00' } },
      })

      const req = {
        method: 'POST',
        headers: {
          'paypal-auth-algo': 'SHA256withRSA',
          'paypal-cert-url': 'https://api.paypal.com/v1/notifications/certs/cert.pem',
          'paypal-transmission-id': 'trans_123',
          'paypal-transmission-sig': 'sig_123',
          'paypal-transmission-time': '2026-08-10T15:00:00Z',
        },
        on: (event, cb) => {
          if (event === 'data') cb(Buffer.from(payload))
          if (event === 'end') cb()
        },
      }

      const res = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        end: vi.fn(),
      }

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ ok: true })
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('pagos')
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('suscripciones')
    })
  })
})
