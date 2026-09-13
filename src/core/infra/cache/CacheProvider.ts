/**
 * Utilidades de Caché Distribuida
 *
 * Soporta:
 * - Redis (producción)
 * - Memory Cache (desarrollo/testing)
 */

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
  del(key: string | string[]): Promise<void>
  invalidate(pattern: string): Promise<void>
  clear(): Promise<void>
}

/**
 * Memory Cache — Para desarrollo y testing
 * ⚠️ NO usar en producción multi-instancia
 */
export class MemoryCache implements ICacheProvider {
  private cache = new Map<string, CacheEntry<unknown>>()
  private cleanupInterval: ReturnType<typeof setInterval>

  constructor(private defaultTtl = 300) {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTtl): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async del(keys: string | string[]): Promise<void> {
    const keyList = Array.isArray(keys) ? keys : [keys]
    keyList.forEach((key) => this.cache.delete(key))
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(pattern)
    Array.from(this.cache.keys()).forEach((key) => {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    })
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  private cleanup() {
    const now = Date.now()
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    })
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.cache.clear()
  }
}

/**
 * Redis Cache — Para producción
 */
export class RedisCache implements ICacheProvider {
  private redis: unknown

  constructor(redisClient: unknown) {
    this.redis = redisClient
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = this.redis as { get: (key: string) => Promise<string | null> }
      const cached = await client.get(key)
      if (!cached) return null
      return JSON.parse(cached)
    } catch (error) {
      console.error(`[RedisCache] Error getting key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    try {
      const client = this.redis as {
        setex: (key: string, ttl: number, value: string) => Promise<void>
      }
      await client.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error(`[RedisCache] Error setting key ${key}:`, error)
    }
  }

  async del(keys: string | string[]): Promise<void> {
    try {
      const keyList = Array.isArray(keys) ? keys : [keys]
      if (keyList.length > 0) {
        const client = this.redis as { del: (...keys: string[]) => Promise<void> }
        await client.del(...keyList)
      }
    } catch (error) {
      console.error('[RedisCache] Error deleting keys:', error)
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const client = this.redis as { keys: (pattern: string) => Promise<string[]> }
      const keys = await client.keys(pattern)
      if (keys.length > 0) {
        const delClient = this.redis as { del: (...keys: string[]) => Promise<void> }
        await delClient.del(...keys)
      }
    } catch (error) {
      console.error(`[RedisCache] Error invalidating pattern ${pattern}:`, error)
    }
  }

  async clear(): Promise<void> {
    try {
      const client = this.redis as { flushdb: () => Promise<void> }
      await client.flushdb()
    } catch (error) {
      console.error('[RedisCache] Error clearing cache:', error)
    }
  }
}

/**
 * Factory para obtener cache provider basado en ambiente
 */
export function createCacheProvider(): ICacheProvider {
  if (process.env.REDIS_URL) {
    // Redis en producción
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require('ioredis') as unknown
    const redis = new (Redis as new (url: string) => unknown)(process.env.REDIS_URL)
    return new RedisCache(redis)
  }

  // Memory cache en desarrollo
  return new MemoryCache()
}

// Instancia global
let cacheInstance: ICacheProvider | null = null

export function getCacheProvider(): ICacheProvider {
  if (!cacheInstance) {
    cacheInstance = createCacheProvider()
  }
  return cacheInstance
}

/**
 * Helper para getOrSet pattern
 */
export async function getOrSet<T>(key: string, fn: () => Promise<T>, ttl = 300): Promise<T> {
  const cache = getCacheProvider()

  // Intenta obtener del cache
  const cached = await cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Ejecuta la función
  const result = await fn()

  // Guarda en cache
  await cache.set(key, result, ttl)

  return result
}
