# YFY Trajectory Agent Notes

本文件记录本仓库后续代理需要遵守的环境、工作流和设计上下文。它是项目协作说明，不替代用户在当前对话中的最新要求。

## 环境与能力边界

- 工作目录是 Windows PowerShell 环境，项目使用 Next.js 15、React 19、TypeScript、Tailwind CSS v4 和 `motion`。
- 全局样式主要集中在 `src/app/globals.css`，设计变量在 `design/tokens.css`；优先复用现有变量、组件和 CSS 约定。
- 本机不可使用 Computer Use，也不可使用 Browser Use MCP。
- `agent-browser` 当前不可用（CLI 未安装），不要调用，也不得声称完成了浏览器目视检查或截图检查。
- 浏览器行为验证优先使用仓库现有 Playwright 测试；需要视觉证据时，应请求用户提供截图，或先获得明确的工具安装/使用条件。
- 本机可用的技能不代表对应外部工具可用。执行技能前先阅读其 `SKILL.md`，再检查所需 CLI、MCP 或环境前置条件。

## agy 子代理

agy 可用于联网查资料、核对官方组件文档、整理 API、生成研究摘要，以及执行不影响产品判断的杂活。它和主代理共享仓库目录，因此要求它只读研究时必须明确写出“不要修改仓库”。

推荐调用格式：

```powershell
agy --dangerously-skip-permissions --print-timeout 10m --prompt "你的具体任务。请给出官方来源、真实安装命令、依赖、关键 API 和迁移风险；如果只查资料，请明确不要修改仓库。"
```

使用约定：

- 研究任务要给出具体官方 URL、输出格式和项目背景，避免只返回泛泛的组件推荐。
- 让 agy 做资料核对或机械整理时，主代理仍需自行检查源码、依赖和许可证，不把研究结果当作未经验证的事实。
- 涉及文件修改时，必须明确授权修改范围；默认让 agy 只研究、不改代码。
- agy 返回结果后，主代理负责把结论映射到现有架构，不要因为存在现成组件就引入第二套行为原语。

## 前端设计上下文

- 目标风格是 Industrial Craft、Linear/Swiss Precision 和 Awwwards 级高级感：内容克制、1px 分隔线、等宽元数据、明确状态和有目的的微交互。
- 不要堆叠完整卡片、重复说明或泛化的渐变。交互应优先服务选择、查看详情、滚动叙事和状态反馈。
- `/tracks` 与 About 梯队使用“选择轨道/阶段 + 单一详情面板”的信息结构。
- `/tracks` 右侧详情使用现有 MagicCard 聚光交互；除非用户明确要求，不要替换或重构该卡片。
- 旧提交 `dff5fe3d5d0b34c82bfc39a91efc8a4872cafef7` 的流光线路是可复用的视觉资产。修改线路时保留静态基线、活动路径和 reduced-motion 降级。
- Coss UI、Magic UI、Aceternity UI 组件优先通过官方 registry/CLI 核对后引入。Coss Tabs/Button 基于 Base UI，若项目已经使用 Radix，不要无理由让两套 Tabs 行为并存；可复制零行为依赖的结构组件或只吸收其视觉范式。

## 开发与验证

常用命令：

```powershell
npm run typecheck
npm run lint
npm test
npm run build:quality
npm run test:e2e:run
git diff --check
```

改动 UI 交互后，至少运行类型检查、lint、单元测试和 E2E；E2E 使用独立的 `.next-quality` 构建，CSS 或组件变化后先重新运行 `npm run build:quality`，再运行 E2E。

编辑文件优先使用 `apply_patch`；不要重置、覆盖或删除用户未授权的改动。提交前检查 `git status`、`git diff --check` 和最终 diff。

## Git 协作

- 当前仓库远端是个人仓库 `origin`，默认分支为 `main`。
- 用户已明确允许本仓库改动直接提交并推送；完成验证后可直接执行 `git add`、`git commit` 和 `git push origin main`。
- 提交信息使用详细中文，说明主要改动、交互影响和验证结果；不要使用含糊的 `update`、`fix` 等单词作为唯一信息。
