import type { Club } from "./schema";

export const clubRaw = {
  name: "云飞扬社团",
  nameEn: "Yun Fei Yang Club",
  abbreviation: "YFY",
  slogan: "We Code the Future",
  subSlogan: "伟大的想法始于单行代码",
  founded: 2014,
  affiliation: "南阳理工学院计算机与软件学院",
  advisor: "陈可 教授",
  githubUrl: "https://github.com/yfy-club",
  values: ["探索", "成长", "热爱"],
  motto: "源于热爱，不止于代码。",
  origin: "2014 年，由南阳理工学院第一届云计算专业学生在陈可教授指导下创建。",
  platform: "大学生科技园",
  memberCount: 42,
  annualAwards: "20+",
  qqGroup: "952254865",
} satisfies Club;
