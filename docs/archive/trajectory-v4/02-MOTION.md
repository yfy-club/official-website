# 02 · 动效规范

> **静止是默认状态。**
> 每一次运动都必须能回答："它在确认什么已经发生的变化？"

---

## 1. 三条硬约束

### 约束一 · 每页只有一个记忆点

每个页面允许存在 **一个**「记忆点动效」（signature moment）——时长可以到 700–1100ms，可以复杂，可以被人记住。除此之外的所有动效必须是 **≤220ms 的微反馈**。

任何新动效的提案，第一个问题是："它会不会成为这一页的第二个记忆点？" 会，就砍掉其中一个。

### 约束二 · 动效预算

| 项目 | 上限 |
| :--- | :--- |
| 同屏并发运行的动画 | **2 个** |
| 全站循环动画 | **1 个**（首页滚动指示器），且 5 秒后自动停止 |
| 滚动驱动动画 | **每页 1 处** |
| 非跨屏过渡的时长 | **≤500ms** |
| 高频交互（hover / press）的时长 | **≤200ms** |
| 交错（stagger）的元素数量 | **≤5 个**，步进 ≤60ms |

### 约束三 · 只动这四个属性

`transform` · `opacity` · `clip-path` · `mask-image`

外加两个自定义属性驱动的值（`--mx` / `--my`）。**不得**动画化 `width` `height` `top` `left` `margin` `padding` `box-shadow`（`box-shadow` 例外：可用 `outline`/`border-color` 替代）。

唯一豁免：折叠面板的高度，使用 `grid-template-rows: 0fr → 1fr`（可合成）或 `interpolate-size: allow-keywords`。

---

## 2. 动效令牌

### 2.1 缓动

```css
--ease-out:     cubic-bezier(0.2, 0, 0, 1);     /* 默认。Material 3 standard */
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);   /* 双向过渡 */
--ease-in:      cubic-bezier(0.4, 0, 1, 1);     /* 仅退场 */
```

`--ease-out` 是全站默认。它前段陡峭、尾部归零，元素会立刻朝目标冲出去然后稳稳落定——这正是"确认一个已经发生的变化"该有的手感。

**不使用** `cubic-bezier(0.4, 0, 0.2, 1)` 作为默认（那是 Material 2 的曲线，对称、软塌、没有决断感）。

### 2.2 时长

```css
--dur-instant: 80ms;    /* 按钮按下 */
--dur-fast:    150ms;   /* 默认：状态确认、颜色变化、焦点环 */
--dur-normal:  220ms;   /* 悬浮、下拉、标签切换 */
--dur-slow:    320ms;   /* 模态框、抽屉入场 */
--dur-page:    480ms;   /* 跨路由过渡 */
--dur-signature: 900ms; /* 仅记忆点动效可用 */
```

150ms 是跨设计系统的收敛值（Material 3 `short3` / IBM Carbon `moderate-01` / Polaris `150` / Tailwind 默认全落在这里）。它是"状态确认"的默认档。

### 2.3 弹簧

位移、缩放、手势跟随用弹簧，不用曲线。

```ts
// Motion (framer-motion) 参数
export const spring = {
  snappy:  { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }, // 按钮、开关
  smooth:  { type: 'spring', stiffness: 260, damping: 30, mass: 1   }, // 卡片、面板
  gentle:  { type: 'spring', stiffness: 160, damping: 26, mass: 1.1 }, // 大块入场
} as const
```

注意：Motion 的物理模式默认阻尼比约 0.5（偏弹），React Spring 的 `default` 是 0.997（临界阻尼）。两者叫同一个名字、手感相反。本项目**显式写参数**，不依赖任何库的默认值。

**用曲线**：颜色、透明度、任何在两个已知值之间变化的属性
**用弹簧**：位置、缩放、旋转、手势驱动

---

## 3. 记忆点动效

全站共 **8 个**，每页一个。逐页详细规格见 [`03-IA-ROUTES.md`](03-IA-ROUTES.md) §4。

### 3.1 `/` · 显影（Develop）

Hero 大标题 `We Code the Future` 的入场。

