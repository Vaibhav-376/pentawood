import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

// Key to track requests per IP
const RATE_LIMIT_WINDOW = 60; // 60 seconds
const MAX_REQUESTS = 20; // 20 requests per window

export async function proxy(request: NextRequest) {
  // Only apply rate limiting to specific paths (e.g., search, api)
  if (
    request.nextUrl.pathname.includes("/search") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const key = `ratelimit:${ip}:${request.nextUrl.pathname}`;

    try {
      // Skip rate limiting if redis is not configured
      if (!redis) {
        return NextResponse.next();
      }

      // Use Redis to count requests for this IP and path
      const requests = await redis.incr(key);

      if (requests === 1) {
        // Set an expiration for the first request in the window
        await redis.expire(key, RATE_LIMIT_WINDOW);
      }

      if (requests > MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please slow down." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": RATE_LIMIT_WINDOW.toString(),
            },
          }
        );
      }
    } catch (error) {
      console.error("Rate limiting error:", error);
      // Fail gracefully (allow the request if Redis is down)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except search)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
