# 云飞扬社团官网 · 重构版（YFY v4）

> 代号 **Trajectory / 航迹**
> 从"一页到底的情绪落地页"重构为"多页面、有叙事、动效克制而精准"的社团站点。

当前状态：M0–M4 的代码与自动质量门禁已完成。部署平台仍待定；iPhone、安卓、微信、QQ 与 NVDA 的真机抽查必须在正式上线前人工执行。

---

## 这是什么

本目录是 **重构版的设计、需求与实现仓库**。产品文档是实现与验收的单一依据，代码、内容、图片处理流程和质量门禁均保存在本仓库内。

旧版仓库：`G:\Code\Other\yunfeiyang-official-site`（Nuxt 4 + 原生 CSS，单页）
重构版技术栈：**Next.js 15 + React 19 + Tailwind CSS v4 + Motion**

---

## 文档索引

| 文档 | 内容 | 读者 |
| :--- | :--- | :--- |
| [`docs/00-PRD.md`](docs/00-PRD.md) | 产品需求：目标、用户、成功指标、功能清单、验收标准 | 全员 |
| [`docs/01-DESIGN.md`](docs/01-DESIGN.md) | 设计系统：概念、配色、字体、组件、栅格、明暗双主题 | 设计 / 前端 |
| [`docs/02-MOTION.md`](docs/02-MOTION.md) | 动效规范：动效预算、七个"记忆点动效"、降级策略 | 前端 |
| [`docs/03-IA-ROUTES.md`](docs/03-IA-ROUTES.md) | 信息架构：站点地图、路由表、每页职责与逐屏结构 | 全员 |
| [`docs/04-CONTENT.md`](docs/04-CONTENT.md) | 内容模型与文案：数据 Schema、真实素材、缺口清单 | 内容 / 前端 |
| [`docs/05-ARCHITECTURE.md`](docs/05-ARCHITECTURE.md) | 技术架构：目录结构、依赖决策、数据层、表单、部署 | 前端 |
| [`docs/06-COMPONENTS.md`](docs/06-COMPONENTS.md) | 组件清单与 API 契约 | 前端 |
| [`docs/07-ROADMAP.md`](docs/07-ROADMAP.md) | 实施路线图：五个里程碑与任务拆解 | 全员 |
| [`docs/08-QUALITY.md`](docs/08-QUALITY.md) | 质量基线：可访问性、性能预算、SEO、浏览器支持 | 前端 |
| [`docs/09-MOBILE.md`](docs/09-MOBILE.md) | **移动端适配**：断点、触屏等价物、微信/QQ 内置浏览器、测试矩阵 | 设计 / 前端 |
| [`design/tokens.css`](design/tokens.css) | 可直接复制进项目的 Design Token 文件 | 前端 |

**建议阅读顺序**：`00 → 03 → 01 → 02 → 09 → 05`。

---

## 一句话概括设计

> 一个 **看起来像设计年鉴、动起来像精密仪器** 的学生技术社团站点。

三条不可妥协的原则：

1. **静止是默认状态。** 每个页面只有 **一个** 记忆点动效，其余全部是 ≤200ms 的微反馈。同屏并发动画 ≤2 个，全站循环动画 ≤1 个。
2. **强调色是稀缺资源。** 每屏最多出现 **2 次** `--accent`。没有第二强调色。
3. **动效必须有语义。** 它确认一个已经发生的状态变化，而不是表演一个状态变化。

外加一条前提：**移动端是主场，不是"小屏版本"。** 招新入口是二维码与海报，扫码进来的几乎全是手机，且很大比例在微信/QQ 内置浏览器里。任何"桌面好看、手机凑合"的设计都算失败。详见 [`docs/09-MOBILE.md`](docs/09-MOBILE.md)。

---

## 设计概念：航迹

社团的本质是一条**会分岔的爬升曲线**——大一打基础，大二攻技术，到大三路分成两条：一条走出去实习，一条留下来备战考研、继续打比赛做科研。这条曲线就是全站的视觉与叙事主线：

```
                              ╱──── 大三 · 就业   出去实习，把积累放进真实工程
                            ╱
      ╱─── 大二 · 攻技术 ──●  ← 分流点
    ╱                       ╲
  ╱                          ╲──── 大三 · 考研   备战 + 竞赛 + 深度学习科研
╱─── 大一 · 打基础
2014 ──────────────────────────────────────────────→ 现在
```

**分岔比爬升更重要。** 大多数社团网站会把大三写成"带团队、当项目负责人"，但云飞扬从大一就是师徒制、传帮带贯穿三年——传帮带是全员机制，不是某个年级的职责。大三真正发生的事是**做选择**，站点应该如实呈现这一点，并且对两条路都拿得出东西。

它在界面上的物理形态是 **左侧一条带刻度的细轨（Trajectory Rail）**：既是装饰，也是滚动进度条，也是章节导航。这是全站唯一被允许存在的装饰性图形——它同时干了三件正事，因此不算装饰。

---

## 与旧版的关系

**保留**（旧版做对了的）：

