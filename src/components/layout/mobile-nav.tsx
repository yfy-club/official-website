"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "./theme-toggle";

export const navItems = [
  { href: "/about", label: "关于" },
  { href: "/tracks", label: "方向" },
  { href: "/works", label: "作品" },
  { href: "/awards", label: "荣誉" },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <Dialog.Root>
      <Dialog.Trigger className="mobile-nav__trigger" aria-label="打开主导航">
        <Menu aria-hidden="true" size={21} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-nav__overlay" />
        <Dialog.Content className="mobile-nav__panel" aria-describedby={undefined}>
          <Dialog.Title className="caps">Navigate / 导航</Dialog.Title>
          <Dialog.Close className="mobile-nav__close" aria-label="关闭主导航">
            <X aria-hidden="true" size={21} />
          </Dialog.Close>
          <nav aria-label="移动端主导航" className="mobile-nav__links">
            {navItems.map((item, index) => (
              <Dialog.Close asChild key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  <span className="tabular">0{index + 1}</span>
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>
          <div className="mobile-nav__footer">
            <ThemeToggle />
            <Dialog.Close asChild>
              <Link className="button button--primary button--md" href="/join">
                加入我们
              </Link>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
