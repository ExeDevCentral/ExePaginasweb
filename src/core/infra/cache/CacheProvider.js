/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * Utilidades de Caché Distribuida
 *
 * Soporta:
 * - Redis (producción)
 * - Memory Cache (desarrollo/testing)
 */

/**
 * Memory Cache — Para desarrollo y testing
 * ⚠️ NO usar en producción multi-instancia
 */
export class MemoryCache {
  __init() {
    this.cache = new Map()
  }

  constructor(defaultTtl = 300) {
    this.defaultTtl = defaultTtl
    MemoryCache.prototype.__init.call(this)
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  async get(key) {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  async set(key, value, ttlSeconds = this.defaultTtl) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async del(keys) {
    const keyList = Array.isArray(keys) ? keys : [keys]
    keyList.forEach((key) => this.cache.delete(key))
  }

  async invalidate(pattern) {
    const regex = new RegExp(pattern)
    Array.from(this.cache.keys()).forEach((key) => {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    })
  }

  async clear() {
    this.cache.clear()
  }

  cleanup() {
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
export class RedisCache {
  constructor(redisClient) {
    this.redis = redisClient
  }

  async get(key) {
    try {
      const client = this.redis
      const cached = await client.get(key)
      if (!cached) return null
      return JSON.parse(cached)
    } catch (error) {
      console.error(`[RedisCache] Error getting key ${key}:`, error)
      return null
    }
  }

  async set(key, value, ttlSeconds = 300) {
    try {
      const client = this.redis

      await client.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error(`[RedisCache] Error setting key ${key}:`, error)
    }
  }

  async del(keys) {
    try {
      const keyList = Array.isArray(keys) ? keys : [keys]
      if (keyList.length > 0) {
        const client = this.redis
        await client.del(...keyList)
      }
    } catch (error) {
      console.error('[RedisCache] Error deleting keys:', error)
    }
  }

  async invalidate(pattern) {
    try {
      const client = this.redis
      const keys = await client.keys(pattern)
      if (keys.length > 0) {
        const delClient = this.redis
        await delClient.del(...keys)
      }
    } catch (error) {
      console.error(`[RedisCache] Error invalidating pattern ${pattern}:`, error)
    }
  }

  async clear() {
    try {
      const client = this.redis
      await client.flushdb()
    } catch (error) {
      console.error('[RedisCache] Error clearing cache:', error)
    }
  }
}

/**
 * Factory para obtener cache provider basado en ambiente
 */
export function createCacheProvider() {
  if (process.env.REDIS_URL) {
    // Redis en producción
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require('ioredis')
    const redis = new Redis(process.env.REDIS_URL)
    return new RedisCache(redis)
  }

  // Memory cache en desarrollo
  return new MemoryCache()
}

// Instancia global
let cacheInstance = null

export function getCacheProvider() {
  if (!cacheInstance) {
    cacheInstance = createCacheProvider()
  }
  return cacheInstance
}

/**
 * Helper para getOrSet pattern
 */
export async function getOrSet(key, fn, ttl = 300) {
  const cache = getCacheProvider()

  // Intenta obtener del cache
  const cached = await cache.get(key)
  if (cached !== null) {
    return cached
  }

  // Ejecuta la función
  const result = await fn()

  // Guarda en cache
  await cache.set(key, result, ttl)

  return result
}
