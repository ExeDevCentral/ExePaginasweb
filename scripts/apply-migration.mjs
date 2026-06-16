/**
 * apply-migration.mjs
 * Ejecuta una migración SQL contra Supabase usando la API REST (service_role key).
 * No necesita la DB password, solo el service role key del .env
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Cargar .env desde la raíz del proyecto
config({ path: join(root, '.env') })
config({ path: join(root, '.env.local'), override: true })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Faltan variables de entorno: VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Leer el archivo SQL a ejecutar
const migrationFile = process.argv[2] || join(root, 'supabase', 'migrations', '011_fix_tickets_and_notifications.sql')
const sql = readFileSync(migrationFile, 'utf-8')

// Eliminar comentarios de línea y bloques vacíos para limpiar
// Supabase REST /rest/v1/rpc no soporta SQL raw, pero sí lo hace el endpoint de management
// Usamos el endpoint SQL de la API de Supabase (disponible con service role)
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0]
const endpoint = `https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`

// Alternativa: usar el endpoint directo de la Supabase Management API
// Dividir el SQL en statements individuales para ejecutar uno a uno
const statements = sql
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`\n📦 Aplicando migración: ${migrationFile}`)
console.log(`🔗 Proyecto: ${projectRef}`)
console.log(`📝 Statements a ejecutar: ${statements.length}\n`)

// Ejecutar usando el endpoint de PostgreSQL via Supabase REST
// Supabase expone /rest/v1/rpc/* para funciones. Para SQL raw necesitamos otro enfoque.
// Usamos fetch contra el DB API de Supabase (pg-meta / admin)
const pgMetaUrl = `https://${projectRef}.supabase.co/pg/query`

async function runSQLViaRPC(sqlText) {
  // Intentar con el endpoint de pg-meta (disponible en proyectos Supabase)
  const res = await fetch(`https://${projectRef}.supabase.co/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    }
  })
  return res.ok
}

// Método principal: usar la función exec via RPC si existe, o crear una función temporal
async function applySQL() {
  // Primero crear una función helper para ejecutar SQL raw
  const createExecFn = `
    CREATE OR REPLACE FUNCTION public._exec_migration(query text)
    RETURNS void AS $$
    BEGIN
      EXECUTE query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `

  // Usar el endpoint de Supabase Management API (database/query)
  // Este endpoint acepta SQL raw con el service role key
  const baseUrl = `https://${projectRef}.supabase.co`

  // Intentar con pg-meta API
  const fullSQL = sql

  const res = await fetch(`${baseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ query: fullSQL }),
  })

  if (res.ok) {
    console.log('✅ Migración aplicada via RPC exec_sql')
    return true
  }

  console.log(`⚠️  exec_sql no disponible (${res.status}), intentando método alternativo...`)
  return false
}

// Método fallback: usar supabase CLI db execute si está disponible
import { execSync } from 'child_process'

async function applyViaFetch() {
  // Supabase tiene un endpoint de SQL directo en su API interna
  // Intentamos con el endpoint correcto para proyectos hosted
  const projectRef2 = SUPABASE_URL.replace('https://', '').split('.')[0]

  // El endpoint real para ejecutar SQL con service role
  const url = `https://${projectRef2}.supabase.co/rest/v1/rpc/exec`

  // Construir un payload que ejecute el SQL completo
  // Alternativa más robusta: dividir y ejecutar statement por statement
  let successCount = 0
  let errorCount = 0
  const errors = []

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    if (!stmt || stmt.startsWith('--')) continue

    process.stdout.write(`  [${i + 1}/${statements.length}] Ejecutando... `)

    try {
      // Usar la función exec si existe en el proyecto
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ sql: stmt }),
      })

      if (res.status < 400) {
        console.log('✅')
        successCount++
      } else {
        const body = await res.text()
        console.log(`⚠️  status ${res.status}`)
        errors.push({ stmt: stmt.substring(0, 80), error: body })
        errorCount++
      }
    } catch (e) {
      console.log('❌ Error de red')
      errors.push({ stmt: stmt.substring(0, 80), error: e.message })
      errorCount++
    }
  }

  return { successCount, errorCount, errors }
}

// ── Método principal: usar supabase CLI con --db-url o stdin ──
async function runViaCLI() {
  console.log('🔧 Intentando con supabase CLI...\n')

  try {
    // Supabase CLI v2: supabase db execute --file <file> --db-url <url>
    // La DB URL con service role no requiere password
    // Otra opción: usar psql si está disponible
    const result = execSync(
      `supabase db execute --file "supabase/migrations/011_fix_tickets_and_notifications.sql" --project-ref ${projectRef}`,
      {
        cwd: root,
        env: {
          ...process.env,
          SUPABASE_ACCESS_TOKEN: SERVICE_ROLE_KEY,
        },
        encoding: 'utf-8',
        timeout: 60000,
      }
    )
    console.log('✅ CLI ejecutado:\n', result)
    return true
  } catch (e) {
    console.log('⚠️  supabase db execute falló:', e.message?.split('\n')[0])
    return false
  }
}

// ── Método 3: Node fetch al Management API ──
async function runViaManagementAPI() {
  console.log('\n🔧 Intentando con Supabase Management API...\n')

  const projectRef3 = SUPABASE_URL.replace('https://', '').split('.')[0]

  // Management API: POST /v1/projects/{ref}/database/query
  const url = `https://api.supabase.com/v1/projects/${projectRef3}/database/query`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  const body = await res.text()
  let parsed
  try { parsed = JSON.parse(body) } catch { parsed = body }

  if (res.ok) {
    console.log('✅ Management API: migración aplicada exitosamente')
    console.log('Resultado:', JSON.stringify(parsed, null, 2).substring(0, 300))
    return true
  }

  console.log(`❌ Management API respondió ${res.status}:`, body.substring(0, 300))
  return false
}

// ── Ejecutar en orden de preferencia ──
;(async () => {
  // Primero intentar CLI
  const cliOk = await runViaCLI()
  if (cliOk) process.exit(0)

  // Luego Management API
  const apiOk = await runViaManagementAPI()
  if (apiOk) process.exit(0)

  // Si ninguno funcionó, dar instrucciones
  console.log('\n📋 INSTRUCCIÓN MANUAL REQUERIDA')
  console.log('─'.repeat(50))
  console.log('Ningún método automático funcionó.')
  console.log(`\nCopiá y pegá el contenido de:\n  ${migrationFile}`)
  console.log('\nEn el SQL Editor de Supabase:')
  console.log(`  https://${projectRef}.supabase.co/project/${projectRef}/sql/new`)
  process.exit(1)
})()
