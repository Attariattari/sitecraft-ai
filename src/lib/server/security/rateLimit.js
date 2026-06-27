import "server-only";
import { rateLimitResponse } from "@/lib/server/security/safeError";
import { getRedisClient } from "@/lib/server/cache/redis";

const buckets = global.__sitecraftRateLimitBuckets || new Map();
global.__sitecraftRateLimitBuckets = buckets;

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function getRequestMeta(request) {
  return {
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent") || "",
  };
}

function checkMemoryRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const current = buckets.get(key) || { count: 0, resetAt: now + windowMs };
  if (current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  buckets.set(key, current);
  return { allowed: true, remaining: Math.max(0, limit - current.count), resetAt: current.resetAt };
}

export async function checkRateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  try {
    const redis = getRedisClient();
    if (redis) {
      const cacheKey = `rate:${key}`;
      const count = await redis.incr(cacheKey);
      if (count === 1) await redis.expire(cacheKey, Math.ceil(windowMs / 1000));
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetAt: Date.now() + windowMs,
      };
    }
  } catch (error) {
    console.error(`Redis rate limit failed: ${error.message}`);
  }
  return checkMemoryRateLimit(key, { limit, windowMs });
}

export async function enforceRateLimit(request, name, options) {
  const key = `${name}:${getClientIp(request)}`;
  const result = await checkRateLimit(key, options);
  return result.allowed ? { allowed: true, rateLimit: result } : { allowed: false, response: rateLimitResponse(), rateLimit: result };
}
