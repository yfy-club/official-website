"use client";

import { AnimatedList } from "@/components/ui/animated-list";

export interface LiveEventItem {
  id: string;
  tag: string;
  time: string;
  message: string;
  badge?: string;
}

const DEFAULT_LIVE_EVENTS: LiveEventItem[] = [
  { id: "event-1", tag: "招新流转", time: "刚刚", message: "来自计科/物联方向的同学递交了加入考核申请", badge: "NEW" },
  { id: "event-2", tag: "导师带学", time: "2小时前", message: "第 12 期 C++ 内存指针实操工坊顺利完成全员讲评", badge: "WORKSHOP" },
  { id: "event-3", tag: "课题在研", time: "5小时前", message: "智光耀城边缘网关合入 Modbus 掉线自动重连补丁", badge: "MERGED" },
  { id: "event-4", tag: "竞赛战报", time: "1天前", message: "2026 iCAN 算法视觉小队完成全国决赛赛前算法联调", badge: "VERIFIED" },
  { id: "event-5", tag: "审码归档", time: "2天前", message: "2025 级全员 JavaWeb 三层架构大作业规范审查通过", badge: "PASSED" },
];

export function JoinLiveDispatch({
  events = DEFAULT_LIVE_EVENTS,
  className,
}: {
  events?: LiveEventItem[];
  className?: string;
}) {
  return (
    <div className={className ?? "p-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs"}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)] text-[11px] font-mono text-[var(--fg-faint)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>LIVE DISPATCH // 招新与在研实况</span>
        </span>
        <span>REAL-TIME FEED</span>
      </div>

      <AnimatedList
        items={events}
        autoCycle={true}
        maxVisible={3}
        cycleInterval={3500}
        renderItem={(item) => (
          <div className="p-2.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-xs font-mono flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] shrink-0">
                {item.tag}
              </span>
              <p className="text-[var(--fg)] truncate text-[11px]">{item.message}</p>
            </div>
            <span className="text-[10px] text-[var(--fg-faint)] shrink-0">{item.time}</span>
          </div>
        )}
      />
    </div>
  );
}
