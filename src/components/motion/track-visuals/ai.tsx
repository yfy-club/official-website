"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Bar, Legend, NodeBox, Readout, SegControl, VisualFrame } from "./frame";

/* ══════════════════════════════════════════════════════════════════
   AI_NN_01 · 全连接前向传播与激活工作点
   图里的每个数字都是真算出来的：确定性权重矩阵 → 逐层 z = Wx + b →
   GELU 激活 → 点击任意神经元展开它的加权求和明细与激活曲线工作点。
   ══════════════════════════════════════════════════════════════════ */

const LAYER_SIZES = [4, 5, 5, 3];
const LAYER_LABELS = ["INPUT x", "HIDDEN h1", "HIDDEN h2", "LOGITS y"];

/** 确定性伪随机：同样的下标永远得到同样的权重，避免水合抖动 */
function seeded(a: number, b: number, c: number) {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  const raw = (s - Math.floor(s)) * 2 - 1;
  return Number(raw.toFixed(4));
}

function gelu(x: number) {
  const res = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
  return Number(res.toFixed(4));
}

const SAMPLES: Record<string, { label: string; input: number[]; caption: string }> = {
  a: { label: "样本 A", input: [0.82, 0.14, 0.65, 0.3], caption: "正常工件特征向量" },
  b: { label: "样本 B", input: [0.11, 0.93, 0.22, 0.78], caption: "微裂纹特征向量" },
  c: { label: "样本 C", input: [0.48, 0.51, 0.49, 0.52], caption: "边界模糊样本" },
};

interface Unit {
  id: string;
  layer: number;
  index: number;
  label: string;
  z: number;
  a: number;
  bias: number;
  cx: number;
  cy: number;
}

const SVG_W = 700;
const SVG_H = 300;

