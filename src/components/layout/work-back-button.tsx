"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface WorkBackButtonProps {
  slug?: string;
}

export function WorkBackButton({ slug }: WorkBackButtonProps) {
  const handleClick = () => {
    try {
      sessionStorage.setItem("yfy_works_restore", "true");
      if (slug) {
        sessionStorage.setItem("yfy_works_last_slug", slug);
      }
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="h-8 px-2.5 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
    >
      <Link href="/works" scroll={false} onClick={handleClick}>
        <ArrowLeft size={13} aria-hidden="true" />
        <span>返回项目列表</span>
      </Link>
    </Button>
  );
}

export function WorkReturnLink({
  slug,
  onClick,
  scroll = false,
  ...props
}: ComponentProps<typeof Link> & { slug?: string }) {
  return (
    <Link
      {...props}
      scroll={scroll}
      onClick={(e) => {
        try {
          sessionStorage.setItem("yfy_works_restore", "true");
          if (slug) {
            sessionStorage.setItem("yfy_works_last_slug", slug);
          }
        } catch {
          // Ignore storage errors
        }
        onClick?.(e);
      }}
    />
  );
}
