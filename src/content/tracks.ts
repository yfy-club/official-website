import type { Track } from "./schema";

export const tracksRaw = [
  {
    slug: "ai",
    index: "01",
    nameZh: "人工智能",
    nameEn: "Artificial Intelligence",
    tagline: "探索大模型智能体与计算机视觉前沿",
    positioning: "探索大模型、计算机视觉与智能体前沿，运用 AI 原理与算法解决实际工程问题，打通端云协同与算法工程化落地全流程。",
    stack: {
      languages: ["Python", "C/C++", "SQL"],
      frameworks: ["PyTorch", "OpenCV", "NumPy", "Pandas", "LangChain", "vLLM"],
      engineering: ["大模型智能体 (Agent)", "检索增强生成 (RAG)", "计算机视觉 (CV)", "智能机器人", "ONNX 模型量化"],
      toolchain: ["Git", "Conda", "Jupyter", "TensorBoard", "Docker", "HuggingFace"],
    },
    deepFocus: [
      {
        title: "计算机视觉与目标检测 (Computer Vision)",
        subtitle: "YOLO / 缺陷识别 / 智能视频流分析",
        description: "深入 CNN、ResNet 与 YOLO 系列算法，实现工业表面缺陷检测、多目标实时跟踪与边缘计算推理加速，满足低延迟实时场景需求。",
        techTags: ["PyTorch", "YOLOv8/v9", "OpenCV", "ONNX Runtime"],
        highlight: "已产出 iCAN 全国一等奖算法成果及光伏板缺陷检测在研课题",
      },
      {
        title: "大语言模型与智能体工程 (LLM & Agent)",
        subtitle: "Function Calling / RAG / 知识库问答",
        description: "聚焦大语言模型 API 深度集成、Prompt 架构设计、向量数据库（Chroma/Milvus）检索增强与自主智能体（Agent）多工具协同调用。",
        techTags: ["LangChain", "RAG", "Prompt Engineering", "Vector DB"],
        highlight: "落地『智学伴』个性化智能学习问答与知识沉淀中枢",
      },
      {
        title: "端侧推理与智能机器人 (Edge AI & Robotics)",
        subtitle: "嵌入式 AI / 模型轻量化 / ROS 机器人",
        description: "研究模型剪枝、量化与 TensorRT/OpenVINO 硬件加速，将视觉识别与自主决策算法部署于无人机、智能车与机械臂等物理载体中。",
        techTags: ["ROS", "TensorRT", "Edge Computing", "C++"],
        highlight: "多次获全国智能汽车竞赛与机器人大赛权威奖项",
      },
    ],
    curriculumModules: [
      {
        stage: "STG-01",
        title: "大一 · 底层启蒙与数据科学基础",
        objective: "打牢 C/C++ 内存控制基础，掌握 Python 数据处理与线性代数算法，建立代码版本管理习惯。",
        coreTopics: ["C/C++ 语法与指针内存意识", "Python 面向对象与工程规范", "NumPy & Pandas 数据清洗", "Git 分支协作与 README 文档规范", "线性代数、矩阵计算与微积分基础"],
        experiment: "完成矩阵四则运算与基于 NumPy 的单层感知机反向传播训练脚本",
        reviewStandard: "代码无内存泄漏，符合 PEP8/Google C++ 规范，提交具备清晰 Commit Message",
      },
      {
        stage: "STG-02",
        title: "大二 · 深度学习与方向专项攻坚",
        objective: "系统掌握深度学习理论，复现主流卷积与 Transformer 网络，参与社团真实课题与权威竞赛。",
        coreTopics: ["PyTorch 神经网络搭建与 Loss 调优", "CNN、ResNet 与 YOLO 目标检测复现", "OpenCV 图像滤波、边缘检测与形态学处理", "大模型 API 调用与 Prompt Engineering", "模型评估指标 (mAP/F1-score/Confusion Matrix)"],
        experiment: "基于自建数据集完成特定目标检测模型训练、调优并导出 ONNX 格式",
        reviewStandard: "独立完成数据集标注、训练日志可视化与模型在测试集上的性能验证答辩",
      },
      {
        stage: "STG-03",
        title: "大三 · 工程落地与就业/考研双通道",
        objective: "深入模型量化与服务化部署，投递高水平算法实习；或系统备战 408 计算机考研深造。",
        coreTopics: ["ONNX / TensorRT / vLLM 模型服务化部署", "RAG 知识库检索增强与向量召回优化", "408 数据结构与操作系统考研攻坚", "学术前沿论文研读与复现实验", "算法作品集梳理与企业级项目实战"],
        experiment: "构建包含 Web 前端交互与后端并发推理的端到端 AI Agent 演示系统",
        reviewStandard: "形成完整的工程代码仓库、API 文档与压测性能报告，通过导师组综合评审",
      },
    ],
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "C/C++ 编程逻辑与基础算法过关，建立内存与指针意识",
          "掌握 Python 工程规范与 NumPy、Pandas 数据处理",
          "使用 Git 完成多阶段提交与标准化项目说明",
          "补足线性代数、概率论与 PyTorch 基础",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "掌握 CNN、RNN、Transformer 并复现 ResNet、YOLO",
          "参与机器视觉与机器人方向课题攻坚",
          "参加 AI 视觉与机器人学科竞赛",
          "学习大模型 API、Prompt Engineering 与工具调用机制",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递算法与 AI 工程实习，积累一线研发经验",
            "补齐模型量化、ONNX 转换与服务化部署能力",
            "整理算法与工程落地高质量作品集",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "推进 408、数学与英语系统化复习节奏",
            "研读并复现目标院校导师前沿方向论文",
            "继续参加高水平竞赛并沉淀复试硬核成果",
          ],
        },
      },
    },
    goal: "AI 算法工程师 / 大模型应用架构师 / 科研学者",
    relatedWorkSlugs: ["intellibuddy"],
    relatedAwardIds: ["ican-national-1st"],
  },
  {
    slug: "software",
    index: "02",
    nameZh: "软工智能",
    nameEn: "Intelligent Software Engineering",
    tagline: "融合现代软件工程与 AI 智能体",
    positioning: "融合现代微服务架构、全栈工程化与 AI 智能体开发范式，打造高并发、高可用、可部署的现代化企业级软件系统。",
    stack: {
      languages: ["Python", "TypeScript", "C/C++", "SQL"],
      frameworks: ["Spring Boot", "Spring Cloud", "Vue 3", "Next.js", "MyBatis-Plus", "Express"],
      engineering: ["微服务架构", "高并发与缓存治理", "Docker 容器编排", "CI/CD 流水线", "RESTful / RPC 协议", "AI 智能体开发"],
      toolchain: ["Git", "Maven", "Docker", "Postman", "Nginx", "Linux", "Vite"],
    },
    deepFocus: [
      {
        title: "企业级微服务与高并发架构 (Microservices)",
        subtitle: "Spring Cloud / 分布式事务 / 异步解耦",
        description: "深入 Spring Boot 3 与微服务生态，设计高内聚低耦合分层架构，运用 Redis 多级缓存、RabbitMQ 削峰填谷与分布式锁保障系统强韧性。",
        techTags: ["Spring Boot", "Spring Cloud", "Redis", "RabbitMQ"],
        highlight: "承载社团全部上线系统的核心后端架构与高并发底座",
      },
      {
        title: "现代工程化 Web 全栈 (Modern Full-Stack)",
        subtitle: "TypeScript / Vue 3 / Next.js / Tailwind CSS",
        description: "强调前后端工程化与类型安全，掌握响应式交互、组件设计范式、状态管理与服务端渲染（SSR/SSG），追求丝滑极简的交互性能。",
        techTags: ["Vue 3", "TypeScript", "Next.js", "Tailwind CSS"],
        highlight: "构建『矩阵计算器』『智光耀城』与新一代官网的交互前端",
      },
      {
        title: "云原生运维与自动化交付 (DevOps & Cloud)",
        subtitle: "Docker / Nginx / 反向代理 / 监控看板",
        description: "掌握 Linux 服务器集群运维、Docker 容器化封装、Nginx 负载均衡与 HTTPS 证书自动化部署，建立完备的生产级服务监控与日志回溯体系。",
        techTags: ["Docker", "Nginx", "Linux", "CI/CD"],
        highlight: "实现全站一键构建与零宕机灰度发布",
      },
    ],
    curriculumModules: [
      {
        stage: "STG-01",
        title: "大一 · 面向对象与 Web 工程入门",
        objective: "完成 C/C++ 到 Java 面向对象的跨越，掌握三层架构设计与基础 Web 前端交互，熟悉 Git 分支协作。",
        coreTopics: ["Java 核心语法与集合框架 (Collection/Map)", "面向对象设计原则 (SOLID)", "HTML5 / CSS3 / JavaScript DOM", "MySQL 基础查询与 JDBC 数据库连接", "Git 分支协作与 Pull Request 流程"],
        experiment: "独立开发包含控制层、服务层、持久层三层解耦的 JavaSE 控制台管理系统",
        reviewStandard: "分层清晰，异常捕获规范，单元测试覆盖核心业务逻辑并通过导师答辩",
      },
      {
        stage: "STG-02",
        title: "大二 · 企业级全栈与微服务攻坚",
        objective: "掌握 Spring Boot + Vue 3 现代前后端分离开发，熟练应用 Redis 缓存与 Docker 容器化部署。",
        coreTopics: ["Spring Boot 核心注解与 AOP/IoC 原理", "MyBatis-Plus 链式查询与分页插件", "Vue 3 Composition API 与 TypeScript 类型系统", "Redis 缓存穿透/雪崩防御策略", "Docker 镜像打包与云服务器 Nginx 反向代理"],
        experiment: "端到端完成一套具备 JWT 权限认证、文件上传与缓存加速的完整 Web 全栈系统",
        reviewStandard: "系统成功部署上线并通过公网访问，API 契约清晰且包含自动化数据库迁移脚本",
      },
      {
        stage: "STG-03",
        title: "大三 · 分布式架构与就业/考研双通道",
        objective: "深耕微服务集群与高并发场景，投递一线软件开发实习；或系统复习 408 备战计算机考研。",
        coreTopics: ["Spring Cloud Alibaba 微服务治理组件 (Nacos/Sentinel)", "RabbitMQ 消息可靠性投递与死信队列", "408 计算机网络与操作系统考研重难点剖析", "真实高并发场景下的接口压测与性能排查", "技术博客沉淀与个人工程作品集提炼"],
        experiment: "主导设计一套包含服务注册、分布式锁与异步消息消费的微服务业务集群",
        reviewStandard: "提供完整的系统架构设计说明书、JMeter 压测报告与 GitHub 开源仓库",
      },
    ],
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "掌握 C/C++ 面向对象思想并完成独立课设答辩",
          "使用 Git 分支协作与规范化提交",
          "完成响应式 Web 页面与 JavaScript DOM 交互",
          "完成三层分层、持久化与异常处理的 JavaSE 大作业",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "掌握 JavaWeb、MyBatis、Maven 与分层架构",
          "使用 Vue 3、TypeScript 完成前端工程化开发",
          "配置云服务器、Nginx、Docker 与 HTTPS 部署",
          "参加软件学科竞赛与创新创业赛事",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "深耕 Spring Boot、Spring Cloud 微服务体系",
            "掌握 Redis 缓存穿透防御与 RabbitMQ 消息队列",
            "投递 Java 或全栈实习并共建企业级商业项目",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "开展 408 真题研讨与强化训练",
            "以全栈能力参与指导教师科研课题系统开发",
            "保持高频算法训练并积累复试机试优势",
          ],
        },
      },
    },
    goal: "智能软件架构师 / 高级全栈工程师 / 技术主管",
    relatedWorkSlugs: ["matrix-calculator", "zgyc-smart-light", "intellibuddy"],
    relatedAwardIds: ["lanqiao-c-provincial-1st"],
  },
  {
    slug: "database",
    index: "03",
    nameZh: "数据库",
    nameEn: "Database Technology",
    tagline: "深耕分布式存储与国产信创数据库",
    positioning: "面向国家信创与关键基础设施需求，深耕关系型、分布式与国产数据库底层架构，精通存储引擎、查询调优与高可用数据治理。",
    stack: {
      languages: ["SQL", "C/C++", "Shell", "Python"],
      frameworks: ["openGauss", "OceanBase", "MySQL", "PostgreSQL", "Redis", "TiDB"],
      engineering: ["存储引擎原理", "SQL 执行计划优化", "高可用主从架构", "分布式事务", "数据治理与容灾", "分库分表"],
      toolchain: ["Git", "Linux", "DBeaver", "Explain", "PMM", "Sysbench", "Navicat"],
    },
    deepFocus: [
      {
        title: "存储引擎底层与内核机制 (Storage Engine & Kernel)",
        subtitle: "InnoDB / B+ 树 / LSM-Tree / MVCC",
        description: "深入 InnoDB 存储引擎底层，探究 B+ 树物理页结构、WAL 预写日志机制、Undo/Redo Log 崩溃恢复与 MVCC 多版本并发控制原理。",
        techTags: ["InnoDB", "B+ Tree", "MVCC", "WAL Log"],
        highlight: "建立对磁盘 I/O、缓冲池（Buffer Pool）与锁竞争的微观掌控力",
      },
      {
        title: "SQL 执行计划与深度性能调优 (Query Optimization)",
        subtitle: "Explain / 索引覆盖 / 慢查询优化",
        description: "通过 EXPLAIN 分析执行计划与优化器（Optimizer）选路逻辑，解决索引失效、深分页、大表 Join 瓶颈，并设计合理的分库分表与分区策略。",
        techTags: ["SQL Tuning", "Explain", "Index Design", "Sharding"],
        highlight: "优化『智光耀城』数万级传感器时序数据的复杂聚合查询耗时",
      },
      {
        title: "分布式共识与国产信创生态 (Distributed & Xinchuang)",
        subtitle: "openGauss / OceanBase / Raft / 容灾高可用",
        description: "聚焦华为 openGauss、阿里 OceanBase 等国产顶级分布式数据库，攻坚 Raft 共识算法、分布式事务 2PC/3PC 与两地三中心容灾体系。",
        techTags: ["openGauss", "OceanBase", "Raft", "High Availability"],
        highlight: "全面接轨国家信创战略与大型金融政企数据库选型",
      },
    ],
    curriculumModules: [
      {
        stage: "STG-01",
        title: "大一 · 关系模型与 SQL 严谨工程表达",
        objective: "掌握关系代数、范式理论与标准 SQL 语句，搭建 Linux 下 MySQL 运行环境并能完成多表关联建模。",
        coreTopics: ["关系数据库三范式 (1NF/2NF/3NF) 与反范式设计", "DDL / DML / DQL / DCL 语法规范", "复杂多表关联 (Join/Subquery/Group By)", "Linux 下数据库安装、用户权限与远程连接", "事务 ACID 基础概念与隔离级别"],
        experiment: "针对大型电商或高校教务系统设计规范的 E-R 实体图与 15+ 张核心表结构 DDL 脚本",
        reviewStandard: "表结构设计符合第三范式，字段命名规范且主外键及基础索引定义完备",
      },
      {
        stage: "STG-02",
        title: "大二 · 存储引擎深入与性能调优实战",
        objective: "深入 InnoDB 核心原理，熟练运用 Explain 分析慢查询，掌握 Redis 缓存与 openGauss 信创数据库。",
        coreTopics: ["InnoDB 页结构、聚簇索引与二级索引寻址", "EXPLAIN 执行计划各字段深度剖析", "慢查询日志分析与覆盖索引调优", "Redis 数据持久化 (RDB/AOF) 与哨兵集群", "openGauss 单机与主备复制集群搭建"],
        experiment: "针对千万级模拟数据集开展慢查询定位，通过索引优化使复杂聚合查询性能提升 10 倍以上",
        reviewStandard: "产出详尽的性能压测对比报告与 EXPLAIN 优化前后成本（Cost）分析对比",
      },
      {
        stage: "STG-03",
        title: "大三 · 分布式架构与 DBA 职业通道",
        objective: "攻坚分布式数据库存储与分片技术，投递 DBA 或数据基础设施研发实习；或备战考研。",
        coreTopics: ["分布式事务 (2PC/TCC) 与 BASE 理论", "Raft 选举与日志复制分布式共识算法", "ShardingSphere 分库分表与读写分离实战", "数据库自动化备份、容灾演练与监控告警", "408 数据结构、操作系统与软考数据库系统工程师"],
        experiment: "设计并部署一套基于 openGauss / MySQL 的主从自动容灾切换与读写分离集群架构",
        reviewStandard: "成功模拟节点断电宕机并在 15 秒内完成主备切换，数据无丢失且应用无感知",
      },
    ],
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "理解指针、内存分配与基础数据结构",
          "搭建 Linux 生产环境并通过常用运维指令考查",
          "掌握 MySQL 的 DDL、DML、DQL 与事务基础",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "深入 InnoDB、B+ 树索引、ACID 与 MVCC 机制",
          "分析执行计划、慢查询日志并开展索引深度调优",
          "掌握 Redis 数据结构、持久化与缓存实战",
          "搭建与探索 openGauss 与 OceanBase 国产数据库生态",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "掌握主从复制、读写分离与分库分表治理",
            "开展自动化备份恢复、容灾演练与性能监控看板",
            "投递 DBA、数据基础设施或存储研发实习",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "围绕 408 重点攻坚数据结构、操作系统与网络",
            "研读分布式存储与国产数据库最新学术论文",
            "强化算法与数学功底并备战名校复试机试",
          ],
        },
      },
    },
    goal: "数据库内核研发工程师 / 资深 DBA / 数据架构师",
    relatedWorkSlugs: ["zgyc-smart-light"],
    relatedAwardIds: [],
  },
  {
    slug: "cloud-iot",
    index: "04",
    nameZh: "智能云物联",
    nameEn: "Intelligent Cloud & IoT",
    tagline: "打通端、边、云一体化全链路协同",
    positioning: "聚焦端、边、云一体化架构，打通微控制器裸机驱动、FreeRTOS 嵌入式实时系统、物联网通信网关与云端时序遥测大数据平台。",
    stack: {
      languages: ["C/C++", "Shell", "TypeScript", "Python"],
      frameworks: ["FreeRTOS", "STM32 HAL", "ESP-IDF", "MQTT", "Modbus", "ThingsBoard", "EMQX"],
      engineering: ["嵌入式驱动开发", "边缘计算网关", "时序遥测采集", "设备影子 (Device Shadow)", "OTA 固件升级", "低功耗通信"],
      toolchain: ["Git", "Keil", "PlatformIO", "Wireshark", "Logic Analyzer", "Linux", "MQTTX"],
    },
    deepFocus: [
      {
        title: "嵌入式底层驱动与实时操作系统 (MCU & RTOS)",
        subtitle: "STM32 / ESP32 / FreeRTOS / 寄存器操作",
        description: "从 ARM Cortex-M 架构出发，精通 GPIO、I2C、SPI、UART 等外设寄存器与 HAL 库，熟练配置 FreeRTOS 任务调度、队列、信号量与内存管理。",
        techTags: ["STM32", "ESP32", "FreeRTOS", "C/C++"],
        highlight: "具备独立画板打样（PCB）与底层固件编写调优的硬件全栈能力",
      },
      {
        title: "物联网通信协议与边缘网关 (IoT Protocols & Edge)",
        subtitle: "MQTT / Modbus / EMQX / 边缘规则引擎",
        description: "掌握工业与民用标准物联网通信协议，编写轻量级网关固件，实现多传感器并发轮询、协议双向转换、断网续传与边缘过滤报警。",
        techTags: ["MQTT", "Modbus TCP/RTU", "EMQX", "Edge Gateway"],
        highlight: "成功支撑智慧路灯杆的环境监测、安防监控与照明策略下发",
      },
      {
        title: "云端设备孪生与时序遥测大屏 (Cloud Platform & Twin)",
        subtitle: "ThingsBoard / 设备孪生 / 时序数据可视化",
        description: "打通设备注册认证、设备影子、遥测数据入库与云端控制指令下发，基于 Web 端实时呈现海量设备地理分布与时序状态图表。",
        techTags: ["ThingsBoard", "Device Shadow", "Telemetry", "WebSockets"],
        highlight: "打造『智光耀城』南阳试点路灯资产数字化管理平台",
      },
    ],
    curriculumModules: [
      {
        stage: "STG-01",
        title: "大一 · 硬件基础与 C 语言裸机编程",
        objective: "掌握电子元器件特性、数字电路基础，使用 C 语言编写单片机 GPIO、定时器与中断驱动程序。",
        coreTopics: ["C 语言指针与位运算操作硬件寄存器", "数字电路、模电基础与示波器/逻辑分析仪使用", "STM32 / 51 单片机基础架构与时钟配置", "UART 串口通信协议与通信数据帧设计", "传感器 (温度/湿度/光敏) 模拟量与数字量采集"],
        experiment: "使用 STM32 读取温湿度传感器数据并通过串口向 PC 发送标准 JSON 格式数据帧",
        reviewStandard: "电路连接规范，通信波形经逻辑分析仪抓包校验无误码，代码具备详细驱动注释",
      },
      {
        stage: "STG-02",
        title: "大二 · 嵌入式操作系统与 MQTT 物联网通信",
        objective: "掌握 FreeRTOS 实时多任务设计，使用 ESP32 连接 Wi-Fi 并通过 MQTT 协议对接云端平台。",
        coreTopics: ["FreeRTOS 多任务创建、优先级反转与互斥信号量", "ESP32 Wi-Fi / 蓝牙栈配置与低功耗模式", "MQTT 协议原理 (QoS 0/1/2、遗嘱消息、心跳包)", "Modbus-RTU 工业传感器协议解析与 CRC16 校验", "WebSockets 实时遥测数据流传输与展示"],
        experiment: "构建包含 3+ 外设的多任务 FreeRTOS 边缘采集节点，定时上报状态至自建 EMQX Broker",
        reviewStandard: "在网络抖动或断网情况下能实现自动重连与本地缓存，通过连续 48 小时稳定性测试",
      },
      {
        stage: "STG-03",
        title: "大三 · 端边云协同与综合系统工程",
        objective: "主持复杂物联网工程软硬件架构设计，投递嵌入式/物联网开发实习；或考研深造。",
        coreTopics: ["OTA (Over-The-Air) 固件空中升级与差分算法", "嵌入式 Linux 系统移植与网关应用开发", "端到端设备安全加密认证 (TLS/AES)", "408 / 自动化通信考研复习强化", "全国智能汽车竞赛与电子设计大赛高阶备赛"],
        experiment: "独立设计并交付一套集成了硬件终端、边缘网关与 Web 控制台的完整智慧城市微缩系统",
        reviewStandard: "完成电路 PCB 原理图、固件源码与云端平台交互验收答辩，文档齐全可复现",
      },
    ],
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "掌握 C/C++ 与硬件底层交互基础知识",
          "学习 Linux 系统与 Shell 脚本编程",
          "理解 TCP/IP、HTTP 与 Socket 网络通信原理",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "掌握 FreeRTOS、MQTT、Modbus 与设备认证机制",
          "深度参与智慧路灯等端边云真实工程实践",
          "搭建设备孪生、远程控制与时序遥测可视化看板",
          "参加全国大学生智能汽车竞赛与电子设计专项赛",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递端边云协同或嵌入式 Linux 驱动开发实习",
            "掌握网关设备接入、时序数据流与遥测高并发处理",
            "提炼整理软硬件结合的完整真实工程作品集",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "系统备考 408 或自动化、电子信息专业课",
            "开展端边云协同与嵌入式智能算法科研课题",
            "全面总结竞赛成果并提升高校复试科研展示力",
          ],
        },
      },
    },
    goal: "端边云物联架构师 / 嵌入式固件工程师 / 智能硬件研发专家",
    relatedWorkSlugs: ["zgyc-smart-light"],
    relatedAwardIds: ["smartcar-national-2nd"],
  },
  {
    slug: "industrial",
    index: "05",
    nameZh: "工业数智化",
    nameEn: "Industrial Digital Intelligence",
    tagline: "软硬结合深度赋能工业 4.0 智能制造",
    positioning: "软硬件结合赋能工业 4.0，深耕工业软件架构、智能控制、工业机器视觉、PLC 工控互联与设备数字孪生实时监测。",
    stack: {
      languages: ["C/C++", "Python", "C#", "PLC 梯形图", "TypeScript"],
      frameworks: ["OPC UA", "Modbus TCP", "Three.js", "OpenCV", "Node-RED", "Siemens S7"],
      engineering: ["工业 SCADA 组态", "产线 3D 数字孪生", "工业机器视觉", "PLC 自动化逻辑", "预测性维护", "工控网络安全"],
      toolchain: ["Git", "TIA Portal (博途)", "TwinCAT", "Visual Studio", "Node-RED", "Wireshark"],
    },
    deepFocus: [
      {
        title: "PLC 智能控制与工业现场总线 (PLC & Fieldbus)",
        subtitle: "西门子 S7 / 梯形图 / OPC UA / 工业以太网",
        description: "熟练使用西门子博途（TIA Portal）等工控环境，精通 IEC 61131-3 梯形图与结构化文本（ST），打通 OPC UA 与 S7 协议工业数据互联。",
        techTags: ["Siemens PLC", "OPC UA", "TIA Portal", "Modbus TCP"],
        highlight: "具备工业级产线节拍逻辑控制与安全联锁保护编程实战经验",
      },
      {
        title: "工业机器视觉与智能引导 (Industrial Machine Vision)",
        subtitle: "OpenCV / 缺陷检测 / 机械臂手眼标定 / 深度学习",
        description: "结合高精度工业相机、环形光源与 OpenCV/YOLO 算法，实现工件尺寸测量、表面划痕/气泡智能判定与六轴机械臂手眼标定抓取。",
        techTags: ["OpenCV", "YOLO", "Hand-Eye Calibration", "Industrial Camera"],
        highlight: "攻坚电阻片缺陷检测与自动化机械臂码垛课题",
      },
      {
        title: "产线数字孪生与工业 SCADA (Digital Twin & SCADA)",
        subtitle: "Three.js / WebGL / Node-RED / 状态监测看板",
        description: "基于 Three.js 与 WebGL 构建工厂产线 3D 仿真模型，将 PLC 实时遥测数据映射到 3D 数字孪生体中，实现 OEE 设备综合效率分析与故障预警。",
        techTags: ["Three.js", "WebGL", "SCADA", "Node-RED"],
        highlight: "打造沉浸式工业生产线实时三维态势与能耗感知中枢",
      },
    ],
    curriculumModules: [
      {
        stage: "STG-01",
        title: "大一 · 工业自动化启蒙与测控编程",
        objective: "掌握 C/C++ 与面向工业控制的编程思维，理解传感器信号调理与串口工控通信协议。",
        coreTopics: ["C/C++ 语言核心与工业数据校验 (CRC/LRC)", "工业传感器与继电器/光耦隔离原理", "串口与 RS-485 差分总线通信规范", "基础测控上位机界面编写 (C#/Python)", "工业安全规范与防浪涌/接地保护"],
        experiment: "使用 C# / Python 编写工业上位机，通过 RS-485 采集多路温度传感器并绘制动态时序曲线",
        reviewStandard: "上位机通信稳定无假死，具备超时重试与异常数据报警弹窗机制",
      },
      {
        stage: "STG-02",
        title: "大二 · PLC 逻辑编程与工业机器视觉",
        objective: "掌握西门子 PLC 梯形图逻辑设计，结合工业相机与 OpenCV 实现目标定位与瑕疵检测。",
        coreTopics: ["西门子 S7-1200/1500 PLC 硬件配置与编程", "定时器、计数器与顺序控制指令 (SFC/LAD)", "工业工业相机光源选型与曝光参数调试", "OpenCV 灰度变换、轮廓提取与几何测量", "OPC UA 服务器搭建与跨平台数据交互"],
        experiment: "搭建一套 PLC 控制电机启停与工业相机视觉判定良品/不良品的联动分拣测试平台",
        reviewStandard: "视觉判定准确率 > 99%，判定用时 < 50ms，与 PLC 信号同步无时序冲突",
      },
      {
        stage: "STG-03",
        title: "大三 · 产线数字孪生与工业互联网攻坚",
        objective: "研发 3D 数字孪生中控与 SCADA 系统，投递工业软件/智能制造实习；或考研深造。",
        coreTopics: ["Three.js 工业模型加载与着色器动画渲染", "Node-RED 工业低代码数据流引擎编排", "工业预测性维护 (PHM) 与设备寿命分析", "408 / 控制工程 / 机械自动化考研深度复习", "睿抗机器人与工业互联网大赛高难度赛题攻关"],
        experiment: "开发一套基于 WebGL 的车间数字孪生监控系统，实时绑定多台 PLC 设备运转状态",
        reviewStandard: "具备 3D 视角自由漫游、故障高亮报警与实时 OEE 效率计算，通过产学研联合答辩",
      },
    ],
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "掌握 C/C++ 与工业控制底层基础算法",
          "学习工业传感器信号调理与串口通信协议",
          "完成基础工业测控上位机界面编写",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "学习工业总线、PLC 控制与工控机双向通信",
          "参与电阻片检测与自动化机械臂码垛课题",
          "结合机器视觉和智能控制完成自动化闭环",
          "参加机器人与工业互联网国家级/省级专项赛",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递工业互联网或自动化系统集成高阶实习",
            "掌握 SCADA 组态、设备数字孪生与工业数据治理",
            "全面提炼工厂产线数智化改造实战成果",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "系统统筹 408、控制工程或智能制造专业课",
            "深入工业智能算法与机器视觉高阶科研课题",
            "把产学研落地成果转化为学术研究与复试硬核实力",
          ],
        },
      },
    },
    goal: "工业数智化架构师 / 工业软件专家 / 智能制造系统工程师",
    relatedWorkSlugs: [],
    relatedAwardIds: ["ican-national-1st"],
  },
] satisfies Track[];
