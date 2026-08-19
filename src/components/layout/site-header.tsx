"use client";

import { House } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNav } from "./mobile-nav";
import { navItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean | null>(null);

  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 24);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  function isCurrent(href: string) {
    return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header" data-scrolled={scrolled === null ? undefined : String(scrolled)}>
      <div className="site-header__inner page-shell">
        <Link className="site-header__brand" href="/" aria-label="YFY 云飞扬社团首页">
          YFY
        </Link>
        <div className="site-header__nav">
          <nav className="site-header__links" aria-label="主导航">
            <Link
              className="site-header__home relative inline-flex items-center justify-center transition-colors"
              href="/"
              aria-label="返回首页"
              title="首页"
              aria-current={isCurrent("/") ? "page" : undefined}
            >
              {isCurrent("/") && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 z-0 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-2xs"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <House aria-hidden="true" size={15} className="relative z-10" />
            </Link>
            {navItems.map((item) => {
              const active = isCurrent(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative inline-flex items-center justify-center transition-colors"
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 z-0 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-2xs"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/join"
              className="relative inline-flex items-center justify-center transition-colors"
              aria-current={isCurrent("/join") ? "page" : undefined}
            >
              {isCurrent("/join") && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 z-0 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-2xs"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">加入</span>
            </Link>
          </nav>
          <span className="site-header__divider" aria-hidden="true" />
          <ThemeToggle />
        </div>
        <div className="site-header__mobile">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
