/**
 * ARIA SEMANTICS TESTS
 *
 * These tests assert the ARIA state/relationship semantics that a non-native
 * (role="grid") table must apply by hand: selection state, expansion/treegrid
 * levels, grouped-header span, row headers, nested/state rows in the hierarchy,
 * header rowspan, and collapsible column-header expansion.
 */

import type { Meta } from "@storybook/html";
import { expect, fireEvent, userEvent } from "@storybook/test";
import { ColumnDef } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/45 - Aria Semantics",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Tests for ARIA state/relationship semantics (selection, expansion, grouped-header span, row headers) on the non-native grid.",
      },
    },
  },
};

export default meta;

// ============================================================================
// SHARED FEATURE-RICH TABLE
// Grouped (nested) headers + row selection + expandable grouped rows so a
// single render exercises every audited ARIA feature.
// ============================================================================

const createGroupedData = () => [
  {
    id: "dept-1",
    name: "Engineering",
    size: 11,
    teams: [
      { id: "team-1", name: "Frontend", role: "Team", salary: 0, size: 5 },
      { id: "team-2", name: "Backend", role: "Team", salary: 0, size: 6 },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    size: 4,
    teams: [{ id: "team-3", name: "Enterprise", role: "Team", salary: 0, size: 4 }],
  },
];

const auditHeaders = (): ColumnDef[] => [
  { accessor: "name", label: "Name", width: 240, expandable: true },
  {
    accessor: "info",
    label: "Info",
    width: 320,
    children: [
      { accessor: "role", label: "Role", width: 160 },
      { accessor: "salary", label: "Salary", width: 160, type: "number" },
    ],
  },
  { accessor: "size", label: "Size", width: 120, type: "number" },
];

const renderAuditTable = () =>
  renderVanillaTable(auditHeaders(), createGroupedData(), {
    height: "500px",
    enableRowSelection: true,
    rowGrouping: ["teams"],
    expandAll: true,
    getRowId: (p: { row: { id?: string } }) => String(p.row?.id),
  });

const getBody = (canvasElement: HTMLElement): HTMLElement => {
  const body = canvasElement.querySelector<HTMLElement>(".st-body-container");
  if (!body) throw new Error("Body container not found");
  return body;
};

const getGrid = (canvasElement: HTMLElement): HTMLElement => {
  const grid = canvasElement.querySelector<HTMLElement>('[role="grid"], [role="treegrid"]');
  if (!grid) throw new Error("Grid element not found");
  return grid;
};

const selectFirstRow = async (canvasElement: HTMLElement): Promise<void> => {
  const body = getBody(canvasElement);
  const selectionCell = body.querySelector<HTMLElement>('.st-selection-cell[data-row-index="0"]');
  if (!selectionCell) throw new Error("Selection cell for row 0 not found");
  const user = userEvent.setup();
  await user.hover(selectionCell);
  await new Promise((r) => setTimeout(r, 250));
  const checkbox = selectionCell.querySelector<HTMLInputElement>('input[type="checkbox"]');
  if (!checkbox) throw new Error("Row 0 checkbox not found");
  fireEvent.click(checkbox);
  await new Promise((r) => setTimeout(r, 400));
};

// ============================================================================
// TESTS — assert the applied ARIA semantics
// ============================================================================

export const SelectedRowsExposeAriaSelected = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await selectFirstRow(canvasElement);
    const body = getBody(canvasElement);
    const selectedCells = Array.from(
      body.querySelectorAll<HTMLElement>(".st-cell.st-cell-selected-row"),
    );
    expect(selectedCells.length).toBeGreaterThan(0);
    selectedCells.forEach((cell) => {
      expect(cell.getAttribute("aria-selected")).toBe("true");
    });
    const owningRow = selectedCells[0].closest('[role="row"]');
    expect(owningRow?.getAttribute("aria-selected")).toBe("true");
  },
};

export const GridExposesAriaMultiselectable = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const grid = getGrid(canvasElement);
    expect(grid.getAttribute("aria-multiselectable")).toBe("true");
  },
};

export const ExpandableRowsExposeAriaExpandedOnRow = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const body = getBody(canvasElement);
    const expandIcon = body.querySelector<HTMLElement>(".st-expand-icon-container");
    expect(expandIcon).toBeTruthy();
    const owningRow = expandIcon!.closest('[role="row"]');
    expect(owningRow).toBeTruthy();
    // For the grid/treegrid pattern aria-expanded belongs on the row, not just
    // on the chevron button.
    expect(owningRow!.hasAttribute("aria-expanded")).toBe(true);
  },
};

export const ExpandableGridExposesTreegridLevels = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const grid = getGrid(canvasElement);
    // A grid with expandable hierarchical rows should be a treegrid.
    expect(grid.getAttribute("role")).toBe("treegrid");
    const ariaRows = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('.st-body-container .st-aria-row[role="row"]'),
    );
    expect(ariaRows.length).toBeGreaterThan(0);
    ariaRows.forEach((row) => {
      expect(row.hasAttribute("aria-level")).toBe(true);
      expect(row.hasAttribute("aria-posinset")).toBe(true);
      expect(row.hasAttribute("aria-setsize")).toBe(true);
    });
  },
};

