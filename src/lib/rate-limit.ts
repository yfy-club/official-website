import { readUpstashConfig, upstashPipeline, type UpstashConfig } from "@/lib/upstash";

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

/**
 * 基于 Upstash Redis REST 的跨实例限流器。
 * 传输层与报名存储共用 upstashPipeline，因此在 EdgeOne / Cloudflare Workers /
 * Vercel Edge / Node 上行为一致。未配置 UPSTASH_REDIS_REST_URL 时不会被启用。
 */
export class UpstashRateLimiter implements RateLimiter {
  private warnedFailure = false;

  constructor(
    private readonly options: MemoryRateLimiterOptions & {
      config: UpstashConfig;
      prefix: string;
    },
  ) {}

  async check(key: string, now = Date.now()): Promise<RateLimitResult> {
    const { limit, windowMs, prefix, config } = this.options;
    const redisKey = `${prefix}:${key}`;

    try {
      const [count, , ttl] = await upstashPipeline(config, [
        ["INCR", redisKey],
        ["PEXPIRE", redisKey, windowMs, "NX"],
        ["PTTL", redisKey],
      ], 3_000);

      const used = Number(count);
      if (!Number.isFinite(used) || used < 1) throw new Error("Unexpected Upstash response");
      const remainingMs = Number(ttl);

      return {
        allowed: used <= limit,
        limit,
        remaining: Math.max(0, limit - used),
        resetAt: now + (remainingMs > 0 ? remainingMs : windowMs),
      };
    } catch (error) {
      // 限流后端不可用时放行，避免因为存储故障让所有报名者都提交不了。
      if (!this.warnedFailure) {
        console.error(`[rate-limit] Upstash unavailable, failing open: ${error instanceof Error ? error.message : "unknown"}`);
        this.warnedFailure = true;
      }
      return { allowed: true, limit, remaining: limit - 1, resetAt: now + windowMs };
    }
  }
}

function createLimiter(prefix: string, limit: number, windowMs: number): RateLimiter {
  const config = readUpstashConfig();
  if (config) return new UpstashRateLimiter({ limit, windowMs, prefix, config });
  return new MemoryRateLimiter({ limit, windowMs });
}

const JOIN_WINDOW_MS = 10 * 60 * 1000;

/**
 * 两级配额：
 * - joinAttemptLimiter 对每一次请求计数，用于挡住对接口的滥用刷取；
 * - joinSubmitLimiter 只在校验与人机验证都通过后才扣减，
 *   因此填错学号或字数不足这类失败不会消耗正常用户的报名配额。
 */
export const joinAttemptLimiter: RateLimiter = createLimiter("join:attempt", 20, JOIN_WINDOW_MS);
export const joinSubmitLimiter: RateLimiter = createLimiter("join:submit", 3, JOIN_WINDOW_MS);
