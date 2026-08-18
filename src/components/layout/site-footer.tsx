import Link from "next/link";

import { club } from "@/content";

const footerLinks = [
  ["关于", "/about"],
  ["方向", "/tracks"],
  ["作品", "/works"],
  ["荣誉", "/awards"],
  ["加入", "/join"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid page-shell">
        <div>
          <p className="display-latin site-footer__wordmark">YFY.</p>
          <p className="site-footer__muted">{club.slogan}</p>
        </div>
        <nav aria-label="页脚导航">
          <p className="caps">Explore</p>
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <div>
          <p className="caps">Connect</p>
          <a href={club.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://soft.nyist.edu.cn/" target="_blank" rel="noreferrer">计算机与软件学院 ↗</a>
          <Link href="/join">迎新群 {club.qqGroup}</Link>
        </div>
      </div>
      <div className="site-footer__bottom page-shell">
        <span>{club.name} · Est. {club.founded} · {club.affiliation}</span>
        <span>Code by Dawn</span>
      </div>
    </footer>
  );
}
