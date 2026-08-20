import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/join/route";
import { joinFormSchema } from "@/content/schema";
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

  it("keeps the success response when all configured deliveries fail", async () => {
    vi.stubEnv("JOIN_WEBHOOK_URL", "https://hooks.example.invalid/join");
    vi.stubEnv("RESEND_API_KEY", "re_test_only_not_a_secret");
    vi.stubEnv("JOIN_NOTIFY_EMAIL", "notify@example.invalid");
    const fetchMock = vi.fn().mockRejectedValue(new Error("simulated network failure"));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(joinRequest(validPayload, "198.51.100.14"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledTimes(2);
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
