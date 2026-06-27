import { describe, expect, it } from "vitest";

// Import the core width math directly from source (the vitest alias maps
// `simple-table-core` -> core/src/index.ts, but these utils are internal and
// not re-exported, so reach them by relative path).
import {
  getMainSectionViewportWidth,
  recalculateAllSectionWidths,
} from "../../../core/src/utils/resizeUtils/sectionWidths";
import type HeaderObject from "../../../core/src/types/HeaderObject";

// Regression test for the "column virtualization disabled in wide tables" bug.
//
// Column virtualization renders only the body/header cells whose horizontal
// span intersects the *visible* viewport (see getVisibleBodyCells /
// getVisibleCells, which filter on `mainSectionContainerWidth`).
//
// The bug: TableRenderer passed `mainWidth` — the full CONTENT width (sum of
// every main column's width) — as `mainSectionContainerWidth`. Because the
// "viewport" then equaled the total content width, every column intersected it
// and all columns rendered: column virtualization was effectively off. This was
// especially visible in window / external-scroll mode (e.g. the ~60-column
// MusicWindowScroll story) where the body grows to its natural width.
//
// The fix derives the virtualization viewport from the VISIBLE width:
// `containerWidth - leftWidth - rightWidth` via getMainSectionViewportWidth.
describe("getMainSectionViewportWidth — column virtualization viewport", () => {
  it("returns the visible main width (container minus pinned), not the content width", () => {
    const { leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: [
        { accessor: "rank", label: "#", width: 70, pinned: "left" },
        { accessor: "identity", label: "Identity", width: 240, pinned: "left" },
        { accessor: "a", label: "A", width: 200 },
        { accessor: "b", label: "B", width: 200 },
        { accessor: "c", label: "C", width: 200 },
      ],
      containerWidth: 1000,
    });

    // pinned-left content = 70 + 240 = 310 (+ pinned border); no pinned-right.
    expect(rightWidth).toBe(0);
    expect(leftWidth).toBeGreaterThanOrEqual(310);
    expect(getMainSectionViewportWidth({ containerWidth: 1000, leftWidth, rightWidth })).toBe(
      1000 - leftWidth - rightWidth,
    );
  });

  it("does NOT return the full content width for a wide many-column table (the regression)", () => {
    // Mirror the MusicWindowScroll shape: two pinned-left columns + many wide
    // main columns whose combined width far exceeds the visible container.
    const headers: HeaderObject[] = [
      { accessor: "rank", label: "#", width: 70, pinned: "left" },
      { accessor: "identity", label: "Identity", width: 240, pinned: "left" },
      ...Array.from({ length: 58 }, (_, i) => ({
        accessor: `metric${i}`,
        label: `Metric ${i}`,
        width: 200,
      })),
    ];

    const containerWidth = 2256; // the real viewport from the repro
    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers,
      containerWidth,
    });

    const viewportWidth = getMainSectionViewportWidth({ containerWidth, leftWidth, rightWidth });

    // mainWidth is the full content width (58 * 200 = 11600) — passing THIS as
    // the viewport is the bug: every column would intersect it.
    expect(mainWidth).toBe(11600);

    // The virtualization viewport must be the visible width, far smaller than
    // the content, so only a subset of columns render.
    expect(viewportWidth).toBe(containerWidth - leftWidth - rightWidth);
    expect(viewportWidth!).toBeLessThan(mainWidth);
    expect(viewportWidth!).toBeLessThan(containerWidth);
  });

  it("returns undefined when the container has not been measured yet (width 0)", () => {
    // So the renderer falls back to a live clientWidth read instead of
    // virtualizing against a 0px viewport.
    expect(
      getMainSectionViewportWidth({ containerWidth: 0, leftWidth: 0, rightWidth: 0 }),
    ).toBeUndefined();
  });

  it("clamps to 0 when pinned sections exceed the container width", () => {
    expect(
      getMainSectionViewportWidth({ containerWidth: 300, leftWidth: 250, rightWidth: 100 }),
    ).toBe(0);
  });
});
