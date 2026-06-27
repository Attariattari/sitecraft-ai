import "server-only";
import crypto from "crypto";
import { serverEnv } from "@/lib/server/env";
import { getRedisClient } from "@/lib/server/cache/redis";

const memoryCache = global.__sitecraftMemoryCache || new Map();
global.__sitecraftMemoryCache = memoryCache;

export function isCacheEnabled() {
  return serverEnv.CACHE_ENABLED !== "false";
}

export function safeCacheKey(parts = []) {
  return parts
    .flat()
    .filter((part) => part !== undefined && part !== null && part !== "")
    .map((part) =>
      String(part)
        .toLowerCase()
        .replace(/[^a-z0-9:_-]/g, "-")
        .slice(0, 90),
    )
    .join(":");
}

export function hashCacheValue(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, 24);
}

export async function getCache(key) {
  if (!isCacheEnabled()) return null;
  try {
    const redis = getRedisClient();
    if (redis) return await redis.get(key);

    const entry = memoryCache.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  } catch (error) {
    console.error(`Cache get failed: ${error.message}`);
    return null;
  }
}

export async function setCache(key, value, ttl = serverEnv.CACHE_DEFAULT_TTL_SECONDS) {
  if (!isCacheEnabled() || value === undefined) return;
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.set(key, value, { ex: Number(ttl) || 300 });
      return;
    }
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + (Number(ttl) || 300) * 1000,
    });
  } catch (error) {
    console.error(`Cache set failed: ${error.message}`);
  }
}

export async function deleteCache(key) {
  try {
    const redis = getRedisClient();
    if (redis) {
      await redis.del(key);
      return;
    }
    memoryCache.delete(key);
  } catch (error) {
    console.error(`Cache delete failed: ${error.message}`);
  }
}

export async function deleteCachePattern(pattern) {
  try {
    const redis = getRedisClient();
    if (redis) {
      let cursor = 0;
      do {
        const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 });
        cursor = Number(nextCursor);
        if (keys.length) await redis.del(...keys);
      } while (cursor !== 0);
      return;
    }
    const prefix = pattern.replace(/\*$/, "");
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) memoryCache.delete(key);
    }
  } catch (error) {
    console.error(`Cache pattern delete failed: ${error.message}`);
  }
}

export async function getOrSetCache(key, ttl, fetcher) {
  const cached = await getCache(key);
  if (cached !== null && cached !== undefined) return cached;
  const value = await fetcher();
  if (value !== undefined && value !== null) await setCache(key, value, ttl);
  return value;
}

export const withCache = getOrSetCache;
