import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('API Services Health & Security Audit', () => {
  it('scripts/audit-apikeys.mjs debe existir y no exponer claves en texto plano', () => {
    const scriptPath = path.resolve(process.cwd(), 'scripts/audit-apikeys.mjs')
    expect(fs.existsSync(scriptPath)).toBe(true)

    const content = fs.readFileSync(scriptPath, 'utf-8')
    // No debe imprimir process.env con los valores reales de las claves
    expect(content).not.toMatch(/console\.log\(.*process\.env\.[A-Z_]*KEY\)/i)
    expect(content).toContain('GEMINI_API_KEY')
    expect(content).toContain('SUPABASE')
    expect(content).toContain('RESEND')
  })

  it('package.json debe registrar el script "audit:keys"', () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    expect(pkg.scripts).toHaveProperty('audit:keys')
    expect(pkg.scripts['audit:keys']).toContain('audit-apikeys.mjs')
  })
})
