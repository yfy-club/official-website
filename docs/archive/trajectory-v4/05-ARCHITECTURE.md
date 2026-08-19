# 05 · 技术架构

> Next.js 15 · React 19 · TypeScript strict · Tailwind CSS v4 · Motion

---

## 1. 技术选型与理由

| 层 | 选择 | 理由 | 拒绝的备选 |
| :--- | :--- | :--- | :--- |
| 框架 | **Next.js 15**（App Router） | 静态导出与服务端能力可共存；`next/font` 自托管字体消 CLS；`next/image` 自动 AVIF；View Transitions 与 React 19 配合良好；生态与文档质量最适合学生团队长期维护 | Nuxt（Vue 动效组件生态明显更窄）；Astro（跨页交互一致性需额外设计） |
| UI | **React 19** | Server Components 让内容页零客户端 JS；动效组件生态最丰富 | — |
| 样式 | **Tailwind CSS v4** + CSS 变量 | v4 的 CSS-first 配置（`@theme`）让 Design Token 就是 CSS 变量，无需 JS 配置层；原子类让换届接手者不必理解一套自定义 CSS 架构 | 手写 CSS（旧版方案，交接成本高）；CSS-in-JS（RSC 下水土不服） |
| 动效 | **Motion**（framer-motion 12） | 声明式、弹簧参数可显式指定、`useScroll` 作为 CSS 滚动驱动动画的兜底 | GSAP（+50KB 换不来任何本项目需要的能力） |
| 滚动动效 | **原生 CSS 滚动驱动动画** | `animation-timeline: view()` 零 JS、主线程无关、天然流畅 | Lenis / Locomotive（破坏原生滚动、干扰 CSS 滚动时间线） |
| 无障碍原语 | **Radix UI**（经 shadcn/ui 引入） | Dialog / Popover / Accordion 的焦点陷阱、`aria-*`、键盘交互免费拿到，且样式完全自控 | 自己写 Dialog（焦点管理极易出错） |
| 表单 | **React Hook Form** + **Zod** | 非受控优先，重渲染少；Zod schema 前后端共用一份 | Formik（维护活跃度下降） |
| 内容 | **TypeScript 模块 + Zod 校验** | 类型安全、改内容零构建配置、schema 校验失败时报错信息对非前端友好 | MDX（社团内容是结构化数据不是文章）；Contentlayer（已停止维护）；Headless CMS（学生团队无人维护后台） |
| 主题 | **next-themes** | 无 FOUC、系统跟随、`localStorage` 持久化，成熟方案 | 手写（旧版方案，内联脚本容易漏边界情况） |
| 反机器人 | **Cloudflare Turnstile** | 免费、无验证码交互、隐私友好 | reCAPTCHA（国内不可用） |
| 图标 | **Lucide React** | 单色、1.5–2px 描边、`currentColor`，符合设计系统禁用 emoji 图标的要求 | — |

### 明确不引入

`gsap` · `lenis` · `three` / `@react-three/fiber` · `swiper` · `aos` · `lottie` · 任何 UI 组件库的完整样式包（Chakra / MUI / Ant Design）

---

## 2. 目录结构

```
yfy/
├── docs/                        # 本套设计与需求文档
├── design/
│   └── tokens.css               # Design Token 单一真源
├── public/
│   ├── fonts/                   # 自托管字体（含中文子集）
│   ├── images/
│   │   ├── logo/                # 沿用现有 SVG/PNG
│   │   ├── certs/               # 5 张证书图
│   │   ├── posters/             # 招新海报
│   │   ├── qr/                  # QQ 群二维码 SVG
│   │   ├── tracks/              # 🔴 五方向配图
│   │   └── works/               # 🔴 项目截图
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根布局：字体、主题、导航、页脚、航迹轨
│   │   ├── page.tsx             # /
│   │   ├── globals.css          # @import tokens.css + @theme + 基础样式
│   │   ├── about/page.tsx
│   │   ├── tracks/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx  # generateStaticParams → 5 页
│   │   ├── works/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx  # generateStaticParams → 有详情内容的项目
│   │   ├── awards/page.tsx
│   │   ├── join/page.tsx
│   │   ├── api/join/route.ts    # 报名表 Route Handler
│   │   ├── opengraph-image.tsx  # 动态社交卡片
│   │   ├── sitemap.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/              # SiteHeader / SiteFooter / TrajectoryRail / ThemeToggle
│   │   ├── ui/                  # Button / Card / Dialog / Input / Table / Tag
│   │   ├── motion/              # Develop / DrawPath / Spotlight / Stamp …（记忆点动效）
│   │   └── sections/            # 各页区块组件
│   ├── content/
│   │   ├── schema.ts            # 全部 Zod schema
│   │   ├── club.ts              # 社团基本信息
│   │   ├── tracks.ts            # 五大方向
│   │   ├── works.ts             # 项目
│   │   ├── awards.ts            # 竞赛 + 证书
│   │   ├── timeline.ts          # 编年史
│   │   ├── faq.ts               # 招新 FAQ
│   │   └── index.ts             # 统一导出 + 启动时校验
│   ├── lib/
│   │   ├── motion.ts            # 弹簧与时长常量
│   │   ├── seo.ts               # metadata 工厂 + JSON-LD
│   │   └── utils.ts             # cn() 等
│   └── types/
├── tests/
│   ├── e2e/                     # Playwright：关键路径 + axe 扫描
│   └── unit/                    # Vitest：content schema 校验
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 数据层

### 3.1 内容即代码，但受 Schema 约束

所有内容是带类型的 TS 模块，构建时被 Zod 校验。改内容不需要碰组件，写错了会得到人话报错。

```ts
// src/content/schema.ts
import { z } from 'zod'

