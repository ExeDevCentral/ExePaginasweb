/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import CyberTerminalCard from '../../src/components/shared/CyberTerminalCard'

describe('CyberTerminalCard UI Component', () => {
  it('renderiza correctamente el chasis biselado, telemetría y contenido técnico', () => {
    const html = renderToStaticMarkup(
      React.createElement(CyberTerminalCard, {
        id: '01',
        code: '01 // MÁS VENTAS',
        title: 'Páginas de Alta Conversión',
        desc: 'Carga instantánea en 0.38s con optimización máxima.',
        badge: 'Más Consultas',
        tech: ['Primero en Google (SEO)', 'Carga Ultra Rápida', 'Ventas desde el Celular'],
        cta: 'Ver soluciones web',
        href: '/soluciones#paginas-web',
        color: 'cyan',
      })
    )

    // Verificación de chasis cibernético y telemetría
    expect(html).toContain('01 // MÁS VENTAS')
    expect(html).toContain('Páginas de Alta Conversión')
    expect(html).toContain('Más Consultas')
    expect(html).toContain('SYS_ONLINE')
    expect(html).toContain('data-cyber-chassis')
    expect(html).toContain('Primero en Google (SEO)')
    expect(html).toContain('href="/soluciones#paginas-web"')
  })

  it('soporta paleta de colores reactiva (fuchsia, amber, emerald)', () => {
    const html = renderToStaticMarkup(
      React.createElement(CyberTerminalCard, {
        id: '02',
        code: '02 // GESTIÓN MÓVIL',
        title: 'Catálogo y Gestión Móvil',
        desc: 'Tu catálogo y pedidos actualizados al instante.',
        badge: 'Control Total',
        color: 'fuchsia',
      })
    )

    expect(html).toContain('02 // GESTIÓN MÓVIL')
    expect(html).toContain('Catálogo y Gestión Móvil')
    expect(html).toContain('data-cyber-color="fuchsia"')
  })
})
