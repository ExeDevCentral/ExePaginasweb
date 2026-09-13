/**
 * Circuit Breaker Pattern — Resilencia para llamadas a servicios externos
 *
 * Estados:
 * - CLOSED: Funcionando normalmente
 * - OPEN: Servicio está caído, rechazar requests
 * - HALF_OPEN: Recuperándose, permitir prueba limitada
 */

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number // Fallos antes de abrir
  successThreshold: number // Éxitos en HALF_OPEN antes de cerrar
  timeout: number // Timeout por request (ms)
  resetTimeout: number // Tiempo antes de pasar a HALF_OPEN (ms)
  fallback?: <T>() => Promise<T> | T
  onStateChange?: (state: CircuitState) => void
}

export class CircuitBreaker<T = unknown> {
  private state = CircuitState.CLOSED
  private failureCount = 0
  private successCount = 0
  private lastFailureTime = 0
  private options: Required<CircuitBreakerOptions>

  constructor(
    private fn: () => Promise<T>,
    options: Partial<CircuitBreakerOptions> = {}
  ) {
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

  async execute(): Promise<T> {
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
        new Promise<never>((_resolve, reject) =>
          setTimeout(() => reject(new Error('Circuit breaker timeout')), this.options.timeout)
        ),
      ])

      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error as Error)
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= this.options.successThreshold) {
        this.transitionTo(CircuitState.CLOSED)
      }
    }
  }

  private onFailure(_error: Error) {
    this.lastFailureTime = Date.now()
    this.failureCount++

    if (this.failureCount >= this.options.failureThreshold) {
      this.transitionTo(CircuitState.OPEN)
    }
  }

  private transitionTo(newState: CircuitState) {
    if (newState !== this.state) {
      console.warn(`[CircuitBreaker] Transitioning ${this.state} → ${newState}`)
      this.state = newState
      this.successCount = 0

      if (this.options.onStateChange) {
        this.options.onStateChange(newState)
      }
    }
  }

  getState(): CircuitState {
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
export function createCircuitBreaker<T>(
  fn: () => Promise<T>,
  options?: Partial<CircuitBreakerOptions>
): CircuitBreaker<T> {
  return new CircuitBreaker(fn, options)
}

/**
 * Pool de Circuit Breakers por nombre
 */
export class CircuitBreakerPool {
  private breakers = new Map<string, CircuitBreaker<unknown>>()

  get<T>(
    name: string,
    fn: () => Promise<T>,
    options?: Partial<CircuitBreakerOptions>
  ): CircuitBreaker<T> {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, createCircuitBreaker(fn, options))
    }
    return this.breakers.get(name)! as CircuitBreaker<T>
  }

  remove(name: string) {
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
