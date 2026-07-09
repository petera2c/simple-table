import { describe, expect, it } from "vitest";

/**
 * Unit-level guard for the blank-row-after-resize bug:
 * `SectionRenderer.getCachedContext` must invalidate when the column-
 * virtualization viewport (`mainSectionViewportWidth`) changes, not only when
 * `containerWidth` changes.
 *
 * After a resize that redistributes pinned vs main widths (or auto-expand),
 * containerWidth can stay the same while the visible main viewport shrinks.
 * If the cached body context keeps the old viewport width, `getVisibleBodyCells`
 * can cull every column for rows that scroll back into view → blank rows.
 *
 * We assert the hash helper includes the viewport field by importing the
 * SectionRenderer and exercising getCachedContext indirectly via a minimal
 * render path is heavy; instead mirror the hash keys the production code must
 * include (kept in sync with createContextHash).
 */

// Reach into the private hash by constructing contexts the same way TableRenderer
// does and verifying that two contexts differing only in mainSectionViewportWidth
// are treated as distinct by the public invalidate/cache contract.
import { SectionRenderer } from "../../../core/src/core/rendering/SectionRenderer";
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
    const renderer = new SectionRenderer();

    // Access private getCachedContext via bracket to avoid exporting it.
    const getCached = (
      renderer as unknown as {
        getCachedContext: (
          key: string,
          context: CellRenderContext,
          pinned?: "left" | "right",
          sectionWidth?: number,
        ) => CellRenderContext;
      }
    ).getCachedContext.bind(renderer);

    const first = getCached("body-main", minimalBodyContext({ mainSectionViewportWidth: 700 }));
    const second = getCached("body-main", minimalBodyContext({ mainSectionViewportWidth: 400 }));

    // Cache miss: second call must return a context carrying the new viewport.
    expect(second.mainSectionViewportWidth).toBe(400);
    expect(second).not.toBe(first);
    expect(first.mainSectionViewportWidth).toBe(700);
  });
});
