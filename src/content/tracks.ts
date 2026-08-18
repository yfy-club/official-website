import type { Track } from "./schema";

export const tracksRaw = [
  {
    slug: "ai",
    index: "01",
    nameZh: "人工智能",
    nameEn: "Artificial Intelligence",
    tagline: "探索大模型与计算机视觉前沿",
    positioning: "探索大模型、计算机视觉与智能体前沿，运用 AI 原理与算法解决实际工程问题。",
    stack: {
      languages: ["Python", "C/C++"],
      frameworks: ["PyTorch", "NumPy", "Pandas"],
      engineering: ["大模型应用", "智能体开发", "计算机视觉", "智能机器人"],
    },
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
          "参与机器视觉与机器人方向课题",
          "参加 AI 视觉与机器人竞赛",
          "学习大模型 API、Prompt Engineering 与工具调用机制",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递算法与 AI 工程实习",
            "补齐模型量化、ONNX 转换与服务化部署",
            "整理算法与工程落地作品集",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "推进 408、数学与英语复习节奏",
            "研读并复现目标方向前沿论文",
            "继续参加高水平竞赛并沉淀复试成果",
          ],
        },
      },
    },
    goal: "AI 工程师 / 算法研究员",
    relatedWorkSlugs: ["intellibuddy"],
    relatedAwardIds: ["ican-national-1st"],
  },
  {
    slug: "software",
    index: "02",
    nameZh: "软工智能",
    nameEn: "Intelligent Software Engineering",
    tagline: "融合软件工程与 AI 智能体",
    positioning: "融合软件工程思想与 AI 智能体工具，打造可部署、可维护的智能化企业级软件系统。",
    stack: {
      languages: ["Java", "TypeScript", "C/C++"],
      frameworks: ["Spring Boot", "Vue 3", "Vite"],
      engineering: ["智能体开发", "Web 全栈", "系统架构", "Docker 部署"],
    },
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
          "使用 Vue 3、TypeScript 完成前端工程",
          "配置云服务器、Nginx、Docker 与 HTTPS 部署",
          "参加软件赛与创新创业竞赛",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "深耕 Spring Boot、Spring Cloud 微服务体系",
            "掌握 Redis 缓存与 RabbitMQ 消息队列",
            "投递 Java 或全栈实习并共建企业级项目",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "开展 408 真题研讨与强化训练",
            "以全栈能力参与教师课题系统开发",
            "保持算法训练并积累复试机试优势",
          ],
        },
      },
    },
    goal: "智能软件工程师 / 全栈架构师",
    relatedWorkSlugs: ["matrix-calculator", "zgyc-smart-light", "intellibuddy"],
    relatedAwardIds: ["lanqiao-c-provincial-1st"],
  },
  {
    slug: "database",
    index: "03",
    nameZh: "数据库",
    nameEn: "Database Technology",
    tagline: "深耕分布式与国产数据库技术",
    positioning: "面向信创与国产替代需求，深耕分布式数据库架构、性能调优、可靠性与数据治理。",
    stack: {
      languages: ["SQL", "C/C++", "Shell"],
      frameworks: ["openGauss", "OceanBase", "MySQL", "Redis"],
      engineering: ["性能调优", "高可用", "数据治理", "分布式存储"],
    },
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "理解指针、内存分配与基础数据结构",
          "搭建 Linux 环境并通过常用指令考查",
          "掌握 MySQL 的 DDL、DML、DQL 与 DCL",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "理解 InnoDB、B+ 树索引、ACID 与 MVCC",
          "分析执行计划、慢查询并开展索引优化",
          "掌握 Redis 数据结构、持久化与缓存实践",
          "探索 openGauss 与 OceanBase 生态",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "掌握主从复制、读写分离与分库分表",
            "开展备份恢复、容灾演练与性能监控",
            "投递 DBA 或数据研发实习",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "围绕 408 重点攻坚数据结构与操作系统",
            "研读分布式存储与国产数据库前沿",
            "强化算法和数学基础并备战复试机试",
          ],
        },
      },
    },
    goal: "数据库架构师 / DBA / 数据工程师",
    relatedWorkSlugs: ["zgyc-smart-light"],
    relatedAwardIds: [],
  },
  {
    slug: "cloud-iot",
    index: "04",
    nameZh: "智能云物联",
    nameEn: "Intelligent Cloud & IoT",
    tagline: "打通端、边、云一体化协同",
    positioning: "聚焦端、边、云一体化，融合物联网嵌入式开发、云计算与智能硬件应用。",
    stack: {
      languages: ["C/C++", "Shell", "TypeScript"],
      frameworks: ["MQTT", "CoAP", "Modbus"],
      engineering: ["边缘计算", "嵌入式开发", "设备接入", "云平台开发"],
    },
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "掌握 C/C++ 与硬件底层交互基础",
          "学习 Linux 系统与 Shell 脚本",
          "理解 TCP/IP、HTTP 与 Socket 通信",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "掌握 MQTT、CoAP、Modbus 与设备认证",
          "参与智慧路灯等端边云工程实践",
          "搭建设备孪生、远程控制与遥测可视化",
          "参加智能汽车、电子设计与物联网专项赛",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递端边云或嵌入式 Linux 开发实习",
            "掌握网关接入、时序数据与遥测消息处理",
            "整理软硬件结合的完整作品集",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "备考 408 或自动化、电子通信专业课",
            "开展端边云协同与智能算法课题",
            "总结竞赛成果并提升复试展示力",
          ],
        },
      },
    },
    goal: "云物联架构师 / 嵌入式系统工程师",
    relatedWorkSlugs: ["zgyc-smart-light"],
    relatedAwardIds: ["smartcar-national-2nd"],
  },
  {
    slug: "industrial",
    index: "05",
    nameZh: "工业数智化",
    nameEn: "Industrial Digital Intelligence",
    tagline: "软硬结合赋能工业 4.0",
    positioning: "软硬件结合赋能工业 4.0，深耕工业软件架构、智能控制、机器视觉与设备状态监测。",
    stack: {
      languages: ["C/C++", "PLC", "TypeScript"],
      frameworks: ["工业总线", "嵌入式系统", "数字孪生"],
      engineering: ["工业软件", "机器视觉", "智能控制", "设备监测"],
    },
    roadmap: {
      freshman: {
        label: "大一 · 打基础",
        items: [
          "掌握 C/C++ 与工业控制基础算法",
          "学习传感器信号与串口通信",
          "完成基础测控界面编写",
        ],
      },
      sophomore: {
        label: "大二 · 攻技术",
        items: [
          "学习工业总线、PLC 控制与工控机通信",
          "参与电阻片检测与机械臂码垛课题",
          "结合机器视觉和控制完成自动化闭环",
          "参加机器人与工业互联网专项赛事",
        ],
      },
      junior: {
        employment: {
          label: "大三 · 就业",
          items: [
            "投递工业互联网或自动化系统集成实习",
            "掌握 SCADA、设备数字孪生与工业数据治理",
            "提炼工厂产线数智化实践成果",
          ],
        },
        postgrad: {
          label: "大三 · 考研",
          items: [
            "统筹 408、控制工程或智能制造专业课",
            "深入工业智能与视觉算法科研课题",
            "把产学研成果转化为研究与复试能力",
          ],
        },
      },
    },
    goal: "工业数智化专家 / 工业软件架构师",
    relatedWorkSlugs: [],
    relatedAwardIds: ["ican-national-1st"],
  },
] satisfies Track[];
