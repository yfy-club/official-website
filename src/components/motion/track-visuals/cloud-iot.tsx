"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Bar, Legend, NodeBox, Readout, SegControl, VisualFrame } from "./frame";

/* ══════════════════════════════════════════════════════════════════
   IOT_MQTT_01 · QoS 的三种报文时序
   把 0/1/2 三级并排画成时序图：多出来的每一次握手，换到的是什么保证。
   ══════════════════════════════════════════════════════════════════ */

interface Frame {
  from: "pub" | "broker";
  packet: string;
  note: string;
}

const QOS_FLOWS: Record<string, { frames: Frame[]; guarantee: string; risk: string; cost: string }> = {
  "0": {
    frames: [{ from: "pub", packet: "PUBLISH", note: "发完即忘，不等任何回执" }],
    guarantee: "至多一次",
    risk: "断线即丢，无重传",
    cost: "1 报文",
  },
  "1": {
    frames: [
      { from: "pub", packet: "PUBLISH", note: "带 packet_id，进入待确认队列" },
      { from: "broker", packet: "PUBACK", note: "确认收到，发送端出队" },
    ],
    guarantee: "至少一次",
    risk: "PUBACK 丢失会触发重传 → 下游收到重复消息",
    cost: "2 报文",
  },
  "2": {
    frames: [
      { from: "pub", packet: "PUBLISH", note: "带 packet_id，标记 WAIT_PUBREC" },
      { from: "broker", packet: "PUBREC", note: "已接收并落库 packet_id，去重表登记" },
      { from: "pub", packet: "PUBREL", note: "释放所有权，标记 WAIT_PUBCOMP" },
      { from: "broker", packet: "PUBCOMP", note: "删除去重记录，本次投递闭环" },
    ],
    guarantee: "有且仅有一次",
    risk: "任一环节重传都会被去重表拦下",
    cost: "4 报文",
  },
};

