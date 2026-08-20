"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Bar, NodeBox, Readout, SegControl, VisualFrame } from "./frame";

/* ══════════════════════════════════════════════════════════════════
   DB_BTREE_01 · 为什么是 B+ 树而不是红黑树
   同一次等值查找，两种结构并排跑：比的不是比较次数，是磁盘 I/O 次数。
   ══════════════════════════════════════════════════════════════════ */

const KEYS = [15, 42, 68, 92];

const LEAVES = [
  { page: "#201", keys: [15, 20, 28], lo: 0, hi: 30 },
  { page: "#202", keys: [35, 42, 48], lo: 30, hi: 50 },
  { page: "#203", keys: [60, 68, 70], lo: 50, hi: 80 },
  { page: "#204", keys: [85, 92, 99], lo: 80, hi: 999 },
];

export function DbBTreeVisual() {
  const [structure, setStructure] = useState("bplus");
  const [key, setKey] = useState(42);

  const isBPlus = structure === "bplus";
  const leafIndex = LEAVES.findIndex((leaf) => key >= leaf.lo && key < leaf.hi);
  const internalIndex = key < 50 ? 0 : 1;

  /** 千万行数据下的真实量级：扇出 1170 的 B+ 树 3 层到底，红黑树 log2(1e7) ≈ 24 层 */
  const io = isBPlus ? 3 : 24;

  return (
    <VisualFrame
      label="INDEX LOOKUP · 1000 万行 / 页大小 16KB"
      control={
        <SegControl
          ariaLabel="选择索引结构"
          value={structure}
          onChange={setStructure}
          options={[
            { value: "bplus", label: "B+ 树" },
            { value: "rbtree", label: "红黑树" },
          ]}
        />
      }
      footer={
        <Readout
          items={[
            { k: "树高", v: isBPlus ? "3" : "24" },
            { k: "磁盘 I/O", v: `${io} 次`, tone: isBPlus ? "success" : "danger" },
            { k: "预估耗时", v: isBPlus ? "0.3 ms" : "2.4 ms", tone: isBPlus ? "success" : "danger" },
            { k: "范围查询", v: isBPlus ? "叶子链表顺序扫描" : "需回溯中序遍历", tone: isBPlus ? "success" : "warn" },
          ]}
        />
      }
    >
      <div className="space-y-5">
        {/* 查找键 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">WHERE id =</span>
          {KEYS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setKey(candidate)}
              className={cn(
                "cursor-pointer rounded-[var(--radius-xs)] border px-2.5 py-1 font-mono text-[11px] transition-colors active:scale-[0.95]",
                key === candidate
                  ? "border-[var(--accent)] bg-[var(--accent)] font-bold text-[var(--accent-fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
              )}
            >
              {candidate}
            </button>
          ))}
        </div>

        {isBPlus ? (
          <div className="space-y-3">
            {/* Level 0 */}
            <div className="flex justify-center">
              <NodeBox title="ROOT · page #100" meta="LEVEL 0" active className="w-full max-w-[280px] text-center">
                <span className="font-mono text-xs text-[var(--fg)]">[ key &lt; 50 | key ≥ 50 ]</span>
              </NodeBox>
            </div>

            {/* Level 1 */}
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3">
              {[
                { page: "#102", keys: "[ 20 | 30 | 50 ]" },
                { page: "#103", keys: "[ 60 | 70 | 85 ]" },
              ].map((node, index) => (
                <NodeBox
                  key={node.page}
                  title={`INTERNAL · page ${node.page}`}
                  meta="LEVEL 1"
                  active={internalIndex === index}
                  className="text-center"
                >
                  <span className="font-mono text-xs">{node.keys}</span>
                </NodeBox>
              ))}
            </div>

            {/* Level 2 叶子 + 双向链表 */}
            <div className="grid grid-cols-2 gap-3 border-t border-dashed border-[var(--border)] pt-3 sm:grid-cols-4">
              {LEAVES.map((leaf, index) => (
                <NodeBox
                  key={leaf.page}
                  title={`LEAF ${leaf.page}`}
                  meta={leafIndex === index ? "HIT" : undefined}
                  active={leafIndex === index}
                >
                  <span className="font-mono text-xs">
                    [
                    {leaf.keys.map((k, i) => (
                      <span key={k} className={k === key ? "font-bold text-[var(--accent)]" : undefined}>
                        {i > 0 ? ", " : " "}
                        {k}
                      </span>
                    ))}{" "}
                    ]
                  </span>
                </NodeBox>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--fg-faint)]">
              <span className="h-px flex-1 bg-[var(--border-strong)]" />
              <span>叶子节点双向链表 · 范围查询无需回到上层</span>
              <span className="h-px flex-1 bg-[var(--border-strong)]" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-[3px]">
              {Array.from({ length: 24 }, (_, index) => (
                <div
                  key={`hop-${index}`}
                  className="flex h-9 flex-1 min-w-[26px] flex-col items-center justify-center rounded-[2px] border border-[var(--danger)]/30 bg-[var(--danger)]/8 font-mono text-[9px] text-[var(--danger)]"
                >
                  <span>{index + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              红黑树每个节点只存一个键，千万行要走 24 层。每层都是一次随机地址跳转 —— 内存里这很便宜，
              但索引落在磁盘上时，这就是 24 次随机 I/O。B+ 树把一个 16KB 页塞进上千个键，
              用<span className="font-bold text-[var(--fg)]">扇出</span>换<span className="font-bold text-[var(--fg)]">树高</span>，
              三次 I/O 到底，而且非叶子层常驻内存，实际落盘往往只有最后一次。
            </p>
          </div>
        )}
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DB_MVCC_02 · ReadView 可见性判定
   切换「谁在读」，逐条版本套一遍可见性规则，看它读到哪一行余额。
   ══════════════════════════════════════════════════════════════════ */

interface Version {
  trxId: number;
  balance: string;
  rollPtr: string;
  note: string;
}

const VERSIONS: Version[] = [
  { trxId: 1052, balance: "¥ 9,800.00", rollPtr: "0x7f890", note: "尚未提交的活跃事务写入" },
  { trxId: 1045, balance: "¥ 8,500.00", rollPtr: "0x7f88a", note: "已提交的最新版本" },
  { trxId: 1032, balance: "¥ 6,200.00", rollPtr: "0x7f880", note: "Undo Log 历史版本" },
  { trxId: 1010, balance: "¥ 3,000.00", rollPtr: "NULL", note: "基线版本" },
];

const READERS: Record<
  string,
  { label: string; creator: number; minTrx: number; maxTrx: number; active: number[] }
> = {
  early: { label: "事务 1040", creator: 1040, minTrx: 1032, maxTrx: 1046, active: [1032, 1045] },
  late: { label: "事务 1055", creator: 1055, minTrx: 1052, maxTrx: 1056, active: [1052] },
};

function judge(version: Version, reader: (typeof READERS)[string]) {
  if (version.trxId === reader.creator) return { visible: true, rule: "自己的修改，永远可见" };
  if (version.trxId >= reader.maxTrx) return { visible: false, rule: `trx_id ≥ max_trx(${reader.maxTrx})，快照之后才开始` };
  if (reader.active.includes(version.trxId)) return { visible: false, rule: "在活跃事务列表中，尚未提交" };
  if (version.trxId < reader.minTrx) return { visible: true, rule: `trx_id < min_trx(${reader.minTrx})，快照前已提交` };
  return { visible: true, rule: "不在活跃列表，快照生成前已提交" };
}

export function DbMvccVisual() {
  const [readerKey, setReaderKey] = useState("early");
  const reader = READERS[readerKey];

  const judgements = useMemo(() => VERSIONS.map((version) => judge(version, reader)), [reader]);
  const firstVisible = judgements.findIndex((item) => item.visible);

  return (
    <VisualFrame
      label="MVCC · ReadView 沿 Undo 链回溯"
      control={
        <SegControl
          ariaLabel="选择读事务"
          value={readerKey}
          onChange={setReaderKey}
          options={Object.entries(READERS).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      }
      footer={
        <Readout
          items={[
            { k: "min_trx", v: reader.minTrx },
            { k: "max_trx", v: reader.maxTrx },
            { k: "活跃列表", v: `[ ${reader.active.join(", ")} ]` },
            { k: "读到的值", v: VERSIONS[firstVisible]?.balance ?? "—", tone: "accent" },
            { k: "加锁", v: "0 把（快照读）", tone: "success" },
          ]}
        />
      }
    >
      <ol className="space-y-2">
        {VERSIONS.map((version, index) => {
          const verdict = judgements[index];
          const isRead = index === firstVisible;
          const skipped = index < firstVisible;

          return (
            <li key={version.trxId}>
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[var(--radius-xs)] border p-3 transition-all",
                  isRead
                    ? "border-[var(--accent)] bg-[var(--accent)]/6"
                    : skipped
                      ? "border-[var(--border)] bg-[var(--surface-2)]/40 opacity-70"
                      : "border-[var(--border)] bg-[var(--surface-2)]/20 opacity-50",
                )}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--fg)]">TRX_ID {version.trxId}</span>
                    <span className="font-mono text-[10px] text-[var(--fg-faint)]">
                      roll_ptr → {version.rollPtr}
                    </span>
                    {isRead && (
                      <span className="rounded-[2px] border border-[var(--accent)] px-1.5 font-mono text-[9px] font-bold text-[var(--accent)]">
                        本次读取
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-[var(--fg-muted)]">
                    {verdict.visible ? "✓ " : "✕ "}
                    {verdict.rule}
                  </p>
                </div>

                <div className="text-right">
                  <div
                    className={cn(
                      "font-mono text-sm font-bold tabular",
                      isRead ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
                    )}
                  >
                    {version.balance}
                  </div>
                  <div className="font-mono text-[9px] text-[var(--fg-faint)]">{version.note}</div>
                </div>
              </div>

              {index < VERSIONS.length - 1 && (
                <div className="ml-5 flex items-center gap-2 py-0.5 font-mono text-[9px] text-[var(--fg-faint)]">
                  <span className="h-3 w-px bg-[var(--border-strong)]" />
                  {index < firstVisible ? "不可见，沿 undo 链继续回溯" : "链尾"}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DB_WAL_03 · 崩溃恢复
   三个阶段单步走：写日志 → 断电 → 重启重放。脏页丢了，但日志还在。
   ══════════════════════════════════════════════════════════════════ */

interface LogRecord {
  lsn: number;
  op: string;
  flushed: boolean;
}

const LOG: LogRecord[] = [
  { lsn: 8801, op: "UPDATE account SET balance=6200 WHERE id=7", flushed: true },
  { lsn: 8802, op: "CHECKPOINT · 脏页刷盘至此", flushed: true },
  { lsn: 8803, op: "UPDATE account SET balance=8500 WHERE id=7", flushed: true },
  { lsn: 8804, op: "INSERT INTO ledger VALUES(…)", flushed: true },
  { lsn: 8805, op: "COMMIT trx 1045", flushed: true },
  { lsn: 8806, op: "UPDATE stock SET qty=qty-1 WHERE id=91", flushed: false },
];

const CHECKPOINT_LSN = 8802;

const PHASES = [
  { value: "run", label: "运行中" },
  { value: "crash", label: "断电" },
  { value: "recover", label: "重启恢复" },
];

export function DbWalVisual() {
  const [phase, setPhase] = useState("crash");

  const crashed = phase !== "run";
  const recovered = phase === "recover";
  const replayCount = LOG.filter((record) => record.lsn > CHECKPOINT_LSN && record.flushed).length;

  return (
    <VisualFrame
      label="WRITE-AHEAD LOG · Redo 重放"
      control={
        <SegControl ariaLabel="选择阶段" value={phase} onChange={setPhase} options={PHASES} />
      }
      footer={
        <Readout
          items={[
            { k: "checkpoint_lsn", v: CHECKPOINT_LSN },
            { k: "flushed_lsn", v: 8805 },
            { k: "需重放", v: `${replayCount} 条`, tone: "accent" },
            {
              k: "数据结果",
              v: recovered ? "已提交事务全部还原" : crashed ? "内存脏页全部丢失" : "正常服务中",
              tone: recovered ? "success" : crashed ? "danger" : "default",
            },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 内存与磁盘 */}
        <div className="space-y-3 lg:col-span-5">
          <NodeBox
            title="BUFFER POOL · 内存脏页"
            meta={crashed && !recovered ? "LOST" : "3 pages"}
            active
            tone={crashed && !recovered ? "danger" : "accent"}
          >
            <div className="space-y-2">
              {["page #41", "page #77", "page #91"].map((page) => (
                <div key={page} className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="w-16 text-[var(--fg-muted)]">{page}</span>
                  <Bar
                    ratio={crashed && !recovered ? 0 : 1}
                    tone={recovered ? "accent" : "muted"}
                    className="flex-1"
                  />
                  <span
                    className={cn(
                      "w-12 text-right",
                      crashed && !recovered ? "text-[var(--danger)]" : "text-[var(--fg)]",
                    )}
                  >
                    {crashed && !recovered ? "丢失" : recovered ? "重建" : "脏"}
                  </span>
                </div>
              ))}
            </div>
          </NodeBox>

          <NodeBox title="DATA FILE · 磁盘表空间" meta={`最后刷盘 LSN ${CHECKPOINT_LSN}`} active>
            <p className="font-mono text-[10px] leading-relaxed text-[var(--fg-muted)]">
              {recovered
                ? "从 checkpoint 起逐条重放 redo，页内 LSN 追平 8805，数据文件回到崩溃前的已提交状态。"
                : "落后于日志。这是刻意的 —— 顺序写日志远比随机刷页便宜，这就是 WAL 的全部动机。"}
            </p>
          </NodeBox>
        </div>

        {/* 日志 */}
        <div className="space-y-1.5 lg:col-span-7">
          <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)]">
            <span>REDO LOG · 顺序追加</span>
            <span>LSN →</span>
          </div>
          {LOG.map((record) => {
            const isCheckpoint = record.lsn === CHECKPOINT_LSN;
            const willReplay = recovered && record.lsn > CHECKPOINT_LSN && record.flushed;
            const lostTail = crashed && !record.flushed;

            return (
              <div
                key={record.lsn}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-xs)] border px-3 py-2 font-mono text-[10px] transition-all",
                  isCheckpoint
                    ? "border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)]"
                    : willReplay
                      ? "border-[var(--accent)] bg-[var(--accent)]/6 text-[var(--fg)]"
                      : lostTail
                        ? "border-[var(--border)] text-[var(--fg-faint)] line-through opacity-60"
                        : "border-[var(--border)] text-[var(--fg-muted)]",
                )}
              >
                <span className="w-12 shrink-0 tabular font-bold">{record.lsn}</span>
                <span className="min-w-0 flex-1 truncate">{record.op}</span>
                <span className="w-14 shrink-0 text-right">
                  {willReplay ? (
                    <span className="text-[var(--accent)]">REPLAY</span>
                  ) : lostTail ? (
                    "未落盘"
                  ) : record.flushed ? (
                    "已落盘"
                  ) : (
                    "缓冲中"
                  )}
                </span>
              </div>
            );
          })}

          <p className="pt-2 text-[11px] leading-relaxed text-[var(--fg-muted)]">
            事务提交前，redo 记录必须先 fsync 到日志文件（WAL 的字面含义）。所以只要 COMMIT 记录在，
            对应的数据改动就一定能被重放出来；反过来，LSN 8806 这类没落盘的记录代表事务从未提交，
            重启后直接丢弃即可，不违反任何承诺。
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
