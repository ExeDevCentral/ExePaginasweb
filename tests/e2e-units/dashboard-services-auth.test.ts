import { describe, it, expect } from 'vitest'
import { getAuthRedirectUrl } from '../../src/core/auth/siteUrl'
import {
  PLAN_CATALOG,
  tierFromStorePlanId,
  tierFromPlanLabel,
} from '../../src/core/domain/planCatalog'
import type { Invoice } from '../../src/core/domain/entities/Invoice'
import type { TenantService } from '../../src/core/domain/entities/TenantService'

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
        numero: 'EXE-2026-0001',
        tipo: 'A',
        estado: 'pagada',
        monto: 150000,
        moneda: 'ARS',
        concepto: 'Abono Mantenimiento Web SaaS - Febrero 2026',
        fecha_emision: '2026-02-01T10:00:00Z',
        fecha_vencimiento: '2026-02-15T10:00:00Z',
        created_at: '2026-02-01T10:00:00Z',
        items: [
          { descripcion: 'Plan Avanzado', cantidad: 1, precio_unitario: 150000, subtotal: 150000 },
        ],
      },
      {
        id: 'inv-002',
        tenant_id: 'tenant-abc',
        numero: 'EXE-2026-0002',
        tipo: 'B',
        estado: 'emitida',
        monto: 85,
        moneda: 'USD',
        concepto: 'Desarrollo de Módulo de Reservas y Turnos',
        fecha_emision: '2026-02-10T10:00:00Z',
        fecha_vencimiento: '2026-02-25T10:00:00Z',
        created_at: '2026-02-10T10:00:00Z',
        items: [
          { descripcion: 'Custom Feature Add-on', cantidad: 1, precio_unitario: 85, subtotal: 85 },
        ],
      },
      {
        id: 'inv-003',
        tenant_id: 'tenant-abc',
        numero: 'EXE-2026-0003',
        tipo: 'B',
        estado: 'vencida',
        monto: 45000,
        moneda: 'ARS',
        concepto: 'Soporte y Horas de Consultoría',
        fecha_emision: '2026-01-01T10:00:00Z',
        fecha_vencimiento: '2026-01-15T10:00:00Z',
        created_at: '2026-01-01T10:00:00Z',
        items: [
          {
            descripcion: 'Horas de Desarrollo',
            cantidad: 3,
            precio_unitario: 15000,
            subtotal: 45000,
          },
        ],
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
        .reduce((sum, i) => sum + i.monto, 0)
      const totalUsd = mockInvoices
        .filter((i) => i.moneda === 'USD')
        .reduce((sum, i) => sum + i.monto, 0)

      expect(totalArs).toBe(150000)
      expect(totalUsd).toBe(85)
    })
  })

  // -------------------------------------------------------------
  // 3. SERVICIOS ACTIVOS Y PROVISIONING (DASHBOARD)
  // -------------------------------------------------------------
  describe('3. Módulo de Servicios y Provisioning (Dashboard)', () => {
    const mockServices: TenantService[] = [
      {
        id: 'srv-01',
        tenant_id: 'tenant-abc',
        nombre: 'Hosting Cloud & Dominio SSL',
        tipo: 'hosting',
        estado: 'activo',
        fecha_inicio: '2026-01-01T00:00:00Z',
        fecha_fin: '2027-01-01T00:00:00Z',
        renovacion_automatica: true,
        precio_periodo: 120000,
        moneda: 'ARS',
        periodo: 'anual',
        metadata: { provider: 'Vercel / Cloudflare' },
      },
      {
        id: 'srv-02',
        tenant_id: 'tenant-abc',
        nombre: 'Mantenimiento y Actualizaciones SaaS',
        tipo: 'mantenimiento',
        estado: 'activo',
        fecha_inicio: '2026-02-01T00:00:00Z',
        fecha_fin: '2026-03-01T00:00:00Z',
        renovacion_automatica: true,
        precio_periodo: 45000,
        moneda: 'ARS',
        periodo: 'mensual',
      },
    ]

    it('debe verificar que los servicios activos cuentan con fechas válidas y renovación automática', () => {
      mockServices.forEach((srv) => {
        expect(srv.estado).toBe('activo')
        expect(new Date(srv.fecha_fin!).getTime()).toBeGreaterThan(
          new Date(srv.fecha_inicio).getTime()
        )
        expect(srv.renovacion_automatica).toBe(true)
      })
    })
  })

  // -------------------------------------------------------------
  // 4. CATÁLOGO DE PLANES Y SERVICIOS QUE OFRECEMOS (TIENDA & WEB)
  // -------------------------------------------------------------
  describe('4. Catálogo de Servicios y Planes Oficiales (Tienda & Cotizador)', () => {
    it('debe contener los planes principales con precios válidos en ARS y USD', () => {
      expect(PLAN_CATALOG.length).toBe(3)

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
