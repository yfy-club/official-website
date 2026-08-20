"use client";

import { useMemo, useState } from "react";

import { Bar, NodeBox, Readout, SegControl, VisualFrame } from "./frame";

/* ══════════════════════════════════════════════════════════════════
   IND_CALIB_01 · 手眼标定 AX = XB
   拖动标定位姿数量，看重投影残差怎么随约束增加而收敛 ——
   标定不是「测一次量出来的」，是解一个超定方程组。
   ══════════════════════════════════════════════════════════════════ */

const T_CAM2GRIPPER = { x: 142.5, y: -56.2, z: 310.8 };

function residualFor(poses: number) {
  return 0.62 / Math.sqrt(Math.max(1, poses - 2));
}

export function IndCalibVisual() {
  const [poses, setPoses] = useState(11);
  const [theta, setTheta] = useState(35);

  const rad = (theta * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const residual = residualFor(poses);
  const converged = residual < 0.25;

  const curve = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const n = index + 3;
        return { n, value: residualFor(n) };
      }),
    [],
  );

  return (
    <VisualFrame
      label="HAND-EYE CALIBRATION · AX = XB"
      control={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="calib-theta" className="font-mono text-[10px] text-[var(--fg-faint)]">
              θ {theta}°
            </label>
            <input
              id="calib-theta"
              type="range"
              min={0}
              max={90}
              value={theta}
              onChange={(event) => setTheta(Number(event.target.value))}
              className="w-20 cursor-pointer accent-[var(--accent)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="calib-poses" className="font-mono text-[10px] text-[var(--fg-faint)]">
              位姿 {poses}
            </label>
            <input
              id="calib-poses"
              type="range"
              min={3}
              max={20}
              value={poses}
              onChange={(event) => setPoses(Number(event.target.value))}
              className="w-20 cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>
      }
      footer={
        <Readout
          items={[
            { k: "约束方程", v: `${poses - 1} 组相对运动` },
            { k: "重投影残差", v: `${residual.toFixed(3)} mm`, tone: converged ? "success" : "warn" },
            { k: "标定精度", v: converged ? "±0.03 mm 可交付" : "样本不足，未收敛", tone: converged ? "success" : "danger" },
            { k: "求解", v: "Tsai-Lenz / 对偶四元数", tone: "accent" },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 坐标链 */}
        <div className="space-y-3 lg:col-span-5">
          <svg viewBox="0 0 260 180" className="h-auto w-full" role="img" aria-label="基座、末端、相机与工件的坐标系链路">
            {/* 基座 */}
            <g>
              <rect x="14" y="132" width="52" height="30" rx="2" fill="var(--surface-2)" stroke="var(--border-strong)" />
              <text x="40" y="151" textAnchor="middle" fill="var(--fg-muted)" className="font-mono text-[9px]">
                BASE
              </text>
            </g>
            {/* 机械臂连杆 */}
            <line x1="40" y1="132" x2="120" y2="70" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" />
            <line
              x1="120"
              y1="70"
              x2={120 + 62 * cos}
              y2={70 - 62 * sin}
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-all duration-150"
            />
            <circle cx="120" cy="70" r="5" fill="var(--surface)" stroke="var(--fg-muted)" strokeWidth="1.5" />
            {/* 末端与相机 */}
            <circle
              cx={120 + 62 * cos}
              cy={70 - 62 * sin}
              r="6"
              fill="var(--accent)"
              className="transition-all duration-150"
            />
            <text
              x={120 + 62 * cos}
              y={70 - 62 * sin - 12}
              textAnchor="middle"
              fill="var(--accent)"
              className="font-mono text-[9px] font-bold"
            >
              GRIPPER + CAM
            </text>
            {/* 工件 */}
            <rect x="188" y="128" width="54" height="34" rx="2" fill="var(--surface-2)" stroke="var(--border-strong)" />
            <text x="215" y="148" textAnchor="middle" fill="var(--fg-muted)" className="font-mono text-[9px]">
              TARGET
            </text>
            {/* 视线 */}
            <line
              x1={120 + 62 * cos}
              y1={70 - 62 * sin}
              x2="215"
              y2="128"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.7"
            />
          </svg>

          <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-3 font-mono text-[10px] leading-relaxed">
            <div className="mb-1.5 text-[var(--fg-faint)]">T_cam2gripper (4×4 齐次)</div>
            <div className="tabular text-[var(--fg-muted)]">
              [ <span className="font-bold text-[var(--accent)]">{cos.toFixed(4)}</span>{" "}
              <span className="font-bold text-[var(--accent)]">{(-sin).toFixed(4)}</span> 0.0000{" "}
              {T_CAM2GRIPPER.x} ]
              <br />[ <span className="font-bold text-[var(--accent)]">{sin.toFixed(4)}</span>{" "}
              <span className="font-bold text-[var(--accent)]">{cos.toFixed(4)}</span> 0.0000{" "}
              {T_CAM2GRIPPER.y} ]
              <br />[ 0.0000 0.0000 1.0000 {T_CAM2GRIPPER.z} ]
              <br />[ 0.0000 0.0000 0.0000 1.0000 ]
            </div>
          </div>
        </div>

        {/* 残差收敛 */}
        <div className="space-y-3 lg:col-span-7">
          <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/50 p-4">
            <div className="mb-2 flex items-baseline justify-between font-mono text-[10px]">
              <span className="tracking-wider text-[var(--fg-faint)]">RESIDUAL vs 标定位姿数</span>
              <span className="text-[var(--fg-muted)]">目标 ≤ 0.25 mm</span>
            </div>
            <svg viewBox="0 0 400 120" className="h-auto w-full" role="img" aria-label="重投影残差随标定位姿数量收敛曲线">
              <line x1="0" y1="70" x2="400" y2="70" stroke="var(--warn)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <path
                d={curve
                  .map((point, index) => {
                    const x = (index / (curve.length - 1)) * 396 + 2;
                    const y = 112 - (0.42 - point.value) * 200;
                    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${Math.max(6, Math.min(114, y)).toFixed(1)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
              />
              {curve.map((point, index) => {
                const x = (index / (curve.length - 1)) * 396 + 2;
                const y = Math.max(6, Math.min(114, 112 - (0.42 - point.value) * 200));
                const isCurrent = point.n === poses;
                return (
                  <circle
                    key={point.n}
                    cx={x}
                    cy={y}
                    r={isCurrent ? 4.5 : 2}
                    fill={isCurrent ? "var(--accent)" : "var(--border-strong)"}
                    stroke={isCurrent ? "var(--surface)" : "none"}
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            机械臂末端与相机之间的固定变换 <span className="font-mono text-[var(--fg)]">X</span> 无法直接测量。
            做法是让机械臂摆若干个位姿，每两个位姿之间构成一组
            <span className="font-mono text-[var(--fg)]"> AX = XB</span>：
            <span className="font-mono text-[var(--fg)]">A</span> 是末端的相对运动（由关节编码器读出，已知），
            <span className="font-mono text-[var(--fg)]">B</span> 是相机看标定板算出的相对运动（已知）。
            位姿越多、姿态差异越大，方程组的条件数越好，残差就越低 ——
            {converged
              ? " 当前 " + poses + " 个位姿已把残差压进可交付区间。"
              : " 当前位姿太少，旋转轴方向近乎共线，解不稳定。"}
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   IND_OPC_02 · 从私有报文到统一语义
   左边是四家 PLC 各说各话的裸字节，右边是同一个带单位、时间戳和
   质量码的 OPC UA 节点。中间那步映射，才是「工业互联」的实际含义。
   ══════════════════════════════════════════════════════════════════ */

const PLCS: Record<
  string,
  { label: string; protocol: string; frame: string; raw: string; quirk: string }
> = {
  siemens: {
    label: "西门子 S7-1200",
    protocol: "S7comm / ISO-TCP",
    frame: "03 00 00 1F 02 F0 80 32 01 00 00 06 00 ... 84 00 01 90",
    raw: "DB10.DBD400 = 0x42A1999A",
    quirk: "大端浮点，地址按 DB 块偏移手工换算",
  },
  mitsubishi: {
    label: "三菱 FX5U",
    protocol: "MC Protocol 3E",
    frame: "50 00 00 FF FF 03 00 0C 00 10 00 01 04 00 00 ...",
    raw: "D1200 = 8092 (×0.01)",
    quirk: "16 位寄存器 + 隐含倍率，单位靠文档口口相传",
  },
  omron: {
    label: "欧姆龙 NX102",
    protocol: "FINS / UDP",
    frame: "80 00 02 00 00 00 00 00 01 01 01 82 00 4B 00 ...",
    raw: "D75 = 8092",
    quirk: "小端存放，跨字读取需要手动拼接",
  },
  modbus: {
    label: "通用变频器",
    protocol: "Modbus-RTU",
    frame: "01 03 04 1F 9C 00 00 7A B3",
    raw: "40001-40002 = 8092",
    quirk: "只有寄存器号，没有任何语义信息",
  },
};

export function IndOpcuaVisual() {
  const [device, setDevice] = useState("siemens");
  const [deadband, setDeadband] = useState(2);
  const plc = PLCS[device];

  /** 死区越大，上行帧数越少；这是现场防抖最直接的旋钮 */
  const framesPerMinute = Math.max(6, Math.round(1200 / (deadband + 0.6)));

  return (
    <VisualFrame
      label="OPC UA · 协议归一与语义建模"
      control={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <SegControl
            ariaLabel="选择现场设备"
            value={device}
            onChange={setDevice}
            options={[
              { value: "siemens", label: "S7" },
              { value: "mitsubishi", label: "MC" },
              { value: "omron", label: "FINS" },
              { value: "modbus", label: "Modbus" },
            ]}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="opc-deadband" className="font-mono text-[10px] text-[var(--fg-faint)]">
              死区 {deadband.toFixed(1)}%
            </label>
            <input
              id="opc-deadband"
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={deadband}
              onChange={(event) => setDeadband(Number(event.target.value))}
              className="w-20 cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>
      }
      footer={
        <Readout
          items={[
            { k: "现场协议", v: plc.protocol },
            { k: "订阅模式", v: "MonitoredItem · 变化上报" },
            { k: "上行帧率", v: `${framesPerMinute} 帧/分`, tone: deadband >= 1.5 ? "success" : "warn" },
            { k: "采样间隔", v: "50 ms" },
            { k: "质量码", v: "Good (0x00000000)", tone: "success" },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* 现场侧 */}
        <NodeBox title={plc.label} meta="FIELD LAYER" active tone="warn">
          <div className="space-y-2">
            <div className="rounded-[2px] border border-[var(--border)] bg-[var(--surface)] p-2 font-mono text-[9px] leading-relaxed break-all text-[var(--fg-muted)]">
              {plc.frame}
            </div>
            <dl className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--fg-faint)]">寄存器</dt>
                <dd className="text-[var(--fg)]">{plc.raw}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--fg-faint)]">单位</dt>
                <dd className="text-[var(--warn)]">未定义</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--fg-faint)]">时间戳</dt>
                <dd className="text-[var(--warn)]">无</dd>
              </div>
            </dl>
            <p className="text-[10px] leading-relaxed text-[var(--fg-muted)]">{plc.quirk}</p>
          </div>
        </NodeBox>

        {/* 映射 */}
        <div className="flex flex-row items-center justify-center gap-2 lg:flex-col">
          <span className="h-px w-8 bg-[var(--border-strong)] lg:h-8 lg:w-px" />
          <span className="whitespace-nowrap rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-2 py-1 font-mono text-[9px] font-bold text-[var(--fg)]">
            信息模型映射
          </span>
          <span className="h-px w-8 bg-[var(--border-strong)] lg:h-8 lg:w-px" />
        </div>

        {/* 统一语义侧 */}
        <NodeBox title="ns=2;s=Line1.Press01.Temp" meta="OPC UA ADDRESS SPACE" active>
          <dl className="space-y-1 font-mono text-[10px]">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--fg-faint)]">DataType</dt>
              <dd className="text-[var(--fg)]">Float</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--fg-faint)]">Value</dt>
              <dd className="tabular font-bold text-[var(--accent)]">80.92</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--fg-faint)]">EngineeringUnits</dt>
              <dd className="text-[var(--fg)]">°C (UNECE C62)</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--fg-faint)]">SourceTimestamp</dt>
              <dd className="text-[var(--fg)]">PLC 侧 UTC</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--fg-faint)]">StatusCode</dt>
              <dd className="text-[var(--success)]">Good</dd>
            </div>
          </dl>
          <p className="mt-2 border-t border-[var(--border)] pt-2 text-[10px] leading-relaxed text-[var(--fg-muted)]">
            上层 MES 只认这个节点。换一台 PLC 只需重写映射层，业务代码一行不动 —— 这才是统一语义的价值。
          </p>
        </NodeBox>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4">
        <div className="flex items-baseline justify-between font-mono text-[10px]">
          <span className="text-[var(--fg-faint)]">DEADBAND 防抖 · 数值波动小于死区不产生上报</span>
          <span className="tabular font-bold text-[var(--fg)]">{framesPerMinute} 帧/分</span>
        </div>
        <Bar ratio={framesPerMinute / 2000} tone={deadband >= 1.5 ? "accent" : "warn"} />
        <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
          {deadband < 1
            ? "死区接近 0 时，传感器最后一位的抖动会被当成「变化」持续上报，网络和历史库双双被噪声灌满。"
            : "把死区设到量程的 1.5%–3%，既滤掉末位抖动，又不会漏掉真实工艺波动。"}
        </p>
      </div>
    </VisualFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════
   IND_VISION_03 · 亚像素边缘定位
   同一条模糊边缘，三种算法给出三个答案。像素栅格是离散的，
   但边缘的真实位置藏在灰度分布里。
   ══════════════════════════════════════════════════════════════════ */

