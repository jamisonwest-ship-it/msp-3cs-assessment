// Simple in-memory rate limiter for serverless environments.
// Note: Each Vercel serverless instance has its own memory, so this is
// per-instance — not globally consistent. It still prevents rapid-fire
// abuse from a single client hitting the same instance.

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean stale entries every 5 min

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(ip) || { timestamps: [] };

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  store.set(ip, entry);
  return { allowed: true };
}
