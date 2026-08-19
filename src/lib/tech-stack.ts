export type TechMeta = {
  description: string;
  name: string;
  url: string;
};

export const TECH_STACK_MAP: Record<string, TechMeta> = {
  "Vue 3": {
    name: "Vue 3",
    url: "https://cn.vuejs.org/guide/quick-start.html",
    description: "渐进式 JavaScript 框架，具备组合式 API 与极佳的运行时性能。",
  },
  "TypeScript": {
    name: "TypeScript",
    url: "https://www.typescriptlang.org/zh/",
    description: "带类型语法的 JavaScript，让大型工程架构与接口契约更健壮。",
  },
  "Vite": {
    name: "Vite",
    url: "https://cn.vitejs.dev/",
    description: "下一代前端开发与构建工具，极速冷启动与毫秒级热更新。",
  },
  "BigInt": {
    name: "BigInt",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt",
    description: "JavaScript 原生任意精度整数类型，保证代数推导过程零浮点误差。",
  },
  "fast-check": {
    name: "fast-check",
    url: "https://fast-check.dev/",
    description: "TypeScript 属性测试框架，通过海量随机输入自动化探测数学边界缺陷。",
  },
  "Java 21": {
    name: "Java 21",
    url: "https://docs.oracle.com/en/java/javase/21/",
    description: "长期支持版 Java，引入虚拟线程与现代化强类型语法体系。",
  },
  "Spring Boot 3.5": {
    name: "Spring Boot",
    url: "https://spring.io/projects/spring-boot",
    description: "现代化 Java 生产级微服务与企业后端开发全栈框架。",
  },
  "PostgreSQL": {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/",
    description: "强大、高度可扩展且合规的开源对象关系型数据库系统。",
  },
  "Express": {
    name: "Express",
    url: "https://expressjs.com/zh-cn/",
    description: "基于 Node.js 平台的极简、灵活 Web 应用与 API 服务框架。",
  },
  "MongoDB": {
    name: "MongoDB",
    url: "https://www.mongodb.com/zh-cn",
    description: "现代化应用开发的高性能、高可用分布式文档型数据库。",
  },
  "AntV X6": {
    name: "AntV X6",
    url: "https://x6.antv.antgroup.com/",
    description: "蚂蚁图编辑引擎，提供交互式节点连接与知识图谱拓扑渲染。",
  },
  "机器视觉": {
    name: "OpenCV / 机器视觉",
    url: "https://opencv.org/",
    description: "工业视觉检测、特征提取与数字图像处理核心算法体系。",
  },
  "工业相机": {
    name: "工业相机",
    url: "https://www.hikrobotics.com/cn/machinevision/",
    description: "高帧率、低延迟的工业级图像感知与采集硬件。",
  },
  "机械臂": {
    name: "机械臂 / ROS",
    url: "https://www.ros.org/",
    description: "多自由度工业机械臂运动学逆解与闭环抓取控制。",
  },
  "YOLOv9": {
    name: "YOLOv9",
    url: "https://github.com/WongKinYiu/yolov9",
    description: "前沿实时目标检测网络，基于可编程梯度信息实现高精度缺陷识别。",
  },
  "无人机巡检": {
    name: "无人机巡检",
    url: "https://www.dji.com/cn",
    description: "空地协同自主航线规划与高空光伏阵列热斑红外数据采集。",
  },
  "目标检测": {
    name: "目标检测",
    url: "https://paperswithcode.com/task/object-detection",
    description: "计算机视觉核心任务，用于精确定位和识别图像中的多类别目标。",
  },
  "物联网感知": {
    name: "MQTT / 物联网感知",
    url: "https://www.emqx.com/zh",
    description: "多传感器遥测采集、边缘网关与高并发实时物联网协议栈。",
  },
  "设备监测": {
    name: "设备监测",
    url: "https://grafana.com/",
    description: "设备运行状态遥测、时序健康度分析与故障预警监控体系。",
  },
  "外部管理": {
    name: "外部管理",
    url: "https://nextjs.org/",
    description: "外设接入生命周期追踪、协同调度与数据一致性校验。",
  },
  "Next.js": {
    name: "Next.js",
    url: "https://nextjs.org/docs",
    description: "用于构建高性能全栈 Web 应用程序的 React 工业级框架。",
  },
  "Rust": {
    name: "Rust",
    url: "https://www.rust-lang.org/zh-CN/",
    description: "赋能开发者构建高可靠、内存安全且极速的系统编程语言。",
  },
  "Tauri": {
    name: "Tauri",
    url: "https://tauri.app/zh-cn/",
    description: "使用前端 Web 技术构建极小体积、极速且高度安全的桌面应用。",
  },
  "Vitest": {
    name: "Vitest",
    url: "https://cn.vitest.dev/",
    description: "基于 Vite 引擎的原生超快单元与集成测试框架。",
  },
  "Playwright": {
    name: "Playwright",
    url: "https://playwright.dev/",
    description: "跨 Chromium、Firefox 和 WebKit 的全自动化端到端测试框架。",
  },
  "OpenAPI": {
    name: "OpenAPI",
    url: "https://www.openapis.org/",
    description: "描述 REST API 接口契约与数据架构的工业标准规范。",
  },
  "Orval": {
    name: "Orval",
    url: "https://orval.dev/",
    description: "基于 OpenAPI 规格全自动生成强类型 TypeScript 客户端请求代码。",
  },
  "Flyway": {
    name: "Flyway",
    url: "https://documentation.red-gate.com/fd",
    description: "支持版本控制的数据库结构平滑迁移与变更审计工具。",
  },
  "SSE": {
    name: "Server-Sent Events",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events",
    description: "单向持久化服务器事件推送流，实时传输业务告警与遥测数据。",
  },
};

export function getTechMeta(name: string): TechMeta {
  if (TECH_STACK_MAP[name]) {
    return TECH_STACK_MAP[name];
  }
  return {
    name,
    url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
    description: `${name} 核心技术组件。`,
  };
}