export function AiMlpVisual() {
  const [sample, setSample] = useState("a");
  const [selectedId, setSelectedId] = useState("u-2-0");

  const { units, byId } = useMemo(() => {
    const input = SAMPLES[sample].input;
    const all: Unit[] = [];
    const map = new Map<string, Unit>();
    let previous: number[] = input;

    LAYER_SIZES.forEach((count, layer) => {
      const x = Number((64 + layer * ((SVG_W - 128) / (LAYER_SIZES.length - 1))).toFixed(1));
      const step = SVG_H / (count + 1);
      const current: number[] = [];

      for (let i = 0; i < count; i += 1) {
        let z: number;
        let a: number;
        let bias = 0;

        if (layer === 0) {
          z = input[i];
          a = input[i];
        } else {
          bias = seeded(layer, i, 99) * 0.4;
          z = previous.reduce((sum, prev, j) => sum + prev * seeded(layer, i, j), bias);
          a = layer === LAYER_SIZES.length - 1 ? z : gelu(z);
        }

        current.push(a);
        const unit: Unit = {
          id: `u-${layer}-${i}`,
          layer,
          index: i,
          label:
            layer === 0
              ? `x${i + 1}`
              : layer === LAYER_SIZES.length - 1
                ? `y${i + 1}`
                : `h${layer}${i + 1}`,
          z: Number(z.toFixed(4)),
          a: Number(a.toFixed(4)),
          bias: Number(bias.toFixed(4)),
          cx: x,
          cy: Number((step * (i + 1)).toFixed(1)),
        };
        all.push(unit);
        map.set(unit.id, unit);
      }

      previous = current;
    });

    return { units: all, byId: map };
  }, [sample]);

  const selected = byId.get(selectedId) ?? units[0];
  const maxAbsActivation = Math.max(...units.map((u) => Math.abs(u.a)), 1);

  /** 选中神经元的输入贡献分解：w_j · a_j */
  const contributions = useMemo(() => {
    if (!selected || selected.layer === 0) return [];
    return units
      .filter((u) => u.layer === selected.layer - 1)
      .map((source) => {
        const weight = seeded(selected.layer, selected.index, source.index);
        return { source, weight, value: weight * source.a };
      })
      .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));
  }, [selected, units]);

  const maxContribution = Math.max(...contributions.map((c) => Math.abs(c.value)), 0.01);
  const isOutput = selected ? selected.layer === LAYER_SIZES.length - 1 : false;

  return (
    <VisualFrame
      label="FORWARD PASS · z = Wx + b, a = GELU(z)"
      control={
        <SegControl
          ariaLabel="选择输入样本"
          value={sample}
          onChange={setSample}
          options={Object.entries(SAMPLES).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Readout
            items={[
              { k: "INPUT", v: SAMPLES[sample].caption },
              { k: "DEPTH", v: `${LAYER_SIZES.length - 1} 层` },
              { k: "ACT", v: "GELU", tone: "accent" },
            ]}
          />
          <Legend
            items={[
              { swatch: "bg-[var(--accent)]", label: "w > 0 兴奋" },
              { swatch: "bg-[var(--border-strong)]", label: "w < 0 抑制" },
            ]}
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 拓扑主体 */}
        <div className="lg:col-span-8">
          <div className="overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="h-auto w-full min-w-[560px] select-none"
              role="img"
              aria-label="四层全连接网络前向传播拓扑，选中神经元可查看加权求和明细"
            >
              {/* 突触：粗细 = |w|，不透明度 = 该边的真实贡献 |w·a| */}
              {units
                .filter((u) => u.layer < LAYER_SIZES.length - 1)
                .flatMap((source) =>
                  units
                    .filter((u) => u.layer === source.layer + 1)
                    .map((target) => {
                      const weight = seeded(target.layer, target.index, source.index);
                      const contribution = Math.abs(weight * source.a);
                      const onPath =
                        selected && (selected.id === target.id || selected.id === source.id);
                      const dimmed = selected && selected.layer !== 0 && !onPath;
                      const strokeWidth = Number(Math.max(0.5, Math.abs(weight) * 2.2).toFixed(2));
                      const strokeOpacity = Number((dimmed ? 0.08 : Math.min(0.9, 0.18 + contribution * 0.9)).toFixed(2));

                      return (
                        <line
                          key={`syn-${source.id}-${target.id}`}
                          x1={source.cx}
                          y1={source.cy}
                          x2={target.cx}
                          y2={target.cy}
                          stroke={weight > 0 ? "var(--accent)" : "var(--border-strong)"}
                          strokeWidth={strokeWidth}
                          strokeOpacity={strokeOpacity}
                          className="transition-all duration-300"
                        />
                      );
                    }),
                )}

              {/* 层标题 */}
              {LAYER_LABELS.map((label, index) => (
                <text
                  key={label}
                  x={64 + index * ((SVG_W - 128) / (LAYER_SIZES.length - 1))}
                  y={14}
                  textAnchor="middle"
                  fill="var(--fg-faint)"
                  className="font-mono text-[10px] tracking-wider"
                >
                  {label}
                </text>
              ))}

              {/* 神经元：填充深浅 = 真实激活值 */}
              {units.map((unit) => {
                const isSelected = selected?.id === unit.id;
                const heat = Math.min(1, Math.abs(unit.a) / maxAbsActivation);

                return (
                  <g
                    key={unit.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(unit.id)}
                    onMouseEnter={() => setSelectedId(unit.id)}
                  >
                    <title>{`${unit.label} · a = ${unit.a.toFixed(3)}`}</title>
                    {isSelected && (
                      <circle cx={unit.cx} cy={unit.cy} r={19} fill="var(--accent)" fillOpacity={0.14} />
                    )}
                    <circle
                      cx={unit.cx}
                      cy={unit.cy}
                      r={13}
                      fill={`color-mix(in srgb, var(--accent) ${Math.round(heat * 78)}%, var(--surface-2))`}
                      stroke={isSelected ? "var(--accent)" : "var(--border-strong)"}
                      strokeWidth={isSelected ? 2.4 : 1.2}
                      className="transition-all duration-300"
                    />
                    <text
                      x={unit.cx}
                      y={unit.cy + 3.4}
                      textAnchor="middle"
                      fill="var(--fg)"
                      className="pointer-events-none font-mono text-[9px] font-bold"
                    >
                      {unit.label}
                    </text>
                    <text
                      x={unit.cx}
                      y={unit.cy + 27}
                      textAnchor="middle"
                      fill={isSelected ? "var(--accent)" : "var(--fg-faint)"}
                      className="pointer-events-none font-mono text-[9px] tabular"
                    >
                      {unit.a.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 选中神经元的计算明细 */}
        <div className="space-y-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4 lg:col-span-4">
          <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-2">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">NODE {selected?.label}</span>
            <span className="font-mono text-[10px] text-[var(--fg-faint)]">LAYER {selected?.layer}</span>
          </div>

          {selected && selected.layer === 0 ? (
            <p className="font-mono text-[11px] leading-relaxed text-[var(--fg-muted)]">
              输入层不做计算，直接把特征向量分量送入第一层仿射变换。
              <span className="mt-2 block text-[var(--fg)]">x = {selected.a.toFixed(2)}</span>
            </p>
          ) : (
            <>
              <ul className="space-y-1.5">
                {contributions.map((item) => (
                  <li key={item.source.id} className="space-y-1">
                    <div className="flex items-baseline justify-between font-mono text-[10px]">
                      <span className="text-[var(--fg-muted)]">
                        {item.weight >= 0 ? "+" : "−"}
                        {Math.abs(item.weight).toFixed(2)} · {item.source.label}
                      </span>
                      <span
                        className={cn(
                          "tabular font-bold",
                          item.value >= 0 ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
                        )}
                      >
                        {item.value >= 0 ? "+" : "−"}
                        {Math.abs(item.value).toFixed(3)}
                      </span>
                    </div>
                    <Bar
                      ratio={Math.abs(item.value) / maxContribution}
                      tone={item.value >= 0 ? "accent" : "muted"}
                    />
                  </li>
                ))}
              </ul>

              <div className="space-y-1 border-t border-[var(--border)] pt-2 font-mono text-[11px]">
                <div className="flex justify-between text-[var(--fg-muted)]">
                  <span>bias b</span>
                  <span className="tabular">{selected?.bias.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-[var(--fg)]">
                  <span>加权和 z</span>
                  <span className="tabular font-bold">{selected?.z.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-[var(--accent)]">
                  <span>{isOutput ? "logit" : "GELU(z)"}</span>
                  <span className="tabular font-bold">{selected?.a.toFixed(3)}</span>
                </div>
              </div>

              {/* GELU 曲线与当前工作点 */}
              {selected && !isOutput && (
                <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
                  <span className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">
                    ACTIVATION CURVE
                  </span>
                  <svg viewBox="0 0 120 60" className="h-auto w-full" aria-hidden="true">
                    <line x1="0" y1="42" x2="120" y2="42" stroke="var(--border)" strokeWidth="1" />
                    <line x1="60" y1="4" x2="60" y2="58" stroke="var(--border)" strokeWidth="1" />
                    <path
                      d={Array.from({ length: 61 }, (_, i) => {
                        const zx = -3 + (i / 60) * 6;
                        const px = Number((60 + zx * 20).toFixed(2));
                        const py = Number((42 - gelu(zx) * 14).toFixed(2));
                        return `${i === 0 ? "M" : "L"} ${px} ${py}`;
                      }).join(" ")}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx={Number((60 + Math.max(-3, Math.min(3, selected.z)) * 20).toFixed(2))}
                      cy={Number((42 - gelu(Math.max(-3, Math.min(3, selected.z))) * 14).toFixed(2))}
                      r="3.2"
                      fill="var(--accent)"
                      stroke="var(--surface)"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AI_ATTN_02 · 缩放点积自注意力
   控制器直接切掉除以根号 d_k，让 softmax 当场塌缩成 one-hot ——
   这就是这个概念所提问题的答案本身。
   ══════════════════════════════════════════════════════════════════ */

const TOKENS = ["工业", "表面", "微米级", "缺陷", "智能", "识别"];
const D_K = 64;

/** 固定的 QK^T 原始得分（未缩放） */
const RAW_SCORES = [
  [8.4, 5.1, 2.2, 1.4, 0.6, 0.4],
  [2.6, 9.1, 3.4, 1.9, 0.5, 0.3],
  [1.2, 2.4, 9.8, 2.7, 0.6, 0.4],
  [0.9, 3.1, 4.2, 8.6, 0.7, 0.5],
  [2.0, 1.4, 1.0, 1.6, 7.7, 4.3],
  [0.7, 1.1, 1.5, 5.8, 3.2, 5.9],
];

function softmax(row: number[]) {
  const max = Math.max(...row);
  const exps = row.map((value) => Math.exp(value - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  return exps.map((value) => value / sum);
}

function entropy(row: number[]) {
  return -row.reduce((total, p) => (p > 1e-9 ? total + p * Math.log2(p) : total), 0);
}

export function AiAttentionVisual() {
  const [scaled, setScaled] = useState("on");
  const [queryIndex, setQueryIndex] = useState(3);

  const isScaled = scaled === "on";
  const divisor = isScaled ? Math.sqrt(D_K) : 1;

  const matrix = useMemo(
    () => RAW_SCORES.map((row) => softmax(row.map((value) => (value * 8) / divisor))),
    [divisor],
  );

  const meanEntropy = matrix.reduce((total, row) => total + entropy(row), 0) / matrix.length;

  return (
    <VisualFrame
      label="ATTENTION MAP · softmax(QKᵀ / √dk) V"
      control={
        <SegControl
          ariaLabel="缩放因子开关"
          value={scaled}
          onChange={setScaled}
          options={[
            { value: "on", label: "÷ √dk" },
            { value: "off", label: "不缩放" },
          ]}
        />
      }
      footer={
        <Readout
          items={[
            { k: "d_k", v: D_K },
            { k: "SCALE", v: isScaled ? "1 / 8.00" : "1 / 1.00", tone: isScaled ? "accent" : "warn" },
            { k: "平均熵", v: `${meanEntropy.toFixed(2)} bit`, tone: meanEntropy < 0.6 ? "warn" : "accent" },
            {
              k: "梯度",
              v: isScaled ? "稳定流动" : "Softmax 饱和 · 梯度趋零",
              tone: isScaled ? "success" : "danger",
            },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[380px] border-separate border-spacing-1 font-mono">
              <caption className="sr-only">
                自注意力权重矩阵，行为 Query，列为 Key，数值为百分比
              </caption>
              <thead>
                <tr>
                  <th className="w-14 text-right text-[9px] font-normal text-[var(--fg-faint)]">
                    Q / K
                  </th>
                  {TOKENS.map((token, index) => (
                    <th
                      key={token}
                      scope="col"
                      className={cn(
                        "px-0.5 text-center text-[10px] font-semibold",
                        index === queryIndex ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
                      )}
                    >
                      {token}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((token, rowIndex) => (
                  <tr key={token}>
                    <th
                      scope="row"
                      className={cn(
                        "pr-2 text-right text-[10px] font-semibold",
                        rowIndex === queryIndex ? "text-[var(--accent)]" : "text-[var(--fg-muted)]",
                      )}
                    >
                      {token}
                    </th>
                    {matrix[rowIndex].map((value, columnIndex) => (
                      <td key={`${token}-${TOKENS[columnIndex]}`} className="p-0">
                        <button
                          type="button"
                          onClick={() => setQueryIndex(rowIndex)}
                          aria-label={`${token} 对 ${TOKENS[columnIndex]} 的注意力权重 ${(value * 100).toFixed(0)}%`}
                          className={cn(
                            "flex h-8 w-full cursor-pointer items-center justify-center rounded-[3px] border text-[10px] tabular transition-all active:scale-[0.94] sm:h-9",
                            rowIndex === queryIndex
                              ? "border-[var(--accent)]/60 text-[var(--fg)]"
                              : "border-transparent text-[var(--fg-muted)] hover:border-[var(--border-strong)]",
                          )}
                          style={{
                            backgroundColor: `color-mix(in srgb, var(--accent) ${Math.round(Math.max(0.04, value) * 92)}%, var(--surface-2))`,
                          }}
                        >
                          {value >= 0.005 ? (value * 100).toFixed(0) : "·"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4 lg:col-span-5">
          <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-2">
            <span className="font-mono text-xs font-bold text-[var(--fg)]">
              QUERY「{TOKENS[queryIndex]}」
            </span>
            <span className="font-mono text-[10px] text-[var(--fg-faint)]">
              H = {entropy(matrix[queryIndex]).toFixed(2)}
            </span>
          </div>

          <ul className="space-y-1.5">
            {TOKENS.map((token, index) => (
              <li key={token} className="flex items-center gap-2 font-mono text-[10px]">
                <span className="w-12 shrink-0 truncate text-[var(--fg-muted)]">{token}</span>
                <Bar ratio={matrix[queryIndex][index]} className="flex-1" />
                <span className="w-9 shrink-0 text-right tabular font-bold text-[var(--fg)]">
                  {(matrix[queryIndex][index] * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>

          <p className="border-t border-[var(--border)] pt-2 text-[11px] leading-relaxed text-[var(--fg-muted)]">
            {isScaled
              ? "除以根号 d_k 后点积方差回到 1，softmax 停在敏感区，每个 Value 向量都按语义相关度参与聚合。"
              : "去掉缩放，点积方差被 d_k 放大 64 倍，softmax 塌缩成近似 one-hot —— 反向传播时该层梯度几乎为零，模型学不动。"}
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   AI_CV_03 · 目标检测与端侧量化
   一个精度 / 节拍的权衡台：切换量化位宽，同时看检出结果与延迟预算。
   ══════════════════════════════════════════════════════════════════ */

interface DefectBox {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  conf: Record<string, number>;
}

const DEFECTS: DefectBox[] = [
  { id: "d1", label: "表面微裂纹 0.12mm", x: 22, y: 30, w: 18, h: 13, conf: { fp32: 0.994, fp16: 0.992, int8: 0.981 } },
  { id: "d2", label: "点状夹渣 0.04mm", x: 58, y: 20, w: 10, h: 10, conf: { fp32: 0.961, fp16: 0.955, int8: 0.902 } },
  { id: "d3", label: "边缘毛刺 0.09mm", x: 68, y: 58, w: 15, h: 12, conf: { fp32: 0.842, fp16: 0.831, int8: 0.658 } },
  { id: "d4", label: "疑似划痕 0.21mm", x: 34, y: 66, w: 22, h: 8, conf: { fp32: 0.514, fp16: 0.503, int8: 0.371 } },
];

const PRECISIONS: Record<
  string,
  { label: string; budget: { stage: string; ms: number }[]; map: string; mem: string }
> = {
  fp32: {
    label: "FP32",
    budget: [
      { stage: "预处理", ms: 2.4 },
      { stage: "骨干推理", ms: 26.8 },
      { stage: "NMS 后处理", ms: 3.1 },
    ],
    map: "0.912",
    mem: "1420 MB",
  },
  fp16: {
    label: "FP16",
    budget: [
      { stage: "预处理", ms: 2.4 },
      { stage: "骨干推理", ms: 12.5 },
      { stage: "NMS 后处理", ms: 2.8 },
    ],
    map: "0.908",
    mem: "742 MB",
  },
  int8: {
    label: "INT8",
    budget: [
      { stage: "预处理", ms: 2.1 },
      { stage: "骨干推理", ms: 4.6 },
      { stage: "NMS 后处理", ms: 2.5 },
    ],
    map: "0.871",
    mem: "318 MB",
  },
};

export function AiDetectionVisual() {
  const [precision, setPrecision] = useState("int8");
  const [threshold, setThreshold] = useState(0.6);

  const spec = PRECISIONS[precision];
  const total = spec.budget.reduce((sum, item) => sum + item.ms, 0);
  const fps = 1000 / total;
  const hits = DEFECTS.filter((defect) => defect.conf[precision] >= threshold);

  return (
    <VisualFrame
      label="DEFECT INFERENCE · 精度与节拍权衡台"
      control={
        <SegControl
          ariaLabel="选择推理精度"
          value={precision}
          onChange={setPrecision}
          options={Object.entries(PRECISIONS).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      }
      footer={
        <Readout
          items={[
            { k: "端到端", v: `${total.toFixed(1)} ms` },
            { k: "吞吐", v: `${fps.toFixed(0)} FPS`, tone: fps >= 100 ? "success" : "warn" },
            { k: "mAP@.5", v: spec.map },
            { k: "显存", v: spec.mem, tone: "accent" },
            {
              k: "节拍",
              v: fps >= 100 ? "满足 100 PPM" : "低于 100 PPM",
              tone: fps >= 100 ? "success" : "danger",
            },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 检测画面 */}
        <div className="lg:col-span-7">
          <div className="relative aspect-16/10 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40 bg-[linear-gradient(115deg,transparent_46%,var(--border-strong)_50%,transparent_54%)]"
            />
            {DEFECTS.map((defect) => {
              const confidence = defect.conf[precision];
              const isHit = confidence >= threshold;
              return (
                <div
                  key={defect.id}
                  className={cn(
                    "absolute rounded-[2px] border transition-all duration-300",
                    isHit
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-dashed border-[var(--border-strong)] opacity-40",
                  )}
                  style={{
                    left: `${defect.x}%`,
                    top: `${defect.y}%`,
                    width: `${defect.w}%`,
                    height: `${defect.h}%`,
                  }}
                >
                  <span
                    className={cn(
                      "absolute -top-[15px] left-0 whitespace-nowrap font-mono text-[9px] font-bold",
                      isHit ? "text-[var(--accent)]" : "text-[var(--fg-faint)]",
                    )}
                  >
                    {defect.label} · {(confidence * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="conf-threshold" className="shrink-0 font-mono text-[10px] text-[var(--fg-faint)]">
              CONF ≥ {threshold.toFixed(2)}
            </label>
            <input
              id="conf-threshold"
              type="range"
              min={0.3}
              max={0.95}
              step={0.01}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="w-full cursor-pointer accent-[var(--accent)]"
            />
            <span className="shrink-0 font-mono text-[10px] font-bold text-[var(--fg)]">
              检出 {hits.length}/{DEFECTS.length}
            </span>
          </div>
        </div>

        {/* 延迟预算 */}
        <div className="space-y-4 lg:col-span-5">
          <NodeBox title="LATENCY BUDGET" meta={`${total.toFixed(1)} ms / frame`} active>
            <ul className="space-y-2">
              {spec.budget.map((item) => (
                <li key={item.stage} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[var(--fg-muted)]">{item.stage}</span>
                    <span className="tabular font-bold text-[var(--fg)]">{item.ms.toFixed(1)} ms</span>
                  </div>
                  <Bar ratio={item.ms / 32} tone={item.ms > 20 ? "warn" : "accent"} />
                </li>
              ))}
            </ul>
          </NodeBox>

          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            INT8 把骨干推理压到 <span className="font-mono font-bold text-[var(--accent)]">4.6 ms</span>，
            代价是低置信度目标（0.09 mm 边缘毛刺）掉出阈值。真实产线不会一味追 mAP，
            而是按缺陷等级分设阈值：致命缺陷走 FP16 复检，一般缺陷走 INT8 全速筛。
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
