"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GitCommit, GitPullRequest, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface GithubContribution {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  detail?: string;
  repo?: string;
}

export interface GithubGraphProps {
  data?: GithubContribution[];
  months?: number;
  variant?: "emerald" | "amber" | "cyan" | "violet";
  className?: string;
  showLegend?: boolean;
  showStats?: boolean;
}

// Generate realistic baseline contributions if no data provided
function generateDefaultContributions(months = 12): GithubContribution[] {
  const contributions: GithubContribution[] = [];
  const today = new Date();
  const totalDays = Math.max(52 * 7 - 1, months * 30);

  // Key milestones
  const milestones: Record<string, string> = {
    "15": "期中阶段考核代码全员审查",
    "30": "iCAN 算法视觉模块调优提交",
    "45": "智慧路灯时序遥测网关联调",
    "60": "矩阵计算器精确代数算法合入",
    "75": "2025 级大一成员 C++ 课设结项答辩",
    "90": "智学伴大模型 RAG 向量召回优化",
    "120": "蓝桥杯省一等奖赛前高强度模拟",
    "150": "年度全员复盘与新人导师带学启动",
    "200": "仓库统一重构与工业规范升级",
    "240": "暑期集训算法攻坚与工程实战",
    "300": "智能硬件与云平台端到端联调",
  };

  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

    // Activity weighting: weekends and Wed/Thu have higher activity for studio sessions
    const isStudioDay = dayOfWeek === 3 || dayOfWeek === 6 || dayOfWeek === 0;
    const seed = (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
    const absSeed = Math.abs(seed);

    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (isStudioDay && absSeed > 0.15) {
      count = Math.floor(absSeed * 10) + 1;
    } else if (absSeed > 0.45) {
      count = Math.floor(absSeed * 5);
    }

    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 8) level = 3;
    else level = 4;

    const detailKey = String(i);
    const detail = milestones[detailKey] || (count > 0 ? `完成了 ${count} 次代码提交与审查` : "日常技术研读");

    contributions.push({ date: dateStr, count, level, detail });
  }

  return contributions;
}

const COLOR_MAPS = {
  emerald: {
    0: "bg-[var(--surface-2)] border-[var(--border)]",
    1: "bg-emerald-950/40 text-emerald-300 border-emerald-900/40",
    2: "bg-emerald-800/60 text-emerald-200 border-emerald-700/50",
    3: "bg-emerald-600/80 text-emerald-100 border-emerald-500/60",
    4: "bg-emerald-400 text-neutral-950 font-bold border-emerald-300",
  },
  amber: {
    0: "bg-[var(--surface-2)] border-[var(--border)]",
    1: "bg-amber-950/40 text-amber-300 border-amber-900/40",
    2: "bg-amber-800/60 text-amber-200 border-amber-700/50",
    3: "bg-amber-600/80 text-amber-100 border-amber-500/60",
    4: "bg-amber-400 text-neutral-950 font-bold border-amber-300",
  },
  cyan: {
    0: "bg-[var(--surface-2)] border-[var(--border)]",
    1: "bg-cyan-950/40 text-cyan-300 border-cyan-900/40",
    2: "bg-cyan-800/60 text-cyan-200 border-cyan-700/50",
    3: "bg-cyan-600/80 text-cyan-100 border-cyan-500/60",
    4: "bg-cyan-400 text-neutral-950 font-bold border-cyan-300",
  },
  violet: {
    0: "bg-[var(--surface-2)] border-[var(--border)]",
    1: "bg-violet-950/40 text-violet-300 border-violet-900/40",
    2: "bg-violet-800/60 text-violet-200 border-violet-700/50",
    3: "bg-violet-600/80 text-violet-100 border-violet-500/60",
    4: "bg-violet-400 text-neutral-950 font-bold border-violet-300",
  },
};

