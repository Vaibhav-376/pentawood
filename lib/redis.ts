import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = 
  redisUrl && 
  redisUrl !== "your_upstash_redis_url_here" && 
  redisUrl.startsWith("https://") &&
  redisToken && 
  redisToken !== "your_upstash_redis_token_here";

if (!isConfigured) {
  console.warn("Upstash Redis is not properly configured. Rate limiting will be disabled.");
}

export const redis = isConfigured 
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;
