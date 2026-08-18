# 06 · 组件清单与契约

> 命名：布局组件 `Site*`、区块组件 `*Section`、动效组件按效果命名。
> 默认是 React Server Component；标注 `'use client'` 的才带客户端 JS。

---

## 1. 布局组件（`components/layout/`）

### `SiteHeader` `'use client'`

悬浮胶囊导航。

| Prop | 类型 | 说明 |
| :--- | :--- | :--- |
| — | — | 无 prop，导航项来自 `content/nav.ts` |

- 左上角 Logo 独立，右侧胶囊含导航项 + `ThemeToggle` + 「加入」CTA
- 滚动 >80px：高度 `--header-height` → `--header-height-scrolled`，边框 `--border` → `--border-strong`，220ms。**这是本组件唯一的滚动响应**
- 滚动监听用 `IntersectionObserver` 观察一个页首哨兵元素，不用 `scroll` 事件
- 当前路由标记：下方 1px 短横线（不用背景高亮）
- `<header>` + `<nav aria-label="主导航">`
- 移动端：汉堡 → 全屏面板，4 个导航项 40ms 步进交错入场；打开时 `inert` 锁背景滚动，焦点陷阱由 Radix Dialog 提供

### `TrajectoryRail`

全站签名元素。左侧刻度轨，兼滚动进度与章节导航。

| Prop | 类型 | 说明 |
| :--- | :--- | :--- |
| `sections` | `{ id: string; label: string; index: string }[]` | 当前页的章节 |

- **零 JavaScript**：进度填充用 `animation-timeline: scroll(root block)`，当前项高亮用 `animation-timeline: view()`
- `<nav aria-label="页面章节"><ol>`，当前项 `aria-current="true"`
- 刻度点是 6px **方形**（不是圆点）
- `<1280px` 隐藏，改为吸顶的 **`MobileRail`**：28px 高，左侧 `03 / 05` 等宽编号 + 章节名，右侧 2px 进度轨；点击展开章节列表。签名元素在移动端主场不缺席（见 [`09-MOBILE.md`](09-MOBILE.md) §3）
- 不支持 CSS 滚动时间线的浏览器：静态呈现全部刻度（渐进增强）

### `SiteFooter`

三列 + 底部单行。包含 Blueprint 蓝图模式彩蛋（连点署名 5 次，10 秒后自动还原）——从旧版继承，这是有灵魂的细节。

### `ThemeToggle` `'use client'`

`next-themes` 的 `useTheme`。三态：`system` / `light` / `dark`。图标用 Lucide 的 `Sun` / `Moon` / `Monitor`，`aria-label` 明确当前态。

---

## 2. 基础 UI（`components/ui/`）

### `Button`

| Prop | 类型 | 默认 |
| :--- | :--- | :--- |
| `variant` | `'primary' \| 'accent' \| 'ghost' \| 'link'` | `'primary'` |
| `size` | `'md' \| 'sm'` | `'md'` |
| `asChild` | `boolean` | `false` |

- `md` 高 44px（触控最小尺寸），`sm` 高 36px（仅用于非主要操作，且不得是移动端主路径）
- `primary` = 中性高对比（`--btn-primary-bg` / `--btn-primary-fg`，16.87:1）
- `accent` **全站只用一次**：`/join` 的提交按钮
- 按下：`scale(0.98)`，**80ms** —— 全站最快、最常被感知的动效，值得单独调
- `asChild` 用 Radix Slot，让 `<Link>` 直接继承样式

### `Card`

- 底 `--surface`，边 1px `--border`，圆角 `--radius-sm`
- hover：边框升到 `--border-strong`。**不位移、不放大、不加投影**
- 禁止：左侧彩色竖条、内嵌渐变底、彩色图标底

### `Tag`

技术栈关键词。`--font-mono` + `--text-caption` + 1px 边框 + `--radius-xs`。

**无 color prop** —— 五大方向不分配五种颜色，那等于引入五个第二强调色。区分靠编号与位置。

### `DataTable`

