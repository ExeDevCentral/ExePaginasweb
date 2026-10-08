/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('OwnershipVsSubscription Honest Audit & Cyber Effects', () => {
  const compPath = path.resolve(process.cwd(), 'src/components/shared/OwnershipVsSubscription.tsx')
  const content = fs.readFileSync(compPath, 'utf-8')

  it('debe contener la auditoría de honestidad brutal (cuándo alquilar vs cuándo ser dueño)', () => {
    expect(content).toContain('HONESTIDAD BRUTAL')
    expect(content).toContain('¿Cuándo Conviene Alquilar y Cuándo Ser Dueño?')
    expect(content).toContain('Si estás experimentando')
  })

  it('debe incorporar los 2 efectos futuristas: escáner holográfico y reactor de telemetría', () => {
    // Efecto 1: Escáner holográfico de decisión estratégica
    expect(content).toContain('data-hologram-scanner')
    expect(content).toContain('FASE EXPERIMENTAL')
    expect(content).toContain('FASE ESCALA')

    // Efecto 2: Reactor de flujo de energía y blindaje electromagnético
    expect(content).toContain('data-energy-reactor')
    expect(content).toContain('CAPITAL PROTEGIDO')
  })

  it('debe haber quitado el componente redundante NeonDuel', () => {
    expect(content).not.toContain('function NeonDuel')
    expect(content).not.toContain('<NeonDuel')
  })

  it('debe incorporar la calculadora interactiva de fuga de comisiones', () => {
    expect(content).toContain('data-commission-calculator')
    expect(content).toContain('Calculadora de Alquiler vs. Soberanía')
    expect(content).toContain('revenue-slider')
    expect(content).toContain('0% comisiones a terceros')
  })

  it('debe incorporar la matriz táctica de 4 ejes de ingeniería', () => {
    expect(content).toContain('data-tactical-matrix')
    expect(content).toContain('Propiedad del Código Fuente')
    expect(content).toContain('Base de Datos y Tus Clientes')
    expect(content).toContain('Comisiones de Venta y Pasarelas')
    expect(content).toContain('Continuidad Operativa')
  })

  it('debe incorporar el sello notarial criptográfico con autoría de Exequiel Echevarría y año 2025', () => {
    expect(content).toContain('data-notarial-seal')
    expect(content).toContain('Exequiel Echevarría')
    expect(content).toContain('2025')
    expect(content).toContain('Transferencia de Repositorio GitHub')
  })
})
