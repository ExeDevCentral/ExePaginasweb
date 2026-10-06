import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Scroll Architecture Cleanliness', () => {
  it('no debe contener directivas de scroll-snap global en index.css', () => {
    const cssPath = path.resolve(process.cwd(), 'src/index.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')

    // No debe contener scroll-snap-type en html ni en selectores globales
    expect(cssContent).not.toMatch(/scroll-snap-type:\s*y\s+proximity/i)
    expect(cssContent).not.toMatch(/scroll-snap-type:\s*y\s+mandatory/i)
    expect(cssContent).not.toMatch(/scroll-snap-align:\s*start/i)
    expect(cssContent).not.toMatch(/scroll-snap-stop:\s*always/i)
  })

  it('debe tener Lenis configurado con fisica lineal y reactiva en ScrollProvider.tsx', () => {
    const providerPath = path.resolve(process.cwd(), 'src/components/shared/ScrollProvider.tsx')
    const providerContent = fs.readFileSync(providerPath, 'utf-8')

    // Verifica calibración fina
    expect(providerContent).toContain('duration: 0.9')
    expect(providerContent).toContain('wheelMultiplier: 1.0')
  })
})
