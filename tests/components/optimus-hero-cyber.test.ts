/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('OptimusScaleHero Cyber-Terminal Integration', () => {
  it('debe importar y utilizar CyberTerminalCard en la cuadrícula de capacidades', () => {
    const heroPath = path.resolve(process.cwd(), 'src/components/Hero/OptimusScaleHero.tsx')
    const content = fs.readFileSync(heroPath, 'utf-8')

    // Verifica la importación y uso de CyberTerminalCard
    expect(content).toContain("import CyberTerminalCard from '../shared/CyberTerminalCard'")
    expect(content).toContain('<CyberTerminalCard')
    expect(content).not.toContain('<SpotlightBorderCard')
  })
})
