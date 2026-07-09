import { beforeEach, describe, expect, it, vi } from "vitest";

// Reach into the core source directly: these body-cell helpers are internal and
// not re-exported from the package entry (mirrors columnVirtualizationViewportWidth.test.ts).
import {
  createBodyCellElement,
  updateBodyCellElement,
} from "../../../core/src/utils/bodyCell/styling";
import type {
  AbsoluteBodyCell,
  CellRenderContext,
} from "../../../core/src/utils/bodyCell/types";
import type HeaderObject from "../../../core/src/types/HeaderObject";
import type Row from "../../../core/src/types/Row";

// Regression tests for the custom-cell-renderer over-render fix.
//
// `updateBodyCellElement` previously wiped and rebuilt every reused cell's
// content span on EVERY full render (sort, selection, scroll-end, resize,
// dimension/scrollbar measurement, …), re-invoking the consumer's
// `cellRenderer` even when the underlying row data had not changed. On a wide
// grid where every column has a custom renderer, idle layout/scroll renders
// churned hundreds of DOM nodes per frame.
//
// The fix memoizes the inputs `createCellContent` depends on (row object
// reference, resolved value, theme, loading state) and skips the rebuild when
// they are unchanged.

/** Build a context just complete enough for create/update of a plain data cell. */
function buildContext(overrides: Partial<CellRenderContext> = {}): CellRenderContext {
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
    ...overrides,
  } as CellRenderContext;
}

/** Build an AbsoluteBodyCell for a single-column ("name") data row. */
function buildCell(row: Row, header: HeaderObject): AbsoluteBodyCell {
  return {
    header,
    row,
    rowIndex: 0,
    colIndex: 0,
    rowId: "row-0",
    stableRowKey: "row-0",
    displayRowNumber: 1,
    depth: 0,
    isOdd: false,
    tableRow: {
      position: 0,
      displayPosition: 0,
      isLastGroupRow: false,
      row,
      isLoadingSkeleton: false,
      absoluteRowIndex: 0,
      rowPath: [],
      rowId: ["row-0"],
      stableRowKey: "row-0",
      depth: 0,
    } as AbsoluteBodyCell["tableRow"],
    left: 0,
    top: 0,
    width: 120,
    height: 32,
  };
}

