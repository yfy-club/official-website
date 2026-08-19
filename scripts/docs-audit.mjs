import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return entry.isFile() && path.extname(entry.name).toLowerCase() === ".md" ? [target] : [];
  }));
  return nested.flat();
}

function localTarget(rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/gu, "");
  if (!target || target.startsWith("#") || /^[a-z][a-z\d+.-]*:/iu.test(target)) return null;

  const withoutFragment = target.split("#", 1)[0].split("?", 1)[0];
  if (!withoutFragment || withoutFragment.startsWith("/")) return null;

  try {
    return decodeURIComponent(withoutFragment);
  } catch {
    return withoutFragment;
  }
}

const files = ["README.md", "CONTRIBUTING.md", ...(await markdownFiles("docs"))];
const failures = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)\n]+)\)/gu)) {
    const target = localTarget(match[1]);
    if (!target) continue;

    const resolved = path.resolve(path.dirname(file), target);
    try {
      await access(resolved);
    } catch {
      failures.push(`${file}: missing local link target ${match[1]}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Documentation audit failed:\n${failures.join("\n")}`);
}

console.log(`Documentation audit passed (${files.length} Markdown files).`);
