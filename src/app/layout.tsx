import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { ThemeProvider } from "@/components/layout/theme-provider";

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
  title: "云飞扬社团 · We Code the Future",
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
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
