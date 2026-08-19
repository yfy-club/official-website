# 内容与素材维护

产品事实的单一真源是 `src/content/`。本文说明如何安全地更新这些事实，以及如何处理公开图片和中文标题字体。

## 内容位置

| 文件 | 负责内容 |
| :--- | :--- |
| `src/content/club.ts` | 社团名称、口号、人数、指导教师、链接和社群信息 |
| `src/content/about.ts` | 组织机制、年度培养档案、指导教师和文化实拍 |
| `src/content/timeline.ts` | 编年史 |
| `src/content/tracks.ts` | 五个方向、技术栈和三年路线 |
| `src/content/works.ts` | 项目、工程决策、质量证据、截图巡览、演示账号和边界 |
| `src/content/awards.ts` | 赛事、奖项和证书 |
| `src/content/join.ts` | 招新条件、流程和成员感言 |
| `src/content/faq.ts` | 招新问答 |
| `src/content/schema.ts` | 所有结构约束和报名表单 Schema |
| `src/content/index.ts` | 校验后的统一导出 |

不要在页面或组件中复制同一份事实数据。展示层的固定 UI 文案可以留在组件中；会随社团年度、项目、招新或奖项变化的内容必须进入 `src/content/`。

## 更新流程

1. 从年度材料、项目仓库、证书原件或负责人确认中取得可追溯依据。
2. 在 `materials/` 保存原始材料；该目录被 Git 忽略，不参与部署。
3. 修改对应的 `src/content/*.ts`。结构变化时先更新 `schema.ts`，再同步页面与测试。
4. 核对数字的时间范围和措辞，不把历史基线写成持续状态。
5. 运行 `npm run fonts:check`；标题字符缺失时再生成字体子集。
6. 运行 `npm run check`，并人工查看受影响页面的明暗主题与移动布局。

奖项、成员人数、项目状态、指导教师信息和招新要求还需要内容负责人复核。自动测试只能验证结构和红线，不能证明事实本身正确。

## 真实性与隐私

以下规则没有例外：

- 不编造指标、奖项、人数、合作关系、部署状态或成员感言。
- 不使用“敬请期待”、示例条目或外部占位图库填补缺口；内容不足时整块不展示。
- 不把聊天记录、名单、学号、手机号、真实账号、Token、私钥路径、服务器地址或内网 IP 放进源码、截图或 `public/`。
- 证书公开前必须脱敏，并确认公开授权。
- 项目描述使用事实陈述，不用无法证明的“行业领先”“效率提升数倍”等宣传措辞。
- `materials/` 不是保密仓库；敏感凭据不应依赖 `.gitignore` 保存。

智光耀城页面必须保留两项限定：当前设备、遥测、控制结果和告警均为模拟数据，不连接真实灯杆；`195 / 425 / 9` 是 `2026-07-21` 的归档验收基线。`npm run audit:content` 会检查这些语句。

明确设计为公开体验的演示账号可以进入 `works.ts` 的 `demoAccounts`，但必须由负责人确认其公开用途、数据隔离和可撤销性。演示账号不得复用真实生产凭据，页面必须提示访客不要写入个人或敏感信息；账号权限或密码变化后应立即同步内容并重新验证登录。

## 图片流程

公开素材从 `materials/` 进入 `public/images/` 前必须人工审查：

1. 查看原图完整尺寸，确认没有账号、主机名、Token、IP、个人信息或未授权人物。
2. 证书先由负责人完成手动去隐并逐张核对，再覆盖 `materials/certs` 中的本地归档源；不要让发布脚本猜测遮挡区域。
3. 将允许公开的文件显式加入 `scripts/publish-material-images.mjs`，运行 `npm run images:publish-materials` 生成 WebP。脚本只处理白名单，不扫描并复制整个 `materials/`。
4. 页面使用 `next/image`，为响应式图片提供准确的 `sizes`；纯装饰图使用空 `alt`。
5. 运行 `npm run audit:images`，确认部署树没有旧栅格或未引用资产，再核对裁切、清晰度和替代文本。

`materials/` 被 Git 忽略，发布脚本只适用于持有本地材料的维护环境。`npm run images:optimize` 仍用于清理已经进入 `public/images` 的旧 PNG/JPG，不替代白名单发布流程。

`public/images/` 只保留当前页面确实引用的资产。未引用原件、历史截图和内部材料留在 `materials/`，避免通过静态 URL 意外公开。

不要对证书、项目界面或实拍图做会改变事实内容的生成式编辑。格式转换、裁切和必要的隐私遮挡可以进行，但要保留原件与处理说明。

## 中文标题字体

正文中文使用系统字体；只有标题中文使用自托管子集。字符清单由源码自动提取，不手工维护。

常规内容修改先运行：

```bash
npm run fonts:check
```

出现缺字时，准备原始字体并重新生成：

```powershell
python -m pip install fonttools brotli
$env:YFY_HEADING_FONT_SOURCE = "D:\Fonts\NotoSerifSC-VariableFont_wght.ttf"
npm run fonts:subset
npm run fonts:check
```

生成物包含网页使用的 WOFF2 和动态 OG 使用的 TTF/WOFF。CI 会检查字符覆盖和 WOFF2 小于 40KB。字体文件的授权必须允许当前用途。

## 修改后的验证范围

| 变更 | 至少验证 |
| :--- | :--- |
| 普通文案 | `npm run check` + 受影响页面 |
| 页面标题、方向名、作品名 | 上述检查 + `npm run fonts:check` + OG 卡片 |
| Schema 或报名字段 | 单元测试、表单、`POST /api/join`、通知模板与脱敏日志 |
| 图片 | `npm run audit:images` + 320px/390px/桌面显示 + 明暗主题 |
| QQ 群号或招新入口 | 深链、复制群号、二维码长按识别和页脚入口 |
| SEO 文案或正式域名 | canonical、sitemap、robots、JSON-LD、OG/Twitter |

历史内容模型和素材收集过程可查阅 [v4 内容基线](archive/trajectory-v4/04-CONTENT.md)，但当前页面事实始终以 `src/content/` 为准。
