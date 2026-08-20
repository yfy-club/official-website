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
      "从基础机器学习、计算机视觉到大语言模型与自主智能体，人工智能方向专注于前沿算法的理论推演与端云协同工程化落地，培养具备从算法原型到生产级系统全链路交付能力的工程人才。",
    industryTrend:
      "当前 AI 正经历从单模态判别式模型向多模态大模型与具身智能体（Embodied AI）的深刻演进，模型轻量化与边缘端部署成为工业质检、自动驾驶与智能硬件的核心竞争力。",
    pillars: [
      {
        code: "01",
        title: "大语言模型与智能体工程",
        subtitle: "LLM, RAG & Autonomous Agents",
        description:
          "聚焦 Transformer 自注意力机制、大模型微调、RAG 向量检索增强与基于 ReAct 状态循环的多工具自主调用智能体系统研发。",
        tags: ["Transformer", "RAG", "Agent", "LangChain", "Vector DB"],
      },
      {
        code: "02",
        title: "工业机器视觉与目标检测",
        subtitle: "Computer Vision & Defect Detection",
        description:
          "深入卷积神经网络与 YOLO 系列实时检测框架，结合 PANet 特征金字塔与微米级表面缺陷识别算法，赋能工业产线高精度质检。",
        tags: ["PyTorch", "YOLOv9", "OpenCV", "CIOU Loss", "Vision"],
      },
      {
        code: "03",
        title: "端侧推理与模型轻量化",
        subtitle: "Edge AI & TensorRT Optimization",
        description:
          "研究神经网络剪枝、知识蒸馏与 TensorRT INT8 对称量化技术，在嵌入式 GPU 与低功耗边缘端实现百 FPS 级高吞吐实时推理。",
        tags: ["TensorRT", "ONNX", "INT8 Quantization", "Jetson", "Edge"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "数据采集与预处理", description: "多模态数据清洗、特征增强与严密标注" },
      { step: "02", label: "网络搭建与训练", description: "基于 PyTorch 的 Loss 设计与梯度反传调优" },
      { step: "03", label: "量化剪枝与导出", description: "ONNX 计算图优化与 INT8 标定加速" },
      { step: "04", label: "端云协同与服务化", description: "微服务高并发 API 与嵌入式边缘部署" },
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
      "软工智能方向以构建高可用、高并发与弹性的企业级分布式系统为核心，贯穿现代 Web 全栈工程、微服务治理、多级缓存击穿防御与 AI 智能体调度底座，打造坚不可摧的软件架构。",
    industryTrend:
      "随着云原生与微服务架构的普及，系统的可观测性（Observability）、数据分片一致性以及大模型 API 与企业工作流的深度契约化集成，已成为现代资深软件工程师的核心能力基准。",
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
        title: "高并发多级缓存与弹性容灾",
        subtitle: "High Concurrency & Resilience",
        description:
          "构建进程内内存缓存 + 分布式 Redis 二级缓存架构，运用 SingleFlight 并发归并与 Sentinel 熔断器抵御瞬时流量洪峰。",
        tags: ["Redis", "SingleFlight", "High Concurrency", "Circuit Breaker"],
      },
      {
        code: "03",
        title: "数据分片与现代全栈体系",
        subtitle: "Sharding, Snowflake & Modern Full-Stack",
        description:
          "采用 Snowflake 64 位全局唯一 ID 与虚拟节点一致性哈希分库分表，配合 TypeScript / Next.js 构建端到端类型安全的工业 Web 应用。",
        tags: ["Snowflake", "Consistent Hash", "Next.js", "TypeScript", "Zod"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "领域建模与契约定义", description: "基于 OpenAPI / Zod 的严格类型与接口契约" },
      { step: "02", label: "核心业务与缓存防线", description: "多级缓存、SingleFlight 与分布式锁实现" },
      { step: "03", label: "服务网格与链路追踪", description: "Span 上下文传递与全链路延迟分析" },
      { step: "04", label: "自动化 CI/CD 与压测", description: "高并发压测、性能瓶颈排查与容器化交付" },
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
      "深入现代数据库与存储系统底层内核，研究磁盘物理页结构、B+ 树索引分裂、Write-Ahead Logging（WAL）预写日志与 MVCC 事务隔离机制，探索万亿级数据下的存储极致吞吐与一致性保障。",
    industryTrend:
      "新型硬件（NVMe SSD、CXL）与信创数据库浪潮推动存储引擎从传统 B+ 树向 LSM-Tree、时序专用引擎及 HTAP 混合负载演进，内核级调优与分布式一致性协议备受青睐。",
    pillars: [
      {
        code: "01",
        title: "存储引擎与磁盘物理页",
        subtitle: "Storage Engines & Page Layout",
        description:
          "剖析 16KB 页物理结构、行格式（COMPACT/DYNAMIC）、非叶子节点高分支因子与 B+ 树中位分裂机制对磁盘 I/O 的最优化利用。",
        tags: ["B+ Tree", "Page Split", "InnoDB", "Disk I/O", "Clustered Index"],
      },
      {
        code: "02",
        title: "MVCC 多版本并发与隔离",
        subtitle: "Multi-Version Concurrency Control",
        description:
          "探究 Undo Log 版本链快照读、ReadView 活跃事务可见性算法，结合 Next-Key Lock 锁机制彻底解决幻读与并发死锁。",
        tags: ["MVCC", "ReadView", "Undo Log", "ACID", "Locking"],
      },
      {
        code: "03",
        title: "WAL 日志与 ARIES 崩溃恢复",
        subtitle: "Write-Ahead Logging & Crash Recovery",
        description:
          "研究 Redo Log 顺序追加、LSN 推进检查点与 ARIES 算法分析-重做-回滚三阶段，实现断电故障下的零数据丢失（RPO=0）。",
        tags: ["WAL", "Redo Log", "ARIES", "LSN", "Recovery"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "物理页分配与行存储", description: "页内插槽、自由空间链表与行溢出处理" },
      { step: "02", label: "索引构建与分裂路由", description: "B+ 树平衡自旋、页分裂与自适应哈希索引" },
      { step: "03", label: "事务快照与版本链维护", description: "ReadView 动态生成与 Undo 历史链修剪" },
      { step: "04", label: "日志落盘与崩溃恢复", description: "WAL 顺序 fsync 与 Checkpoint 幂等重放" },
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
      "贯穿低功耗传感器微控制器、嵌入式 Linux 边缘计算网关与百万级 MQTT Broker 云端中枢，智能云物联方向致力于打通物理世界感知、端侧智能过滤与云端时序流式分析的完整工业物联网链路。",
    industryTrend:
      "工业物联网正从简单的『设备上云』向『端边云协同智能』演进，边缘端降采样与协议编解码有效缓解了海量物联数据上云带来的带宽与存储瓶颈。",
    pillars: [
      {
        code: "01",
        title: "MQTT 协议与可靠状态机",
        subtitle: "MQTT Protocol & QoS Handshake",
        description:
          "深入 MQTT QoS 0/1/2 发布订阅模型，研究 PUBLISH-PUBREC-PUBREL-PUBCOMP 四步状态机在弱网环境下的消息确权到达机制。",
        tags: ["MQTT", "QoS 2", "State Machine", "EMQX", "IoT Network"],
      },
      {
        code: "02",
        title: "边缘流式清洗与二进制压缩",
        subtitle: "Edge Computing & Protobuf Encoding",
        description:
          "在嵌入式 Linux 网关维护滑动窗口均值滤波与 3-Sigma 异常判定，配合 Protocol Buffers 紧凑序列化削减 80% 云端带宽负荷。",
        tags: ["EdgeX", "Protobuf", "Sliding Window", "Linux", "Filter"],
      },
      {
        code: "03",
        title: "高吞吐时序数据库中枢",
        subtitle: "TSDB Engine & Gorilla Compression",
        description:
          "运用 LSM/TSM 时序专用存储引擎与 Gorilla 浮点异或压缩算法，支撑单节点每秒数万点指标写入与连续聚合查询。",
        tags: ["TSDB", "InfluxDB", "Gorilla Compression", "Time Series"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "端侧传感高频采集", description: "MCU 模拟量/数字量采集与本地定时心跳" },
      { step: "02", label: "边缘计算滤波压缩", description: "滑动窗口降采样与 Protobuf 二进制打包" },
      { step: "03", label: "MQTT 分布式总线分发", description: "EMQX 协议路由与 QoS 2 可靠状态交付" },
      { step: "04", label: "时序数据湖与孪生呈现", description: "时序库高吞吐落盘与 3D 可视化看板驱动" },
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
      "工业数智化方向聚焦现代智能制造与工业 4.0 核心场景，融合工业通信总线（OPC-UA）、机器视觉亚像素瑕疵检测、机械臂手眼标定空间几何变换与 3D 实时数字孪生系统，驱动工业产线数智化升级。",
    industryTrend:
      "工业自动化正加速向具备柔性生产与自主感知决策的『智能制造工场』跃迁，手眼视觉引导与数字孪生虚实映射已成为高端制造产线的标配技术。",
    pillars: [
      {
        code: "01",
        title: "机械臂手眼标定与空间几何",
        subtitle: "Hand-Eye Calibration & AX=XB",
        description:
          "求解 Eye-in-Hand 齐次变换矩阵方程 AX = XB，利用四元数分解精准解算相机坐标系与机器人基座安装位姿关系，定位精度达 0.05mm。",
        tags: ["Robotics", "Hand-Eye", "Homogeneous Matrix", "OpenCV", "Kinematics"],
      },
      {
        code: "02",
        title: "工业机器视觉与亚像素检测",
        subtitle: "Sub-pixel Metrology & Inspection",
        description:
          "结合双远心镜头与 Zernike 正交矩拟合算法，突破物理相机像素极限，在连续梯度场中实现 ±0.02 像素的微米级工件缺陷测量。",
        tags: ["Machine Vision", "Sub-pixel", "Zernike", "Metrology", "Quality"],
      },
      {
        code: "03",
        title: "OPC-UA 工业总线与数字孪生",
        subtitle: "OPC-UA Bus & Digital Twin",
        description:
          "基于统一节点地址空间与死区订阅过滤机制，连接跨品牌 PLC 与机器人控制中枢，驱动 WebGL 3D 虚拟产线实时高保真镜像映射。",
        tags: ["OPC-UA", "PLC", "Digital Twin", "SCADA", "Industrial 4.0"],
      },
    ],
    pipelineSteps: [
      { step: "01", label: "多传感器与 PLC 总线互联", description: "OPC-UA 节点建模与死区防抖数据采集" },
      { step: "02", label: "相机标定与工件姿态解算", description: "齐次变换矩阵求解与空间点云对齐" },
      { step: "03", label: "亚像素视觉测量与质检", description: "连续梯度场拟合与微米级瑕疵判定" },
      { step: "04", label: "机械臂闭环执行与孪生映射", description: "运动轨迹规划与 3D 产线状态实时同步" },
    ],
    practicalApplication: {
      domain: "工业分拣实训与精密轴承检测",
      summary: "六轴机械臂异形工件抓取成功率达 99.4%，轴承外观微裂纹检出率达到 99.8%。",
      metric: "0.05mm 标定精度 / 99.8% 检出率",
    },
  },
};
