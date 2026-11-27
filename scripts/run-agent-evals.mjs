#!/usr/bin/env node
/**
 * Agent Evals Harness (Pillar 2 — Self-Testing Guardrails & Boundaries)
 *
 * Tests that our physical guardrails and Architectural Import Boundaries
 * reliably BLOCK bad agent outputs and ACCEPT clean code.
 * Runs in temp files inside src/ (auto-cleaned in finally) so the repo stays spotless.
 *
 * Usage:
 *   node scripts/run-agent-evals.mjs
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

const CASES = [
  {
    id: 'block-ts-ignore',
    description: 'Bloquea @ts-ignore en código nuevo',
    relPath: 'src/shared/__eval_tmp_ts_ignore.ts',
    content: '// @ts-ignore\nexport const x: number = "bad"\n',
    cmd: ['node', 'scripts/audit-guardrails.mjs', '--changed'],
    expectPass: false,
  },
  {
    id: 'block-unjustified-use-effect',
    description: 'Bloquea useEffect sin justificación guardrail-ok',
    relPath: 'src/components/__eval_tmp_effect.tsx',
    content: "import { useEffect } from 'react'\nexport function X() { useEffect(() => {}, []); return null }\n",
    cmd: ['node', 'scripts/audit-guardrails.mjs', '--changed'],
    expectPass: false,
  },
  {
    id: 'allow-justified-use-effect',
    description: 'Acepta useEffect cuando tiene // guardrail-ok(useEffect): <motivo>',
    relPath: 'src/components/__eval_tmp_effect_ok.tsx',
    content:
      "import { useEffect } from 'react'\n// guardrail-ok(useEffect): suscripción DOM externa\nexport function X() { useEffect(() => {}, []); return null }\n",
    cmd: ['node', 'scripts/audit-guardrails.mjs', '--changed'],
    expectPass: true,
  },
  {
    id: 'block-domain-importing-infra',
    description: 'Bloquea dominio importando infraestructura (Arquitectura Dune)',
    relPath: 'src/core/domain/__eval_tmp_bad_import.ts',
    content: "import { x } from '../infra/supabase/client'\nexport const bad = x\n",
    cmd: ['node', 'scripts/audit-imports.mjs', '--changed'],
    expectPass: false,
  },
  {
    id: 'block-ui-importing-repo',
    description: 'Bloquea UI importando repositorio de DB directamente (Arquitectura Dune)',
    relPath: 'src/components/__eval_tmp_ui_repo.tsx',
    content: "import { repo } from '../core/infra/repositories/SupabaseTenantRepository'\nexport const bad = repo\n",
    cmd: ['node', 'scripts/audit-imports.mjs', '--changed'],
    expectPass: false,
  },
  {
    id: 'allow-pure-domain',
    description: 'Acepta módulo de dominio puro sin violaciones',
    relPath: 'src/core/domain/__eval_tmp_clean.ts',
    content: 'export function sumCents(a: bigint, b: bigint): bigint { return a + b }\n',
    cmd: ['node', 'scripts/audit-imports.mjs', '--changed'],
    expectPass: true,
  },
]

let passedCount = 0

console.log('\n=== AGENT EVALS: Guardrails & Dune Boundaries ===')

for (const c of CASES) {
  const fullPath = path.join(ROOT, c.relPath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, c.content, 'utf8')

  let actualPass = false
  try {
    const proc = spawnSync(c.cmd[0], c.cmd.slice(1), { encoding: 'utf8' })
    actualPass = proc.status === 0
  } finally {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
  }

  const ok = actualPass === c.expectPass
  if (ok) passedCount++
  const tag = ok ? 'PASS' : 'FAIL'
  console.log(`  [${tag}] ${c.id} — ${c.description}`)
}

const score = Math.round((passedCount / CASES.length) * 100)
console.log(`=== RESULT: ${passedCount}/${CASES.length} (${score}/100) ===\n`)

process.exit(passedCount === CASES.length ? 0 : 1)
