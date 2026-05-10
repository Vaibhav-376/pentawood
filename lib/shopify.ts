import { redis } from "./redis";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-04";
const token = process.env.SHOPIFY_STOREFRONT_TOKEN || "";

export async function shopifyFetch(query: string, variables = {}, cacheKey?: string, ttl: number = 3600) {
  // Try to get from Redis cache first if cacheKey is provided
  if (cacheKey) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`Cache Hit: ${cacheKey}`);
        return cached;
      }
    } catch (e) {
      console.warn("Redis cache error:", e);
    }
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error("Shopify Error:", json.errors || json);
    throw new Error(
      json?.errors?.[0]?.message ||
        json?.errors?.[0]?.extensions?.code ||
        "Shopify request failed"
    );
  }

  const data = json.data;

  // Store in Redis if cacheKey is provided
  if (cacheKey && data) {
    try {
      await redis.set(cacheKey, data, { ex: ttl });
      console.log(`Cache Set: ${cacheKey}`);
    } catch (e) {
      console.warn("Redis cache set error:", e);
    }
  }

  return data;
}