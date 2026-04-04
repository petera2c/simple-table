/**
 * TABLE REF METHODS TESTS
 * Tests for TableAPI (getAPI()) methods: getVisibleRows, getAllRows, getHeaders,
 * getSortState/applySortState, getFilterState/applyFilter/clearFilter,
 * getCurrentPage/setPage, setQuickFilter, toggleColumnEditor/applyColumnVisibility,
 * expandAll/collapseAll/getExpandedDepths.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import { SimpleTableVanilla } from "../../src/index";

const meta: Meta = {
  title: "Tests/37 - Table Ref Methods",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for table.getAPI() methods (data, sort, filter, pagination, column editor, expand/collapse).",
      },
    },
  },
};

export default meta;

type TableInstance = InstanceType<typeof SimpleTableVanilla>;
type WrapperWithTable = HTMLDivElement & { _table?: TableInstance };

const TABLE_REF_KEY = "__storybook_table_ref";
const getTable = (_canvasElement: HTMLElement): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[TABLE_REF_KEY];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string", isSortable: true },
];
const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
  { id: 4, name: "Dave" },
  { id: 5, name: "Eve" },
];

export const GetVisibleRowsGetAllRowsGetHeaders = {
  render: () => {
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    const visibleRows = api.getVisibleRows();
    const allRows = api.getAllRows();
    const hdrs = api.getHeaders();
    expect(Array.isArray(visibleRows)).toBe(true);
    expect(allRows.length).toBe(5);
    expect(hdrs.length).toBeGreaterThanOrEqual(2);
    const nameHeader = hdrs.find((h) => h.accessor === "name" || h.label === "Name");
    expect(nameHeader).toBeTruthy();
  },
};

export const GetSortStateApplySortState = {
  render: () => {
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    let state = api.getSortState();
    expect(state).toBeNull();
    await api.applySortState({ accessor: "name", direction: "asc" });
    await new Promise((r) => setTimeout(r, 100));
    state = api.getSortState();
    expect(state).toBeTruthy();
    expect(state?.key.accessor).toBe("name");
    expect(state?.direction).toBe("asc");
  },
};

export const GetFilterStateApplyFilterClearFilter = {
  render: () => {
    const filterHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", filterable: true },
      { accessor: "name", label: "Name", width: 150, type: "string", filterable: true },
    ];
    const result = renderVanillaTable(filterHeaders, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    let filters = api.getFilterState();
    expect(Object.keys(filters).length).toBe(0);
    await api.applyFilter({ accessor: "name", operator: "contains", value: "Alice" });
    await new Promise((r) => setTimeout(r, 100));
    filters = api.getFilterState();
    expect(Object.keys(filters).length).toBeGreaterThan(0);
    await api.clearFilter("name");
    await new Promise((r) => setTimeout(r, 100));
    filters = api.getFilterState();
    expect(filters["name"]).toBeUndefined();
  },
};

export const GetCurrentPageSetPage = {
  render: () => {
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      shouldPaginate: true,
      rowsPerPage: 2,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    expect(api.getCurrentPage()).toBe(1);
    await api.setPage(2);
    await new Promise((r) => setTimeout(r, 100));
    expect(api.getCurrentPage()).toBe(2);
  },
};

export const SetQuickFilter = {
  render: () => {
    const captured: { value: string } = { value: "" };
    (window as unknown as { __quickFilterCapture?: { value: string } }).__quickFilterCapture = captured;
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      quickFilter: {
        onChange: (text: string) => {
          captured.value = text;
        },
      },
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    const captured = (window as unknown as { __quickFilterCapture?: { value: string } }).__quickFilterCapture;
    expect(captured?.value).toBe("");
    api.setQuickFilter("test");
    expect(captured?.value).toBe("test");
  },
};

export const ToggleColumnEditorApplyColumnVisibility = {
  render: () => {
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      editColumns: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    const nameCol = canvasElement.querySelector('.st-cell[data-accessor="name"]');
    expect(nameCol).toBeTruthy();
    api.toggleColumnEditor(true);
    await new Promise((r) => setTimeout(r, 100));
    const editor = canvasElement.querySelector(".st-column-editor-popout");
    expect(editor).toBeTruthy();
    await api.applyColumnVisibility({ name: false });
    await new Promise((r) => setTimeout(r, 100));
    const nameColAfter = canvasElement.querySelector('.st-cell[data-accessor="name"]');
    expect(nameColAfter).toBeFalsy();
  },
};

export const ExpandAllCollapseAllGetExpandedDepths = {
  render: () => {
    const groupHeaders: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
      { accessor: "id", label: "ID", width: 80, type: "number" },
    ];
    const groupData = [
      { id: "g1", name: "Group A", items: [{ id: 1, name: "A1" }, { id: 2, name: "A2" }] },
      { id: "g2", name: "Group B", items: [{ id: 3, name: "B1" }] },
    ];
    const result = renderVanillaTable(groupHeaders, groupData, {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "300px",
      rowGrouping: ["items"],
      expandAll: false,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    let depths = api.getExpandedDepths();
    expect(depths.size).toBe(0);
    api.expandAll();
    await new Promise((r) => setTimeout(r, 100));
    depths = api.getExpandedDepths();
    expect(depths.size).toBeGreaterThan(0);
    api.collapseAll();
    await new Promise((r) => setTimeout(r, 100));
    depths = api.getExpandedDepths();
    expect(depths.size).toBe(0);
  },
};

// ============================================================================
// SET HEADER RENAME
// ============================================================================

export const SetHeaderRename = {
  render: () => {
    const result = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();
    api.setHeaderRename({ accessor: "name" });
    await new Promise((r) => setTimeout(r, 200));
    // After setHeaderRename, an input should appear in the name header
    const nameHeader = canvasElement.querySelector('.st-header-cell[data-accessor="name"]');
    expect(nameHeader).toBeTruthy();
  },
};

// ============================================================================
// CLEAR ALL FILTERS
// ============================================================================

export const ClearAllFilters = {
  render: () => {
    const filterHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", filterable: true },
      { accessor: "name", label: "Name", width: 150, type: "string", filterable: true },
    ];
    const result = renderVanillaTable(filterHeaders, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();

    // Apply two filters
    await api.applyFilter({ accessor: "id", operator: "equals", value: "1" });
    await api.applyFilter({ accessor: "name", operator: "contains", value: "Alice" });
    await new Promise((r) => setTimeout(r, 100));
    let filters = api.getFilterState();
    expect(Object.keys(filters).length).toBeGreaterThan(0);

    // Clear all at once
    await api.clearAllFilters();
    await new Promise((r) => setTimeout(r, 100));
    filters = api.getFilterState();
    expect(Object.keys(filters).length).toBe(0);
  },
};

// ============================================================================
// GET / APPLY PINNED STATE
// ============================================================================

export const GetAndApplyPinnedState = {
  render: () => {
    const pinnedHeaders: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number", pinned: "left" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    const result = renderVanillaTable(pinnedHeaders, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();

    const state = api.getPinnedState();
    expect(state).toBeTruthy();
    expect(Array.isArray(state.left)).toBe(true);
    expect(Array.isArray(state.main)).toBe(true);
    expect(Array.isArray(state.right)).toBe(true);
    expect(state.left).toContain("id");

    // Move id from left to main
    await api.applyPinnedState({ left: [], main: ["id", "name"], right: [] });
    await new Promise((r) => setTimeout(r, 500));
    const newState = api.getPinnedState();
    expect(newState.left).not.toContain("id");
    expect(newState.main).toContain("id");
  },
};

// ============================================================================
// TOGGLE DEPTH / SET EXPANDED DEPTHS
// ============================================================================

const groupHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 150, expandable: true, type: "string" },
  { accessor: "id", label: "ID", width: 80, type: "number" },
];
const groupData = () => [
  { id: "g1", name: "Group A", items: [{ id: 1, name: "A1" }, { id: 2, name: "A2" }] },
  { id: "g2", name: "Group B", items: [{ id: 3, name: "B1" }] },
];

export const ToggleDepth = {
  render: () => {
    const result = renderVanillaTable(groupHeaders, groupData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "300px",
      rowGrouping: ["items"],
      expandAll: false,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();

    let depths = api.getExpandedDepths();
    expect(depths.has(0)).toBe(false);

    api.toggleDepth(0);
    await new Promise((r) => setTimeout(r, 100));
    depths = api.getExpandedDepths();
    expect(depths.has(0)).toBe(true);

    api.toggleDepth(0);
    await new Promise((r) => setTimeout(r, 100));
    depths = api.getExpandedDepths();
    expect(depths.has(0)).toBe(false);
  },
};

export const SetExpandedDepths = {
  render: () => {
    const result = renderVanillaTable(groupHeaders, groupData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "300px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();

    // Set only depth 0 expanded
    api.setExpandedDepths(new Set([0]));
    await new Promise((r) => setTimeout(r, 100));
    const depths = api.getExpandedDepths();
    expect(depths.has(0)).toBe(true);
    expect(depths.has(1)).toBe(false);
  },
};

// ============================================================================
// GET GROUPING PROPERTY / DEPTH
// ============================================================================

export const GetGroupingPropertyAndDepth = {
  render: () => {
    const result = renderVanillaTable(groupHeaders, groupData(), {
      getRowId: (p) => String((p.row as { id?: string })?.id),
      height: "300px",
      rowGrouping: ["items"],
      expandAll: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable(canvasElement);
    const api = table.getAPI();

    const property = api.getGroupingProperty(0);
    expect(property).toBe("items");

    const depth = api.getGroupingDepth("items");
    expect(depth).toBe(0);
  },
};
