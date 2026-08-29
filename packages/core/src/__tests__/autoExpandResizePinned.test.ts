import { describe, expect, it } from "vitest";
import type ColumnDef from "../types/ColumnDef";
import { handleResizeWithAutoExpand } from "../utils/resizeUtils/autoExpandResize";

/**
 * Repro: with autoExpandColumns and more than one left-pinned column, dragging
 * a non-last pinned column wider does nothing. Neighbors are already at their
 * natural widths, so they have no surplus to give, and only the last pinned
 * column (the one next to the main grid) is allowed to grow the pinned strip.
 */

const CONTAINER_WIDTH = 800;
const GROW_BY = 50;

function col(
  accessor: string,
  width: number,
  extras: Partial<ColumnDef> = {},
): ColumnDef {
  return { accessor, label: accessor, width, type: "string", ...extras };
}

function widthsMap(headers: ColumnDef[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const header of headers) {
    map.set(String(header.accessor), header.width as number);
  }
  return map;
}

function growPinnedColumn({
  resized,
  sectionHeaders,
  headers,
  rootPinned,
  reverse = false,
}: {
  resized: ColumnDef;
  sectionHeaders: ColumnDef[];
  headers: ColumnDef[];
  rootPinned: "left" | "right";
  reverse?: boolean;
}): void {
  const startWidth = resized.width as number;
  const initialWidthsMap = widthsMap(sectionHeaders);
  const sectionWidth = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  handleResizeWithAutoExpand({
    collapsedHeaders: new Set(),
    containerWidth: CONTAINER_WIDTH,
    delta: GROW_BY,
    headers,
    initialWidthsMap,
    resizedHeader: resized,
    reverse,
    rootPinned,
    sectionHeaders,
    sectionWidth,
    shrinkFloors: widthsMap(headers),
    startWidth,
  });
}

describe("handleResizeWithAutoExpand — multiple pinned columns", () => {
  it("widens the first of two left-pinned columns without shrinking its sibling below its natural width", () => {
    const id = col("id", 80, { pinned: "left", type: "number" });
    const name = col("name", 120, { pinned: "left" });
    const email = col("email", 200);
    const department = col("department", 200);
    const headers = [id, name, email, department];

    growPinnedColumn({
      resized: id,
      sectionHeaders: [id, name],
      headers,
      rootPinned: "left",
    });

    expect(
      id.width as number,
      "the first left-pinned column should grow when the user drags it wider",
    ).toBeGreaterThanOrEqual(80 + GROW_BY - 1);
    expect(
      name.width as number,
      "the other pinned column should keep at least its natural width",
    ).toBeGreaterThanOrEqual(120);
  });

  it("widens a middle left-pinned column when three columns are pinned", () => {
    const id = col("id", 70, { pinned: "left", type: "number" });
    const name = col("name", 110, { pinned: "left" });
    const role = col("role", 100, { pinned: "left" });
    const email = col("email", 200);
    const headers = [id, name, role, email];

    growPinnedColumn({
      resized: name,
      sectionHeaders: [id, name, role],
      headers,
      rootPinned: "left",
    });

    expect(
      name.width as number,
      "a non-last left-pinned column should grow when the user drags it wider",
    ).toBeGreaterThanOrEqual(110 + GROW_BY - 1);
  });
});
