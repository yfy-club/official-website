import { joinFormSchema } from "@/content/schema";
import { deliverApplication, logUndeliveredApplication } from "@/lib/join-delivery";
import { isPersistentStore, resolveJoinStore, type JoinRecord } from "@/lib/join-store";
import { joinAttemptLimiter, joinSubmitLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
// 不锁定 runtime：本文件只使用 fetch / URL / TextEncoder / crypto.randomUUID 等 Web 标准 API，
// 因此在 Node 运行时与边缘运行时（EdgeOne Pages、Cloudflare Workers）上都能运行。

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

let warnedMissingTurnstileSecret = false;
let warnedEphemeralStore = false;

type JsonRecord = Record<string, unknown>;

type TurnstileResult = {
  success?: boolean;
  "error-codes"?: string[];
};

function json(body: JsonRecord, status = 200, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasHoneypotValue(value: unknown) {
  if (value === undefined || value === null) return false;
  return typeof value !== "string" || value.trim().length > 0;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip")?.trim()
    || request.headers.get("eo-connecting-ip")?.trim()
    || forwarded
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

function tooManyRequests(resetAt: number, limit: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return json(
    { ok: false, message: "提交次数过多，请 10 分钟后再试。" },
    429,
    {
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": "0",
    },
  );
}

async function parseRequestBody(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return { error: "报名信息过长，请精简后重试。", status: 413 } as const;

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return { error: "报名信息过长，请精简后重试。", status: 413 } as const;
    }
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return { error: "报名数据格式不正确。", status: 400 } as const;
    return { value } as const;
  } catch {
    return { error: "报名数据格式不正确。", status: 400 } as const;
  }
}

async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (!warnedMissingTurnstileSecret) {
      console.warn("[join] TURNSTILE_SECRET_KEY is not configured; verification is disabled outside production.");
      warnedMissingTurnstileSecret = true;
    }
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, message: "报名验证服务暂未配置，请稍后再试。" } as const;
    }
    return { ok: true } as const;
  }

  if (typeof token !== "string" || token.trim().length === 0 || token.length > 2048) {
    return { ok: false, status: 400, message: "请先完成人机验证。" } as const;
  }

  const form = new URLSearchParams({ secret, response: token.trim() });
  if (ip !== "unknown") form.set("remoteip", ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) {
      console.error(`[join] Turnstile verification returned HTTP ${response.status}.`);
      return { ok: false, status: 502, message: "人机验证服务暂时不可用，请稍后重试。" } as const;
    }

    const result = await response.json() as TurnstileResult;
    if (!result.success) {
      console.warn(`[join] Turnstile rejected a token (${(result["error-codes"] ?? []).join(",") || "unknown"}).`);
      return { ok: false, status: 400, message: "人机验证未通过，请刷新后重试。" } as const;
    }
    return { ok: true } as const;
  } catch {
    console.error("[join] Turnstile verification request failed.");
    return { ok: false, status: 502, message: "人机验证服务暂时不可用，请稍后重试。" } as const;
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 第一级配额：对每一次请求计数，挡住对接口本身的滥用刷取。
  const attemptLimit = await joinAttemptLimiter.check(ip);
  if (!attemptLimit.allowed) return tooManyRequests(attemptLimit.resetAt, attemptLimit.limit);

  const parsedBody = await parseRequestBody(request);
  if ("error" in parsedBody) return json({ ok: false, message: parsedBody.error }, parsedBody.status);

  const body = parsedBody.value;
  if (hasHoneypotValue(body.website) || hasHoneypotValue(body.honeypot)) {
    return json({ ok: true, message: "报名已提交。" });
  }

  const turnstile = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstile.ok) return json({ ok: false, message: turnstile.message }, turnstile.status);

  const validated = joinFormSchema.safeParse(body);
  if (!validated.success) {
    return json({
      ok: false,
      message: "报名信息有误，请检查标记的字段。",
      fieldErrors: validated.error.flatten().fieldErrors,
    }, 400);
  }

  // 第二级配额：只有通过校验与人机验证的真实报名才扣减，
  // 填错字段的重试不会消耗正常用户的三次机会。
  const submitLimit = await joinSubmitLimiter.check(ip);
  if (!submitLimit.allowed) return tooManyRequests(submitLimit.resetAt, submitLimit.limit);

  const data = validated.data;
  const store = resolveJoinStore();
  const persistent = isPersistentStore();

  if (!persistent && !warnedEphemeralStore) {
    console.warn("[join] UPSTASH_REDIS_REST_URL is not configured; applications are stored in memory only and will not survive a restart.");
    warnedEphemeralStore = true;
  }

  // 先落库再投递：只要这一步成功，通知失败都可以由 /api/join/retry 补投。
  let record: JoinRecord | null = null;
  try {
    record = await store.append(data);
  } catch (error) {
    console.error(`[join] Failed to persist application: ${error instanceof Error ? error.message : "unknown"}`);
  }

  const outcome = await deliverApplication(data);

  if (record) {
    try {
      if (outcome.delivered > 0) await store.markDelivered(record);
      else await store.markFailed(record, outcome.error ?? "no channel delivered");
    } catch (error) {
      console.error(`[join] Failed to update application status: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }

  // 数据既没送达也没可靠落库，才算真正有丢失风险。
  const isAtRisk = outcome.delivered === 0 && !(record && persistent);
  if (isAtRisk) logUndeliveredApplication(data);

  // 本地开发未配置任何渠道属于预期情况，不提示降级。
  const shouldWarnUser = isAtRisk && (outcome.configured > 0 || process.env.NODE_ENV === "production");
  if (shouldWarnUser) {
    return json({
      ok: true,
      degraded: true,
      message: "报名信息已记录，但通知渠道暂时异常。请加入 QQ 迎新群并私信管理员确认，以免遗漏。",
    });
  }

  return json({ ok: true, message: "报名已提交，我们会尽快与你联系。" });
}
