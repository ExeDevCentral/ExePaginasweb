import fs from 'node:fs'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'supabase/migrations')

function checkMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`[ERR] Migrations directory not found: ${MIGRATIONS_DIR}`)
    process.exit(1)
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  console.log(`\n🔍 Auditing ${files.length} Supabase SQL migration files...\n`)

  let totalWarnings = 0
  let totalErrors = 0

  // Combine full SQL content across all files for cross-file RLS definition checks
  const fullSqlContent = files
    .map((f) => fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8'))
    .join('\n\n')

  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')

    const fileIssues = []

    // 1. Check for CREATE TABLE without ENABLE ROW LEVEL SECURITY across all migration files
    const createTableMatches = [
      ...content.matchAll(/CREATE\ TABLE\s+(IF\ NOT\ EXISTS\s+)?([a-zA-Z0-9_\.]+)/gi),
    ]
    for (const match of createTableMatches) {
      const rawTableName = match[2]
      const tableName = rawTableName.replace(/^public\./i, '').replace(/"/g, '')

      // Check if ENABLE ROW LEVEL SECURITY is executed in this file or any subsequent migration file
      const rlsRegex = new RegExp(
        `ALTER\\s+TABLE\\s+("${tableName}"|public\\.${tableName}|${tableName})\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`,
        'i'
      )
      if (!rlsRegex.test(fullSqlContent) && !rlsRegex.test(content)) {
        fileIssues.push({
          type: 'ERROR',
          message: `Table '${tableName}' is missing RLS ('ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;').`,
        })
        totalErrors++
      }
    }

    // 2. Check for SECURITY DEFINER without search_path
    const funcMatches = [
      ...content.matchAll(
        /CREATE\s+(OR\s+REPLACE\s+)?FUNCTION[\s\S]*?SECURITY\s+DEFINER[\s\S]*?LANGUAGE/gi
      ),
    ]
    for (const funcMatch of funcMatches) {
      if (!/SET\s+search_path\s*=/i.test(funcMatch[0])) {
        fileIssues.push({
          type: 'WARN',
          message: `SECURITY DEFINER function missing explicit 'SET search_path = ""' or 'SET search_path = public'.`,
        })
        totalWarnings++
      }
    }

    // 3. Check for destructive DROP TABLE / DROP COLUMN
    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (/^DROP\s+TABLE\b/i.test(trimmed) && !trimmed.startsWith('--')) {
        fileIssues.push({
          type: 'WARN',
          message: `Line ${idx + 1}: Destructive 'DROP TABLE' statement detected: '${trimmed}'.`,
        })
        totalWarnings++
      }
      if (/ALTER\s+TABLE.*DROP\s+COLUMN\b/i.test(trimmed) && !trimmed.startsWith('--')) {
        fileIssues.push({
          type: 'WARN',
          message: `Line ${idx + 1}: Destructive 'DROP COLUMN' statement detected: '${trimmed}'.`,
        })
        totalWarnings++
      }
    })

    if (fileIssues.length > 0) {
      console.log(`📄 ${file}:`)
      for (const issue of fileIssues) {
        const icon = issue.type === 'ERROR' ? '❌ [ERROR]' : '⚠️ [WARN]'
        console.log(`   ${icon} ${issue.message}`)
      }
      console.log('')
    }
  }

  console.log(`--------------------------------------------------`)
  console.log(`✅ Audit complete: ${files.length} files scanned.`)
  console.log(`   Errors: ${totalErrors} | Warnings: ${totalWarnings}\n`)

  if (totalErrors > 0) {
    process.exit(1)
  }
}

checkMigrations()
