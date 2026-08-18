import { spawn } from "node:child_process";
import path from "node:path";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  throw new Error("Usage: node scripts/run-next.mjs <build|start> [...args]");
}

const nextCli = path.resolve("node_modules/next/dist/bin/next");
const child = spawn(process.execPath, [nextCli, command, ...args], {
  env: {
    ...process.env,
    NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-quality",
  },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Next.js exited after signal ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
