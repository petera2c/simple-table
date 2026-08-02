/**
 * Guards the published package types: index.d.ts re-exports
 * `./SimpleTable.svelte`, which Rollup/tsc does not emit. We ship a
 * hand-written SimpleTable.svelte.d.ts into dist/types.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import ts from "typescript";

const sveltePkgRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const corePkgRoot = path.resolve(sveltePkgRoot, "../core");
const distTypesIndex = path.join(sveltePkgRoot, "dist/types/index.d.ts");
const componentDts = path.join(
  sveltePkgRoot,
  "dist/types/SimpleTable.svelte.d.ts",
);

function symlinkPkg(target: string, linkPath: string): void {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(target, linkPath);
}

function resolveFrom(fromPkg: string, request: string): string {
  return createRequire(path.join(fromPkg, "package.json")).resolve(request);
}

describe("Svelte consumer types (built package)", () => {
  it("ships SimpleTable.svelte.d.ts next to the index re-export", () => {
    expect(
      fs.existsSync(distTypesIndex),
      "packages/svelte/dist is missing — run `pnpm run build:svelte` first",
    ).toBe(true);
    expect(
      fs.existsSync(componentDts),
      "Missing dist/types/SimpleTable.svelte.d.ts — published types cannot resolve SimpleTable",
    ).toBe(true);

    const indexDts = fs.readFileSync(distTypesIndex, "utf8");
    expect(indexDts).toMatch(
      /export\s*\{\s*default as SimpleTable\s*\}\s*from\s*["']\.\/SimpleTable\.svelte["']/,
    );
  });

  it("resolves SimpleTable from the built package types entry", () => {
    expect(
      fs.existsSync(distTypesIndex),
      "packages/svelte/dist is missing — run `pnpm run build:svelte` first",
    ).toBe(true);

    const consumerRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "st-svelte-consumer-"),
    );
    const srcDir = path.join(consumerRoot, "src");
    const nm = path.join(consumerRoot, "node_modules");
    fs.mkdirSync(srcDir, { recursive: true });

    try {
      symlinkPkg(sveltePkgRoot, path.join(nm, "@simple-table/svelte"));
      symlinkPkg(corePkgRoot, path.join(nm, "simple-table-core"));

      const svelteResolved = path.dirname(
        resolveFrom(sveltePkgRoot, "svelte/package.json"),
      );
      symlinkPkg(svelteResolved, path.join(nm, "svelte"));

      fs.writeFileSync(
        path.join(srcDir, "consumer.ts"),
        `import { SimpleTable } from "@simple-table/svelte";
import type { SimpleTableSvelteProps } from "@simple-table/svelte";

const _props: SimpleTableSvelteProps = {
  rows: [{ id: 1, name: "Ada" }],
  columns: [{ accessor: "name", label: "Name", width: 120 }],
};

void SimpleTable;
void _props;
`,
      );

      fs.writeFileSync(
        path.join(consumerRoot, "tsconfig.json"),
        JSON.stringify(
          {
            compilerOptions: {
              target: "ES2022",
              module: "ESNext",
              moduleResolution: "bundler",
              strict: true,
              skipLibCheck: true,
              noEmit: true,
              types: [],
            },
            files: ["src/consumer.ts"],
          },
          null,
          2,
        ),
      );

      const configPath = path.join(consumerRoot, "tsconfig.json");
      const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
      const parsed = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        consumerRoot,
      );
      const program = ts.createProgram({
        rootNames: parsed.fileNames,
        options: parsed.options,
      });
      const diagnostics = ts
        .getPreEmitDiagnostics(program)
        .filter((d) => d.category === ts.DiagnosticCategory.Error)
        .map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"));

      expect(diagnostics).toEqual([]);
    } finally {
      fs.rmSync(consumerRoot, { recursive: true, force: true });
    }
  });
});
