import Link from "next/link";

import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { club } from "@/content";

const navLinks = [
  { label: "关于社团", href: "/about" },
  { label: "技术方向", href: "/tracks" },
  { label: "工程作品", href: "/works" },
  { label: "竞赛荣誉", href: "/awards" },
  { label: "招新报名", href: "/join" },
] as const;

const trackLinks = [
  { label: "人工智能", href: "/tracks/ai" },
  { label: "软件工程", href: "/tracks/software" },
  { label: "云计算与物联", href: "/tracks/cloud-iot" },
  { label: "空间数据库", href: "/tracks/database" },
  { label: "工业视觉与硬件", href: "/tracks/industrial" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid page-shell">
        <div className="site-footer__brand">
          <p className="display-latin site-footer__wordmark">YFY.</p>
          <p className="site-footer__affiliation">{club.affiliation}</p>
          <p className="site-footer__muted">{club.slogan}</p>
        </div>

        <nav aria-label="页面导航" className="site-footer__col">
          <p className="caps font-mono text-[11px] text-[var(--fg-faint)] font-bold tracking-wider">
            NAV // 导航
          </p>
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="site-footer__link">
              {label}
            </Link>
          ))}
        </nav>

        <nav aria-label="技术方向导航" className="site-footer__col">
          <p className="caps font-mono text-[11px] text-[var(--fg-faint)] font-bold tracking-wider">
            TRK // 方向
          </p>
          {trackLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="site-footer__link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__col">
          <p className="caps font-mono text-[11px] text-[var(--fg-faint)] font-bold tracking-wider">
            EXT // 链接
          </p>
          <a href={club.githubUrl} target="_blank" rel="noreferrer" className="site-footer__link">
            GitHub ↗
          </a>
          <a href="https://soft.nyist.edu.cn/" target="_blank" rel="noreferrer" className="site-footer__link">
            学院官网 ↗
          </a>
          <Link href="/join" className="site-footer__link">
            迎新群 {club.qqGroup}
          </Link>
        </div>
      </div>

      <div className="site-footer__bottom page-shell">
        <span>© {club.founded}–2026 {club.name} · {club.affiliation}</span>
        <BackToTopButton />
      </div>
    </footer>
  );
}