```
0ms ─────────────────────────────────────────── 1100ms

标题：opacity 0 → 1，同时一条 18% 宽的柔光带
      通过 mask-image 的位置从左掠到右
      像照片在显影液里浮现，而不是"从下往上淡入"

      mask-image: linear-gradient(100deg,
        transparent 0%, black 8%, black 92%, transparent 100%);
      mask-size: 300% 100%;
      mask-position: 100% 0 → 0% 0;
      duration: 1100ms; easing: var(--ease-out);
```

- **只跑一次**，页面生命周期内不重播（`sessionStorage` 记录，同会话内再次访问直接呈现终态）
- 副标题与 CTA：**不做交错入场**，标题动画完成后整组一次性 `opacity` 淡入，180ms
- 首屏其余部分完全静止

**为什么不是逐字淡入**：逐字/逐词入场是这一代 AI 生成页面最泛滥的动效，且它把注意力切成碎片。整体显影保持了标题的完整性，也更贵气。

**降级**：`prefers-reduced-motion` → 直接终态，无动画。

---

### 3.2 `/` · 反预期细节：数字不滚动

首页的四个数字（`2014` `5` `36` `20+`）**不做 count-up**。

count-up 是最容易被识别为"AI 生成"的动效之一，而且它在语义上是错的——`2014` 不是一个从 0 增长到 2014 的量，它是一个年份。

取而代之：整块静止出现，只有下方的四个单位标签有 60ms 步进的交错淡入（4 个元素，符合"交错仅用于小组"）。

---

### 3.3 `/about` · 卷轴（Scroll of Years）

编年史时间轴，2014 → 2026。

```css
.year-tick {
  animation: light-up linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 40%;
}
@keyframes light-up {
  from { opacity: 0.3; }
  to   { opacity: 1; }
}
```

- 使用**原生 CSS 滚动驱动动画**（`animation-timeline: view()`），零 JavaScript
- 当前年份刻度为实心 + `--accent`，其余为描边
- 年份数字 `--font-mono` + `tabular-nums`，绝不因为动画产生宽度抖动
- 不支持的浏览器：全部年份呈现终态（渐进增强，不是降级）

**全页其余部分静止** —— 包括梯队区块的航迹 SVG 曲线，它是静态图形，不做绘制动画（绘制动画已经是 `/tracks/[slug]` 的记忆点，同一手法不在两个页面重复使用）。

---

### 3.4 `/about` · 反预期细节：主体不动，背景动

指导老师卡片 hover 时：

- 头像 / 姓名 / 文字：**完全静止**
- 卡片背后的一层 1px 网格线：`transform: translate3d(2px, -2px, 0)`，220ms

违反"hover 就放大主体"的默认反射。视觉效果是"卡片背后的空间轻微错位了"，比放大更耐看，也不会引起版面跳动。

---

### 3.5 `/tracks` · 分流（Divergence）

五条航道从顶部同一点分叉。

```
        ●              ← 起点
       ╱│╲
     ╱  │  ╲
   ╱   ╱ ╲   ╲
  │   │   │   │  │
  01  02  03  04  05
```

- SVG 五条 path，`stroke-dasharray` / `stroke-dashoffset` 从满偏移绘制到 0
- 时长 **700ms**，五条**同时**开始（不是交错——交错会暗示优先级，而五个方向是平权的）
- 缓动 `--ease-out`
- 绘制完成后**永久静止**，不循环、不呼吸

这是"航迹"概念最直接的一次视觉表达，全站只出现这一次。

**交互 · 减法聚焦**：hover 某一列时，**其余四列降到 30% 不透明度**（250ms），当前列不做任何变换。

用"让别的变暗"代替"让自己变大"——不引起布局位移，不与相邻元素打架，且暗示"专注"而非"膨胀"。

---

### 3.6 `/tracks/[slug]` · 绘线（The Path）

三年成长路线图随滚动被画出来，**并在终点分成两条**。

```
  ●────────●────────┬───● 大三 · 就业
 大一      大二      │
                    └───● 大三 · 考研
```

