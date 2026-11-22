#!/usr/bin/env node
/**
 * Physical Guardrails Auditor (Pillar 3)
 *
 * Enforces hard architectural & safety barriers so autonomous agents
 * cannot silently introduce anti-patterns, bypassed types, or secrets.
 *
 * Usage:
 *   node scripts/audit-guardrails.mjs            # Full scan of src/ and app/
 *   node scripts/audit-guardrails.mjs --changed  # Strict scan on git-changed files
 *   node scripts/audit-guardrails.mjs --json     # Machine-readable JSON output
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = new Set(process.argv.slice(2))
const changedOnly = args.has('--changed')
const jsonMode = args.has('--json')

const ROOT = process.cwd()
const TARGET_DIRS = ['src', 'app']
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
const IGNORE_FRAGMENTS = [
  'node_modules/',
  '.next/',
  'dist/',
  'src/components/ui/reactdrops/',
  '.test.',
  '.spec.',
]

/**
 * Hard rules always fail the build (severity: 'error').
 * Strict-on-changed rules fail when introduced in modified/new files,
 * and warn on legacy untouched files so adoption is zero-friction.
 */
const RULES = [
  {
    id: 'no-ts-suppression',
    severity: 'error',
    pattern: /@ts-(?:ignore|nocheck)\b/g,
    message:
      'Prohibido silenciar TypeScript con @ts-ignore / @ts-nocheck. Corregí el tipo o usá @ts-expect-error justificado.',
  },
  {
    id: 'no-debugger',
    severity: 'error',
    pattern: /\bdebugger\b/g,
    message: 'Prohibido dejar sentencias debugger en el código.',
  },
  {
    id: 'no-hardcoded-secrets',
    severity: 'error',
    pattern: /\b(?:sk_live_[A-Za-z0-9]{16,}|re_live_[A-Za-z0-9]{16,}|gsk_[A-Za-z0-9]{20,}|sb_secret_[A-Za-z0-9_-]{16,}|AIzaSy[A-Za-z0-9_-]{30,})\b/g,
    message: 'Posible secreto/API key hardcodeada. Movelo a variables de entorno.',
  },
  {
    id: 'no-unjustified-use-effect',
    severity: changedOnly ? 'error' : 'warn',
    pattern: /\buseEffect\s*\(/g,
    allowLinePattern: /guardrail-ok\(useEffect\):/,
    message:
      'Evitá useEffect innecesario (preferí estado derivado, Server Components, event handlers o TanStack Query). Si es estrictamente necesario (DOM/suscripción externa), agregá `// guardrail-ok(useEffect): <motivo>` en la misma línea o la anterior.',
  },
  {
    id: 'no-prod-console-log',
    severity: changedOnly ? 'error' : 'warn',
    pattern: /\bconsole\.log\s*\(/g,
    allowLinePattern: /guardrail-ok\(console\):/,
    message:
      'Evitá console.log en código de producción (usá logger estructurado o console.error/warn según corresponda).',
  },
]

function shouldIgnore(relPath) {
  const normalized = relPath.replace(/\\/g, '/')
  if (!CODE_EXTENSIONS.has(path.extname(normalized))) return true
  if (IGNORE_FRAGMENTS.some((frag) => normalized.includes(frag))) return true
  return !TARGET_DIRS.some((dir) => normalized.startsWith(`${dir}/`))
}

function collectAllFiles(dir, acc = []) {
  const fullDir = path.join(ROOT, dir)
  if (!fs.existsSync(fullDir)) return acc
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectAllFiles(rel, acc)
    } else if (!shouldIgnore(rel)) {
      acc.push(rel)
    }
  }
  return acc
}

function collectChangedFiles() {
  try {
    const out = execSync(
      'git diff --name-only --diff-filter=ACMR HEAD && git ls-files --others --exclude-standard',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    )
    const unique = new Set(
      out
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((rel) => !shouldIgnore(rel))
        .filter((rel) => fs.existsSync(path.join(ROOT, rel))),
    )
    return [...unique]
  } catch {
    return []
  }
}

function scanFile(relPath) {
  const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8')
  const lines = content.split('\n')
  const findings = []

  for (const rule of RULES) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const prevLine = i > 0 ? lines[i - 1] : ''
      rule.pattern.lastIndex = 0
      if (!rule.pattern.test(line)) continue

      if (
        rule.allowLinePattern &&
        (rule.allowLinePattern.test(line) || rule.allowLinePattern.test(prevLine))
      ) {
        continue
      }

      findings.push({
        file: relPath,
        line: i + 1,
        rule: rule.id,
        severity: rule.severity,
        message: rule.message,
        snippet: line.trim().slice(0, 120),
      })
    }
  }

  return findings
}

const files = changedOnly
  ? collectChangedFiles()
  : TARGET_DIRS.flatMap((dir) => collectAllFiles(dir))

const findings = files.flatMap(scanFile)
const errors = findings.filter((f) => f.severity === 'error')
const warnings = findings.filter((f) => f.severity === 'warn')

const result = {
  mode: changedOnly ? 'changed' : 'full',
  scannedFiles: files.length,
  errorsCount: errors.length,
  warningsCount: warnings.length,
  passed: errors.length === 0,
  findings,
}

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2))
} else {
  const status = result.passed ? 'PASS' : 'FAIL'
  console.log(
    `[guardrails] ${status} (${result.mode}) — ${result.scannedFiles} archivos escaneados | ${errors.length} errores | ${warnings.length} warnings`,
  )
  for (const f of findings.slice(0, 40)) {
    const tag = f.severity === 'error' ? 'ERROR' : 'WARN '
    console.log(`  [${tag}] ${f.file}:${f.line} (${f.rule}) — ${f.message}`)
  }
  if (findings.length > 40) {
    console.log(`  ... y ${findings.length - 40} hallazgos más (usá --json para ver todos).`)
  }
}

process.exit(result.passed ? 0 : 1)