describe("custom cellRenderer memoization in updateBodyCellElement", () => {
  let cellRenderer: ReturnType<typeof vi.fn>;
  let header: HeaderObject;

  beforeEach(() => {
    cellRenderer = vi.fn(({ row }: { row: Row }) => {
      const span = document.createElement("span");
      span.className = "custom-content";
      span.textContent = String((row as Record<string, unknown>).name ?? "");
      return span;
    });
    header = {
      accessor: "name",
      label: "Name",
      width: 120,
      cellRenderer: cellRenderer as unknown as HeaderObject["cellRenderer"],
    } as HeaderObject;
  });

  it("renders the custom content once on creation", () => {
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const el = createBodyCellElement(buildCell(row, header), buildContext());

    expect(cellRenderer).toHaveBeenCalledTimes(1);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Alice");
  });

  it("does NOT re-invoke the cellRenderer when row reference and value are unchanged", () => {
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const ctx = buildContext();
    const cell = buildCell(row, header);

    const el = createBodyCellElement(cell, ctx);
    expect(cellRenderer).toHaveBeenCalledTimes(1);

    // Simulate repeated layout/scroll/selection renders that reuse the cell.
    updateBodyCellElement(el, buildCell(row, header), ctx);
    updateBodyCellElement(el, buildCell(row, header), ctx);
    updateBodyCellElement(el, buildCell(row, header), ctx);

    // Content was memoized: the renderer is never called again.
    expect(cellRenderer).toHaveBeenCalledTimes(1);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Alice");
  });

  it("keeps the existing content DOM node (no teardown) when skipping the rebuild", () => {
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const ctx = buildContext();
    const el = createBodyCellElement(buildCell(row, header), ctx);

    const nodeBefore = el.querySelector(".custom-content");
    updateBodyCellElement(el, buildCell(row, header), ctx);
    const nodeAfter = el.querySelector(".custom-content");

    // Same element instance survives — proof the span was not wiped + recreated.
    expect(nodeAfter).toBe(nodeBefore);
  });

  it("re-invokes the cellRenderer when the row object reference changes (immutable update)", () => {
    const ctx = buildContext();
    const el = createBodyCellElement(
      buildCell({ id: 1, name: "Alice" } as unknown as Row, header),
      ctx,
    );
    expect(cellRenderer).toHaveBeenCalledTimes(1);

    // New row object (same value) — the standard immutable-data update pattern.
    updateBodyCellElement(
      el,
      buildCell({ id: 1, name: "Alice" } as unknown as Row, header),
      ctx,
    );

    expect(cellRenderer).toHaveBeenCalledTimes(2);
  });

  it("re-invokes the cellRenderer when the resolved value changes (in-place mutation)", () => {
    const row = { id: 1, name: "Alice" } as Record<string, unknown>;
    const ctx = buildContext();
    const el = createBodyCellElement(buildCell(row as unknown as Row, header), ctx);
    expect(cellRenderer).toHaveBeenCalledTimes(1);

    // Mutate the same row object in place, then re-render with the same reference.
    row.name = "Bob";
    updateBodyCellElement(el, buildCell(row as unknown as Row, header), ctx);

    expect(cellRenderer).toHaveBeenCalledTimes(2);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Bob");
  });

  it("re-invokes the cellRenderer when the theme changes (same row data)", () => {
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const el = createBodyCellElement(buildCell(row, header), buildContext());
    expect(cellRenderer).toHaveBeenCalledTimes(1);

    updateBodyCellElement(el, buildCell(row, header), buildContext({ theme: "dark" }));

    expect(cellRenderer).toHaveBeenCalledTimes(2);
  });

  it("re-invokes the cellRenderer when content was discarded but memo inputs are unchanged", () => {
    // Mirrors the blank-row failure mode: onRendererHostDiscard + innerHTML wipe
    // (animation ghost teardown, portal dispose, etc.) empties the content span
    // while contentKeyMap still records the previous inputs. A later full render
    // (sort, column visibility, scroll-end) must rebuild — not skip — or the
    // cell stays blank until a full DOM recreate (e.g. invalidateCache "all").
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const ctx = buildContext();
    const el = createBodyCellElement(buildCell(row, header), ctx);
    expect(cellRenderer).toHaveBeenCalledTimes(1);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Alice");

    const contentSpan = el.querySelector(".st-cell-content") as HTMLElement;
    expect(contentSpan).not.toBeNull();
    contentSpan.innerHTML = "";

    updateBodyCellElement(el, buildCell(row, header), ctx);

    expect(cellRenderer).toHaveBeenCalledTimes(2);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Alice");
  });

  it("re-invokes the cellRenderer when a disposed React portal host is left empty", () => {
    // disposeHost unregisters the portal and React unmounts into the host, but
    // the host node itself often remains under .st-cell-content. Memo inputs
    // are unchanged, yet the cell is blank until we detect the empty host.
    const row: Row = { id: 1, name: "Alice" } as unknown as Row;
    const ctx = buildContext();
    const el = createBodyCellElement(buildCell(row, header), ctx);
    expect(cellRenderer).toHaveBeenCalledTimes(1);

    const contentSpan = el.querySelector(".st-cell-content") as HTMLElement;
    contentSpan.innerHTML = "";
    const portalHost = document.createElement("div");
    portalHost.setAttribute("data-st-portal-id", "st-portal-0");
    portalHost.style.display = "contents";
    contentSpan.appendChild(portalHost);

    updateBodyCellElement(el, buildCell(row, header), ctx);

    expect(cellRenderer).toHaveBeenCalledTimes(2);
    expect(el.querySelector(".custom-content")?.textContent).toBe("Alice");
  });
});
