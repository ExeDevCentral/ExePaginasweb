#!/usr/bin/env node
/**
 * Adds a copyright header to all supported source files in the repo.
 *
 * Idempotent: files that already contain a copyright notice are skipped.
 * Preserves shebang lines (e.g. #!/usr/bin/env node).
 *
 * Usage: node scripts/add-copyright-headers.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const HEADER = `/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */`;

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.sql']);

const ROOT = new URL('..', import.meta.url).pathname;

// On Windows import.meta.url uses /C:/...; normalize to a workable path.
const root = ROOT.startsWith('/') && /^\/[A-Za-z]:/.test(ROOT) ? ROOT.slice(1) : ROOT;

const DIRS = [
  join(root, 'app'),
  join(root, 'src'),
  join(root, 'lib'),
  join(root, 'tests'),
  join(root, 'scripts'),
  join(root, 'supabase', 'migrations'),
  join(root, 'web-automation-cli', 'src'),
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
      yield* walk(full);
    } else if (entry.isFile() && EXTENSIONS.has(extname(entry.name))) {
      yield full;
    }
  }
}

let added = 0;
let skipped = 0;

for (const dir of DIRS) {
  if (!statSync(dir, { throwIfNoEntry: false })) continue;

  for (const file of walk(dir)) {
    let content = readFileSync(file, 'utf8');
    if (content.includes('© 2026 Exequiel Echevarria')) {
      skipped++;
      continue;
    }

    const match = content.match(/^#![^\n]*\n?/);
    const shebang = match ? match[0] : '';
    const body = match ? content.slice(match[0].length) : content;

    content = `${shebang}${HEADER}\n${body}`;
    writeFileSync(file, content);
    added++;
    console.log(`+ ${file.replace(root + '\\', '').replace(root + '/', '')}`);
  }
}

console.log(`\nHeaders added: ${added} | Already present (skipped): ${skipped}`);