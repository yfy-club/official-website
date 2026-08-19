import Image from "next/image";

import type { MemberVoice } from "@/content";
import { EdgeBlur } from "@/components/ui/edge-blur";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

interface MemberVoicesMarqueeProps {
  className?: string;
  voices: readonly MemberVoice[];
}

export function MemberVoicesMarquee({ className, voices }: MemberVoicesMarqueeProps) {
  const half = Math.ceil(voices.length / 2);
  const firstRow = voices.slice(0, half);
  const secondRow = voices.slice(half);

  return (
    <div className={cn("member-voices-marquee relative flex flex-col gap-4 overflow-hidden py-2", className)}>
      {/* 左右光学级 EdgeBlur 渐进羽化遮罩 */}
      <EdgeBlur direction="horizontal" intensity="md" />

      {/* 第一行：悬停触发平滑向左流动 */}
      <Marquee playOnHover repeat={4} className="[--duration:40s] [--gap:1.25rem]">
        {firstRow.map((voice, idx) => (
          <VoiceCard key={`${voice.author}-${idx}`} voice={voice} index={idx + 1} />
        ))}
      </Marquee>

      {/* 第二行：悬停触发平滑向右流动 */}
      <Marquee reverse playOnHover repeat={4} className="[--duration:45s] [--gap:1.25rem]">
        {secondRow.map((voice, idx) => (
          <VoiceCard key={`${voice.author}-${idx}`} voice={voice} index={idx + half + 1} />
        ))}
      </Marquee>

      {/* 底部交互指引与元数据 */}
      <p className="mt-2 text-center text-xs font-mono text-[var(--fg-muted)]">
        光标悬停时触发平滑流动 · 23～25 级成长档案（匿名代称与虚拟角色头像）
      </p>
    </div>
  );
}

function VoiceCard({ voice, index }: { index: number; voice: MemberVoice }) {
  const paddedIndex = index.toString().padStart(2, "0");

  return (
    <figure className="group/card relative flex h-full w-[330px] sm:w-[390px] md:w-[420px] shrink-0 flex-col justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]">
      <div>
        {/* 卡片头部：二次元昵称、角色方向与标签 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-xs ring-1 ring-black/5 dark:ring-white/10">
              {voice.avatar.startsWith("/") ? (
                <Image
                  src={voice.avatar}
                  alt={voice.author}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/card:scale-110"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center font-mono text-sm font-semibold text-[var(--accent)] select-none"
                  aria-hidden="true"
                >
                  {voice.avatar}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <figcaption className="truncate font-sans text-sm font-semibold text-[var(--fg)] tracking-tight">
                {voice.author}
              </figcaption>
              <p className="truncate font-mono text-xs text-[var(--fg-faint)]">
                {voice.role}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--accent-quiet)] px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--accent)]">
            {voice.tag}
          </span>
        </div>

        {/* 成员心声正文 */}
        <blockquote className="mt-4 mb-2">
          <p className="font-sans text-sm sm:text-[0.9375rem] leading-relaxed text-[var(--fg-muted)] transition-colors duration-200 group-hover/card:text-[var(--fg)]">
            “{voice.quote}”
          </p>
        </blockquote>
      </div>

      {/* 卡片底部：等宽工程日志标识 */}
      <footer className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[11px] text-[var(--fg-faint)]">
        <span className="tabular">REC #{paddedIndex} {"//"} ARCHIVE</span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-70" aria-hidden="true" />
          <span>VERIFIED</span>
        </span>
      </footer>
    </figure>
  );
}
