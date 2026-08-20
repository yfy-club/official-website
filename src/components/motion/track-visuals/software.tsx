"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Bar, Legend, NodeBox, Readout, SegControl, VisualFrame } from "./frame";

/* ══════════════════════════════════════════════════════════════════
   SW_DIST_01 · 雪花 ID 的 64 位版图
   点一次生成一个真的 BigInt ID，位格实时重排，同时统计它落到哪个
   分片 —— 「单调递增」与「分片均匀」两件事在同一张图里可被验证。
   ══════════════════════════════════════════════════════════════════ */

const EPOCH = BigInt("1577836800000"); // 2020-01-01
const BASE_TS = BigInt("1755600000000"); // 固定基准，避免 SSR 与客户端不一致
const SHARDS = 8;

const FIELDS = [
  { name: "sign", bits: 1, swatch: "bg-[var(--border-strong)]", desc: "符号位恒为 0，保证 ID 非负" },
  { name: "timestamp", bits: 41, swatch: "bg-[var(--accent)]", desc: "毫秒时间差，决定趋势递增" },
  { name: "worker", bits: 10, swatch: "bg-[var(--warn)]", desc: "机房 + 机器号，1024 个节点无冲突" },
  { name: "sequence", bits: 12, swatch: "bg-[var(--fg-muted)]", desc: "同毫秒内自增，单机 4096 QPS" },
];

