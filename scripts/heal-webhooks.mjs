/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Script de Auto-Sanación y Verificación de Webhooks (n8n + Resend).
 * Ejecución: node scripts/heal-webhooks.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

// Carga de variables de entorno locales si existen
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
console.log('  🛡️ AUTO-SANADOR DE WEBHOOKS & RESILIENCIA (n8n & Resend)   ')
console.log('============================================================\n')

const results = []

// 1. Verificar y auto-sanar Resend Webhooks
const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
  results.push({
    servicio: 'Resend Webhooks',
    estado: '⚠️ RESEND_API_KEY no configurada',
    accion: 'Definir en .env.local o Vercel',
  })
} else {
  try {
    const res = await fetch('https://api.resend.com/webhooks', {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    })
    if (res.ok) {
      const body = await res.json()
      const webhooks = body?.data || []
      let reactivated = 0
      let activeCount = 0

      for (const wh of webhooks) {
        const status = wh.status?.toLowerCase()
        if (status === 'active' || status === 'enabled') {
          activeCount++
        } else if (wh.id) {
          // Intentar reactivar automáticamente
          const patchRes = await fetch(`https://api.resend.com/webhooks/${wh.id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'enabled' }),
          })
          if (patchRes.ok) {
            reactivated++
          }
        }
      }

      results.push({
        servicio: 'Resend Webhooks',
        estado: `✅ ${activeCount + reactivated}/${webhooks.length} ACTIVOS`,
        accion: reactivated > 0 ? `Reactivados auto: ${reactivated}` : 'Salud óptima',
      })
    } else {
      results.push({
        servicio: 'Resend Webhooks',
        estado: `❌ Error API ${res.status}`,
        accion: 'Verificar permisos de API Key',
      })
    }
  } catch (err) {
    results.push({
      servicio: 'Resend Webhooks',
      estado: '❌ Error de red',
      accion: err.message,
    })
  }
}

// 2. Verificar y auto-sanar n8n Webhook
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
const n8nApiKey = process.env.N8N_API_KEY

if (!n8nWebhookUrl) {
  results.push({
    servicio: 'n8n Webhook',
    estado: '⚠️ N8N_WEBHOOK_URL no configurada',
    accion: 'Modo Serverless Fallback activo automáticamente',
  })
} else {
  try {
    const started = performance.now()
    const pingRes = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'ping.keepalive',
        source: 'heal_script',
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    })
    const latency = Math.round(performance.now() - started)

    if (pingRes.ok) {
      results.push({
        servicio: 'n8n Webhook',
        estado: `✅ ACTIVO (${latency}ms)`,
        accion: 'Webhook respondiendo correctamente',
      })
    } else if (pingRes.status === 404) {
      // 404 significa que el workflow está desactivado en n8n
      if (n8nApiKey) {
        const urlObj = new URL(n8nWebhookUrl)
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`
        const listRes = await fetch(`${baseUrl}/api/v1/workflows?limit=50`, {
          headers: { 'X-N8N-API-KEY': n8nApiKey },
        })
        if (listRes.ok) {
          const listData = await listRes.json()
          let healed = false
          for (const wf of listData?.data || []) {
            if (!wf.active) {
              const actRes = await fetch(`${baseUrl}/api/v1/workflows/${wf.id}/activate`, {
                method: 'POST',
                headers: { 'X-N8N-API-KEY': n8nApiKey },
              })
              if (actRes.ok) healed = true
            }
          }
          results.push({
            servicio: 'n8n Webhook',
            estado: healed ? '✅ REACTIVADO AUTOMÁTICAMENTE' : '⚠️ 404 DESACTIVADO',
            accion: healed ? 'Workflow activado vía API' : 'Revisar workflow en n8n',
          })
        }
      } else {
        results.push({
          servicio: 'n8n Webhook',
          estado: '⚠️ 404 (Workflow Inactivo)',
          accion: 'Activá el workflow en n8n o agregá N8N_API_KEY para auto-activación',
        })
      }
    } else {
      results.push({
        servicio: 'n8n Webhook',
        estado: `⚠️ HTTP ${pingRes.status}`,
        accion: 'Motor Serverless Fallback protege la captura de clientes',
      })
    }
  } catch (err) {
    results.push({
      servicio: 'n8n Webhook',
      estado: '⚠️ Inalcanzable (Timeout o Dormido)',
      accion: 'Motor Serverless Fallback activo sin costo',
    })
  }
}

console.table(results)
console.log('\n------------------------------------------------------------')
console.log('  Modo "Gratis" 100% Protegido:')
console.log('  Si n8n o Resend se desactivan, el motor Serverless de')
console.log('  Next.js captura leads y envía los correos sin interrupciones.')
console.log('------------------------------------------------------------\n')
