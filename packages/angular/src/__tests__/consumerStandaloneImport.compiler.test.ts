/**
 * Reproduces client report: Angular 19+ application builder fails with
 * TS-992012 when a standalone app imports SimpleTableComponent from the
 * published package.
 *
 * Guards against shipping a Rollup/tsc build without Ivy metadata
 * (ɵcmp / ɵɵComponentDeclaration). Without that metadata, Angular's AOT
 * compiler cannot prove SimpleTableComponent is standalone (TS-992012).
 *
 * Compiles a minimal consumer against packages/angular/dist (not source).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  performCompilation,
  readConfiguration,
} from "@angular/compiler-cli";
import ts from "typescript";

const angularPkgRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const corePkgRoot = path.resolve(angularPkgRoot, "../core");
const distTypesIndex = path.join(angularPkgRoot, "dist/index.d.ts");
const componentDts = distTypesIndex;

function resolveFrom(fromPkg: string, request: string): string {
  return createRequire(path.join(fromPkg, "package.json")).resolve(request);
}

function symlinkPkg(target: string, linkPath: string): void {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(target, linkPath);
}

function flattenDiagnostic(diagnostic: ts.Diagnostic): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
}

function createConsumerProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "st-angular-consumer-"));
  const srcDir = path.join(root, "src");
  const nm = path.join(root, "node_modules");
  fs.mkdirSync(srcDir, { recursive: true });

  symlinkPkg(angularPkgRoot, path.join(nm, "@simple-table/angular"));
  symlinkPkg(corePkgRoot, path.join(nm, "simple-table-core"));

  for (const pkg of ["core", "common", "compiler", "compiler-cli"] as const) {
    const resolved = path.dirname(
      resolveFrom(angularPkgRoot, `@angular/${pkg}/package.json`),
    );
    symlinkPkg(resolved, path.join(nm, `@angular/${pkg}`));
  }

  for (const pkg of ["tslib", "zone.js"] as const) {
    const resolved = path.dirname(
      resolveFrom(angularPkgRoot, `${pkg}/package.json`),
    );
    symlinkPkg(resolved, path.join(nm, pkg));
  }

  try {
    symlinkPkg(
      path.dirname(resolveFrom(angularPkgRoot, "rxjs/package.json")),
      path.join(nm, "rxjs"),
    );
  } catch {
    const angularCore = resolveFrom(angularPkgRoot, "@angular/core");
    const rxjs = path.dirname(
      createRequire(angularCore).resolve("rxjs/package.json"),
    );
    symlinkPkg(rxjs, path.join(nm, "rxjs"));
  }

  fs.writeFileSync(
    path.join(srcDir, "app.component.ts"),
    `import { Component } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [SimpleTableComponent],
  template: \`<simple-table [rows]="rows" [columns]="columns" />\`,
})
export class AppComponent {
  rows = [{ id: 1, name: "Ada" }];
  columns = [{ accessor: "name" as const, label: "Name", width: 120 }];
}
`,
  );

  fs.writeFileSync(
    path.join(root, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ES2022",
          moduleResolution: "node",
          lib: ["ES2022", "dom"],
          experimentalDecorators: true,
          useDefineForClassFields: false,
          strict: true,
          skipLibCheck: true,
          outDir: "out",
          rootDir: "src",
        },
        files: ["src/app.component.ts"],
        angularCompilerOptions: {
          compilationMode: "full",
          strictTemplates: true,
        },
      },
      null,
      2,
    ),
  );

  return root;
}

describe("Angular consumer standalone import (built package)", () => {
  it("ships Ivy component metadata in SimpleTableComponent.d.ts", () => {
    expect(
      fs.existsSync(distTypesIndex),
      "packages/angular/dist is missing — run `pnpm run build:angular` first",
    ).toBe(true);

    const dts = fs.readFileSync(componentDts, "utf8");
    expect(
      /ɵcmp|ɵɵComponentDeclaration/.test(dts),
      "Published .d.ts lacks Ivy ɵcmp metadata; Angular AOT cannot treat SimpleTableComponent as standalone (TS-992012).",
    ).toBe(true);
  });

  it("allows SimpleTableComponent in a standalone component imports array", () => {
    expect(
      fs.existsSync(distTypesIndex),
      "packages/angular/dist is missing — run `pnpm run build:angular` first",
    ).toBe(true);

    const consumerRoot = createConsumerProject();
    try {
      const config = readConfiguration(path.join(consumerRoot, "tsconfig.json"));
      const result = performCompilation({
        rootNames: config.rootNames,
        options: config.options,
      });

      const diagnostics = [...(result.diagnostics ?? [])];
      const standaloneImportErrors = diagnostics.filter((diagnostic) => {
        const message = flattenDiagnostic(diagnostic);
        return (
          diagnostic.code === -992012 ||
          diagnostic.code === 992012 ||
          /must be standalone components, directives, pipes/.test(message)
        );
      });

      expect(
        standaloneImportErrors.map((diagnostic) => ({
          code: diagnostic.code,
          message: flattenDiagnostic(diagnostic),
        })),
      ).toEqual([]);
    } finally {
      fs.rmSync(consumerRoot, { recursive: true, force: true });
    }
  });
});
