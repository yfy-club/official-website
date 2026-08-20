"use client";

import { useId, useState } from "react";
import {
  Activity,
  AlertOctagon,
  Cpu,
  Database,
  Layers,
  Network,
  Radio,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ==========================================
// 1. AI: 全连接神经网络 & Transformer 自注意力拓扑
// ==========================================

interface Neuron {
  id: string;
  layer: number;
  index: number;
  label: string;
  bias: number;
  activation: number;
  cx: number;
  cy: number;
}

interface Synapse {
  id: string;
  source: Neuron;
  target: Neuron;
  weight: number;
}

export function TrackNeuralNetworkVisualizer() {
  const [activeTab, setActiveTab] = useState<"mlp" | "attention">("mlp");
  const [hoveredNeuron, setHoveredNeuron] = useState<Neuron | null>(null);
  const [selectedWord, setSelectedWord] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const gradientId = useId();

  // MLP Layer Configuration
  const layerCounts = [3, 4, 4, 2];
  const layerLabels = ["INPUT (X)", "HIDDEN 1 (H₁)", "HIDDEN 2 (H₂)", "OUTPUT (Ŷ)"];
  const width = 640;
  const height = 300;

  const neurons: Neuron[] = [];
  const synapses: Synapse[] = [];

  layerCounts.forEach((count, lIdx) => {
    const x = 70 + lIdx * ((width - 140) / (layerCounts.length - 1));
    const step = height / (count + 1);
    for (let i = 0; i < count; i++) {
      const y = step * (i + 1);
      const neuron: Neuron = {
        id: `n-${lIdx}-${i}`,
        layer: lIdx,
        index: i,
        label: lIdx === 0 ? `x_${i + 1}` : lIdx === layerCounts.length - 1 ? `ŷ_${i + 1}` : `h_${lIdx}${i + 1}`,
        bias: Number((Math.sin(lIdx * 3 + i) * 0.4).toFixed(2)),
        activation: Number((0.2 + (Math.cos(lIdx + i) + 1) * 0.38).toFixed(2)),
        cx: x,
        cy: y,
      };
      neurons.push(neuron);
    }
  });

  for (let l = 0; l < layerCounts.length - 1; l++) {
    const currentLayer = neurons.filter((n) => n.layer === l);
    const nextLayer = neurons.filter((n) => n.layer === l + 1);
    currentLayer.forEach((src) => {
      nextLayer.forEach((dst) => {
        const weight = Number((Math.sin(src.index * 5 + dst.index * 7 + l) * 0.95).toFixed(2));
        synapses.push({
          id: `s-${src.id}-${dst.id}`,
          source: src,
          target: dst,
          weight,
        });
      });
    });
  }

  // Transformer Attention Matrix Mock
  const tokens = ["工业", "表面", "微米级", "缺陷", "智能", "识别"];
  const attentionMatrix = [
    [0.45, 0.28, 0.12, 0.08, 0.04, 0.03],
    [0.15, 0.52, 0.18, 0.10, 0.03, 0.02],
    [0.08, 0.12, 0.61, 0.14, 0.03, 0.02],
    [0.05, 0.18, 0.22, 0.48, 0.04, 0.03],
    [0.11, 0.08, 0.06, 0.09, 0.42, 0.24],
    [0.04, 0.06, 0.08, 0.32, 0.18, 0.32],
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* 顶部模式切换开关 */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Cpu size={12} className="text-[var(--accent)]" />
            <span>AI NEURAL ENGINE</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// TENSOR FORWARD & ATTENTION SPACE"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--radius-xs)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveTab("mlp")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer active:scale-[0.96]",
              activeTab === "mlp"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            全连接前传 (MLP)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attention")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer active:scale-[0.96]",
              activeTab === "attention"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            自注意力空间 (Attention)
          </button>
        </div>
      </div>

      {activeTab === "mlp" ? (
        <div className="relative w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 overflow-hidden">
          {/* 背景微网格 */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          {/* SVG 拓扑图 */}
          <div className="relative w-full overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full min-w-[540px] h-auto max-h-[320px] select-none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* 突触连线 */}
              {synapses.map((synapse) => {
                const isHighlighted =
                  hoveredNeuron &&
                  (hoveredNeuron.id === synapse.source.id || hoveredNeuron.id === synapse.target.id);
                const isDimmed = hoveredNeuron && !isHighlighted;
                const strokeWidth = Math.max(0.6, Math.abs(synapse.weight) * 1.8);
                const isPositive = synapse.weight > 0;

                return (
                  <g key={synapse.id}>
                    <line
                      x1={synapse.source.cx}
                      y1={synapse.source.cy}
                      x2={synapse.target.cx}
                      y2={synapse.target.cy}
                      stroke={
                        isHighlighted
                          ? "var(--accent)"
                          : isPositive
                          ? "var(--border-strong)"
                          : "var(--border)"
                      }
                      strokeWidth={isHighlighted ? strokeWidth + 1.2 : strokeWidth}
                      strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 0.95 : 0.45}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* 动态信号流脉冲 (Feedforward Pulses) */}
              {synapses.slice(0, 8).map((synapse, i) => (
                <circle
                  key={`pulse-${synapse.id}`}
                  r={2.2}
                  fill="var(--accent)"
                  className="motion-reduce:hidden"
                >
                  <animateMotion
                    path={`M ${synapse.source.cx} ${synapse.source.cy} L ${synapse.target.cx} ${synapse.target.cy}`}
                    dur={`${2.2 + (i % 4) * 0.4}s`}
                    repeatCount="indefinite"
                    begin={`${(i * 0.35).toFixed(2)}s`}
                  />
                </circle>
              ))}

              {/* 层标题指示 */}
              {layerLabels.map((lbl, idx) => {
                const x = 70 + idx * ((width - 140) / (layerCounts.length - 1));
                return (
                  <text
                    key={lbl}
                    x={x}
                    y={20}
                    textAnchor="middle"
                    fill="var(--fg-muted)"
                    className="font-mono text-[10px] font-semibold tracking-wider"
                  >
                    {lbl}
                  </text>
                );
              })}

              {/* 神经元节点 */}
              {neurons.map((neuron) => {
                const isHovered = hoveredNeuron?.id === neuron.id;
                const isConnected =
                  hoveredNeuron &&
                  (hoveredNeuron.layer === neuron.layer - 1 ||
                    hoveredNeuron.layer === neuron.layer + 1);

                return (
                  <g
                    key={neuron.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNeuron(neuron)}
                    onMouseLeave={() => setHoveredNeuron(null)}
                  >
                    {/* 节点外光晕 */}
                    {isHovered && (
                      <circle
                        cx={neuron.cx}
                        cy={neuron.cy}
                        r={18}
                        fill="var(--accent)"
                        fillOpacity={0.2}
                        className="animate-pulse"
                      />
                    )}
                    {/* 节点本体 */}
                    <circle
                      cx={neuron.cx}
                      cy={neuron.cy}
                      r={12}
                      fill={isHovered ? "var(--accent)" : "var(--surface)"}
                      stroke={
                        isHovered || isConnected ? "var(--accent)" : "var(--border-strong)"
                      }
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-200"
                    />
                    {/* 节点文字 */}
                    <text
                      cx={neuron.cx}
                      cy={neuron.cy}
                      x={neuron.cx}
                      y={neuron.cy + 3.5}
                      textAnchor="middle"
                      fill={isHovered ? "var(--surface)" : "var(--fg)"}
                      className="font-mono text-[9px] font-bold pointer-events-none"
                    >
                      {neuron.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 实时张量参数监视器 (去说教，纯工程仪表) */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)] font-bold">TENSOR STREAM //</span>
              {hoveredNeuron ? (
                <span className="text-[var(--fg)] font-bold">
                  NODE [{hoveredNeuron.label}] · ACTIVATION: {hoveredNeuron.activation} · BIAS: {hoveredNeuron.bias}
                </span>
              ) : (
                <span className="text-[var(--fg-muted)]">
                  3 LAYERS · 8 SYNAPSE PULSES · ACTIVATION: GELU · LOSS: 0.042
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--fg-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] inline-block" />
                <span>WEIGHT &gt; 0</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)] inline-block" />
                <span>INHIBIT &lt; 0</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Transformer Attention Heatmap View */
        <div className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 左侧注意力热力图 */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="text-[var(--fg-muted)]">
                  ATTENTION MAP // Q × Kᵀ / √dₖ
                </span>
                <span className="text-[11px] text-[var(--accent)] font-bold">
                  SOFTMAX NORMALIZED
                </span>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-[320px]">
                  {/* 顶端 Key 标签 */}
                  <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center font-mono text-xs text-[var(--fg-muted)]">
                    <div className="text-[10px] text-[var(--fg-faint)]">Q \ K</div>
                    {tokens.map((tok, cIdx) => (
                      <div
                        key={`col-${tok}`}
                        className={cn(
                          "font-semibold transition-colors",
                          hoveredCell?.c === cIdx ? "text-[var(--accent)] font-bold" : ""
                        )}
                      >
                        {tok}
                      </div>
                    ))}
                  </div>
                  {/* 热力行 */}
                  {tokens.map((rowTok, rIdx) => (
                    <div key={`row-${rowTok}`} className="grid grid-cols-7 gap-1.5 mb-1.5 items-center">
                      <div
                        className={cn(
                          "font-mono text-xs text-right pr-2 font-semibold transition-colors",
                          hoveredCell?.r === rIdx || selectedWord === rIdx ? "text-[var(--accent)] font-bold" : "text-[var(--fg-muted)]"
                        )}
                      >
                        {rowTok}
                      </div>
                      {attentionMatrix[rIdx].map((val, cIdx) => {
                        const isSelected = selectedWord === rIdx;
                        const isCrosshair = hoveredCell?.r === rIdx || hoveredCell?.c === cIdx;
                        const opacity = Math.max(0.12, val);
                        return (
                          <button
                            key={`cell-${rIdx}-${cIdx}`}
                            type="button"
                            onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => setSelectedWord(rIdx)}
                            className={cn(
                              "h-8 sm:h-9 rounded-[var(--radius-xs)] font-mono text-[10px] sm:text-xs flex items-center justify-center transition-all cursor-pointer border active:scale-[0.94]",
                              isSelected
                                ? "border-[var(--accent)] text-[var(--fg)] font-bold shadow-xs"
                                : isCrosshair
                                ? "border-[var(--border-strong)] text-[var(--fg)]"
                                : "border-transparent text-[var(--fg-muted)]",
                            )}
                            style={{
                              backgroundColor: `color-mix(in srgb, var(--accent) ${Math.round(opacity * 100)}%, var(--surface-2))`,
                            }}
                          >
                            {(val * 100).toFixed(0)}%
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧选定 Query 关联度解析 */}
            <div className="md:col-span-5 p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span className="font-mono text-xs font-bold text-[var(--fg)]">
                  QUERY TOKEN: 「{tokens[selectedWord]}」
                </span>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                自注意力机制动态捕获全句关键语义权重，实现全局无损上下文关联。
              </p>
              <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                {tokens.map((tok, i) => (
                  <div key={`bar-${tok}`} className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="w-12 text-[var(--fg-muted)] truncate">{tok}</span>
                    <div className="flex-1 h-2 rounded-full bg-[var(--surface)] overflow-hidden border border-[var(--border)]">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-300"
                        style={{ width: `${attentionMatrix[selectedWord][i] * 100}%` }}
                      />
                    </div>
                    <span className="w-9 text-right tabular text-[var(--fg)] font-bold">
                      {(attentionMatrix[selectedWord][i] * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Software: 微服务分布式链路追踪与事件流
// ==========================================

export function TrackServiceTraceVisualizer() {
  const [selectedSpan, setSelectedSpan] = useState<number>(0);
  const [isChaos, setIsChaos] = useState<boolean>(false);

  const defaultSpans = [
    { id: "span-gw", name: "API Gateway", latency: 2.1, status: "200 OK", protocol: "HTTP/2", detail: "路由匹配与 JWT 权限鉴权完成" },
    { id: "span-auth", name: "Auth & RateLimiter", latency: 1.4, status: "PASSED", protocol: "gRPC", detail: "令牌桶限流校验通过，用户鉴权成功" },
    { id: "span-core", name: "Core Business Service", latency: 4.8, status: "PROCESSED", protocol: "RPC", detail: "执行核心业务逻辑与数据组装" },
    { id: "span-cache", name: "Redis L2 Cache", latency: 0.8, status: "HIT", protocol: "TCP", detail: "SingleFlight 命中缓存，避免穿透" },
    { id: "span-mq", name: "Kafka Event Bus", latency: 1.9, status: "PRODUCED", protocol: "Kafka", detail: "异步发布 OrderCreated 领域事件" },
    { id: "span-db", name: "Sharded DB (Cluster)", latency: 3.2, status: "COMMITTED", protocol: "MySQL", detail: "一致性哈希路由落盘完成" },
  ];

  const chaosSpans = [
    { id: "span-gw", name: "API Gateway", latency: 156.7, status: "504 TIMEOUT", protocol: "HTTP/2", detail: "下游依赖严重超时，触发熔断降级策略" },
    { id: "span-auth", name: "Auth & RateLimiter", latency: 1.4, status: "PASSED", protocol: "gRPC", detail: "令牌桶限流校验通过" },
    { id: "span-core", name: "Core Business Service", latency: 154.2, status: "DEGRADED", protocol: "RPC", detail: "等待 DB 连接池资源耗尽，线程池阻塞" },
    { id: "span-cache", name: "Redis L2 Cache", latency: 12.5, status: "MISS / RETRY", protocol: "TCP", detail: "热点 Key 过期引发缓存击穿" },
    { id: "span-mq", name: "Kafka Event Bus", latency: 1.9, status: "PRODUCED", protocol: "Kafka", detail: "异步领域事件排队中" },
    { id: "span-db", name: "Sharded DB (Cluster)", latency: 142.0, status: "SLOW QUERY", protocol: "MySQL", detail: "瞬时千万级并发未命中索引，执行全表扫描" },
  ];

  const spans = isChaos ? chaosSpans : defaultSpans;

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant={isChaos ? "warning" : "active"} className="font-mono text-[11px] gap-1">
            <Network size={12} className={isChaos ? "text-[var(--warn)]" : "text-[var(--accent)]"} />
            <span>DISTRIBUTED TRACE INSPECTOR</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// OPENTELEMETRY TRACE CONTEXT"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 混沌工程故障注入开关 */}
          <button
            type="button"
            onClick={() => setIsChaos(!isChaos)}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] border transition-all cursor-pointer active:scale-[0.96] flex items-center gap-1.5",
              isChaos
                ? "bg-[var(--warn)]/20 border-[var(--warn)] text-[var(--warn)] font-bold"
                : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
            )}
          >
            <AlertOctagon size={13} className={isChaos ? "animate-pulse" : ""} />
            <span>{isChaos ? "CHAOS: LATENCY_SPIKE (ON)" : "CHAOS: OFF"}</span>
          </button>

          <span className={cn(
            "font-mono text-xs font-bold",
            isChaos ? "text-[var(--warn)]" : "text-[var(--accent)]"
          )}>
            p99: {isChaos ? "156.7ms" : "14.2ms"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {/* 左侧拓扑瀑布流 */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--fg-muted)] pb-1">
            <span>SERVICE SPAN</span>
            <span>LATENCY WATERFALL</span>
          </div>

          {spans.map((span, idx) => {
            const isSelected = selectedSpan === idx;
            const maxLatency = isChaos ? 160 : 6.0;
            return (
              <button
                key={span.id}
                type="button"
                onClick={() => setSelectedSpan(idx)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-[var(--radius-xs)] border transition-all text-left cursor-pointer active:scale-[0.98]",
                  isSelected
                    ? isChaos
                      ? "border-[var(--warn)] bg-[var(--warn)]/10 shadow-xs"
                      : "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[10px] text-[var(--accent)]">{`0${idx + 1}`}</span>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[var(--fg)] truncate">
                      {span.name}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--fg-muted)]">
                      {`${span.protocol} // ${span.status}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 sm:w-36 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden border border-[var(--border)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        span.latency > 50 ? "bg-red-500" : span.latency > 10 ? "bg-amber-500" : "bg-[var(--accent)]"
                      )}
                      style={{ width: `${Math.min(100, (span.latency / maxLatency) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--fg)] w-14 text-right tabular">
                    {span.latency}ms
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 右侧 Span 详情报文解析 */}
        <div className="lg:col-span-5 p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">
              SPAN // {spans[selectedSpan].name}
            </span>
            <Badge variant={spans[selectedSpan].status.includes("504") || spans[selectedSpan].status.includes("SLOW") ? "warning" : "active"} className="text-[10px]">
              {spans[selectedSpan].status}
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
              <span className="text-[var(--fg-muted)]">Protocol:</span>
              <span className="font-bold text-[var(--fg)]">{spans[selectedSpan].protocol}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
              <span className="text-[var(--fg-muted)]">Span Duration:</span>
              <span className={cn("font-bold", spans[selectedSpan].latency > 50 ? "text-red-400" : "text-[var(--accent)]")}>
                {spans[selectedSpan].latency} ms
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
              <span className="text-[var(--fg-muted)]">W3C Header:</span>
              <span className="text-[var(--fg)] font-mono text-[10px] truncate max-w-[170px]">
                00-4bf92f3577b3-00f067-01
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--fg-muted)] leading-relaxed">
            <p className="font-semibold text-[var(--fg)] mb-1">执行状态：</p>
            {spans[selectedSpan].detail}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Database: 3层 B+ 树索引寻址与 MVCC 版本链
// ==========================================

export function TrackBTreeVisualizer() {
  const [selectedKey, setSelectedKey] = useState<number>(42);
  const [viewMode, setViewMode] = useState<"btree" | "mvcc">("btree");

  const searchKeys = [15, 28, 42, 68, 85];

  // B+ Tree Search Path Resolver
  const getBTreePath = (k: number) => {
    if (k < 50) {
      if (k < 30) return { root: "50", internal: "20 | 30", leaf: "[15, 20, 28]", searchSteps: "Root(50) → Page#102 [20, 30] → Leaf#201 [15, 20*, 28]" };
      return { root: "50", internal: "20 | 30", leaf: "[35, 42, 48]", searchSteps: "Root(50) → Page#102 [20, 30] → Leaf#202 [35, 42*, 48]" };
    }
    if (k < 80) return { root: "50", internal: "70 | 85", leaf: "[60, 68, 70]", searchSteps: "Root(50) → Page#103 [70, 85] → Leaf#203 [60, 68*, 70]" };
    return { root: "50", internal: "70 | 85", leaf: "[85, 92, 99]", searchSteps: "Root(50) → Page#103 [70, 85] → Leaf#204 [85*, 92, 99]" };
  };

  const currentPath = getBTreePath(selectedKey);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Database size={12} className="text-[var(--accent)]" />
            <span>STORAGE KERNEL EXPLORER</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// B+ TREE PAGE INDEX & MVCC READVIEW"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--radius-xs)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setViewMode("btree")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer active:scale-[0.96]",
              viewMode === "btree"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            B+ 树索引
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mvcc")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer active:scale-[0.96]",
              viewMode === "mvcc"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            MVCC 版本链
          </button>
        </div>
      </div>

      {viewMode === "btree" ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 space-y-6">
          {/* 查找键选择栏 */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-[var(--accent)] font-bold">KEY // TARGET_SELECT</span>
            <div className="flex items-center gap-2">
              {searchKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={cn(
                    "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer border active:scale-[0.94]",
                    selectedKey === k
                      ? "bg-[var(--accent)] text-[var(--surface)] font-bold border-[var(--accent)] shadow-xs"
                      : "bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--border-strong)]",
                  )}
                >
                  Key = {k}
                </button>
              ))}
            </div>
          </div>

          {/* 3 层 B+ 树拓扑结构 */}
          <div className="space-y-4 pt-2">
            {/* Level 0: Root */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[var(--fg-muted)] mb-1">
                {"LEVEL 0 // ROOT PAGE (16KB)"}
              </span>
              <div className="p-3 px-8 rounded border-2 border-[var(--accent)] bg-[var(--surface-2)] font-mono text-sm font-bold text-[var(--fg)] shadow-xs">
                [ Key &lt; 50 | Key ≥ 50 ]
              </div>
            </div>

            {/* Level 1: Internal Nodes */}
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
              <div
                className={cn(
                  "p-3 rounded border font-mono text-xs text-center transition-all",
                  selectedKey < 50
                    ? "border-[var(--accent)] bg-[var(--surface-2)] font-bold text-[var(--fg)]"
                    : "border-[var(--border)] bg-[var(--surface)] opacity-50 text-[var(--fg-muted)]",
                )}
              >
                <div className="text-[10px] text-[var(--fg-muted)] mb-1">PAGE #102</div>
                [ 20 | 30 | 50 ]
              </div>
              <div
                className={cn(
                  "p-3 rounded border font-mono text-xs text-center transition-all",
                  selectedKey >= 50
                    ? "border-[var(--accent)] bg-[var(--surface-2)] font-bold text-[var(--fg)]"
                    : "border-[var(--border)] bg-[var(--surface)] opacity-50 text-[var(--fg-muted)]",
                )}
              >
                <div className="text-[10px] text-[var(--fg-muted)] mb-1">PAGE #103</div>
                [ 60 | 70 | 85 ]
              </div>
            </div>

            {/* Level 2: Leaf Nodes & Doubly Linked List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-dashed border-[var(--border)]">
              {[
                { name: "Leaf Page #201", keys: "[15, 20, 28]" },
                { name: "Leaf Page #202", keys: "[35, 42, 48]" },
                { name: "Leaf Page #203", keys: "[60, 68, 70]" },
                { name: "Leaf Page #204", keys: "[85, 92, 99]" },
              ].map((leaf) => {
                const isTarget = currentPath.leaf === leaf.keys;
                return (
                  <div
                    key={leaf.name}
                    className={cn(
                      "p-3 rounded border font-mono text-xs transition-all",
                      isTarget
                        ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] opacity-50 text-[var(--fg-muted)]",
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[var(--fg-faint)] mb-1">
                      <span>{leaf.name}</span>
                      <span className="text-[var(--accent)] font-bold">{isTarget ? "HIT" : ""}</span>
                    </div>
                    <div className="font-bold text-[var(--fg)]">{leaf.keys}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--fg-muted)] flex items-center justify-between flex-wrap gap-2">
            <span>
              BINARY SEARCH // {currentPath.searchSteps}
            </span>
            <span className="text-[var(--accent)] font-bold">
              DISK I/O COUNTER: 3 (ZERO FULL-SCAN)
            </span>
          </div>
        </div>
      ) : (
        /* MVCC Version Chain View */
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[var(--border)]">
            <span className="text-[var(--accent)] font-bold">READ_VIEW // [m_ids: 1032, 1045 · min_trx: 1032 · max_trx: 1046]</span>
            <span className="text-[var(--fg-muted)]">SNAPSHOT ISOLATION</span>
          </div>

          <div className="space-y-3">
            {[
              { trxId: 1045, rollPtr: "0x7f88a", status: "当前版本 (已提交)", balance: "¥ 8,500.00", visible: "当前事务可见" },
              { trxId: 1032, rollPtr: "0x7f880", status: "Undo Log 历史版本 1", balance: "¥ 6,200.00", visible: "历史快照读" },
              { trxId: 1010, rollPtr: "NULL", status: "基线版本", balance: "¥ 3,000.00", visible: "基线可见" },
            ].map((ver, i) => (
              <div
                key={ver.trxId}
                className="p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between flex-wrap gap-3 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--fg)]">{`TRX_ID: ${ver.trxId}`}</span>
                    <span className="text-[10px] text-[var(--accent)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                      {ver.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--fg-muted)]">
                    {`ROLL_PTR: ${ver.rollPtr} // 数据字段: ${ver.balance}`}
                  </div>
                </div>
                <Badge variant={i === 0 ? "active" : "outline"} className="text-[10px]">
                  {ver.visible}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. Cloud-IoT: 端边云架构与 MQTT 消息流
// ==========================================

export function TrackIotPipelineVisualizer() {
  const [qosLevel, setQosLevel] = useState<0 | 1 | 2>(2);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Radio size={12} className="text-[var(--accent)]" />
            <span>MQTT EDGE-CLOUD BUS</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// 100Hz TELEMETRY OSCILLOSCOPE"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-[var(--fg-muted)]">QoS:</span>
          {([0, 1, 2] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQosLevel(q)}
              className={cn(
                "px-2.5 py-0.5 text-xs font-mono rounded-[var(--radius-xs)] border cursor-pointer active:scale-[0.94]",
                qosLevel === q
                  ? "bg-[var(--accent)] text-[var(--surface)] font-bold border-[var(--accent)]"
                  : "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border)]",
              )}
            >
              QoS {q}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {/* Tier 1: 终端传感器 */}
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">{"01 // MCU 采集终端"}</span>
            <Activity size={14} className="text-[var(--accent)]" />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            STM32 / ESP32 FreeRTOS 实时采集温湿度、电压与光照度。
          </p>

          {/* 模拟 100Hz 实时遥测波形 */}
          <div className="p-2 rounded bg-[var(--surface)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--fg-faint)]">
              <span>RAW WAVEFORM (100Hz)</span>
              <span className="text-emerald-400 animate-pulse">● LIVE</span>
            </div>
            <svg viewBox="0 0 100 20" className="w-full h-6 stroke-[var(--accent)] fill-none stroke-[1.5]">
              <path d="M 0 10 Q 12 0, 25 10 T 50 10 T 75 10 T 100 10" />
            </svg>
            <div className="text-[10px] font-mono text-[var(--fg-muted)]">
              MODBUS-RTU / I2C SAMPLING
            </div>
          </div>
        </div>

        {/* Tier 2: 边缘计算网关 */}
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">{"02 // 边缘过滤网关"}</span>
            <Zap size={14} className="text-[var(--accent)]" />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            EdgeX 规则引擎执行滑动窗口均值滤波与 Protobuf 紧凑压缩。
          </p>
          <div className="p-2 rounded bg-[var(--surface)] font-mono text-[11px] text-[var(--fg)] space-y-1">
            <div className="text-[var(--accent)] font-bold">压缩比: 72% (PROTOBUF)</div>
            <div>上行时延: &lt; 5ms (EDGE)</div>
          </div>
        </div>

        {/* Tier 3: 云端物联中枢 */}
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">{"03 // EMQX + InfluxDB"}</span>
            <Database size={14} className="text-[var(--accent)]" />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            分布式 MQTT Broker 承载千万连接，时序数据连续查询与数字孪生大屏。
          </p>
          <div className="p-2 rounded bg-[var(--surface)] font-mono text-[11px] text-[var(--accent)] space-y-1">
            <div>写入吞吐: 50k points/s</div>
            <div>保留策略: 30d 降采样</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. Industrial: 工业手眼标定与数字孪生
// ==========================================

export function TrackIndustrialTwinVisualizer() {
  const [calibAngle, setCalibAngle] = useState<number>(35);

  const rad = (calibAngle * Math.PI) / 180;
  const cosVal = Math.cos(rad).toFixed(4);
  const sinVal = Math.sin(rad).toFixed(4);
  const negSinVal = (-Math.sin(rad)).toFixed(4);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Layers size={12} className="text-[var(--accent)]" />
            <span>HAND-EYE CALIBRATION & TWIN</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// AX = XB RIGID BODY MATRIX & DEFECT INSPECTION"}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--accent)] font-bold">
          CALIB PRECISION: ±0.03mm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {/* 左侧 3D 刚体旋转变换仪表 */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--accent)] font-bold">AXIS // JOINT_ROTATION_θ:</span>
            <span className="font-bold text-[var(--fg)]">{calibAngle}°</span>
          </div>
          <input
            type="range"
            aria-label="机械臂末端旋转偏角"
            min="0"
            max="90"
            value={calibAngle}
            onChange={(e) => setCalibAngle(Number(e.target.value))}
            className="w-full accent-[var(--accent)] cursor-pointer"
          />

          <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs space-y-2">
            <div className="text-[10px] text-[var(--accent)] font-bold">HOMOGENEOUS MATRIX T_cam2gripper:</div>
            <div className="text-[var(--fg)] leading-relaxed">
              [ <span className="text-[var(--accent)] font-bold">{cosVal}</span>  <span className="text-[var(--accent)] font-bold">{negSinVal}</span>   0   142.5 ]<br />
              [ <span className="text-[var(--accent)] font-bold">{sinVal}</span>   <span className="text-[var(--accent)] font-bold">{cosVal}</span>   0   -56.2 ]<br />
              [      0              0          1   310.8 ]<br />
              [      0              0          0     1   ]
            </div>
          </div>
        </div>

        {/* 右侧机器视觉瑕疵识别演示 */}
        <div className="md:col-span-6 p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">
              SUB-PIXEL DEFECT DETECTION
            </span>
            <Badge variant="active" className="text-[10px]">
              OPC-UA LIVE
            </Badge>
          </div>
          <div className="relative aspect-video rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            {/* 相机瞄准十字线 */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-[var(--accent)]" />
              <div className="h-full w-[1px] bg-[var(--accent)] absolute" />
            </div>

            {/* 模拟瑕疵定位框 */}
            <div
              className="relative p-3 border-2 border-red-500 rounded font-mono text-[10px] text-red-400 bg-red-500/10 transition-transform duration-100"
              style={{ transform: `rotate(${calibAngle * 0.3}deg)` }}
            >
              <div>DEFECT #01: 表面微裂纹</div>
              <div>Conf: 99.4% // 尺寸: 0.12mm</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)] pt-1">
            <span>产线节拍: 120 PPM</span>
            <span className="text-[var(--accent)] font-bold">PLC SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 统一分发器组件
// ==========================================

export function TrackArchitectureVisualizer({ slug }: { slug: string }) {
  switch (slug) {
    case "ai":
      return <TrackNeuralNetworkVisualizer />;
    case "software":
      return <TrackServiceTraceVisualizer />;
    case "database":
      return <TrackBTreeVisualizer />;
    case "cloud-iot":
      return <TrackIotPipelineVisualizer />;
    case "industrial":
      return <TrackIndustrialTwinVisualizer />;
    default:
      return <TrackNeuralNetworkVisualizer />;
  }
}