export const GroupedHeadersExposeAriaColspan = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const groupHeader = canvasElement.querySelector<HTMLElement>(
      '.st-header-cell[data-accessor="info"]',
    );
    expect(groupHeader).toBeTruthy();
    // "Info" spans its two leaf children (Role, Salary).
    expect(groupHeader!.getAttribute("aria-colspan")).toBe("2");
  },
};

export const IdentityColumnExposesRowHeader = {
  render: () => renderAuditTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const body = getBody(canvasElement);
    const nameCells = Array.from(
      body.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
    );
    expect(nameCells.length).toBeGreaterThan(0);
    nameCells.forEach((cell) => {
      expect(cell.getAttribute("role")).toBe("rowheader");
    });
  },
};

// ============================================================================
// ROUND 2 — #1 nested/state rows in hierarchy, #2 header rowspan, #3 collapsible
//           column-header aria-expanded.
// ============================================================================

// #1 — A row whose expandable column hosts a nested grid.
const renderNestedTableTable = () => {
  const headers: ColumnDef[] = [
    {
      accessor: "name",
      label: "Company",
      width: 240,
      expandable: true,
      nestedTable: {
        columns: [
          { accessor: "divisionName", label: "Division", width: 200 },
          { accessor: "headcount", label: "Headcount", width: 120, type: "number" },
        ],
      },
    },
    { accessor: "industry", label: "Industry", width: 160 },
  ];
  const data = [
    {
      id: "c-1",
      name: "Acme",
      industry: "Tech",
      divisions: [
        { id: "d-1", divisionName: "Alpha", headcount: 12 },
        { id: "d-2", divisionName: "Beta", headcount: 7 },
      ],
    },
  ];
  return renderVanillaTable(headers, data, {
    height: "500px",
    // Nested tables derive their child accessor from rowGrouping; without it
    // no nested grid row is injected on expand.
    rowGrouping: ["divisions"],
    getRowId: (p: { row: { id?: string } }) => String(p.row?.id),
  });
};

export const NestedTableRowsAreInRowHierarchy = {
  render: () => renderNestedTableTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const body = getBody(canvasElement);
    // Expand the first row so its nested grid renders.
    let nestedRow = canvasElement.querySelector<HTMLElement>(".st-nested-grid-row");
    if (!nestedRow) {
      const expandIcon = body.querySelector<HTMLElement>(".st-expand-icon-container");
      expect(expandIcon).toBeTruthy();
      await userEvent.setup().click(expandIcon!);
      await new Promise((r) => setTimeout(r, 600));
      nestedRow = canvasElement.querySelector<HTMLElement>(".st-nested-grid-row");
    }
    expect(nestedRow).toBeTruthy();
    // The full-width nested-grid wrapper must be a row containing a gridcell so
    // it isn't a disallowed (non-row) child of the rowgroup.
    expect(nestedRow!.getAttribute("role")).toBe("row");
    const hostCell = nestedRow!.querySelector<HTMLElement>(':scope > [role="gridcell"]');
    expect(hostCell).toBeTruthy();
  },
};

// #2 — A leaf column standing beside a grouped column spans every header row.
const renderNestedHeaderTable = () => {
  const headers: ColumnDef[] = [
    { accessor: "id", label: "ID", width: 80, type: "number" },
    {
      accessor: "group",
      label: "Group",
      width: 240,
      children: [
        { accessor: "a", label: "A", width: 120 },
        { accessor: "b", label: "B", width: 120 },
      ],
    },
  ];
  const data = [
    { id: 1, a: "A1", b: "B1" },
    { id: 2, a: "A2", b: "B2" },
  ];
  return renderVanillaTable(headers, data, {
    height: "300px",
    getRowId: (p: { row: { id?: number } }) => String(p.row?.id),
  });
};

export const LeafHeadersExposeRowSpan = {
  render: () => renderNestedHeaderTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const idHeader = canvasElement.querySelector<HTMLElement>(
      '.st-header-cell[data-accessor="id"]',
    );
    expect(idHeader).toBeTruthy();
    // "ID" sits beside a 2-level group, so it spans both header rows.
    expect(idHeader!.getAttribute("aria-rowspan")).toBe("2");
  },
};

// #3 — Collapsible column header exposes its expanded state on the cell.
const renderCollapsibleHeaderTable = () => {
  const headers: ColumnDef[] = [
    { accessor: "id", label: "ID", width: 80, type: "number" },
    {
      accessor: "group",
      label: "Group",
      width: 240,
      collapsible: true,
      children: [
        { accessor: "a", label: "A", width: 120 },
        { accessor: "b", label: "B", width: 120 },
      ],
    },
  ];
  const data = [
    { id: 1, a: "A1", b: "B1" },
    { id: 2, a: "A2", b: "B2" },
  ];
  return renderVanillaTable(headers, data, {
    height: "300px",
    getRowId: (p: { row: { id?: number } }) => String(p.row?.id),
  });
};

export const CollapsibleColumnHeaderExposesAriaExpanded = {
  render: () => renderCollapsibleHeaderTable().wrapper,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const groupHeader = canvasElement.querySelector<HTMLElement>(
      '.st-header-cell[data-accessor="group"]',
    );
    expect(groupHeader).toBeTruthy();
    // aria-expanded belongs on the columnheader itself (expanded by default).
    expect(groupHeader!.getAttribute("aria-expanded")).toBe("true");
  },
};