/** 路线图的一段。大三分成两段，因此一条方向共 4 段 */
const stageSchema = z.object({
  label: z.string(),                          // "大一 · 打基础"
  items: z.array(z.string()).min(3).max(5),
})

export const trackSchema = z.object({
  slug: z.enum(['ai', 'software', 'database', 'cloud-iot', 'industrial']),
  index: z.string().regex(/^0[1-5]$/),          // "01" … "05"
  nameZh: z.string().min(2),
  nameEn: z.string().min(2),
  tagline: z.string().min(10).max(40),           // 首页一行预览
  positioning: z.string().min(30),               // 方向定位
  stack: z.object({
    languages: z.array(z.string()).min(1),
    frameworks: z.array(z.string()).min(1),
    engineering: z.array(z.string()).min(1),
  }),
  // 航迹：大一 → 大二 → 大三分流为就业 / 考研
  roadmap: z.object({
    freshman: stageSchema,
    sophomore: stageSchema,
    junior: z.object({
      employment: stageSchema,   // 就业方向：出去实习
      postgrad: stageSchema,     // 考研方向：备战 + 竞赛 + 深度学习科研
    }),
  }),
  goal: z.string(),                               // 成长目标职位
  relatedWorkSlugs: z.array(z.string()).default([]),
  relatedAwardIds: z.array(z.string()).default([]),
})

export const workSchema = z.object({
  slug: z.string(),
  nameZh: z.string(),
  nameEn: z.string().optional(),
  status: z.enum(['已上线', '在研', '已结项']),
  tagline: z.string().min(10),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  period: z.string().optional(),                  // "2026-01 — 2026-07"
  trackSlugs: z.array(z.string()).default([]),
  // 以下字段齐备时才生成 /works/[slug] 详情页；缺失则只在列表页做卡片
  detail: z.object({
    problem: z.array(z.string()).min(2),          // ③ 它解决什么
    stack: z.record(z.string(), z.array(z.string())), // ④ 分层技术栈
    decisions: z.array(z.object({                 // ④ 关键工程决策 + 为什么
      what: z.string(),
      why: z.string(),
    })).min(3),
    evidence: z.array(z.object({                  // ⑤ 质量证据
      label: z.string(),
      value: z.string(),
    })).min(2),
    limits: z.array(z.string()).min(2),           // ⑥ 边界，必填。只写优点的页面不给过
    shots: z.object({                             // ② 对照滑块；只有 dark 时退化为静态图
      dark: z.string(),
      light: z.string().optional(),
      alt: z.string(),
    }).optional(),
  }).optional(),
})

export const awardSchema = z.object({
  id: z.string(),
  competition: z.string(),
  level: z.enum(['国家级', '省级', '校级']),
  result: z.string(),
  year: z.string().regex(/^\d{4}$/),
  image: z.string().startsWith('/images/certs/').optional(),
  description: z.string().optional(),
  trackSlugs: z.array(z.string()).default([]),
})

// timeline / faq / club 同理
```

**`detail.limits` 是必填的**（`.min(2)`）。这是用 schema 强制执行内容真实性红线——一个只写优点的项目页在构建时就通不过。

```ts
// src/content/index.ts —— 构建时校验，失败即中断构建
import { trackSchema, awardSchema /* … */ } from './schema'
import { tracksRaw } from './tracks'
import { awardsRaw } from './awards'

