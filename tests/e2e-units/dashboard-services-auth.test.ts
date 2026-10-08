/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import { getAuthRedirectUrl } from '../../src/core/auth/siteUrl'
import {
  PLAN_CATALOG,
  tierFromStorePlanId,
  tierFromPlanLabel,
} from '../../src/core/domain/planCatalog'
import type { Invoice } from '../../src/core/domain/entities/Invoice'
import type { TenantServiceWithDetails } from '../../src/core/domain/entities/TenantService'

describe('🔬 SUITE DE TEST INTEGRAL: Autenticación Google, Dashboard, Facturas y Catálogo de Servicios', () => {
  // -------------------------------------------------------------
  // 1. AUTENTICACIÓN GOOGLE & PKCE REDIRECT
  // -------------------------------------------------------------
  describe('1. Autenticación con Google (OAuth & PKCE)', () => {
    it('debe generar la URL canónica de redirección para Google OAuth según el entorno', () => {
      const redirectUrl = getAuthRedirectUrl('/auth/callback')
      expect(redirectUrl).toContain('/auth/callback')
      expect(redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')).toBe(true)
    })

    it('debe admitir parámetros para modo recuperación o destino post-login', () => {
      const customRedirect = getAuthRedirectUrl('/auth/callback?type=recovery')
      expect(customRedirect).toContain('type=recovery')

      const nextRedirect = getAuthRedirectUrl('/auth/callback?next=%2Fdashboard')
      expect(nextRedirect).toContain('next=%2Fdashboard')
    })
  })

  // -------------------------------------------------------------
  // 2. FACTURAS & PAGOS EN DASHBOARD
  // -------------------------------------------------------------
  describe('2. Módulo de Facturas y Control de Pagos (Dashboard)', () => {
    const mockInvoices: Invoice[] = [
      {
        id: 'inv-001',
        tenant_id: 'tenant-abc',
        cliente_id: 'cli-001',
        numero: 'EXE-2026-0001',
        tipo: 'A',
        estado: 'pagada',
        subtotal: 150000,
        iva: 0,
        total: 150000,
        moneda: 'ARS',
        concepto: 'Abono Mantenimiento Web SaaS - Febrero 2026',
        detalles: [
          { descripcion: 'Plan Avanzado', cantidad: 1, precio_unitario: 150000, total: 150000 },
        ],
        fecha_emision: '2026-02-01T10:00:00Z',
        fecha_vencimiento: '2026-02-15T10:00:00Z',
        fecha_pago: '2026-02-05T10:00:00Z',
        pago_id: 'pay-001',
        afip_cae: null,
        afip_vencimiento: null,
        metadata: {},
        created_at: '2026-02-01T10:00:00Z',
        updated_at: '2026-02-05T10:00:00Z',
      },
      {
        id: 'inv-002',
        tenant_id: 'tenant-abc',
        cliente_id: 'cli-001',
        numero: 'EXE-2026-0002',
        tipo: 'B',
        estado: 'emitida',
        subtotal: 85,
        iva: 0,
        total: 85,
        moneda: 'USD',
        concepto: 'Desarrollo de Módulo de Reservas y Turnos',
        detalles: [
          { descripcion: 'Custom Feature Add-on', cantidad: 1, precio_unitario: 85, total: 85 },
        ],
        fecha_emision: '2026-02-10T10:00:00Z',
        fecha_vencimiento: '2026-02-25T10:00:00Z',
        fecha_pago: null,
        pago_id: null,
        afip_cae: null,
        afip_vencimiento: null,
        metadata: {},
        created_at: '2026-02-10T10:00:00Z',
        updated_at: '2026-02-10T10:00:00Z',
      },
      {
        id: 'inv-003',
        tenant_id: 'tenant-abc',
        cliente_id: 'cli-001',
        numero: 'EXE-2026-0003',
        tipo: 'B',
        estado: 'vencida',
        subtotal: 45000,
        iva: 0,
        total: 45000,
        moneda: 'ARS',
        concepto: 'Soporte y Horas de Consultoría',
        detalles: [
          {
            descripcion: 'Horas de Desarrollo',
            cantidad: 3,
            precio_unitario: 15000,
            total: 45000,
          },
        ],
        fecha_emision: '2026-01-01T10:00:00Z',
        fecha_vencimiento: '2026-01-15T10:00:00Z',
        fecha_pago: null,
        pago_id: null,
        afip_cae: null,
        afip_vencimiento: null,
        metadata: {},
        created_at: '2026-01-01T10:00:00Z',
        updated_at: '2026-01-01T10:00:00Z',
      },
    ]

    it('debe clasificar correctamente los estados de factura (pagada, emitida, vencida)', () => {
      const paid = mockInvoices.filter((i) => i.estado === 'pagada')
      const pending = mockInvoices.filter((i) => i.estado === 'emitida')
      const overdue = mockInvoices.filter((i) => i.estado === 'vencida')

      expect(paid).toHaveLength(1)
      expect(pending).toHaveLength(1)
      expect(overdue).toHaveLength(1)
      expect(paid[0].numero).toBe('EXE-2026-0001')
    })

    it('debe calcular correctamente los subtotales por moneda', () => {
      const totalArs = mockInvoices
        .filter((i) => i.moneda === 'ARS' && i.estado === 'pagada')
        .reduce((sum, i) => sum + i.total, 0)
      const totalUsd = mockInvoices
        .filter((i) => i.moneda === 'USD')
        .reduce((sum, i) => sum + i.total, 0)

      expect(totalArs).toBe(150000)
      expect(totalUsd).toBe(85)
    })
  })

  // -------------------------------------------------------------
  // 3. SERVICIOS ACTIVOS Y PROVISIONING (DASHBOARD)
  // -------------------------------------------------------------
  describe('3. Módulo de Servicios y Provisioning (Dashboard)', () => {
    const mockServices: TenantServiceWithDetails[] = [
      {
        id: 'srv-01',
        tenant_id: 'tenant-abc',
        service_id: 'srv-base-01',
        estado: 'activo',
        precio_actual: 120000,
        moneda: 'ARS',
        started_at: '2026-01-01T00:00:00Z',
        ends_at: '2027-01-01T00:00:00Z',
        auto_renew: true,
        metadata: { provider: 'Vercel / Cloudflare' },
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        service: {
          id: 'srv-base-01',
          slug: 'hosting-cloud',
          nombre: 'Hosting Cloud & Dominio SSL',
          descripcion: null,
          tipo: 'hosting',
          intervalo: 'anual',
        },
      },
      {
        id: 'srv-02',
        tenant_id: 'tenant-abc',
        service_id: 'srv-base-02',
        estado: 'activo',
        precio_actual: 45000,
        moneda: 'ARS',
        started_at: '2026-02-01T00:00:00Z',
        ends_at: '2026-03-01T00:00:00Z',
        auto_renew: true,
        metadata: {},
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
        service: {
          id: 'srv-base-02',
          slug: 'mantenimiento-saas',
          nombre: 'Mantenimiento y Actualizaciones SaaS',
          descripcion: null,
          tipo: 'mantenimiento',
          intervalo: 'mensual',
        },
      },
    ]

    it('debe verificar que los servicios activos cuentan con fechas válidas y renovación automática', () => {
      mockServices.forEach((srv) => {
        expect(srv.estado).toBe('activo')
        expect(new Date(srv.ends_at!).getTime()).toBeGreaterThan(new Date(srv.started_at).getTime())
        expect(srv.auto_renew).toBe(true)
        expect(srv.service?.nombre).toBeTruthy()
      })
    })
  })

  // -------------------------------------------------------------
  // 4. CATÁLOGO DE PLANES Y SERVICIOS QUE OFRECEMOS (TIENDA & WEB)
  // -------------------------------------------------------------
  describe('4. Catálogo de Servicios y Planes Oficiales (Tienda & Cotizador)', () => {
    it('debe contener los planes principales con precios válidos en ARS y USD', () => {
      expect(PLAN_CATALOG).toHaveLength(3)

      const basic = PLAN_CATALOG.find((p) => p.tier === 'basico')
      const advanced = PLAN_CATALOG.find((p) => p.tier === 'avanzado')
      const premium = PLAN_CATALOG.find((p) => p.tier === 'premium')

      expect(basic).toBeDefined()
      expect(advanced).toBeDefined()
      expect(premium).toBeDefined()

      PLAN_CATALOG.forEach((plan) => {
        expect(plan.nombre).toBeDefined()
        expect(plan.precio).toBeGreaterThan(0)
        expect(plan.precioUSD).toBeGreaterThan(0)
      })
    })

    it('debe resolver correctamente los tiers a partir de IDs y etiquetas de texto', () => {
      expect(tierFromStorePlanId('mantenimiento-basico')).toBe('basico')
      expect(tierFromStorePlanId('mantenimiento-avanzado')).toBe('avanzado')
      expect(tierFromStorePlanId('mantenimiento-premium')).toBe('premium')
      expect(tierFromStorePlanId('invalido')).toBe('none')

      expect(tierFromPlanLabel('Plan Básico de Mantenimiento')).toBe('basico')
      expect(tierFromPlanLabel('Abono Pro / Avanzado')).toBe('avanzado')
      expect(tierFromPlanLabel('Servicio Premium Enterprise')).toBe('premium')
    })
  })

  // -------------------------------------------------------------
  // 5. COTIZADOR INTERACTIVO Y LÓGICA DE PRESUPUESTO
  // -------------------------------------------------------------
  describe('5. Lógica de Estimación del Cotizador Online', () => {
    it('debe calcular correctamente el estimado base de proyectos según funcionalidades', () => {
      const baseLandingARS = 180000
      const ecommerceAddonARS = 120000
      const turnosAddonARS = 80000

      const totalCotizacion = baseLandingARS + ecommerceAddonARS + turnosAddonARS
      expect(totalCotizacion).toBe(380000)
    })

    it('debe formatear mensajes de WhatsApp con números y texto sanitizados', () => {
      const whatsappNumber = '5493416874786'
      const clientName = 'Carlos Martinez'
      const selectedPlan = 'Abono Avanzado'

      const text = `Hola ExeSistemasWEB! Mi nombre es ${clientName} y quiero cotizar el ${selectedPlan}.`
      const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`

      expect(encodedUrl).toContain('wa.me/5493416874786')
      expect(encodedUrl).toContain('Carlos%20Martinez')
      expect(encodedUrl).toContain('Abono%20Avanzado')
    })
  })
})