| Prop | 类型 |
| :--- | :--- |
| `columns` | `{ key: string; label: string; align?: 'left' \| 'right' }[]` |
| `rows` | `Record<string, ReactNode>[]` |

- 表头 `.caps`（等宽 + 全大写 + `0.1em` 字距）
- 行分隔 1px `--border`，**无竖线**
- 亮色斑马纹用 `--surface-2`；暗色**不用**斑马纹（明度差在暗色下显脏），改为 hover 整行 `--accent-quiet`
- 数字列右对齐 + `tabular-nums`
- 真正的 `<table>` + `<caption class="sr-only">`

### `Field` `'use client'`

表单字段容器。整合 label / input / 错误信息 / ARIA 关联。

- 标签常驻在输入框上方，**不用浮动标签**
- 失焦校验（`onBlur`），不是输入时实时报错
- 错误：边框 `--danger` + 下方 `--text-small` 文字，150ms 颜色过渡，**绝不抖动**
- 自动串联 `aria-invalid` 与 `aria-describedby`

### `Dialog` `'use client'`

Radix Dialog 封装。焦点陷阱、`Esc` 关闭、焦点归还、`aria-modal` 全部由 Radix 提供。

---

## 3. 记忆点动效组件（`components/motion/`）

每个组件对应一个页面的唯一记忆点。详细规格见 [`02-MOTION.md`](02-MOTION.md)。

| 组件 | 页面 | 客户端 | 实现要点 |
| :--- | :--- | :--- | :--- |
| `Develop` | `/` | ✓ | `mask-image` 位置动画，1100ms（移动端 850ms）。`sessionStorage` 记录，同会话不重播 |
| `YearScroll` | `/about` | ✗ | 纯 CSS `animation-timeline: view()`。移动端时间轴改纵向 |
| `Divergence` | `/tracks` | ✗ | SVG `stroke-dashoffset`，700ms，五条同时。**移动端为纵向重构版**，不是缩小的桌面版 |
| `DrawPath` | `/tracks/[slug]` | 条件 | 优先 CSS 滚动时间线；不支持时降级到 Motion 的 `useScroll`。移动端路径改纵向 |
| `SpotlightCard` | `/works` | ✓ | `pointermove` + `rAF` 只更新 `--mx`/`--my`。**`@media (hover: none)` 下不注册监听**，改走 `IntersectionObserver` 一次性显色 |
| `CompareSlider` | `/works/[slug]` | ✓ | `clip-path: inset(0 0 0 var(--split))`；拖动经 `rAF` 节流。`role="slider"` + 方向键 5% 步进；`touch-action: pan-y`；**只有一张图时不渲染，退化为静态图** |
| `CertDrawer` | `/awards` | ✓ | View Transitions API 共享元素；**必须显式判断 `prefers-reduced-motion`** |
| `Stamp` | `/join` | ✓ | 180ms 弹簧（移动端 140ms），一次性；配 `role="status"` 播报 |

**所有动效组件的强制契约**：

```ts
// 每个动效组件都必须：
// 1. 读取 prefers-reduced-motion，并有明确的降级终态
// 2. 在 useEffect 的 cleanup 里移除所有监听器、observer、定时器
// 3. 只动 transform / opacity / clip-path / mask-image
// 4. will-change 在动画开始前加、结束后立即移除
// 5. 触屏设备有等价交互（无 hover 依赖）
```

---

## 4. 区块组件（`components/sections/`）

按页面归类。命名 `<页面><序号><语义>Section`。

### `/`

| 组件 | 内容 |
| :--- | :--- |
| `HomeHero` | 大标题（`Develop` 包裹）+ 副标题 + 双 CTA + 滚动指示器 |
| `HomeStats` | 四个数字。**不做 count-up**，只有单位标签 60ms 交错 |
| `HomeTracks` | 五条方向横排（五行，非网格）。hover 时其余四行降到 40% |
| `HomeFeature` | 单个项目全宽展示（智教结合虚拟化平台） |
| `HomeCta` | 结尾 CTA |

### `/about`

`AboutHero` · `AboutOrigin` · `AboutTimeline`（`YearScroll`）· `AboutLadder` · `AboutMechanism` · `AboutMentorship` · `AboutAdvisor` · `AboutCulture`

