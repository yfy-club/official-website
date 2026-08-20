"use client";

import { useId, useState } from "react";
import {
  Activity,
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
  const gradientId = useId();

  // MLP Layer Configuration
  const layerCounts = [3, 4, 4, 2];
  const layerLabels = ["输入层 (X)", "隐藏层 1 (H₁)", "隐藏层 2 (H₂)", "输出层 (Ŷ)"];
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
            {"// 神经突触前向传导与注意力空间"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--radius-xs)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveTab("mlp")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
              activeTab === "mlp"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            全连接网络 (Dense MLP)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attention")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
              activeTab === "attention"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            Transformer 自注意力 (Self-Attention)
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
                    className="font-mono text-[11px] font-semibold"
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

          {/* 实时张量参数监视器 */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[var(--fg-faint)]">NEURON INSPECTOR:</span>
              {hoveredNeuron ? (
                <span className="text-[var(--accent)] font-bold">
                  Node [{hoveredNeuron.label}] // a = {hoveredNeuron.activation}, bias = {hoveredNeuron.bias}
                </span>
              ) : (
                <span className="text-[var(--fg-muted)]">
                  鼠标悬停任意神经元查看权重张量与激活值流向
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--fg-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] inline-block" />
                正向权重 (w &gt; 0)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)] inline-block" />
                负向抑制 (w &lt; 0)
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
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[var(--fg-muted)]">
                  Q × Kᵀ / √dₖ 注意力权重矩阵 (Attention Map)
                </span>
                <span className="text-[11px] font-mono text-[var(--accent)]">
                  Softmax Normalized
                </span>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <div className="inline-block min-w-[320px]">
                  {/* 顶端 Key 标签 */}
                  <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center font-mono text-xs text-[var(--fg-muted)]">
                    <div />
                    {tokens.map((tok) => (
                      <div key={`col-${tok}`} className="font-semibold">{tok}</div>
                    ))}
                  </div>
                  {/* 热力行 */}
                  {tokens.map((rowTok, rIdx) => (
                    <div key={`row-${rowTok}`} className="grid grid-cols-7 gap-1.5 mb-1.5 items-center">
                      <div className="font-mono text-xs text-right pr-2 font-semibold text-[var(--fg-muted)]">
                        {rowTok}
                      </div>
                      {attentionMatrix[rIdx].map((val, cIdx) => {
                        const isSelected = selectedWord === rIdx;
                        const opacity = Math.max(0.12, val);
                        return (
                          <button
                            key={`cell-${rIdx}-${cIdx}`}
                            type="button"
                            onClick={() => setSelectedWord(rIdx)}
                            className={cn(
                              "h-8 sm:h-9 rounded-[var(--radius-xs)] font-mono text-[10px] sm:text-xs flex items-center justify-center transition-all cursor-pointer border",
                              isSelected
                                ? "border-[var(--accent)] text-[var(--fg)] font-bold shadow-xs"
                                : "border-transparent text-[var(--fg-muted)] hover:border-[var(--border-strong)]",
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
                自注意力机制允许模型在编码当前词「{tokens[selectedWord]}」时，跨越固定窗口动态捕获全句上下文的关键语义权重。
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

  const spans = [
    { id: "span-gw", name: "API Gateway", latency: 2.1, status: "200 OK", protocol: "HTTP/2", detail: "路由匹配与 JWT 权限鉴权完成" },
    { id: "span-auth", name: "Auth & RateLimiter", latency: 1.4, status: "PASSED", protocol: "gRPC", detail: "令牌桶限流校验通过，用户鉴权成功" },
    { id: "span-core", name: "Core Business Service", latency: 4.8, status: "PROCESSED", protocol: "RPC", detail: "执行核心业务逻辑与数据组装" },
    { id: "span-cache", name: "Redis L2 Cache", latency: 0.8, status: "HIT", protocol: "TCP", detail: "SingleFlight 命中缓存，避免穿透" },
    { id: "span-mq", name: "Kafka Event Bus", latency: 1.9, status: "PRODUCED", protocol: "Kafka", detail: "异步发布 OrderCreated 领域事件" },
    { id: "span-db", name: "Sharded DB (Cluster)", latency: 3.2, status: "COMMITTED", protocol: "MySQL", detail: "一致性哈希路由落盘完成" },
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Network size={12} className="text-[var(--accent)]" />
            <span>DISTRIBUTED TRACE INSPECTOR</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// OpenTelemetry 端到端微服务全链路追踪"}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--accent)] font-bold">
          Total p99: 14.2ms
        </span>
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
            return (
              <button
                key={span.id}
                type="button"
                onClick={() => setSelectedSpan(idx)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-[var(--radius-xs)] border transition-all text-left cursor-pointer",
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
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
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                      style={{ width: `${(span.latency / 6.0) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--fg)] w-12 text-right tabular">
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
            <Badge variant="active" className="text-[10px]">
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
              <span className="font-bold text-[var(--accent)]">{spans[selectedSpan].latency} ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
              <span className="text-[var(--fg-muted)]">Trace ID:</span>
              <span className="text-[var(--fg)]">4bf92f3577b34da6</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
              <span className="text-[var(--fg-muted)]">Span ID:</span>
              <span className="text-[var(--fg)]">00f067aa0ba902b7</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--fg-muted)] leading-relaxed">
            <p className="font-semibold text-[var(--fg)] mb-1">执行说明：</p>
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
      if (k < 30) return { root: "50", internal: "20 | 30", leaf: "[15, 20, 28]" };
      return { root: "50", internal: "20 | 30", leaf: "[35, 42, 48]" };
    }
    if (k < 80) return { root: "50", internal: "70 | 85", leaf: "[60, 68, 70]" };
    return { root: "50", internal: "70 | 85", leaf: "[85, 92, 99]" };
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
            {"// B+ 树页索引与 MVCC 快照读"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--radius-xs)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setViewMode("btree")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
              viewMode === "btree"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            B+ 树页索引 (Index Tree)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mvcc")}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
              viewMode === "mvcc"
                ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            MVCC 版本链 (Undo Log)
          </button>
        </div>
      </div>

      {viewMode === "btree" ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 space-y-6">
          {/* 查找键选择栏 */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-[var(--fg-muted)]">选择检索键 (SELECT Key):</span>
            <div className="flex items-center gap-2">
              {searchKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKey(k)}
                  className={cn(
                    "px-3 py-1 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer border",
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
                      <span className="text-[var(--accent)]">{isTarget ? "HIT" : ""}</span>
                    </div>
                    <div className="font-bold text-[var(--fg)]">{leaf.keys}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--fg-muted)] flex items-center justify-between flex-wrap gap-2">
            <span>
              寻址路径：Root (50) → Page #102/103 → {currentPath.leaf}
            </span>
            <span className="text-[var(--accent)] font-bold">
              精确磁盘 I/O 次数：3 次 (无需全表扫描)
            </span>
          </div>
        </div>
      ) : (
        /* MVCC Version Chain View */
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 space-y-4">
          <div className="text-xs font-mono text-[var(--fg-muted)] mb-2">
            {"ROW ID #10086 // CLUSTERED INDEX RECORD & UNDO LOG VERSION CHAIN"}
          </div>

          <div className="space-y-3">
            {[
              { trxId: 1045, rollPtr: "0x7f88a", status: "当前最新版本 (已提交)", balance: "¥ 8,500.00", visible: "对当前事务可见" },
              { trxId: 1032, rollPtr: "0x7f880", status: "历史版本 1 (Undo Log)", balance: "¥ 6,200.00", visible: "历史快照" },
              { trxId: 1010, rollPtr: "NULL", status: "初始创建版本", balance: "¥ 3,000.00", visible: "基线版本" },
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
            {"// 端边云协同与毫秒级时序遥测"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-[var(--fg-muted)]">QoS 协议:</span>
          {([0, 1, 2] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQosLevel(q)}
              className={cn(
                "px-2.5 py-0.5 text-xs font-mono rounded-[var(--radius-xs)] border cursor-pointer",
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
            STM32 / ESP32 裸机或 FreeRTOS 实时采集温湿度、电压与光照度。
          </p>
          <div className="p-2 rounded bg-[var(--surface)] font-mono text-[11px] text-[var(--accent)] space-y-1">
            <div>采样频率: 100 Hz</div>
            <div>协议: Modbus-RTU / I2C</div>
          </div>
        </div>

        {/* Tier 2: 边缘计算网关 */}
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">{"02 // 边缘过滤网关"}</span>
            <Zap size={14} className="text-[var(--accent)]" />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            EdgeX 规则引擎执行滑动窗口均值滤波与 Protobuf 二进制紧凑压缩。
          </p>
          <div className="p-2 rounded bg-[var(--surface)] font-mono text-[11px] text-[var(--fg)] space-y-1">
            <div>数据压缩比: 72%</div>
            <div>上行下发时延: &lt; 5ms</div>
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

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="active" className="font-mono text-[11px] gap-1">
            <Layers size={12} className="text-[var(--accent)]" />
            <span>HAND-EYE CALIBRATION & TWIN</span>
          </Badge>
          <span className="text-xs text-[var(--fg-muted)] font-mono hidden sm:inline">
            {"// AX = XB 刚体空间齐次变换与亚像素缺陷检测"}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--accent)] font-bold">
          标定精度: ±0.03mm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
        {/* 左侧 3D 刚体旋转变换仪表 */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--fg-muted)]">机械臂末端旋转偏角 θ:</span>
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
            <div className="text-[10px] text-[var(--fg-faint)]">HOMOGENEOUS MATRIX T_cam2gripper:</div>
            <div className="text-[var(--fg)] leading-relaxed">
              [ cos({calibAngle}°)  -sin({calibAngle}°)   0   142.5 ]<br />
              [ sin({calibAngle}°)   cos({calibAngle}°)   0   -56.2 ]<br />
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
            {/* 模拟瑕疵定位框 */}
            <div
              className="relative p-3 border-2 border-red-500 rounded font-mono text-[10px] text-red-400 bg-red-500/10"
              style={{ transform: `rotate(${calibAngle * 0.3}deg)` }}
            >
              <div>DEFECT #01: 表面微裂纹</div>
              <div>Conf: 99.4% // 尺寸: 0.12mm</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)] pt-1">
            <span>产线节拍: 120 PPM</span>
            <span className="text-[var(--accent)]">PLC 信号已同步</span>
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
