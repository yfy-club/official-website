import { readFile, writeFile } from "node:fs/promises";

const sources = [
  "src/app/page.tsx",
  "src/app/about/page.tsx",
  "src/app/tracks/page.tsx",
  "src/app/works/page.tsx",
  "src/app/awards/page.tsx",
  "src/app/join/page.tsx",
  "src/app/not-found.tsx",
  "src/content/tracks.ts",
  "src/content/works.ts",
] as const;

const routeLabels = [
  "云飞扬社团",
  "起点",
  "关于",
  "方向",
  "作品",
  "荣誉",
  "加入",
  "航迹",
  "五条航道",
  "做过什么",
  "荣誉档案",
  "登机口",
  "南阳理工学院计算机与软件学院",
  "故事机制与传承",
  "选一条走三年",
  "打开检验并解释边界",
  "事实陈述公开脱敏",
  "我们要的是想学会的人",
  "已上线",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 /—·.",
];
const punctuation = "，。·：；！？（）《》“”‘’、—";
const collected = [...routeLabels, punctuation];

for (const file of sources) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/\bsubtitle="([^"]+)"/gu)) collected.push(match[1]);
  for (const match of source.matchAll(/\bnameZh:\s*"([^"]+)"/gu)) collected.push(match[1]);
  for (const match of source.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gu)) collected.push(match[1]);
  for (const match of source.matchAll(/home-hero__subtitle[^>]*>([\s\S]*?)<\/p>/gu)) collected.push(match[1]);
}

const glyphs = [...new Set(
  collected
    .join("")
    .replace(/<[^>]+>|\{[^}]+\}|&[^;]+;/gu, "")
    .match(/[\u0020-\u007e\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu) ?? [],
)].sort((left, right) => left.codePointAt(0)! - right.codePointAt(0)!).join("");

if (glyphs.length === 0) throw new Error("No heading glyphs were extracted.");

await writeFile("scripts/heading-glyphs.txt", `${glyphs}\n`, "utf8");
console.log(`Extracted ${glyphs.length} unique heading glyphs.`);
