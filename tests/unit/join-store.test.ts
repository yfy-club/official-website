import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST as RETRY } from "@/app/api/join/retry/route";
import { POST as JOIN } from "@/app/api/join/route";
import { joinFormSchema } from "@/content/schema";
import { MAX_DELIVERY_ATTEMPTS, MemoryJoinStore, resolveJoinStore } from "@/lib/join-store";

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

const data = joinFormSchema.parse(validPayload);

function joinRequest(ip: string) {
  return new Request("http://localhost/api/join", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(validPayload),
  });
}

function retryRequest(token?: string) {
  return new Request("http://localhost/api/join/retry", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  vi.stubEnv("JOIN_WEBHOOK_URL", "");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("JOIN_NOTIFY_EMAIL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("CRON_SECRET", "");
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("MemoryJoinStore", () => {
  it("keeps a record pending until it is delivered", async () => {
    const store = new MemoryJoinStore();
    const record = await store.append(data, 1_000);

    expect(await store.listPending(10)).toHaveLength(1);
    await store.markDelivered(record);
    expect(await store.listPending(10)).toHaveLength(0);
  });

  it("returns pending records oldest first", async () => {
    const store = new MemoryJoinStore();
    await store.append({ ...data, name: "后到" }, 2_000);
    await store.append({ ...data, name: "先到" }, 1_000);

    const pending = await store.listPending(10);
    expect(pending.map((record) => record.data.name)).toEqual(["先到", "后到"]);
  });

  it("stops retrying after the attempt ceiling and records the last error", async () => {
    const store = new MemoryJoinStore();
    let record = await store.append(data, 1_000);

    for (let attempt = 0; attempt < MAX_DELIVERY_ATTEMPTS - 1; attempt += 1) {
      await store.markFailed(record, `failure ${attempt}`);
      const [next] = await store.listPending(10);
      expect(next).toBeDefined();
      record = next;
    }
    expect(record.attempts).toBe(MAX_DELIVERY_ATTEMPTS - 1);
    expect(record.lastError).toContain("failure");

    // 最后一次失败达到上限，移出待投递队列，避免定时任务无限空转。
    await store.markFailed(record, "final failure");
    expect(await store.listPending(10)).toHaveLength(0);
  });
});

describe("join persistence in the submit route", () => {
  it("stores the application before attempting delivery", async () => {
    const store = resolveJoinStore() as MemoryJoinStore;
    store.clear();

    vi.stubEnv("RESEND_API_KEY", "re_test_only_not_a_secret");
    vi.stubEnv("JOIN_NOTIFY_EMAIL", "notify@example.invalid");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("simulated network failure")));

    const response = await JOIN(joinRequest("203.0.113.20"));
    expect(response.status).toBe(200);

    // 投递失败，但记录留在待投递队列里等待补投。
    const pending = await store.listPending(10);
    expect(pending).toHaveLength(1);
    expect(pending[0].data.studentId).toBe(validPayload.studentId);
    expect(pending[0].lastError).toContain("email");
  });

  it("does not keep a pending record once delivery succeeds", async () => {
    const store = resolveJoinStore() as MemoryJoinStore;
    store.clear();

    vi.stubEnv("RESEND_API_KEY", "re_test_only_not_a_secret");
    vi.stubEnv("JOIN_NOTIFY_EMAIL", "notify@example.invalid");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));

    const response = await JOIN(joinRequest("203.0.113.21"));
    await expect(response.json()).resolves.toMatchObject({ ok: true });
    expect(await store.listPending(10)).toHaveLength(0);
  });
});

describe("join retry endpoint", () => {
  it("stays closed when CRON_SECRET is not configured", async () => {
    const response = await RETRY(retryRequest("anything"));
    expect(response.status).toBe(503);
  });

  it("rejects a missing or wrong bearer token", async () => {
    vi.stubEnv("CRON_SECRET", "correct-horse-battery-staple");
    expect((await RETRY(retryRequest())).status).toBe(401);
    expect((await RETRY(retryRequest("wrong-token"))).status).toBe(401);
    // 长度相同但内容不同，确认比较的是内容而不仅仅是长度。
    expect((await RETRY(retryRequest("correct-horse-battery-stapleX".slice(0, 29)))).status).toBe(401);
  });

  it("refuses to run without a persistent store", async () => {
    vi.stubEnv("CRON_SECRET", "correct-horse-battery-staple");
    const response = await RETRY(retryRequest("correct-horse-battery-staple"));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