export function SwSnowflakeVisual() {
  const [worker, setWorker] = useState("17");
  const [tick, setTick] = useState(3);

  const workerId = BigInt(worker);

  const ids = useMemo(() => {
    const list: { id: bigint; ts: bigint; seq: bigint }[] = [];
    for (let i = 0; i < tick; i += 1) {
      const ts = BASE_TS + BigInt(Math.floor(i / 3));
      const seq = BigInt(i % 3) + (BigInt(i * 7) % BigInt(5));
      const id = (((ts - EPOCH) << BigInt(22)) | (workerId << BigInt(12))) | seq;
      list.push({ id, ts, seq });
    }
    return list;
  }, [tick, workerId]);

  const latest = ids[ids.length - 1];
  const bits = latest.id.toString(2).padStart(64, "0");

  const shardCounts = useMemo(() => {
    const counts = new Array<number>(SHARDS).fill(0);
    ids.forEach((item) => {
      counts[Number(item.id % BigInt(SHARDS))] += 1;
    });
    return counts;
  }, [ids]);

  const maxShard = Math.max(...shardCounts, 1);

  return (
    <VisualFrame
      label="SNOWFLAKE · 64-BIT LAYOUT"
      control={
        <div className="flex items-center gap-2">
          <SegControl
            ariaLabel="选择工作节点"
            value={worker}
            onChange={setWorker}
            options={[
              { value: "17", label: "node-17" },
              { value: "512", label: "node-512" },
              { value: "1023", label: "node-1023" },
            ]}
          />
          <button
            type="button"
            onClick={() => setTick((current) => Math.min(current + 1, 48))}
            className="cursor-pointer rounded-[var(--radius-xs)] border border-[var(--border-strong)] px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--fg)] transition-colors hover:bg-[var(--surface-2)] active:scale-[0.97]"
          >
            生成 ID
          </button>
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Readout
            items={[
              { k: "已生成", v: `${tick} 个` },
              { k: "理论上限", v: "409.6 万 / 秒" },
              { k: "分片偏差", v: `${(((maxShard - Math.min(...shardCounts)) / maxShard) * 100).toFixed(0)}%`, tone: "accent" },
            ]}
          />
          <Legend items={FIELDS.map((field) => ({ swatch: field.swatch, label: `${field.name} · ${field.bits}b` }))} />
        </div>
      }
    >
      <div className="space-y-6">
        {/* 位版图 */}
        <div className="space-y-2">
          <div className="flex gap-[2px]" aria-hidden="true">
            {bits.split("").map((bit, index) => {
              const field =
                index === 0 ? FIELDS[0] : index < 42 ? FIELDS[1] : index < 52 ? FIELDS[2] : FIELDS[3];
              return (
                <span
                  key={`bit-${index}`}
                  className={cn(
                    "h-7 flex-1 rounded-[1px] transition-opacity duration-200",
                    field.swatch,
                    bit === "1" ? "opacity-100" : "opacity-[0.18]",
                  )}
                />
              );
            })}
          </div>
          <div className="flex gap-[2px] font-mono text-[9px] text-[var(--fg-faint)]" aria-hidden="true">
            {FIELDS.map((field) => (
              <span
                key={field.name}
                className="truncate border-t border-[var(--border)] pt-1 text-center"
                style={{ flex: field.bits }}
              >
                {field.name} · {field.bits}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 解码明细 */}
          <div className="space-y-3 lg:col-span-7">
            <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
              <div className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">
                GENERATED ID (DECIMAL)
              </div>
              <div className="mt-1 font-mono text-lg font-bold tabular break-all text-[var(--fg)] sm:text-xl">
                {latest.id.toString()}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-[var(--border)] pt-3 font-mono text-[11px] sm:grid-cols-3">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--fg-faint)]">timestamp</dt>
                  <dd className="tabular text-[var(--fg)]">{(latest.ts - EPOCH).toString()}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--fg-faint)]">worker</dt>
                  <dd className="tabular text-[var(--warn)]">{worker}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--fg-faint)]">sequence</dt>
                  <dd className="tabular text-[var(--fg)]">{latest.seq.toString()}</dd>
                </div>
              </dl>
            </div>

            <ul className="space-y-1 font-mono text-[10px] text-[var(--fg-muted)]">
              {FIELDS.map((field) => (
                <li key={field.name} className="flex gap-2">
                  <span aria-hidden="true" className={cn("mt-[5px] inline-block h-2 w-2 shrink-0 rounded-[1px]", field.swatch)} />
                  <span>
                    <span className="text-[var(--fg)]">{field.name}</span> — {field.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 分片落点 */}
          <div className="space-y-2 lg:col-span-5">
            <span className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">
              SHARD ROUTING · id % {SHARDS}
            </span>
            <ul className="space-y-1.5">
              {shardCounts.map((count, index) => (
                <li key={`shard-${index}`} className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="w-14 shrink-0 text-[var(--fg-muted)]">db_{index}</span>
                  <Bar ratio={count / maxShard} className="flex-1" />
                  <span className="w-6 shrink-0 text-right tabular font-bold text-[var(--fg)]">{count}</span>
                </li>
              ))}
            </ul>
            <p className="pt-1 text-[11px] leading-relaxed text-[var(--fg-muted)]">
              低 12 位序列号让相邻 ID 的模值均匀铺开；若直接用时间戳取模，同毫秒内的写入会全部砸在同一个分片上。
            </p>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SW_CACHE_02 · 热点 Key 击穿与 SingleFlight
   同一批并发请求，开关一拧，回源次数从 N 变成 1。
   ══════════════════════════════════════════════════════════════════ */

const LANES = 12;

export function SwCacheVisual() {
  const [mode, setMode] = useState("on");
  const guarded = mode === "on";

  const dbCalls = guarded ? 1 : LANES;
  const dbQps = guarded ? 1 : 118_000;

  return (
    <VisualFrame
      label="CACHE STAMPEDE · L1 → L2 → DB"
      control={
        <SegControl
          ariaLabel="SingleFlight 开关"
          value={mode}
          onChange={setMode}
          options={[
            { value: "off", label: "裸回源" },
            { value: "on", label: "SingleFlight" },
          ]}
        />
      }
      footer={
        <Readout
          items={[
            { k: "并发请求", v: `${LANES} / 批` },
            { k: "回源次数", v: dbCalls, tone: guarded ? "success" : "danger" },
            { k: "DB 峰值 QPS", v: dbQps.toLocaleString("en-US"), tone: guarded ? "success" : "danger" },
            { k: "p99", v: guarded ? "6.2 ms" : "1840 ms", tone: guarded ? "success" : "danger" },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 三级链路 */}
        <div className="grid grid-cols-3 gap-3 lg:col-span-5 lg:grid-cols-1">
          <NodeBox title="L1 · Caffeine 本地" meta="进程内" active>
            <p className="font-mono text-[10px] text-[var(--fg-muted)]">命中率 82% · 亚毫秒</p>
          </NodeBox>
          <NodeBox title="L2 · Redis 集群" meta="hotkey EXPIRED" active tone="warn">
            <p className="font-mono text-[10px] text-[var(--warn)]">热点 Key 刚过期，本批全部未命中</p>
          </NodeBox>
          <NodeBox
            title="DB · 分片 MySQL"
            meta={`${dbCalls} 次回源`}
            active
            tone={guarded ? "accent" : "danger"}
          >
            <p
              className={cn(
                "font-mono text-[10px]",
                guarded ? "text-[var(--fg-muted)]" : "text-[var(--danger)]",
              )}
            >
              {guarded ? "仅 leader 协程穿透，连接池平稳" : "连接池耗尽，线程阻塞，雪崩扩散至上游"}
            </p>
          </NodeBox>
        </div>

        {/* 请求泳道 */}
        <div className="space-y-1.5 lg:col-span-7">
          <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)]">
            <span>CONCURRENT REQUESTS</span>
            <span>TIMELINE →</span>
          </div>
          {Array.from({ length: LANES }, (_, index) => {
            const isLeader = index === 0;
            const passthrough = !guarded || isLeader;

            return (
              <div key={`lane-${index}`} className="flex items-center gap-2">
                <span className="w-10 shrink-0 font-mono text-[9px] text-[var(--fg-faint)]">
                  req{String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex h-4 flex-1 items-center gap-[2px]">
                  <span className="h-full w-[12%] rounded-[1px] bg-[var(--border-strong)]" title="L1 未命中" />
                  <span className="h-full w-[12%] rounded-[1px] bg-[var(--warn)]/60" title="L2 未命中" />
                  {passthrough ? (
                    <span
                      className={cn(
                        "h-full flex-1 rounded-[1px]",
                        guarded ? "bg-[var(--accent)]" : "bg-[var(--danger)]",
                      )}
                      title="回源数据库"
                    />
                  ) : (
                    <span
                      className="h-full flex-1 rounded-[1px] bg-[var(--surface-2)] bg-[repeating-linear-gradient(45deg,var(--border-strong)_0_3px,transparent_3px_7px)]"
                      title="挂起等待 leader 结果"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "w-20 shrink-0 text-right font-mono text-[9px]",
                    passthrough
                      ? guarded
                        ? "text-[var(--accent)]"
                        : "text-[var(--danger)]"
                      : "text-[var(--fg-faint)]",
                  )}
                >
                  {passthrough ? (guarded ? "LEADER 回源" : "回源 DB") : "等待共享结果"}
                </span>
              </div>
            );
          })}

          <p className="pt-2 text-[11px] leading-relaxed text-[var(--fg-muted)]">
            {guarded
              ? "SingleFlight 用一把按 Key 分片的锁把同一时刻的重复回源合并成一次，其余协程挂在同一个 Promise 上等结果，DB 只感知到 1 次查询。"
              : "热点 Key 过期的瞬间，本批 12 个请求（真实场景是十万级 QPS）同时穿透两级缓存直达数据库，连接池秒空。"}
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SW_AGENT_03 · 智能体的 ReAct 循环
   把「对话生成」和「能自我修正的工程智能体」的差别摊成一条可单步
   走查的调用轨迹：报错分支里，模型读到 schema 校验失败后自己改参数。
   ══════════════════════════════════════════════════════════════════ */

interface AgentStep {
  role: "THOUGHT" | "TOOL_CALL" | "OBSERVATION" | "REPAIR" | "FINAL";
  title: string;
  body: string;
  tone?: "default" | "danger" | "success";
}

const HAPPY_PATH: AgentStep[] = [
  { role: "THOUGHT", title: "拆解意图", body: "用户想查『上周入库异常的批次』。需要先取时间范围，再查批次表，最后聚合。" },
  { role: "TOOL_CALL", title: "queryBatches", body: '{ "range": "2026-08-10/2026-08-16", "status": "ABNORMAL" }' },
  { role: "OBSERVATION", title: "返回 23 条", body: "[ { batch: \"B-2291\", defectRate: 0.061 }, … ]", tone: "success" },
  { role: "FINAL", title: "生成答复", body: "上周 23 个批次入库异常，缺陷率最高的是 B-2291（6.1%），集中在二号产线夜班。" },
];

const REPAIR_PATH: AgentStep[] = [
  { role: "THOUGHT", title: "拆解意图", body: "用户想查『上周入库异常的批次』。需要先取时间范围，再查批次表，最后聚合。" },
  { role: "TOOL_CALL", title: "queryBatches", body: '{ "range": "上周", "status": "异常" }' },
  {
    role: "OBSERVATION",
    title: "ZodError · 参数校验失败",
    body: 'range: Invalid format, expected "YYYY-MM-DD/YYYY-MM-DD"\nstatus: Invalid enum value, expected "ABNORMAL" | "NORMAL"',
    tone: "danger",
  },
  {
    role: "REPAIR",
    title: "读错误并自我修正",
    body: "校验器把期望格式写进了报错里。把自然语言时间解析成绝对区间，状态映射到枚举值后重试。",
  },
  { role: "TOOL_CALL", title: "queryBatches (retry)", body: '{ "range": "2026-08-10/2026-08-16", "status": "ABNORMAL" }' },
  { role: "OBSERVATION", title: "返回 23 条", body: "[ { batch: \"B-2291\", defectRate: 0.061 }, … ]", tone: "success" },
  { role: "FINAL", title: "生成答复", body: "上周 23 个批次入库异常，缺陷率最高的是 B-2291（6.1%），集中在二号产线夜班。" },
];

const ROLE_STYLE: Record<AgentStep["role"], string> = {
  THOUGHT: "text-[var(--fg-muted)]",
  TOOL_CALL: "text-[var(--accent)]",
  OBSERVATION: "text-[var(--fg)]",
  REPAIR: "text-[var(--warn)]",
  FINAL: "text-[var(--success)]",
};

export function SwAgentVisual() {
  const [path, setPath] = useState("repair");
  const steps = path === "repair" ? REPAIR_PATH : HAPPY_PATH;
  const [cursor, setCursor] = useState(REPAIR_PATH.length - 1);
  const active = Math.min(cursor, steps.length - 1);

  return (
    <VisualFrame
      label="ReAct LOOP · 工具调用轨迹"
      control={
        <SegControl
          ariaLabel="选择执行路径"
          value={path}
          onChange={(next) => {
            setPath(next);
            setCursor((next === "repair" ? REPAIR_PATH : HAPPY_PATH).length - 1);
          }}
          options={[
            { value: "happy", label: "一次命中" },
            { value: "repair", label: "报错自愈" },
          ]}
        />
      }
      footer={
        <Readout
          items={[
            { k: "轮次", v: `${active + 1} / ${steps.length}` },
            { k: "工具调用", v: steps.filter((step) => step.role === "TOOL_CALL").length },
            {
              k: "自愈",
              v: path === "repair" ? "1 次（无人工介入）" : "未触发",
              tone: path === "repair" ? "warn" : "default",
            },
            { k: "输出约束", v: "Zod Schema", tone: "accent" },
          ]}
        />
      }
    >
      <ol className="space-y-0">
        {steps.map((step, index) => {
          const isActive = index <= active;
          return (
            <li key={`${step.role}-${index}`} className="flex gap-3 sm:gap-4">
              {/* 轨道 */}
              <div className="flex w-6 shrink-0 flex-col items-center pt-1.5">
                <span
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full border transition-colors",
                    isActive
                      ? step.tone === "danger"
                        ? "border-[var(--danger)] bg-[var(--danger)]"
                        : "border-[var(--accent)] bg-[var(--accent)]"
                      : "border-[var(--border-strong)] bg-[var(--surface)]",
                  )}
                />
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "w-px flex-1 transition-colors",
                      isActive ? "bg-[var(--border-strong)]" : "bg-[var(--border)]",
                    )}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => setCursor(index)}
                className={cn(
                  "mb-2 flex-1 cursor-pointer rounded-[var(--radius-xs)] border p-3 text-left transition-all active:scale-[0.99]",
                  index === active
                    ? "border-[var(--border-strong)] bg-[var(--surface-2)]"
                    : "border-transparent hover:bg-[var(--surface-2)]/50",
                  isActive ? "opacity-100" : "opacity-45",
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className={cn("font-mono text-[10px] font-bold tracking-wider", ROLE_STYLE[step.role])}>
                    {step.role}
                  </span>
                  <span className="text-xs font-bold text-[var(--fg)]">{step.title}</span>
                </div>
                <pre
                  className={cn(
                    "mt-1.5 overflow-x-auto no-scrollbar whitespace-pre-wrap font-mono text-[11px] leading-relaxed",
                    step.tone === "danger" ? "text-[var(--danger)]" : "text-[var(--fg-muted)]",
                  )}
                >
                  {step.body}
                </pre>
              </button>
            </li>
          );
        })}
      </ol>
    </VisualFrame>
  );
}
