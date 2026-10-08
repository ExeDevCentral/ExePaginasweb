/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * Circuit Breaker Pattern — Resilencia para llamadas a servicios externos
 *
 * Estados:
 * - CLOSED: Funcionando normalmente
 * - OPEN: Servicio está caído, rechazar requests
 * - HALF_OPEN: Recuperándose, permitir prueba limitada
 */

var CircuitState
;(function (CircuitState) {
  const CLOSED = 'CLOSED'
  CircuitState['CLOSED'] = CLOSED
  const OPEN = 'OPEN'
  CircuitState['OPEN'] = OPEN
  const HALF_OPEN = 'HALF_OPEN'
  CircuitState['HALF_OPEN'] = HALF_OPEN
})(CircuitState || (CircuitState = {}))

export class CircuitBreaker {
  __init() {
    this.state = CircuitState.CLOSED
  }
  __init2() {
    this.failureCount = 0
  }
  __init3() {
    this.successCount = 0
  }
  __init4() {
    this.lastFailureTime = 0
  }

  constructor(fn, options = {}) {
    this.fn = fn
    CircuitBreaker.prototype.__init.call(this)
    CircuitBreaker.prototype.__init2.call(this)
    CircuitBreaker.prototype.__init3.call(this)
    CircuitBreaker.prototype.__init4.call(this)
    this.options = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 30000,
      resetTimeout: 60000,
      fallback: undefined,
      onStateChange: undefined,
      ...options,
    }
  }

  async execute() {
    // Si el circuito está abierto
    if (this.state === CircuitState.OPEN) {
      const elapsed = Date.now() - this.lastFailureTime

      // Transicionar a HALF_OPEN si es tiempo
      if (elapsed > this.options.resetTimeout) {
        this.transitionTo(CircuitState.HALF_OPEN)
      } else {
        // Usar fallback si existe
        if (this.options.fallback) {
          return this.options.fallback()
        }
        throw new Error(
          `Circuit breaker is OPEN. Retry in ${Math.ceil((this.options.resetTimeout - elapsed) / 1000)}s`
        )
      }
    }

    try {
      // Ejecutar con timeout
      const result = await Promise.race([
        this.fn(),
        new Promise((_resolve, reject) =>
          setTimeout(() => reject(new Error('Circuit breaker timeout')), this.options.timeout)
        ),
      ])

      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error)
      throw error
    }
  }

  onSuccess() {
    this.failureCount = 0

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= this.options.successThreshold) {
        this.transitionTo(CircuitState.CLOSED)
      }
    }
  }

  onFailure(_error) {
    this.lastFailureTime = Date.now()
    this.failureCount++

    if (this.failureCount >= this.options.failureThreshold) {
      this.transitionTo(CircuitState.OPEN)
    }
  }

  transitionTo(newState) {
    if (newState !== this.state) {
      console.warn(`[CircuitBreaker] Transitioning ${this.state} → ${newState}`)
      this.state = newState
      this.successCount = 0

      if (this.options.onStateChange) {
        this.options.onStateChange(newState)
      }
    }
  }

  getState() {
    return this.state
  }

  reset() {
    this.transitionTo(CircuitState.CLOSED)
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = 0
  }
}

/**
 * Factory para crear circuit breakers tipados
 */
export function createCircuitBreaker(fn, options) {
  return new CircuitBreaker(fn, options)
}

/**
 * Pool de Circuit Breakers por nombre
 */
export class CircuitBreakerPool {
  constructor() {
    CircuitBreakerPool.prototype.__init5.call(this)
  }
  __init5() {
    this.breakers = new Map()
  }

  get(name, fn, options) {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, createCircuitBreaker(fn, options))
    }
    return this.breakers.get(name)
  }

  remove(name) {
    this.breakers.delete(name)
  }

  resetAll() {
    this.breakers.forEach((breaker) => breaker.reset())
  }

  getAll() {
    return Array.from(this.breakers.entries()).map(([name, breaker]) => ({
      name,
      state: breaker.getState(),
    }))
  }
}

// Instancia global
export const cbPool = new CircuitBreakerPool()