export function IotMqttVisual() {
  const [qos, setQos] = useState("2");
  const flow = QOS_FLOWS[qos];

  return (
    <VisualFrame
      label="MQTT QoS · 报文时序"
      control={
        <SegControl
          ariaLabel="选择 QoS 等级"
          value={qos}
          onChange={setQos}
          options={[
            { value: "0", label: "QoS 0" },
            { value: "1", label: "QoS 1" },
            { value: "2", label: "QoS 2" },
          ]}
        />
      }
      footer={
        <Readout
          items={[
            { k: "投递语义", v: flow.guarantee, tone: qos === "2" ? "success" : qos === "0" ? "danger" : "warn" },
            { k: "报文开销", v: flow.cost },
            { k: "状态机", v: qos === "2" ? "四态持久化" : qos === "1" ? "两态" : "无状态" },
            { k: "适用场景", v: qos === "2" ? "计量与工单" : qos === "1" ? "告警上报" : "高频遥测" },
          ]}
        />
      }
    >
      <div className="space-y-4">
        {/* 时序图 */}
        <div className="grid grid-cols-[80px_1fr_80px] items-center gap-x-3 font-mono text-[10px] sm:grid-cols-[110px_1fr_110px]">
          <span className="text-center font-bold text-[var(--fg)]">PUBLISHER</span>
          <span />
          <span className="text-center font-bold text-[var(--fg)]">BROKER</span>

          {flow.frames.map((frame, index) => (
            <div key={frame.packet} className="contents">
              <span className="h-8" />
              <div className="relative flex h-8 items-center">
                <span className="h-px w-full bg-[var(--border-strong)]" />
                <span
                  className={cn(
                    "absolute inset-x-0 -top-1 text-center font-bold",
                    frame.from === "pub" ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
                  )}
                >
                  {frame.from === "pub" ? "──▶" : "◀──"} {frame.packet}
                </span>
                <span className="absolute inset-x-0 top-4 text-center text-[9px] text-[var(--fg-faint)]">
                  {frame.note}
                </span>
              </div>
              <span className="h-8 text-center text-[9px] text-[var(--fg-faint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
          <NodeBox title="这一级保证了什么" active>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">{flow.guarantee}。{flow.risk}</p>
          </NodeBox>
          <NodeBox title="弱网下的代价" active tone="warn">
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              {qos === "2"
                ? "四次握手意味着一条消息要熬过四个 RTT。工业现场普遍只在计费、工单这类不可重复的消息上开 QoS 2，遥测流仍走 QoS 0。"
                : qos === "1"
                  ? "重传是幂等性的责任转移：Broker 保证送达，但去重要下游自己按业务主键做。"
                  : "没有任何重传机制。适合 100 Hz 的温度采样 —— 丢一个点，下一个点 10 ms 后就到了。"}
            </p>
          </NodeBox>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   IOT_EDGE_02 · 边缘滤波与降采样
   同一段带尖刺的原始波形，把窗口拉大，看噪声怎么被削掉、
   上行带宽怎么塌下来 —— 以及丢掉了什么。
   ══════════════════════════════════════════════════════════════════ */

/** 确定性原始信号：基线正弦 + 高频噪声 + 两处真实突变 */
const RAW_SIGNAL = Array.from({ length: 96 }, (_, i) => {
  const base = 50 + Math.sin(i / 7) * 12;
  const noise = Math.sin(i * 12.9898) * 4.5;
  const spike = i === 38 ? 34 : i === 39 ? 28 : i === 70 ? -22 : 0;
  return Number((base + noise + spike).toFixed(2));
});

function movingAverage(data: number[], window: number) {
  if (window <= 1) return data;
  return data.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = data.slice(start, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  });
}

function toPath(data: number[], width: number, height: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / span) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function IotEdgeVisual() {
  const [window, setWindow] = useState(8);

  const filtered = useMemo(() => movingAverage(RAW_SIGNAL, window), [window]);
  const uplinkPoints = Math.ceil(RAW_SIGNAL.length / Math.max(1, window));
  const rawBytes = RAW_SIGNAL.length * 48;
  const sentBytes = uplinkPoints * 14;
  const saved = (1 - sentBytes / rawBytes) * 100;

  return (
    <VisualFrame
      label="EDGE FILTER · 滑动窗口 + 降采样"
      control={
        <div className="flex items-center gap-2.5">
          <label htmlFor="edge-window" className="font-mono text-[10px] text-[var(--fg-faint)]">
            WINDOW {window}
          </label>
          <input
            id="edge-window"
            type="range"
            min={1}
            max={16}
            step={1}
            value={window}
            onChange={(event) => setWindow(Number(event.target.value))}
            className="w-28 cursor-pointer accent-[var(--accent)]"
          />
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Readout
            items={[
              { k: "采样率", v: "100 Hz" },
              { k: "上行点数", v: `${uplinkPoints} / ${RAW_SIGNAL.length}` },
              { k: "带宽节省", v: `${saved.toFixed(1)}%`, tone: "accent" },
              { k: "本地时延", v: `${(window * 10).toFixed(0)} ms`, tone: window > 12 ? "warn" : "success" },
            ]}
          />
          <Legend
            items={[
              { swatch: "bg-[var(--border-strong)]", label: "原始采样" },
              { swatch: "bg-[var(--accent)]", label: "滤波后上行" },
            ]}
          />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/50 p-3">
          <svg viewBox="0 0 640 140" className="h-auto w-full" role="img" aria-label="原始波形与滤波后波形对比">
            <path d={toPath(RAW_SIGNAL, 640, 140)} fill="none" stroke="var(--border-strong)" strokeWidth="1.2" />
            <path
              d={toPath(filtered, 640, 140)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NodeBox title="削掉的是噪声" active>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              传感器自噪声在窗口内均值收敛，窗口每翻一倍，噪声幅度约降到 1/√2。
            </p>
          </NodeBox>
          <NodeBox title="省下的是带宽与电费" active>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              4G 模组的功耗大头是射频发射。上行点数降到 {uplinkPoints}，电池寿命是按倍数延长的。
            </p>
          </NodeBox>
          <NodeBox title="丢掉的是瞬态" active tone="warn">
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
              {window >= 10
                ? "窗口拉到 10 以上，第 38 帧那个真实突变已被抹平 —— 这正是滤波必须和阈值告警分开跑的原因。"
                : "当前窗口仍保留了突变尖峰。工程做法是：滤波结果上行，原始极值本地留存并单独触发告警。"}
            </p>
          </NodeBox>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   IOT_TSDB_03 · 时序库为什么写得快
   同一批 5 万点写入，行存与列存 LSM 并排跑：差别在 I/O 形态，不在 CPU。
   ══════════════════════════════════════════════════════════════════ */

const ENGINES: Record<
  string,
  {
    label: string;
    write: string;
    io: string;
    compression: string;
    stages: { name: string; detail: string; tone?: "warn" }[];
  }
> = {
  rdbms: {
    label: "行存 B+ 树",
    write: "1,800 点/秒",
    io: "随机写",
    compression: "1.4×",
    stages: [
      { name: "定位页", detail: "按主键查 B+ 树，随机读若干页" },
      { name: "页内插入", detail: "页满则分裂，触发页面重排", tone: "warn" },
      { name: "刷脏页", detail: "随机写回磁盘，机械盘上是致命瓶颈", tone: "warn" },
      { name: "维护二级索引", detail: "每个索引都要再走一遍上述流程", tone: "warn" },
    ],
  },
  tsdb: {
    label: "列存 LSM",
    write: "240,000 点/秒",
    io: "顺序追加",
    compression: "18.6×",
    stages: [
      { name: "追加 WAL", detail: "纯顺序写，一次 fsync 覆盖整批" },
      { name: "写内存表", detail: "按 series 分桶，时间戳天然有序" },
      { name: "落盘 TSM", detail: "内存表满则整块顺序落盘，永不原地更新" },
      { name: "后台压缩", detail: "时间戳做 delta-of-delta，数值做 Gorilla 异或编码" },
    ],
  },
};

export function IotTsdbVisual() {
  const [engine, setEngine] = useState("tsdb");
  const spec = ENGINES[engine];
  const isTsdb = engine === "tsdb";

  return (
    <VisualFrame
      label="WRITE PATH · 5 万点批量写入"
      control={
        <SegControl
          ariaLabel="选择存储引擎"
          value={engine}
          onChange={setEngine}
          options={Object.entries(ENGINES).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      }
      footer={
        <Readout
          items={[
            { k: "写入吞吐", v: spec.write, tone: isTsdb ? "success" : "danger" },
            { k: "I/O 形态", v: spec.io, tone: isTsdb ? "success" : "warn" },
            { k: "压缩比", v: spec.compression, tone: "accent" },
            { k: "更新代价", v: isTsdb ? "不支持原地更新（时序数据也不需要）" : "支持，但代价高" },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ol className="space-y-2 lg:col-span-7">
          {spec.stages.map((stage, index) => (
            <li key={stage.name} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[9px] font-bold",
                  stage.tone === "warn"
                    ? "border-[var(--warn)] text-[var(--warn)]"
                    : "border-[var(--accent)] text-[var(--accent)]",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[11px] font-bold text-[var(--fg)]">{stage.name}</div>
                <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">{stage.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="space-y-3 lg:col-span-5">
          <div className="space-y-2 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
            <span className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">
              THROUGHPUT · 对数刻度
            </span>
            {Object.entries(ENGINES).map(([key, meta]) => {
              const value = Number(meta.write.replace(/[^\d]/g, ""));
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className={key === engine ? "font-bold text-[var(--fg)]" : "text-[var(--fg-muted)]"}>
                      {meta.label}
                    </span>
                    <span className="tabular text-[var(--fg)]">{meta.write}</span>
                  </div>
                  <Bar
                    ratio={Math.log10(value) / Math.log10(240000)}
                    tone={key === engine ? "accent" : "muted"}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            百倍差距不来自代码优化，来自对数据形态的假设：时序数据只追加、几乎不改、总是按时间范围查。
            放弃「原地更新」这一条，就能把所有随机 I/O 换成顺序 I/O，并让同一列的相邻数值差极小，
            压缩比顺带涨一个数量级。
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
