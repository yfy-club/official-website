import { joinFormSchema, type JoinFormInput } from "@/content/schema";
import { joinRateLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TRACK_LABELS: Record<JoinFormInput["track"], string> = {
  ai: "人工智能",
  software: "软件工程",
  database: "数据库",
  "cloud-iot": "云计算与物联网",
  industrial: "工业软件",
  other: "其他方向",
};

let warnedMissingTurnstileSecret = false;
let warnedMissingDelivery = false;

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
    || forwarded
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
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

function formatApplication(data: JoinFormInput) {
  const trackName = data.track === "other" && data.customTrack
    ? `其他方向（${data.customTrack}）`
    : TRACK_LABELS[data.track];

  return [
    "云飞扬官网收到新的加入申请",
    `姓名：${data.name}`,
    `学号：${data.studentId}`,
    `专业班级：${data.major}`,
    `年级：${data.grade}`,
    `联系方式：${data.contact}`,
    `志向方向：${trackName}`,
    `申请理由：${data.reason}`,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function webhookPayload(url: URL, text: string) {
  if (url.hostname.includes("feishu") || url.hostname.includes("larksuite")) {
    return { msg_type: "text", content: { text } };
  }
  if (url.hostname === "qyapi.weixin.qq.com") {
    return { msgtype: "text", text: { content: text } };
  }
  return { text, content: text };
}

async function sendWebhook(text: string) {
  const configuredUrl = process.env.JOIN_WEBHOOK_URL?.trim();
  if (!configuredUrl) return false;

  const url = new URL(configuredUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload(url, text)),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

async function sendEmail(data: JoinFormInput, text: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipients = process.env.JOIN_NOTIFY_EMAIL
    ?.split(/[;,]/)
    .map((email) => email.trim())
    .filter(Boolean);
  if (!apiKey || !recipients?.length) return false;

  const trackName = data.track === "other" && data.customTrack
    ? `其他方向（${data.customTrack}）`
    : TRACK_LABELS[data.track];

  const rows = [
    ["姓名", data.name],
    ["学号", data.studentId],
    ["专业班级", data.major],
    ["年级", data.grade],
    ["联系方式", data.contact],
    ["志向方向", trackName],
    ["申请理由", data.reason],
  ];
  const html = `<h1>新的加入申请</h1><dl>${rows.map(([label, value]) => `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "云飞扬社团官网 <onboarding@resend.dev>",
      to: recipients,
      subject: "[官网报名] 新的加入申请",
      text,
      html,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

async function deliverApplication(data: JoinFormInput) {
  const text = formatApplication(data);
  const deliveries = await Promise.allSettled([sendWebhook(text), sendEmail(data, text)]);
  const labels = ["Webhook", "email"];
  let configuredChannels = 0;

  deliveries.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (result.value) configuredChannels += 1;
      return;
    }
    const detail = result.reason instanceof Error && /^HTTP \d{3}$/.test(result.reason.message)
      ? ` (${result.reason.message})`
      : "";
    console.error(`[join] ${labels[index]} delivery failed${detail}.`);
  });

  if (configuredChannels === 0 && !warnedMissingDelivery) {
    console.warn("[join] No notification channel is fully configured; submissions will only be logged as accepted.");
    warnedMissingDelivery = true;
  }
}

export async function POST(request: Request) {
  const parsedBody = await parseRequestBody(request);
  if ("error" in parsedBody) return json({ ok: false, message: parsedBody.error }, parsedBody.status);

  const body = parsedBody.value;
  if (hasHoneypotValue(body.website) || hasHoneypotValue(body.honeypot)) {
    return json({ ok: true, message: "报名已提交。" });
  }

  const ip = getClientIp(request);
  const rateLimit = await joinRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
    return json(
      { ok: false, message: "提交次数过多，请 10 分钟后再试。" },
      429,
      { "Retry-After": String(retryAfter), "X-RateLimit-Limit": String(rateLimit.limit), "X-RateLimit-Remaining": "0" },
    );
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

  await deliverApplication(validated.data);
  return json({ ok: true, message: "报名已提交，我们会尽快与你联系。" });
}
