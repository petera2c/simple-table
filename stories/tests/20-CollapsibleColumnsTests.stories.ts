/**
 * COLLAPSIBLE COLUMNS TESTS
 * Tests for column group collapse/expand: singleRowChildren (one header row),
 * multi-row headers, collapseDefault, showWhen, and icon toggle.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import type { HeaderObject, Row } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph } from "../utils";

const meta: Meta = {
  title: "Tests/20 - Collapsible Columns",
  tags: ["test", "collapsible-columns"],
  parameters: {
    layout: "padded",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Tests for collapsible column groups: singleRowChildren (one header row), multi-row headers, collapseDefault, showWhen, and expand/collapse interaction.",
      },
    },
  },
};

export default meta;

// ============================================================================
// HELPERS
// ============================================================================

const getHeaderCells = (canvasElement: HTMLElement): HTMLElement[] => {
  const container = canvasElement.querySelector(
    ".st-header-main, .st-header-container",
  );
  if (!container) return [];
  return Array.from(container.querySelectorAll(".st-header-cell"));
};

/** Number of distinct header rows (by top position). */
const getHeaderRowCount = (canvasElement: HTMLElement): number => {
  const cells = getHeaderCells(canvasElement);
  const tops = new Set(
    cells.map(
      (c) =>
        c.style.top ||
        (c.getAttribute("style")?.match(/top:\s*([\d.]+px?)/)?.[1] ?? "0"),
    ),
  );
  return tops.size;
};

/** Number of leaf columns (body first row cell count). */
const getVisibleLeafColumnCount = (canvasElement: HTMLElement): number => {
  const body = canvasElement.querySelector(".st-body-main, .st-body-container");
  if (!body) return 0;
  const firstRowCells = body.querySelectorAll('.st-cell[data-row-index="0"]');
  return firstRowCells.length;
};

/** Find header collapse/expand icon by parent header accessor. */
const getHeaderCollapseIcon = (
  canvasElement: HTMLElement,
  parentAccessor: string,
): HTMLElement | null => {
  const headerCell = canvasElement.querySelector(
    `.st-header-cell[data-accessor="${parentAccessor}"]`,
  );
  if (!headerCell) return null;
  const icon = headerCell.querySelector(".st-expand-icon-container");
  return icon as HTMLElement | null;
};

const clickHeaderCollapseIcon = async (
  canvasElement: HTMLElement,
  parentAccessor: string,
): Promise<void> => {
  const icon = getHeaderCollapseIcon(canvasElement, parentAccessor);
  expect(icon).toBeTruthy();
  icon!.click();
  await new Promise((r) => setTimeout(r, 150));
};

const getHeaderLabelsInOrder = (canvasElement: HTMLElement): string[] => {
  const cells = getHeaderCells(canvasElement);
  return cells
    .map(
      (c) =>
        c.querySelector(".st-header-label-text")?.textContent?.trim() ?? "",
    )
    .filter(Boolean);
};

// ============================================================================
// TEST DATA
// ============================================================================

const SALES_DATA: Row[] = [
  {
    id: 1,
    name: "Alice",
    region: "North",
    q1Sales: 100,
    q2Sales: 110,
    q3Sales: 120,
    q4Sales: 130,
    totalSales: 460,
  },
  {
    id: 2,
    name: "Bob",
    region: "South",
    q1Sales: 90,
    q2Sales: 95,
    q3Sales: 100,
    q4Sales: 105,
    totalSales: 390,
  },
];

const currency = ({ value }: { value?: unknown }) =>
  `$${typeof value === "number" ? (value as number).toLocaleString() : value}`;

// ============================================================================
// WITH singleRowChildren (one header row for the group)
// ============================================================================

