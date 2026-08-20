import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/join/route";
import { joinFormSchema } from "@/content/schema";
import {
  buildApplicationFields,
  buildEmailHtml,
  buildPlainText,
  buildSubject,
  buildWebhookPayload,
  resolveReplyTo,
} from "@/lib/join-notification";
import { MemoryRateLimiter } from "@/lib/rate-limit";

const validPayload = {
  name: "测试同学",
  studentId: "00000000",
  major: "测试专业 1 班",
  grade: "2026 级",
  contact: "test-contact",
  track: "software",
  reason: "我希望系统学习工程实践，并愿意持续投入时间完成训练。",
  website: "",
  turnstileToken: "",
} as const;

function joinRequest(body: unknown, ip: string) {
  return new Request("http://localhost/api/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("join form", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("JOIN_WEBHOOK_URL", "");
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("JOIN_NOTIFY_EMAIL", "");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("parses a complete payload with the shared schema", () => {
    const result = joinFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.studentId).toBe("00000000");
      expect(result.data.track).toBe("software");
    }
  });

  it("parses a payload with custom other track successfully", () => {
    const result = joinFormSchema.safeParse({
      ...validPayload,
      track: "other",
      customTrack: "前端全栈工程",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.track).toBe("other");
      expect(result.data.customTrack).toBe("前端全栈工程");
    }
  });

  it("rejects other track when customTrack is missing or empty", () => {
    const result = joinFormSchema.safeParse({
      ...validPayload,
      track: "other",
      customTrack: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.customTrack?.[0]).toContain("请填写你感兴趣的具体专业或技术方向");
    }
  });

  it("rejects invalid or missing track with Chinese error message", () => {
    const result = joinFormSchema.safeParse({
      ...validPayload,
      track: "invalid-track",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.track?.[0]).toBe("请选择你感兴趣的技术方向");
    }
  });

  it("rejects field boundaries and malformed student IDs", () => {
    const result = joinFormSchema.safeParse({
      ...validPayload,
      studentId: "A1234567",
      reason: "字数不足",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.studentId?.[0]).toContain("8 至 20 位数字");
      expect(fields.reason?.[0]).toContain("至少需要 20 个字符");
    }
  });

  it("silently accepts a honeypot submission without normal processing", async () => {
    const response = await POST(joinRequest({ ...validPayload, website: "https://bot.invalid" }, "198.51.100.10"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, message: "报名已提交。" });
  });

  it("revalidates untrusted payloads in the Route Handler", async () => {
    const response = await POST(joinRequest({ ...validPayload, studentId: "not-a-student-id" }, "198.51.100.11"));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.fieldErrors.studentId).toBeDefined();
  });

  it("accepts a valid local-development submission without configured providers", async () => {
    const response = await POST(joinRequest(validPayload, "198.51.100.12"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
  });

  it("reports a degraded delivery and logs the application when every channel fails", async () => {
    vi.stubEnv("JOIN_WEBHOOK_URL", "https://hooks.example.invalid/join");
    vi.stubEnv("RESEND_API_KEY", "re_test_only_not_a_secret");
    vi.stubEnv("JOIN_NOTIFY_EMAIL", "notify@example.invalid");
    const fetchMock = vi.fn().mockRejectedValue(new Error("simulated network failure"));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(joinRequest(validPayload, "198.51.100.14"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, degraded: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // 两条渠道失败日志，外加一条可供人工恢复的完整报名记录。
    const logged = vi.mocked(console.error).mock.calls.map(([message]) => String(message));
    expect(logged).toHaveLength(3);
    const undelivered = logged.find((message) => message.includes("UNDELIVERED APPLICATION"));
    expect(undelivered).toContain(validPayload.name);
    expect(undelivered).toContain(validPayload.studentId);
  });

  it("does not spend the submission quota on payloads that fail validation", async () => {
    const ip = "198.51.100.15";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const rejected = await POST(joinRequest({ ...validPayload, studentId: "invalid" }, ip));
      expect(rejected.status).toBe(400);
    }
    // 前面五次失败没有消耗配额，正常报名仍然可以提交三次。
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect((await POST(joinRequest(validPayload, ip))).status).toBe(200);
    }
    expect((await POST(joinRequest(validPayload, ip))).status).toBe(429);
  });

  it("enforces the Route Handler limit after three attempts", async () => {
    const ip = "198.51.100.13";
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await POST(joinRequest(validPayload, ip));
      expect(response.status).toBe(200);
    }
    const blocked = await POST(joinRequest(validPayload, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    await expect(blocked.json()).resolves.toMatchObject({
      ok: false,
      message: "提交次数过多，请 10 分钟后再试。",
    });
  });
});

describe("MemoryRateLimiter", () => {
  it("allows three attempts per window and resets after ten minutes", () => {
    const limiter = new MemoryRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });
    const start = 1_000_000;

    expect(limiter.check("ip", start)).toMatchObject({ allowed: true, remaining: 2 });
    expect(limiter.check("ip", start + 1)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check("ip", start + 2)).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.check("ip", start + 3)).toMatchObject({ allowed: false, remaining: 0 });
    expect(limiter.check("ip", start + (10 * 60 * 1000) + 3)).toMatchObject({ allowed: true, remaining: 2 });
  });
});

describe("join notification rendering", () => {
  const data = joinFormSchema.parse(validPayload);

  it("derives text, subject and html from one field list", () => {
    const fields = buildApplicationFields(data);
    const text = buildPlainText(data);
    for (const field of fields) {
      expect(text).toContain(`${field.label}：${field.value}`);
    }
    expect(buildSubject(data)).toBe("[官网报名] 测试同学 · 软件工程 · 2026 级");
  });

  it("labels a custom track consistently across renderings", () => {
    const other = joinFormSchema.parse({ ...validPayload, track: "other", customTrack: "前端全栈工程" });
    expect(buildSubject(other)).toContain("其他方向（前端全栈工程）");
    expect(buildPlainText(other)).toContain("志向方向：其他方向（前端全栈工程）");
  });

  it("escapes html and keeps line breaks in the long-form reason", () => {
    const hostile = joinFormSchema.parse({
      ...validPayload,
      name: "<b>张三</b>",
      reason: "第一行理由内容足够长以通过校验。\n第二行补充说明。",
    });
    const html = buildEmailHtml(hostile);
    expect(html).not.toContain("<b>张三</b>");
    expect(html).toContain("&lt;b&gt;张三&lt;/b&gt;");
    expect(html).toContain("white-space:pre-wrap");
    // QQ 邮箱会剥离 <style> 块，模板必须全部使用内联样式。
    expect(html).not.toContain("<style");
  });

  it("uses the contact as reply-to only when it is an email address", () => {
    expect(resolveReplyTo(data)).toBeUndefined();
    expect(resolveReplyTo(joinFormSchema.parse({ ...validPayload, contact: "someone@qq.com" }))).toBe("someone@qq.com");
  });

  it("shapes the webhook payload per provider", () => {
    expect(buildWebhookPayload(new URL("https://open.feishu.cn/hook/x"), "hi")).toMatchObject({ msg_type: "text" });
    expect(buildWebhookPayload(new URL("https://qyapi.weixin.qq.com/hook/x"), "hi")).toMatchObject({ msgtype: "text" });
    expect(buildWebhookPayload(new URL("https://example.invalid/hook"), "hi")).toMatchObject({ text: "hi" });
  });
});
