"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav, navItems } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const pageMeta: Record<string, { label: string; total: string }> = {
  "/": { label: "起点", total: "05" },
  "/about": { label: "我们是谁", total: "08" },
  "/tracks": { label: "五条航道", total: "03" },
  "/works": { label: "作品记录", total: "04" },
  "/awards": { label: "荣誉档案", total: "03" },
  "/join": { label: "登机口", total: "07" },
};

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const basePath = `/${pathname.split("/")[1] ?? ""}`;
  const meta = pageMeta[pathname] ?? pageMeta[basePath] ?? { label: "航迹", total: "01" };

  return (
    <>
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
      <div className="mobile-rail" aria-hidden="true">
        <span className="tabular">01 / {meta.total}</span>
        <span>{meta.label}</span>
        <i />
      </div>
    </>
  );
}
