#!/usr/bin/env node
/**
 * Auditoría i18n: paridad de keys entre locales, keys usadas inexistentes,
 * y defaults inline en t('key','default') (anti-patrón de hardcode).
 *
 * Usage:
 *   node scripts/audit-i18n.mjs
 *   node scripts/audit-i18n.mjs --json
 *   node scripts/audit-i18n.mjs --strict-defaults  # falla si hay t(key,default)
 */
import fs from 'node:fs'
import path from 'node:path'

const args = new Set(process.argv.slice(2))
const jsonMode = args.has('--json')
const strictDefaults = args.has('--strict-defaults')
const ROOT = process.cwd()
const LOCALES_DIR = path.join(ROOT, 'src/core/i18n/locales')
const CANON = 'es.json'
const LOCALE_FILES = ['es.json', 'en.json', 'pt-BR.json', 'ar.json', 'de.json', 'fr.json', 'zh-CN.json']
const CODE_DIRS = ['src', 'app']
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
const IGNORE = ['node_modules/', '.next/', 'dist/', '.test.', '.spec.', 'src/components/ui/reactdrops/']

function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out)
    else out.set(key, v)
  }
  return out
}

function walk(dir, acc = []) {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) return acc
  for (const e of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, e.name).replace(/\\/g, '/')
    if (IGNORE.some((f) => rel.includes(f))) continue
    if (e.isDirectory()) walk(rel, acc)
    else if (EXT.has(path.extname(rel))) acc.push(rel)
  }
  return acc
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'))
}

const canon = flatten(readJson(CANON))
const canonKeys = new Set(canon.keys())

const parityIssues = []
for (const file of LOCALE_FILES) {
  if (file === CANON) continue
  const flat = flatten(readJson(file))
  for (const k of canonKeys) if (!flat.has(k)) parityIssues.push({ type: 'missing', locale: file, key: k })
  for (const k of flat.keys()) if (!canonKeys.has(k)) parityIssues.push({ type: 'extra', locale: file, key: k })
}

const files = CODE_DIRS.flatMap((d) => walk(d))
// Match t('key') / t("key") / t('key', 'default') / t("key", "default") / i18n.t(...)
const keyRe = /\b(?:t|i18n\.t)\(\s*(['"])([A-Za-z0-9_.:-]+)\1/gm
const defaultRe = /\b(?:t|i18n\.t)\(\s*(['"])([A-Za-z0-9_.:-]+)\1\s*,\s*(['"`])/gm

const usedKeys = new Map() // key -> [locations]
const inlineDefaults = []
for (const rel of files) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  for (const m of content.matchAll(keyRe)) {
    const key = m[2]
    if (!key.includes('.') && key.length < 3) continue // skip noise like t('x')
    const line = content.slice(0, m.index).split('\n').length
    const arr = usedKeys.get(key) || []
    if (arr.length < 5) arr.push(`${rel}:${line}`)
    usedKeys.set(key, arr)
  }
  for (const m of content.matchAll(defaultRe)) {
    const line = content.slice(0, m.index).split('\n').length
    inlineDefaults.push({ file: rel, line, key: m[2] })
  }
}

const missingInCanon = []
for (const [key, locs] of usedKeys) {
  // skip template/dynamic-looking keys
  if (key.includes('${') || key.endsWith('.')) continue
  if (!canonKeys.has(key)) missingInCanon.push({ key, locations: locs })
}

const result = {
  locales: LOCALE_FILES,
  canonKeys: canonKeys.size,
  usedKeys: usedKeys.size,
  parityIssues: parityIssues.slice(0, 200),
  parityIssuesCount: parityIssues.length,
  missingInCanon: missingInCanon.slice(0, 200),
  missingInCanonCount: missingInCanon.length,
  inlineDefaultsCount: inlineDefaults.length,
  inlineDefaults: inlineDefaults.slice(0, 100),
}

const errors = []
if (parityIssues.length) errors.push(`parity:${parityIssues.length}`)
if (missingInCanon.length) errors.push(`missing-in-canon:${missingInCanon.length}`)
if (strictDefaults && inlineDefaults.length) errors.push(`inline-defaults:${inlineDefaults.length}`)

result.passed = errors.length === 0
result.errors = errors

if (jsonMode) console.log(JSON.stringify(result, null, 2))
else {
  console.log(`[i18n] ${result.passed ? 'PASS' : 'FAIL'} — canon=${canonKeys.size} used=${usedKeys.size} parity=${parityIssues.length} missing=${missingInCanon.length} inlineDefaults=${inlineDefaults.length}`)
  for (const i of parityIssues.slice(0, 30)) console.log(`  [PARITY ${i.type}] ${i.locale} :: ${i.key}`)
  for (const i of missingInCanon.slice(0, 30)) console.log(`  [MISSING] ${i.key} @ ${i.locations[0]}`)
  if (inlineDefaults.length) console.log(`  [STYLE] ${inlineDefaults.length} t(key, default) inline defaults (anti-patrón). Ejecutá codemod:remove-i18n-defaults.`)
  if (!result.passed) process.exit(1)
}
