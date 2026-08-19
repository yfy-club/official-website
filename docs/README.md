# 项目文档

本目录只放当前维护所需的文档。YFY v4 / Trajectory 在设计与实施阶段形成的 `00` 至 `10` 号文档已整体归档到 [`archive/trajectory-v4/`](archive/trajectory-v4/README.md)，用于追溯产品、设计和技术决策，不再承担当前进度管理。

## 从这里开始

| 文档 | 作用 | 何时阅读 |
| :--- | :--- | :--- |
| [根 README](../README.md) | 项目入口、快速开始、常用命令 | 第一次打开仓库 |
| [CONTRIBUTING](../CONTRIBUTING.md) | 修改、验证和评审约定 | 准备改代码或内容 |
| [STATUS](STATUS.md) | 当前基线、已知问题、上线阻塞项 | 接手任务或排优先级 |
| [NEXT-PHASE](NEXT-PHASE.md) | 下一阶段范围、实施顺序与验收标准 | 开始新一轮功能开发 |
| [ARCHITECTURE](ARCHITECTURE.md) | 现行系统边界、路由、数据流和实现约束 | 修改共享行为或服务端逻辑 |
| [CONTENT](CONTENT.md) | 内容、图片、字体与真实性维护流程 | 更新社团资料或视觉素材 |
| [QUALITY](QUALITY.md) | 自动门禁、性能预算、人工测试矩阵 | 提交前或排查 CI |
| [OPERATIONS](OPERATIONS.md) | 环境变量、部署决策、上线与回滚清单 | 准备预览或正式上线 |

## 文档层级

遇到冲突时按以下优先级判断：

1. 源码、配置、测试和构建结果描述当前真实行为。
2. 本目录的活跃文档描述当前维护方式和待办事项。
3. [`archive/trajectory-v4/`](archive/trajectory-v4/README.md) 解释 v4 的设计背景与历史决策。

产品事实的单一真源是 `src/content/`，设计数值的单一真源是 `design/tokens.css`。不要为了让文档“看起来一致”而在文档里复制一套会漂移的数据。

## 目录结构

```text
docs/
├── README.md
├── STATUS.md
├── NEXT-PHASE.md
├── ARCHITECTURE.md
├── CONTENT.md
├── QUALITY.md
├── OPERATIONS.md
└── archive/
    └── trajectory-v4/
        ├── README.md
        └── 00-PRD.md ... 10-M2-NOTES.md
```

## 维护规则

| 文档 | 必须更新的触发条件 |
| :--- | :--- |
| `STATUS.md` | 完成里程碑、发现或关闭阻塞项、远端 CI 状态变化 |
| `NEXT-PHASE.md` | 阶段目标、范围、顺序或验收标准变化 |
| `ARCHITECTURE.md` | 路由、运行时、数据流、依赖边界或目录职责变化 |
| `CONTENT.md` | 内容 Schema、素材流程、字体流程或真实性规则变化 |
| `QUALITY.md` | npm 命令、测试覆盖、性能预算或浏览器支持变化 |
| `OPERATIONS.md` | 部署平台、域名、Secret、通知渠道、监控或回滚方式变化 |

- 不再在 `docs/` 根目录新增编号文档；新文档按长期职责命名。
- 同一规则只保留一个维护位置，其他文档使用链接引用。
- 归档文档原则上不再改写，只修断链或清除不应保留的敏感信息。
- 临时调查过程放在 Issue、PR 或提交说明中，不沉淀为长期文档。
- 修改 Markdown 后运行 `npm run audit:docs`；完整提交前门禁仍是 `npm run check`。
