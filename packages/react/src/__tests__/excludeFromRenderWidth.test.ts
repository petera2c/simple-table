import { describe, expect, it } from "vitest";

// Import the core width math directly from source (the vitest alias maps
// `simple-table-core` -> core/src/index.ts, but this util is internal and not
// re-exported, so reach it by relative path).
import { recalculateAllSectionWidths } from "../../../core/src/utils/resizeUtils/sectionWidths";
import type HeaderObject from "../../../core/src/types/HeaderObject";

// Regression test for the `excludeFromRender` width bug.
//
// A column with `excludeFromRender: true` is correctly skipped from cell/header
// LAYOUT (SectionRenderer.processHeader bails on `header.excludeFromRender`),
// but its width is still summed into the body section width because
// `recalculateAllSectionWidths` -> `findLeafHeaders` / `getHeaderWidthInPixels`
// only skip `header.hide`, not `header.excludeFromRender`.
//
// Result: the body row container is wider than the rendered cells by exactly
// the sum of all `excludeFromRender` column widths, producing an empty
// horizontal-scroll region after the last visible column (runaway scroll in
// scrollParent mode, clipped-but-wrong in internal-scroll mode).
describe("recalculateAllSectionWidths — excludeFromRender columns", () => {
  it("does not add excludeFromRender column widths to the body (main) section width", () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "email", label: "Email", width: 250 },
      // Hidden-from-render export-only columns (e.g. CSV export). These must NOT
      // contribute to the rendered section width.
      { accessor: "ssn", label: "SSN", width: 160, excludeFromRender: true },
      { accessor: "internalId", label: "Internal ID", width: 140, excludeFromRender: true },
    ];

    const { mainWidth } = recalculateAllSectionWidths({ headers });

    // Only the two rendered columns (200 + 250) should count toward the body
    // width. The 160 + 140 = 300px of excludeFromRender columns must be omitted.
    expect(mainWidth).toBe(450);
  });

  it("keeps pinned section widths free of excludeFromRender columns too", () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 200, pinned: "left" },
      { accessor: "secret", label: "Secret", width: 120, pinned: "left", excludeFromRender: true },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const { leftContentWidth, mainWidth } = recalculateAllSectionWidths({ headers });

    expect(leftContentWidth).toBe(200);
    expect(mainWidth).toBe(250);
  });
});
