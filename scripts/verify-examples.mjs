#!/usr/bin/env node

/**
 * Verifies that every demo present in one framework's examples directory
 * has a corresponding implementation in all other framework directories.
 *
 * Usage: node scripts/verify-examples.mjs
 * Exit code 0 = all demos present in all frameworks
 * Exit code 1 = mismatches found
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = path.join(__dirname, "..", "packages", "examples");

const FRAMEWORKS = ["react", "vue", "angular", "svelte", "solid", "vanilla"];

function getDemoNames(framework) {
  const demosDir = path.join(EXAMPLES_DIR, framework, "src", "demos");
  if (!fs.existsSync(demosDir)) return [];

  return fs
    .readdirSync(demosDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

console.log("\nVerifying example parity across frameworks...\n");

const demosByFramework = {};
const allDemoNames = new Set();

for (const fw of FRAMEWORKS) {
  const demos = getDemoNames(fw);
  demosByFramework[fw] = new Set(demos);
  demos.forEach((d) => allDemoNames.add(d));
  console.log(`  ${fw}: ${demos.length} demos [${demos.join(", ")}]`);
}

console.log(`\nTotal unique demos: ${allDemoNames.size}`);
console.log("");

let hasErrors = false;

for (const demoName of [...allDemoNames].sort()) {
  const missing = FRAMEWORKS.filter((fw) => !demosByFramework[fw].has(demoName));
  if (missing.length > 0) {
    console.log(`  MISSING "${demoName}" in: ${missing.join(", ")}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log("\nSome demos are missing in one or more frameworks.\n");
  process.exit(1);
} else {
  console.log("All demos present in all frameworks.\n");
  process.exit(0);
}
