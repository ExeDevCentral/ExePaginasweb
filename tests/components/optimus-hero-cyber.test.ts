/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('OptimusScaleHero Cyber-Terminal Integration & Product Showcase', () => {
  const heroPath = path.resolve(process.cwd(), 'src/components/Hero/OptimusScaleHero.tsx')
  const content = fs.readFileSync(heroPath, 'utf-8')

  it('debe importar y utilizar CyberTerminalCard en la cuadrícula de capacidades', () => {
    expect(content).toContain("import CyberTerminalCard from '../shared/CyberTerminalCard'")
    expect(content).toContain('<CyberTerminalCard')
    expect(content).not.toContain('<SpotlightBorderCard')
  })

  it('debe renderizar HeroProductShowcase con pantalla de interfaces reales y soporte de video', () => {
    expect(content).toContain("import HeroProductShowcase from './HeroProductShowcase'")
    expect(content).toContain('<HeroProductShowcase')
  })

  it('debe humanizar el eyebrow con atención directa de Exequiel', () => {
    expect(content).toContain('ATENCIÓN DIRECTA CON EXEQUIEL')
  })
})
