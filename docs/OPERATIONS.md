# 上线与运维

本文是预览和正式上线的执行清单，不代表已授权部署。当前平台、域名和外部资源均未确定；状态见 [STATUS](STATUS.md)。

## 环境变量

| 变量 | 可见性 | 用途 | 生产要求 |
| :--- | :--- | :--- | :--- |
| `TURNSTILE_SECRET_KEY` | 服务端 Secret | Turnstile 服务端校验 | 启用报名时必填 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | 公开 | Turnstile 客户端组件 | 与 Secret 和域名匹配 |
| `JOIN_WEBHOOK_URL` | 服务端 Secret | 飞书、企业微信或通用 Webhook | 通知方案选择后配置 |
| `RESEND_API_KEY` | 服务端 Secret | Resend 邮件投递 | 使用邮件时必填 |
| `JOIN_NOTIFY_EMAIL` | 服务端配置 | 报名收件人，支持逗号/分号分隔 | 使用邮件时必填 |
| `NEXT_PUBLIC_SITE_URL` | 公开 | canonical、sitemap、robots、OG 根地址 | 必须是正式 HTTPS 根域名 |
| `NEXT_PUBLIC_ANALYTICS_ID` | 公开 | 预留分析配置 | 当前可留空 |

以 `.env.example` 为模板配置本地 `.env.local`。Secret 不得进入 `NEXT_PUBLIC_*`、源码、构建日志、截图或 Markdown。

## 当前运行约束

- 生产环境缺少 `TURNSTILE_SECRET_KEY` 时，报名接口返回 503；本地开发允许关闭验证。
- Resend 发件人由 `JOIN_MAIL_FROM` 指定，未配置时回退到 `onboarding@resend.dev`。该沙盒发件人只能投递到 Resend 账号本人的邮箱，发往 QQ 等外部邮箱会被拒收，正式上线前必须替换为已验证域名。
- 报名先落库、再投递通知。只要 `store.append` 成功，通知失败不会造成数据丢失，由 `/api/join/retry` 补投。
- 三道防线：①Upstash 持久化 ②定时补投 ③两者都失效时，以 `[join] UNDELIVERED APPLICATION` 前缀把完整报名内容写入日志。只有第 ① 和 ② 都不可用时接口才返回 `{ ok: true, degraded: true }`，前端回执改为“需人工确认”。
- 限流分两级：`join:attempt` 对每次请求计数（10 分钟 20 次），`join:submit` 仅在校验与人机验证通过后扣减（10 分钟 3 次），因此填错字段的重试不会消耗正常报名配额。
- 未配置 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` 时，限流与报名存储都退化为进程内实现：限流在多实例间不共享，报名进程重启即丢失。**正式部署必须配置。** 限流在存储不可用时按放行处理（fail-open）。
- `POST /api/join` 不锁定 runtime，只使用 fetch / URL / TextEncoder 等 Web 标准 API，可在 Node 运行时与边缘运行时（EdgeOne Pages、Cloudflare Workers）上运行。
- `NEXT_PUBLIC_SITE_URL` 缺失时 SEO 回退到 `https://yfy.club`。若正式域名不同，错误 canonical 会被直接生成进页面。

部署前必须由负责人决定报名数据的可靠性目标。如果“任何报名不得丢失”是要求，应先增加持久化或队列，并让通知失败可追踪和重试。

## 报名邮件通知配置

目标：把表单数据规范化地投递到指定 QQ 邮箱。走 Resend HTTP API，与部署平台无关。

Cloudflare Email Routing 无法用于本用途——它只做“收信转发”，不提供任何对外发信能力。若最终部署在 Cloudflare Workers 上，可改用 `send_email` binding 直发已验证的目的地址；EdgeOne 无此能力，因此默认方案统一走 Resend。

