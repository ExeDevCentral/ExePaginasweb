import { z } from 'zod';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10; // Reducido para producción (10 mensajes por minuto)

const requestLog = new Map();

// Schema de validación con Zod
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1500),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).nullish()
});

const DEV_FALLBACK_RESPONSES = [
  {
    keywords: ['hola', 'buenas', 'hey', 'saludos'],
    response: '¡Hola! 👋 Soy el asistente de ExeSistemasWEB. Estoy aquí para ayudarte con tu proyecto web.'
  },
  {
    keywords: ['precio', 'costo', 'cuanto', 'valor', 'presupuesto'],
    response: '💰 Landings profesionales desde $200 USD, tiendas desde $500 USD. ¿Quieres un presupuesto?'
  },
  {
    keywords: ['contacto', 'whatsapp', 'hablar'],
    response: '📬 Contacto: Exemetal@hotmail.com o WhatsApp +54 9 341 6874786.'
  }
];

function getDevFallbackResponse(message) {
  const lowerMsg = message.toLowerCase();
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some(kw => lowerMsg.includes(kw))) return item.response;
  }
  return `🤖 Entiendo que preguntaste sobre: "${message}". Contactanos por WhatsApp al +54 9 341 6874786 para una respuesta inmediata.`;
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const previous = requestLog.get(ip) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

function setCorsHeaders(res) {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.' });
  }
  
  // Validación con Zod
  const validation = ChatRequestSchema.safeParse(req.body);
  if (!validation.success) {
    console.error('[chat] Error de validación:', validation.error.format());
    return res.status(400).json({ error: 'Datos de mensaje inválidos.', details: validation.error.format() });
  }
  const { message: userMessage, history: rawHistory } = validation.data;
  const history = rawHistory || [];
  const apiKey = process.env.GROQ_API_KEY;
  const defaultModel = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

  if (!apiKey) {
    console.log('[chat] Modo desarrollo: usando fallback local');
    const fallbackReply = getDevFallbackResponse(userMessage);
    return res.status(200).json({ reply: fallbackReply, fallback: true });
  }

  const modelsToTry = [...new Set([defaultModel, 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'])];
  let lastError = null;
  const abortController = new AbortController();
  res.on('close', () => abortController.abort());

  for (const tryModel of modelsToTry) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: abortController.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: tryModel,
          messages: [
            {
              role: 'system',
              content: 'Eres el asistente oficial de ExeSistemasWEB. Ofreces servicios de desarrollo web (Landings desde $200 USD, Tiendas desde $500 USD). Responde en español de Argentina/Latinoamérica, de forma profesional pero cercana.'
            },
            ...history,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.6,
          max_tokens: 400,
          stream: true
        }),
      });

      if (!groqResponse.ok) {
        lastError = `Groq error (${tryModel}): ${await groqResponse.text()}`;
        continue;
      }

      if (res.headersSent) return res.end();

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = groqResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      return res.end();
    } catch (err) {
      if (err.name === 'AbortError') return;
      lastError = err.message || `Unknown error with ${tryModel}`;
    }
  }

  if (res.headersSent) return res.end();
  const fallbackReply = getDevFallbackResponse(userMessage);
  return res.status(200).json({ reply: fallbackReply, fallback: true, error: lastError });
}
