"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav, navItems } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
      <header className="site-header">
        <Link className="site-header__brand" href="/" aria-label="云飞扬社团首页">
          <Image src="/images/logo/logo.svg" alt="" width={36} height={36} priority />
          <span>YFY</span>
        </Link>
        <nav className="site-header__nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link className="button button--primary button--md" href="/join">
            加入
          </Link>
        </nav>
        <div className="site-header__mobile">
          <MobileNav />
        </div>
      </header>
  );
}
