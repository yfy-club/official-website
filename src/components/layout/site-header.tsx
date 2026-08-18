import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";
import { navItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" href="/" aria-label="YFY 云飞扬社团首页">
        <Image src="/images/logo/logo.svg" alt="" width={36} height={36} priority />
        <span>YFY</span>
      </Link>
      <nav className="site-header__nav" aria-label="主导航">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
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
