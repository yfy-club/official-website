# 云飞扬官网维护与贡献指南

本文面向第一次接手 YFY v4 / Trajectory 的维护者。开始前先阅读 [README](README.md)、[项目状态](docs/STATUS.md) 和与任务对应的活跃文档；历史编号文档只用于理解设计背景。

## 1. 基本约束

- 先核对 `git status`、当前分支、最新提交和远端 CI，再修改文件。
- 保留工作树中不属于自己的改动，不回退、不覆盖、不顺手整理无关文件。
- 未获明确授权时，不提交、推送、部署、创建外部资源或改动线上配置。
- Secret 不得进入源码、Markdown、截图、构建产物或日志。
- 一个变更应有清晰目标，验证范围与风险相匹配。

## 2. 本地环境

要求 Node.js 22、npm 和 Chromium：

```bash
npm ci
npx playwright install chromium
npm run dev
```

只有重建中文标题字体时才需要 Python 3、FontTools 和 Brotli。环境变量从 `.env.example` 开始，个人配置放在 `.env.local`。

## 3. 先找到单一真源

| 要修改的内容 | 单一真源 | 维护说明 |
| :--- | :--- | :--- |
| 社团事实、方向、项目、奖项、招新 | `src/content/` | [docs/CONTENT.md](docs/CONTENT.md) |
| 内容结构与表单字段 | `src/content/schema.ts` | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| 色彩、字体、间距和动效数值 | `design/tokens.css` | [v4 设计基线](docs/archive/trajectory-v4/01-DESIGN.md) |
| 当前进度与阻塞项 | `docs/STATUS.md` | [文档维护规则](docs/README.md) |
| 自动门禁和人工矩阵 | `docs/QUALITY.md` | [docs/QUALITY.md](docs/QUALITY.md) |
| 部署与生产配置 | `docs/OPERATIONS.md` | [docs/OPERATIONS.md](docs/OPERATIONS.md) |

不要在第二个文件里复制会变化的事实。需要从其他位置说明时，链接到单一真源。

## 4. 内容、图片与字体

内容必须可追溯。奖项、人数、项目状态和性能数字没有依据时删除区块，不写占位。智光耀城的模拟数据说明和 `195 / 425 / 9` 归档日期限定必须保留。

图片原件先在 `materials/` 人工检查隐私与授权，再进入 `public/images/` 并运行：

```bash
npm run images:optimize
npm run audit:images
```

修改页面标题、方向名或作品名后运行 `npm run fonts:check`。缺字时再按 [docs/CONTENT.md](docs/CONTENT.md) 重建子集。

不要使用真实学生信息做自动化测试。聊天记录、名单、账号、Token、服务器信息和内网 IP 不得进入可部署目录。

## 5. 报名链路

前后端共用 `joinFormSchema`。修改报名字段时必须同时检查：

- `src/components/sections/join-form.tsx`
- `POST /api/join`
- Turnstile、蜜罐和限流
- Webhook 与邮件模板
- 错误信息和脱敏日志
- `tests/unit/join.test.ts` 与 Playwright 报名路径

本地无 Turnstile Key 时允许开发降级；生产缺少 Secret 返回 503。当前通知投递没有持久兜底，限流也不跨实例，相关生产决策见 [docs/OPERATIONS.md](docs/OPERATIONS.md)。

## 6. 文档

活跃文档放在 `docs/` 根目录并按职责命名。`docs/archive/trajectory-v4/` 是只读历史基线，不再记录当前进度。

修改架构、命令、质量门槛、环境变量或上线状态时，同步对应活跃文档。完成后运行：

```bash
npm run audit:docs
```

不要把临时调查日志、重复清单或某次对话交接全文新增为长期文档。

## 7. 验证

最低提交前门禁：

```bash
npm run check
```

页面、组件、样式、表单或共享行为变更还应运行：

```bash
npm run test:e2e:run
npm run test:browser
npm run lighthouse:run
```

`check` 会生成 `.next-quality`。如果之后又修改了运行时代码，必须重新构建，不能让后续浏览器测试继续使用旧产物。完整门槛与 CI 排查方式见 [docs/QUALITY.md](docs/QUALITY.md)。

不要通过删除断言、忽略失败路由或提高上限解决回归。自动化通过也不能替代 NVDA、微信/QQ 和真机大字号测试。

## 8. 评审与提交

- 提交信息说明行为变化，不只写“update”或“fix”。
- 不提交 `.env*`、`.next*`、Lighthouse/Playwright 报告、`materials/` 或测试个人数据。
- PR 说明包含目标、风险、验证命令和任何未完成的人工测试。
- 内容变化需要内容负责人核对事实和图片授权。
- 架构变化同步测试和活跃文档；部署变化同步操作与回滚说明。
- 不在未获授权时创建部署项目、域名、Turnstile、Webhook、数据库或邮件资源。

## 9. 正式上线前

正式上线必须按 [docs/OPERATIONS.md](docs/OPERATIONS.md) 的清单执行，至少包括绿色 CI、NVDA、移动实机矩阵、正式域名、Turnstile、通知渠道、报名可靠性、分享卡片、日志和回滚验证。

平台当前仍待 Cloudflare 或 EdgeOne 决策。选择结果必须基于国内校园网可达性、Next.js 动态能力、Secret 管理、共享存储和回滚，而不是只比较构建是否成功。
