import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const src = path.resolve(pkgRoot, "../core/dist/styles.css");
const dest = path.join(pkgRoot, "dist/styles.css");

if (!fs.existsSync(src)) {
  console.error(
    `[copy-styles] Missing ${src}. Build simple-table-core first.`,
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log(`[copy-styles] Copied styles.css → ${path.relative(pkgRoot, dest)}`);
