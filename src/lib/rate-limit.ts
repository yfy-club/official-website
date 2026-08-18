export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export interface RateLimiter {
  check(key: string, now?: number): Promise<RateLimitResult> | RateLimitResult;
}

type MemoryRateLimiterOptions = {
  limit: number;
  windowMs: number;
};

export class MemoryRateLimiter implements RateLimiter {
  private readonly attempts = new Map<string, number[]>();
  private checks = 0;

  constructor(private readonly options: MemoryRateLimiterOptions) {
    if (!Number.isInteger(options.limit) || options.limit < 1 || options.windowMs < 1) {
      throw new Error("Rate limiter options must be positive numbers");
    }
  }

  check(key: string, now = Date.now()): RateLimitResult {
    const cutoff = now - this.options.windowMs;
    const recent = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > cutoff);

    if (recent.length >= this.options.limit) {
      this.attempts.set(key, recent);
      return {
        allowed: false,
        limit: this.options.limit,
        remaining: 0,
        resetAt: recent[0] + this.options.windowMs,
      };
    }

    recent.push(now);
    this.attempts.set(key, recent);
    this.pruneExpiredEntries(now);

    return {
      allowed: true,
      limit: this.options.limit,
      remaining: this.options.limit - recent.length,
      resetAt: recent[0] + this.options.windowMs,
    };
  }

  clear() {
    this.attempts.clear();
  }

  private pruneExpiredEntries(now: number) {
    this.checks += 1;
    if (this.checks % 100 !== 0) return;

    const cutoff = now - this.options.windowMs;
    for (const [key, timestamps] of this.attempts) {
      if (timestamps.every((timestamp) => timestamp <= cutoff)) this.attempts.delete(key);
    }
  }
}

export const joinRateLimiter: RateLimiter = new MemoryRateLimiter({
  limit: 3,
  windowMs: 10 * 60 * 1000,
});
