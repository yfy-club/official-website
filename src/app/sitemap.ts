import type { MetadataRoute } from "next";

import { tracks, works } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yfy.club";
  const paths = [
    "",
    "/about",
    "/tracks",
    ...tracks.map((track) => `/tracks/${track.slug}`),
    "/works",
    ...works.filter((work) => work.detail).map((work) => `/works/${work.slug}`),
    "/awards",
    "/join",
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : path === "/join" ? 0.9 : 0.8 }));
}
