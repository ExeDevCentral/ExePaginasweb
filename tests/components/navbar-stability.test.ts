import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('LiquidIslandNavbar Stability & Anti-Jelly Verification', () => {
  it('useNavScroll no debe contener transforms de velocidad elastica (rawSkew / rawScaleY)', () => {
    const hookPath = path.resolve(
      process.cwd(),
      'src/components/layout/LiquidIsland/useNavScroll.ts'
    )
    const hookContent = fs.readFileSync(hookPath, 'utf-8')

    // No debe transformar skew ni scaleY en base a velocidad
    expect(hookContent).not.toMatch(/useTransform\(scrollVelocity.*\[2,\s*-2\]/i)
    expect(hookContent).not.toMatch(/useTransform\(scrollVelocity.*\[1\.025,\s*1/i)
  })

  it('LiquidIslandNavbar no debe colapsar violentamente los enlaces en desktop al scrollear', () => {
    const navbarPath = path.resolve(
      process.cwd(),
      'src/components/layout/LiquidIsland/LiquidIslandNavbar.tsx'
    )
    const navbarContent = fs.readFileSync(navbarPath, 'utf-8')

    // No debe forzar width 0 en los links de desktop en base a isCompact
    expect(navbarContent).not.toMatch(/width:\s*isCompact\s*\?\s*0\s*:\s*['"]auto['"]/i)
    // El aura no debe tener opacidad excesiva de 80-95% con blur-2xl
    expect(navbarContent).not.toMatch(/opacity-80\s+dark:opacity-95/i)
  })
})
