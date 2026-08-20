# 现行架构

本文描述当前 `main` 的实现边界。设计阶段的选型论证和组件草案已归档在 [`archive/trajectory-v4/`](archive/trajectory-v4/README.md)。

## 系统边界

```text
浏览器
  ├─ 读取 14 条公开页面、图片、字体和动态 OG 卡片
  └─ POST /api/join
       ├─ 蜜罐与请求体限制
       ├─ 两级限流 (join:attempt / join:submit)
       ├─ Cloudflare Turnstile 校验
       ├─ ① Upstash / Memory 持久化落库 (status=pending)
       └─ ② Webhook / Resend 投递通知 (成功销账 / 失败留存重试)

定时调度 (GitHub Actions 每 2 小时)
  └─ POST /api/join/retry (Bearer CRON_SECRET)
       └─ 提取 pending 待投递记录批量补投 (超 10 次转 abandoned 人工队列)

构建期
  ├─ src/content/* + Zod Schema
  ├─ Next.js 静态页面与 SEO 资源
  └─ 内容、图片、字体和文档审计
```

站点不包含复杂管理后台或动态内容管理系统。结构化内容跟随 Git 版本化，`POST /api/join` 与 `POST /api/join/retry` 是现有的业务接口。

## 技术栈

| 层 | 当前实现 |
| :--- | :--- |
| 框架 | Next.js 15 App Router、React 19、TypeScript strict |
| 样式 | Tailwind CSS v4、`design/tokens.css`、`src/app/globals.css` |
| 交互 | Motion、React Archer、Radix UI、Lucide React |
| 表单 | React Hook Form、Zod、Cloudflare Turnstile |
| 存储与限流 | Upstash Redis REST（纯 fetch，无 Node 驱动依赖）、内存降级 |
| 测试 | Vitest、Playwright、axe-core、Lighthouse CI |
| 图片与字体 | `next/image`、AVIF/WebP、自托管拉丁字体、中文标题子集 |

依赖版本以 `package.json` 和 `package-lock.json` 为准，不在文档中复制次版本号。

## 路由与渲染

| 路由 | 数量 | 策略 |
| :--- | :---: | :--- |
| `/`、`/about`、`/tracks`、`/works`、`/awards`、`/join` | 6 | 静态生成 |
| `/tracks/[slug]` | 5 | `generateStaticParams` 静态生成 |
| `/works/[slug]` | 3 | 仅为有完整 `detail` 的项目静态生成 |
| `/api/join` | 1 | `force-dynamic`、Node.js / 边缘运行时通用 |
| `/api/join/retry` | 1 | `force-dynamic`、Bearer 鉴权批量补投 |
| `/og/[...segments]` | 按路由 | `next/og` 动态图像响应 |
| `/sitemap.xml`、`/robots.txt` | 2 | Next.js metadata routes |

Playwright 的公开路由清单以 `tests/e2e/routes.ts` 为准。作品或方向路由变化时，必须同步静态参数、sitemap 和测试清单。

## 目录职责

```text
src/app/                 页面、metadata routes 与 /api/join
src/components/layout/   全局导航、页脚、主题和航迹轨
src/components/motion/   每页唯一的记忆点动效
src/components/sections/ 复杂页面区块和报名表单
src/components/ui/       可复用 UI 原语
src/components/seo/      JSON-LD 输出
src/content/             产品事实与 Zod Schema
src/lib/                 SEO、限流和共享常量
design/tokens.css        设计 Token 单一真源
public/                  允许部署的字体与已审查素材
materials/               不部署的原始资料，本地保存且被 Git 忽略
scripts/                 构建辅助与质量审计
tests/                   单元测试和端到端质量门禁
```

## 内容与页面流

`src/content/schema.ts` 定义结构，其他 `src/content/*.ts` 提供事实数据，`src/content/index.ts` 在导出时执行校验。页面默认使用 React Server Components；只有主题、导航、Dialog、表单和动效等确需浏览器状态的组件使用 `'use client'`。

内容缺失时不使用占位文案。可选区块应不渲染；项目详情的 `detail.limits` 等真实性字段由 Schema 强制要求。具体维护流程见 [CONTENT](CONTENT.md)。

## Tracks 方向连接图

`/tracks` 页面本身保持为 Server Component，方向卡片和连接关系集中在 `src/components/motion/divergence.tsx` 的 `TracksMap` 客户端边界中，避免把浏览器状态扩散到页面层。

- 桌面端由 React Archer 根据起点和五张卡片的真实 DOM 位置生成贝塞尔曲线，响应式宽度变化后重新计算，不维护固定坐标。
- 首次进入可视区时，独立 SVG 流光层复用已生成曲线的 `d` 数据，以 `--accent` 播放一次短光束；基础灰线始终完整可见。
- 卡片 hover 或键盘聚焦时只强调对应路线，其他路线降低明度；触屏设备不依赖 hover。
- 移动端隐藏桌面 SVG，改用灰色 CSS 主干、短分支和独立内容卡片，首次进入时只沿主干播放一次强调色光束。
- `prefers-reduced-motion: reduce` 会关闭桌面和移动端流光，同时保留完整静态连接关系。

连接线颜色、强调色、间距和动效时长继续来自 Design Token 与全局样式。若调整卡片结构、断点或连接锚点，应同时检查 320px 移动重排、宽桌面落点、键盘聚焦和减少动态效果。

## 核心交互与通用组件

