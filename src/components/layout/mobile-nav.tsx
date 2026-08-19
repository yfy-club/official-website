"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";

import { ThemeToggle } from "./theme-toggle";
import { navItems } from "./nav-items";

export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pathname = usePathname();

  function unlockPage() {
    delete document.body.dataset.scrollLocked;
  }

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.body.dataset.scrollLocked = "true";
  }

  function close() {
    dialogRef.current?.close();
    unlockPage();
  }

  useEffect(() => unlockPage, []);

  return (
    <>
      <button type="button" className="mobile-nav__trigger" aria-label="打开主导航" onClick={open}>
        <Menu aria-hidden="true" size={21} />
      </button>
      <dialog
        ref={dialogRef}
        className="mobile-nav__panel"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={unlockPage}
      >
        <h2 id={titleId} className="caps">Navigate / 导航</h2>
        <button type="button" className="mobile-nav__close" aria-label="关闭主导航" onClick={close}>
          <X aria-hidden="true" size={21} />
        </button>
        <nav aria-label="移动端主导航" className="mobile-nav__links">
          {navItems.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={close}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              <span className="tabular">0{index + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav__footer">
          <ThemeToggle />
          <Link className="button button--primary button--md" href="/join" onClick={close}>
            加入我们
          </Link>
        </div>
      </dialog>
    </>
  );
}
