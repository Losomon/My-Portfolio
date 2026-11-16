import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

type RedisClient = Redis;
type RateLimiter = Ratelimit;

let redisClient: RedisClient | null = null;
let rateLimiter: RateLimiter | null = null;
let redisUnavailable = false;

function getRedisUrl(): string {
  return process.env.UPSTASH_REDIS_URL ?? '';
}

function getRedisToken(): string {
  return process.env.UPSTASH_REDIS_TOKEN ?? '';
}

function isConfigured(): boolean {
  return Boolean(getRedisUrl() && getRedisToken());
}

function getRedis(): RedisClient | null {
  if (redisClient) return redisClient;
  if (!isConfigured()) return null;
  try {
    redisClient = new Redis({
      url: getRedisUrl(),
      token: getRedisToken(),
    });
    return redisClient;
  } catch {
    return null;
  }
}

function getRateLimiter(): RateLimiter | null {
  if (rateLimiter) return rateLimiter;
  const client = getRedis();
  if (!client) return null;
  try {
    rateLimiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      analytics: false,
      prefix: 'portfolio:contact:rl',
    });
    return rateLimiter;
  } catch {
    return null;
  }
}

function markUnavailable() {
  redisUnavailable = true;
}

function resetUnavailable() {
  redisUnavailable = false;
}

function isUnavailable(): boolean {
  return redisUnavailable;
}

export const redis = {
  get client(): RedisClient | null {
    return getRedis();
  },
  get limiter(): RateLimiter | null {
    return getRateLimiter();
  },
  isConfigured,
  isUnavailable,
  markUnavailable,
  resetUnavailable,
};

export async function checkRateLimit(
  identifier: string,
): Promise<{ success: boolean; retryAfter?: number; degraded: boolean }> {
  const limiter = getRateLimiter();
  if (!limiter) {
    return { success: true, degraded: true };
  }
  try {
    const result = await limiter.limit(identifier);
    if (result.success) {
      return { success: true, degraded: false };
    }
    return {
      success: false,
      retryAfter: result.reset ? Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)) : 60,
      degraded: false,
    };
  } catch {
    markUnavailable();
    return { success: true, degraded: true };
  }
}

export async function acquireDuplicateLock(
  key: string,
  ttlMs: number,
): Promise<{ acquired: boolean; release: () => Promise<void>; degraded: boolean }> {
  const client = getRedis();
  if (!client) {
    return {
      acquired: true,
      release: async () => {},
      degraded: true,
    };
  }
  try {
    const result = await client.set(key, '1', { ex: Math.ceil(ttlMs / 1000), nx: true });
    if (result === null) {
      return { acquired: false, release: async () => {}, degraded: false };
    }
    return {
      acquired: true,
      release: async () => {
        try {
          await client.del(key);
        } catch {
          // Best-effort cleanup; the key expires on its own.
        }
      },
      degraded: false,
    };
  } catch {
    markUnavailable();
    return {
      acquired: true,
      release: async () => {},
      degraded: true,
    };
  }
}

export function logSanitizedWarning(message: string) {
  // Sanitized operational warning — no PII, no raw Redis error details.
  console.warn(`[contact-protection] ${message}`);
}