export const tracks = trackSchema.array().parse(tracksRaw)
export const awards = awardSchema.array().parse(awardsRaw)
```

**为什么不用 CMS**：36 人的社团、每年换届、零预算。一个需要有人维护后台账号和数据库的 CMS，两届之后一定会烂尾。Git 里的 TS 文件永远不会。

### 3.2 内容缺口的处理方式

Schema 里**不给缺口字段设默认占位值**。数据缺失时，对应组件返回 `null`，整个区块不渲染。

> 宁可少一个模块，也不上假内容。

---

## 4. 渲染策略

| 路由 | 策略 | 说明 |
| :--- | :--- | :--- |
| `/` `/about` `/tracks` `/works` `/awards` `/join` | 静态（默认） | 全部内容来自构建时的 TS 模块 |
| `/tracks/[slug]` | `generateStaticParams` → 5 个静态页 | |
| `/works/[slug]` | `generateStaticParams` → 仅 `detail` 字段齐备的项目 | 内容撑不住的项目不生成页面，列表页也不给链接 |
| `/api/join` | Route Handler（动态） | 唯一的服务端逻辑 |
| `/opengraph-image` | 构建时生成 | 每条路由一张 |

**服务端组件优先**：所有内容展示组件都是 RSC，零客户端 JS。只有以下组件带 `'use client'`：

`ThemeToggle` · `SiteHeader`（滚动响应）· `MobileNav` · `CertDialog` · `JoinForm` · `SpotlightCard` · `CompareSlider` · `DrawPath`（滚动兜底分支）

---

## 5. 报名表单

### 5.1 流程

```
客户端                          服务端 (/api/join)              投递
─────────                      ──────────────────             ─────
RHF + Zod 前端校验
        ↓
Turnstile token
        ↓
POST /api/join ──────────────→ 1. 蜜罐字段检查（非空即丢弃）
                               2. 速率限制（同 IP 10 分钟 3 次）
                               3. Turnstile 服务端 siteverify
                               4. Zod 复校验（永不信任客户端）
                               5. 投递 ──────────────────────→ 邮件 / 群机器人
        ↓                      6. 返回 { ok: true }
盖章动效 + aria-live 播报
```

### 5.2 关键决策

- **Zod schema 前后端共用一份**（`src/content/schema.ts` 导出 `joinFormSchema`），杜绝校验规则漂移
- **所有密钥只存在于服务端环境变量**。旧版的 EmailJS 公钥暴露在客户端产物中，任何人都能拿去发信——这是必须修掉的问题
- **蜜罐字段**：一个 `aria-hidden` + `tabindex="-1"` 的隐藏输入，人类填不到，机器人会填
- **速率限制**：无状态部署下用平台 KV（Cloudflare KV / Vercel KV）；无 KV 时退化为内存 Map + Turnstile 兜底
- **投递渠道待定** 🟡：邮件（Resend 免费额度 3000 封/月）或 QQ/飞书群机器人 Webhook。建议**两者都发**——群机器人保证负责人立刻看到，邮件保证有存档

### 5.3 环境变量

```bash
# .env.example
TURNSTILE_SECRET_KEY=            # 服务端校验
NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # 客户端组件（公开值，设计如此）
JOIN_WEBHOOK_URL=                # 群机器人
RESEND_API_KEY=                  # 邮件投递
JOIN_NOTIFY_EMAIL=               # 收件人
NEXT_PUBLIC_SITE_URL=            # 绝对 URL（OG 图、sitemap、canonical）
NEXT_PUBLIC_ANALYTICS_ID=        # 可选
```

---

## 6. 样式架构

### 6.1 三层

```
design/tokens.css        ← 唯一真源：: root / [data-theme] 下的 CSS 变量
        ↓
src/app/globals.css      ← @import tokens + Tailwind @theme 映射 + 基础排版
        ↓
