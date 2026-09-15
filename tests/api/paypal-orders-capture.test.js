/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockSupabaseInstance } = vi.hoisted(() => {
  return {
    mockSupabaseInstance: {
      auth: {
        getUser: vi.fn(),
        admin: { listUsers: vi.fn() },
      },
      rpc: vi.fn(),
    },
  }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseInstance),
}))

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: mockSupabaseInstance,
  isSupabaseAdminConfigured: () => true,
}))

vi.mock('@/lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'msg_test_123' }),
  ADMIN_EMAIL: 'admin@exepaginasweb.com',
}))

vi.mock('@/lib/email/templates.js', () => ({
  paymentConfirmation: vi.fn((args) => `<p>confirm ${args.plan} ${args.amount}</p>`),
  paymentNotification: vi.fn((args) => `<p>sell ${args.plan} ${args.amount}</p>`),
}))

function setupSupabaseMock() {
  const dataFor = (tabla) => {
    if (tabla === 'planes')
      return [
        { id: 'plan_avanzado_01', slug: 'mantenimiento-avanzado', nombre: 'Abono Avanzado' },
        { id: 'plan_basico_01', slug: 'mantenimiento-basico', nombre: 'Abono Básico' },
        { id: 'plan_premium_01', slug: 'mantenimiento-premium', nombre: 'Abono Premium' },
      ]
    return []
  }

  mockSupabaseInstance.auth.getUser = vi.fn().mockResolvedValue({
    data: {
      user: {
        id: 'auth_user_1',
        email: 'cliente@test.com',
        user_metadata: { full_name: 'Cliente Test' },
      },
    },
    error: null,
  })
  mockSupabaseInstance.auth.admin.listUsers = vi.fn().mockResolvedValue({
    data: { users: [{ id: 'auth_user_1', email: 'cliente@test.com' }] },
    error: null,
  })
  mockSupabaseInstance.rpc = vi.fn().mockResolvedValue({ data: 'INV-2026-0001', error: null })

  mockSupabaseInstance.from = vi.fn().mockImplementation((tabla) => ({
    select: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        limit: vi.fn().mockResolvedValue({ data: dataFor(tabla), error: null }),
        single: vi.fn().mockResolvedValue({ data: { id: `${tabla}_id_123` }, error: null }),
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
  }))
}

function mockPayPalFetch(orderResponses) {
  global.fetch = vi.fn().mockImplementation((url, init) => {
    if (url.includes('/v1/oauth2/token')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ access_token: 'mock_paypal_token' }),
      })
    }
    if (url.includes('/capture')) {
      if (orderResponses.alreadyCaptured) {
        return Promise.resolve({
          ok: false,
          status: 422,
          json: async () => ({ name: 'ORDER_ALREADY_CAPTURED', message: 'Order already captured' }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => orderResponses.captured || defaultCapturedOrder(),
      })
    }
    if (url.includes('/v2/checkout/orders') && init?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: async () => ({ id: orderResponses.createId || 'PAYPAL_ORDER_NEW_1' }),
      })
    }
    if (orderResponses.orderDetails) {
      return Promise.resolve({ ok: true, json: async () => orderResponses.orderDetails })
    }
    return Promise.resolve({ ok: true, json: async () => ({}) })
  })
}

function defaultCapturedOrder() {
  return {
    id: 'PAYPAL_ORDER_NEW_1',
    status: 'COMPLETED',
    payer: { email_address: 'cliente@test.com', name: { given_name: 'Cliente' } },
    purchase_units: [
      {
        custom_id: 'mantenimiento-avanzado|cliente@test.com|ecommerce',
        amount: { value: '55.00', currency_code: 'USD' },
        description: 'Abono Avanzado',
        payments: { captures: [{ id: 'CAPTURE_1', status: 'COMPLETED' }] },
      },
    ],
  }
}

