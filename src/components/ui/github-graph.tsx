"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GitCommit, GitPullRequest, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import realGithubData from "@/content/github-contributions.json";

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
  variant = "emerald",
  className,
  showLegend = true,
  showStats = true,
}: GithubGraphProps) {
  // 预载 yfy-club 组织真实 310 次提交数据
  const [liveState, setLiveState] = useState<{
    contributions: GithubContribution[];
    totalCommits: number;
    activeDays: number;
    isLive: boolean;
  }>({
    contributions: realGithubData.contributions as GithubContribution[],
    totalCommits: realGithubData.totalCommits,
    activeDays: realGithubData.activeDays,
    isLive: true,
  });

  const [hoveredDay, setHoveredDay] = useState<GithubContribution | null>(null);

  // 客户端挂载后尝试拉取最新实时提交
  useEffect(() => {
    if (data) return;

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
          if ((result.totalCommits ?? 0) > 0) {
            setLiveState({
              contributions: result.contributions,
              totalCommits: result.totalCommits,
              activeDays: result.activeDays ?? 0,
              isLive: true,
            });
          }
        }
      } catch {
        // 静默保留真实静态聚合数据
      }
    }

    fetchLiveContributions();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [data]);

  const contributions = data || liveState.contributions;

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
