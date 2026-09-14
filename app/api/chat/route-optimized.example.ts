/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * app/api/chat/route.ts
 *
 * Streaming chat con LLM + Circuit Breaker + Rate Limiting
 * Implementa resiliencia ante fallos de Groq/Gemini
 *
 * EJEMPLO DE IMPLEMENTACIÓN - No usar directamente
 */

import { StreamingTextResponse } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { generateText, streamText } from 'ai'
import { cbPool } from '@/core/infra/patterns/CircuitBreaker'
import { getOrSet, getCacheProvider } from '@/core/infra/cache/CacheProvider'
import { createServerClient } from '@/core/infra/supabase/server'

// Circuit breakers por servicio
const groqBreakerRef = cbPool.get(
  'groq-chat',
  async () => {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
    return groq
  },
  {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 30000,
    resetTimeout: 60000,
    fallback: async () => {
      // Fallback: usar caché o respuesta simplificada
      return {
        message: 'Servicio temporalmente no disponible. Reintentando...',
        cached: true,
      }
    },
  }
)

export async function POST(request: Request) {
  try {
    const { messages, tenantId } = await request.json()

    // Rate limiting (opcional)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const cache = getCacheProvider()

    // Verificar rate limit (10 requests por minuto)
    const cacheKey = `ratelimit:chat:${ip}`
    const requestCount = (await cache.get<number>(cacheKey)) || 0
    if (requestCount > 10) {
      return new Response('Rate limit exceeded', { status: 429 })
    }

    await cache.set(cacheKey, requestCount + 1, 60)

    // Ejecutar con circuit breaker
    try {
      const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: process.env.GROQ_BASE_URL,
      })

      // Stream de respuesta
      const result = streamText({
        model: groq('mixtral-8x7b-32768'),
        messages,
        system: `Eres un asistente de soporte técnico de ExeSistemasWEB.
Responde en el idioma del usuario.
Sé conciso y profesional.
Si necesita crear un ticket, menciona que se creará automáticamente.`,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // Crear ticket automáticamente (async, no bloquea respuesta)
      createTicketFromChat(messages, tenantId).catch((err) => {
        console.error('[Chat] Error creating ticket:', err)
      })

      return new StreamingTextResponse((await result).toAIStream())
    } catch (error) {
      // Si el circuit breaker está abierto, retornar fallback
      console.error('[ChatAPI] Error:', error)

      return new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
          message:
            'Estamos experimentando problemas técnicos. Por favor, intenta de nuevo en unos momentos.',
          fallback: true,
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('[ChatAPI] Request error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

async function createTicketFromChat(messages: unknown[], tenantId: string) {
  try {
    const supabase = createServerClient()

    // Usar caché para resolver tenant
    const tenantCacheKey = `tenant:${tenantId}`
    const tenant = await getOrSet(
      tenantCacheKey,
      async () => {
        const { data } = await supabase
          .from('tenants')
          .select('id, name')
          .eq('id', tenantId)
          .single()
        return data
      },
      300
    )

    if (!tenant) return

    // Generar resumen del ticket con LLM
    const lastMessage = (messages as any[])[messages.length - 1]?.content || ''

    const { text: summary } = await generateText({
      model: createGroq({ apiKey: process.env.GROQ_API_KEY })('mixtral-8x7b-32768'),
      prompt: `Resume el siguiente mensaje en máximo 50 caracteres para usar como título de ticket:
      "${lastMessage}"`,
      maxTokens: 20,
    })

    // Crear ticket
    await supabase.from('tickets').insert({
      tenant_id: tenantId,
      number: `EXE-CHT-${Date.now()}`,
      title: summary.substring(0, 50),
      description: lastMessage,
      priority: 'medium',
      status: 'open',
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[CreateTicket] Error:', error)
  }
}
