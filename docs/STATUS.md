# 项目状态

> 最近核对：2026-08-19 · 维护对象：YFY v4 / Trajectory · 代码基线：`main`（含 P3 核心交互组件升级）

## 当前结论

M0 至 M4 的代码和自动质量门禁已经实现，P0 内容扩充、P1 已有资产复用以及 P3 核心交互与新组件落地（智光耀城系统巡览、3D 物理倾斜海报展台、文化实拍 Bento 展台、首页航道联动、Coss UI 精工组件族、双轨跑马灯与加入页双翼展台架构）均已完成并通过 55 项全量端到端测试。

仓库代码可按当前协作约定提交并推送；未经负责人单独授权，不得正式部署、创建外部资源或修改线上配置。

## 已验证基线

| 项目 | 结果 |
| :--- | :--- |
| 当前质量门禁 | typecheck、ESLint、Vitest 24/24、内容/图片/文档审计、字体覆盖、`build:quality` 通过；构建生成 33 个静态页面 |
| Playwright E2E | 55/55 通过，覆盖 14 条公开路由、明暗主题 axe 校验、320px 重排、强制颜色、减弱动态效果、系统巡览多实例隔离、3D 海报与 Bento 展台交互契约 |
| Lighthouse 本地基线 | 上一基线 13 条路由满足性能不低于 90、可访问性 100、LCP 不高于 2.5s；智学伴详情已加入下次 14 路由清单 |
| 首页首载 JS | 150kB，低于 180kB 上限 |
| `/join` 首载 JS | 204kB，符合预期 |
| `/tracks` 首载 JS | 190kB，低于 200kB 上限 |
| `/about` 首载 JS | 210kB |
| Tracks 响应式连接图 | 320 / 390 / 1440 / 1920px 浏览器核对通过，无横向溢出或控制台错误 |
| 中文标题字体 | 195 个字符，WOFF2 30,288 字节 |
| 输出形态 | 公开页面静态生成；`POST /api/join` 保持动态 Node.js Route Handler |

## 本次 P3 交互与新组件落地

- **智光耀城系统巡览 (`WorkSystemTour`)**：将 15 张真实系统实录编排为 5 个业务分组，桌面端提供 Sticky 导航索引，打印媒体智能避让单项截断；Observer 纯局部基于 `markerRef.closest('.work-tour')` 查找根节点并隔离各实例 ID。
- **招新页立体海报展台 (`PosterTiltCard`)**：基于 `motion/react` 阻尼物理引擎实现光标跟随 ±6° 3D 倾斜与径向高光扫光，受控 Radix Dialog 弹窗查看高清大图，无任何 ARIA/Axe 违规。
- **关于页文化实拍 Bento 展台 (`CultureGallery`)**：响应式 Bento Grid 排布 8 张实验室、工位与团建实拍照，配合 Focus Dimming 悬停聚焦与高清弹窗。
- **首页 Hero 工业蓝图视差**：`.home-hero` 背景加入 36px 纯 CSS 双轴细线网格与指针低频视差。
- **首页航道关联预览 (`TrackPreviewList`)**：5 条航道桌面端悬停/聚焦即时展示关联作品截图与空状态占位。
- **加入页双轨跑马灯展台 (`MemberVoicesMarquee` & `Marquee`)**：双轨异步错向流动，展示 10 条真实成员心声，支持悬停暂停与 reduced-motion 降级。
- **荣誉页核心指标与赛事矩阵 (`AwardsMetricsBar` & `AwardsOverviewMatrix`)**：新增 4 格工业指标仪表舱（搭载 `NumberTicker`）与高密度赛事成果矩阵，清晰呈现国家级/省级奖项及对应赛道。
- **证书档案库全功能控制台与暗室灯箱 (`CertArchive`)**：集成 Coss UI Segmented `Tabs` 多维分类即时筛选、卡片悬停金色/青色流光 `BorderBeam`、受控宽幅 Radix Dialog 暗室灯箱、快捷键 `[ ← ]` / `[ → ]` / `[ ESC ]` 切图与 `Kbd` 键帽引导、档案编号一键复制 Toast 联动。
- **全局导航栏微胶囊物理动效 (`SiteHeader`)**：基于 `motion` 的 `layoutId="nav-active-pill"` 实现丝滑 Spring 物理滑行动效。
- **技术栈元数据字典与跳转系统 (`TechTag` & `tech-stack.ts`)**：全量接入各大技术栈官方文档链接与 Tooltip 极简摘要，消除图标留白偏移。
- **在研项目结构化微卡片与全幅拉伸 (`WorksFilterView`)**：废除硬编码进度条，以 `01 //` 磨砂微卡片组充实要点，自适应撑满卡片横向与纵向可用空间。
- **Coss UI 工业精工组件族 (`CardFrame`, `Kbd`, `Empty`, `InputGroup`, `useCopyToClipboard`)**：全面落地于加入页 Fit 准则、迎新群、作品公开体验账号、质量验收凭证、表单前缀与字符计数器。下一阶段执行范围与验收标准见 [NEXT-PHASE](NEXT-PHASE.md)。