- 一条 SVG path 贯穿大一、大二两个节点，在大三处**分叉为两条支线**
- `stroke-dashoffset` 绑定该区块的滚动进度（`animation-timeline: view()`；不支持时用 Motion 的 `useScroll` + `useTransform` 兜底）
- 节点在被路径**触及的那一帧**从描边变为实心 `--accent`——不是渐变，是瞬间切换。这个"啪"的一下是整个动效的记忆点
- 两条支线**同时**绘出，不交错——它们是平权的选择，不是主次

**为什么值得占用记忆点配额**：动效在字面意义上描述它所表达的内容——"你会怎么走过这三年，以及最后往哪走"。这是动效有语义的教科书案例（Tversky 2002 唯一背书的用法：空间/时间上的重定向）。

**与 `/tracks` 分流的关系**：两者都是分岔，这是**刻意的呼应，不是重复**。全站的核心隐喻就是航迹与岔路：`/tracks` 分的是"选哪个方向"（五条、一次性入场绘制、进入即完成），这里分的是"选哪条出路"（两条、滚动驱动、在终点才出现）。机制、语义层级、出现时机三项都不同。

全站**只有这两处分岔**，不要加第三处。

**降级**：`prefers-reduced-motion` → 路径直接完整呈现（含两条支线），节点全部实心。

---

### 3.7 `/works` · 底片（Negative）

项目卡片默认低饱和，光标周围恢复彩色。

```css
.work-card {
  filter: saturate(0.25);
  transition: filter var(--dur-normal) var(--ease-out);
}
.work-card__color-layer {
  mask-image: radial-gradient(
    200px 200px at var(--mx) var(--my),
    black 0%, transparent 100%
  );
}
```

- 指针移动只更新两个 CSS 自定义属性 `--mx` / `--my`，**不触发布局或重排**
- 指针事件用 `pointermove` + `requestAnimationFrame` 节流，卡片离开时移除监听
- 像用手电筒扫过一叠底片

**触屏等价物**：无 hover 的设备上，卡片在进入视口时一次性恢复彩色（220ms，`IntersectionObserver`，触发后即断开）。

---

### 3.8 `/works/[slug]` · 对照（Compare）

项目详情页顶部的明暗截图对比滑块。

```css
.compare__top {
  clip-path: inset(0 0 0 var(--split, 50%));
}
```

- 同一界面的暗色与亮色截图叠放，上层用 `clip-path` 裁切
- 拖动手柄只更新 `--split` 一个 CSS 变量，指针事件经 `rAF` 节流，不触发布局
- **全站唯一一处手势驱动、位置跟随的动效**。其余七个都是"触发后自己跑完"，这个是"跟着手指走"——机制上完全不同，因此不构成重复
- 语义真实：这两个项目都实现了完整的明暗双主题，本身就是工程完成度的证据；而本站自己也是双主题，形成呼应

**必须做到的三件事**：

1. **键盘等价** —— 手柄是 `role="slider"` + `tabindex="0"`，`←`/`→` 每次 5%，`Home`/`End` 到两端，带 `aria-valuenow` / `aria-label`
2. **`touch-action: pan-y`** —— 横向拖手柄，纵向仍可正常滚动页面。这是它能作为"全站唯一横向手势"的前提（见 [`09-MOBILE.md`](09-MOBILE.md) §7）
3. **只有一张截图时不渲染滑块** —— 退化为静态图。不为了保住动效硬造第二张图

**降级**：`prefers-reduced-motion` → 滑块仍可用（它是用户主动控制的，不是自动播放的动画），但取消手柄的弹性回弹，改为直接跟随。

---

### 3.9 `/awards` · 抽屉（Drawer）

证书卡 → 全屏原图。

```css
.cert-thumb { view-transition-name: cert-<id>; }
```

- 使用 **View Transitions API** 的共享元素过渡，缩略图沿真实路径放大成全屏，关闭时原路收回
- 时长 320ms，`--ease-out`
- 由用户点击触发，一次性，语义明确（"这个东西变大了"）

**这一页在静止时完全不动** —— 零 hover 变换、零入场交错。荣誉页应该像一面墙：庄重、稳定、不谄媚。