- 明亮模式的暖纸质感（`#FBFBF9` + 陶土色）——比绝大多数技术社团站点更有品味
- 衬线体承担大标题的编辑感 —— 一个技术社团长得像设计刊物，这本身就是差异化
- `We Code the Future` 的口号与非对称大字排版
- 双主题 + 持久化、Scroll Reveal、SEO / JSON-LD 结构化数据、无障碍降级意识

**推翻**：

- 单页塞下全部内容 → 拆成 6 条路由，每页一个叙事职责、一套动效语言
- 明暗两套模式换字体（暗色 Space Grotesk / 亮色 Merriweather）→ 字体是品牌身份，不随主题变
- 证书跑马灯 → 改为可点开的档案卡 + 共享元素过渡（跑马灯是"看起来在动"，不是"设计"）
- EmailJS 客户端直发 → 服务端 Route Handler + Turnstile 反机器人
- 原生 CSS 手写全部样式 → Design Token + Tailwind v4，可维护、可交接给学弟学妹

---

## 快速开始

要求 Node.js 22 与 npm。只有重新生成中文标题字体时才需要 Python 3、FontTools 和 Brotli。

```bash
npm ci
npx playwright install chromium
npm run dev

# 提交前运行完整质量门禁
npm run check
npm run test:e2e:run
npm run lighthouse:run
```

开发地址为 `http://localhost:3000`。`npm run check` 使用隔离的 `.next-quality` 构建目录，不会覆盖正在运行的开发服务。

## 环境变量

从 [`.env.example`](.env.example) 创建本地 `.env.local`。任何 Secret 都只能由服务端读取，不得改成 `NEXT_PUBLIC_*`。

| 变量 | 用途 | 生产要求 |
| :--- | :--- | :--- |
| `TURNSTILE_SECRET_KEY` | Turnstile 服务端校验 | 启用 Turnstile 时必填 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 客户端 Site Key | 与 Secret 配套 |
| `JOIN_WEBHOOK_URL` | 飞书、企业微信或通用 Webhook | 通知渠道按需配置 |
| `RESEND_API_KEY` | Resend 邮件投递 | 邮件渠道按需配置 |
| `JOIN_NOTIFY_EMAIL` | 报名通知收件人 | 邮件渠道按需配置 |
| `NEXT_PUBLIC_SITE_URL` | canonical、sitemap、robots、OG 的站点根地址 | 正式域名确定后必填 |

本地未配置 Turnstile Key 时表单会进入开发降级模式；生产环境缺少 Secret 会返回 503。Resend 当前默认发件人为 `onboarding@resend.dev`，正式域名确定后应改为已验证发件域名。

## 日常维护

内容统一维护在 `src/content/`，结构约束在 `src/content/schema.ts`。修改标题或方向名称后运行 `npm run fonts:check`；若报告缺字，再按 [CONTRIBUTING.md](CONTRIBUTING.md) 重新生成中文标题子集。

图片原件先放在被 Git 忽略的 `materials/` 审核，确认无隐私后再放入 `public/images/` 对应目录并运行 `npm run images:optimize`。公开栅格图只保留 AVIF/WebP，页面统一使用 `next/image` 和 `sizes`；未被页面引用的归档图继续留在 `materials/`，不得进入可部署的 `public/` 树。

常用检查：

| 命令 | 作用 |
| :--- | :--- |
| `npm run check` | 类型、Lint、Vitest、内容/图片/字体审计、生产构建 |
| `npm run test:e2e:run` | 13 条公开路由的 axe、键盘、缩放、强制颜色、SEO 契约 |
| `npm run test:browser` | 320/1440px、明暗主题、触屏和动效冒烟 |
| `npm run lighthouse:run` | 移动端性能、LCP、CLS、TBT 与可访问性门禁 |
| `npm run fonts:subset` | 提取实际标题字符并生成 WOFF2/TTF/WOFF 子集 |
| `npm run audit:content` | 占位文案、外部占位图、私钥/IP 与真实性限定检查 |
| `npm run audit:images` | 图片格式、引用和响应式加载策略检查 |

GitHub Actions 会在 PR 和 `main` 推送时依次运行 `check`、Playwright 与 Lighthouse。Lighthouse 报告只保存在本地或 CI 工件目录，不上传公共服务。

## 上线交接

部署平台仍在 Cloudflare 与 EdgeOne 之间待定，本仓库没有创建任何线上资源。平台、正式域名、Turnstile、通知渠道和 Resend 发件域必须由现任负责人确认后再配置。

上线前仍需人工完成：iPhone Safari、安卓 Chrome、微信/QQ 内置浏览器、横屏、系统大字号、NVDA 首页与报名表单抽查，以及 QQ 深链和复制群号兜底。完整流程见 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [`docs/09-MOBILE.md`](docs/09-MOBILE.md)。

真实图片与历史材料统一从 `materials/` 整理到 `public/images/`；不要把聊天记录、训练资料、汇报源文件、服务器信息或凭据直接发布。

---

## 文档约定

- 🔴 **[缺口]** — 需要社团提供的真实素材/数据，不得用占位文案糊弄
- 🟡 **[待定]** — 需要负责人拍板的决策
- ⚪ **[Phase 2]** — 首个版本不做，记录在案
