import { describe, expect, it } from "vitest";
import type TableRow from "../types/TableRow";
import { DEFAULT_CUSTOM_THEME } from "../types/CustomTheme";
import {
  findSingleExpansionToggle,
  flattenRows,
  patchFlattenRowsForSingleToggle,
  type FlattenRowsConfig,
  type FlattenRowsResult,
} from "../utils/rowFlattening";
import { processRows } from "../utils/rowProcessing";
import { expandStateKey } from "../utils/rowUtils";

type UserRow = { id: string; name: string };
type DeptRow = { id: string; name: string; users: UserRow[] };
type RegionRow = { id: string; name: string; depts: DeptRow[] };

const getRowId = ({ row }: { row: unknown }) => String((row as { id: string }).id);

function layoutSnapshot(result: FlattenRowsResult) {
  return {
    parentEndPositions: result.parentEndPositions,
    paginatableCount: result.paginatableRows.length,
    rows: result.flattenedRows.map((row) => ({
      depth: row.depth,
      position: row.position,
      absoluteRowIndex: row.absoluteRowIndex,
      displayPosition: row.displayPosition,
      isLastGroupRow: row.isLastGroupRow,
      stableRowKey: row.stableRowKey,
      rowId: row.rowId,
      rowPath: row.rowPath,
      rowIndexPath: row.rowIndexPath,
      parentIndices: row.parentIndices,
      groupingKey: row.groupingKey,
    })),
  };
}

function expectPatchMatchesFullFlatten(
  previous: FlattenRowsResult,
  toggleKey: string,
  nextConfig: FlattenRowsConfig,
) {
  const patched = patchFlattenRowsForSingleToggle(previous, toggleKey, nextConfig);
  expect(patched, `patch should succeed for ${toggleKey}`).not.toBeNull();
  expect(layoutSnapshot(patched!)).toEqual(layoutSnapshot(flattenRows(nextConfig)));
  return patched!;
}

describe("findSingleExpansionToggle", () => {
  it("returns null when no expand or collapse key changed", () => {
    expect(findSingleExpansionToggle([], [], new Map(), new Map())).toBeNull();
    expect(
      findSingleExpansionToggle(["a"], ["b"], new Map([["a", 0]]), new Map([["b", 0]])),
    ).toBeNull();
  });

  it("returns the one key that was added or removed", () => {
    expect(findSingleExpansionToggle([], [], new Map([["dept-1", 0]]), new Map())).toBe("dept-1");
    expect(findSingleExpansionToggle(["dept-1"], [], new Map(), new Map())).toBe("dept-1");
    expect(findSingleExpansionToggle([], [], new Map(), new Map([["dept-1", 0]]))).toBe("dept-1");
    expect(findSingleExpansionToggle([], ["dept-1"], new Map(), new Map())).toBe("dept-1");
  });

  it("returns null when more than one key changed", () => {
    expect(
      findSingleExpansionToggle(
        [],
        [],
        new Map([
          ["a", 0],
          ["b", 0],
        ]),
        new Map(),
      ),
    ).toBeNull();
    expect(
      findSingleExpansionToggle([], [], new Map([["a", 0]]), new Map([["b", 0]])),
    ).toBeNull();
  });
});

describe("patchFlattenRowsForSingleToggle", () => {
  const depts: DeptRow[] = [
    {
      id: "eng",
      name: "Engineering",
      users: [
        { id: "ada", name: "Ada" },
        { id: "grace", name: "Grace" },
      ],
    },
    {
      id: "sales",
      name: "Sales",
      users: [{ id: "pat", name: "Pat" }],
    },
  ];

  const openConfig: FlattenRowsConfig = {
    rows: depts,
    rowGrouping: ["users"],
    getRowId,
    expandedDepths: new Set([0]),
    collapsedRows: new Map(),
    expandedRows: new Map(),
  };

  it("matches a full rebuild after collapsing then expanding one group", () => {
    const open = flattenRows(openConfig);
    const toggleKey = expandStateKey(open.flattenedRows[0]);
    expect(toggleKey).toBe("eng");

    const collapsedConfig: FlattenRowsConfig = {
      ...openConfig,
      collapsedRows: new Map([[toggleKey, 0]]),
    };
    const collapsed = expectPatchMatchesFullFlatten(open, toggleKey, collapsedConfig);
    expect(collapsed.flattenedRows.map((row) => (row.row as { id: string }).id)).toEqual([
      "eng",
      "sales",
      "pat",
    ]);

    expectPatchMatchesFullFlatten(collapsed, toggleKey, openConfig);
  });

  it("matches a full rebuild when collapsing a nested group", () => {
    const regions: RegionRow[] = [
      {
        id: "east",
        name: "East",
        depts: [
          {
            id: "eng",
            name: "Engineering",
            users: [
              { id: "ada", name: "Ada" },
              { id: "grace", name: "Grace" },
            ],
          },
          { id: "sales", name: "Sales", users: [{ id: "pat", name: "Pat" }] },
        ],
      },
      {
        id: "west",
        name: "West",
        depts: [{ id: "ops", name: "Ops", users: [{ id: "lee", name: "Lee" }] }],
      },
    ];

    const openNested: FlattenRowsConfig = {
      rows: regions,
      rowGrouping: ["depts", "users"],
      getRowId,
      expandedDepths: new Set([0, 1]),
      collapsedRows: new Map(),
      expandedRows: new Map(),
    };

    const open = flattenRows(openNested);
    const engRow = open.flattenedRows.find(
      (row) => row.depth === 1 && (row.row as { id: string }).id === "eng",
    );
    expect(engRow).toBeTruthy();
    const toggleKey = expandStateKey(engRow!);

    const collapsedConfig: FlattenRowsConfig = {
      ...openNested,
      collapsedRows: new Map([[toggleKey, 1]]),
    };
    const collapsed = expectPatchMatchesFullFlatten(open, toggleKey, collapsedConfig);
    expect(collapsed.flattenedRows.map((row) => (row.row as { id: string }).id)).toEqual([
      "east",
      "eng",
      "sales",
      "pat",
      "west",
      "ops",
      "lee",
    ]);

    expect(patchFlattenRowsForSingleToggle(collapsed, toggleKey, openNested)).toBeNull();
  });

  it("returns null when the parent row is not in the cached list", () => {
    const open = flattenRows(openConfig);
    expect(patchFlattenRowsForSingleToggle(open, "missing", openConfig)).toBeNull();
  });
});

describe("processRows — pagination off", () => {
  it("keeps the same row list instead of cloning it", () => {
    const flattenedRows: TableRow[] = Array.from({ length: 4 }, (_, i) => ({
      depth: 0,
      displayPosition: i,
      isLastGroupRow: i === 3,
      position: i,
      row: { id: i },
      rowId: [i],
      absoluteRowIndex: i,
    }));

    const result = processRows({
      flattenedRows,
      paginatableRows: flattenedRows,
      parentEndPositions: [flattenedRows.length],
      currentPage: 1,
      rowsPerPage: 10,
      enablePagination: false,
      serverSidePagination: false,
      contentHeight: undefined,
      rowHeight: 32,
      scrollTop: 0,
      customTheme: DEFAULT_CUSTOM_THEME,
      enableStickyParents: false,
    });

    expect(result.currentTableRows).toBe(flattenedRows);
  });
});
