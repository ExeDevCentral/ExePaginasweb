/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Script de auditoría y diagnóstico de salud para servicios externos y API Keys.
 * Ejecución: npm run audit:keys
 */

import fs from 'node:fs'
import path from 'node:path'

// Carga defensiva de variables de entorno locales si existen
for (const envFile of ['.env.local', '.env']) {
  const fullPath = path.resolve(process.cwd(), envFile)
  if (fs.existsSync(fullPath)) {
    const lines = fs.readFileSync(fullPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key] && val) {
          process.env[key] = val
        }
      }
    }
  }
}

console.log('\n============================================================')
console.log('  🔍 AUDITORÍA DE SALUD Y SERVICIOS EXTERNOS (ExePaginasWeb)  ')
console.log('============================================================\n')

const results = []

// 1. Google Gemini AI Studio
const geminiKey = process.env.GEMINI_API_KEY
if (!geminiKey) {
  results.push({
    service: 'Google AI (Gemini)',
    status: '⚠️ NO CONFIGURADA',
    detail: 'Fallback local en /api/chat activado automáticamente',
  })
} else {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
    )
    if (res.ok) {
      const data = await res.json()
      results.push({
        service: 'Google AI (Gemini)',
        status: '✅ CONECTADO (200 OK)',
        detail: `${data.models?.length || 0} modelos disponibles (gemini-2.5-flash / pro)`,
      })
    } else {
      results.push({
        service: 'Google AI (Gemini)',
        status: '❌ ERROR HTTP ' + res.status,
        detail: 'Clave rechazada por la API de Google Studio',
      })
    }
  } catch (err) {
    results.push({
      service: 'Google AI (Gemini)',
      status: '❌ ERROR RED',
      detail: err.message,
    })
  }
}

// 2. Supabase Backend / Database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  results.push({
    service: 'Supabase Database',
    status: '⚠️ NO CONFIGURADO',
    detail: 'Modo mock / fallback local activo en desarrollo',
  })
} else {
  const hasKey = Boolean(supabaseServiceKey || supabaseAnonKey)
  if (!hasKey) {
    results.push({
      service: 'Supabase Database',
      status: '⚠️ CLAVE PENDIENTE',
      detail: `URL: ${supabaseUrl} (credenciales en Vercel)`,
    })
  } else {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const client = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
      const { error } = await client.from('leads').select('count', { count: 'exact', head: true })
      if (error && error.code !== 'PGRST116') {
        results.push({
          service: 'Supabase Database',
          status: '⚠️ ERROR CONSULTA',
          detail: error.message,
        })
      } else {
        results.push({
          service: 'Supabase Database',
          status: '✅ CONECTADO (200 OK)',
          detail: `Instancia activa: ${supabaseUrl}`,
        })
      }
    } catch (err) {
      results.push({
        service: 'Supabase Database',
        status: '❌ ERROR CONEXIÓN',
        detail: err.message,
      })
    }
  }
}

// 3. Resend (Emailing)
const resendKey = process.env.RESEND_API_KEY
if (!resendKey) {
  results.push({
    service: 'Resend Emailing',
    status: '⚠️ NO CONFIGURADO',
    detail: 'Simulación segura activa con tickets EXE-CNT generados',
  })
} else {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)
    const domainRes = await resend.domains.list()
    if (domainRes.error) {
      results.push({
        service: 'Resend Emailing',
        status: '❌ ERROR API',
        detail: domainRes.error.message,
      })
    } else {
      results.push({
        service: 'Resend Emailing',
        status: '✅ CONECTADO (200 OK)',
        detail: 'API Key verificada y dominios accesibles',
      })
    }
  } catch (err) {
    results.push({
      service: 'Resend Emailing',
      status: '❌ ERROR CONEXIÓN',
      detail: err.message,
    })
  }
}

// 4. PayPal Checkout & Webhooks
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID
results.push({
  service: 'PayPal Checkout',
  status: paypalClientId ? '✅ CREDENCIALES CARGADAS' : '⚠️ MODO SANDBOX/PREVIEW',
  detail: paypalClientId ? 'Client ID configurado para pasarela' : 'SDK listo para inyección',
})

// Imprimir reporte estructurado
console.table(results)

console.log('\n------------------------------------------------------------')
console.log('  Todos los servicios cuentan con fallback defensivo.')
console.log('  Si falta alguna clave en desarrollo, la web NO se rompe.')
console.log('------------------------------------------------------------\n')
