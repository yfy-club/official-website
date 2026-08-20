export interface TrackPillar {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface TrackOverviewData {
  slug: string;
  trackNameZh: string;
  trackNameEn: string;
  leadParagraph: string;
  industryTrend: string;
  pillars: TrackPillar[];
  pipelineSteps: {
    step: string;
    label: string;
    description: string;
  }[];
  practicalApplication: {
    domain: string;
    summary: string;
    metric: string;
  };
}

export const trackOverviews: Record<string, TrackOverviewData> = {
  ai: {
    slug: "ai",
    trackNameZh: "人工智能",
    trackNameEn: "Artificial Intelligence",
    leadParagraph:
      "聚焦大语言模型与自主智能体系统、工业级机器视觉与端侧轻量化推理，打通从算法原型到生产级系统全链路交付。",
    industryTrend:
      "从单模态感知迈向多模态大模型与具身智能体，边缘轻量化部署与实时推理成为工业落地核心胜负手。",
    pillars: [
      {
        code: "01",
        title: "大语言模型与智能体工程",
        subtitle: "LLM, RAG & Autonomous Agents",
        description:
          "聚焦 Transformer 机制、模型微调、RAG 向量检索增强与基于 ReAct 状态循环的多工具自主智能体研发。",
        tags: ["Transformer", "RAG", "Agent", "LangChain", "Vector DB"],
      },
      {
        code: "02",
        title: "工业机器视觉与目标检测",
        subtitle: "Computer Vision & Defect Detection",
        description:
          "深入 YOLO 实时检测框架与特征金字塔，结合微米级表面缺陷识别算法，赋能工业产线高精度质检。",
        tags: ["PyTorch", "YOLOv9", "OpenCV", "CIOU Loss", "Vision"],
      },
      {
        code: "03",
        title: "端侧推理与模型轻量化",
        subtitle: "Edge AI & TensorRT Optimization",
        description:
          "运用神经网络剪枝、知识蒸馏与 TensorRT INT8 量化，在嵌入式 GPU 与边缘端实现百 FPS 级实时推理。",
        tags: ["TensorRT", "ONNX", "INT8", "Jetson", "Edge"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "数据清洗与标注", description: "多模态数据采集清洗与特征对齐标注" },
      { step: "02", label: "网络搭建与调优", description: "损失函数定制与反向传播梯度优化" },
      { step: "03", label: "量化剪枝与导出", description: "ONNX 图优化与 TensorRT INT8 标定加速" },
      { step: "04", label: "端云协同与部署", description: "微服务高并发 API 与嵌入式边缘交付" },
    ],
    practicalApplication: {
      domain: "工业智能质检与个性化学习",
      summary: "在光伏组件缺陷检测中实现 85 FPS / 94.2% mAP，并在 IntelliBuddy 学习中枢中支撑毫秒级 RAG 知识召回。",
      metric: "85 FPS / <8ms 延迟",
    },
  },
  software: {
    slug: "software",
    trackNameZh: "软工智能",
    trackNameEn: "Software Engineering & Systems",
    leadParagraph:
      "以高可用、高并发与弹性分布式系统为核心，贯穿现代 Web 全栈工程、微服务治理、多级缓存防护与智能体调度底座。",
    industryTrend:
      "云原生架构与系统全链路可观测性普及，数据分片一致性与企业工作流契约化集成成为资深工程师核心基准。",
    pillars: [
      {
        code: "01",
        title: "微服务治理与链路观测",
        subtitle: "Distributed Systems & Telemetry",
        description:
          "探究 RPC 通信协议、API 网关负载均衡、OpenTelemetry 分布式全链路追踪与无损流量灰度发布机制。",
        tags: ["Microservices", "gRPC", "OpenTelemetry", "Gateway", "Tracing"],
      },
      {
        code: "02",
        title: "高并发多级缓存与容灾",
        subtitle: "High Concurrency & Resilience",
        description:
          "构建进程内内存缓存 + 分布式 Redis 二级缓存架构，运用 SingleFlight 并发归并与熔断器抵御流量洪峰。",
        tags: ["Redis", "SingleFlight", "High Concurrency", "Circuit Breaker"],
      },
      {
        code: "03",
        title: "数据分片与现代全栈体系",
        subtitle: "Sharding, Snowflake & Modern Full-Stack",
        description:
          "采用 Snowflake 全局唯一 ID 与一致性哈希分库分表，配合 TypeScript / Next.js 构建类型安全的工业 Web 系统。",
        tags: ["Snowflake", "Consistent Hash", "Next.js", "TypeScript", "Zod"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "领域建模与契约", description: "基于 OpenAPI / Zod 的严格类型与接口规范" },
      { step: "02", label: "核心业务与缓存", description: "多级缓存防线、SingleFlight 与分布式锁" },
      { step: "03", label: "服务网格与追踪", description: "Span 上下文传递与全链路延迟性能分析" },
      { step: "04", label: "自动化 CI 与压测", description: "高并发压测、性能瓶颈排查与容器化交付" },
    ],
    practicalApplication: {
      domain: "智慧城市中枢与矩阵计算平台",
      summary: "承载全校级高频抢占式考勤与智慧路灯千万级遥测数据，API 平均响应延迟压缩至 3.2ms。",
      metric: "3.2ms 均延 / 99.99% 可用性",
    },
  },
  database: {
    slug: "database",
    trackNameZh: "数据库",
    trackNameEn: "Database Kernel & Storage Engines",
    leadParagraph:
      "深入现代数据库与存储引擎内核，探究物理页存储、B+ 树分裂、WAL 预写日志与 MVCC 事务隔离机制，追求极致吞吐与强一致性。",
    industryTrend:
      "新型 NVMe 硬件推动存储引擎向 LSM-Tree、时序专用引擎及 HTAP 演进，内核调优与分布式一致性备受青睐。",
    pillars: [
      {
        code: "01",
        title: "存储引擎与磁盘物理页",
        subtitle: "Storage Engines & Page Layout",
        description:
          "剖析 16KB 页物理结构、行格式、非叶子节点高分支因子与 B+ 树中位分裂机制对磁盘 I/O 的最优化利用。",
        tags: ["B+ Tree", "Page Split", "InnoDB", "Disk I/O", "Clustered Index"],
      },
      {
        code: "02",
        title: "MVCC 多版本并发与隔离",
        subtitle: "Multi-Version Concurrency Control",
        description:
          "探究 Undo Log 版本链快照读、ReadView 活跃事务可见性算法，结合 Next-Key Lock 锁机制解决并发死锁。",
        tags: ["MVCC", "ReadView", "Undo Log", "ACID", "Locking"],
      },
      {
        code: "03",
        title: "WAL 日志与崩溃恢复机制",
        subtitle: "Write-Ahead Logging & Crash Recovery",
        description:
          "研究 Redo Log 顺序追加、LSN 推进检查点与 ARIES 分析-重做-回滚算法，实现断电故障下的零数据丢失。",
        tags: ["WAL", "Redo Log", "ARIES", "LSN", "Recovery"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "物理页分配存储", description: "页内插槽、自由空间链表与行溢出处理" },
      { step: "02", label: "索引构建与分裂", description: "B+ 树平衡自旋、页分裂与自适应哈希" },
      { step: "03", label: "事务快照版本链", description: "ReadView 动态生成与 Undo 历史链修剪" },
      { step: "04", label: "日志落盘与恢复", description: "WAL 顺序 fsync 与 Checkpoint 幂等重放" },
    ],
    practicalApplication: {
      domain: "海量设备时序治理与信创容灾",
      summary: "通过复合覆盖索引与分区策略消除 92% 的回表 I/O，openGauss 实例故障演练达成秒级主备倒换。",
      metric: "RPO=0 / RTO<5s / 10ms 查询",
    },
  },
  "cloud-iot": {
    slug: "cloud-iot",
    trackNameZh: "智能云物联",
    trackNameEn: "Cloud IoT & Edge Computing",
    leadParagraph:
      "贯穿低功耗 MCU、嵌入式 Linux 边缘网关与百万级 MQTT Broker 云端中枢，构建感知、边缘清洗与时序分析的全栈物联链路。",
    industryTrend:
      "工业物联网正加速迈向『端边云协同智能』，边缘降采样与协议压缩大幅降低海量数据上云带宽与存储压力。",
    pillars: [
      {
        code: "01",
        title: "MQTT 协议与可靠状态机",
        subtitle: "MQTT Protocol & QoS Handshake",
        description:
          "深入 MQTT QoS 0/1/2 发布订阅模型，研究四步握手状态机在弱网环境下的消息确权到达机制。",
        tags: ["MQTT", "QoS 2", "State Machine", "EMQX", "IoT Network"],
      },
      {
        code: "02",
        title: "边缘流式清洗与协议压缩",
        subtitle: "Edge Computing & Protobuf Encoding",
        description:
          "在嵌入式 Linux 网关维护滑动窗口滤波与异常判定，配合 Protocol Buffers 紧凑序列化削减 80% 带宽负荷。",
        tags: ["EdgeX", "Protobuf", "Sliding Window", "Linux", "Filter"],
      },
      {
        code: "03",
        title: "高吞吐时序数据库中枢",
        subtitle: "TSDB Engine & Gorilla Compression",
        description:
          "运用 LSM/TSM 时序存储引擎与 Gorilla 浮点异或压缩算法，支撑单节点每秒数万点指标写入与聚合查询。",
        tags: ["TSDB", "InfluxDB", "Gorilla Compression", "Time Series"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "端侧传感高频采集", description: "MCU 模拟量/数字量采集与本地定时心跳" },
      { step: "02", label: "边缘计算滤波压缩", description: "滑动窗口降采样与 Protobuf 二进制打包" },
      { step: "03", label: "MQTT 分布式分发", description: "EMQX 协议路由与 QoS 2 可靠状态交付" },
      { step: "04", label: "时序数据湖与呈现", description: "时序库高吞吐落盘与 3D 可视化看板驱动" },
    ],
    practicalApplication: {
      domain: "智慧路灯时序物联与状态监测",
      summary: "接入 400+ 设备节点，边缘滤波将网络流量降低 90%，支撑 30 天用电负荷数据秒级平滑渲染。",
      metric: "99.98% 交付率 / 50k 点/秒写入",
    },
  },
  industrial: {
    slug: "industrial",
    trackNameZh: "工业数智化",
    trackNameEn: "Industrial Intelligence & Robotics",
    leadParagraph:
      "聚焦现代智能制造与工业 4.0，融合工业总线通信（OPC-UA）、机器视觉亚像素检测、机械臂手眼标定与 3D 实时数字孪生系统。",
    industryTrend:
      "工业自动化正向具备柔性生产与自主感知决策的『智能制造工场』跃迁，手眼引导与虚实映射成为标配技术。",
    pillars: [
      {
        code: "01",
        title: "机械臂手眼标定与空间几何",
        subtitle: "Hand-Eye Calibration & AX=XB",
        description:
          "求解 Eye-in-Hand 齐次矩阵方程 AX = XB，利用四元数精准解算相机与机械臂安装位姿，定位精度达 0.05mm。",
        tags: ["Robotics", "Hand-Eye", "Homogeneous Matrix", "OpenCV", "Kinematics"],
      },
      {
        code: "02",
        title: "工业机器视觉与亚像素检测",
        subtitle: "Sub-pixel Metrology & Inspection",
        description:
          "结合双远心镜头与 Zernike 正交矩拟合算法，在连续梯度场中实现 ±0.02 像素的微米级工件缺陷测量。",
        tags: ["Machine Vision", "Sub-pixel", "Zernike", "Metrology", "Quality"],
      },
      {
        code: "03",
        title: "OPC-UA 工业总线与数字孪生",
        subtitle: "OPC-UA Bus & Digital Twin",
        description:
          "基于统一节点寻址与死区订阅过滤机制，连接跨品牌 PLC 与控制器，驱动 WebGL 3D 虚拟产线实时高保真映射。",
        tags: ["OPC-UA", "PLC", "Digital Twin", "SCADA", "Industrial 4.0"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "多传感器与总线互联", description: "OPC-UA 节点建模与死区防抖数据采集" },
      { step: "02", label: "相机标定与姿态解算", description: "齐次变换矩阵求解与空间点云对齐" },
      { step: "03", label: "亚像素视觉测量质检", description: "连续梯度场拟合与微米级瑕疵判定" },
      { step: "04", label: "闭环执行与孪生映射", description: "运动轨迹规划与 3D 产线状态实时同步" },
    ],
    practicalApplication: {
      domain: "工业分拣实训与精密轴承检测",
      summary: "六轴机械臂异形工件抓取成功率达 99.4%，轴承外观微裂纹检出率达到 99.8%。",
      metric: "0.05mm 标定精度 / 99.8% 检出率",
    },
  },
};
