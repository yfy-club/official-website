"use client";

import { Badge } from "@/components/ui/badge";

type CompetitionItem = {
  category: string;
  code: string;
  competition: string;
  level: string;
  result: string;
};

const COMPETITIONS_DATA: CompetitionItem[] = [
  {
    code: "COMP-01",
    competition: "iCAN 国际创新创业大赛 / AI 视觉挑战赛",
    level: "国家级 / 省级",
    category: "AI 视觉与创新",
    result: "全国一等奖 · 省级二等奖 · 河南省银奖 / 铜奖",
  },
  {
    code: "COMP-02",
    competition: "全国大学生智能汽车竞赛",
    level: "国家级 / 省级",
    category: "嵌入式与控制",
    result: "国家级二等奖 · 省级一等奖",
  },
  {
    code: "COMP-03",
    competition: "团体程序设计天梯赛",
    level: "国家级",
    category: "算法与编程",
    result: "全国团队二等奖",
  },
  {
    code: "COMP-04",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    level: "省级 / 国家级",
    category: "软件开发与算法",
    result: "省级一、二、三等奖累计十余项 · 晋级国赛",
  },
  {
    code: "COMP-05",
    competition: "全国大学生数学建模竞赛",
    level: "省级",
    category: "数学建模与推演",
    result: "河南省一等奖 2 项",
  },
  {
    code: "COMP-06",
    competition: "全国大学生统计建模大赛",
    level: "国家级 / 省级",
    category: "统计计算与分析",
    result: "省级一、二、三等奖 · 入围全国总决赛",
  },
  {
    code: "COMP-07",
    competition: "挑战杯 / 中国国际大学生创新大赛",
    level: "省级",
    category: "工程创新创业",
    result: "河南省银奖 · 多项目入围省赛答辩",
  },
];

export function AwardsOverviewMatrix() {
  return (
    <div className="awards-matrix grid grid-cols-1 md:grid-cols-2 gap-4">
      {COMPETITIONS_DATA.map((item) => {
        const isNational = item.level.includes("国家级");
        return (
          <div
            key={item.code}
            className="flex flex-col justify-between p-5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[var(--border)]">
                <span className="font-mono text-xs font-semibold text-[var(--fg-faint)]">
                  {item.code} {"//"} {item.category}
                </span>
                <Badge variant={isNational ? "active" : "neutral"} className="text-[11px]">
                  {item.level}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-[var(--fg)] tracking-tight mb-2 leading-snug">
                {item.competition}
              </h3>
            </div>
            <div className="pt-3 mt-2 border-t border-dashed border-[var(--border)]">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-1">
                {"主要成果认证 // RECORD"}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--fg)] leading-relaxed">
                {item.result}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
