import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { RouteTransitions } from "@/components/layout/route-transitions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { awards, club } from "@/content";
import { siteUrl } from "@/lib/seo";

import "./globals.css";

const display = localFont({
  src: "../../public/fonts/InstrumentSerif-Regular.woff2",
  variable: "--font-display-latin",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const sans = localFont({
  src: [
    { path: "../../public/fonts/Geist-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Geist-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/Geist-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-sans-latin",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});

const mono = localFont({
  src: "../../public/fonts/GeistMono-Regular.woff2",
  variable: "--font-mono-latin",
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
});

const displayCjk = localFont({
  src: "../../public/fonts/NotoSerifSC-Heading-subset.woff2",
  variable: "--font-display-cjk",
  display: "swap",
  weight: "600",
  fallback: ["Songti SC", "SimSun", "serif"],
});

const themeBootScript = `(()=>{try{const s=localStorage.getItem("theme")||"system";const d=s==="dark"||s==="light"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d}catch{}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://yfy.club"),
  title: {
    default: "云飞扬社团 · We Code the Future",
    template: "%s · 云飞扬社团",
  },
  description: "南阳理工学院云飞扬社团官方网站。探索技术方向、项目实践与成长航迹。",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0D10" },
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: club.name,
    alternateName: club.nameEn,
    foundingDate: String(club.founded),
    slogan: club.slogan,
    url: siteUrl("/").toString(),
    logo: siteUrl("/images/logo/logo.webp").toString(),
    sameAs: [club.githubUrl],
    award: awards.map((award) => `${award.year} ${award.competition} ${award.result}`),
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${display.variable} ${displayCjk.variable} ${sans.variable} ${mono.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <TooltipProvider delayDuration={150}>
          <RouteTransitions />
          <a className="skip-link" href="#main-content">跳到主内容</a>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Toaster />
        </TooltipProvider>
        <StructuredData data={organization} />
      </body>
    </html>
  );
}
