import { afterEach, describe, expect, it } from "vitest";

// Import the core width math directly from source (the vitest alias maps
// `simple-table-core` -> core/src/index.ts, but these utils are internal and not
// re-exported, so reach them by relative path).
import { recalculateAllSectionWidths } from "../../../core/src/utils/resizeUtils/sectionWidths";
import { updateColumnWidthsInDOM } from "../../../core/src/utils/resizeUtils/domUpdates";
import { normalizeHeaderWidths } from "../../../core/src/utils/headerWidthUtils";
import { getCellId } from "../../../core/src/utils/cellUtils";
import type ColumnDef from "../../../core/src/types/ColumnDef";

// Regression tests for the `excludeFromRender` width bug.
//
// A column with `excludeFromRender: true` is correctly skipped from cell/header
// LAYOUT (SectionRenderer.processHeader bails on `header.excludeFromRender`),
// but several width paths historically still counted its configured width:
//   1. recalculateAllSectionWidths / findLeafHeaders (section/row width)
//   2. updateColumnWidthsInDOM (resize/autofit position walk)
//   3. normalizeHeaderWidths leaf collection (fr/% pool with containerWidth)
//
// Result: empty horizontal-scroll space, shifted cells after resize, or fr
// columns starved by export-only px widths.

afterEach(() => {
  document.body.innerHTML = "";
});

describe("recalculateAllSectionWidths — excludeFromRender columns", () => {
  it("does not add excludeFromRender column widths to the body (main) section width", () => {
    const headers: ColumnDef[] = [
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
    const headers: ColumnDef[] = [
      { accessor: "name", label: "Name", width: 200, pinned: "left" },
      { accessor: "secret", label: "Secret", width: 120, pinned: "left", excludeFromRender: true },
      { accessor: "email", label: "Email", width: 250 },
    ];

    const { leftContentWidth, mainWidth } = recalculateAllSectionWidths({ headers });

    expect(leftContentWidth).toBe(200);
    expect(mainWidth).toBe(250);
  });

  it("matches the influencers shape: pinned left + excludeFromRender in main with a width", () => {
    const headers: ColumnDef[] = [
      { accessor: "__index__", label: "#", width: 70, pinned: "left" },
      { accessor: "name", label: "Influencer", width: 400, pinned: "left" },
      // Accidental production case: excluded from render but still has width: 150.
      { accessor: "id", label: "Internal ID", width: 150, excludeFromRender: true },
      { accessor: "ranks.score_100", label: "Score", width: 150 },
      {
        accessor: "followers",
        label: "Followers",
        width: 390,
        children: [
          { accessor: "profiles.tiktok_followers", label: "TikTok", width: 130 },
          { accessor: "profiles.youtube_followers", label: "YouTube", width: 130 },
          { accessor: "profiles.instagram_followers", label: "Instagram", width: 130 },
        ],
      },
    ];

    const { leftContentWidth, mainWidth } = recalculateAllSectionWidths({ headers });

    expect(leftContentWidth).toBe(470);
    // Score + three follower leaves — the excluded `id` (150) must not be added.
    expect(mainWidth).toBe(150 + 390);
  });
});

describe("updateColumnWidthsInDOM — excludeFromRender columns", () => {
  it("does not advance subsequent cell left offsets by an excludeFromRender width", () => {
    // Influencers-shaped main section: export-only `id` sits between visible leaves.
    // After resize/autofit, updateColumnWidthsInDOM walks headers to set left/width.
    // It must skip excludeFromRender the same way SectionRenderer does — otherwise
    // every cell after `id` is shifted right by 150px (empty gap, no cell).
    const nameId = getCellId({ accessor: "name", rowId: "header" });
    const scoreId = getCellId({ accessor: "ranks.score_100", rowId: "header" });
    const emailId = getCellId({ accessor: "email", rowId: "header" });

    const container = document.createElement("div");
    container.className = "st-body-container";
    Object.assign(container.style, { width: "900px", position: "relative" });

    for (const [id, left, width] of [
      [nameId, 0, 200],
      [scoreId, 200, 150],
      [emailId, 350, 250],
    ] as const) {
      const cell = document.createElement("div");
      cell.id = id;
      Object.assign(cell.style, {
        position: "absolute",
        left: `${left}px`,
        width: `${width}px`,
      });
      container.appendChild(cell);
    }
    document.body.appendChild(container);

    const headers: ColumnDef[] = [
      { accessor: "name", label: "Name", width: 200, pinned: "left" },
      { accessor: "id", label: "Internal ID", width: 150, excludeFromRender: true },
      { accessor: "ranks.score_100", label: "Score", width: 150 },
      { accessor: "email", label: "Email", width: 250 },
    ];

    updateColumnWidthsInDOM(headers);

    const score = document.getElementById(scoreId)!;
    const email = document.getElementById(emailId)!;

    // Main section positions restart at 0. Score is the first visible main leaf.
    expect(parseFloat(score.style.left)).toBe(0);
    expect(parseFloat(email.style.left)).toBe(150);
    // Bug symptom: lefts become 150 / 300 when the excluded column advances currentLeft.
    expect(parseFloat(score.style.left)).not.toBe(150);
  });
});

describe("normalizeHeaderWidths — excludeFromRender columns", () => {
  it("does not let excludeFromRender px widths steal from the fr pool", () => {
    const headers: ColumnDef[] = [
      { accessor: "a", label: "A", width: "1fr" },
      { accessor: "secret", label: "Secret", width: 200, excludeFromRender: true },
      { accessor: "b", label: "B", width: "1fr" },
    ];

    const normalized = normalizeHeaderWidths(headers, { containerWidth: 400 });
    const a = normalized.find((h) => h.accessor === "a");
    const b = normalized.find((h) => h.accessor === "b");
    const secret = normalized.find((h) => h.accessor === "secret");

    // Visible fr columns should split the full 400px. The excluded 200px column
    // must not shrink them to 100px each.
    expect(a?.width).toBe(200);
    expect(b?.width).toBe(200);
    // Excluded column may keep its configured width for CSV/export, but must not
    // participate in the fr pool. Width may remain 200 or be untouched.
    expect(secret?.excludeFromRender).toBe(true);
  });
});