组件内 Tailwind 原子类     ← 只用映射后的语义类名
```

```css
/* globals.css */
@import "tailwindcss";
@import "../../design/tokens.css";

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-accent: var(--accent);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: 4px;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
}
```

结果：组件里写 `text-fg-muted` `bg-surface` `font-display`，而不是 `text-[#8B94A3]`。

### 6.2 硬规则

- 组件内**不得**出现裸十六进制色值
- 主题切换通过 `<html data-theme="dark|light">` 切换整套变量，组件对主题**完全无感知**
- 不写 `dark:` 变体类（那会让每个颜色写两遍，且违反"组件对主题无感知"）

---

## 7. 字体加载

```ts
// src/app/layout.tsx
import localFont from 'next/font/local'

const display = localFont({
  src: '../../public/fonts/InstrumentSerif-Regular.woff2',
  variable: '--font-display-latin',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',   // 消除切换时的 CLS
})

const sans = localFont({
  src: [
    { path: '../../public/fonts/Geist-Regular.woff2',  weight: '400' },
    { path: '../../public/fonts/Geist-Medium.woff2',   weight: '500' },
    { path: '../../public/fonts/Geist-SemiBold.woff2', weight: '600' },
  ],
  variable: '--font-sans-latin',
  display: 'swap',
  adjustFontFallback: 'Arial',
})
```

**中文字体策略**（本项目最大的性能杠杆）：

1. **正文中文零下载** —— 走系统栈 `PingFang SC` / `Microsoft YaHei` / `Noto Sans SC`，覆盖 >95% 目标用户
2. **仅标题衬线中文子集化** —— `Noto Serif SC 600`，用 `pyftsubset` 只保留标题里实际出现的约 300 个字形

```bash
pyftsubset NotoSerifSC-SemiBold.otf \
  --text-file=scripts/heading-glyphs.txt \
  --flavor=woff2 --layout-features='' \
  --output-file=public/fonts/NotoSerifSC-Heading-subset.woff2
# 产物预期 < 40KB（完整字体约 9MB）
```

3. `scripts/extract-heading-glyphs.ts` 从 `src/content/**` 扫出所有会用衬线渲染的中文字符，生成 `heading-glyphs.txt`。**内容改了要重跑子集化**——写进 `README` 的维护说明

---

## 8. 部署

代码对平台无关，`next build` 产物三家都能跑。

| 平台 | 命令 / 适配 | 适用 |
| :--- | :--- | :--- |
| **Vercel** | 零配置 | 开发期默认。预览部署最顺手 |
| **Cloudflare Workers** | `@opennextjs/cloudflare` + `wrangler deploy` | 国内访问较稳；KV 可直接做表单速率限制 |
| **EdgeOne Pages** | Node.js 运行时预设 | 国内加速最佳 |

**推荐**：开发期 Vercel 预览 → 正式站 Cloudflare 或 EdgeOne（面向国内校园网用户）。

**平台无关性守则**：

- 不使用 `@vercel/*` 专有运行时 API（`next/og` 除外，它是 Next.js 内置）
- 速率限制的存储层抽象成 `lib/rate-limit.ts` 接口，KV 实现可替换
- 不依赖任何平台专有的 Edge Config / Middleware 特性

### 8.1 CI

```
GitHub Actions:
  push / PR →
    1. tsc --noEmit          类型检查
    2. eslint                代码规范
    3. vitest run            content schema 校验（内容写错会在这里被拦下）
    4. next build            构建
    5. playwright test       关键路径 e2e + axe 无障碍扫描
    6. lhci autorun          Lighthouse CI，性能 <90 或无障碍 <100 即失败
```

---

## 9. 从旧版迁移

| 资产 | 处理 |
| :--- | :--- |
| `public/images/**` | 直接复制。证书图需转 AVIF/WebP 并生成多尺寸 |
| `content/certs.json` | 转为 `src/content/awards.ts`，补 `trackSlugs` 关联 |
| `public/docs/云飞扬资料.md` | 拆解为 `club.ts` / `tracks.ts` / `awards.ts` / `works.ts`（见 [`04-CONTENT.md`](04-CONTENT.md)）。**注意两处需要改写**：大三梯队职责改为"就业 / 考研分流"；"面向智慧城市的云上多功能路灯"改写为「智光耀城智慧路灯综合管理平台」 |
| `app/assets/css/main.css` 的配色 | 亮色暖纸完整继承；暗色调整为新 token |
| `TheFooter.vue` 的 Blueprint 彩蛋 | 保留，用 React 重写 |
| `TheNav.vue` 的悬浮胶囊 | 保留形态，重写为 RSC + 客户端滚动响应 |
| `useScrollReveal.ts` | **弃用**。改为原生 CSS 滚动驱动动画，且大幅减少揭示动画的使用量 |
| `CertificateWall.vue` 跑马灯 | **弃用**。见 [`02-MOTION.md`](02-MOTION.md) §3.8 |
| `JoinForm.vue` 的 EmailJS 直发 | **弃用**。改服务端 Route Handler |
| GA4 集成 | 保留（或换 Vercel Analytics / Umami） |
| JSON-LD 结构化数据 | 保留并扩展（`Organization` + 每页 `BreadcrumbList`） |
| GitHub Pages 的 `baseURL` 子路径 | 移除。新站用根路径部署 |

---

**下一步** → [`06-COMPONENTS.md`](06-COMPONENTS.md)