export const SingleRowChildren_HeaderIsOneRow = {
  tags: ["single-row-children", "header-layout"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly Sales",
        width: 200,
        collapsible: true,
        singleRowChildren: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q3Sales",
            label: "Q3",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q4Sales",
            label: "Q4",
            width: 80,
            valueFormatter: currency,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "singleRowChildren: header is one row";
    addParagraph(
      wrapper,
      "Quarterly Sales + Q1–Q4 should be on a single header row (not two).",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const rowCount = getHeaderRowCount(canvasElement);
    expect(rowCount).toBe(1);
    const colCount = getVisibleLeafColumnCount(canvasElement);
    expect(colCount).toBe(6); // ID + Quarterly Sales + Q1 + Q2 + Q3 + Q4 when expanded
  },
};

export const SingleRowChildren_CollapseHidesChildren = {
  tags: ["single-row-children", "collapse-expand"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly Sales",
        width: 200,
        collapsible: true,
        singleRowChildren: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q3Sales",
            label: "Q3",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q4Sales",
            label: "Q4",
            width: 80,
            valueFormatter: currency,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "singleRowChildren: collapse hides Q1–Q4";
    addParagraph(
      wrapper,
      "Click collapse on Quarterly Sales; only one column (total) should remain for that group.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(6);
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(2); // ID + Quarterly Sales (total)
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(6);
  },
};

export const SingleRowChildren_CollapseIconToggles = {
  tags: ["single-row-children", "icon-state"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly Sales",
        width: 200,
        collapsible: true,
        singleRowChildren: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "singleRowChildren: icon state toggles";
    addParagraph(
      wrapper,
      "Icon should be expanded then collapsed then expanded.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    let icon = getHeaderCollapseIcon(canvasElement, "totalSales");
    expect(icon).toBeTruthy();
    expect(icon!.classList.contains("expanded")).toBe(true);
    expect(icon!.classList.contains("collapsed")).toBe(false);
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    icon = getHeaderCollapseIcon(canvasElement, "totalSales");
    expect(icon!.classList.contains("collapsed")).toBe(true);
    expect(icon!.classList.contains("expanded")).toBe(false);
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    icon = getHeaderCollapseIcon(canvasElement, "totalSales");
    expect(icon!.classList.contains("expanded")).toBe(true);
  },
};

// ============================================================================
// WITHOUT singleRowChildren (multi-row header: parent row, then children row)
// ============================================================================

export const MultiRowHeader_TwoRows = {
  tags: ["multi-row-header", "header-layout"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly",
        width: 320,
        collapsible: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q3Sales",
            label: "Q3",
            width: 80,
            valueFormatter: currency,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q4Sales",
            label: "Q4",
            width: 80,
            valueFormatter: currency,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "Without singleRowChildren: header has two rows";
    addParagraph(wrapper, "Quarterly spans above; Q1–Q4 on the row below.");
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const rowCount = getHeaderRowCount(canvasElement);
    expect(rowCount).toBe(2);
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(5); // ID + Q1..Q4
  },
};

export const MultiRowHeader_CollapseShowsOneColumn = {
  tags: ["multi-row-header", "collapse-expand"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly",
        width: 320,
        collapsible: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q3Sales",
            label: "Q3",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q4Sales",
            label: "Q4",
            width: 80,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "Multi-row: collapse reduces to one column";
    addParagraph(
      wrapper,
      "Collapse Quarterly; only one column for that group.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(5);
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(2); // ID + totalSales (parent as leaf when collapsed)
  },
};

// ============================================================================
// collapseDefault
// ============================================================================

export const CollapseDefault_StartsCollapsed = {
  tags: ["collapse-default", "initial-state"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Quarterly Sales",
        width: 200,
        collapsible: true,
        collapseDefault: true,
        singleRowChildren: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q3Sales",
            label: "Q3",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q4Sales",
            label: "Q4",
            width: 80,
          },
        ],
      },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "collapseDefault: group starts collapsed";
    addParagraph(
      wrapper,
      "Quarterly Sales should start with one column; icon collapsed.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(2); // ID + totalSales
    const icon = getHeaderCollapseIcon(canvasElement, "totalSales");
    expect(icon).toBeTruthy();
    expect(icon!.classList.contains("collapsed")).toBe(true);
  },
};

// ============================================================================
// showWhen parentCollapsed (summary column when collapsed)
// ============================================================================

export const ShowWhenParentCollapsed_SummaryVisibleWhenCollapsed = {
  tags: ["show-when", "parent-collapsed"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "perfGroup",
        label: "Performance",
        width: 200,
        collapsible: true,
        children: [
          {
            accessor: "summary",
            label: "Summary",
            width: 120,
            showWhen: "parentCollapsed",
          },
          {
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
            showWhen: "parentExpanded",
          },
          {
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
            showWhen: "parentExpanded",
          },
        ],
      },
    ];
    const data: Row[] = [
      { id: 1, summary: "Good", q1Sales: 100, q2Sales: 110 },
      { id: 2, summary: "OK", q1Sales: 90, q2Sales: 95 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "showWhen parentCollapsed: summary when collapsed";
    addParagraph(wrapper, "Collapsed: Summary column. Expanded: Q1, Q2.");
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await clickHeaderCollapseIcon(canvasElement, "perfGroup");
    const labels = getHeaderLabelsInOrder(canvasElement);
    expect(labels).toContain("Summary");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(2); // ID + Summary when collapsed
    await clickHeaderCollapseIcon(canvasElement, "perfGroup");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(3); // ID + Q1 + Q2 when expanded (Summary hidden)
  },
};

// ============================================================================
// Multiple collapsible groups
// ============================================================================

export const MultipleCollapsibleGroups = {
  tags: ["multiple-groups", "collapse-expand"],
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "totalSales",
        label: "Sales",
        width: 200,
        collapsible: true,
        singleRowChildren: true,
        children: [
          {
            showWhen: "parentExpanded",
            accessor: "q1Sales",
            label: "Q1",
            width: 80,
          },
          {
            showWhen: "parentExpanded",
            accessor: "q2Sales",
            label: "Q2",
            width: 80,
          },
        ],
      },
      { accessor: "region", label: "Region", width: 100 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
    });
    h2.textContent = "Multiple groups and non-collapsible columns";
    addParagraph(
      wrapper,
      "ID and Region stay; Sales group collapses independently.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(5); // ID, Sales, Q1, Q2, Region
    await clickHeaderCollapseIcon(canvasElement, "totalSales");
    expect(getVisibleLeafColumnCount(canvasElement)).toBe(3); // ID, totalSales (one column), Region
    const labels = getHeaderLabelsInOrder(canvasElement);
    expect(labels).toContain("ID");
    expect(labels).toContain("Region");
  },
};