- **数字动效**：`src/components/ui/number-ticker.tsx` 用于首页、关于页与荣誉页的关键数据呈现。进入视口触发一次，减弱动态效果模式下直接输出静态终值。
- **作品过渡动画**：列表媒体与详情页预览通过 `work-image-${slug}` 建立唯一的视图过渡标识，页面切换时平滑连接。
- **常见问题折叠**：`src/components/sections/mechanism-accordion.tsx` 基于 Radix UI 统一实现招新与关于页的折叠展开，支持单项切换与全键盘操作。
- **智光耀城系统巡览**：`src/components/sections/work-system-tour.tsx` 将多图作品按业务模块分组展示，支持桌面端粘性导航，且多实例间 ID 作用域完全隔离。
- **招新海报展台**：`src/components/motion/poster-tilt-card.tsx` 基于弹性物理算法实现光标跟随微倾斜，支持受控弹窗查看高清大图，符合无障碍标准。
- **文化实拍画廊**：`src/components/sections/culture-gallery.tsx` 响应式网格排布活动与环境实拍照，支持悬停聚焦与弹窗大图预览。
- **首页航道关联预览**：`src/components/motion/track-preview-list.tsx` 悬停或聚焦技术方向时即时展示对应项目截图与空状态占位。
- **赛事成果列表**：`src/components/sections/awards-overview-matrix.tsx` 细线分隔流线型清单，展示国家级与省级获奖成果及赛道信息。
- **证书档案库与弹窗预览**：`src/components/motion/cert-archive.tsx` 提供多维分类筛选、受控大图弹窗、键盘快捷键切换与证书编号一键复制。
- **全局导航栏指示器**：`src/components/layout/site-header.tsx` 基于平滑动效实现路由切换时的导航滑行指示。
- **技术栈标签系统**：`src/components/ui/tech-tag.tsx` 与 `src/lib/tech-stack.ts` 支持官方文档链接跳转与工具提示简介。
- **在研项目结构化展示**：`src/components/sections/works-filter-view.tsx` 以结构化微卡片清晰展示在研项目的研发重点。
- **通用 UI 组件族**：
  - 容器卡片（`src/components/ui/card.tsx`）：用于招新匹配、迎新群、作品体验账号与质量看板容器。
  - 键帽提示（`src/components/ui/kbd.tsx`）：用于键盘操作与快捷键提示。
  - 空状态占位（`src/components/ui/empty.tsx`）：用于关联作品等场景的工程占位。
  - 输入组合框（`src/components/ui/input-group.tsx`）：用于表单前缀与字符计数展示。
  - 剪贴板复制（`src/hooks/use-copy-to-clipboard.ts`）：带反馈状态的安全剪贴板复制工具。

## 报名请求流与可靠性保障

`POST /api/join` 的处理顺序：

1. 拒绝超过 16KiB 或无法解析为 JSON 对象的请求。
2. 蜜罐字段有值时返回通用成功响应。
3. 检查第一级限流（`join:attempt`，10 分钟 20 次尝试，防暴破）。
4. 生产环境必须存在 `TURNSTILE_SECRET_KEY` 并校验通过；缺失时返回 503。
5. 用共享的 `joinFormSchema` 做服务端严格字段校验。
6. 扣减第二级限流（`join:submit`，10 分钟 3 次正式提交）。
7. **先持久化落库**：调用 `store.append(record)` 将报名数据写入 Upstash Redis（默认 180 天过期），并在 `join:pending` 注册待投递索引，状态为 `pending`。
8. **再触发通知投递**：调用 `deliverApplication(record)` 并行尝试 Resend 邮件与 Webhook 投递：
   - 投递成功：调用 `store.markDelivered(id)` 从 `join:pending` 销账并置状态为 `delivered`。
   - 投递失败：调用 `store.markFailed(id, error)` 累加重试计数，数据安全留存于 `join:pending` 等待调度重试。
9. 仅在持久化失败且投递也失败的极端双故障情况下返回 `{ ok: true, degraded: true }`；只要落库成功即视为数据已安全接收。
10. 返回 `Cache-Control: no-store` 的 JSON 响应。

离线补偿与重试（`POST /api/join/retry`）：

- 由 GitHub Actions 自动化工作流每 2 小时定时触发，携带 `Bearer CRON_SECRET` 鉴权。
- 批量提取最多 25 条待投递记录尝试重发；连续失败超过 10 次的记录自动转移至 `join:abandoned` 人工核对队列，避免无限空转。
- 当处理后仍有未投递记录或积压人工队列时，Workflow 会主动失败触发 GitHub 告警邮件。

## SEO 与资源

- `src/lib/seo.ts` 统一生成 canonical、Open Graph 和 Twitter metadata。
- `NEXT_PUBLIC_SITE_URL` 未配置时回退到 `https://yfy.club`；生产环境必须显式设置正式域名。
- JSON-LD 由 `src/components/seo/structured-data.tsx` 输出。
- 公开栅格图只允许 AVIF/WebP，SVG 保留矢量；引用和 `sizes` 由图片审计检查。
- 中文正文使用系统字体，标题中文使用按源码提取字符生成的字体子集。

## 稳定约束

- 组件颜色来自 Design Token，不在组件中复制主题色值。
- 内容展示优先保持为 Server Component。
- 每页只保留一个记忆点动效，并支持 `prefers-reduced-motion`。
- 触屏交互不能依赖 hover；移动端是主要访问场景。
- 不引入运行时境外字体 CDN。
- 不把平台专有 API 扩散到页面和内容层；部署适配集中处理。

修改上述边界时，应同时更新本文、相关测试和 [OPERATIONS](OPERATIONS.md)。
