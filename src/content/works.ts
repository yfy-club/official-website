import type { Work } from "./schema";

export const worksRaw = [
  {
    slug: "matrix-calculator",
    nameZh: "矩阵计算器 · 精确有理数",
    nameEn: "Exact Rational Matrix Calculator",
    status: "已上线",
    tagline: "以 BigInt 有理数为内核的纯前端矩阵计算器，整个计算过程零浮点误差。",
    liveUrl: "https://atelier.luck007.online/",
    period: "2026-01 — 2026-07",
    trackSlugs: ["software"],
    image: "/images/works/matrix-calculator/matrix-light.webp",
    logo: "/images/works/matrix-calculator/matrix-logo.svg",
    stackSummary: ["Vue 3", "TypeScript", "Vite", "BigInt", "fast-check"],
    highlights: [
      "Bareiss 消元抑制中间分数膨胀",
      "Faddeev–LeVerrier 计算特征多项式",
      "性质测试与独立 Python 交叉验证",
    ],
    detail: {
      problem: [
        "常见矩阵工具依赖浮点数，像 0.1 + 0.2 这样的计算会产生不可避免的表示误差；连续消元后，微小误差还可能被进一步放大。",
        "这个项目把整数分子、分母都交给 BigInt 保存，并在每一步做约分。行列式、逆矩阵与行最简形因此可以给出精确分数，而不是看似整齐的近似小数。",
      ],
      stack: {
        "交互界面": ["Vue 3", "TypeScript", "Vite"],
        "计算内核": ["BigInt 有理数", "Bareiss 消元", "Faddeev–LeVerrier"],
        "质量保障": ["Vitest", "fast-check", "Python 交叉验证"],
      },
      decisions: [
        {
          what: "行列式采用 Bareiss 消元",
          why: "在保持精确的同时抑制中间分数膨胀，避免无谓的大整数开销。",
        },
        {
          what: "特征多项式采用 Faddeev–LeVerrier",
          why: "算法可以直接建立在精确有理数运算之上，不必混入浮点近似。",
        },
        {
          what: "core 与 algorithms 不依赖 Vue",
          why: "计算内核可以脱离界面独立测试，也让算法错误更容易定位。",
        },
        {
          what: "行变换保存为事件",
          why: "不为每一步复制完整矩阵，长推导过程更节省内存。",
        },
      ],
      evidence: [
        { label: "代数性质", value: "RREF 幂等 · det(AB)=det(A)det(B) · A·A⁻¹=I · PA=LU" },
        { label: "随机验证", value: "fast-check 性质测试" },
        { label: "独立实现", value: "Python 交叉验证" },
      ],
      limits: [
        "通用矩阵输入上限为 100×100，伴随矩阵计算限制在 8 阶以内。",
        "MathJax 资源经 CDN 加载；离线环境下公式排版可能无法完整呈现。",
        "特征值、QR 与 SVD 没有混入有理数内核，当前版本不把近似数值算法伪装成精确计算。",
      ],
      shots: {
        dark: "/images/works/matrix-calculator/matrix-dark.webp",
        light: "/images/works/matrix-calculator/matrix-light.webp",
        alt: "矩阵计算器明暗主题主界面，包含矩阵输入区与精确分数计算结果",
      },
    },
  },
  {
    slug: "zgyc-smart-light",
    nameZh: "智光耀城 · 智慧路灯管理平台",
    nameEn: "Zhi Guang Yao Cheng",
    status: "已上线",
    tagline: "面向城市道路照明与智慧多功能灯杆的 PC 端综合管理与试点展示平台。",
    liveUrl: "https://zht.makeup/",
    trackSlugs: ["software", "database", "cloud-iot"],
    image: "/images/works/zgyc-smart-light/zgyc-light.webp",
    logo: "/images/works/zgyc-smart-light/zgyc-logo.svg",
    stackSummary: ["Java 21", "Spring Boot 3.5", "Vue 3", "TypeScript", "PostgreSQL"],
    highlights: [
      "灯杆档案、实时遥测、地图监控与远程控制",
      "告警处置、工单流转与审计留痕三条闭环",
      "OpenAPI → Orval 契约生成与 SSE 业务事件推送",
    ],
    detail: {
      problem: [
        "城市照明运维同时涉及区域、灯杆、逻辑设备、遥测、控制记录、告警与工单。信息分散时，定位问题与追踪处置过程都很困难。",
        "智光耀城用一套 PC 管理界面串起资产、监控、控制、告警和运维流程，用模拟数据验证这些业务关系与闭环是否成立。",
      ],
      stack: {
        "后端服务": ["Java 21", "Spring Boot 3.5", "Flyway", "SSE"],
        "前端应用": ["Vue 3", "TypeScript", "Vite", "Orval"],
        "数据与验证": ["PostgreSQL", "Vitest", "Playwright", "OpenAPI"],
      },
      decisions: [
        {
          what: "OpenAPI 生成 Orval 客户端",
          why: "接口契约保持单一真源，减少前后端手写类型和请求代码的漂移。",
        },
        {
          what: "SSE 推送业务事件",
          why: "告警与遥测变化可以及时抵达界面，不依赖固定频率轮询。",
        },
        {
          what: "Flyway 管理数据库迁移",
          why: "结构变化可追踪、可复现，避免不同环境依赖手工改表。",
        },
        {
          what: "围绕三条业务闭环组织模块",
          why: "远程控制、告警处置和工单流转都有起点、过程与结果留痕。",
        },
      ],
      evidence: [
        { label: "后端测试", value: "195 项" },
        { label: "前端测试", value: "425 项" },
        { label: "端到端测试", value: "9 条 Playwright 场景" },
        { label: "验收口径", value: "2026-07-21 归档验收基线" },
      ],
      limits: [
        "当前全部设备、遥测、控制结果和告警均为模拟数据，不连接真实灯杆。",
        "195 / 425 / 9 是 2026-07-21 的归档验收基线，不代表线上版本持续通过的实时统计。",
        "平台用于业务闭环与试点展示，不把模拟环境描述为已接入真实城市物联网设施。",
      ],
      shots: {
        dark: "/images/works/zgyc-smart-light/zgyc-light.webp",
        alt: "智光耀城平台概览界面，展示区域、设备与照明运维数据",
      },
    },
  },
  {
    slug: "intellibuddy",
    nameZh: "智学伴 · AI 智能学习平台",
    nameEn: "IntelliBuddy",
    status: "已上线",
    tagline: "集 AI 助教、交互式知识图谱、学习路径规划和数据看板于一体的智能助学平台。",
    liveUrl: "https://intellibuddy.luck007.online/",
    trackSlugs: ["ai", "software"],
    image: "/images/works/zhixueban/zhixueban-light.webp",
    logo: "/images/works/zhixueban/zhixueban-logo.webp",
    stackSummary: ["Vue 3", "TypeScript", "Express", "MongoDB", "AntV X6"],
    highlights: [
      "AI 智能助教与 SSE 流式对话",
      "AntV X6 交互式知识图谱与动态依赖高亮",
      "多模型容灾降级调度与 Monorepo 架构",
    ],
  },
  {
    slug: "resistor-inspection",
    nameZh: "电阻片电压智能检测与码垛系统",
    status: "在研",
    tagline: "使用工业相机识别圆心坐标，联动机械臂完成吸取、分拣与码垛验证。",
    trackSlugs: ["ai", "industrial"],
    stackSummary: ["机器视觉", "工业相机", "机械臂"],
    highlights: [],
  },
  {
    slug: "pv-defect-detection",
    nameZh: "无人机光伏板缺陷检测系统",
    status: "在研",
    tagline: "基于 YOLOv9 与无人机航拍图像，探索组件热斑和物理破损的智能巡检。",
    trackSlugs: ["ai", "industrial"],
    stackSummary: ["YOLOv9", "无人机航拍", "目标检测"],
    highlights: [],
  },
  {
    slug: "oral-infection-control",
    nameZh: "口腔感控设备辅助系统",
    status: "在研",
    tagline: "结合物联网感知与医疗器械消毒监测，验证数智化辅助管理流程。",
    trackSlugs: ["cloud-iot", "industrial"],
    stackSummary: ["物联网感知", "设备监测", "数据管理"],
    highlights: [],
  },
] satisfies Work[];
