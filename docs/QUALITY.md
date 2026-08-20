# 质量与验证

本项目的自动门禁覆盖类型、代码规范、单元测试、内容与资源审计、生产构建、浏览器行为、无障碍和 Lighthouse。自动检查通过仍不能替代 NVDA 与真机验证。

## 常用命令

| 命令 | 覆盖范围 |
| :--- | :--- |
| `npm run audit:docs` | Markdown 本地链接与引用文件 |
| `npm run check` | 类型、ESLint、Vitest、文档/内容/图片/字体审计、隔离生产构建 |
| `npm run test:e2e:run` | 已有质量构建上的 42 项 Playwright 测试，覆盖 14 条公开路由 |
| `npm run test:e2e` | 先构建，再运行 Playwright |
| `npm run test:browser` | 320/1440px、明暗主题、触屏和动效冒烟 |
| `npm run lighthouse:run` | 已有质量构建上的 14 路由 Lighthouse |
| `npm run lighthouse` | 先构建，再运行 Lighthouse |

质量构建使用 `.next-quality`，不会覆盖 `npm run dev` 使用的 `.next`。Playwright 默认在 `3100` 启动质量构建，Lighthouse 默认使用 `3101`。

## 自动门槛

| 项目 | 门槛 |
| :--- | :--- |
| TypeScript | `strict` 下零错误 |
| ESLint | 零错误 |
| Vitest | 全部通过 |
| 内容审计 | 无占位文案、占位 CDN、私钥、私网 IP；真实性限定存在 |
| 图片审计 | 无公开旧栅格、无未引用公开资产、响应式图有 `sizes` |
| 字体审计 | 标题字符全覆盖，中文标题 WOFF2 小于 40KB |
| 文档审计 | 仓库 Markdown 的本地目标存在 |
| axe | 14 条公开路由、明暗主题零 serious/critical |
| Lighthouse 可访问性 | 100 |
| Lighthouse 性能 | 每条公开路由不低于 90 |
| LCP | 不高于 2.5s |
| CLS | 不高于 0.1 |
| TBT | 不高于 300ms |
| 首页首载 JS | 理想低于 120kB，上限 180kB |
| 其他页面首载 JS | 理想低于 150kB，上限 200kB |

自动化浏览器契约覆盖真实截图计数、作品共享视图过渡、边框光效配色、常见问题键盘展开与收起、减弱动态效果终值与强制颜色模式下的布局。Vitest 单元测试覆盖数据处理、数字动画、两级限流与持久化落库机制。

不要通过删除断言、忽略失败页面或提高既有上限来处理回归。

## 提交前验证

文档或无运行时影响的小改：

```bash
npm run audit:docs
npm run check
```

页面、组件、样式、内容模型或表单变更：

```bash
npm run check
npm run test:e2e:run
npm run test:browser
npm run lighthouse:run
```

若 `check` 之后又修改了会影响构建的文件，后续 Playwright/Lighthouse 使用的是旧 `.next-quality`，必须重新运行 `npm run build:quality` 或直接使用带构建的命令。

## CI 说明

`.github/workflows/quality.yml` 在 PR 和 `main` push 上依次运行：依赖安装、Chromium 安装、`npm run check`、Playwright、Lighthouse。当前工作流把所有步骤放在一个 Ubuntu job 中。

Lighthouse 在共享 runner 上只有一次采样，容易受到冷启动和 CPU 争用影响。`cf800db` 的远端 run 已出现本地无法复现的 TBT/LCP 失败，详见 [STATUS](STATUS.md)。稳定 CI 时应优先考虑增加采样次数并使用中位数、保存报告工件和检查真实长任务；阈值保持不变。

axe 应在页面记忆点入场结束或明确的稳定状态后扫描。当前首页辅助文案的透明度入场可能产生瞬时低对比结果，不能依赖 Playwright 重试掩盖。

## 人工无障碍

NVDA 至少完成以下路径并记录版本：

- 首页：页面标题、主导航、航迹章节导航、CTA 和区块标题顺序合理。
- 报名页：标签、必填状态、帮助文本、错误关联、原生选择框、Turnstile、提交状态可理解。
- 仅使用键盘完成首页到方向详情再到报名表单的路径。
- Dialog 打开后焦点进入，关闭后回到触发元素；`Esc` 可关闭。
- 主题切换和移动导航有清晰名称与当前状态。

浏览器还需人工核对 200%/400% 重排、Windows 强制颜色和 `prefers-reduced-motion`。自动化已有覆盖，但正式上线前仍应抽查真实辅助技术。

## 移动端矩阵

| 环境 | 关键检查 |
| :--- | :--- |
| iPhone Safari | 全站明暗主题、`100svh`、表单不因小字号自动缩放 |
| iPhone 微信 | 扫码进入、首屏、报名、复制群号、二维码长按 |
| iPhone QQ | 上述路径 + QQ 深链 |
| 中端安卓 Chrome | 长页滚动、动效帧率、表单键盘、返回导航 |
| 中端安卓微信 | 报名与复制群号兜底 |
| 320–375px | 无横向滚动、文字截断或触控目标拥挤 |
| 手机横屏 | 左右安全区、导航和 Hero 不被裁切 |
| 系统最大字号 | 内容不重叠、不截断，操作仍可见 |
| 减弱动态效果 | 无位移类自动动效，所有功能可用 |

每次实测记录设备型号、系统、浏览器/内置浏览器版本、测试日期、失败截图和复测结果。未实测的项目保持为未完成，不用桌面模拟器代替。

## 故障判断

1. 先确认测试使用的提交、Node 版本和质量构建是否一致。
2. 单测或 Playwright 失败先复现具体用例，不先全量重复运行。
3. Lighthouse 读取 JSON 报告中的 LCP 元素、长任务和网络依赖，再做至少三次同环境对照。
4. 只在证据表明是采样方差时调整采样策略；页面真实超预算就优化页面。
5. 修复后运行受影响测试，再按变更风险决定是否全量复跑。

详细的原始 WCAG、移动端和性能设计基线保存在 [v4 质量文档](archive/trajectory-v4/08-QUALITY.md) 与 [v4 移动端文档](archive/trajectory-v4/09-MOBILE.md)。
