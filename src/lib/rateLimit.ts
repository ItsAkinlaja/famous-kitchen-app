/**
 * Simple in-memory rate limiter.
 * Works per-process — sufficient for a single-server / Vercel serverless deployment
 * where each function instance handles its own window.
 *
 * Usage:
 *   const ok = rateLimit(ip, { limit: 5, windowMs: 60_000 });
 *   if (!ok) return 429;
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= limit) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}
