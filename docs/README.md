# 项目文档

本目录只放当前长期维护所需的文档。历史设计与阶段规划形成的 `00` 至 `11` 号文档已归档到 [`archive/trajectory-v4/`](archive/trajectory-v4/README.md)，用于追溯产品、设计和技术决策，不再承担当前进度管理。

## 从这里开始

| 文档 | 作用 | 何时阅读 |
| :--- | :--- | :--- |
| [根 README](../README.md) | 项目入口、技术架构、快速开始、常用命令 | 第一次打开仓库 |
| [CONTRIBUTING](../CONTRIBUTING.md) | 修改、验证和评审约定 | 准备修改代码或内容 |
| [STATUS](STATUS.md) | 当前基线、已知问题、上线核对项 | 接手任务或排优先级 |
| [ARCHITECTURE](ARCHITECTURE.md) | 系统边界、路由策略、数据流和实现约束 | 修改核心组件或服务端逻辑 |
| [CONTENT](CONTENT.md) | 内容、图片、字体与真实性维护流程 | 更新社团资料或视觉素材 |
| [QUALITY](QUALITY.md) | 自动门禁、性能预算、测试矩阵 | 提交前或排查 CI |
| [OPERATIONS](OPERATIONS.md) | 环境变量、部署流程、上线与回滚清单 | 准备预览或正式上线 |

## 文档层级

遇到冲突时按以下优先级判断：

1. 源码、配置、测试和构建结果描述当前真实行为。
2. 本目录的活跃文档描述当前维护方式和待办事项。
3. [`archive/trajectory-v4/`](archive/trajectory-v4/README.md) 解释设计背景与历史决策。

产品事实的单一真源是 `src/content/`，设计数值的单一真源是 `design/tokens.css`。不要在文档中复制会漂移的数据。

## 目录结构

```text
docs/
├── README.md
├── STATUS.md
├── ARCHITECTURE.md
├── CONTENT.md
├── QUALITY.md
├── OPERATIONS.md
└── archive/
    └── trajectory-v4/
        ├── README.md
        └── 00-PRD.md ... 11-NEXT-PHASE.md
```

## 维护规则

| 文档 | 必须更新的触发条件 |
| :--- | :--- |
| `STATUS.md` | 完成功能里程碑、发现或关闭问题、测试状态变化 |
| `ARCHITECTURE.md` | 路由、运行时、数据流、依赖边界或目录职责变化 |
| `CONTENT.md` | 内容结构、素材流程、字体流程或真实性规则变化 |
| `QUALITY.md` | 命令、测试覆盖、性能预算或浏览器支持变化 |
| `OPERATIONS.md` | 部署平台、域名、密钥、通知渠道、监控或回滚方式变化 |

- 不在 `docs/` 根目录新增编号文档；新文档按长期职责命名。
- 同一规则只保留一个维护位置，其他文档使用链接引用。
- 归档文档原则上不再改写，仅维护链接完整性。
- 临时调查过程记录在 Issue、PR 或提交说明中，不沉淀为长期文档。
- 修改 Markdown 后运行 `npm run audit:docs`；完整提交前门禁为 `npm run check`。