### `/tracks`

`TracksHero`（含 `Divergence`）· `TracksGrid` · `TracksStackFooter`

### `/tracks/[slug]`

`TrackHeader` · `TrackStack` · `TrackRoadmap`（`DrawPath`）· `TrackRelated` · `TrackPager` · `TrackCta`

`TrackRoadmap` 的数据是 4 段（大一 / 大二 / 大三就业 / 大三考研），SVG 路径在第三个节点处分叉。两条支线在视觉上**必须等权**——等长、等粗、同时绘出、同样的节点样式。任何暗示主次的处理都是错的。

### `/works`

`WorksHero` · `WorksLive`（`SpotlightCard`）· `WorksIncubating` · `WorksCta`

`WorksLive` 的卡片内容层级：项目名 → 一句话 → **技术细节** → 技术栈标签 → 链接。技术细节放在标签之前——`Vue 3 · TypeScript` 谁都能贴，"用 Bareiss 消元抑制中间分数膨胀"才说明水平。

### `/works/[slug]`

`WorkHeader` · `WorkCompare`（`CompareSlider`）· `WorkProblem` · `WorkBuild` · `WorkEvidence` · `WorkLimits` · `WorkRelated` · `WorkPager` · `WorkCta`

- `WorkEvidence`：质量证据表。数字用 `--font-mono` + `tabular-nums`，**不做 count-up**
- `WorkLimits`：项目边界。**这个组件不允许返回 `null`** —— `detail.limits` 在 schema 里是必填的，一个只写优点的项目页在构建时就该失败
- `WorkCompare`：`detail.shots.light` 缺失时渲染静态 `<Image>`，不渲染滑块

### `/awards`

`AwardsHero` · `AwardsTable`（`DataTable`）· `AwardsArchive`（`CertDrawer`）

`AwardsTable` 在 `<640px` 时必须转为堆叠条目，**不做横向滚动表格**（见 [`09-MOBILE.md`](09-MOBILE.md) §6.2）。

### `/join`

`JoinHero` · `JoinCriteria` · `JoinProcess` · `JoinVoices` · `JoinFaq` · `JoinForm`（`Stamp`）· `JoinChannels`

---

## 5. 空状态契约

内容缺失时，区块组件返回 `null`，整块不渲染。

```tsx
export function AboutTimeline() {
  // 少于 6 条节点时时间轴不成立 —— 整块不上，不用占位数据凑
  if (timeline.length < 6) return null
  return <section>…</section>
}
```

**不允许**：占位文案、"敬请期待"、灰色骨架块、编造条目。

---

## 6. 组件审查清单

新增或修改任何组件时逐条过：

- [ ] 是否必须是客户端组件？能做成 RSC 就做成 RSC
- [ ] 有没有裸十六进制色值？（超过 0 个即违规）
- [ ] 这一屏 `--accent` 出现几次？>2 就砍
- [ ] 中文文本 `line-height` ≥1.7（正文）/ ≥1.35（标题）？
- [ ] 中文有没有被施加负 `letter-spacing`？有就删
- [ ] 全大写有没有 `0.1em` 字距？
- [ ] 新加的动画会不会成为这一页的第二个记忆点？
- [ ] 动画有 `prefers-reduced-motion` 分支吗？
- [ ] 卡片 hover 是不是又写成了 `translateY`？改成边框变化
- [ ] 交互元素 ≥44×44px、有可见焦点环、可键盘操作？
- [ ] `:hover` 样式是否包在 `@media (hover: hover) and (pointer: fine)` 里？
- [ ] 触屏设备上有 `:active` 按下反馈吗？（没有 hover 预告时，它是唯一的"我收到了"信号）
- [ ] 这个组件在 320px 宽下会溢出吗？
- [ ] `useEffect` 的 cleanup 清干净了吗？
- [ ] 文案是不是从 `content/` 来的？组件里有硬编码字符串吗？
- [ ] 数字有 `tabular-nums` 吗？

---

**下一步** → [`07-ROADMAP.md`](07-ROADMAP.md)