**必须显式处理 reduced-motion**：View Transitions API **不会**自动应用 `prefers-reduced-motion`。

```ts
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!document.startViewTransition || reduce) { openCert(id) }
else { document.startViewTransition(() => openCert(id)) }
```

**替代旧版跑马灯的理由**：跑马灯违反 WCAG 2.2.2（超过 5 秒的运动内容必须提供暂停控件，Level A），用户看不清、点不中、还持续耗电。它是"看起来在动"，不是"设计"。

---

### 3.10 `/join` · 盖章（Stamp）

表单提交成功。

- 按钮区域被一枚「已收到」印记替换
- `scale(1.06) → scale(1)` + `opacity 0 → 1`，**180ms**，弹簧 `spring.snappy`
- **一次**。没有 confetti、没有粒子、没有循环

同时：`role="status"` + `aria-live="polite"` 播报"报名已提交"——动效绝不能是状态变化的唯一信号。

---

### 3.11 `/join` · 反预期细节：取景框

QQ 群二维码 hover 时，二维码本身**不放大**，四角的取景框标记向外扩张 4px（180ms）。

相机取景器隐喻，暗示"扫我"。比"放大"更聪明，也不会造成版面位移。

**移动端没有这个动效** —— 因为移动端根本不该以二维码为主。用户正用手机看这个页面，没法用同一台手机扫自己的屏幕。移动端改为「一键加入 QQ 群」深链 + 长按识别 + 复制群号的三级降级，见 [`09-MOBILE.md`](09-MOBILE.md) §6.3。

这是一个提醒：**有些动效在另一个设备上不是"要适配"，而是"整个交互前提不成立"**。

---

## 4. 微反馈规范（全站统一）

| 交互 | 变化 | 时长 | 缓动 |
| :--- | :--- | :--- | :--- |
| 按钮按下 | `scale(0.98)` | **80ms** | `--ease-out` |
| 按钮悬浮 | 背景明度 +4% | 150ms | `--ease-out` |
| 卡片悬浮 | `--border` → `--border-strong` | 220ms | `--ease-out` |
| 链接悬浮 | 下划线色 → `--accent` | 150ms | `--ease-out` |
| 焦点获得 | `outline` 出现（**不做动画**） | 0ms | — |
| 输入框聚焦 | 边框色 → `--accent` | 150ms | `--ease-out` |
| 表单校验失败 | 边框色 → `--danger` + 文字淡入 | 150ms | `--ease-out` |
| 主题切换 | 全站色彩交叉淡入 | 220ms | `--ease-in-out` |
| 导航胶囊收缩 | 高度 56→48px、边框透明度 0.08→0.14 | 220ms | `--ease-out` |
| 跨路由过渡 | 交叉淡入 | 180ms | `--ease-out` |

**表单错误绝不抖动。** 抖动是惩罚性的，且是明确的前庭不适诱因。用颜色 + 文字，不用位移。

**焦点环不做动画。** 键盘用户快速 Tab 时，任何过渡都会让焦点位置模糊不清。

---

## 5. 无障碍与降级

### 5.1 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

规则：**剥离轴向运动（位移 / 缩放 / 旋转 / 视差），保留透明度与颜色的交叉淡入**作为状态变化的替代信号。

逐项处理：

| 动效 | reduced-motion 行为 |
| :--- | :--- |
| Hero 显影 | 直接终态 |
| 编年史点亮 | 全部年份呈现终态 |
| 五线分流 | 线条直接完整绘出 |
| 路线图绘线 | 路径完整，节点全实心 |
| 底片聚光 | 卡片直接全彩 |
| 证书抽屉 | 跳过 `startViewTransition`，直接切换 |
| 提交盖章 | 无缩放，仅淡入 |
| 滚动指示器呼吸 | 停止 |
| 页面过渡 | 无过渡 |

### 5.2 WCAG 相关条款

