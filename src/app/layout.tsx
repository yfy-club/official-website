import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { RouteTransitions } from "@/components/layout/route-transitions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { club } from "@/content";

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
  adjustFontFallback: "Arial",
});

const mono = localFont({
  src: "../../public/fonts/GeistMono-Regular.woff2",
  variable: "--font-mono-latin",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://yfy.club"),
  title: {
    default: "云飞扬社团 · We Code the Future",
    template: "%s · 云飞扬社团",
  },
  description: "南阳理工学院云飞扬社团官方网站。探索技术方向、项目实践与成长航迹。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "云飞扬社团",
    title: "云飞扬社团 · We Code the Future",
    description: "南阳理工学院云飞扬社团官方网站。探索技术方向、项目实践与成长航迹。",
  },
  twitter: { card: "summary_large_image" },
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
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yfy.club",
    logo: "/images/logo/logo.png",
    sameAs: [club.githubUrl],
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <ThemeProvider>
          <RouteTransitions />
          <a className="skip-link" href="#main-content">跳到主内容</a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
