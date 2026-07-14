import { describe, expect, it } from "vitest";
import { rowsShallowUnchanged, shallowEqualRow } from "../utils/rowsEqual";

describe("shallowEqualRow", () => {
  it("returns true for same reference", () => {
    const row = { id: 1, name: "A" };
    expect(shallowEqualRow(row, row)).toBe(true);
  });

  it("returns true for shallow clones with same values", () => {
    const a = { id: 1, name: "A", nested: { x: 1 } };
    const b = { ...a };
    expect(shallowEqualRow(a, b)).toBe(true);
  });

  it("returns false when a primitive field changes", () => {
    expect(shallowEqualRow({ id: 1, name: "A" }, { id: 1, name: "B" })).toBe(false);
  });
});

describe("rowsShallowUnchanged", () => {
  const getRowId = ({ row }: { row: unknown }) => String((row as { id: number }).id);

  it("returns true for map-spread clones with stable ids", () => {
    const prev = [
      { id: 1, name: "A", meta: { t: 1 } },
      { id: 2, name: "B", meta: { t: 2 } },
    ];
    const next = prev.map((r) => ({ ...r }));
    expect(rowsShallowUnchanged(prev, next, getRowId)).toBe(true);
  });

  it("returns false when a field value changes", () => {
    const prev = [{ id: 1, name: "A" }];
    const next = [{ id: 1, name: "B" }];
    expect(rowsShallowUnchanged(prev, next, getRowId)).toBe(false);
  });

  it("returns false when id sequence changes", () => {
    const prev = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ];
    const next = [
      { id: 2, name: "B" },
      { id: 1, name: "A" },
    ];
    expect(rowsShallowUnchanged(prev, next, getRowId)).toBe(false);
  });

  it("returns false for shallow clones above the size cap without scanning all fields", () => {
    const n = 50_001;
    const prev = Array.from({ length: n }, (_, i) => ({ id: i, name: `r${i}` }));
    const next = prev.map((r) => ({ ...r }));
    expect(rowsShallowUnchanged(prev, next, getRowId)).toBe(false);
  });

  it("returns true for new array of same row object refs even above the size cap", () => {
    const n = 50_001;
    const prev = Array.from({ length: n }, (_, i) => ({ id: i, name: `r${i}` }));
    const next = [...prev];
    expect(rowsShallowUnchanged(prev, next, getRowId)).toBe(true);
  });
});
