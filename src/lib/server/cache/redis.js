import "server-only";
import { Redis } from "@upstash/redis";
import { serverEnv } from "@/lib/server/env";

let redisClient;

export function getRedisClient() {
  if (redisClient !== undefined) return redisClient;

  if (!serverEnv.UPSTASH_REDIS_REST_URL || !serverEnv.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({
    url: serverEnv.UPSTASH_REDIS_REST_URL,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
  });

  return redisClient;
}
