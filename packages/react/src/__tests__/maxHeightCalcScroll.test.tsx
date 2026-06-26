import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Repro for the "maxHeight calc() clips instead of scrolls" bug.
//
// With `maxHeight="calc(100vh - 700px)"` (no `height`, no `scrollParent`), CSS
// caps the root box at the resolved calc value, so the box *looks* the right
// size. But the scroll/virtualization math lives in `convertHeightToPixels`,
// which only understands `px`, `vh`, and `%` — for a `calc(...)` string it falls
// through to `return window.innerHeight`.
//
// So the JS believes the available height is the FULL viewport (window.innerHeight),
// not `viewport - 700px`. When the real content is taller than the resolved calc
// box but shorter than the full viewport, `calculateContentHeight` decides the
// content "fits" and returns `undefined`. That disables the internal scroll region:
// the root is rendered with `height: auto`, every row is mounted, and the
// `overflow: hidden` wrapper simply clips the rows past the calc cap. There is no
// inner scrollbar, so rows below the fold are unreachable.
//
// A correct implementation resolves the calc value (here `window.innerHeight - 700`),
// sees the content overflow it, and gives the root a bounded height so the body can
// scroll. This test asserts that bounded-height contract and fails while the bug exists.

let container: HTMLDivElement | null = null;
let root: Root | null = null;
let originalInnerHeight: number;

beforeEach(() => {
  // Pin the viewport so the calc math is deterministic regardless of the host:
  //   resolved calc = 800 - 700 = 100px
  //   content       = headerHeight (32) + 15 rows * 32 = 512px
  // 100 < 512 <= 800, i.e. the content overflows the calc box but fits the full
  // viewport — exactly the window where the bug manifests.
  originalInnerHeight = window.innerHeight;
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 800,
  });
});

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: originalInnerHeight,
  });
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

const rows = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));

describe("SimpleTable (React adapter) — maxHeight calc() scroll", () => {
  it("gives the root a bounded height so the body scrolls instead of clipping", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    root.render(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId: (p) => String((p.row as { id: number }).id),
        maxHeight: "calc(100vh - 700px)",
        theme: "light",
      }),
    );

    await waitFor(() => host.querySelectorAll(".st-body-container .st-cell").length > 0);

    const tableRoot = host.querySelector<HTMLElement>(".simple-table-root");
    expect(tableRoot).not.toBeNull();

    // The CSS cap is applied correctly...
    expect(tableRoot!.style.maxHeight).toBe("calc(100vh - 700px)");

    // ...but the root must ALSO be height-bounded to create an inner scroll region.
    // With the bug, `convertHeightToPixels` mis-reads the calc as the full viewport,
    // decides the content fits, and leaves the root at `height: auto` — which lets
    // the body grow past the cap and get clipped by `overflow: hidden`.
    expect(tableRoot!.style.height).not.toBe("auto");
    expect(tableRoot!.style.height).toBe("calc(100vh - 700px)");
  });
});