export function GithubGraph({
  data,
  months = 12,
  variant = "emerald",
  className,
  showLegend = true,
  showStats = true,
}: GithubGraphProps) {
  const [liveState, setLiveState] = useState<{
    contributions: GithubContribution[];
    totalCommits: number;
    activeDays: number;
    isLive: boolean;
  } | null>(null);

  const [hoveredDay, setHoveredDay] = useState<GithubContribution | null>(null);

  // 尝试自动拉取 GitHub 组织真实活跃提交数据
  useEffect(() => {
    if (data) return; // 如果外部已传数据，则不重复抓取

    let isMounted = true;
    const controller = new AbortController();

    async function fetchLiveContributions() {
      try {
        const res = await fetch("/api/github-contributions", {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const result = await res.json();
        if (isMounted && result.ok && Array.isArray(result.contributions)) {
          if ((result.totalCommits ?? 0) > 0 || result.contributions.some((c: GithubContribution) => c.count > 0)) {
            setLiveState({
              contributions: result.contributions,
              totalCommits: result.totalCommits ?? 0,
              activeDays: result.activeDays ?? 0,
              isLive: result.source === "live",
            });
          }
        }
      } catch {
        // 优雅降级，使用本地基准数据
      }
    }

    fetchLiveContributions();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [data]);

  const defaultContributions = useMemo(() => generateDefaultContributions(months), [months]);
  const contributions = data || liveState?.contributions || defaultContributions;

  // Group into weeks (columns)
  const weeks = useMemo(() => {
    const cols: GithubContribution[][] = [];
    let currentWeek: GithubContribution[] = [];

    for (let i = 0; i < contributions.length; i++) {
      currentWeek.push(contributions[i]);
      if (currentWeek.length === 7 || i === contributions.length - 1) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    }
    return cols;
  }, [contributions]);

  // Aggregate stats
  const calculatedCommits = useMemo(() => contributions.reduce((acc, curr) => acc + curr.count, 0), [contributions]);
  const calculatedActiveDays = useMemo(() => contributions.filter((c) => c.count > 0).length, [contributions]);

  const totalCommits = liveState?.totalCommits ?? calculatedCommits;
  const activeDays = liveState?.activeDays ?? calculatedActiveDays;
  const isLive = Boolean(liveState?.isLive);

  const colors = COLOR_MAPS[variant] || COLOR_MAPS.emerald;

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 overflow-hidden shadow-xs select-none",
        className
      )}
    >
      {showStats && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[var(--border)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-bold text-[var(--fg)]">ENGINEERING ACTIVITY // 团队工程活跃热力</span>
            <a
              href="https://github.com/yfy-club"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition-colors"
              title="访问云飞扬社团 GitHub 组织"
            >
              <span>@yfy-club</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {isLive && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[var(--fg-muted)]">
            <div className="flex items-center gap-1.5">
              <GitCommit className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>近一年审码与提交：</span>
              <strong className="text-[var(--fg)]">{totalCommits}+ 次</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
              <span>活跃天数：</span>
              <strong className="text-[var(--fg)]">{activeDays} 天</strong>
            </div>
          </div>
        </div>
      )}

      {/* Grid view - 全宽自适应拉伸且移动端安全滚动 */}
      <div className="w-full min-w-0 max-w-full overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-[2px] sm:gap-1 w-full min-w-[620px] sm:min-w-[680px] md:min-w-0">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex-1 flex flex-col gap-[2px] sm:gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={cn(
                    "w-full aspect-square rounded-[2px] border transition-all cursor-pointer",
                    colors[day.level],
                    "hover:scale-125 hover:z-10 hover:shadow-xs"
                  )}
                  title={`${day.date}: ${day.count} 提交 · ${day.detail}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar & Hover Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--fg-muted)]">
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          {hoveredDay ? (
            <span className="text-[var(--fg)] flex items-center gap-1.5 animate-fadeIn">
              <Sparkles className="h-3 w-3 text-[var(--accent)] shrink-0" />
              <strong>{hoveredDay.date}</strong>: {hoveredDay.count} 次提交 ({hoveredDay.detail})
            </span>
          ) : (
            <span className="text-[var(--fg-faint)]">悬停查看单日审码与课题提交记录</span>
          )}
        </div>

        {showLegend && (
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--fg-faint)]">
            <span>LESS</span>
            <div className="flex gap-1">
              <div className={cn("h-2.5 w-2.5 rounded-[1px] border", colors[0])} />
              <div className={cn("h-2.5 w-2.5 rounded-[1px] border", colors[1])} />
              <div className={cn("h-2.5 w-2.5 rounded-[1px] border", colors[2])} />
              <div className={cn("h-2.5 w-2.5 rounded-[1px] border", colors[3])} />
              <div className={cn("h-2.5 w-2.5 rounded-[1px] border", colors[4])} />
            </div>
            <span>MORE</span>
          </div>
        )}
      </div>
    </div>
  );
}