async function callRoute(handler, payload, headers = {}) {
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const req = new NextRequest('http://localhost:3000/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: bodyString,
  })
  const res = await handler(req)
  const json = await res.json()
  return { status: res.status, json }
}

describe('💳 PayPal Orders v2: creación y captura server-side', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.PAYPAL_CLIENT_ID = 'paypal_client_mock'
    process.env.PAYPAL_CLIENT_SECRET = 'paypal_secret_mock'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_key'
    setupSupabaseMock()
  })

  describe('1. 🛒 POST /api/paypal/orders', () => {
    it('debe crear una orden de PayPal con custom_id y monto del catálogo para el usuario autenticado', async () => {
      mockPayPalFetch({ createId: 'PAYPAL_ORDER_NEW_1' })

      const { POST } = await import('../../app/api/paypal/orders/route')
      const { status, json } = await callRoute(
        POST,
        { planSlug: 'mantenimiento-basico', tipoProyecto: 'mantenimiento' },
        { Authorization: 'Bearer tok_123' }
      )

      expect(status).toBe(200)
      expect(json.id).toBe('PAYPAL_ORDER_NEW_1')

      const createCall = global.fetch.mock.calls.find(
        ([url, init]) => url.includes('/v2/checkout/orders') && init?.method === 'POST'
      )
      expect(createCall).toBeTruthy()
      const body = JSON.parse(createCall[1].body)
      expect(body.intent).toBe('CAPTURE')
      expect(body.purchase_units[0].amount).toEqual({ currency_code: 'USD', value: '28.00' })
      expect(body.purchase_units[0].custom_id).toBe(
        'mantenimiento-basico|cliente@test.com|mantenimiento'
      )
    })

    it('debe rechazar la creación de orden sin sesión válida', async () => {
      mockPayPalFetch({})
      mockSupabaseInstance.auth.getUser = vi
        .fn()
        .mockResolvedValue({ data: { user: null }, error: { message: 'no session' } })

      const { POST } = await import('../../app/api/paypal/orders/route')
      const { status } = await callRoute(POST, { planSlug: 'mantenimiento-basico' })

      expect(status).toBe(401)
    })

    it('debe rechazar planes que no pertenecen a la tienda', async () => {
      mockPayPalFetch({})
      const { POST } = await import('../../app/api/paypal/orders/route')
      const { status } = await callRoute(
        POST,
        { planSlug: 'plan-inventado' },
        { Authorization: 'Bearer tok_123' }
      )
      expect(status).toBe(400)
    })
  })

  describe('2. 💸 POST /api/paypal/capture', () => {
    it('debe capturar la orden aprobada y registrar pago, suscripción y tenant', async () => {
      mockPayPalFetch({ captured: defaultCapturedOrder() })

      const { POST } = await import('../../app/api/paypal/capture/route')
      const { status, json } = await callRoute(
        POST,
        { orderId: 'PAYPAL_ORDER_NEW_1' },
        { Authorization: 'Bearer tok_123' }
      )

      expect(status).toBe(200)
      expect(json).toMatchObject({
        ok: true,
        duplicate: false,
        planSlug: 'mantenimiento-avanzado',
      })

      const insertCalls = mockSupabaseInstance.from.mock.calls.filter((args) => args[0] === 'pagos')
      expect(insertCalls).toBeTruthy()
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('suscripciones')
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('tenants')
    })

    it('debe recuperar orden ya capturada (hosted button) y procesarla', async () => {
      mockPayPalFetch({
        alreadyCaptured: true,
        orderDetails: defaultCapturedOrder(),
      })

      const { POST } = await import('../../app/api/paypal/capture/route')
      const { status, json } = await callRoute(
        POST,
        { orderId: 'PAYPAL_ORDER_NEW_1' },
        { Authorization: 'Bearer tok_123' }
      )

      expect(status).toBe(200)
      expect(json.ok).toBe(true)
      expect(mockSupabaseInstance.from).toHaveBeenCalledWith('pagos')
    })
  })
})
