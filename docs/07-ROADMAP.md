# 07 · 实施路线图

> 五个里程碑。每个里程碑结束时站点都是可部署、可演示的状态。

---

## M0 · 地基（约 1 天）

**目标**：仓库能跑起来，Design Token 就位，主题切换无闪烁。

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --use-npm
npm i motion next-themes zod react-hook-form @hookform/resolvers lucide-react
npm i @radix-ui/react-dialog @radix-ui/react-accordion @radix-ui/react-slot
npm i -D vitest @playwright/test @axe-core/playwright @lhci/cli
```

- [ ] 初始化 Next.js 15，TypeScript `strict: true`
- [ ] `design/tokens.css` 接入 `globals.css`，Tailwind v4 `@theme inline` 映射
- [ ] 字体自托管：Instrument Serif / Geist Sans / Geist Mono（`next/font/local` + `adjustFontFallback`）
- [ ] `next-themes` 接入，验证首屏无 FOUC
- [ ] `content/schema.ts` 写完全部 Zod schema；`content/index.ts` 做构建时校验
- [ ] 从旧仓库迁移 `public/images/**`
- [ ] GitHub Actions：`tsc` + `eslint` + `vitest` + `next build`

**验收**：一个只有 `<h1>` 的页面，明暗两个主题都正确，字体正确，无 CLS。

---

## M1 · 骨架与内容（约 3 天）

**目标**：六条路由全部可访问，内容真实（已有的部分），无动效。

- [ ] `SiteHeader` / `SiteFooter` / 布局
- [ ] `Button` / `Card` / `Tag` / `DataTable` / `Field` / `Dialog`
- [ ] 六条路由的静态页面 + `/tracks/[slug]` 五页 + `/works/[slug]`（矩阵计算器、智光耀城）
- [ ] 内容录入：`club.ts` `tracks.ts` `awards.ts` `works.ts`（见 [`04-CONTENT.md`](04-CONTENT.md)）
      —— 矩阵计算器与智光耀城的资料齐全，可直接录入，只缺截图
- [ ] SEO：每页 `metadata`、`sitemap.ts`、`robots.txt`、`Organization` JSON-LD
- [ ] **移动端布局全部就位**（见 [`09-MOBILE.md`](09-MOBILE.md) §6）：移动端航迹条、汉堡全屏面板、`/awards` 表格转堆叠条目、`/join` 二维码三级降级、Hero 用 `100svh`
- [ ] 响应式：六档断点全部验过（320 / 390 / 640 / 1024 / 1280 / 1920）

> **⚠️ 本阶段最重要的一件事不是写代码**：把 [`04-CONTENT.md`](04-CONTENT.md) §11 的缺口清单派给内容负责人，设明确截止日。C-01（五方向路线图）与 C-04（编年史）分别阻塞两个页面的记忆点动效，到期拿不到就要改设计——越早知道越好。

**验收**：站点可部署、可读、内容真实，只是"不会动"。这个状态本身就应该是体面的。

---

## M2 · 动效（约 3 天）

**目标**：八个记忆点全部就位，微反馈统一。

按优先级实现（任何一个做不完，退化为静态出现即可，不阻塞发布）：

1. [ ] 全站微反馈（按钮 80ms 按下、卡片边框 hover、焦点环、表单 150ms）
2. [ ] `TrajectoryRail` —— CSS 滚动驱动，零 JS
3. [ ] `Develop` —— 首页标题显影
4. [ ] `Divergence` —— 五线分流
5. [ ] `CertDrawer` —— View Transitions 共享元素
6. [ ] `CompareSlider` —— 明暗截图对照（含键盘等价与 `touch-action: pan-y`）
7. [ ] `SpotlightCard` —— 底片聚光（+ 触屏等价物）
8. [ ] `DrawPath` —— 路线图绘制**并在大三处分岔**（依赖 C-01）
9. [ ] `YearScroll` —— 编年史（依赖 C-04）
10. [ ] 跨路由 View Transitions
11. [ ] 三个反预期细节：老师卡背景视差 / 二维码取景框 / 数字不滚动

- [ ] 逐项验证 `prefers-reduced-motion` 降级
- [ ] **移动端动效清算**（见 [`09-MOBILE.md`](09-MOBILE.md) §4–§5）：hover 效果全部包进 `@media (hover: hover)`；`/tracks` 分流动画纵向重构；`/works` 聚光换为进入视口显色且在触屏下**不注册** `pointermove`；各记忆点时长缩短 20–30%
- [ ] 中端安卓实机测帧率（目标 ≥50fps）

**验收**：对照 [`02-MOTION.md`](02-MOTION.md) §7 检查清单逐条过。**同屏并发动画 ≤2 个**这条要实测，不是靠感觉。

---

## M3 · 表单与服务端（约 2 天）

- [ ] `POST /api/join` Route Handler
- [ ] Zod schema 前后端共用
- [ ] Turnstile 客户端组件 + 服务端 `siteverify`
- [ ] 蜜罐字段
- [ ] 速率限制（`lib/rate-limit.ts` 抽象接口 + KV 实现）
- [ ] 投递渠道 🟡（建议群机器人 + 邮件双发）
- [ ] `Stamp` 成功动效 + `aria-live` 播报
- [ ] 全链路测试：正常提交 / 校验失败 / 机器人 / 限流 / 服务端异常

**验收**：构建产物中搜不到任何密钥；机器人提交被拦；失败态有明确文案且可重试。

---

## M4 · 打磨与上线（约 2 天）

- [ ] 无障碍：axe 全站扫描零 serious/critical；纯键盘走完全部关键路径；屏幕阅读器抽查
- [ ] **移动端实机测试矩阵**（见 [`09-MOBILE.md`](09-MOBILE.md) §11）：iPhone Safari / 微信 / QQ 内置，安卓 Chrome / 微信，375px 窄屏，横屏，系统大字号，减弱动态效果
- [ ] 性能：Lighthouse 移动端全页 ≥90；移动端首屏 JS ≤120KB gzip
- [ ] 中文字体子集化（`scripts/extract-heading-glyphs.ts` + `pyftsubset`），产物 <40KB
- [ ] 图片：全部转 AVIF/WebP + 多尺寸 `srcset`
- [ ] `next/og` 动态社交卡片
- [ ] 内容终审：无占位文案、无编造数据、无外部占位图 CDN
- [ ] 部署 🟡（Cloudflare 或 EdgeOne，面向国内校园网）
- [ ] `README` + `CONTRIBUTING`：让换届接手者能独立更新内容

**验收**：[`00-PRD.md`](00-PRD.md) §9 的 Definition of Done 逐页打勾。

---

## 关键路径与依赖

```
M0 地基
  └─→ M1 骨架与内容 ──┬─→ M2 动效 ──┐
                     │              ├─→ M4 打磨上线
                     └─→ M3 表单 ───┘

内容缺口（M1 就派出去）
  C-01 五方向路线图 ─────→ 阻塞 M2.7（/tracks/[slug] 记忆点）
  C-04 编年史节点   ─────→ 阻塞 M2.8（/about 记忆点）
  C-02 项目截图     ─────→ 阻塞 M2.6（/works 底片效果的意义）
  其余缺口          ─────→ 阻塞对应区块，但可整块不上线
```

**总计约 11 个工作日**（单人全职估算）。学生团队按碎片时间推进，建议排 4–6 周，且**内容征集与开发并行**。

---

## 阶段性可交付

| 里程碑 | 交付物 | 可以拿去做什么 |
| :--- | :--- | :--- |
| M0 | 可运行的地基 | 验证技术选型 |
| M1 | 静态站点 | **已经可以上线**。内容真实、排版体面，只是不会动 |
| M2 | 完整动效 | 可作为社团技术门面对外展示 |
| M3 | 可收报名 | 招新季可用 |
| M4 | 正式版 | 评优、答辩、企业合作 |

> **M1 就能上线**是刻意的设计。动效是加分项，不是及格线。如果招新季提前到来，M1 的静态版本足以支撑，不必等到 M4。

---

## 风险与预案

| 风险 | 触发信号 | 预案 |
| :--- | :--- | :--- |
| 内容缺口到期未交 | M1 结束时 C-01/C-04 仍为空 | 对应页面的记忆点动效换成简单的入场揭示；`/about` 时间轴改为静态"重要节点"列表 |
| 动效实现超期 | M2 过半只完成 3 项 | 按 M2 的优先级顺序砍尾部；微反馈（第 1 项）绝不能砍 |
| View Transitions 兼容性问题 | 目标浏览器不支持 | 降级为普通 Dialog + 淡入，功能完全不受影响 |
| CSS 滚动驱动动画兼容性 | 目标浏览器不支持 | 已按渐进增强设计，静态终态即可用；`DrawPath` 有 Motion `useScroll` 兜底分支 |
| 中文字体子集化流程没人会维护 | 换届后无人重跑脚本 | 把命令写进 `package.json` 的 `content:fonts` 脚本 + CI 检查子集覆盖率 |

---

**下一步** → [`08-QUALITY.md`](08-QUALITY.md)
