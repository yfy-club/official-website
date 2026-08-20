import type { JoinFormInput } from "@/content/schema";

/**
 * 报名通知内容的唯一事实来源。
 * 纯文本、HTML 邮件与 Webhook 三种渲染都从 buildApplicationFields 派生，
 * 新增报名字段只需要改这一个数组。
 */

export const TRACK_LABELS: Record<JoinFormInput["track"], string> = {
  ai: "人工智能",
  software: "软件工程",
  database: "数据库",
  "cloud-iot": "云计算与物联网",
  industrial: "工业软件",
  other: "其他方向",
};

export type ApplicationField = {
  label: string;
  value: string;
  /** 需要保留换行的长文本字段，在 HTML 中独占一行渲染。 */
  multiline?: boolean;
};

export function resolveTrackLabel(data: JoinFormInput) {
  return data.track === "other" && data.customTrack
    ? `其他方向（${data.customTrack}）`
    : TRACK_LABELS[data.track];
}

export function buildApplicationFields(data: JoinFormInput): ApplicationField[] {
  return [
    { label: "姓名", value: data.name },
    { label: "学号", value: data.studentId },
    { label: "专业班级", value: data.major },
    { label: "年级", value: data.grade },
    { label: "联系方式", value: data.contact },
    { label: "志向方向", value: resolveTrackLabel(data) },
    { label: "申请理由", value: data.reason, multiline: true },
  ];
}

export function buildPlainText(data: JoinFormInput) {
  return [
    "云飞扬官网收到新的加入申请",
    ...buildApplicationFields(data).map((field) => `${field.label}：${field.value}`),
  ].join("\n");
}

/** 邮件主题带上姓名与方向，便于在收件箱内直接检索与归档。 */
export function buildSubject(data: JoinFormInput) {
  return `[官网报名] ${data.name} · ${resolveTrackLabel(data)} · ${data.grade}`;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 联系方式填的是邮箱时用作 reply_to，收信人可以直接回复申请人。 */
export function resolveReplyTo(data: JoinFormInput) {
  const contact = data.contact.trim();
  return EMAIL_REGEX.test(contact) && contact.length <= 254 ? contact : undefined;
}

/**
 * QQ 邮箱及多数国内客户端会剥离 <style> 块，因此全部使用 table 布局与内联样式。
 */
export function buildEmailHtml(data: JoinFormInput) {
  const fields = buildApplicationFields(data);
  const cellBase = "padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.6;";
  const labelStyle = `${cellBase}width:96px;color:#6b7280;white-space:nowrap;vertical-align:top;`;
  const valueStyle = `${cellBase}color:#111827;word-break:break-word;`;

  const rows = fields
    .map((field) => {
      const safeValue = escapeHtml(field.value);
      if (field.multiline) {
        return `<tr><td colspan="2" style="${cellBase}color:#111827;"><div style="color:#6b7280;margin-bottom:6px;">${escapeHtml(field.label)}</div><div style="white-space:pre-wrap;word-break:break-word;">${safeValue}</div></td></tr>`;
      }
      return `<tr><td style="${labelStyle}">${escapeHtml(field.label)}</td><td style="${valueStyle}">${safeValue}</td></tr>`;
    })
    .join("");

  return [
    '<div style="background:#f6f7f9;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',\'PingFang SC\',\'Microsoft YaHei\',sans-serif;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">',
    '<tr><td style="padding:18px 14px;border-bottom:2px solid #111827;">',
    '<div style="font-size:16px;font-weight:600;color:#111827;">云飞扬社团 · 新的加入申请</div>',
    '<div style="font-size:12px;color:#6b7280;margin-top:4px;">本邮件由官网报名表单自动发送</div>',
    "</td></tr>",
    '<tr><td style="padding:6px 0;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">',
    rows,
    "</table>",
    "</td></tr>",
    "</table>",
    "</div>",
  ].join("");
}

export function buildWebhookPayload(url: URL, text: string) {
  if (url.hostname.includes("feishu") || url.hostname.includes("larksuite")) {
    return { msg_type: "text", content: { text } };
  }
  if (url.hostname === "qyapi.weixin.qq.com") {
    return { msgtype: "text", text: { content: text } };
  }
  return { text, content: text };
}
