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

- 改动 UI 交互后，至少运行类型检查、lint、单元测试和 E2E；E2E 使用独立的 `.next-quality` 构建，CSS 或组件变化后先重新运行 `npm run build:quality`，再运行 E2E。
- **测试与执行效率**：运行耗时任务（如 `npm run test:e2e:run` 或 `npm run build:quality`）时，启动后等待任务自然完成，完成后直接检查退出码与主要日志摘要；**切勿以秒为单位频繁轮询查询状态**，避免产生无意义的中间日志并过度消耗上下文空间。
- 编辑文件优先使用 `apply_patch` 或精确替换；不要重置、覆盖或删除用户未授权的改动。提交前检查 `git status`、`git diff --check` 和最终 diff。

## 核心交互组件资产

- **智光耀城系统巡览 (`WorkSystemTour` & `WorkTourObserver`)**：`src/components/sections/work-system-tour.tsx`。多实例通过 `workSlug` 隔离锚点 ID（`work-tour-${workSlug}-group-${id}`），Observer 纯局部基于 `markerRef.closest('.work-tour')` 查找根节点，避免全局 ID 冲突；桌面端 sticky 挂载于 `.work-tour__nav` 网格项。
- **招新页 3D 立体海报展台 (`PosterTiltCard`)**：`src/components/motion/poster-tilt-card.tsx`。基于 `motion/react` 的 `useSpring` 计算光标相对位置产生 ±6° 物理倾斜与径向高光，采用受控 Radix Dialog 弹窗查看大图，符合 W3C ARIA 1.2 规范。
- **关于页文化实拍 Bento 展台 (`CultureGallery`)**：`src/components/sections/culture-gallery.tsx`。盘活 8 张实拍照，采用响应式 Bento 网格、等宽磨砂玻璃角标、Focus Dimming 悬停聚焦与受控 Dialog 灯箱。
- **首页航道关联预览 (`TrackPreviewList`)**：`src/components/motion/track-preview-list.tsx`。航道悬停/聚焦显示关联真实作品截图。
- **首页 Hero 工业蓝图网格**：`.home-hero` 背景加入 36px 纯 CSS 双轴网格与 `--hero-mouse-x/y` 低频视差。
- **加入页双轨跑马灯展台 (`MemberVoicesMarquee` & `Marquee`)**：`src/components/sections/member-voices-marquee.tsx` & `src/components/ui/marquee.tsx`。双轨异步反向无限流动，左右渐变羽化遮罩，支持悬停平滑暂停与 reduced-motion 降级，展示基于真实档案与二次元昵称的 10 位成员心声。
- **荣誉页指标看板与成果矩阵 (`AwardsMetricsBar` & `AwardsOverviewMatrix`)**：`src/components/sections/awards-metrics-bar.tsx` & `src/components/sections/awards-overview-matrix.tsx`。4 格工业指标仪表舱搭载 `NumberTicker` 数字跳动；高密度赛事成果矩阵展示国家级/省级权威认证与参赛方向。
- **证书档案库控制台与暗室灯箱 (`CertArchive`)**：`src/components/motion/cert-archive.tsx`。Coss UI Segmented `Tabs` 多维分类筛选、卡片悬停金色流光 `BorderBeam`、影院级受控 Radix Dialog 宽幅灯箱、快捷键 `[ ← ]` / `[ → ]` / `[ ESC ]` 切图与 `Kbd` 键帽引导、档案编号一键复制 Toast 联动。
- **全局导航栏物理动效微胶囊 (`SiteHeader`)**：`src/components/layout/site-header.tsx`。基于 `motion` 的 `layoutId="nav-active-pill"` 实现丝滑 Spring 物理滑行动效，彻底替代刺眼的光晕。
- **技术栈元数据字典与跳转标签 (`TechTag` & `tech-stack.ts`)**：`src/components/ui/tech-tag.tsx` & `src/lib/tech-stack.ts`。所有技术栈标签集成官方文档外链跳转与 hover Tooltip 精炼简介，外链图标平滑展开无默认偏移。
- **作品页结构化微卡片与全宽排版 (`WorksFilterView`)**：`src/components/sections/works-filter-view.tsx`。废除硬编码进度条，采用 `01 //` 磨砂微卡片组充实要点，全宽自适应拉伸并无缝填满横纵空间。
- **Coss UI 工业精工组件族 (`CardFrame`, `Kbd`, `Empty`, `InputGroup`, `useCopyToClipboard`)**：
  - `CardFrame` (`src/components/ui/card.tsx`)：工业仪表舱框架，用于加入页 Fit 准则、迎新群舱位、作品演示账号与质量证据看板。
  - `Kbd` (`src/components/ui/kbd.tsx`)：等宽机械立体键帽，用于矩阵计算器滑块微调与快捷键引导。
  - `Empty` (`src/components/ui/empty.tsx`)：虚线工程占位与状态指示，用于首页与航道关联作品占位。
  - `InputGroup` (`src/components/ui/input-group.tsx`)：等宽前缀（`ID //`, `TEL //`）与字符计数容器。
  - `useCopyToClipboard` (`src/hooks/use-copy-to-clipboard.ts`)：带倒计时反馈状态的安全剪贴板 Hook。

## Git 协作

- 当前仓库远端是个人仓库 `origin`，默认分支为 `main`。
- 用户已明确允许本仓库改动直接提交并推送；完成验证后可直接执行 `git add`、`git commit` 和 `git push origin main`。
- 提交信息使用详细中文，说明主要改动、交互影响和验证结果；不要使用含糊的 `update`、`fix` 等单词作为唯一信息。