/** 一条被光学模糊展宽的阶跃边缘：真实边缘位于 x = 7.68 */
const TRUE_EDGE = 7.68;
const PROFILE = Array.from({ length: 14 }, (_, index) => {
  const value = 30 + 200 / (1 + Math.exp(-(index - TRUE_EDGE) * 1.35));
  return Math.round(value);
});

const METHODS: Record<
  string,
  { label: string; estimate: number; precision: string; cost: string; detail: string }
> = {
  pixel: {
    label: "像素级阈值",
    estimate: 8,
    precision: "±0.500 px",
    cost: "0.02 ms",
    detail: "取灰度首次越过阈值的整数列。结果永远落在栅格上，误差下界就是半个像素。",
  },
  centroid: {
    label: "灰度重心",
    estimate: 7.74,
    precision: "±0.100 px",
    cost: "0.09 ms",
    detail: "对梯度做加权重心。突破了栅格限制，但对非对称模糊和背景不均敏感。",
  },
  gaussian: {
    label: "梯度高斯拟合",
    estimate: 7.681,
    precision: "±0.020 px",
    cost: "0.31 ms",
    detail: "把梯度剖面拟合成高斯，取解析极值点。利用了整条剖面的全部信息，抗噪最强。",
  },
};

export function IndVisionVisual() {
  const [method, setMethod] = useState("gaussian");
  const spec = METHODS[method];
  const maxValue = Math.max(...PROFILE);
  const errorPx = Math.abs(spec.estimate - TRUE_EDGE);

  return (
    <VisualFrame
      label="SUB-PIXEL EDGE · 灰度剖面拟合"
      control={
        <SegControl
          ariaLabel="选择边缘定位算法"
          value={method}
          onChange={setMethod}
          options={Object.entries(METHODS).map(([value, meta]) => ({ value, label: meta.label }))}
        />
      }
      footer={
        <Readout
          items={[
            { k: "估计位置", v: `x = ${spec.estimate}` },
            { k: "真值", v: `x = ${TRUE_EDGE}` },
            { k: "偏差", v: `${errorPx.toFixed(3)} px`, tone: errorPx < 0.05 ? "success" : errorPx < 0.2 ? "warn" : "danger" },
            { k: "重复精度", v: spec.precision, tone: "accent" },
            { k: "单次耗时", v: spec.cost },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/50 p-4">
            {/* 灰度柱：每根就是一个像素 */}
            <div className="flex h-40 items-end gap-[3px]">
              {PROFILE.map((value, index) => (
                <div key={`px-${index}`} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-[1px] bg-[var(--border-strong)] transition-all"
                    style={{
                      height: `${(value / maxValue) * 100}%`,
                      backgroundColor: `color-mix(in srgb, var(--fg) ${Math.round((value / maxValue) * 55)}%, var(--surface-2))`,
                    }}
                  />
                  <span className="font-mono text-[8px] text-[var(--fg-faint)]">{index}</span>
                </div>
              ))}
            </div>

            {/* 估计位置标线 */}
            <div
              className="pointer-events-none absolute bottom-8 top-4 w-px bg-[var(--accent)] transition-all duration-300"
              style={{ left: `calc(1rem + ${((spec.estimate + 0.5) / PROFILE.length) * 100}% - 0.5px)` }}
            >
              <span className="absolute -top-1 left-1.5 whitespace-nowrap font-mono text-[9px] font-bold text-[var(--accent)]">
                估计 {spec.estimate}
              </span>
            </div>
            {/* 真值标线 */}
            <div
              className="pointer-events-none absolute bottom-8 top-4 w-px border-l border-dashed border-[var(--fg-muted)]"
              style={{ left: `calc(1rem + ${((TRUE_EDGE + 0.5) / PROFILE.length) * 100}% - 0.5px)` }}
            >
              <span className="absolute -bottom-5 -left-3 whitespace-nowrap font-mono text-[9px] text-[var(--fg-muted)]">
                真值
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-5">
          <NodeBox title={spec.label} meta={spec.precision} active>
            <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">{spec.detail}</p>
          </NodeBox>

          <div className="space-y-2 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
            <span className="font-mono text-[10px] tracking-wider text-[var(--fg-faint)]">
              定位偏差对比 · 越短越好
            </span>
            {Object.entries(METHODS).map(([key, meta]) => {
              const error = Math.abs(meta.estimate - TRUE_EDGE);
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className={key === method ? "font-bold text-[var(--fg)]" : "text-[var(--fg-muted)]"}>
                      {meta.label}
                    </span>
                    <span className="tabular text-[var(--fg)]">{error.toFixed(3)} px</span>
                  </div>
                  <Bar ratio={error / 0.35} tone={key === method ? "accent" : "muted"} />
                </div>
              );
            })}
          </div>

          <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
            在 <span className="font-mono text-[var(--fg)]">5 μm/px</span> 的镜头配置下，
            0.02 px 的定位精度对应 <span className="font-bold text-[var(--fg)]">0.1 μm</span> 的实际测量分辨率
            —— 这就是亚像素算法能在普通工业相机上做出千分尺级测量的原因。
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}
