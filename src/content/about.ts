export const memberLadder = [
  { stage: "大一", count: 7, theme: "打基础", detail: "语法、Git 与系统基础，完成实验室融入。" },
  { stage: "大二", count: 9, theme: "攻技术", detail: "技术攻坚，进入项目与竞赛主力。" },
  { stage: "大三", count: 14, theme: "分流", detail: "就业实习 / 考研科研，两条路径等权。" },
  { stage: "大四", count: 12, theme: "传承", detail: "复试、实习与毕设经验回流。" },
] as const;

export const mechanisms = [
  { title: "阶段考核", detail: "C 语言期中考、C++ 课设验收、Linux 综合实操考与 MySQL 控制台实训。" },
  { title: "工位打卡", detail: "常规周固定打卡 16～22 小时，期末复习周最长可达 30 小时。" },
  { title: "任务跟踪", detail: "每周例会同步学习与项目进度，阶段任务有明确验收节点与讲评复盘。" },
  { title: "环境维护", detail: "每日轮值、周六深度维护，离室关闭设备并落实实验室安全。" },
  { title: "退出机制", detail: "长期未达阶段考核、严重违纪或出勤长期不达标者执行退出机制。" },
] as const;

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
  roles: [
    "创新创业与就业指导中心副主任",
    "大学生程序设计集训队总教练",
    "中国计算机学会教育专委会委员",
    "谷歌教育合作部高级顾问",
    "IBM 大学合作部专家组成员",
  ],
  summary: "主持多项省级、教育部产学合作协同育人项目，指导学生参与程序设计、蓝桥杯、天梯赛、创新创业与挑战杯等赛事，并主持人工智能教育平台研究与企业横向课题。",
} as const;
