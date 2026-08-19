export type TechMeta = {
  description: string;
  name: string;
  url: string;
};

export const TECH_STACK_MAP: Record<string, TechMeta> = {
  // 编程语言
  "Python": {
    name: "Python",
    url: "https://www.python.org/",
    description: "功能强大、语法优雅的高级动态编程语言，AI 与数据科学首选基座。",
  },
  "C++": {
    name: "C++",
    url: "https://en.cppreference.com/w/cpp",
    description: "高效、精细控制底层内存的高性能通用系统级编程语言。",
  },
  "C/C++": {
    name: "C/C++",
    url: "https://en.cppreference.com/w/",
    description: "计算机底层开发、操作系统与高性能算法计算的核心工业级语言。",
  },
  "Java": {
    name: "Java",
    url: "https://dev.java/",
    description: "跨平台、强类型、面向对象的大型企业级后端与分布式系统主流语言。",
  },
  "Java 21": {
    name: "Java 21",
    url: "https://docs.oracle.com/en/java/javase/21/",
    description: "长期支持版 (LTS) Java，引入轻量级虚拟线程与现代化强类型语法特性。",
  },
  "TypeScript": {
    name: "TypeScript",
    url: "https://www.typescriptlang.org/",
    description: "带静态类型系统的 JavaScript 超集，让大型 Web 工程架构与接口契约更健壮。",
  },
  "SQL": {
    name: "SQL",
    url: "https://en.wikipedia.org/wiki/SQL",
    description: "关系型数据库标准数据定义与结构化查询语言。",
  },
  "Shell": {
    name: "Shell",
    url: "https://www.gnu.org/software/bash/",
    description: "Linux 操作系统交互、自动化运维与批处理脚本环境。",
  },
  "C#": {
    name: "C#",
    url: "https://learn.microsoft.com/zh-cn/dotnet/csharp/",
    description: "微软现代化、面向对象、类型安全的高性能通用开发语言。",
  },
  "Rust": {
    name: "Rust",
    url: "https://www.rust-lang.org/",
    description: "保证内存安全与线程安全的高性能系统级编程语言。",
  },
  "BigInt": {
    name: "BigInt",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt",
    description: "JavaScript 原生任意精度整数类型，保证代数推导过程零浮点误差。",
  },
  "BigInt 有理数": {
    name: "BigInt 有理数",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt",
    description: "基于任意精度整数构建的有理数分数运算法则，彻底杜绝浮点精度丢失。",
  },

  // 前端与全栈框架
  "Vue 3": {
    name: "Vue 3",
    url: "https://cn.vuejs.org/",
    description: "渐进式 JavaScript 框架，具备组合式 API (Composition API) 与极佳的运行时性能。",
  },
  "Next.js": {
    name: "Next.js",
    url: "https://nextjs.org/",
    description: "React 工业级全栈服务端渲染 (SSR/SSG) 应用程序开发框架。",
  },
  "Vite": {
    name: "Vite",
    url: "https://vite.dev/",
    description: "下一代前端构建与开发工具，极速冷启动与基于 ESM 的毫秒级热更新。",
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/",
    description: "基于原子类优先的高性能现代化 CSS 工具集与设计系统引擎。",
  },
  "Express": {
    name: "Express",
    url: "https://expressjs.com/",
    description: "基于 Node.js 平台的极简、灵活 Web 应用与 API 微服务框架。",
  },
  "Three.js": {
    name: "Three.js",
    url: "https://threejs.org/",
    description: "用于在 Web 浏览器中创建和展示 3D 计算机图形与数字孪生的 JavaScript 库。",
  },
  "WebGL": {
    name: "WebGL",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API",
    description: "Web 标准底层 3D 图形渲染 API，无需安装插件即可直接调用 GPU 渲染。",
  },
  "WebSockets": {
    name: "WebSockets",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API",
    description: "在客户端与服务器之间建立全双工双向通信的持久化 TCP 协议。",
  },
  "SSE": {
    name: "Server-Sent Events",
    url: "https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events",
    description: "单向持久化服务器事件推送流，实时传输大模型流式响应与告警数据。",
  },
  "AntV X6": {
    name: "AntV X6",
    url: "https://x6.antv.antgroup.com/",
    description: "蚂蚁图编辑引擎，提供交互式节点连接与知识图谱拓扑渲染。",
  },
  "Tauri": {
    name: "Tauri",
    url: "https://tauri.app/",
    description: "使用 Web 前端与 Rust 后端构建极小体积、极速且安全的跨平台桌面应用。",
  },

  // 后端微服务与中间件
  "Spring Boot": {
    name: "Spring Boot",
    url: "https://spring.io/projects/spring-boot",
    description: "现代化 Java 生产级微服务与企业后端开发全栈框架。",
  },
  "Spring Boot 3.5": {
    name: "Spring Boot",
    url: "https://spring.io/projects/spring-boot",
    description: "基于 Spring 6 与 Java 21 的新一代云原生微服务开发框架。",
  },
  "Spring Cloud": {
    name: "Spring Cloud",
    url: "https://spring.io/projects/spring-cloud",
    description: "提供配置管理、服务发现、断路器、智能路由等微服务治理全家桶。",
  },
  "MyBatis-Plus": {
    name: "MyBatis-Plus",
    url: "https://baomidou.com/",
    description: "MyBatis 增强工具，简化 CRUD 操作并提供强类型 Lambda 条件构造器。",
  },
  "RabbitMQ": {
    name: "RabbitMQ",
    url: "https://www.rabbitmq.com/",
    description: "成熟、健壮的高可用开源消息代理中间件，用于系统异步解耦与削峰填谷。",
  },
  "Docker": {
    name: "Docker",
    url: "https://www.docker.com/",
    description: "工业级容器化平台，将应用及其全部依赖打包为标准化轻量容器。",
  },
  "Docker 容器编排": {
    name: "Docker Compose",
    url: "https://docs.docker.com/compose/",
    description: "多容器 Docker 应用定义与自动化运行编排工具。",
  },
  "Nginx": {
    name: "Nginx",
    url: "https://nginx.org/",
    description: "高性能 HTTP 和反向代理 Web 服务器，提供负载均衡与 SSL 终结能力。",
  },

  // 数据库与存储
  "MySQL": {
    name: "MySQL",
    url: "https://www.mysql.com/",
    description: "全球最受欢迎的开源关系型数据库管理系统。",
  },
  "PostgreSQL": {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/",
    description: "强大、高度可扩展且完全合规的开源对象关系型数据库系统。",
  },
  "openGauss": {
    name: "openGauss",
    url: "https://opengauss.org/zh/",
    description: "华为开源的高性能、高安全、高可靠企业级国产信创关系型数据库。",
  },
  "OceanBase": {
    name: "OceanBase",
    url: "https://www.oceanbase.com/",
    description: "原生分布式关系数据库，支持高并发、多地多活与金融级强一致性。",
  },
  "Redis": {
    name: "Redis",
    url: "https://redis.io/",
    description: "超高性能内存数据结构存储，用作分布式数据库、缓存和消息代理。",
  },
  "MongoDB": {
    name: "MongoDB",
    url: "https://www.mongodb.com/",
    description: "面向现代化应用的高性能、高可用分布式文档型 NoSQL 数据库。",
  },
  "TiDB": {
    name: "TiDB",
    url: "https://www.pingcap.com/tidb/",
    description: "开源分布式混合事务/分析处理 (HTAP) 关系型数据库。",
  },
  "Vector DB": {
    name: "Vector Database",
    url: "https://milvus.io/",
    description: "专为大模型向量嵌入 (Embedding) 检索与相似度匹配设计的向量数据库。",
  },
  "InnoDB": {
    name: "InnoDB",
    url: "https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html",
    description: "MySQL 默认事务型存储引擎，具备 B+ 树索引、ACID 事务与行级锁支持。",
  },
  "B+ Tree": {
    name: "B+ Tree",
    url: "https://en.wikipedia.org/wiki/B%2B_tree",
    description: "数据库与文件系统中最核心的高扇出多路平衡查找树存储结构。",
  },
  "MVCC": {
    name: "MVCC",
    url: "https://en.wikipedia.org/wiki/Multiversion_concurrency_control",
    description: "多版本并发控制机制，实现读写互不阻塞并保障快照读一致性。",
  },
  "WAL Log": {
    name: "Write-Ahead Logging",
    url: "https://en.wikipedia.org/wiki/Write-ahead_logging",
    description: "预写日志技术，确保数据写入磁盘前先记日志以实现崩溃恢复一致性。",
  },
  "Raft": {
    name: "Raft",
    url: "https://raft.github.io/",
    description: "易于理解的分布式共识算法，保障多副本节点状态机强一致性与选主选举。",
  },
  "Sharding": {
    name: "ShardingSphere",
    url: "https://shardingsphere.apache.org/",
    description: "Apache 分布式数据库中间件，支持透明化分库分表与读写分离治理。",
  },
  "分库分表": {
    name: "ShardingSphere",
    url: "https://shardingsphere.apache.org/",
    description: "将海量单表数据横向分片至多节点，突破单机 I/O 与存储容量瓶颈。",
  },
  "高可用主从架构": {
    name: "High Availability",
    url: "https://en.wikipedia.org/wiki/High_availability",
    description: "主从复制与哨兵/集群自动故障转移，保障 99.99% 系统持续在线能力。",
  },
  "High Availability": {
    name: "High Availability",
    url: "https://en.wikipedia.org/wiki/High_availability",
    description: "通过冗余备份与自动故障检测实现的高可用集群架构标准。",
  },

  // 人工智能与数据科学
  "PyTorch": {
    name: "PyTorch",
    url: "https://pytorch.org/",
    description: "由 Meta 研发的开源深度学习与张量计算框架，科研与工业界首选。",
  },
  "OpenCV": {
    name: "OpenCV",
    url: "https://opencv.org/",
    description: "全球领先的开源计算机视觉与实时图像处理核心算法库。",
  },
  "NumPy": {
    name: "NumPy",
    url: "https://numpy.org/",
    description: "Python 科学计算与多维数组矩阵运算的底层基石库。",
  },
  "Pandas": {
    name: "Pandas",
    url: "https://pandas.pydata.org/",
    description: "高效易用的数据结构与数据分析清洗工具集。",
  },
  "LangChain": {
    name: "LangChain",
    url: "https://www.langchain.com/",
    description: "用于构建大语言模型驱动的上下文感知与自主推理应用程序的开发框架。",
  },
  "vLLM": {
    name: "vLLM",
    url: "https://docs.vllm.ai/",
    description: "基于 PagedAttention 显存优化技术的高吞吐、低延迟 LLM 推理与服务引擎。",
  },
  "HuggingFace": {
    name: "HuggingFace",
    url: "https://huggingface.co/",
    description: "全球最大的开源 AI 模型、数据集与开源算法共享平台社区。",
  },
  "ONNX Runtime": {
    name: "ONNX Runtime",
    url: "https://onnxruntime.ai/",
    description: "跨平台高性能机器学习与深度学习模型推理加速引擎。",
  },
  "ONNX 模型量化": {
    name: "ONNX Runtime Quantization",
    url: "https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html",
    description: "将 FP32 浮点权重转换为 INT8 低精度表示，大幅降低显存并提升推理速度。",
  },
  "TensorRT": {
    name: "NVIDIA TensorRT",
    url: "https://developer.nvidia.com/tensorrt",
    description: "NVIDIA 高性能深度学习推理 SDK，提供极致的 GPU 硬件算力加速。",
  },
  "TensorBoard": {
    name: "TensorBoard",
    url: "https://www.tensorflow.org/tensorboard",
    description: "深度学习训练过程中的损失曲线、权重分布与图结构可视化看板。",
  },
  "YOLO": {
    name: "YOLO",
    url: "https://docs.ultralytics.com/",
    description: "You Only Look Once，前沿实时单阶段目标检测网络算法体系。",
  },
  "YOLOv8/v9": {
    name: "YOLOv8 / YOLOv9",
    url: "https://docs.ultralytics.com/",
    description: "工业级高精度实时多目标检测、实例分割与姿态估计网络架构。",
  },
  "YOLOv9": {
    name: "YOLOv9",
    url: "https://github.com/WongKinYiu/yolov9",
    description: "前沿实时目标检测网络，基于可编程梯度信息实现高精度缺陷识别。",
  },
  "RAG": {
    name: "Retrieval-Augmented Generation",
    url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/",
    description: "检索增强生成，将外部私有知识库检索与大语言模型生成能力深度融合。",
  },
  "检索增强生成 (RAG)": {
    name: "RAG",
    url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/",
    description: "检索增强生成技术，解决大模型幻觉并赋予其专业领域动态知识。",
  },
  "Prompt Engineering": {
    name: "Prompt Engineering",
    url: "https://www.promptingguide.ai/zh",
    description: "提示工程指南，系统化掌握结构化提示词设计与大模型能力激发技巧。",
  },
  "大模型智能体 (Agent)": {
    name: "AI Agent",
    url: "https://github.com/langchain-ai/langgraph",
    description: "具备自主环境感知、规划推理、记忆管理与多工具协同调用能力的智能体。",
  },
  "AI 智能体开发": {
    name: "AI Agent",
    url: "https://github.com/langchain-ai/langgraph",
    description: "基于大语言模型核心驱动的自主智能体工程与工作流编排开发。",
  },
  "计算机视觉 (CV)": {
    name: "Computer Vision",
    url: "https://paperswithcode.com/area/computer-vision",
    description: "使计算机能够从数字图像或视频中提取高级理解的科学领域。",
  },
  "机器视觉": {
    name: "OpenCV / 机器视觉",
    url: "https://opencv.org/",
    description: "工业视觉检测、特征提取与数字图像处理核心算法体系。",
  },
  "工业机器视觉": {
    name: "OpenCV / 工业视觉",
    url: "https://opencv.org/",
    description: "高精度工业相机成像、表面瑕疵智能识别与机械臂视觉引导定位。",
  },
  "目标检测": {
    name: "Object Detection",
    url: "https://paperswithcode.com/task/object-detection",
    description: "计算机视觉核心任务，用于精确定位和识别图像中的多类别目标边界框。",
  },
  "智能机器人": {
    name: "Robotics",
    url: "https://www.ros.org/",
    description: "融合多传感器融合、运动控制逆解与自主决策的智能机器人系统。",
  },
  "ROS": {
    name: "Robot Operating System",
    url: "https://www.ros.org/",
    description: "开源机器人操作系统，提供硬件抽象、底层驱动与多节点通信机制。",
  },
  "机械臂": {
    name: "机械臂控制 / ROS",
    url: "https://www.ros.org/",
    description: "六轴工业机械臂运动学逆解建模与手眼标定闭环抓取控制。",
  },
  "Hand-Eye Calibration": {
    name: "手眼标定",
    url: "https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html",
    description: "计算工业相机坐标系与机械臂基座/法兰坐标系之间位姿变换矩阵的核心算法。",
  },
  "Industrial Camera": {
    name: "工业相机",
    url: "https://www.hikrobotics.com/cn/machinevision/",
    description: "高帧率、全局曝光与高抗干扰能力的工业级千兆网/USB3 视觉采集硬件。",
  },
  "工业相机": {
    name: "工业相机",
    url: "https://www.hikrobotics.com/cn/machinevision/",
    description: "高帧率、低延迟的工业级图像感知与采集硬件。",
  },
  "无人机巡检": {
    name: "无人机巡检系统",
    url: "https://enterprise.dji.com/cn",
    description: "空地协同自主航线规划与高空光伏阵列热斑红外数据采集。",
  },

  // 物联网与嵌入式
  "FreeRTOS": {
    name: "FreeRTOS",
    url: "https://www.freertos.org/",
    description: "广泛应用于微控制器的市场领先开源实时操作系统 (RTOS) 内核。",
  },
  "STM32": {
    name: "STM32",
    url: "https://www.st.com/zh/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html",
    description: "意法半导体基于 ARM Cortex-M 架构的业界主流 32 位微控制器芯片系列。",
  },
  "STM32 HAL": {
    name: "STM32 HAL",
    url: "https://www.st.com/zh/embedded-software/stm32cube-mcu-packages.html",
    description: "STM32 硬件抽象层固件库，提供标准化外设驱动 API 接口。",
  },
  "ESP32": {
    name: "ESP32",
    url: "https://www.espressif.com.cn/zh-hans/products/socs/esp32",
    description: "乐鑫集成 Wi-Fi 与双模低功耗蓝牙的高性能低成本系统级 (SoC) 芯片。",
  },
  "ESP-IDF": {
    name: "ESP-IDF",
    url: "https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/",
    description: "乐鑫官方 ESP32 系列芯片完整物联网开发框架与固件工具链。",
  },
  "MQTT": {
    name: "MQTT",
    url: "https://mqtt.org/",
    description: "轻量级基于发布/订阅模式的标准物联网消息通信传输协议。",
  },
  "EMQX": {
    name: "EMQX",
    url: "https://www.emqx.com/zh",
    description: "全球领先的大规模分布式 MQTT 物联网接入服务器与规则引擎平台。",
  },
  "ThingsBoard": {
    name: "ThingsBoard",
    url: "https://thingsboard.io/",
    description: "开源物联网平台，提供设备接入管理、遥测数据收集与可视化大屏。",
  },
  "Modbus": {
    name: "Modbus",
    url: "https://modbus.org/",
    description: "工业电子设备之间最经典、应用最广泛的标准串行通信协议规范。",
  },
  "Modbus TCP": {
    name: "Modbus TCP",
    url: "https://modbus.org/",
    description: "运行于以太网 TCP/IP 协议栈之上的工业标准通信协议。",
  },
  "Modbus TCP/RTU": {
    name: "Modbus TCP/RTU",
    url: "https://modbus.org/",
    description: "涵盖 RS-485 串行链路与以太网 TCP 的工业多传感器轮询采集协议。",
  },
  "OPC UA": {
    name: "OPC UA",
    url: "https://opcfoundation.org/",
    description: "面向工业 4.0 自动化与物联网安全的跨平台机器间通信开放标准规范。",
  },
  "Device Shadow": {
    name: "Device Shadow",
    url: "https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html",
    description: "设备影子技术，用于在云端持久保存物理设备的当前状态并同步离线控制。",
  },
  "设备影子 (Device Shadow)": {
    name: "Device Shadow",
    url: "https://docs.aws.amazon.com/iot/latest/developerguide/iot-device-shadows.html",
    description: "在云端缓存设备最新状态与期望配置，实现异步可靠下发与状态同步。",
  },
  "Telemetry": {
    name: "IoT Telemetry",
    url: "https://thingsboard.io/docs/user-guide/telemetry/",
    description: "传感器时序遥测数据上报、时序序列处理与实时趋势图表呈现。",
  },
  "时序遥测采集": {
    name: "IoT Telemetry",
    url: "https://thingsboard.io/docs/user-guide/telemetry/",
    description: "高频传感器时序遥测数据流清洗、协议转换与毫秒级入库上报。",
  },
  "OTA 固件升级": {
    name: "ESP-IDF OTA",
    url: "https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/api-reference/system/ota.html",
    description: "通过无线网络远程为空中硬件节点刷写差分固件与平滑版本迭代。",
  },
  "低功耗通信": {
    name: "BLE Low Energy",
    url: "https://www.bluetooth.com/zh-cn/learn-about-bluetooth/tech-overview/",
    description: "低功耗蓝牙与休眠唤醒调度机制，大幅延长野外传感器节点续航寿命。",
  },
  "Edge Computing": {
    name: "Edge Computing",
    url: "https://www.eclipse.org/kura/",
    description: "在靠近物或数据源头的网络边缘侧执行计算与智能过滤的分布式计算架构。",
  },
  "边缘计算网关": {
    name: "Edge Gateway",
    url: "https://www.eclipse.org/kura/",
    description: "汇聚多路现场总线传感器、执行本地数据过滤与边缘推理的智能网关。",
  },
  "Edge Gateway": {
    name: "Edge Gateway",
    url: "https://www.eclipse.org/kura/",
    description: "具备协议多向解析、数据边缘聚合与本地脱网报警的高可靠硬件网关。",
  },
  "嵌入式驱动开发": {
    name: "Embedded Driver",
    url: "https://www.arm.com/technologies/cmsis",
    description: "基于 ARM CMSIS 与硬件寄存器编写外设底层中断驱动与通信固件。",
  },
  "物联网感知": {
    name: "MQTT / 物联网感知",
    url: "https://www.emqx.com/zh",
    description: "多传感器遥测采集、边缘网关与高并发实时物联网协议栈。",
  },
  "设备监测": {
    name: "设备健康度监测",
    url: "https://grafana.com/",
    description: "设备运行状态遥测、时序健康度分析与故障预警监控体系。",
  },
  "外部管理": {
    name: "外设接入管理",
    url: "https://nextjs.org/",
    description: "外设接入生命周期追踪、协同调度与数据一致性校验。",
  },

  // 工业与工控
  "Siemens PLC": {
    name: "Siemens PLC",
    url: "https://www.siemens.com/global/en/products/automation/systems/industrial/plc.html",
    description: "西门子 SIMATIC 工业可编程逻辑控制器，全球智能制造产线中枢。",
  },
  "Siemens S7": {
    name: "Siemens S7 Protocol",
    url: "https://www.siemens.com/global/en/products/automation/systems/industrial/plc/simatic-s7-1200.html",
    description: "西门子 S7-1200/1500 工业通信专有协议，实现工控机与 PLC 高速互联。",
  },
  "PLC 梯形图": {
    name: "Ladder Logic (LAD)",
    url: "https://en.wikipedia.org/wiki/Ladder_logic",
    description: "IEC 61131-3 标准工业电气控制逻辑图形化编程语言。",
  },
  "PLC 自动化逻辑": {
    name: "PLC Logic",
    url: "https://en.wikipedia.org/wiki/Programmable_logic_controller",
    description: "基于循环扫描周期与安全联锁保护机制的工业产线自动化控制逻辑。",
  },
  "TIA Portal": {
    name: "TIA Portal (博途)",
    url: "https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html",
    description: "西门子全集成自动化软件工程平台，统筹 PLC、HMI 与伺服驱动配置。",
  },
  "TIA Portal (博途)": {
    name: "TIA Portal (博途)",
    url: "https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html",
    description: "西门子全集成自动化软件平台，覆盖工控项目设计、组态与虚拟调试全流程。",
  },
  "TwinCAT": {
    name: "Beckhoff TwinCAT",
    url: "https://www.beckhoff.com/zh-cn/products/automation/twincat/",
    description: "德国倍福基于 PC 控制技术的实时工控与 EtherCAT 运动控制软件平台。",
  },
  "Node-RED": {
    name: "Node-RED",
    url: "https://nodered.org/",
    description: "低代码事件驱动型编程工具，用于将硬件设备、API 与在线服务快速连接。",
  },
  "SCADA": {
    name: "SCADA",
    url: "https://en.wikipedia.org/wiki/SCADA",
    description: "数据采集与监视控制系统，实现大型工厂产线集中监控与调度运营。",
  },
  "工业 SCADA 组态": {
    name: "Industrial SCADA",
    url: "https://en.wikipedia.org/wiki/SCADA",
    description: "工业现场高实时数据采集、动态图形画面组态与越限声光报警系统。",
  },
  "产线 3D 数字孪生": {
    name: "Digital Twin (Three.js)",
    url: "https://threejs.org/",
    description: "使用 WebGL 与 3D 渲染引擎将工厂物理资产状态实时映射至虚拟数字空间。",
  },
  "工控网络安全": {
    name: "ICS / SCADA Security",
    url: "https://www.cisa.gov/topics/industrial-control-systems",
    description: "工业控制系统网络隔离、现场总线防注入与工业级安全防御体系。",
  },
  "预测性维护": {
    name: "Predictive Maintenance",
    url: "https://en.wikipedia.org/wiki/Predictive_maintenance",
    description: "基于传感器振动与温度时序数据分析，提前预警轴承与电机机械磨损故障。",
  },

  // 开发者工具与测试
  "Git": {
    name: "Git",
    url: "https://git-scm.com/",
    description: "全球广泛采用的分布式版本控制系统，支撑高效团队分支协同与代码溯源。",
  },
  "Linux": {
    name: "Linux",
    url: "https://www.kernel.org/",
    description: "开源类 Unix 操作系统内核，全球云计算、容器与服务器基础设施基石。",
  },
  "Maven": {
    name: "Apache Maven",
    url: "https://maven.apache.org/",
    description: "基于项目对象模型 (POM) 的 Java 项目构建管理与依赖依赖管理工具。",
  },
  "Postman": {
    name: "Postman",
    url: "https://www.postman.com/",
    description: "业界通用的 API 协同设计、调试、自动化测试与文档发布工作平台。",
  },
  "Wireshark": {
    name: "Wireshark",
    url: "https://www.wireshark.org/",
    description: "全球顶尖的网络协议分析仪，支持深度抓包分析各种应用层与工控通信协议。",
  },
  "MQTTX": {
    name: "MQTTX",
    url: "https://mqttx.app/zh",
    description: "开源全功能跨平台 MQTT 客户端调试工具，支持单连接与多属性脚本模拟。",
  },
  "DBeaver": {
    name: "DBeaver",
    url: "https://dbeaver.io/",
    description: "免费开源的多平台通用数据库管理工具与 SQL 编辑执行客户端。",
  },
  "Navicat": {
    name: "Navicat",
    url: "https://www.navicat.com/zh-cn/",
    description: "老牌图形化多连接数据库管理与数据模型设计工具客户端。",
  },
  "PMM": {
    name: "Percona Monitoring and Management",
    url: "https://www.percona.com/software/database-tools/percona-monitoring-and-management",
    description: "用于监控 MySQL、PostgreSQL 和 MongoDB 数据库性能调优的开源最佳实践工具。",
  },
  "Explain": {
    name: "MySQL EXPLAIN",
    url: "https://dev.mysql.com/doc/refman/8.0/en/explain.html",
    description: "分析 MySQL 优化器执行计划的命令，检查索引命中、扫描行数与临时表开销。",
  },
  "SQL Tuning": {
    name: "SQL Tuning",
    url: "https://use-the-index-luke.com/",
    description: "SQL 查询深度性能调优，涵盖覆盖索引、最左前缀法则与消除深分页瓶颈。",
  },
  "SQL 执行计划优化": {
    name: "SQL Explain Tuning",
    url: "https://dev.mysql.com/doc/refman/8.0/en/explain.html",
    description: "剖析数据库查询优化器选路，消除全表扫描与文件排序（filesort）。",
  },
  "Index Design": {
    name: "Index Design",
    url: "https://use-the-index-luke.com/",
    description: "数据库索引设计精要，基于 B+ 树索引原理构建高命中率联合索引。",
  },
  "Sysbench": {
    name: "Sysbench",
    url: "https://github.com/akopytov/sysbench",
    description: "模块化、跨平台的数据库与操作系统硬件并发性能基准压测工具。",
  },
  "Conda": {
    name: "Conda",
    url: "https://docs.conda.io/",
    description: "跨平台开源包管理与虚拟环境隔离系统，广泛用于 Python/C++ 算法科研工程。",
  },
  "Jupyter": {
    name: "Jupyter",
    url: "https://jupyter.org/",
    description: "支持多语言交互式计算、数据探索性分析与可视化成果分享的 Web 工具。",
  },
  "PlatformIO": {
    name: "PlatformIO",
    url: "https://platformio.org/",
    description: "新一代专业的开源多架构嵌入式软件与物联网开发生态平台。",
  },
  "Keil": {
    name: "Keil MDK",
    url: "https://www.keil.arm.com/",
    description: "ARM Cortex-M 系列单片机经典的集成开发环境 (IDE) 与仿真调试工具。",
  },
  "Visual Studio": {
    name: "Visual Studio",
    url: "https://visualstudio.microsoft.com/",
    description: "微软全功能集成开发环境，用于 C++、C# 工业上位机与工控系统研发。",
  },
  "Logic Analyzer": {
    name: "Saleae Logic Analyzer",
    url: "https://www.saleae.com/",
    description: "逻辑分析仪，用于捕获和分析 I2C、SPI、UART 等硬件数字信号时序波形。",
  },
  "fast-check": {
    name: "fast-check",
    url: "https://fast-check.dev/",
    description: "TypeScript 属性测试框架，通过海量随机输入自动化探测数学边界缺陷。",
  },
  "Vitest": {
    name: "Vitest",
    url: "https://vitest.dev/",
    description: "基于 Vite 引擎的高性能原生单元与集成测试框架。",
  },
  "Playwright": {
    name: "Playwright",
    url: "https://playwright.dev/",
    description: "由微软研发的跨浏览器自动化端到端测试与真实用户行为回归框架。",
  },
  "OpenAPI": {
    name: "OpenAPI Specification",
    url: "https://www.openapis.org/",
    description: "描述 REST API 接口契约与数据架构的全球标准化规范。",
  },
  "Orval": {
    name: "Orval",
    url: "https://orval.dev/",
    description: "基于 OpenAPI 规格全自动生成强类型 TypeScript 客户端请求代码与 React Hooks。",
  },
  "Flyway": {
    name: "Flyway",
    url: "https://flywaydb.org/",
    description: "支持版本控制的开源数据库结构平滑迁移与变更审计工具。",
  },
  "CI/CD": {
    name: "CI/CD (GitHub Actions)",
    url: "https://github.com/features/actions",
    description: "持续集成与持续交付流水线，实现代码自动化构建、测试与云端部署。",
  },
  "CI/CD 流水线": {
    name: "CI/CD Pipeline",
    url: "https://github.com/features/actions",
    description: "基于 GitHub Actions 的代码自动化测试、镜像构建与无感发布流程。",
  },
  "Monorepo": {
    name: "Monorepo",
    url: "https://monorepo.tools/",
    description: "多项目集中在单个代码仓库中进行统一版本控制与跨包依赖共享的架构方案。",
  },

  // 架构与算法模式
  "微服务架构": {
    name: "Microservices Architecture",
    url: "https://microservices.io/",
    description: "将单体应用拆分为一系列高内聚、松耦合且可独立部署的细粒度服务集合。",
  },
  "高并发与缓存治理": {
    name: "Caching Patterns (Redis)",
    url: "https://redis.io/docs/latest/develop/use/patterns/",
    description: "多级缓存设计，严防缓存穿透、缓存击穿与缓存雪崩等高并发核心隐患。",
  },
  "RESTful / RPC 协议": {
    name: "REST API & gRPC",
    url: "https://restfulapi.net/",
    description: "微服务之间轻量级 HTTP REST 风格交互与高性能二进制 RPC 远程调用标准。",
  },
  "分布式事务": {
    name: "Distributed Transactions (2PC/TCC)",
    url: "https://en.wikipedia.org/wiki/Distributed_transaction",
    description: "在跨网络、跨数据库的分布式节点之间保障数据强一致性或最终一致性。",
  },
  "存储引擎原理": {
    name: "Database Engine Architecture",
    url: "https://en.wikipedia.org/wiki/Database_engine",
    description: "数据库内核中管理数据在物理磁盘与内存缓冲池之间高效读写的底层子系统。",
  },
  "数据治理与容灾": {
    name: "Data Governance & DR",
    url: "https://en.wikipedia.org/wiki/Data_governance",
    description: "企业级数据资产生命周期管理、主备容灾切换与定期自动冷热备份机制。",
  },
  "Bareiss 消元": {
    name: "Bareiss Algorithm",
    url: "https://en.wikipedia.org/wiki/Bareiss_algorithm",
    description: "无除法分数增长抑制的高效整数矩阵行列式与高斯消元精确计算算法。",
  },
  "Faddeev–LeVerrier": {
    name: "Faddeev–LeVerrier Algorithm",
    url: "https://en.wikipedia.org/wiki/Faddeev%E2%80%93LeVerrier_algorithm",
    description: "通过迹与矩阵乘积递归求解矩阵特征多项式与逆矩阵的纯代数算法。",
  },
  "Python 交叉验证": {
    name: "Cross-Validation (scikit-learn)",
    url: "https://scikit-learn.org/stable/modules/cross_validation.html",
    description: "基于 SymPy 与 NumPy 矩阵运算结果实施全量对照的双引擎自动化交叉验证。",
  },
  "多模型调度": {
    name: "Model Orchestration (vLLM)",
    url: "https://docs.vllm.ai/",
    description: "针对不同复杂度的 Prompt 动态路由至最佳大小的大模型服务以平衡成本与速度。",
  },
  "大模型 API": {
    name: "OpenAI API",
    url: "https://platform.openai.com/docs",
    description: "通过标准 HTTP/JSON 协议调用云端大语言模型与函数调用 (Tool Calling) 接口。",
  },
  "容灾降级": {
    name: "Sentinel Circuit Breaker",
    url: "https://github.com/alibaba/Sentinel",
    description: "在网络中断或模型接口异常时自动触发本地缓存规则与优雅降级响应。",
  },
};

export function getTechMeta(name: string): TechMeta {
  if (TECH_STACK_MAP[name]) {
    return TECH_STACK_MAP[name];
  }

  // 规范化名称后回退到 GitHub 权威技术专题页面
  const cleanName = name.replace(/[()（）]/g, "").trim();
  const slug = cleanName.toLowerCase().replace(/\s+/g, "-");
  return {
    name,
    url: `https://github.com/topics/${encodeURIComponent(slug)}`,
    description: `${name} 核心技术组件。`,
  };
}
