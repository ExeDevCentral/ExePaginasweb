function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */

export const AI_RUN_LIMITS_DEFAULT = {
  maxAgentSteps: 8,
  maxInputTokens: 8000,
  maxOutputTokens: 2000,
  maxToolCallsPerRun: 16,
  maxRunsPerDay: 120,
}

export const MODEL_COST_PER_1K_INPUT_USD = {
  'gemini-2.5-flash': 0.0005,
  'openai/gpt-4o-mini': 0.00015,
  'llama-3.3-70b-versatile': 0.00059,
}

export const MODEL_COST_PER_1K_OUTPUT_USD = {
  'gemini-2.5-flash': 0.002,
  'openai/gpt-4o-mini': 0.0006,
  'llama-3.3-70b-versatile': 0.00079,
}

export function estimateCostUsd(model, inputTokens, outputTokens) {
  const inRate = _nullishCoalesce(MODEL_COST_PER_1K_INPUT_USD[model], () => 0.0003)
  const outRate = _nullishCoalesce(MODEL_COST_PER_1K_OUTPUT_USD[model], () => 0.0012)
  return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate
}

export function sanitizeAiInput(value, maxDepth = 4) {
  const seen = new WeakSet()

  const clean = (node, depth) => {
    if (depth > maxDepth) return '[truncated]'
    if (node === null || node === undefined) return null
    if (typeof node === 'string') {
      if (node.length > 500) return `${node.slice(0, 500)}…[truncated]`
      return node
    }
    if (typeof node === 'number' || typeof node === 'boolean') return node

    if (Array.isArray(node)) {
      const out = []
      for (let i = 0; i < node.length && i < 50; i++) {
        const el = node[i]
        if (el && typeof el === 'object' && !seen.has(el)) {
          seen.add(el)
          out.push(clean(el, depth + 1))
        } else if (el === null || typeof el !== 'object') {
          out.push(clean(el, depth + 1))
        } else {
          out.push('[circular]')
        }
      }
      return out
    }

    if (typeof node === 'object') {
      const obj = node
      if (seen.has(obj)) return '[circular]'
      seen.add(obj)
      const keys = Object.keys(obj).slice(0, 20)
      const out = {}
      for (const key of keys) {
        if (/(secret|token|password|apikey|api_key|authorization|key)/i.test(key)) continue
        out[key] = clean(obj[key], depth + 1)
      }
      return out
    }

    return String(node).slice(0, 500)
  }

  const result = clean(value, 0)
  return typeof result === 'object' && result !== null ? result : {}
}
