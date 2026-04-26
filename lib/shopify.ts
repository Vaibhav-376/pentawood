const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-01";
const token = process.env.SHOPIFY_STOREFRONT_TOKEN || "";

export async function shopifyFetch(query: string, variables = {}) {
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

  return json.data;
}