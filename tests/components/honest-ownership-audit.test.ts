/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('OwnershipVsSubscription Streamlined Honest Audit & Cyber Terminal', () => {
  const compPath = path.resolve(process.cwd(), 'src/components/shared/OwnershipVsSubscription.tsx')
  const content = fs.readFileSync(compPath, 'utf-8')

  it('debe contener la auditoría de honestidad brutal (cuándo alquilar vs cuándo ser dueño)', () => {
    expect(content).toContain('HONESTIDAD BRUTAL')
    expect(content).toContain('¿Cuándo Conviene Alquilar y Cuándo Ser Dueño?')
    expect(content).toContain('Si estás experimentando')
  })

  it('debe incorporar el escáner holográfico y reactor de telemetría de capital', () => {
    // Efecto 1: Escáner holográfico de decisión estratégica
    expect(content).toContain('data-hologram-scanner')
    expect(content).toContain('FASE EXPERIMENTAL')
    expect(content).toContain('FASE ESCALA')

    // Efecto 2: Reactor de retención de capital
    expect(content).toContain('data-energy-reactor')
    expect(content).toContain('CAPITAL PROTEGIDO')
  })

  it('debe haber quitado secciones sobrecargadas y redundantes que no sumaban', () => {
    // Quitado el letrero neón
    expect(content).not.toContain('<NeonDuel')
    // Quitado el pesado simulador de fuga repetitivo
    expect(content).not.toContain('data-commission-calculator')
    // Quitadas las cards gigantes clonadas
    expect(content).not.toContain('function DeedCard')
    expect(content).not.toContain('function RentalCard')
    expect(content).not.toContain('function CostCard')
  })

  it('debe incorporar la matriz táctica de 4 ejes de ingeniería (formato especificación)', () => {
    expect(content).toContain('data-tactical-matrix')
    expect(content).toContain('Propiedad del Código Fuente')
    expect(content).toContain('Base de Datos y Tus Clientes')
    expect(content).toContain('Comisiones de Venta y Pasarelas')
    expect(content).toContain('Continuidad Operativa')
  })

  it('debe incorporar la terminal interactiva de liberación de código', () => {
    expect(content).toContain('git clone https://github.com/tu-empresa/sistema-web.git')
    expect(content).toContain('402 Payment Required')
  })

  it('debe incorporar el sello notarial criptográfico con autoría de Exequiel Echevarría y año 2025', () => {
    expect(content).toContain('data-notarial-seal')
    expect(content).toContain('Exequiel Echevarría')
    expect(content).toContain('2025')
    expect(content).toContain('Transferencia de Repositorio GitHub')
  })
})
