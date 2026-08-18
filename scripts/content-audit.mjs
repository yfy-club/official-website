import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const roots = ["src/app", "src/components", "src/content"];
const extensions = new Set([".ts", ".tsx", ".css"]);
const forbidden = [
  [/(?:lorem ipsum|敬请期待|特性一|特性二|示例内容)/iu, "占位文案"],
  [/(?:unsplash\.com|placehold\.co|picsum\.photos|placekitten\.com)/iu, "外部占位图片"],
  [/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/u, "私钥"],
  [/\b(?:10(?:\.\d{1,3}){3}|127(?:\.\d{1,3}){3}|169\.254(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2})\b/u, "私有或本机 IP"],
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return files.flat();
}

const files = (await Promise.all(roots.map(filesUnder))).flat().filter((file) => extensions.has(path.extname(file)));
const failures = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  for (const [pattern, label] of forbidden) {
    if (pattern.test(source)) failures.push(`${file}: ${label}`);
  }
}

const works = await readFile("src/content/works.ts", "utf8");
for (const requiredStatement of [
  "当前全部设备、遥测、控制结果和告警均为模拟数据，不连接真实灯杆。",
  "195 / 425 / 9 是 2026-07-21 的归档验收基线",
]) {
  if (!works.includes(requiredStatement)) failures.push(`src/content/works.ts: 缺少真实性限定“${requiredStatement}”`);
}

if (failures.length > 0) {
  throw new Error(`Content audit failed:\n${failures.join("\n")}`);
}

console.log(`Content audit passed (${files.length} source files).`);
