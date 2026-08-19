import type { Mechanism } from "./schema";

export const memberLadder = [
  {
    stage: "大一",
    count: 7,
    theme: "打基础",
    detail: "建立编程、协作与系统底层意识，完成从语法学习到工程规范训练的初始跃迁。",
    signals: ["C/C++", "Git 协作", "Linux 实操"],
  },
  {
    stage: "大二",
    count: 9,
    theme: "攻技术",
    detail: "明确技术方向并持续深耕，在真实工程项目与学科竞赛中承担核心研发任务。",
    signals: ["方向进阶", "项目交付", "竞赛主力"],
  },
  {
    stage: "大三",
    count: 14,
    theme: "分流发展",
    detail: "核心工程与算法能力成形，依据个人规划进入就业实践或考研深造双通道发展路径。",
    signals: ["就业实习", "考研深造"],
    branches: [
      { label: "A / 就业方向", detail: "企业级微服务、工程作品集与岗位核心能力强化。" },
      { label: "B / 考研方向", detail: "408 核心课攻坚、前沿算法研读与竞赛成果沉淀。" },
    ],
  },
  {
    stage: "大四",
    count: 12,
    theme: "传承",
    detail: "将复试、求职与毕业设计中的宝贵经验沉淀回流，完成梯队知识交接。",
    signals: ["经验复盘", "师徒交接", "成果归档"],
  },
] as const;

export const mechanisms = [
  {
    index: "01",
    title: "导师带学",
    tag: "培养带学",
    detail: "高年级骨干持续承担讲课、日常答疑与代码纠偏，把个人问题沉淀为全员可复用的经验。",
  },
  {
    index: "02",
    title: "阶段考核",
    tag: "考核测试",
    detail: "每学年设置期中、期末两次内部考核，并结合 C++ 课设、Linux 实操与 MySQL 控制台任务检验基础。",
  },
  {
    index: "03",
    title: "联合测试",
    tag: "考核测试",
    detail: "与其他工作室开展同阶段联合测试，通过横向对比发现知识盲区与编码规范问题。",
  },
  {
    index: "04",
    title: "工位打卡",
    tag: "日常运转",
    detail: "常规周固定打卡 16～22 小时，期末复习周最长可达 30 小时。",
  },
  {
    index: "05",
    title: "任务跟踪",
    tag: "日常运转",
    detail: "每周例会同步学习与项目进度，阶段任务经过代码检查、集中讲评和复盘改进。",
  },
  {
    index: "06",
    title: "环境维护",
    tag: "日常运转",
    detail: "每日轮值、周六深度维护，离室关闭设备并落实实验室安全。",
  },
  {
    index: "07",
    title: "退出机制",
    tag: "准入退出",
    detail: "长期未达阶段考核、严重违纪或出勤长期不达标者执行退出机制。",
  },
] satisfies Mechanism[];

export const annualReport = {
  year: "2025",
  title: "大一培养形成可复盘闭环",
  description: "年度记录覆盖基础学习、阶段考核、项目辅助与方向分流，所有数字均来自《2025 云飞扬社团年度汇报》。",
  metrics: [
    { value: "7", label: "名大一成员持续跟进" },
    { value: "2", label: "次内部阶段考核" },
    { value: "6", label: "个渐进学习阶段" },
    { value: "1", label: "套培养闭环" },
  ],
  outcomes: [
    "全员完成 C 语言、C++ 基础语法与基础算法学习。",
    "部分成员开始参与页面开发、接口联调和数据处理等项目辅助工作。",
    "基础路线结束后再按 Java 后端、Python 智能方向与真实项目进行分流。",
  ],
} as const;

export const mentorship = {
  description: "每位新成员配备一名高年级技术骨干定向辅导。阶段课设与大作业必须由师傅一对一逐行审阅代码、纠正规范、查验创新点后方可通过。",
  training: [
    { value: "25", label: "C 语言集训人次" },
    { value: "45", label: "C 语言集训学时" },
    { value: "14", label: "C++ 进阶人次" },
    { value: "8", label: "C++ 进阶学时" },
  ],
} as const;

export const advisorProfile = {
  name: "陈可",
  title: "教授 · 指导教师",
  image: "/images/advisor/陈可.webp",
  imageSecondary: "/images/advisor/陈可2.webp",
  roles: [
    "创新创业与就业指导中心副主任",
    "大学生程序设计集训队总教练",
    "中国计算机学会教育专委会委员",
    "谷歌教育合作部高级顾问",
    "IBM 大学合作部专家组成员",
  ],
  summary: "主持多项省级、教育部产学合作协同育人项目，指导学生参与程序设计、蓝桥杯、天梯赛、创新创业与挑战杯等赛事，并主持人工智能教育平台研究与企业横向课题。",
} as const;

export const culturePhotos = [
  { src: "/images/photos/lab-huisen-zone-01.webp", alt: "云飞扬汇森分工位编码区", caption: "汇森分工位 · 编码区 01", orientation: "portrait" },
  { src: "/images/photos/lab-huisen-zone-02.webp", alt: "云飞扬汇森分工位日常学习场景", caption: "汇森分工位 · 日常 02", orientation: "portrait" },
  { src: "/images/photos/lab-huisen-zone-03.webp", alt: "云飞扬汇森分工位工作场景", caption: "汇森分工位 · 工作区 03", orientation: "portrait" },
  { src: "/images/photos/lab-gathering.webp", alt: "云飞扬成员在实验室交流", caption: "实验室 · 团队交流", orientation: "landscape" },
  { src: "/images/photos/activity-dinner-latest.webp", alt: "云飞扬成员团队聚餐合影", caption: "团队活动 · 聚餐合影", orientation: "portrait" },
  { src: "/images/photos/activity-dinner.webp", alt: "云飞扬成员聚餐交流", caption: "团队活动 · 聚餐交流", orientation: "landscape" },
  { src: "/images/photos/activity-bbq.webp", alt: "云飞扬成员户外烧烤活动", caption: "团队活动 · 户外烧烤", orientation: "portrait" },
  { src: "/images/photos/activity-tea.webp", alt: "云飞扬成员日常奶茶小聚", caption: "团队日常 · 轻松一刻", orientation: "landscape" },
] as const;
