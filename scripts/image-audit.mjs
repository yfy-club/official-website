import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return files.flat();
}

const sourceFiles = (await filesUnder("src")).filter((file) => [".ts", ".tsx", ".css"].includes(path.extname(file)));
const publicImages = await filesUnder("public/images");
const failures = [];
const referencedImages = new Set();

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  const imageResponseRoute = file.replaceAll("\\", "/").includes("/app/og/");
  if (/<img\b/iu.test(source) && !imageResponseRoute) failures.push(`${file}: use next/image instead of a raw <img>`);
  for (const match of source.matchAll(/\/images\/[\p{L}\p{N}_.\/-]+\.(?:avif|webp|png|jpe?g|svg)/giu)) {
    referencedImages.add(match[0]);
  }
  for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/gu)) {
    const element = match[0];
    const smallFixedAsset = /(?:width|height)=\{?(?:[1-6]?\d)\}?/u.test(element);
    if (!/\bsizes=/u.test(element) && !smallFixedAsset) {
      failures.push(`${file}: responsive Image is missing sizes`);
    }
  }
}

for (const image of referencedImages) {
  const extension = path.posix.extname(image).toLowerCase();
  if (![".avif", ".webp", ".svg"].includes(extension)) {
    failures.push(`${image}: referenced raster must use an optimized AVIF/WebP source`);
  }
}

for (const image of publicImages) {
  const extension = path.extname(image).toLowerCase();
  const publicPath = `/${path.relative("public", image).replaceAll("\\", "/")}`;
  if ([".jpg", ".jpeg", ".png"].includes(extension)) {
    failures.push(`${image}: legacy raster remains in the public deployment tree`);
  }
  if ([".avif", ".webp", ".svg"].includes(extension) && !referencedImages.has(publicPath)) {
    failures.push(`${image}: unreferenced image must remain in materials/ instead of the public deployment tree`);
  }
}

if (failures.length > 0) {
  throw new Error(`Image audit failed:\n${failures.join("\n")}`);
}

console.log(`Image audit passed (${referencedImages.size} referenced assets).`);
