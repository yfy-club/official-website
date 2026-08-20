import { deliverApplication } from "@/lib/join-delivery";
import { isPersistentStore, resolveJoinStore, MAX_DELIVERY_ATTEMPTS } from "@/lib/join-store";

export const dynamic = "force-dynamic";

/**
 * 补投未送达的报名。由 GitHub Actions 定时调用（见 .github/workflows/join-retry.yml），
 * 这样调度与部署平台解耦，EdgeOne 是否支持 cron 都不影响。
 *
 * 需要 CRON_SECRET；未配置时接口直接关闭，不会留下一个无鉴权的公开端点。
 */

const MAX_BATCH = 25;

/** 常量时间比较，避免通过响应耗时逐字节猜测 Secret。 */
function secretMatches(provided: string, expected: string) {
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < provided.length; index += 1) {
    diff |= provided.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return diff === 0;
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) {
    console.warn("[join-retry] CRON_SECRET is not configured; the retry endpoint is disabled.");
    return json({ ok: false, message: "Retry endpoint is not configured." }, 503);
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (!secretMatches(provided, expected)) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }

  if (!isPersistentStore()) {
    return json({ ok: false, message: "No persistent store is configured." }, 503);
  }

  const store = resolveJoinStore();
  let pending;
  try {
    pending = await store.listPending(MAX_BATCH);
  } catch (error) {
    console.error(`[join-retry] Failed to read pending applications: ${error instanceof Error ? error.message : "unknown"}`);
    return json({ ok: false, message: "Store unavailable." }, 502);
  }

  let delivered = 0;
  let abandoned = 0;
  let stillPending = 0;

  for (const record of pending) {
    const outcome = await deliverApplication(record.data);
    try {
      if (outcome.delivered > 0) {
        await store.markDelivered(record);
        delivered += 1;
        continue;
      }
      await store.markFailed(record, outcome.error ?? "no channel delivered");
      if (record.attempts + 1 >= MAX_DELIVERY_ATTEMPTS) abandoned += 1;
      else stillPending += 1;
    } catch (error) {
      console.error(`[join-retry] Failed to update ${record.id}: ${error instanceof Error ? error.message : "unknown"}`);
      stillPending += 1;
    }
  }

  if (abandoned > 0) {
    console.error(`[join-retry] ${abandoned} application(s) exceeded ${MAX_DELIVERY_ATTEMPTS} attempts and need manual handling.`);
  }

  return json({ ok: true, scanned: pending.length, delivered, stillPending, abandoned });
}
