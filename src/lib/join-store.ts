import type { JoinFormInput } from "@/content/schema";
import { readUpstashConfig, upstashPipeline, type UpstashConfig } from "@/lib/upstash";

/**
 * 报名记录持久化。
 *
 * 写入发生在投递通知之前，因此只要 append 成功，报名数据就已经安全落地，
 * 邮件或 Webhook 失败都可以由 /api/join/retry 事后补投。
 *
 * 存储后端藏在 JoinStore 接口之后：默认走 Upstash Redis REST（纯 fetch，
 * 各平台通用），本地开发与单测走进程内实现；将来若平台固定，可以再补
 * EdgeOne KV 或 Cloudflare D1 实现而不必改动路由。
 */

export type JoinRecord = {
  /** 已尝试投递的次数，用于封顶避免无限重试。 */
  attempts: number;
  data: JoinFormInput;
  id: string;
  lastError?: string;
  /** 收到报名的时间（毫秒时间戳）。 */
  receivedAt: number;
};

export interface JoinStore {
  /** 落库一条待投递的报名，返回记录；失败时抛出。 */
  append(data: JoinFormInput, now?: number): Promise<JoinRecord>;
  /** 取出待投递的报名，按收到时间从早到晚。 */
  listPending(limit: number): Promise<JoinRecord[]>;
  /** 投递成功，销账。 */
  markDelivered(record: JoinRecord): Promise<void>;
  /** 投递失败，累加计数；超过上限后移出待投递队列，避免定时任务空转。 */
  markFailed(record: JoinRecord, error: string): Promise<void>;
}

/** 超过该次数仍未送达的记录不再自动重试，转入 join:abandoned 等待人工处理。 */
export const MAX_DELIVERY_ATTEMPTS = 10;

/** 报名属于个人信息，默认只保留 180 天。 */
const DEFAULT_RETENTION_DAYS = 180;

const PENDING_KEY = "join:pending";
const ABANDONED_KEY = "join:abandoned";

function recordKey(id: string) {
  return `join:record:${id}`;
}

function retentionSeconds() {
  const configured = Number(process.env.JOIN_RETENTION_DAYS);
  const days = Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_RETENTION_DAYS;
  return Math.round(days * 24 * 60 * 60);
}

function createRecord(data: JoinFormInput, now: number): JoinRecord {
  return { id: crypto.randomUUID(), receivedAt: now, attempts: 0, data };
}

/** 进程内实现：本地开发与单测使用，进程重启即丢失，不可用于生产。 */
export class MemoryJoinStore implements JoinStore {
  private readonly records = new Map<string, JoinRecord>();

  async append(data: JoinFormInput, now = Date.now()) {
    const record = createRecord(data, now);
    this.records.set(record.id, record);
    return record;
  }

  async listPending(limit: number) {
    return [...this.records.values()]
      .sort((a, b) => a.receivedAt - b.receivedAt)
      .slice(0, limit);
  }

  async markDelivered(record: JoinRecord) {
    this.records.delete(record.id);
  }

  async markFailed(record: JoinRecord, error: string) {
    const attempts = record.attempts + 1;
    if (attempts >= MAX_DELIVERY_ATTEMPTS) {
      this.records.delete(record.id);
      return;
    }
    this.records.set(record.id, { ...record, attempts, lastError: error });
  }

  clear() {
    this.records.clear();
  }
}

export class UpstashJoinStore implements JoinStore {
  constructor(private readonly config: UpstashConfig) {}

  async append(data: JoinFormInput, now = Date.now()) {
    const record = createRecord(data, now);
    await upstashPipeline(this.config, [
      ["SET", recordKey(record.id), JSON.stringify(record), "EX", retentionSeconds()],
      ["ZADD", PENDING_KEY, record.receivedAt, record.id],
    ]);
    return record;
  }

  async listPending(limit: number) {
    const [ids] = await upstashPipeline(this.config, [
      ["ZRANGE", PENDING_KEY, 0, Math.max(0, limit - 1)],
    ]);
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const [payloads] = await upstashPipeline(this.config, [
      ["MGET", ...ids.map((id) => recordKey(String(id)))],
    ]);
    if (!Array.isArray(payloads)) return [];

    const records: JoinRecord[] = [];
    const orphaned: string[] = [];
    payloads.forEach((payload, index) => {
      const id = String(ids[index]);
      // 记录已过保留期但索引还在，清掉索引避免定时任务反复空跑。
      if (typeof payload !== "string") {
        orphaned.push(id);
        return;
      }
      try {
        records.push(JSON.parse(payload) as JoinRecord);
      } catch {
        orphaned.push(id);
      }
    });

    if (orphaned.length > 0) {
      await upstashPipeline(this.config, [["ZREM", PENDING_KEY, ...orphaned]]);
    }
    return records;
  }

  async markDelivered(record: JoinRecord) {
    await upstashPipeline(this.config, [
      ["ZREM", PENDING_KEY, record.id],
      ["DEL", recordKey(record.id)],
    ]);
  }

  async markFailed(record: JoinRecord, error: string) {
    const attempts = record.attempts + 1;
    const next: JoinRecord = { ...record, attempts, lastError: error.slice(0, 200) };
    const commands: Parameters<typeof upstashPipeline>[1] = [
      ["SET", recordKey(record.id), JSON.stringify(next), "EX", retentionSeconds()],
    ];
    if (attempts >= MAX_DELIVERY_ATTEMPTS) {
      commands.push(["ZREM", PENDING_KEY, record.id]);
      commands.push(["ZADD", ABANDONED_KEY, record.receivedAt, record.id]);
    }
    await upstashPipeline(this.config, commands);
  }
}

let memoryStore: MemoryJoinStore | null = null;

/**
 * 每次调用都重新读取环境变量，便于测试切换后端。
 * 未配置 Upstash 时返回共享的进程内实现。
 */
export function resolveJoinStore(): JoinStore {
  const config = readUpstashConfig();
  if (config) return new UpstashJoinStore(config);
  memoryStore ??= new MemoryJoinStore();
  return memoryStore;
}

export function isPersistentStore() {
  return readUpstashConfig() !== null;
}
