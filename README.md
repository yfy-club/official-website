# 云飞扬社团官网

YFY v4 / Trajectory 是云飞扬社团的多页面官网，面向招新、方向介绍、项目展示和竞赛成果归档。项目使用 Next.js 15、React 19 与 TypeScript，公开页面以静态生成优先，报名通过动态 Route Handler 处理。

当前代码与自动质量基线已完成，但尚未正式部署。部署平台、域名、Turnstile、通知渠道和报名数据可靠性方案仍待负责人确认；NVDA 与移动端实机验收也未完成。完整状态见 [docs/STATUS.md](docs/STATUS.md)。

> 未获得负责人明确授权前，不得正式部署、创建外部资源、修改线上配置、提交或推送。

## 快速开始

要求 Node.js 22 与 npm。Playwright 首次使用需要安装 Chromium；只有重建中文标题字体时才需要 Python 3、FontTools 和 Brotli。

```bash
npm ci
npx playwright install chromium
npm run dev
```

开发地址为 `http://localhost:3000`。

提交前的基本门禁：

```bash
npm run check
npm run test:e2e:run
npm run test:browser
npm run lighthouse:run
```

`npm run check` 使用 `.next-quality`，不会覆盖开发服务的 `.next`。若代码修改发生在质量构建之后，应先重新构建再运行依赖该产物的 Playwright 或 Lighthouse；详细说明见 [docs/QUALITY.md](docs/QUALITY.md)。

## 文档入口

当前文档按维护职责组织，不再用实施阶段编号：

| 文档 | 内容 |
| :--- | :--- |
| [docs/README.md](docs/README.md) | 文档地图、层级与维护规则 |
| [docs/STATUS.md](docs/STATUS.md) | 当前基线、远端 CI、已知问题和上线阻塞项 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 路由、运行时、数据流和系统边界 |
| [docs/CONTENT.md](docs/CONTENT.md) | 内容、图片、字体、真实性与隐私流程 |
| [docs/QUALITY.md](docs/QUALITY.md) | 自动门禁、性能预算和人工测试矩阵 |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | 环境变量、平台决策、上线、观察与回滚 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 修改、评审和交接约定 |

v4 设计与实施阶段的 `00` 至 `10` 号文档保存在 [docs/archive/trajectory-v4/](docs/archive/trajectory-v4/README.md)。归档解释历史决策，不代表当前完成状态或现行命令。

## 项目结构

```text
src/app/                 页面、SEO 路由与 /api/join
src/components/          布局、UI、页面区块和动效
src/content/             受 Zod 约束的产品事实
src/lib/                 SEO、限流与共享逻辑
design/tokens.css        设计 Token 单一真源
public/                  可部署的字体与已审查素材
materials/               不部署的原始资料，本地保存
scripts/                 构建辅助与自动审计
tests/                   Vitest 与 Playwright
docs/                    当前维护文档与历史归档
```

当前公开路由共 14 条：6 条顶层页面、5 条方向详情和 3 条作品详情（智光耀城、矩阵计算器、智学伴）。`POST /api/join` 是唯一动态业务接口。全站引入 Coss UI 精工组件族与首屏双翼展台架构。架构细节以 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 和源码为准。

## 常用命令

| 命令 | 作用 |
| :--- | :--- |
| `npm run dev` | 启动 Turbopack 开发服务 |
| `npm run check` | 类型、Lint、Vitest、文档/内容/图片/字体审计、生产构建 |
| `npm run test:e2e` | 重建质量产物并运行 Playwright |
| `npm run test:e2e:run` | 在已有质量产物上运行 Playwright |
| `npm run test:browser` | 响应式、主题、触屏和动效浏览器冒烟 |
| `npm run lighthouse` | 重建质量产物并运行 Lighthouse |
| `npm run lighthouse:run` | 在已有质量产物上运行 Lighthouse |
| `npm run audit:docs` | 检查 Markdown 本地链接 |
| `npm run audit:content` | 检查占位、私网信息和真实性限定 |
| `npm run audit:images` | 检查图片格式、引用和加载策略 |
| `npm run images:optimize` | 将公开栅格原件转换为 AVIF/WebP |
| `npm run fonts:check` | 检查中文标题字体覆盖与体积 |
| `npm run fonts:subset` | 从源码提取字符并重建字体子集 |

## 环境变量

从 `.env.example` 创建本地 `.env.local`。Secret 只能由服务端读取，不得改成 `NEXT_PUBLIC_*`。

| 变量 | 用途 |
| :--- | :--- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST 端点（持久化与两级限流） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token |
| `CRON_SECRET` | 离线补投端点 `/api/join/retry` Bearer 鉴权密钥 |
| `JOIN_RETENTION_DAYS` | 报名数据留存天数（默认 180 天） |
| `TURNSTILE_SECRET_KEY` | Turnstile 服务端校验 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 客户端 Site Key |
| `JOIN_WEBHOOK_URL` | 飞书、企业微信或通用 Webhook |
| `RESEND_API_KEY` | Resend 邮件投递 |
| `JOIN_MAIL_FROM` | Resend 发件人（如 `云飞扬社团官网 <noreply@域名>`） |
| `JOIN_NOTIFY_EMAIL` | 报名通知收件人，支持逗号/分号分隔 |
| `NEXT_PUBLIC_SITE_URL` | canonical、sitemap、robots 与 OG 根地址 |
| `NEXT_PUBLIC_ANALYTICS_ID` | 预留分析配置，当前可留空 |

本地未配置 Turnstile 时允许开发降级，未配置 Upstash 时自动降级为内存持久化与内存限流（多实例/重启不共享）。生产环境必须配置 Upstash 与 Turnstile。正式部署说明详见 [docs/OPERATIONS.md](docs/OPERATIONS.md)。

## 内容与素材

结构化事实统一维护在 `src/content/`，结构约束位于 `src/content/schema.ts`。不要在组件里复制成员人数、奖项、项目状态、群号等可变事实。

原始图片先放在被 Git 忽略的 `materials/`，确认授权、隐私和画面内容后再进入 `public/images/`。公开栅格只保留 AVIF/WebP，页面使用 `next/image` 和准确的 `sizes`。标题变更后运行 `npm run fonts:check`。

具体流程和真实性红线见 [docs/CONTENT.md](docs/CONTENT.md)。

## 设计原则

Trajectory 的视觉概念是“航迹”：技术成长不是一条向上的直线，而是在方向选择和大三出路处发生分岔。现行设计保持三条硬约束：

1. 静止是默认状态，每页只有一个记忆点动效。
2. 强调色是稀缺资源，界面层级主要靠排版、明度和留白建立。
3. 移动端是主场，所有 hover 行为必须有触屏等价或明确取消。

完整的历史设计依据可查阅 [v4 设计系统](docs/archive/trajectory-v4/01-DESIGN.md)、[动效规范](docs/archive/trajectory-v4/02-MOTION.md) 和 [移动端规范](docs/archive/trajectory-v4/09-MOBILE.md)。实际数值以 `design/tokens.css` 和当前组件为准。

## 当前上线条件

在正式上线前，至少还需完成：远端 CI 恢复绿色、NVDA 首页与报名表单、iPhone/安卓/微信/QQ 实机矩阵、平台与域名决策、Turnstile、通知渠道、已验证发件域，以及报名持久性与共享限流方案。

任何部署都应从明确提交产生，先经过预览环境和真实链路验证，并准备可执行的回滚步骤。不要从脏工作树或本地开发服务直接发布。
