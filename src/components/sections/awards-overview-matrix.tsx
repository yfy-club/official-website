"use client";

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
    competition: "团体程序设计天梯赛 (GPLT)",
    level: "国家级",
    category: "算法与编程",
    result: "全国团队二等奖",
  },
  {
    code: "COMP-04",
    competition: "蓝桥杯全国软件和信息技术专业人才大赛",
    level: "省级 / 国家级",
    category: "软件开发与算法",
    result: "省级一、二、三等奖累计十余项 · 晋级全国总决赛",
  },
  {
    code: "COMP-05",
    competition: "全国大学生数学建模竞赛 (CUMCM)",
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
    competition: "中国国际大学生创新大赛 / 挑战杯",
    level: "省级",
    category: "工程创新创业",
    result: "河南省银奖 · 多项目入围省赛金银奖答辩",
  },
];

export function AwardsOverviewMatrix() {
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--fg-muted)] pb-1">
        <span className="text-[var(--accent)] font-bold">TIMEFRAME // 2024–2025 近两年核心战绩</span>
        <span>7 大赛道归档 · 历届档案整理中</span>
      </div>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {COMPETITIONS_DATA.map((item, idx) => {
          const isNational = item.level.includes("国家级");

          return (
            <div
              key={item.code}
              className="py-6 sm:py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 transition-[background-color,padding] duration-200 hover:bg-[var(--surface-2)]/40 hover:pl-2 group"
            >
              {/* 左侧：等宽编号与赛道类别 */}
              <div className="flex items-baseline gap-4 sm:gap-6 min-w-0 lg:w-1/2">
                <span className="font-mono text-sm sm:text-base font-bold text-[var(--accent)] shrink-0">
                  {`0${idx + 1} //`}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                      {item.competition}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--fg-faint)]">
                    <span>{item.code}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>

              {/* 右侧：级别标签与成果认证 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 sm:gap-6 lg:w-1/2 pl-8 lg:pl-0">
                <div className="text-xs sm:text-sm text-[var(--fg-muted)] font-sans leading-relaxed">
                  {item.result}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs text-[var(--fg-faint)]">
                    LEVEL //
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-[var(--radius-xs)] border ${
                      isNational
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30"
                        : "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border)]"
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
