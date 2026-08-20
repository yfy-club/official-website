# 云飞扬社团官方网站

云飞扬社团官方网站（YFY Trajectory）是面向社团技术方向展示、重点项目巡览、竞赛荣誉成果归档、成员成长记录与招新报名的多页面 Web 应用。项目基于 Next.js 15 App Router、React 19 与 TypeScript 构建，公开页面全量静态生成，招新报名接口提供完整的持久化与离线补偿保障。

---

## 核心特性

- **静态优先与全响应式**：14 条公开路由（包含 6 个一级页面、5 个技术方向详情与 3 个重点项目详情）全量静态预渲染，无缝适配 320px 移动端至 4K 宽屏，支持深浅色主题切换。
- **真实工程档案与系统巡览**：包含智光耀城智慧路灯物联网平台（15 组系统实录与分组粘性导航）、智学伴 AI 平台（多角色体验账号与架构决策）及矩阵计算器（公式推导与算法演示）。
- **可靠的报名与通知链路**：招新表单通过 React Hook Form 与 Zod 严格校验，集成 Cloudflare Turnstile 人机验证与两级限流；报名数据优先写入 Upstash Redis 持久化落库，并结合 GitHub Actions 实现定时离线补投。
- **克制动效与完整无障碍支持**：所有页面均提供直观的物理操作反馈，严格遵循 W3C ARIA 1.2 规范与 axe-core 校验，全站支持 `prefers-reduced-motion` 减弱动态效果降级。

---

## 技术栈

| 层次 | 核心选型 |
| :--- | :--- |
| **应用框架** | Next.js 15 (App Router)、React 19、TypeScript |
| **样式与设计系统** | Tailwind CSS v4、Design Tokens (`design/tokens.css`)、Lucide React |
| **组件与动效** | Motion、Radix UI、React Archer |
| **表单与验证** | React Hook Form、Zod、Cloudflare Turnstile |
| **存储与限流** | Upstash Redis REST（边缘与 Node 运行时通用）、内存降级 |
| **测试与质量审计** | Vitest、Playwright、axe-core、Lighthouse CI |
| **媒体与字体** | Next.js Image（AVIF/WebP）、自托管字体与中文标题动态子集 |

---

## 快速开始

### 1. 环境准备

- **Node.js**：`>= 22.0.0`
- **包管理器**：`npm`
- **可选依赖**：重建中文标题字体子集时需 Python 3、FontTools 与 Brotli。

### 2. 安装与运行

```bash
# 1. 安装项目依赖
npm ci

# 2. 安装 Playwright 浏览器内核（首次运行 E2E 测试前需执行）
npx playwright install chromium

# 3. 启动开发服务器
npm run dev
```

启动后在浏览器中访问 `http://localhost:3000`。

---

## 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `npm run dev` | 启动 Turbopack 开发服务器 |
| `npm run build` | 执行生产构建 |
| `npm run check` | 执行全量门禁（类型检查、Lint、单元测试、资源审计与隔离构建） |
| `npm test` | 运行 Vitest 单元测试 |
| `npm run test:e2e` | 构建并运行 Playwright 端到端测试 |
| `npm run test:e2e:run` | 基于已有构建运行 Playwright 测试 |
| `npm run test:browser` | 运行响应式、主题切换与交互冒烟测试 |
| `npm run lighthouse:run` | 运行 Lighthouse 性能与可访问性审计 |
| `npm run audit:docs` | 检查所有 Markdown 文档的本地链接完整性 |
| `npm run audit:content` | 检查敏感信息、占位文案与真实性约束 |
| `npm run audit:images` | 检查公开图片格式、尺寸与引用规范 |
| `npm run images:optimize` | 将公开图片转换为 AVIF / WebP 格式 |
| `npm run fonts:check` | 检查中文标题字体的字符覆盖完整度 |
| `npm run fonts:subset` | 从源码中提取字符并重新生成字体子集 |

---

## 项目结构

```text
src/
├── app/                 # 页面路由、SEO 元数据与 /api/join 接口
├── components/
│   ├── layout/          # 全局导航栏、页脚与主题切换
│   ├── motion/          # 核心交互动效（海报展台、证书档案库、航道预览等）
│   ├── sections/        # 页面业务区块与系统巡览组件
│   ├── ui/              # 基础 UI 原语（卡片、键帽、输入框组合、标签等）
│   └── seo/             # JSON-LD 结构化数据
├── content/             # 社团事实数据（统一受 Zod Schema 校验约束）
└── lib/                 # 存储、限流、SEO 与共享通用工具
design/                  # 设计 Token 变量单一真源
docs/                    # 长期维护文档与历史归档
materials/               # 原始设计素材与历史档案（本地保存，不参与部署）
public/                  # 公开静态资源与字体子集
scripts/                 # 构建辅助、资源优化与质量审计脚本
tests/                   # Vitest 单元测试与 Playwright 端到端测试
```

---

## 环境变量说明

在项目根目录下复制 `.env.example` 创建 `.env.local`：

```bash
cp .env.example .env.local
```

核心环境变量如下：

| 环境变量 | 作用 | 说明 |
| :--- | :--- | :--- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST 地址 | 用于报名数据持久化落库与共享两级限流（未配置时降级为内存模式） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST 访问凭证 | 与 URL 配套使用 |
| `CRON_SECRET` | 离线补投鉴权密钥 | 用于 `/api/join/retry` 接口的 Bearer 身份校验 |
| `JOIN_RETENTION_DAYS` | 报名数据保留天数 | 默认 180 天 |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile 服务端密钥 | 生产环境报名接口人机校验必填 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile 客户端 Site Key | 前端表单人机校验组件 |
| `JOIN_WEBHOOK_URL` | 报名通知 Webhook | 支持飞书、企业微信或通用 Webhook |
| `RESEND_API_KEY` | Resend API Key | 用于报名邮件通知投递 |
| `JOIN_MAIL_FROM` | 邮件发件人地址 | 如 `云飞扬社团 <noreply@yourdomain.com>` |
| `JOIN_NOTIFY_EMAIL` | 报名通知收件人邮箱 | 多个邮箱使用逗号分隔 |
| `NEXT_PUBLIC_SITE_URL` | 站点正式根 URL | 用于生成规范 Canonical、Sitemap 与 Open Graph 图片 |

---

## 文档导航

项目文档集中在 `docs/` 目录下按职责维护：

- [docs/README.md](docs/README.md)：文档结构与维护规则
- [docs/STATUS.md](docs/STATUS.md)：当前开发状态、已验证基线与上线核对项
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)：系统边界、数据流、持久化与核心组件
- [docs/CONTENT.md](docs/CONTENT.md)：内容数据源、图片处理、字体子集与真实性红线
- [docs/QUALITY.md](docs/QUALITY.md)：自动质量门禁、性能预算与测试矩阵
- [docs/OPERATIONS.md](docs/OPERATIONS.md)：环境变量、通知配置、离线补投与运维回滚
- [CONTRIBUTING.md](CONTRIBUTING.md)：代码维护、协作规范与评审说明
- [docs/archive/trajectory-v4/](docs/archive/trajectory-v4/README.md)：v4 历史设计与阶段规划归档（00 至 11 号文档）

---

## 许可证与致谢

本项目由 **云飞扬社团** 维护与开发。
保留所有权利。未经授权不得将社团真实素材、肖像与证书用于商业用途。
