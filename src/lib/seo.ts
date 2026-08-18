import type { Metadata } from "next";

import { club } from "@/content";

const fallbackSiteUrl = "https://yfy.club";

export function siteUrl(pathname = "/") {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl;
  const base = configured.endsWith("/") ? configured : `${configured}/`;
  return new URL(pathname.replace(/^\//u, ""), base);
}

export function createMetadata({
  description,
  path,
  title,
}: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  const canonical = siteUrl(path);
  const imagePath = path === "/" ? "/og/home" : `/og${path}`;
  const image = siteUrl(imagePath);
  const fullTitle = `${title} · ${club.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: club.name,
      title: fullTitle,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: `${fullTitle}社交分享卡片` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export type Breadcrumb = { name: string; path: string };

export function breadcrumbJsonLd(items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path).toString(),
    })),
  };
}

export function trackJsonLd(track: { nameZh: string; positioning: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${track.nameZh}技术方向`,
    description: track.positioning,
    url: siteUrl(`/tracks/${track.slug}`).toString(),
    provider: {
      "@type": "Organization",
      name: club.name,
      url: siteUrl("/").toString(),
    },
  };
}
