"use client";

import { House } from "lucide-react";
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
              className="site-header__home"
              href="/"
              aria-label="返回首页"
              title="首页"
              aria-current={isCurrent("/") ? "page" : undefined}
            >
              <House aria-hidden="true" size={15} />
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/join" aria-current={isCurrent("/join") ? "page" : undefined}>加入</Link>
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
