import { existsSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const candidates = [
  process.env.YFY_HEADING_FONT_SOURCE,
  "C:/Windows/Fonts/NotoSerifSC-VariableFont_wght.ttf",
  "C:/Windows/Fonts/NotoSerifSC-VariableFont_wght_0.ttf",
  "C:/Windows/Fonts/NotoSerifSC-VF.ttf",
].filter((candidate): candidate is string => Boolean(candidate));

const source = candidates.find(existsSync);
if (!source) {
  throw new Error("Noto Serif SC source not found. Set YFY_HEADING_FONT_SOURCE to its .ttf/.otf file.");
}

const instance = path.resolve("scripts/.heading-font-instance.ttf");
const output = path.resolve("public/fonts/NotoSerifSC-Heading-subset.woff2");
const ogOutput = path.resolve("public/fonts/NotoSerifSC-Heading-subset.ttf");
const ogWoffOutput = path.resolve("public/fonts/NotoSerifSC-Heading-subset.woff");

function run(args: string[]) {
  const result = spawnSync("python", args, { encoding: "utf8", stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`python ${args.join(" ")} failed with exit code ${result.status}`);
}

try {
  run(["-m", "fontTools.varLib.instancer", source, "wght=600", `--output=${instance}`]);
  run([
    "-m",
    "fontTools.subset",
    instance,
    "--text-file=scripts/heading-glyphs.txt",
    "--flavor=woff2",
    "--layout-features=",
    "--no-hinting",
    `--output-file=${output}`,
  ]);
  run([
    "-m",
    "fontTools.subset",
    instance,
    "--text-file=scripts/heading-glyphs.txt",
    "--layout-features=",
    "--no-hinting",
    `--output-file=${ogOutput}`,
  ]);
  run([
    "-m",
    "fontTools.subset",
    instance,
    "--text-file=scripts/heading-glyphs.txt",
    "--flavor=woff",
    "--layout-features=",
    "--no-hinting",
    `--output-file=${ogWoffOutput}`,
  ]);
} finally {
  if (existsSync(instance)) unlinkSync(instance);
}

console.log(`Wrote ${path.relative(process.cwd(), output)}, ${path.relative(process.cwd(), ogOutput)}, and ${path.relative(process.cwd(), ogWoffOutput)}.`);
