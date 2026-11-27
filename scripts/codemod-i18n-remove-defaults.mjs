#!/usr/bin/env node
/**
 * Codemod: elimina el default inline de t('key', 'default') / t("key","default")
 * cuando la key existe en el locale canónico (es.json).
 * Uso: node scripts/codemod-i18n-remove-defaults.mjs [--dry]
 */
import fs from 'node:fs'
import path from 'node:path'

const dry = process.argv.includes('--dry')
const ROOT = process.cwd()
const canon = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/core/i18n/locales/es.json'), 'utf8'))
function hasKey(obj, key) {
  const parts = key.split('.')
  let cur = obj
  for (const p of parts) { if (!cur || typeof cur !== 'object' || !(p in cur)) return false; cur = cur[p] }
  return typeof cur === 'string'
}

const CODE_DIRS = ['src', 'app']
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
const IGNORE = ['node_modules/', '.next/', 'dist/', '.test.', '.spec.', 'src/components/ui/reactdrops/']

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

// Matches t('key', 'default') or t("key", "default") or t('key', `default`)
// Handles simple string defaults (no nested parens issues in common cases)
const re = /\b(t\(\s*)(['"])([A-Za-z0-9_.:-]+)\2\s*,\s*(?:'(?:(?:\\.)|[^'\\])*'|"(?:(?:\\.)|[^"\\])*"|`(?:(?:\\.)|[^`\\])*`)(\s*\))/g

let filesChanged = 0, replacements = 0
for (const rel of CODE_DIRS.flatMap(d=>walk(d))) {
  const p = path.join(ROOT, rel)
  let s = fs.readFileSync(p, 'utf8')
  let fileRepl = 0
  s = s.replace(re, (m, pre, q, key, post) => {
    if (!hasKey(canon, key)) return m
    fileRepl++; replacements++; return `${pre}${q}${key}${q}${post}`
  })
  if (fileRepl) { filesChanged++; if (!dry) fs.writeFileSync(p, s); console.log(`${dry?'DRY':'OK'} ${rel} (${fileRepl})`) }
}
console.log(`[codemod-i18n-remove-defaults] ${dry?'DRY':''} files=${filesChanged} replacements=${replacements}`)
