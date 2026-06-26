/* eslint-disable */
/**
 * Unit tests for the column virtualization logic introduced for the music example
 * performance work (Phase 2). These cover the pure algorithms that decide which
 * leaf columns render for a given horizontal viewport, plus the accessor -> grid
 * track index mapping used to position windowed cells via `grid-column`.
 */
import {
  buildCumulativeWidthMap,
  buildColumnWindow,
  findColumnAtScrollPosition,
  getColumnWidthInPixels,
  getVisibleColumns,
} from "../src/utils/columnVirtualizationUtils";
import HeaderObject from "../src/types/HeaderObject";

// Minimal ambient declarations so the file type-checks without @types/jest
// installed (the runner provides these globals at runtime).
declare const describe: (name: string, fn: () => void) => void;
declare const test: (name: string, fn: () => void) => void;
declare const expect: (actual: unknown) => any;

const col = (
  accessor: string,
  width: number | string,
  extra: Partial<HeaderObject> = {},
): HeaderObject => ({ accessor, label: accessor, width, ...extra }) as HeaderObject;

const makeHeaders = (count: number, width: number | string = 100): HeaderObject[] =>
  Array.from({ length: count }, (_, i) => col(`c${i}`, width));

describe("getColumnWidthInPixels", () => {
  test("returns numeric widths directly", () => {
    expect(getColumnWidthInPixels(col("a", 120))).toBe(120);
  });

  test("parses px string widths", () => {
    expect(getColumnWidthInPixels(col("a", "80px"))).toBe(80);
    expect(getColumnWidthInPixels(col("a", "  64px "))).toBe(64);
  });

  test("falls back to numeric minWidth for non-fixed widths", () => {
    expect(getColumnWidthInPixels(col("a", "2fr", { minWidth: 90 }))).toBe(90);
  });

  test("falls back to px minWidth for non-fixed widths", () => {
    expect(getColumnWidthInPixels(col("a", "1fr", { minWidth: "75px" }))).toBe(75);
  });

  test("uses the default when nothing is resolvable", () => {
    expect(getColumnWidthInPixels(col("a", "1fr"))).toBe(150);
    expect(getColumnWidthInPixels(col("a", "50%"))).toBe(150);
  });
});

describe("buildCumulativeWidthMap", () => {
  test("computes left positions, total width and leaf order", () => {
    const map = buildCumulativeWidthMap({ headers: makeHeaders(5, 100) });
    expect(map.columnLeftPositions).toEqual([0, 100, 200, 300, 400]);
    expect(map.totalWidth).toBe(500);
    expect(map.leafHeaders.map((h) => h.accessor)).toEqual([
      "c0",
      "c1",
      "c2",
      "c3",
      "c4",
    ]);
  });

  test("excludes hidden columns from the grid leaf order", () => {
    const headers = [
      col("a", 100),
      col("b", 100, { hide: true }),
      col("c", 100),
    ];
    const map = buildCumulativeWidthMap({ headers });
    expect(map.leafHeaders.map((h) => h.accessor)).toEqual(["a", "c"]);
    expect(map.totalWidth).toBe(200);
  });
});

describe("findColumnAtScrollPosition", () => {
  const map = buildCumulativeWidthMap({ headers: makeHeaders(10, 100) });

  test("clamps to the first column at or before zero", () => {
    expect(findColumnAtScrollPosition(0, map)).toBe(0);
    expect(findColumnAtScrollPosition(-50, map)).toBe(0);
  });

  test("finds the column containing the scroll position", () => {
    expect(findColumnAtScrollPosition(150, map)).toBe(1);
    expect(findColumnAtScrollPosition(250, map)).toBe(2);
    expect(findColumnAtScrollPosition(900, map)).toBe(9);
  });

  test("clamps to the last column past the total width", () => {
    expect(findColumnAtScrollPosition(5000, map)).toBe(9);
  });
});

describe("getVisibleColumns", () => {
  const map = buildCumulativeWidthMap({ headers: makeHeaders(10, 100) });

  test("returns only the columns intersecting the viewport (no overscan)", () => {
    const { startIndex, endIndex, columns } = getVisibleColumns({
      scrollLeft: 300,
      viewportWidth: 300,
      bufferColumnCount: 0,
      widthMap: map,
    });
    expect(startIndex).toBe(3);
    expect(endIndex).toBe(7);
    expect(columns.map((h) => h.accessor)).toEqual(["c3", "c4", "c5", "c6"]);
  });

  test("returns all columns when the viewport is wider than the table", () => {
    const { columns } = getVisibleColumns({
      scrollLeft: 0,
      viewportWidth: 5000,
      bufferColumnCount: 0,
      widthMap: map,
    });
    expect(columns).toHaveLength(10);
  });

  test("adds extra columns when an overscan buffer is requested", () => {
    const tight = getVisibleColumns({
      scrollLeft: 300,
      viewportWidth: 300,
      bufferColumnCount: 0,
      widthMap: map,
    });
    const buffered = getVisibleColumns({
      scrollLeft: 300,
      viewportWidth: 300,
      bufferColumnCount: 2,
      widthMap: map,
    });
    expect(buffered.columns.length).toBeGreaterThan(tight.columns.length);
  });
});

describe("buildColumnWindow", () => {
  test("returns null for pinned sections (never virtualized)", () => {
    expect(
      buildColumnWindow({
        headers: makeHeaders(10, 100),
        scrollLeft: 0,
        viewportWidth: 400,
        bufferColumnCount: 0,
        pinned: "left",
      }),
    ).toBeNull();
  });

  test("renders every column before the viewport has been measured", () => {
    const window = buildColumnWindow({
      headers: makeHeaders(10, 100),
      scrollLeft: 0,
      viewportWidth: 0,
      bufferColumnCount: 2,
    });
    expect(window).not.toBeNull();
    expect(window!.visibleAccessors.size).toBe(10);
  });

  test("windows visible accessors and maps every leaf to its grid track", () => {
    const window = buildColumnWindow({
      headers: makeHeaders(10, 100),
      scrollLeft: 300,
      viewportWidth: 300,
      bufferColumnCount: 0,
    });
    expect(window).not.toBeNull();
    expect(Array.from(window!.visibleAccessors).sort()).toEqual([
      "c3",
      "c4",
      "c5",
      "c6",
    ]);
    // Track indices cover all leaves regardless of visibility so off-screen
    // cells can still be placed correctly when they enter the window.
    expect(window!.trackIndexByAccessor.size).toBe(10);
    expect(window!.trackIndexByAccessor.get("c0")).toBe(0);
    expect(window!.trackIndexByAccessor.get("c5")).toBe(5);
    expect(window!.trackIndexByAccessor.get("c9")).toBe(9);
  });
});