| 条款 | 等级 | 本项目的处理 |
| :--- | :--- | :--- |
| 2.2.2 暂停/停止/隐藏 | A | 全站唯一的循环动画（滚动指示器）5 秒后自动停止 |
| 2.3.1 闪光阈值 | A | 无任何闪烁类动效 |
| 2.3.3 交互中的动画 | AAA | 通过 `prefers-reduced-motion` 完整支持——这是主动的工艺承诺，超出法定底线 |
| 1.4.11 非文本对比 | AA | 表单控件边框 ≥3:1（暗 3.38 / 亮 3.21），焦点环 ≥3:1（暗 7.15 / 亮 4.77） |
| 4.1.3 状态消息 | AA | 提交结果通过 `aria-live` 播报，不依赖动效 |

### 5.3 状态变化不得只靠动效表达

每个用动效表达的状态变化，必须同时有一个**静态可感知**的伴随信号：颜色、位置、文字、图标或 ARIA 播报。

---

## 6. 性能

| 规则 | 理由 |
| :--- | :--- |
| 只动 `transform` / `opacity` / `clip-path` / `mask-image` | 可在合成层完成，不触发布局与绘制 |
| `will-change` 只在动画开始前加、结束后立即移除 | 常驻 `will-change` 会永久占用合成层内存 |
| 滚动监听一律用 `IntersectionObserver` 或 CSS 滚动驱动动画 | 高频 `scroll` 事件是掉帧的头号来源 |
| `pointermove` 必须经 `rAF` 节流 | 底片效果每帧最多更新一次 CSS 变量 |
| 一次性动效触发后立即断开 observer | 避免内存泄漏 |
| 组件卸载时清理所有定时器、监听器、动画实例 | 同上 |
| **不引入平滑滚动库**（Lenis / Locomotive） | 破坏原生滚动手感、干扰 CSS 滚动驱动动画、对辅助技术不友好、增加包体 |
| **不引入 GSAP** | 本项目需要的滚动驱动能力，原生 CSS + Motion 的 `useScroll` 已完全覆盖；GSAP 约 +50KB 且换不来任何一个上述动效 |

**验收**：在中端安卓（约骁龙 6 系）上，所有记忆点动效需稳定 ≥50fps；微反馈不得出现掉帧。

---

## 7. 移动端

移动端不是"同样的动效跑在小屏上"。三条差异：

1. **时长缩短 20–30%** —— 移动距离更短，同样时长会显得拖沓。首页显影 1100ms → 850ms，提交盖章 180ms → 140ms
2. **hover 类动效全部清算** —— 包进 `@media (hover: hover) and (pointer: fine)`，并为触屏提供等价物或明确取消
3. **两个记忆点需要形态重构**，而非等比缩放 —— `/tracks` 的分流动画改为纵向地铁线路图形态；`/tracks/[slug]` 的路线图改为纵向绘制（方向与滚动一致，反而比桌面更自然）

`/works` 的底片聚光在 `@media (hover: none)` 下**根本不注册 `pointermove`**，不是注册了不用——省下的是真实的电量与主线程时间。

完整规格见 **[`09-MOBILE.md`](09-MOBILE.md)** §4–§5。

---

## 8. 提案检查清单

给这个项目加动效前，逐条过：

- [ ] 它确认的是一个**已经发生**的状态变化，而不是在表演一个变化？
- [ ] 它会成为这一页的**第二个**记忆点吗？
- [ ] 同屏是否已有 2 个动画在跑？
- [ ] 时长是否 ≤220ms（微反馈）或 ≤1100ms（记忆点）？
- [ ] 只动了 `transform` / `opacity` / `clip-path` / `mask-image`？
- [ ] 有 `prefers-reduced-motion` 分支？
- [ ] 有非动效的伴随信号？
- [ ] hover 样式包在 `@media (hover: hover)` 里了吗？触屏设备上有等价交互吗？
- [ ] 移动端时长缩短了 20–30% 吗？竖屏下形态还成立吗？
- [ ] 如果是循环动画——真的必要吗？（默认答案是"不"）

---

**下一步** → [`09-MOBILE.md`](09-MOBILE.md) · [`05-ARCHITECTURE.md`](05-ARCHITECTURE.md)
