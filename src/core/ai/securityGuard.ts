/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Módulo Profundo (Deep Module): Escudo Zero-Trust & Firewall Determinístico para ExeBot IA.
 * Previene Prompt Injection, Jailbreaks, Reconocimiento de Infraestructura,
 * Exfiltración de Datos (PII/Facturas), Spoofing de Roles e Inyección de Payloads.
 */

export type ThreatCategory =
  'clean' | 'prompt_injection' | 'reconnaissance' | 'data_exfiltration' | 'malicious_payload'

export interface SecurityInspectionResult {
  allowed: boolean
  category: ThreatCategory
  threatScore: number
  matchedRule: string | null
  sanitizedText: string
  safeResponse: string | null
}

interface ThreatPattern {
  id: string
  category: Exclude<ThreatCategory, 'clean'>
  score: number
  regex: RegExp
}

const THREAT_PATTERNS: readonly ThreatPattern[] = [
  // 1. Payloads Maliciosos (SQLi, XSS, SSTI, Command Injection) — prioridad máxima
  {
    id: 'payload_xss_script',
    category: 'malicious_payload',
    score: 100,
    regex:
      /(?:<\s*script\b|javascript\s*:|onerror\s*=|onload\s*=|<\s*iframe\b|<\s*img\b[^>]+onerror)/i,
  },
  {
    id: 'payload_sqli',
    category: 'malicious_payload',
    score: 100,
    regex:
      /(?:\bUNION\s+(?:ALL\s+)?SELECT\b|\bDROP\s+TABLE\b|\bDELETE\s+FROM\b|\bINSERT\s+INTO\b|\bUPDATE\s+\w+\s+SET\b|(?:'|")\s*OR\s+(?:'1'\s*=\s*'1'|1\s*=\s*1)\b|--\s*$|;\s*SELECT\s+)/i,
  },
  {
    id: 'payload_ssti_proto',
    category: 'malicious_payload',
    score: 95,
    regex:
      /(?:\{\{\s*[\w.*+\-/()"'\s]+\s*\}\}|\$\{\s*[\w.*+\-/()"'\s]+\s*\}|__proto__|constructor\s*(?:\[|\.constructor))/i,
  },

  // 2. Prompt Injection & Jailbreak / Extracción de System Prompt
  {
    id: 'pi_ignore_instructions',
    category: 'prompt_injection',
    score: 100,
    regex:
      /\b(ignora|ignore|olvida|forget|descarta|disregard|override|bypass|omite|anula)\b.{0,50}\b(instrucciones|instructions|reglas|rules|anteriores|previous|prior|above|sistema|system|prompt|directivas|directives)\b/i,
  },
  {
    id: 'pi_system_prompt_extract',
    category: 'prompt_injection',
    score: 100,
    regex:
      /\b(mostrame|mu[eé]strame|revela|reveal|show|print|imprime|repite|repeat|copia|copy|dime|decime|cual es|what is|escribe|dump|translate|traduce)\b.{0,50}\b(system\s*prompt|prompt\s*del?\s*sistema|instrucciones\s*(internas|del\s*sistema|iniciales|ocultas|secretas)|reglas\s*(internas|inviolables|de\s*seguridad|ocultas)|initial\s*instructions|hidden\s*prompt|developer\s*prompt)\b/i,
  },
  {
    id: 'pi_jailbreak_personas',
    category: 'prompt_injection',
    score: 100,
    regex:
      /\b(modo\s*(desarrollador|developer|dios|god|debug|admin|root|sin\s*censura|sin\s*restricciones|jailbreak)|developer\s*mode|dan\s*mode|do\s*anything\s*now|act\s*as\s*(an?\s*)?(unrestricted|evil|hacker|admin|root|system)|actu[aá]\s*como\s*(si\s*no\s*tuvieras\s*reglas|administrador\s*del\s*sistema|root| terminal))\b/i,
  },
  {
    id: 'pi_role_delimiter_injection',
    category: 'prompt_injection',
    score: 100,
    regex:
      /(?:\[\s*(?:SYSTEM|ADMIN|DEVELOPER|INST|SYS)\s*\]|<\s*\/?\s*(?:system|instructions|prompt|admin|tool_call|function_call)\s*>|###\s*(?:System|Instruction|New\s*Role)\s*:)/i,
  },
  {
    id: 'pi_verbatim_repeat_trick',
    category: 'prompt_injection',
    score: 95,
    regex:
      /\b(repeat|repite|transcribe|escribe\s*textualmente|output\s*verbatim)\b.{0,40}\b(everything\s*above|todo\s*lo\s*anterior|desde\s*["']?eres\s*el|starting\s*from\s*["']?you\s*are)\b/i,
  },

  // 3. Reconocimiento Ciberdelictivo / Sondeo de Infraestructura, Claves y Base de Datos
  {
    id: 'recon_secrets_and_keys',
    category: 'reconnaissance',
    score: 100,
    regex:
      /\b(api[_\s-]?keys?|secret[_\s-]?keys?|service[_\s-]?role|variables?\s*de\s*entorno|environment\s*variables?|\.env|access[_\s-]?tokens?|jwt[_\s-]?secret|credenciales\s*internas|claves?\s*(de\s*api|privadas?|secretas?|del?\s*servidor)|resend[_\s-]?api|groq[_\s-]?api|gemini[_\s-]?api|supabase[_\s-]?key|webhook[_\s-]?secret)\b/i,
  },
  {
    id: 'recon_database_schema',
    category: 'reconnaissance',
    score: 95,
    regex:
      /\b(tablas?\s*(de\s*la\s*base\s*de\s*datos|de\s*supabase|de\s*postgres|internas?|sql)|esquema\s*(sql|de\s*base\s*de\s*datos|de\s*tablas)|database\s*(schema|tables|dump|credentials)|connection\s*string|cadena\s*de\s*conexi[oó]n|information_schema|pg_catalog|rls\s*policies|pol[ií]ticas?\s*rls)\b/i,
  },
  {
    id: 'recon_internal_tools_and_source',
    category: 'reconnaissance',
    score: 90,
    regex:
      /\b(c[oó]digo\s*fuente\s*(interno|del\s*backend|del\s*servidor)|internal\s*(tools?|functions?|endpoints?|routes?)|herramientas?\s*internas?\s*que\s*ten[eé]s|list\s*all\s*your\s*(tools|functions)|cu[aá]les\s*son\s*tus\s*(funciones|tools|herramientas)\s*internas|mostrame\s*el\s*json\s*de\s*tus\s*tools|vulnerabilidades\s*del\s*sitio|exploits?)\b/i,
  },

  // 4. Ingeniería Social, Suplantación de Identidad y Exfiltración de Datos de Clientes
  {
    id: 'exfil_admin_impersonation',
    category: 'data_exfiltration',
    score: 100,
    regex:
      /\b(soy\s*(exequiel|el\s*due[ñn]o|el\s*administrador|el\s*admin|el\s*creador|soporte\s*t[eé]cnico\s*interno)|i\s*am\s*(the\s*admin|the\s*owner|exequiel)).{0,60}\b(dame|mostrame|acceso|facturas|clientes|base\s*de\s*datos|claves|contrase[ñn]a|prompts?|autorizo|ordeno)\b/i,
  },
  {
    id: 'exfil_other_clients_data',
    category: 'data_exfiltration',
    score: 100,
    regex:
      /\b(dame|mostrame|lista|listar|exporta|extrae|ver| decime|consulta)\b.{0,45}\b(todos\s*los\s*(clientes|usuarios|leads|correos|emails|tel[eé]fonos|pagos)|facturas\s*de\s*(otros|todos|los\s*clientes)|datos\s*de\s*(otros\s*clientes|todos\s*los\s*usuarios)|base\s*de\s*clientes|lista\s*de\s*clientes)\b/i,
  },
  {
    id: 'exfil_price_tampering',
    category: 'data_exfiltration',
    score: 90,
    regex:
      /\b(cambia|modifica|actualiza|pon[eé]|setea|aplica)\b.{0,35}\b(el\s*precio|los\s*precios|el\s*costo|el\s*plan|un\s*descuento\s*del?\s*(?:9\d|100)\s*%)\b.{0,30}\b(a\s*\$?\s*[01]\b|gratis|free|\$0\b)/i,
  },
]

const SAFE_RESPONSES: Record<Exclude<ThreatCategory, 'clean'>, string> = {
  prompt_injection:
    '🛡️ [Escudo Zero-Trust ExeSistemasWEB]: Por políticas de seguridad, las directivas operativas del asistente son inmutables. Estoy disponible exclusivamente para asesorarte sobre desarrollo de páginas web, sistemas a medida y automatizaciones para tu negocio.',
  reconnaissance:
    '🛡️ [Escudo Zero-Trust ExeSistemasWEB]: Por razones de seguridad e integridad de infraestructura, no expongo detalles internos de arquitectura, esquemas de datos ni credenciales. Si deseas conocer cómo protegemos los sistemas que desarrollamos para clientes, puedo explicarte nuestras prácticas comerciales o comunicarte con Exequiel por WhatsApp al +54 9 341 6874786.',
  data_exfiltration:
    '🛡️ [Escudo Zero-Trust ExeSistemasWEB]: El acceso a información de cuentas, facturación o registros privados está estrictamente aislado mediante autenticación criptográfica y nunca se procesa ni autoriza por comandos de texto en el chat. Para consultas comerciales sobre tu propio proyecto, dejá tu WhatsApp o escribinos al +54 9 341 6874786.',
  malicious_payload:
    '🛡️ [Escudo Zero-Trust ExeSistemasWEB]: Tu mensaje contiene patrones de código o comandos no permitidos por nuestro filtro de seguridad. Por favor, escribí tu consulta comercial en texto simple.',
}

/**
 * Normaliza texto removiendo caracteres invisibles/zero-width y homogeneizando espacios
 * para evitar evasiones de filtros por ofuscación Unicode.
 */
export function normalizeUntrustedText(input: string): string {
  // Remueve caracteres de formato zero-width y caracteres de control (excepto saltos de línea/tabs)
  return input
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\P{Cc}\t\n\r]/gu, '')
    .trim()
}

/**
 * Inspecciona determinísticamente el mensaje del usuario antes de invocar LLMs,
 * disparar emails o ejecutar webhooks.
 */
export function inspectUserMessage(rawText: string): SecurityInspectionResult {
  const sanitizedText = normalizeUntrustedText(rawText).slice(0, 2000)

  if (!sanitizedText) {
    return {
      allowed: true,
      category: 'clean',
      threatScore: 0,
      matchedRule: null,
      sanitizedText: '',
      safeResponse: null,
    }
  }

  for (const pattern of THREAT_PATTERNS) {
    if (pattern.regex.test(sanitizedText)) {
      return {
        allowed: false,
        category: pattern.category,
        threatScore: pattern.score,
        matchedRule: pattern.id,
        sanitizedText,
        safeResponse: SAFE_RESPONSES[pattern.category],
      }
    }
  }

  return {
    allowed: true,
    category: 'clean',
    threatScore: 0,
    matchedRule: null,
    sanitizedText,
    safeResponse: null,
  }
}

const FORBIDDEN_NAME_TOKENS =
  /\b(ignore|ignora|olvida|forget|system|prompt|admin|root|instrucciones|instructions|rules|reglas|developer|assistant|tool|select|drop|script|http|www)\b/i

/**
 * Sanitiza el nombre del visitante (`visitorName`) para impedir Indirect Prompt Injection
 * y XSS cuando se interpola en el contexto o en notificaciones.
 */
export function sanitizeVisitorName(rawName: string | null | undefined): string | null {
  if (!rawName || typeof rawName !== 'string') return null

  const rawNormalized = normalizeUntrustedText(rawName)
  if (!rawNormalized || rawNormalized.length < 2) return null

  // Bloquear si el nombre crudo contiene cualquier payload, etiqueta HTML o token prohibido
  if (/[<>[\]{}\\/;:$%=+*^~|]/.test(rawNormalized)) return null
  if (FORBIDDEN_NAME_TOKENS.test(rawNormalized)) return null

  const inspected = inspectUserMessage(rawNormalized)
  if (!inspected.allowed) return null

  const normalized = rawNormalized
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/["'`()]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // Permitir únicamente letras (incluyendo acentos/UTF-8), espacios, guiones y puntos básicos
  const cleanName = normalized.replace(/[^\p{L}\p{M}\s.'-]/gu, '').trim()
  if (!cleanName || cleanName.length < 2) return null
  if (FORBIDDEN_NAME_TOKENS.test(cleanName)) return null

  return cleanName.slice(0, 40)
}

/**
 * Filtra el historial de mensajes enviado por el cliente para:
 * 1. Bloquear Role Spoofing (solo permite 'user' y 'assistant').
 * 2. Neutralizar mensajes previos del historial que contengan intentos de Prompt Injection.
 */
export function filterSafeClientMessages<
  T extends {
    role: string
    content?: string
    parts?: Array<{ type: string; text?: string; [key: string]: unknown }>
  },
>(messages: readonly T[]): T[] {
  const safeHistory: T[] = []

  for (const msg of messages) {
    if (msg.role !== 'user' && msg.role !== 'assistant') {
      continue
    }

    if (msg.role === 'user') {
      const textParts = Array.isArray(msg.parts)
        ? msg.parts
            .filter((p) => p?.type === 'text' && typeof p.text === 'string')
            .map((p) => p.text ?? '')
            .join('')
        : ''
      const combined = `${msg.content ?? ''} ${textParts}`.trim()
      const verdict = inspectUserMessage(combined)
      if (!verdict.allowed) {
        continue
      }
    }

    safeHistory.push(msg)
  }

  return safeHistory.slice(-20)
}

/**
 * Redacta cualquier posible filtración accidental de secretos o tokens en salidas de texto.
 */
export function redactSensitiveOutput(text: string): string {
  return text
    .replace(/\b(?:re|gsk|sk|rk)_[a-zA-Z0-9_-]{16,}\b/g, '[REDACTED_KEY]')
    .replace(/\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/g, '[REDACTED_JWT]')
    .replace(
      /\b(?:SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY|AI_GATEWAY_API_KEY|GROQ_API_KEY|GEMINI_API_KEY)\s*=\s*\S+/gi,
      '[REDACTED_ENV]'
    )
}
