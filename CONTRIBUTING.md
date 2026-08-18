# 云飞扬官网维护与换届交接

本文面向第一次接手 YFY v4 / Trajectory 的维护者。先阅读 `README.md`、`docs/00-PRD.md`、`docs/01-DESIGN.md`、`docs/02-MOTION.md`、`docs/05-ARCHITECTURE.md`、`docs/08-QUALITY.md` 与 `docs/09-MOBILE.md`，再修改代码或内容。

## 1. 本地环境

- Node.js 22、npm
- Chromium（`npx playwright install chromium`）
- 仅字体再生成需要 Python 3、`fonttools` 与 `brotli`

```bash
npm ci
npm run dev
```

环境变量从 `.env.example` 开始配置。Secret 只允许出现在 `.env.local` 或部署平台的服务端 Secret 中，禁止进入 `NEXT_PUBLIC_*`、源码、截图、日志和构建产物。

## 2. 修改内容

1. 在 `src/content/` 修改事实数据，不要直接在组件里复制一份。
2. 若结构变化，同步更新 `src/content/schema.ts` 和对应测试。
3. 奖项、人数、项目状态和性能数字必须有可追溯材料；没有材料就删除区块，不写占位内容。
4. 智光耀城必须保留“模拟数据、不连接真实灯杆”和 `195 / 425 / 9` 的归档日期限定。
5. 修改页面标题、方向名或作品名后运行 `npm run fonts:check`。

内容原始材料放在被 Git 忽略的 `materials/`。聊天记录、名单、学号、手机号、账号、Token、私钥路径、服务器地址和内网 IP 不得进入 `public/`。

## 3. 更新图片

1. 人工查看原图，确认没有真实账号、主机名、Token、内网 IP 或未授权个人信息。
2. 将待处理 PNG/JPG 放入 `public/images/` 对应目录。
3. 运行 `npm run images:optimize`。脚本会按类别限制尺寸，生成 AVIF/WebP，并删除公开目录中的旧栅格源文件。
4. 在页面中使用 `next/image`，为响应式图片填写准确的 `sizes`，装饰图片使用 `alt=""`。
5. 运行 `npm run audit:images` 和浏览器测试。

不要对证书或海报做会改变事实内容的生成式编辑。证书公开前必须脱敏。未被当前页面引用的截图和证件只保留在 `materials/`；图片审计会拒绝可部署目录中的未引用资产，避免账号或个人信息通过直链意外公开。

## 4. 更新中文标题字体

标题子集由实际源码确定，不要手工维护字符列表。

```powershell
python -m pip install fonttools brotli
$env:YFY_HEADING_FONT_SOURCE = "D:\Fonts\NotoSerifSC-VariableFont_wght.ttf"
npm run fonts:subset
npm run fonts:check
```

`fonts:subset` 会生成 Web 使用的 WOFF2，以及动态 OG 使用的 TTF/WOFF。CI 会检查字符覆盖率和 WOFF2 小于 40KB；缺少字体源时只需运行 `fonts:check`，不必重新生成。

## 5. 报名链路

前后端共用 `joinFormSchema`。修改字段时必须同时检查表单、`POST /api/join`、投递模板、脱敏日志和 `tests/unit/join.test.ts`。

本地无 Turnstile Key 时允许开发降级；生产环境缺少 `TURNSTILE_SECRET_KEY` 会返回 503。Webhook 或邮件投递失败会记录脱敏日志，但不改变已接收报名的成功响应。

不要用真实学生信息做自动化测试。浏览器测试只验证控件、键盘顺序和客户端状态，不向外部服务提交。

## 6. 质量门禁

```bash
npm run check
npm run test:e2e:run
npm run test:browser
npm run lighthouse:run
```

`check` 包含类型、ESLint、Vitest、内容/图片/字体审计和隔离生产构建。Playwright 覆盖 13 条公开路由、明暗主题、axe、键盘路径、320px、200% 大字号、强制颜色、reduced-motion、canonical、JSON-LD、sitemap 与 robots。

Lighthouse 门槛为性能 ≥90、可访问性 100、LCP ≤2.5s、CLS ≤0.1、TBT ≤300ms。不要通过删除断言或提高上限解决回归。

## 7. 提交与评审

- 一个提交只处理一个可解释的目标，提交信息写清行为变化和验证结果。
- 不提交 `.env*`、`.next*`、Lighthouse/Playwright 报告或 `materials/`。
- PR 必须通过 GitHub Actions；内容变化还需要内容负责人核对事实与图片授权。
- 不在未获负责人授权时创建部署项目、域名、Turnstile、Webhook 或邮件资源。

## 8. 正式上线前人工清单

- iPhone Safari、安卓 Chrome、微信与 QQ 内置浏览器
- 375px 窄屏、横屏、系统大字号、减弱动态效果
- NVDA 验证首页与报名表单
- QQ 深链、复制群号、二维码长按识别
- 中端安卓滚动和动效帧率
- 分享到微信/QQ 后核对动态 OG 卡片
- 正式域名下核对 canonical、sitemap、robots 与 Turnstile
- 用测试报名确认通知渠道，再删除测试数据

部署平台目前仍待定。选择 Cloudflare 或 EdgeOne 时，以国内校园网可达性、Next.js Route Handler 支持和 Secret 管理能力为准，并把最终部署步骤补回本文。
