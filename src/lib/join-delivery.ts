import type { JoinFormInput } from "@/content/schema";
import {
  buildApplicationFields,
  buildEmailHtml,
  buildPlainText,
  buildSubject,
  buildWebhookPayload,
  resolveReplyTo,
} from "@/lib/join-notification";

/**
 * 报名通知投递。/api/join 首次投递与 /api/join/retry 补投都走这里。
 * 只使用 fetch，Node 与边缘运行时通用。
 */

const DEFAULT_MAIL_FROM = "云飞扬社团官网 <onboarding@resend.dev>";

let warnedMissingDelivery = false;

/** 返回 true 表示该渠道已配置并投递成功；false 表示未配置；抛错表示配置了但失败。 */
async function sendWebhook(text: string) {
  const configuredUrl = process.env.JOIN_WEBHOOK_URL?.trim();
  if (!configuredUrl) return false;

  const url = new URL(configuredUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildWebhookPayload(url, text)),
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

  const replyTo = resolveReplyTo(data);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.JOIN_MAIL_FROM?.trim() || DEFAULT_MAIL_FROM,
      to: recipients,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: buildSubject(data),
      text,
      html: buildEmailHtml(data),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

export type DeliveryOutcome = {
  /** 已配置的渠道数量。 */
  configured: number;
  /** 实际投递成功的渠道数量。 */
  delivered: number;
  /** 供存储层记录的失败摘要。 */
  error?: string;
};

export async function deliverApplication(data: JoinFormInput): Promise<DeliveryOutcome> {
  const text = buildPlainText(data);
  const deliveries = await Promise.allSettled([sendWebhook(text), sendEmail(data, text)]);
  const labels = ["Webhook", "email"];
  const failures: string[] = [];
  let configured = 0;
  let delivered = 0;

  deliveries.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (result.value) {
        configured += 1;
        delivered += 1;
      }
      return;
    }
    // 抛错说明该渠道配置了但投递失败，同样计入 configured。
    configured += 1;
    const reason = result.reason instanceof Error ? result.reason.message : "unknown";
    failures.push(`${labels[index]}: ${reason}`);
    const detail = /^HTTP \d{3}$/.test(reason) ? ` (${reason})` : "";
    console.error(`[join] ${labels[index]} delivery failed${detail}.`);
  });

  if (configured === 0 && !warnedMissingDelivery) {
    console.warn("[join] No notification channel is configured; submissions are only stored.");
    warnedMissingDelivery = true;
  }

  return { configured, delivered, error: failures.join("; ") || undefined };
}

/** 报名既没送达也没落库时的最后一道防线：完整内容写入平台日志，供人工恢复。 */
export function logUndeliveredApplication(data: JoinFormInput) {
  console.error(`[join] UNDELIVERED APPLICATION ${JSON.stringify(
    Object.fromEntries(buildApplicationFields(data).map((field) => [field.label, field.value])),
  )}`);
}
