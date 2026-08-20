/**
 * Upstash Redis REST 传输层。
 * 只使用 fetch，因此在 Node 运行时与边缘运行时（EdgeOne Pages、Cloudflare Workers）上行为一致。
 * 限流与报名存储共用这里的连接配置与 pipeline 调用。
 */

export type UpstashConfig = {
  restToken: string;
  restUrl: string;
};

export type UpstashCommand = Array<string | number>;

/** 未配置时返回 null，调用方据此回退到进程内实现。 */
export function readUpstashConfig(): UpstashConfig | null {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!restUrl || !restToken) return null;
  return { restUrl: restUrl.replace(/\/$/, ""), restToken };
}

/** 执行一组命令并按顺序返回结果；任一命令报错或 HTTP 失败都会抛出。 */
export async function upstashPipeline(
  config: UpstashConfig,
  commands: UpstashCommand[],
  timeoutMs = 4_000,
): Promise<unknown[]> {
  const response = await fetch(`${config.restUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.restToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands.map((command) => command.map(String))),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const results = await response.json() as Array<{ result?: unknown; error?: string }>;
  if (!Array.isArray(results) || results.length !== commands.length) {
    throw new Error("Unexpected Upstash pipeline response");
  }

  return results.map((entry, index) => {
    if (entry?.error) throw new Error(`${commands[index][0]}: ${entry.error}`);
    return entry?.result;
  });
}
