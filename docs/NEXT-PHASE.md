# 下一阶段开发计划

> 阶段：P1 · 已有资产复用
> 前置基线：P0 内容扩充已完成
> 目标：不增加依赖，用仓库现有组件补齐状态反馈、信息引导与跨页面连续性
> 状态：2026-08-19 已完成，后续工作从第七节的 P2 / P3 决策点继续

## 一、当前基线

P0 已经解决内容稀薄和作品详情缺失问题：

- 智学伴已拥有静态详情页、明暗主页、四组功能实录、工程决策、边界与五种公开演示账号。
- 智光耀城已纠正单图/明暗对照语义，并接入地图、告警、工单、资产、遥测、权限和日志等 15 组系统实录。
- 矩阵计算器已接入解题推导过程明暗对照。
- About 已接入 2025 年度培养档案、8 张文化实拍与第二张指导教师肖像。
- Awards 已从 5 份公开证书扩充到 10 份；新增证书使用负责人手动去隐版本。
- 公开图片共 54 个被源码引用的资产；生产构建生成 33 个静态页面。

本阶段不再继续扩充内容，重点是让已经存在的数据和组件产生更清晰的状态、节奏和导航反馈。

## 二、交付范围

| 工作包 | 页面 | 复用资产 | 结果 |
| :--- | :--- | :--- | :--- |
| P1.1 数字入场 | 首页、About、Awards | `NumberTicker` | 关键数字在进入视口时完成一次计数，减弱动态效果下直接显示终值 |
| P1.2 在研状态 | Works 列表 | `BorderBeam`、`Card` | 三个在研项目具备低频状态指示，不改变现有卡片结构 |
| P1.3 作品连续过渡 | Works 列表与详情 | View Transitions、`RouteTransitions` | 点击已上线作品时，列表截图连续过渡到详情 Hero 预览 |
| P1.4 FAQ 统一 | Join、About | Radix Accordion、`MechanismAccordion` | 两页使用同一套展开行为、键盘语义和动画 |
| P1.5 入口信息补全 | Works 列表 | P0 截图数据 | 已上线作品显示真实截图数量，引导进入详情 |

## 三、实施细节

### P1.1 数字入场

目标位置：

1. 首页 `stats-grid`：成立年份、技术航道、成员人数、年均省级以上奖项。
2. About `annual-report__metrics` 与 `mentorship__stats`：年度培养快照和集训数字。
3. Awards 证书档案区：显示当前公开证书总数，并为后续年度密度带提供数值入口。

实现要求：

- 直接复用 `src/components/ui/number-ticker.tsx`，不引入 BlurFade 或另一套计数组件。
- `20+` 这类值拆成数值 `20` 与静态后缀 `+`，不要在组件内部解析展示字符串。
- 成立年份建议从 `2000` 开始计数，避免从零快速滚动四位数造成噪声。
- 每个数字只触发一次；延迟最多做 60 至 80ms 的轻微错峰。
- 检查 `prefers-reduced-motion`：首次渲染必须直接得到最终值，不能停在 `startValue`。
- 计数文本使用稳定宽度或 tabular 数字，动画过程中不得推动相邻标签。

主要文件：

- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/awards/page.tsx`
- `src/components/ui/number-ticker.tsx`
- `src/app/globals.css`

### P1.2 在研状态

在 `/works` 的三个在研项目卡片中使用已有 `BorderBeam`：

- 光束颜色只使用 `var(--warn)`、`var(--accent)` 或现有中性色，不使用组件默认紫色。
- 动画周期保持 8 至 12 秒，三张卡片按索引错开，避免同步扫过形成加载感。
- `BorderBeam` 放在卡片内容层之后，保持 `pointer-events: none`，不影响链接或文本选择。
- 保留 `CardCorners`、`CardMeta` 和现有状态 Badge，不重构 `Card`。
- 减弱动态效果下由现有组件返回 `null`，静态边框仍完整可见。

需要确认 `.card` 的定位与裁切上下文；若必须补样式，只修改 `incubating-grid` 范围，不改变全局 Card 行为。

主要文件：

- `src/app/works/page.tsx`
- `src/components/ui/border-beam.tsx`
- `src/app/globals.css`

### P1.3 作品连续过渡

当前 `RouteTransitions` 已统一接管同源导航，证书档案也已有 View Transition 实践。作品过渡沿用同一机制：

1. 为 `SpotlightCard` 增加稳定的作品标识，不从标题生成名称。
2. 列表媒体容器使用唯一 `view-transition-name`，不能把同名同时赋给负片层和彩色层。
3. 详情 Hero 增加一张真实项目预览图，使用相同名称作为目标元素。
4. 不把详情 Hero 做成嵌套卡片；预览图应是无额外装饰框的内容媒体。
5. 只给拥有详情页的作品启用过渡；外链和在研项目不参与。
6. 减弱动态效果下继续走普通路由切换，CSS 中关闭作品 transition group 动画。

命名建议：`work-image-${slug}`。必须验证页面任意时刻不存在两个可见同名元素，否则浏览器会跳过过渡并在控制台报告重复名称。

主要文件：

- `src/components/motion/spotlight-card.tsx`
- `src/app/works/page.tsx`
- `src/app/works/[slug]/page.tsx`
- `src/components/layout/route-transitions.tsx`
- `src/app/globals.css`

### P1.4 FAQ 统一

Join 目前使用原生 `details`，About 使用 Radix Accordion。本阶段统一到仓库已有 Radix 实现：

- Join 将 FAQ 映射为 `title/detail` 后交给 `MechanismAccordion`。
- 若组件命名影响复用，可重命名为中性的 `ContentAccordion`，但保留一个明确导出并同步所有引用；不要复制第二份 Radix 结构。
- 保持单项展开、可全部收起、方向键导航、Enter/Space 切换与可见焦点。
- 删除只服务旧 `details` 的 `.faq-list` 样式，FAQ 的段落宽度继续受 reading width 限制。
- FAQ 内容仍来自 `src/content/faq.ts`，页面不复制问答文本。

主要文件：

- `src/app/join/page.tsx`
- `src/components/sections/mechanism-accordion.tsx`
- `src/app/globals.css`
- `tests/e2e/quality.spec.ts`

### P1.5 截图数量提示

Works 列表只显示真实可访问的截图数量：

- 单图计 1 张，明暗对照计 2 张，gallery 按同一规则累计。
- 当前预期：矩阵计算器 4 张、智光耀城 16 张、智学伴 6 张。
- Logo 不计入“系统实录”，避免把素材总数伪装成功能截图数。
- 计数放在作品状态或链接附近，使用紧凑元数据样式，不覆盖图片主体。
- 建议把计数逻辑提取为纯函数并加 Vitest，避免页面内重复分支。

## 四、实施顺序

1. 先修正 `NumberTicker` 的减弱动态效果终值契约，并补单元测试。
2. 接入首页、About、Awards 数字，检查布局稳定性。
3. 接入在研卡片 `BorderBeam`，确认颜色和 reduced-motion 降级。
4. 实现截图数量纯函数与列表提示。
5. 实现作品 View Transition，再补详情 Hero 媒体布局。
6. 将 Join FAQ 切换到统一 Accordion，删除旧样式。
7. 运行完整质量门，并根据截图或用户反馈做视觉收尾。

建议按“数字与状态”“作品过渡”“FAQ 与测试”分成三次提交，便于定位回归；若在同一 session 完成，也应保持 diff 按上述边界可读。

## 五、验收标准

功能验收：

- 关键数字进入视口后只计数一次，减弱动态效果下立即显示终值。
- 在研卡片光束不影响点击、聚焦、文本选择或布局尺寸。
- 从三张已上线作品卡进入详情都能得到唯一且连续的图片过渡；不支持 View Transitions 时正常导航。
- FAQ 支持鼠标、触摸与键盘，关闭后焦点位置不丢失。
- Works 列表截图数量与 `works.ts` 的真实素材一致。

自动验证：

```powershell
npm run typecheck
npm run lint
npm test
npm run audit:docs
npm run audit:content
npm run audit:images
npm run fonts:check
npm run build:quality
npm run test:e2e:run
git diff --check
```

浏览器验证限制：

- 当前环境没有 Computer Use、Browser Use MCP 或可用的 `agent-browser`。
- 可以运行仓库 Playwright，但不得声称已完成浏览器肉眼检查。
- 需要视觉结论时，请用户提供首页、Works、作品详情、About、Awards、Join 的桌面和移动截图。

性能护栏：

- 不新增 npm 依赖。
- 首页首载 JS 保持低于 180kB，其他页面保持低于 200kB。
- 不增加常驻 `pointermove` 或滚动监听；已有 View Transition 和 Intersection Observer 足够。
- 动画不得改变布局尺寸，所有动态效果都要有 reduced-motion 静态终态。

## 六、明确不做

以下内容推迟到后续阶段，不与 P1 混合：

- 不实现全站 `[data-reveal]` L2 滚动叙事工具；这是 P2。
- 不安装 Unlumen、Aceternity、Cult UI、Coss UI 或 React Flow。
- 不改 `/tracks` 控制台、右侧 MagicCard 或现有 AnimatedBeam 拓扑。
- 不实现首页 hover-image-list、智光耀城 pinned-list、照片景深走廊或 Hero 二次揭示；这些属于 P3，必须先核验官方 registry 与免费许可。
- 不创建 `/map` 全站知识图谱。

## 七、进入下一阶段前的决策点

P1 完成后，再决定 P2 与 P3 的先后顺序：

- 若页面仍显得静态，先做 P2 的 CSS `animation-timeline: view()` 叙事层。
- 若内容已经充足但首页选择体验仍弱，再核验并引入 Unlumen 的 hover-image-list 范式。
- 智光耀城的 15 组巡览在当前网格稳定后，再判断是否值得升级为 pinned-list；不要在缺少截图对比证据时提前重构。

## 八、P1 完成记录

- 首页、About 和 Awards 已接入现有 `NumberTicker`；成立年份从 2000 起算，数值容器保持稳定宽度，减弱动态效果在服务端首帧直接显示终值。
- 三个在研项目卡片已接入 10 秒低频 `BorderBeam`，颜色来自 `--warn` 与 `--accent`，强制颜色模式下不会造成横向溢出。
- Works 列表根据 `detail.shots` 与 `detail.gallery` 计算系统实录数量，当前分别为矩阵计算器 4 张、智光耀城 16 张、智学伴 6 张。
- 三个已上线作品使用稳定 slug 建立列表媒体到详情 Hero 的 View Transition；减弱动态效果下保留普通路由导航。
- Join FAQ 已统一复用 About 的 Radix `MechanismAccordion`，并覆盖单项展开、全部收起、方向键与 Enter / Space 操作。
- Vitest 14/14、Playwright 42/42 与 14 条公开路由明暗主题 axe 检查通过；未执行浏览器肉眼、截图、NVDA 或移动端实机检查。
