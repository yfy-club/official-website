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

## 核心设计与前端规范

### 1. 直觉物理交互——以交互反馈替代冗余文字
- **避免冗长说明文字**：不出现“点击复制”、“向左/向右切换”、“点击展开”、“悬停查看”等过度解释性文案。
- **清晰的操作反馈与自解释符号**：
  - 可交互元素（按钮、卡片、选项卡触发器等）提供明确的视觉与物理反馈：悬停高光聚焦、按压下沉（`:active:scale-[0.94~0.98]`）与弹性回弹；
  - 采用自解释的箭头与方向符号（如 `← 软件工程`、`人工智能 →`、`COPY //`、`01 //`），让用户直观理解交互意图。

### 2. 排版与空间布局
- **清晰的线条与留白**：
  - 避免无序堆叠卡片，合理利用 1px 细线分隔、自适应流线表格与等宽序号；
- **页面首屏节奏**：
  - 主页面首屏保持适度留白与居中排版，建立节奏清晰的进入感；
- **层次分明的字号阶梯**：
  - 英文大字与粗体中文标题构成视觉锚点，搭配等宽元数据标签，保持界面清晰可读。

### 3. 内容纯度与真实性
- **务实严谨的文案**：使用冷峻务实的工程与组织规范文案，避免口语化或自嗨式描述；
- **状态标签克制**：使用干净清晰的状态文本（如 `STATUS // 已上线 · 2024-2026`、`STATUS // FIT`），避免多余闪烁装饰；
- **基于真实档案**：所有展示均基于真实系统、实机截图、公式推导、源码切片与脱敏材料。

### 4. 前端组件与架构约定
- 保持内容克制、1px 分隔线、等宽元数据与有明确目的的微交互。
- `/tracks` 与 About 页面采用“选择方向/阶段 + 单一详情面板”的信息结构。
- 外部 UI 组件库优先参考官方规范后引入，保持组件行为一致，不无故引入重复的行为原语。

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

- 改动 UI 交互后，至少运行类型检查、lint、单元测试和 E2E；E2E 使用独立的 `.next-quality` 构建，CSS 或组件变化后先重新运行 `npm run build:quality`，再运行 E2E。
- **测试与执行效率**：运行耗时任务（如 `npm run test:e2e:run` 或 `npm run build:quality`）时，启动后等待任务自然完成，完成后直接检查退出码与主要日志摘要；不要以秒为单位频繁轮询查询状态。
- 编辑文件优先精确替换；不要重置、覆盖或删除未授权的改动。提交前检查 `git status`、`git diff --check` 和最终 diff。

## 核心交互组件说明

- **智光耀城系统巡览**：`src/components/sections/work-system-tour.tsx`。多实例通过作品标识隔离锚点 ID，导航观察器基于局部容器查找根节点，避免全局 ID 冲突；桌面端支持粘性导航索引。
- **招新海报展台**：`src/components/motion/poster-tilt-card.tsx`。基于物理弹簧计算光标相对位置生成微倾斜与光效，采用受控弹窗查看大图，符合无障碍可访问性规范。
- **文化实拍画廊**：`src/components/sections/culture-gallery.tsx`。网格排布实验室与活动实拍照，配合悬停聚焦与弹窗大图预览。
- **首页航道关联预览**：`src/components/motion/track-preview-list.tsx`。方向悬停/聚焦即时展示关联作品截图与空状态占位。
- **首页背景网格**：`.home-hero` 背景采用双轴细线网格与指针低频视差效果。
- **成员心声滚动展台**：`src/components/sections/member-voices-marquee.tsx` 与 `src/components/ui/marquee.tsx`。双轨异步反向平滑流动，支持悬停暂停与减弱动态效果降级，展示真实成员成长心声。
- **赛事成果清单**：`src/components/sections/awards-overview-matrix.tsx`。全宽细线分隔流线型清单，展示国家级与省级获奖成果及对应赛道。
- **证书档案库与弹窗预览**：`src/components/motion/cert-archive.tsx`。支持多维分类筛选、受控大图弹窗、键盘快捷键切图与档案编号一键复制。
- **全局导航栏指示器**：`src/components/layout/site-header.tsx`。基于平滑动效实现路由切换时的导航滑行指示。
- **技术栈标签与文档链接**：`src/components/ui/tech-tag.tsx` 与 `src/lib/tech-stack.ts`。技术栈标签支持官方文档链接跳转与工具提示简介。
- **在研项目结构化展示**：`src/components/sections/works-filter-view.tsx`。采用结构化微卡片清晰展示项目研发重点与状态。
- **常用 UI 组件**：
  - 容器卡片（`src/components/ui/card.tsx`）：用于招新匹配准则、迎新群展示、作品公开体验账号与质量验收看板。
  - 键帽提示（`src/components/ui/kbd.tsx`）：用于键盘操作与快捷键引导。
  - 空状态占位（`src/components/ui/empty.tsx`）：用于作品关联等场景的工程占位提示。
  - 输入框组合容器（`src/components/ui/input-group.tsx`）：用于表单前缀与字符计数展示。
  - 剪贴板复制工具（`src/hooks/use-copy-to-clipboard.ts`）：带反馈状态的安全剪贴板复制钩子。

## Git 协作

- 当前仓库远端是个人仓库 `origin`，默认分支为 `main`。
- 用户已明确允许本仓库改动直接提交并推送；完成验证后可直接执行 `git add`、`git commit` 和 `git push origin main`。
- 提交信息使用详细中文，说明主要改动、交互影响和验证结果；不要使用含糊的 `update`、`fix` 等单词作为唯一信息。
