import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const assets = [
  ["works/matrix-calculator/matrix-trace-dark.png", "works/matrix-calculator/matrix-trace-dark.webp", 1920],
  ["works/matrix-calculator/matrix-trace-light.png", "works/matrix-calculator/matrix-trace-light.webp", 1920],
  ...[
    "zgyc-alarm-center",
    "zgyc-alarm-rules",
    "zgyc-asset-logical-devices",
    "zgyc-asset-regions",
    "zgyc-asset-smart-pole",
    "zgyc-feature-map",
    "zgyc-lighting-policy",
    "zgyc-login",
    "zgyc-monitor-controls",
    "zgyc-monitor-realtime",
    "zgyc-sys-login-log",
    "zgyc-sys-op-log",
    "zgyc-sys-roles",
    "zgyc-sys-users",
    "zgyc-work-orders",
  ].map((name) => [`works/zgyc-smart-light/${name}.png`, `works/zgyc-smart-light/${name}.webp`, 1920]),
  ...[
    "zhixueban-ai-chat",
    "zhixueban-dark",
    "zhixueban-knowledge",
    "zhixueban-login",
    "zhixueban-roadmap",
  ].map((name) => [`works/zhixueban/${name}.png`, `works/zhixueban/${name}.webp`, 1920]),
  ...[
    ["lab-huisen-zone-01.png", "lab-huisen-zone-01.webp"],
    ["lab-huisen-zone-02.png", "lab-huisen-zone-02.webp"],
    ["lab-huisen-zone-03.png", "lab-huisen-zone-03.webp"],
    ["lab-gathering.png", "lab-gathering.webp"],
    ["activity-dinner-latest.jpg", "activity-dinner-latest.webp"],
    ["activity-dinner.png", "activity-dinner.webp"],
    ["activity-bbq.png", "activity-bbq.webp"],
    ["activity-tea.png", "activity-tea.webp"],
  ].map(([source, output]) => [`photos/${source}`, `photos/${output}`, 1920]),
  ["advisor/陈可2.png", "advisor/陈可2.webp", 1200],
  ["certs/cert-challengecup-provincial-silver.jpg", "certs/cert-challengecup-provincial-silver.webp", 2000],
  ["certs/cert-cumcm-provincial-1st.jpg", "certs/cert-cumcm-provincial-1st.webp", 2000],
  ["certs/cert-stat-provincial-1st.jpg", "certs/cert-stat-provincial-1st.webp", 2000],
  ["certs/cert-lanqiao-c-provincial-1st.jpg", "certs/cert-lanqiao-c-provincial-1st.webp", 2000],
  ["certs/cert-lanqiao-java-provincial-1st-01.jpg", "certs/cert-lanqiao-java-provincial-1st-01.webp", 2000],
  ["certs/cert-lanqiao-java-provincial-1st-02.jpg", "certs/cert-lanqiao-java-provincial-1st-02.webp", 2000],
  ["certs/cert-ican-provincial-2nd.jpg", "certs/cert-ican-provincial-2nd.webp", 2000],
  ["certs/cert-challengecup-provincial-2nd.jpg", "certs/cert-challengecup-provincial-2nd.webp", 2000],
];

for (const [sourceRelative, outputRelative, maxDimension] of assets) {
  const source = path.resolve("materials", sourceRelative);
  const output = path.resolve("public/images", outputRelative);
  await mkdir(path.dirname(output), { recursive: true });

  const result = await sharp(source, { failOn: "warning" })
    .rotate()
    .resize({ width: maxDimension, height: maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 92, smartSubsample: true })
    .toFile(output);

  console.log(`${sourceRelative} -> ${outputRelative} (${result.width}x${result.height}, ${result.size} bytes)`);
}

console.log(`Published ${assets.length} material images.`);