1. 在 Resend 添加发信域名，按其提示在 Cloudflare DNS 中添加 DKIM、SPF 与 bounce MX 记录。DKIM 记录必须关闭代理（灰色云朵）。
2. 额外添加 DMARC 记录，否则 QQ 邮箱容易判为垃圾邮件或静默丢弃：
   `_dmarc TXT "v=DMARC1; p=none; rua=mailto:<接收报告的邮箱>"`
3. 等待 Resend 域名状态变为 Verified 后配置环境变量：
   - `RESEND_API_KEY`：Resend API Key
   - `JOIN_MAIL_FROM`：如 `云飞扬社团官网 <noreply@已验证域名>`
   - `JOIN_NOTIFY_EMAIL`：接收报名的 QQ 邮箱，多个地址用逗号或分号分隔
4. 发出的邮件主题为 `[官网报名] 姓名 · 方向 · 年级`，便于在收件箱内检索归档；申请人联系方式是邮箱时会写入 `reply_to`，可直接回复。
5. 上线后用真实表单提交一次，确认 QQ 邮箱收到且不在垃圾箱；若进垃圾箱，先检查 SPF/DKIM/DMARC 是否全部通过。


## 报名持久化与补投

### 数据流

```
POST /api/join
  校验 / 人机验证 / 限流
    └─ ① store.append(data)          报名在这一步落地，status=pending
    └─ ② deliverApplication(data)    Resend + Webhook
          成功 → markDelivered（销账）
          失败 → markFailed（留在待投递队列，累加 attempts）

GitHub Actions cron（每 2 小时）
    └─ POST /api/join/retry  (Authorization: Bearer CRON_SECRET)
          └─ 取最多 25 条待投递记录重投，成功销账
```

### 存储

后端藏在 `src/lib/join-store.ts` 的 `JoinStore` 接口之后，默认实现走 Upstash Redis REST（纯 fetch，各平台通用）。未配置 Upstash 时回退到进程内 `MemoryJoinStore`，仅供本地开发与单测使用。

Redis 键位：

| 键 | 类型 | 用途 |
| :--- | :--- | :--- |
| `join:record:<id>` | String | 报名 JSON，按 `JOIN_RETENTION_DAYS`（默认 180 天）过期 |
| `join:pending` | ZSet | 待投递索引，score 为收到时间 |
| `join:abandoned` | ZSet | 重试超过 10 次、需人工处理的记录 |

选型说明：优先 Upstash 而不是 EdgeOne KV 或 Cloudflare D1，是因为部署平台尚未确定，纯 fetch 实现可以在 EdgeOne、Cloudflare、Vercel 与本地 Node 上一致运行，且限流已经在用同一套连接配置。平台固定后若要换成平台自带存储，只需新增一个 `JoinStore` 实现，路由无需改动。

### 补投调度

调度放在 GitHub Actions（`.github/workflows/join-retry.yml`）而非部署平台的 cron，目的是与平台解耦——EdgeOne 是否支持定时函数不影响这条链路。需要在仓库 Secrets 配置 `JOIN_RETRY_URL` 与 `CRON_SECRET`，后者必须与部署环境变量一致。仍有积压时该 workflow 会失败，由 GitHub 发出告警邮件。

`/api/join/retry` 在未配置 `CRON_SECRET` 时返回 503 而不是放行，避免留下无鉴权的公开端点。

### 上线前必须实测的两项

以下两点是纸面推导，未经实测，不可当作既定事实：

1. **EdgeOne 边缘节点的出站可达性。** 若站点未备案，函数预期运行在境外节点，访问 Resend 与 Upstash 无阻碍；若启用了大陆加速，出站路径改变，必须重新验证 `api.resend.com` 与 `*.upstash.io` 是否可达。
2. **Upstash 命令配额。** 免费额度按命令数计费，而 `join:attempt` 限流器在每个 POST 请求上都会消耗命令。遭遇脚本刷取时消耗的是请求数而非报名数，需要观察实际用量。


## 平台决策记录

