#!/usr/bin/env node
/**
 * Architectural Import Boundaries Enforcer (Arquitectura Dune)
 *
 * "Camino más corto = Camino correcto":
 * Enforces which layer can depend on which, so autonomous agents are
 * physically blocked from creating spaghetti cross-layer imports.
 *
 * Usage:
 *   node scripts/audit-imports.mjs            # Full scan of src/ and app/
 *   node scripts/audit-imports.mjs --changed  # Scan only git-changed files
 *   node scripts/audit-imports.mjs --json     # Machine-readable JSON output
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const args = new Set(process.argv.slice(2))
const changedOnly = args.has('--changed')
const jsonMode = args.has('--json')

const ROOT = process.cwd()
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
 * Layer boundary contracts:
 * Each rule specifies a source layer prefix and forbidden import targets.
 */
const BOUNDARY_RULES = [
  {
    id: 'domain-must-be-pure',
    fromPrefixes: ['src/core/domain/'],
    forbiddenTargets: [
      { match: /^react(?:\/|$)/, reason: 'El dominio debe ser TypeScript puro, sin React.' },
      { match: /^react-dom(?:\/|$)/, reason: 'El dominio debe ser TypeScript puro, sin react-dom.' },
      { match: /^next(?:\/|$)/, reason: 'El dominio no puede acoplarse al framework Next.js.' },
      { match: /^@supabase\//, reason: 'El dominio no puede importar clientes Supabase (usá interfaces de repositorio).' },
      { match: /\/core\/infra(?:\/|$)|^@\/core\/infra(?:\/|$)/, reason: 'El dominio no puede depender de infra (inversión de dependencias).' },
      { match: /\/components(?:\/|$)|^@\/components(?:\/|$)/, reason: 'El dominio no puede importar componentes UI.' },
      { match: /\/views(?:\/|$)|^@\/views(?:\/|$)/, reason: 'El dominio no puede importar vistas UI.' },
      { match: /\/faces(?:\/|$)|^@\/faces(?:\/|$)/, reason: 'El dominio no puede importar faces UI.' },
      { match: /\/hooks(?:\/|$)|^@\/hooks(?:\/|$)/, reason: 'El dominio no puede importar hooks de cliente.' },
      { match: /^app\/|\/app\/api\//, reason: 'El dominio no puede importar rutas de app/.' },
    ],
  },
  {
    id: 'ui-no-direct-repos-or-api-routes',
    fromPrefixes: ['src/components/', 'src/views/', 'src/faces/'],
    forbiddenTargets: [
      { match: /\/core\/infra\/repositories(?:\/|$)|^@\/core\/infra\/repositories(?:\/|$)/, reason: 'La UI no puede importar repositorios de DB directamente (pasá por hooks o API).' },
      { match: /^app\/api\/|\/app\/api\//, reason: 'La UI no puede importar código servidor de app/api/.' },
    ],
  },
  {
    id: 'shared-is-leaf-layer',
    fromPrefixes: ['src/shared/'],
    forbiddenTargets: [
      { match: /\/components(?:\/|$)|^@\/components(?:\/|$)/, reason: 'src/shared/ es una capa hoja y no puede importar src/components/.' },
      { match: /\/views(?:\/|$)|^@\/views(?:\/|$)/, reason: 'src/shared/ es una capa hoja y no puede importar src/views/.' },
      { match: /\/faces(?:\/|$)|^@\/faces(?:\/|$)/, reason: 'src/shared/ es una capa hoja y no puede importar src/faces/.' },
      { match: /^app\/|\/app\//, reason: 'src/shared/ no puede importar desde app/.' },
    ],
  },
  {
    id: 'hooks-no-ui-or-api-routes',
    fromPrefixes: ['src/hooks/'],
    forbiddenTargets: [
      { match: /^app\/api\/|\/app\/api\//, reason: 'Los hooks de cliente no pueden importar rutas servidor de app/api/.' },
      { match: /\/components(?:\/|$)|^@\/components(?:\/|$)/, reason: 'Los hooks no deben depender de componentes UI.' },
      { match: /\/views(?:\/|$)|^@\/views(?:\/|$)/, reason: 'Los hooks no deben depender de vistas UI.' },
    ],
  },
]

const IMPORT_REGEX =
  /(?:^|\n)\s*(?:import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?|export\s+(?:type\s+)?[\s\S]*?\s+from\s+)['"]([^'"]+)['"]/g

function shouldIgnore(relPath) {
  const normalized = relPath.replace(/\\/g, '/')
  if (!CODE_EXTENSIONS.has(path.extname(normalized))) return true
  if (IGNORE_FRAGMENTS.some((frag) => normalized.includes(frag))) return true
  return !normalized.startsWith('src/') && !normalized.startsWith('app/')
}

function collectAllFiles(dir, acc = []) {
  const fullDir = path.join(ROOT, dir)
  if (!fs.existsSync(fullDir)) return acc
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectAllFiles(rel, acc)
    } else if (!shouldIgnore(rel)) {
      acc.push(rel.replace(/\\/g, '/'))
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
    return [
      ...new Set(
        out
          .split('\n')
          .map((l) => l.trim().replace(/\\/g, '/'))
          .filter(Boolean)
          .filter((rel) => !shouldIgnore(rel))
          .filter((rel) => fs.existsSync(path.join(ROOT, rel))),
      ),
    ]
  } catch {
    return []
  }
}

function resolveImportSpecifier(fromRelPath, specifier) {
  if (!specifier.startsWith('.')) return specifier
  const resolved = path.posix.normalize(
    path.posix.join(path.posix.dirname(fromRelPath), specifier),
  )
  return `/${resolved}`
}

function scanFile(relPath) {
  const applicableRules = BOUNDARY_RULES.filter((rule) =>
    rule.fromPrefixes.some((prefix) => relPath.startsWith(prefix)),
  )
  if (applicableRules.length === 0) return []

  const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8')
  const findings = []

  IMPORT_REGEX.lastIndex = 0
  let match
  while ((match = IMPORT_REGEX.exec(content)) !== null) {
    const rawSpecifier = match[1]
    const resolvedTarget = resolveImportSpecifier(relPath, rawSpecifier)
    const lineNum = content.slice(0, match.index).split('\n').length

    for (const rule of applicableRules) {
      for (const forbidden of rule.forbiddenTargets) {
        if (forbidden.match.test(rawSpecifier) || forbidden.match.test(resolvedTarget)) {
          findings.push({
            file: relPath,
            line: lineNum,
            rule: rule.id,
            specifier: rawSpecifier,
            reason: forbidden.reason,
          })
        }
      }
    }
  }

  return findings
}

const files = changedOnly
  ? collectChangedFiles()
  : ['src', 'app'].flatMap((dir) => collectAllFiles(dir))

const violations = files.flatMap(scanFile)
const passed = violations.length === 0

const result = {
  mode: changedOnly ? 'changed' : 'full',
  scannedFiles: files.length,
  violationsCount: violations.length,
  passed,
  violations,
}

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2))
} else {
  const status = passed ? 'PASS' : 'FAIL'
  console.log(
    `[imports] ${status} (${result.mode}) — ${result.scannedFiles} archivos escaneados | ${violations.length} violaciones de frontera`,
  )
  for (const v of violations) {
    console.log(`  [BLOCK] ${v.file}:${v.line} (${v.rule}) import '${v.specifier}' — ${v.reason}`)
  }
}

process.exit(passed ? 0 : 1)
