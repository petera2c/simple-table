import { describe, expect, it } from "vitest";

/**
 * Unit-level guard for the blank-row-after-resize bug:
 * `SectionCellCaches.getCachedContext` must invalidate when the column-
 * virtualization viewport (`mainSectionViewportWidth`) changes, not only when
 * `containerWidth` changes.
 *
 * After a resize that redistributes pinned vs main widths (or auto-expand),
 * containerWidth can stay the same while the visible main viewport shrinks.
 * If the cached body context keeps the old viewport width, `getVisibleBodyCells`
 * can cull every column for rows that scroll back into view → blank rows.
 */

import { SectionCellCaches } from "../../../core/src/core/rendering/sectionCaches";
import type { CellRenderContext } from "../../../core/src/utils/bodyCell/types";

function minimalBodyContext(
  overrides: Partial<CellRenderContext> = {},
): CellRenderContext {
  const noop = () => {};
  return {
    collapsedHeaders: new Set(),
    collapsedRows: new Map(),
    expandedRows: new Map(),
    expandedDepths: [],
    selectedColumns: new Set<number>(),
    rowsWithSelectedCells: new Set<string>(),
    columnBorders: false,
    enableRowSelection: false,
    headers: [],
    rowHeight: 32,
    maxHeaderDepth: 1,
    theme: "light",
    icons: {} as CellRenderContext["icons"],
    handleMouseDown: noop,
    handleMouseOver: noop,
    setCollapsedRows: noop,
    setExpandedRows: noop,
    setRowStateMap: noop,
    getBorderClass: () => "",
    isSelected: () => false,
    isInitialFocusedCell: () => false,
    isCopyFlashing: () => false,
    isWarningFlashing: () => false,
    isRowSelected: () => false,
    isLoading: false,
    containerWidth: 1000,
    mainSectionContainerWidth: 800,
    mainSectionViewportWidth: 700,
    ...overrides,
  } as CellRenderContext;
}

describe("SectionRenderer context cache — mainSectionViewportWidth", () => {
  it("does not reuse a cached body context when only mainSectionViewportWidth changes", () => {
    const caches = new SectionCellCaches();

    const first = caches.getCachedContext(
      "body-main",
      minimalBodyContext({ mainSectionViewportWidth: 700 }),
    );
    const second = caches.getCachedContext(
      "body-main",
      minimalBodyContext({ mainSectionViewportWidth: 400 }),
    );

    // Cache miss: second call must return a context carrying the new viewport.
    expect(second.mainSectionViewportWidth).toBe(400);
    expect(second).not.toBe(first);
    expect(first.mainSectionViewportWidth).toBe(700);
  });
});
