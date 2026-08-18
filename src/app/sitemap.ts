import type { MetadataRoute } from "next";

import { tracks, works } from "@/content";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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
  return paths.map((path) => ({ url: siteUrl(path || "/").toString(), changeFrequency: "monthly", priority: path === "" ? 1 : path === "/join" ? 0.9 : 0.8 }));
}
