/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('OwnershipVsSubscription Honest Audit & Cyber Effects', () => {
  it('debe contener la auditoría de honestidad brutal (cuándo alquilar vs cuándo ser dueño)', () => {
    const compPath = path.resolve(
      process.cwd(),
      'src/components/shared/OwnershipVsSubscription.tsx'
    )
    const content = fs.readFileSync(compPath, 'utf-8')

    // Verifica mensaje de honestidad brutal
    expect(content).toContain('HONESTIDAD BRUTAL')
    expect(content).toContain('¿Cuándo Conviene Alquilar y Cuándo Ser Dueño?')
    expect(content).toContain('Si estás experimentando')
  })

  it('debe incorporar los 2 efectos futuristas: escáner holográfico y reactor de telemetría', () => {
    const compPath = path.resolve(
      process.cwd(),
      'src/components/shared/OwnershipVsSubscription.tsx'
    )
    const content = fs.readFileSync(compPath, 'utf-8')

    // Efecto 1: Escáner holográfico de decisión estratégica
    expect(content).toContain('data-hologram-scanner')
    expect(content).toContain('FASE EXPERIMENTAL')
    expect(content).toContain('FASE ESCALA')

    // Efecto 2: Reactor de flujo de energía y blindaje electromagnético
    expect(content).toContain('data-energy-reactor')
    expect(content).toContain('CAPITAL PROTEGIDO')
  })
})
