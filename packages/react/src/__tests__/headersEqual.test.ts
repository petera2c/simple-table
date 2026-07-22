import { describe, expect, it } from "vitest";
import {
  collectHeaderAccessors,
  headersStructurallyEqual,
} from "../utils/headersEqual";
import type { ReactHeaderObject } from "../types";

describe("headersStructurallyEqual", () => {
  const base = (): ReactHeaderObject[] => [
    { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
    {
      accessor: "metrics",
      label: "Metrics",
      width: 240,
      type: "string",
      children: [
        { accessor: "score", label: "Score", width: 120, type: "number", align: "right" },
      ],
    },
  ];

  it("returns true for identical references", () => {
    const headers = base();
    expect(headersStructurallyEqual(headers, headers)).toBe(true);
  });

  it("returns true when only renderer identity differs", () => {
    const a = base();
    const b = base();
    b[0] = {
      ...b[0],
      cellRenderer: () => null,
      headerRenderer: () => null,
    };
    a[0] = {
      ...a[0],
      cellRenderer: () => null,
      headerRenderer: () => null,
    };
    expect(headersStructurallyEqual(a, b)).toBe(true);
  });

  it("returns false when width changes", () => {
    const a = base();
    const b = base();
    b[0] = { ...b[0], width: 200 };
    expect(headersStructurallyEqual(a, b)).toBe(false);
  });

  it("returns false when nested child accessor changes", () => {
    const a = base();
    const b = base();
    b[1] = {
      ...b[1],
      children: [{ accessor: "rank", label: "Rank", width: 120, type: "number" }],
    };
    expect(headersStructurallyEqual(a, b)).toBe(false);
  });

  it("returns false when pinned changes", () => {
    const a = base();
    const b = base();
    b[0] = { ...b[0], pinned: "left" };
    expect(headersStructurallyEqual(a, b)).toBe(false);
  });
});

describe("collectHeaderAccessors", () => {
  it("collects nested accessors", () => {
    const accessors = collectHeaderAccessors([
      {
        accessor: "parent",
        label: "Parent",
        width: 100,
        children: [{ accessor: "child", label: "Child", width: 50 }],
      },
    ]);
    expect([...accessors].sort()).toEqual(["child", "parent"]);
  });
});
