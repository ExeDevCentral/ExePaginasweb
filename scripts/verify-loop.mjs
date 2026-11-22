#!/usr/bin/env node
/**
 * Autonomous Feedback Loop Runner (Pillar 1)
 *
 * Executes all verification gates sequentially and produces a structured
 * PASS/FAIL report + score (0-100) so autonomous agents can self-correct
 * in a loop without human micro-management.
 *
 * Usage:
 *   node scripts/verify-loop.mjs                  # Fast loop (typecheck + lint + guardrails + vitest)
 *   node scripts/verify-loop.mjs --build          # Includes Next.js production build
 *   node scripts/verify-loop.mjs --build --e2e    # Full pipeline including Playwright E2E/a11y
 *   node scripts/verify-loop.mjs --full-guardrails # Scans entire repo instead of git-changed files
 *   node scripts/verify-loop.mjs --json           # Machine-readable JSON output
 */

import { spawnSync } from 'node:child_process'

const args = new Set(process.argv.slice(2))
const includeBuild = args.has('--build')
const includeE2e = args.has('--e2e')
const fullGuardrails = args.has('--full-guardrails')
const jsonMode = args.has('--json')

const gates = [
  {
    id: 'typecheck',
    label: 'TypeScript (tsc --noEmit)',
    cmd: 'npm',
    args: ['run', 'typecheck'],
    weight: 25,
    hint: 'Corregí los errores de tipos reportados por tsc. Nunca uses @ts-ignore.',
  },
  {
    id: 'lint',
    label: 'ESLint',
    cmd: 'npm',
    args: ['run', 'lint'],
    weight: 20,
    hint: 'Corregí los errores de ESLint o ejecutá eslint --fix en los archivos modificados.',
  },
  {
    id: 'guardrails',
    label: fullGuardrails ? 'Guardrails (full)' : 'Guardrails (changed)',
    cmd: 'node',
    args: fullGuardrails
      ? ['scripts/audit-guardrails.mjs']
      : ['scripts/audit-guardrails.mjs', '--changed'],
    weight: 15,
    hint: 'Violación de guardrail físico (useEffect injustificado, console.log, @ts-ignore o secreto). Refactorizá o justificá explícitamente.',
  },
  {
    id: 'imports',
    label: fullGuardrails ? 'Import Boundaries (full)' : 'Import Boundaries (changed)',
    cmd: 'node',
    args: fullGuardrails
      ? ['scripts/audit-imports.mjs']
      : ['scripts/audit-imports.mjs', '--changed'],
    weight: 15,
    hint: 'Violación de Arquitectura Dune: una capa importó desde una capa prohibida (ej. domain->infra o UI->repository). Invertí la dependencia o pasá por un hook/API.',
  },
  {
    id: 'tests',
    label: 'Unit & Integration Tests (Vitest)',
    cmd: 'npm',
    args: ['test'],
    weight: 35,
    hint: 'Revisá los tests fallidos en Vitest y ajustá la implementación o los casos borde.',
  },
]

if (includeBuild) {
  gates.push({
    id: 'build',
    label: 'Production Build (next build)',
    cmd: 'npm',
    args: ['run', 'build'],
    weight: 20,
    hint: 'El build de Next.js falló. Revisá imports de servidor/cliente, metadata o rutas.',
  })
}

if (includeE2e) {
  gates.push({
    id: 'e2e',
    label: 'Playwright E2E & a11y',
    cmd: 'npx',
    args: ['playwright', 'test'],
    weight: 20,
    hint: 'Revisá las aserciones de Playwright y errores de consola/accesibilidad.',
  })
}

const totalWeight = gates.reduce((acc, g) => acc + g.weight, 0)
const results = []

for (const gate of gates) {
  const start = Date.now()
  const proc = spawnSync(gate.cmd, gate.args, {
    encoding: 'utf8',
    env: { ...process.env, CI: 'true' },
    maxBuffer: 10 * 1024 * 1024,
  })
  const durationMs = Date.now() - start
  const passed = proc.status === 0
  const combined = `${proc.stdout || ''}\n${proc.stderr || ''}`.trim()
  const tailLines = combined.split('\n').slice(-25).join('\n')

  results.push({
    id: gate.id,
    label: gate.label,
    passed,
    exitCode: proc.status ?? 1,
    durationMs,
    weight: gate.weight,
    hint: passed ? null : gate.hint,
    failureTail: passed ? null : tailLines,
  })
}

const earnedWeight = results
  .filter((r) => r.passed)
  .reduce((acc, r) => acc + r.weight, 0)
const score = Math.round((earnedWeight / totalWeight) * 100)
const allPassed = results.every((r) => r.passed)
const totalDurationMs = results.reduce((acc, r) => acc + r.durationMs, 0)

const summary = {
  verdict: allPassed ? 'PASS' : 'FAIL',
  score,
  totalDurationMs,
  gates: results,
}

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(`\n=== VERIFY LOOP: ${summary.verdict} | Score: ${score}/100 (${(totalDurationMs / 1000).toFixed(1)}s) ===`)
  for (const r of results) {
    const icon = r.passed ? 'PASS' : 'FAIL'
    console.log(`  [${icon}] ${r.label} (${(r.durationMs / 1000).toFixed(1)}s)`)
    if (!r.passed) {
      console.log(`         Hint: ${r.hint}`)
      if (r.failureTail) {
        console.log('         --- Tail ---')
        for (const line of r.failureTail.split('\n')) {
          console.log(`         ${line}`)
        }
      }
    }
  }
  console.log('')
}

process.exit(allPassed ? 0 : 1)