## 本次 P1 已有资产复用

- 首页、About 与 Awards 的关键数字复用 `NumberTicker`，并在 `prefers-reduced-motion` 下从服务端首帧直接呈现终值。
- Works 在研卡片复用 token 着色的低频 `BorderBeam`；已上线作品从内容模型计算真实截图数量。
- Works 列表截图与三条详情 Hero 使用稳定 slug 建立共享 View Transition，减弱动态效果下自动退回普通导航。
- Join FAQ 已统一为现有 Radix Accordion，保持单项展开、可全部收起和完整键盘行为。
- 自动验证覆盖 14 条公开路由；当前环境未执行浏览器肉眼、截图、NVDA 或移动端实机检查。

## 远端 CI

GitHub Actions run [`32150909406`](https://github.com/yfy-club/yfy-club.github.io/actions/runs/32150909406) 对 `cf800db` 的结论为失败：

- `npm run check` 通过。
- Playwright job 通过，但首页浅色 axe 在标题辅助内容淡入期间首轮出现一次 2.74:1 的瞬时对比度结果，重试通过，最终为 32 passed + 1 flaky。
- Lighthouse 单次采样失败：首页 TBT 307ms；`/awards` 性能 80、LCP 2.81s、TBT 639ms；`/join` 性能 88、TBT 459ms。
- 2026-08-19 在同一提交上本地原样复跑 `npm run lighthouse:run`，13 条路由全部通过。

当前证据更像单次 CI 采样方差，但远端状态仍是红色。下一次代码变更前应处理 axe 扫描时机与 Lighthouse 采样稳定性，不能通过提高既有阈值掩盖问题。详细门禁见 [QUALITY](QUALITY.md)。

## 正式上线阻塞项

| 优先级 | 阻塞项 | 完成条件 |
| :--- | :--- | :--- |
| P0 | 部署平台未决定 | 在 Cloudflare 与 EdgeOne 间完成可达性、Next.js Route Handler、Secret 和回滚能力评估 |
| P0 | 正式域名未确定 | 明确域名、DNS 负责人和 `NEXT_PUBLIC_SITE_URL` |
| P0 | 报名通知未配置 | 至少一个通知渠道完成真实测试，并明确失败后的数据处置方式 |
| P0 | Turnstile 未配置 | 正式域名对应的 Site Key / Secret 配置并验证 |
| P0 | 报名数据缺少持久兜底 | 当前通知渠道缺失或投递失败时接口仍返回成功；上线前必须接受该风险或增加可靠存储/队列 |
| P0 | 限流只在单进程内存中 | 多实例部署前接入平台级共享存储，或明确单实例约束与替代防护 |
| P0 | 人工无障碍未完成 | NVDA 走完首页和报名表单 |
| P0 | 移动端实机未完成 | iPhone Safari、安卓 Chrome、微信/QQ 内置浏览器、横屏、系统大字号和减弱动态效果通过 |
| P1 | Resend 发件域未验证 | 将 `onboarding@resend.dev` 替换为已验证的正式发件域 |
| P1 | 分享卡片未在真实渠道核对 | 正式域名下验证微信/QQ 分享结果 |

## 建议顺序

1. 修复或稳定远端 CI，使 `main` 恢复绿色。
2. 完成 NVDA 和移动端实机矩阵，记录设备、系统、浏览器版本和结论。
3. 由负责人决定平台、域名、通知渠道和报名数据可靠性要求。
4. 按 [OPERATIONS](OPERATIONS.md) 配置预览环境，先验证报名与分享链路。
5. 获得单独的正式上线授权后再执行生产部署。

完成或新增事项时直接更新本文件；历史设计阶段的勾选框不再作为当前进度依据。