Cloudflare 与 EdgeOne 的选择至少比较以下项目，并把结论补回本节：

| 维度 | 验证方式 |
| :--- | :--- |
| 国内校园网可达性 | 河南及至少一个外省网络的冷/热访问 |
| Next.js 兼容 | 静态页面、动态 OG、`POST /api/join`、Node.js runtime |
| 图片优化 | `next/image` AVIF/WebP 输出与缓存 |
| Secret 管理 | 环境隔离、审计、轮换和最小权限 |
| 共享限流/存储 | KV、队列或数据库能力与免费额度 |
| 日志 | 报名接口错误可检索且不会记录个人信息或 Secret |
| 回滚 | 可固定到已验证构建，回滚过程和预计时间明确 |
| 域名与 HTTPS | DNS 权限、证书、IPv4/IPv6 和备案相关要求 |

在平台适配通过前，“构建成功”不等于“可生产运行”。特别要验证平台是否完整支持当前 Node.js Route Handler 和 `next/og`。

## 预览环境清单

创建任何预览资源前也需要负责人授权。获准后：

1. 从一个明确提交构建，不从脏工作树部署。
2. 使用独立的预览域名和独立 Turnstile Key；通知发送到测试渠道。
3. 设置正确的 `NEXT_PUBLIC_SITE_URL`，避免预览页声明生产 canonical。
4. 运行自动质量门禁，并在实际预览 URL 上做浏览器冒烟。
5. 用虚构报名数据验证正常、校验失败、Turnstile 失败、限流和通知失败路径。
6. 删除测试报名数据，确认日志已脱敏。
7. 验证 sitemap、robots、canonical、JSON-LD 和每条动态 OG 图。

## 正式上线清单

- [ ] 负责人书面确认平台、域名、上线窗口和回滚责任人
- [ ] `main` 对应提交明确，工作树干净，远端 CI 绿色
- [ ] `npm run check`、Playwright、browser smoke 和 Lighthouse 通过
- [ ] NVDA 首页与报名表单通过
- [ ] iPhone、安卓、微信、QQ、横屏和系统大字号矩阵通过
- [ ] 正式域名、DNS、HTTPS 与 `NEXT_PUBLIC_SITE_URL` 正确
- [ ] Turnstile 正式 Key 与域名绑定并完成失败路径测试
- [ ] 通知渠道和发件域验证完成
- [ ] 报名持久性与限流方案满足已确认的风险要求
- [ ] 用虚构数据提交一条生产报名，确认接收后删除测试数据
- [ ] 微信/QQ 分享卡片、深链、复制群号和二维码长按通过
- [ ] 日志和监控可用，且不记录完整报名内容、Token 或 Secret
- [ ] 已记录上一稳定版本和具体回滚操作

## 发布后观察

上线后的首个招新周期至少观察：

- `/api/join` 的 4xx/5xx、Turnstile 上游错误和通知投递错误。
- 报名页面访问与成功响应趋势，但不在分析工具中发送姓名、学号或联系方式。
- 真实用户的 LCP、INP、CLS 和移动端错误。
- 微信/QQ 内置浏览器的兼容反馈。
- 域名、证书、配额和外部服务告警。

对外日志只记录必要的请求标识、时间、结果和脱敏错误分类。不要记录完整请求体。

## 回滚原则

1. 若页面不可用、报名链路误导用户或出现隐私风险，先停止流量或禁用报名入口。
2. 回滚到上一份已验证构建，不在生产控制台临时改代码。
3. Secret 泄露时先撤销和轮换，再分析日志和影响范围。
4. 保留事件时间线、受影响提交、用户影响和恢复验证。
5. 修复通过完整门禁和预览验证后再重新发布。

实际平台确定后，本文件必须补充平台名称、项目标识、环境划分、部署命令、日志入口、DNS 负责人和逐步回滚命令；在此之前不要写猜测性的操作步骤。
