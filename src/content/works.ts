import type { Work } from "./schema";

export const worksRaw = [
  {
    slug: "matrix-calculator",
    nameZh: "矩阵计算器 · 精确有理数",
    nameEn: "Exact Rational Matrix Calculator",
    status: "已上线",
    tagline: "以 BigInt 有理数为内核的纯前端矩阵计算引擎，全程零浮点误差与事件流步进推导。",
    liveUrl: "https://atelier.luck007.online/",
    period: "2026-01 — 2026-07",
    trackSlugs: ["software"],
    image: "/images/works/matrix-calculator/matrix-light.webp",
    logo: "/images/works/matrix-calculator/matrix-logo.svg",
    stackSummary: ["Vue 3", "TypeScript", "Vite", "BigInt", "fast-check"],
    highlights: [
      "BigInt 动态约分有理数内核，彻底杜绝浮点精度截断误差",
      "Bareiss 无除法消元算法，有效抑制中间分数行列式膨胀",
      "Faddeev–LeVerrier 纯代数迹算法求解特征多项式与伴随矩阵",
      "基于代数公理的 fast-check 属性模糊测试与独立 Python 交叉核验",
    ],
    detail: {
      problem: [
        "常见科学计算工具底层广泛依赖双精度浮点数（IEEE 754），在多次初等行变换与高阶消元过程中，微小舍入误差会发生级联放大，导致原本为 0 的主元出现 1e-16 伪非零项，进而破坏行最简形（RREF）与特征值的数学严密性。",
        "本项目采用纯前端 BigInt 有理数作为统一数值内核，在四则运算各阶段实时执行欧几里得最大公约数约分。不论是高阶行列式、逆矩阵求解还是特征多项式展开，均能给出纯粹的精确分数表示与完整的行变换推导过程。",
      ],
      stack: {
        "交互界面": ["Vue 3", "TypeScript", "Vite", "Tailwind CSS"],
        "计算内核": ["BigInt 有理数", "Bareiss 无除法消元", "Faddeev–LeVerrier"],
        "工程验证": ["Vitest", "fast-check 属性测试", "Python 交叉比对"],
      },
      decisions: [
        {
          what: "行列式采用 Bareiss 无除法消元算法",
          why: "避免普通高斯消元在中间步骤中产生复杂的分子分母激增，全程在整数环上进行无除法消元，大幅削减大整数 GCD 约分开销。",
        },
        {
          what: "特征多项式采用 Faddeev–LeVerrier 迹算法",
          why: "算法完全建立在矩阵幂次、迹与精确有理数加乘运算之上，无需依赖可能引入截断误差的浮点迭代近似算法。",
        },
        {
          what: "计算内核（Core & Algorithms）与 Vue 视图完全解耦",
          why: "底层算法库零外部运行时依赖，可在 Node/Web Worker/CLI 环境中独立进行代数性质模糊测试与跨端复用。",
        },
        {
          what: "矩阵变换推导采用事件溯源（Event Sourcing）模式",
          why: "仅记录单步初等行变换的操作元数据，无需在解题推导每一步复制全量矩阵对象，大幅优化长流程内存占用。",
        },
      ],
      metrics: [
        { label: "浮点精度误差", value: "0", description: "全流程 BigInt 有理数动态约分，无 IEEE 754 截断误差" },
        { label: "最大矩阵阶数", value: "100×100", description: "支持百阶稀疏/稠密矩阵的精确有理数行变换与解方程" },
        { label: "代数公理验证", value: "fast-check", description: "自动化验证 RREF 幂等性、可逆性 A·A⁻¹=I 及行列式乘法公式" },
        { label: "内核依赖耦合", value: "0 运行时依赖", description: "纯 TypeScript 数学库，脱离 UI 框架独立测试与高效打包" },
      ],
      tradeoffs: [
        {
          title: "坚持代数精确性，拒绝混入浮点近似",
          detail: "对于无法由有理数精确闭式表达的谱分解（如数值特征值、SVD、QR 迭代），当前版本选择不混入浮点近似，保证所有展示结论均满足数理严密性。",
        },
        {
          title: "阶数保护策略与算力边界控制",
          detail: "伴随矩阵算法复杂度随阶数呈指数增长，系统将伴随矩阵与符号特征多项式输入阶数控制在 8 阶以内，避免前端单线程长时间阻塞 UI 渲染。",
        },
      ],
      shots: {
        type: "comparison",
        dark: "/images/works/matrix-calculator/matrix-dark.webp",
        light: "/images/works/matrix-calculator/matrix-light.webp",
        alt: "矩阵计算器明暗主题主界面，包含矩阵输入区与精确分数计算结果",
      },
      gallery: [
        {
          label: "精确推导过程",
          description: "明暗主题下都完整保留行变换步骤、精确分数与中间结果。",
          shot: {
            type: "comparison",
            dark: "/images/works/matrix-calculator/matrix-trace-dark.webp",
            light: "/images/works/matrix-calculator/matrix-trace-light.webp",
            alt: "矩阵计算器解题推导过程，展示精确分数与逐步行变换",
          },
        },
      ],
    },
  },
  {
    slug: "zgyc-smart-light",
    nameZh: "智光耀城 · 智慧路灯管理平台",
    nameEn: "Zhi Guang Yao Cheng",
    status: "已上线",
    tagline: "面向城市道路照明与智慧多功能灯杆的 PC 端综合管控与数字孪生运维平台。",
    liveUrl: "https://zht.makeup/",
    trackSlugs: ["software", "database", "cloud-iot"],
    image: "/images/works/zgyc-smart-light/zgyc-light.webp",
    logo: "/images/works/zgyc-smart-light/zgyc-logo.svg",
    stackSummary: ["Java 21", "Spring Boot 3.5", "Vue 3", "TypeScript", "PostgreSQL"],
    highlights: [
      "灯杆资产全生命周期档案、实时遥测监控与高德地图拓扑联动",
      "远程单灯/回路控制、多策略照明编排与端到端状态机留痕",
      "OpenAPI → Orval 严格契约类型生成与 SSE 响应式业务事件推送",
      "Flyway 自动化数据库版本迁移与全方位操作审计追踪",
    ],
    detail: {
      problem: [
        "城市级道路照明运维系统面临空间跨度大、挂载设备（灯具、单灯控制器、传感器）异构度高、遥测并发密度大的挑战，传统架构往往因接口散乱、轮询开销大而导致状态同步延迟与运维溯源困难。",
        "智光耀城构建了覆盖资产档案、实时遥测、地图态势感知、策略化远程控制、告警流转与工单处置的完整数字化底座，并通过内置的高拟真 Mock 遥测引擎完成生产级闭环链路联调。",
      ],
      stack: {
        "后端微服务": ["Java 21", "Spring Boot 3.5", "Sa-Token", "SSE"],
        "前端管理台": ["Vue 3", "TypeScript", "Vben Admin 5", "Orval", "ECharts"],
        "数据与基础设施": ["PostgreSQL 17", "Flyway", "Docker Compose", "高德地图 API"],
      },
      decisions: [
        {
          what: "OpenAPI 契约单一真源与 Orval 客户端自动生成",
          why: "消除前后端手写接口类型和网络请求的样板代码，接口契约变动时编译器即可捕获类型漂移。",
        },
        {
          what: "基于 Server-Sent Events (SSE) 的响应式事件总线",
          why: "设备遥测波动与实时告警毫秒级推送至 Web 端，彻底替代高开销的定时短轮询机制。",
        },
        {
          what: "Flyway 全流程数据库版本迁移演进",
          why: "将 PostgreSQL 结构变更、索引优化与种子数据代码化追踪，保障多环境自动化部署一致性。",
        },
        {
          what: "三条核心业务链路端到端闭环建模",
          why: "针对资产遥测、远程控制、告警工单三大高频运维流程建立状态机模型与审计凭证追踪。",
        },
      ],
      metrics: [
        { label: "核心业务闭环", value: "3 条", description: "覆盖资产遥测、策略控制与告警工单端到端全生命周期" },
        { label: "前后端契约同步", value: "100% 自动代码化", description: "Spring Boot OpenAPI 规范驱动 Orval 自动化生成 TypeScript 客户端" },
        { label: "实时事件推送", value: "SSE 毫秒级总线", description: "下发设备在线态、遥测越限与告警事件，无需客户端轮询" },
        { label: "数据库版本演进", value: "Flyway 追踪", description: "PostgreSQL 表结构定义与系统初始化数据全量版本受控" },
      ],
      tradeoffs: [
        {
          title: "高拟真 Mock 设备引擎的架构权衡",
          detail: "为在无物理设备环境下完整验证分布式控制协议与告警状态机，平台自研了多工况时序模拟器，真实还原边缘设备网络抖动与异常反馈链路。",
        },
        {
          title: "操作可溯性与生产级审计机制",
          detail: "平台针对关键照明控制策略下发、告警人工干预与工单分派进行了双向操作日志与登录日志持久化，满足城市照明基础设施的高安全性合规要求。",
        },
      ],
      demoAccounts: [
        { role: "超级管理员", account: "admin", password: "AdminPass2026!", access: "完整管理端功能演示" },
      ],
      shots: {
        type: "single",
        image: "/images/works/zgyc-smart-light/zgyc-light.webp",
        alt: "智光耀城平台概览界面，展示区域、设备与照明运维数据",
      },
      galleryMode: "tour",
      gallery: [
        {
          group: "运行总览",
          label: "地图监控",
          description: "在城市地图上集中查看灯杆分布、区域状态与设备概况。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-feature-map.webp", alt: "智光耀城地图监控界面" },
        },
        {
          group: "告警与工单",
          label: "告警中心",
          description: "按等级、来源和处置状态汇总设备告警，保留完整处理上下文。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-alarm-center.webp", alt: "智光耀城告警中心界面" },
        },
        {
          group: "告警与工单",
          label: "告警规则",
          description: "集中配置触发条件与告警等级，让遥测异常进入统一处置流程。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-alarm-rules.webp", alt: "智光耀城告警规则配置界面" },
        },
        {
          group: "告警与工单",
          label: "工单流转",
          description: "从告警发现、派单到处理完成记录运维闭环。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-work-orders.webp", alt: "智光耀城运维工单界面" },
        },
        {
          group: "资产档案",
          label: "智慧灯杆资产",
          description: "以设备档案承载灯杆位置、状态和关联逻辑设备。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-asset-smart-pole.webp", alt: "智光耀城智慧灯杆资产界面" },
        },
        {
          group: "资产档案",
          label: "区域资产",
          description: "按行政或试点区域组织灯杆资产与运维责任边界。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-asset-regions.webp", alt: "智光耀城区域资产界面" },
        },
        {
          group: "资产档案",
          label: "逻辑设备",
          description: "拆分灯具、传感器等逻辑设备，保持资产关系可追踪。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-asset-logical-devices.webp", alt: "智光耀城逻辑设备资产界面" },
        },
        {
          group: "监测与控制",
          label: "实时遥测",
          description: "聚合设备运行数据与状态变化，支持异常定位。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-monitor-realtime.webp", alt: "智光耀城实时遥测监控界面" },
        },
        {
          group: "监测与控制",
          label: "远程控制记录",
          description: "记录控制指令、执行状态和操作结果，形成审计依据。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-monitor-controls.webp", alt: "智光耀城远程控制记录界面" },
        },
        {
          group: "监测与控制",
          label: "照明策略",
          description: "按时段与业务条件编排照明规则，验证策略化控制流程。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-lighting-policy.webp", alt: "智光耀城照明策略界面" },
        },
        {
          group: "权限与审计",
          label: "用户管理",
          description: "维护平台用户状态与基础身份信息。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-sys-users.webp", alt: "智光耀城系统用户管理界面" },
        },
        {
          group: "权限与审计",
          label: "角色权限",
          description: "用角色组织平台访问边界，降低权限配置漂移。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-sys-roles.webp", alt: "智光耀城角色权限界面" },
        },
        {
          group: "权限与审计",
          label: "操作日志",
          description: "归档关键后台操作，支持问题追溯与责任核验。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-sys-op-log.webp", alt: "智光耀城系统操作日志界面" },
        },
        {
          group: "权限与审计",
          label: "登录日志",
          description: "记录登录时间与结果，为访问审计提供基础证据。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-sys-login-log.webp", alt: "智光耀城系统登录日志界面" },
        },
        {
          group: "权限与审计",
          label: "身份认证",
          description: "以独立登录入口承接平台身份验证与访问控制。",
          shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-login.webp", alt: "智光耀城登录界面" },
        },
      ],
    },
  },
  {
    slug: "intellibuddy",
    nameZh: "智学伴 · AI 智能学习平台",
    nameEn: "IntelliBuddy",
    status: "已上线",
    tagline: "集 AI 助教、交互式知识图谱、学习路径规划与数据看板于一体的智能助学平台。",
    liveUrl: "https://intellibuddy.luck007.online/",
    trackSlugs: ["ai", "software"],
    image: "/images/works/zhixueban/zhixueban-light.webp",
    logo: "/images/works/zhixueban/zhixueban-logo.webp",
    stackSummary: ["Vue 3", "TypeScript", "Express", "MongoDB", "AntV X6"],
    highlights: [
      "AntV X6 交互式知识拓扑图谱与先修依赖关系动态高亮",
      "大模型 SSE 双轨流式打字机响应与多轮上下文追问",
      "多模型容灾降级调度池与链路健康度自动嗅探",
      "全栈 TypeScript Monorepo 模块化架构与共享类型契约",
    ],
    detail: {
      problem: [
        "传统在线学习平台往往采用线性目录组织知识点，难以直观展现概念之间的先修约束与网状依赖；而纯对话式 AI 工具容易出现知识发散或幻觉，缺乏可探索的结构化学习主线。",
        "智学伴将 AntV X6 知识拓扑图谱与大模型流式助教深度协同：学生既可通过图谱清晰把握技术全貌与前置依赖，又能随时调起具备上下文记忆的 AI 助手针对具体难点进行沉浸式交互学习。",
      ],
      stack: {
        "前端应用": ["Vue 3", "TypeScript", "Vite", "AntV X6", "Pinia"],
        "服务端与模型": ["Node.js", "Express", "MongoDB", "SSE", "多模型调度池"],
        "工程与协作": ["pnpm Monorepo", "共享类型契约", "ESLint", "Prettier"],
      },
      decisions: [
        {
          what: "基于 AntV X6 构建交互式知识依赖图谱",
          why: "直观呈现知识点网状依赖拓扑，支持节点状态高亮、先修路径追踪与自适应力导向排版。",
        },
        {
          what: "大模型 SSE 双向流式打字机响应",
          why: "Token 级推理结果即时渲染，显著降低长篇代码与原理推导等待时的感知延迟。",
        },
        {
          what: "多模型容灾降级调度机制",
          why: "在上游主力大模型接口出现限流或抖动时，毫秒级无缝降级至备用模型池，保证服务高可用。",
        },
        {
          what: "基于 Monorepo 组织前后端工程与类型契约",
          why: "前后端共享数据契约接口与通用工具库，降低跨模块协作中的版本脱节风险。",
        },
      ],
      metrics: [
        { label: "知识图谱交互", value: "AntV X6 拓扑", description: "支持复杂网状有向图拓扑渲染、先修节点高亮与层级折叠" },
        { label: "AI 对话响应", value: "SSE 流式打字机", description: "逐 Token 流式到达，支持连续多轮技术追问与上下文自适应" },
        { label: "模型可用性保障", value: "多源容灾调度", description: "主备模型池自适应切换，抗击单点 API 限流与网络抖动" },
        { label: "全栈架构模式", value: "Monorepo 共享契约", description: "前后端统一 TypeScript 类型定义与构建流水线" },
      ],
      tradeoffs: [
        {
          title: "图谱结构化导航优先于自由生成",
          detail: "坚持以权威知识库作为图谱锚点，AI 对话紧密挂载于具体节点上下文，避免大语言模型在无约束发散中产生知识幻觉。",
        },
        {
          title: "多角色空间与渐进式功能分级",
          detail: "系统设计了普通学生、高级学员到教师端的 RBAC 权限体系，将练习测验、学习报告与管理面板进行分级隔离与清晰授权。",
        },
      ],
      demoAccounts: [
        { role: "普通学生", account: "student@intellibuddy.com", password: "Demo2025", access: "日常学习、AI 助教、测验系统" },
        { role: "高级学生", account: "advanced@intellibuddy.com", password: "Demo2025", access: "数据分析、成就系统、学习报告" },
        { role: "VIP 会员", account: "vip@intellibuddy.com", password: "Demo2025", access: "完整功能体验；会员特权、积分商城为后续方向" },
        { role: "教师", account: "teacher@intellibuddy.com", password: "Demo2025", access: "教师功能体验；班级管理、作业布置为后续方向" },
        { role: "新用户", account: "newuser@intellibuddy.com", password: "Demo2025", access: "新手引导、从零开始体验" },
      ],
      shots: {
        type: "comparison",
        dark: "/images/works/zhixueban/zhixueban-dark.webp",
        light: "/images/works/zhixueban/zhixueban-light.webp",
        alt: "智学伴 AI 智能学习平台明暗主题主页",
      },
      gallery: [
        {
          label: "AI 智能助教",
          description: "通过流式对话承接学习问题，并保留连续追问的上下文。",
          shot: { type: "single", image: "/images/works/zhixueban/zhixueban-ai-chat.webp", alt: "智学伴 AI 智能助教对话界面" },
        },
        {
          label: "知识图谱与路线",
          description: "用交互节点呈现知识点依赖关系和阶段学习路线。",
          shot: { type: "single", image: "/images/works/zhixueban/zhixueban-roadmap.webp", alt: "智学伴 AntV X6 知识图谱与学习路线界面" },
        },
        {
          label: "知识库阅读",
          description: "将结构化正文与图谱节点连接，支持从关系视图回到具体内容。",
          shot: { type: "single", image: "/images/works/zhixueban/zhixueban-knowledge.webp", alt: "智学伴知识库正文阅读界面" },
        },
        {
          label: "登录认证",
          description: "独立认证入口承接用户身份与个人学习空间。",
          shot: { type: "single", image: "/images/works/zhixueban/zhixueban-login.webp", alt: "智学伴平台登录认证界面" },
        },
      ],
    },
  },
  {
    slug: "resistor-inspection",
    nameZh: "电阻片电压智能检测与码垛系统",
    status: "在研",
    tagline: "面向工业产线电阻片精密检测场景，使用工业相机识别特征圆心坐标，联动机械臂完成高精抓取、分拣与多工位码垛验证。",
    trackSlugs: ["ai", "industrial"],
    stackSummary: ["机器视觉", "工业相机", "机械臂"],
    highlights: [
      "工业级双目定位与亚毫米级圆心坐标提取算法",
      "六轴机械臂动态轨迹规划与气动吸附多工位码垛",
      "端侧嵌入式工控机与 PLC 实时工业通信闭环联调",
    ],
  },
  {
    slug: "pv-defect-detection",
    nameZh: "无人机光伏板缺陷检测系统",
    status: "在研",
    tagline: "基于 YOLOv9 与无人机高空航拍图像，实现对集中式光伏电站组件热斑、隐裂与异物遮挡的大规模自主智能巡检。",
    trackSlugs: ["ai", "industrial"],
    stackSummary: ["YOLOv9", "无人机巡检", "目标检测"],
    highlights: [
      "红外热成像与可见光航拍多波段多尺度特征融合",
      "微小局部热斑、物理隐裂与异物遮挡多标签检测",
      "针对机载边缘计算设备的轻量化模型蒸馏加速",
    ],
  },
  {
    slug: "oral-infection-control",
    nameZh: "口腔感控设备辅助系统",
    status: "在研",
    tagline: "结合物联网多维时序传感与医疗器械消毒监测，构建符合卫监规范的口腔诊疗器械全生命周期数字化追踪管理流程。",
    trackSlugs: ["cloud-iot", "industrial"],
    stackSummary: ["物联网感知", "设备监测", "外部管理"],
    highlights: [
      "高温高压灭菌全流程温湿度与压力时序数据采集",
      "多协议传感器边缘网关接入与运行异常瞬时告警",
      "清洗消毒包装至发放全生命周期追溯合规数字化报表",
    ],
  },
] satisfies Work[];
