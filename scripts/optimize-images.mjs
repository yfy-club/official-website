import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const replaceSources = process.argv.includes("--replace");
const imageRoot = path.resolve("public/images");
const legacyExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return files.flat();
}

function maxDimension(relativePath) {
  if (relativePath.startsWith("photos/")) return 1920;
  if (relativePath.startsWith("certs/")) return 2000;
  if (relativePath.startsWith("posters/")) return 1800;
  if (relativePath.startsWith("works/")) return 1920;
  return 1200;
}

const sources = (await filesUnder(imageRoot)).filter((file) => legacyExtensions.has(path.extname(file).toLowerCase()));
let inputBytes = 0;
let outputBytes = 0;

for (const source of sources) {
  const relativePath = path.relative(imageRoot, source).replaceAll("\\", "/");
  const sourceStats = await stat(source);
  const image = sharp(source, { failOn: "warning" }).rotate();
  const metadata = await image.metadata();
  const photographic = relativePath.startsWith("photos/") || relativePath.startsWith("advisor/");
  const format = photographic && !metadata.hasAlpha ? "avif" : "webp";
  const output = source.replace(/\.(?:jpe?g|png)$/iu, `.${format}`);
  const pipeline = image.resize({
    width: maxDimension(relativePath),
    height: maxDimension(relativePath),
    fit: "inside",
    withoutEnlargement: true,
  });

  const result = format === "avif"
    ? await pipeline.avif({ quality: 58, effort: 5, chromaSubsampling: "4:4:4" }).toFile(output)
    : await pipeline.webp({ quality: 84, alphaQuality: 92, smartSubsample: true }).toFile(output);

  inputBytes += sourceStats.size;
  outputBytes += result.size;
  console.log(`${relativePath} -> ${path.basename(output)} (${result.width}x${result.height}, ${result.size} bytes)`);

  if (replaceSources) await unlink(source);
}

console.log(`Optimized ${sources.length} files: ${inputBytes} -> ${outputBytes} bytes${replaceSources ? "; legacy sources removed" : ""}.`);
