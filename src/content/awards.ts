import type { Award } from "./schema";

export const competitionOverview = [
  { competition: "iCAN 国际创新创业大赛 / AI 视觉挑战赛", level: "国家级 / 省级", result: "全国一等奖 · 省级二等奖 · 河南省银奖/铜奖" },
  { competition: "全国大学生智能汽车竞赛", level: "国家级 / 省级", result: "国家级二等奖 · 省级一等奖" },
  { competition: "团体程序设计天梯赛", level: "国家级", result: "全国团队二等奖" },
  { competition: "蓝桥杯全国软件和信息技术专业人才大赛", level: "省级 / 国家级", result: "省级一、二、三等奖累计十余项 · 晋级国赛" },
  { competition: "全国大学生数学建模竞赛", level: "省级", result: "河南省一等奖 2 项" },
  { competition: "全国大学生统计建模大赛", level: "国家级 / 省级", result: "省级一、二、三等奖 · 入围全国总决赛" },
  { competition: "挑战杯 / 中国国际大学生创新大赛", level: "省级", result: "河南省银奖 · 多项目入围省赛答辩" },
] as const;

export const awardsRaw = [
  {
    id: "ican-national-1st",
    competition: "iCAN 大学生创新创业大赛 AI 视觉检测设计挑战赛",
    level: "国家级",
    result: "全国一等奖",
    year: "2024",
    image: "/images/certs/cert-ican-national-1st.webp",
    description: "2024 年全国总决赛一等奖。",
    trackSlugs: ["ai", "industrial"],
  },
  {
    id: "smartcar-national-2nd",
    competition: "全国大学生智能汽车竞赛",
    level: "国家级",
    result: "全国总决赛模型组二等奖",
    year: "2024",
    image: "/images/certs/cert-smartcar-national-2nd.webp",
    description: "第十九届全国大学生智能汽车竞赛全国总决赛模型组二等奖。",
    trackSlugs: ["cloud-iot", "industrial"],
  },
  {
    id: "challengecup-provincial-silver",
    competition: "挑战杯河南省大学生创业计划竞赛",
    level: "省级",
    result: "银奖",
    year: "2024",
    image: "/images/certs/cert-challengecup-provincial-silver.webp",
    description: "2024 年挑战杯河南省大学生创业计划竞赛银奖。",
    trackSlugs: ["cloud-iot", "industrial"],
  },
  {
    id: "cumcm-provincial-1st",
    competition: "全国大学生数学建模竞赛",
    level: "省级",
    result: "河南赛区省级一等奖",
    year: "2024",
    image: "/images/certs/cert-cumcm-provincial-1st.webp",
    description: "2024 全国大学生数学建模竞赛河南赛区一等奖。",
    trackSlugs: ["ai", "database"],
  },
  {
    id: "stat-provincial-1st",
    competition: "全国大学生统计建模大赛",
    level: "省级",
    result: "河南赛区本科生组一等奖",
    year: "2025",
    image: "/images/certs/cert-stat-provincial-1st.webp",
    description: "第十一届全国大学生统计建模大赛河南赛区本科生组一等奖。",
    trackSlugs: ["ai", "database"],
  },
] satisfies Award[];
