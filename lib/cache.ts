// Simple in-memory cache with TTL for server-side caching
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  private defaultTTL = 60_000; // 60 seconds default

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const maxAge = ttl ?? this.defaultTTL;

    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Request deduplication - multiple concurrent requests for same key will share the promise
  async dedupe<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key, ttl);
    if (cached !== null) return cached;

    // Check if there's already a pending request
    const pending = this.pendingRequests.get(key);
    if (pending) return pending as Promise<T>;

    // Create new request
    const promise = fetcher()
      .then((result) => {
        this.set(key, result);
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Periodic cleanup of expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => memoryCache.cleanup(), 5 * 60 * 1000);
}
