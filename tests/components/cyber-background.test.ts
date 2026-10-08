/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('PremiumBackground Cyber-Grid Perspective Verification', () => {
  it('debe contener la capa de perspectiva cyber-grid y viñeta perimetral', () => {
    const bgPath = path.resolve(process.cwd(), 'src/components/Effects/PremiumBackground.tsx')
    const content = fs.readFileSync(bgPath, 'utf-8')

    // Verificación de la retícula de perspectiva cibernética y viñeta táctica
    expect(content).toContain('data-cyber-grid')
    expect(content).toContain('cyber-horizon-glow')
    expect(content).toContain('canvas ref={canvasRef}')
  })
})
