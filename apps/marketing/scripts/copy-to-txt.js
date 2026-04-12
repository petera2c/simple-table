import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// apps/marketing/scripts -> monorepo root
const MONOREPO_ROOT = join(__dirname, "../../..");
const EXAMPLES_BASE = join(MONOREPO_ROOT, "packages/examples");
const OUTPUT_DIR = join(__dirname, "../public/txt-demos");

const FRAMEWORKS = ["react", "vue", "angular", "svelte", "solid", "vanilla"];

const FILE_EXTENSIONS = {
  react: [".tsx", ".css"],
  vue: [".vue", ".css"],
  angular: [".ts", ".css"],
  svelte: [".svelte", ".css"],
  solid: [".tsx", ".css"],
  vanilla: [".ts", ".css"],
};

async function getDemoDirs(framework) {
  const demosDir = join(EXAMPLES_BASE, framework, "src", "demos");
  try {
    const entries = await fs.readdir(demosDir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`Demos directory not found for ${framework}: ${demosDir}`);
      return [];
    }
    throw err;
  }
}

async function readDemoFiles(framework, demoId) {
  const demoDir = join(EXAMPLES_BASE, framework, "src", "demos", demoId);
  const exts = FILE_EXTENSIONS[framework];

  try {
    const entries = await fs.readdir(demoDir, { withFileTypes: true });
    const files = entries.filter(
      (e) => e.isFile() && exts.some((ext) => e.name.endsWith(ext))
    );

    if (files.length === 0) return null;

    if (files.length === 1) {
      return await fs.readFile(join(demoDir, files[0].name), "utf8");
    }

    const parts = [];
    for (const file of files) {
      const content = await fs.readFile(join(demoDir, file.name), "utf8");
      parts.push(`// ${file.name}\n${content}`);
    }
    return parts.join("\n\n");
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function copyToTxt() {
  try {
    if (
      await fs
        .stat(EXAMPLES_BASE)
        .then(() => false)
        .catch(() => true)
    ) {
      console.warn(`Examples tree not found at ${EXAMPLES_BASE}, skipping copy-to-txt`);
      return;
    }

    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Output directory: ${OUTPUT_DIR}`);

    let total = 0;

    for (const framework of FRAMEWORKS) {
      const demoIds = await getDemoDirs(framework);
      console.log(`\n${framework}: ${demoIds.length} demos`);

      const frameworkDir = join(OUTPUT_DIR, framework);
      await fs.mkdir(frameworkDir, { recursive: true });

      for (const demoId of demoIds) {
        const content = await readDemoFiles(framework, demoId);
        if (!content) {
          console.warn(`  ⚠ No source files for ${framework}/${demoId}`);
          continue;
        }

        const destPath = join(frameworkDir, `${demoId}.txt`);
        await fs.writeFile(destPath, content, "utf8");
        console.log(`  ✓ ${framework}/${demoId}.txt`);
        total++;
      }
    }

    console.log(`\n✅ Copied ${total} demo files across ${FRAMEWORKS.length} frameworks`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

copyToTxt();
