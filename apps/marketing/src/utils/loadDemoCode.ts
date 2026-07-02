import { readFileSync } from "fs";
import { join } from "path";
import { FRAMEWORKS, type Framework } from "@/constants/frameworks";
import type { DemoCodeMap } from "@/providers/DemoCodeProvider";

/**
 * Server-side loader for demo snippets. Reads every framework variant of each demo from
 * public/txt-demos so docs pages can server-render all six code examples (SEO/LLM crawlers
 * don't execute the client-side fetch that CodeBlock previously relied on).
 */
export function loadDemoCodeMap(demoIds: string[]): DemoCodeMap {
  const map: DemoCodeMap = {};

  for (const demoId of demoIds) {
    const byFramework: Partial<Record<Framework, string>> = {};
    for (const framework of FRAMEWORKS) {
      try {
        byFramework[framework] = readFileSync(
          join(process.cwd(), "public", "txt-demos", framework, `${demoId}.txt`),
          "utf-8"
        );
      } catch {
        // Demo not available for this framework; tab simply won't render.
      }
    }
    map[demoId] = byFramework;
  }

  return map;
}
