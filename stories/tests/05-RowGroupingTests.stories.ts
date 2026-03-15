/**
 * ROW GROUPING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import {
  renderVanillaTable,
  addParagraph,
  type RenderVanillaTableResult,
} from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/05 - Row Grouping",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for row grouping including hierarchical data, expansion control, dynamic loading, and programmatic API.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

const createGroupedData = () => [
  {
    id: "dept-1",
    name: "Engineering",
    budget: 500000,
    teams: [
      {
        id: "team-1",
        name: "Frontend Team",
        size: 5,
        members: [
          {
            id: "emp-1",
            name: "Alice Johnson",
            role: "Senior Engineer",
            salary: 120000,
          },
          { id: "emp-2", name: "Bob Smith", role: "Engineer", salary: 95000 },
        ],
      },
      {
        id: "team-2",
        name: "Backend Team",
        size: 6,
        members: [
          {
            id: "emp-3",
            name: "Charlie Brown",
            role: "Tech Lead",
            salary: 140000,
          },
          {
            id: "emp-4",
            name: "Diana Prince",
            role: "Engineer",
            salary: 100000,
          },
        ],
      },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    budget: 300000,
    teams: [
      {
        id: "team-3",
        name: "Enterprise Sales",
        size: 4,
        members: [
          {
            id: "emp-5",
            name: "Eve Adams",
            role: "Sales Manager",
            salary: 110000,
          },
          {
            id: "emp-6",
            name: "Frank Miller",
            role: "Sales Rep",
            salary: 85000,
          },
        ],
      },
    ],
  },
  {
    id: "dept-3",
    name: "Marketing",
    budget: 250000,
    teams: [
      {
        id: "team-4",
        name: "Digital Marketing",
        size: 3,
        members: [
          {
            id: "emp-7",
            name: "Grace Lee",
            role: "Marketing Manager",
            salary: 105000,
          },
        ],
      },
    ],
  },
];

// ============================================================================
// TEST UTILITIES
// ============================================================================

const getVisibleRowCount = (canvasElement: HTMLElement) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const cells = bodyContainer.querySelectorAll(".st-cell[data-row-id]");
  const uniqueRowIds = new Set(
    Array.from(cells).map((c) => c.getAttribute("data-row-id")),
  );
  return uniqueRowIds.size;
};

const findExpandIconInRow = (rowCells: Element[]) => {
  for (const cell of rowCells) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") return icon;
  }
  return null;
};

const clickExpandIcon = async (
  canvasElement: HTMLElement,
  rowIndex: number,
) => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) throw new Error("Body container not found");
  const rowCells = bodyContainer.querySelectorAll(
    `.st-cell[data-row-index="${rowIndex}"]`,
  );
  if (rowCells.length === 0)
    throw new Error(`No cells found for row index ${rowIndex}`);
  const expandIcon = findExpandIconInRow(Array.from(rowCells));
  if (!expandIcon) throw new Error(`Expand icon not found in row ${rowIndex}`);
  const user = userEvent.setup();
  await user.click(expandIcon);
  await new Promise((r) => setTimeout(r, 500));
};

const getRowDepth = (rowCells: Element[]) => {
  const firstCell = rowCells[0];
  if (!firstCell) return 0;
  const depthAttr = firstCell.getAttribute("data-depth");
  if (depthAttr) return parseInt(depthAttr, 10);
  const classes = firstCell.className.split(" ");
  for (const cls of classes) {
    if (cls.startsWith("st-cell-depth-")) {
      const depth = parseInt(cls.replace("st-cell-depth-", ""), 10);
      if (!isNaN(depth)) return depth;
    }
  }
  return 0;
};

// ============================================================================
// STORIES
// ============================================================================

export const BasicSingleLevelGrouping = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: true,
    });
    h2.textContent = "Basic Single-Level Row Grouping";
    addParagraph(wrapper, "Departments → Teams (single level hierarchy)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBeGreaterThan(3);
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const expandIcons = bodyContainer.querySelectorAll(
      ".st-expand-icon-container",
    );
    expect(expandIcons.length).toBeGreaterThan(0);
  },
};

export const MultiLevelGrouping = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
      { accessor: "role", label: "Role", width: 150 },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "500px",
      rowGrouping: ["teams", "members"],
      expandAll: true,
    });
    h2.textContent = "Multi-Level Row Grouping";
    addParagraph(wrapper, "Departments → Teams → Members (three levels)");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBeGreaterThan(6);
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
    const rowMap = new Map<string, Element[]>();
    cells.forEach((cell) => {
      const rowIndex = cell.getAttribute("data-row-index");
      if (rowIndex) {
        if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
        rowMap.get(rowIndex)!.push(cell);
      }
    });
    const depths = Array.from(rowMap.values()).map((rowCells) =>
      getRowDepth(rowCells),
    );
    const uniqueDepths = Array.from(new Set(depths)).sort((a, b) => a - b);
    expect(uniqueDepths.length).toBeGreaterThanOrEqual(2);
    expect(uniqueDepths.includes(0)).toBe(true);
    const maxDepth = Math.max(...depths);
    expect(maxDepth).toBeGreaterThan(0);
    const allSeparators = bodyContainer.querySelectorAll(".st-row-separator");
    const lastGroupSeparators = bodyContainer.querySelectorAll(
      ".st-row-separator.st-last-group-row",
    );
    expect(allSeparators.length).toBeGreaterThan(0);
    const depth0Count = depths.filter((d) => d === 0).length;
    expect(lastGroupSeparators.length).toBeGreaterThanOrEqual(depth0Count - 1);
    expect(lastGroupSeparators.length).toBeLessThanOrEqual(depth0Count);
  },
};

export const StartCollapsed = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: false,
    });
    h2.textContent = "Start Collapsed (expandAll=false)";
    addParagraph(wrapper, "All groups start collapsed - click to expand");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBe(3);
    await clickExpandIcon(canvasElement, 0);
    const expandedRowCount = getVisibleRowCount(canvasElement);
    expect(expandedRowCount).toBeGreaterThan(3);
  },
};

export const ExpandCollapseInteraction = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: true,
    });
    h2.textContent = "Expand/Collapse Interaction";
    addParagraph(wrapper, "Click expand icons to show/hide child rows");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialRowCount = getVisibleRowCount(canvasElement);
    expect(initialRowCount).toBeGreaterThan(3);
    await clickExpandIcon(canvasElement, 0);
    const collapsedRowCount = getVisibleRowCount(canvasElement);
    expect(collapsedRowCount).toBeLessThan(initialRowCount);
    await clickExpandIcon(canvasElement, 0);
    const reExpandedRowCount = getVisibleRowCount(canvasElement);
    expect(reExpandedRowCount).toBe(initialRowCount);
  },
};

export const ProgrammaticExpandCollapseAll = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Programmatic Expand/Collapse All";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    const expandBtn = document.createElement("button");
    expandBtn.textContent = "Expand All";
    expandBtn.style.padding = "0.5rem 1rem";
    expandBtn.style.backgroundColor = "#4CAF50";
    expandBtn.style.color = "white";
    expandBtn.style.border = "none";
    expandBtn.style.borderRadius = "4px";
    expandBtn.style.cursor = "pointer";
    const collapseBtn = document.createElement("button");
    collapseBtn.textContent = "Collapse All";
    collapseBtn.style.padding = "0.5rem 1rem";
    collapseBtn.style.backgroundColor = "#f44336";
    collapseBtn.style.color = "white";
    collapseBtn.style.border = "none";
    collapseBtn.style.borderRadius = "4px";
    collapseBtn.style.cursor = "pointer";
    btnContainer.appendChild(expandBtn);
    btnContainer.appendChild(collapseBtn);
    wrapper.appendChild(btnContainer);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createGroupedData(),
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: false,
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    expandBtn.onclick = () => table.getAPI().expandAll();
    collapseBtn.onclick = () => table.getAPI().collapseAll();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    const expandBtn = canvasElement.querySelector("button");
    await user.click(expandBtn);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(3);
    const expandedCount = rowCount;
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    await user.click(expandBtn);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(expandedCount);
  },
};

export const ProgrammaticDepthControl = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Programmatic Depth Control";
    wrapper.appendChild(h2);
    const btnContainer = document.createElement("div");
    btnContainer.style.marginBottom = "1rem";
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "0.5rem";
    btnContainer.style.flexWrap = "wrap";
    const expandDepth0Btn = document.createElement("button");
    expandDepth0Btn.textContent = "Expand Depth 0";
    expandDepth0Btn.style.padding = "0.5rem 1rem";
    expandDepth0Btn.style.backgroundColor = "#2196F3";
    expandDepth0Btn.style.color = "white";
    expandDepth0Btn.style.border = "none";
    expandDepth0Btn.style.borderRadius = "4px";
    expandDepth0Btn.style.cursor = "pointer";
    const expandDepth1Btn = document.createElement("button");
    expandDepth1Btn.textContent = "Expand Depth 1";
    expandDepth1Btn.style.padding = "0.5rem 1rem";
    expandDepth1Btn.style.backgroundColor = "#4CAF50";
    expandDepth1Btn.style.color = "white";
    expandDepth1Btn.style.border = "none";
    expandDepth1Btn.style.borderRadius = "4px";
    expandDepth1Btn.style.cursor = "pointer";
    const collapseDepth0Btn = document.createElement("button");
    collapseDepth0Btn.textContent = "Collapse Depth 0";
    collapseDepth0Btn.style.padding = "0.5rem 1rem";
    collapseDepth0Btn.style.backgroundColor = "#f44336";
    collapseDepth0Btn.style.color = "white";
    collapseDepth0Btn.style.border = "none";
    collapseDepth0Btn.style.borderRadius = "4px";
    collapseDepth0Btn.style.cursor = "pointer";
    btnContainer.appendChild(expandDepth0Btn);
    btnContainer.appendChild(expandDepth1Btn);
    btnContainer.appendChild(collapseDepth0Btn);
    wrapper.appendChild(btnContainer);
    const stateDiv = document.createElement("div");
    stateDiv.style.padding = "0.5rem";
    stateDiv.style.backgroundColor = "#f5f5f5";
    stateDiv.style.borderRadius = "4px";
    stateDiv.style.marginBottom = "1rem";
    stateDiv.style.fontFamily = "monospace";
    stateDiv.style.fontSize = "0.9rem";
    stateDiv.textContent = "Expanded Depths: []";
    wrapper.appendChild(stateDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
      { accessor: "role", label: "Role", width: 150 },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createGroupedData(),
      height: "400px",
      rowGrouping: ["teams", "members"],
      expandAll: false,
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    const updateState = () => {
      const depths = table.getAPI().getExpandedDepths();
      stateDiv.textContent = `Expanded Depths: ${JSON.stringify(Array.from(depths))}`;
    };
    expandDepth0Btn.onclick = () => {
      table.getAPI().expandDepth(0);
      updateState();
    };
    expandDepth1Btn.onclick = () => {
      table.getAPI().expandDepth(1);
      updateState();
    };
    collapseDepth0Btn.onclick = () => {
      table.getAPI().collapseDepth(0);
      updateState();
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    const buttons = canvasElement.querySelectorAll("button");
    await user.click(buttons[0]);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(3);
    const depthOneCount = rowCount;
    await user.click(buttons[1]);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(depthOneCount);
    await user.click(buttons[2]);
    await new Promise((r) => setTimeout(r, 500));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
  },
};

export const OnRowGroupExpandCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "onRowGroupExpand Callback";
    wrapper.appendChild(h2);
    const eventsDiv = document.createElement("div");
    eventsDiv.style.padding = "1rem";
    eventsDiv.style.backgroundColor = "#f0f0f0";
    eventsDiv.style.borderRadius = "4px";
    eventsDiv.style.marginBottom = "1rem";
    eventsDiv.style.maxHeight = "100px";
    eventsDiv.style.overflow = "auto";
    const strong = document.createElement("strong");
    strong.textContent = "Expand Events:";
    eventsDiv.appendChild(strong);
    const ul = document.createElement("ul");
    ul.style.marginTop = "0.5rem";
    ul.style.fontSize = "0.85rem";
    eventsDiv.appendChild(ul);
    wrapper.appendChild(eventsDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createGroupedData(),
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: false,
      onRowGroupExpand: ({ row, depth, groupingKey, isExpanded }) => {
        const rowName = row.name;
        const event = `${isExpanded ? "Expanded" : "Collapsed"} "${rowName}" at depth ${depth} (${groupingKey})`;
        const li = document.createElement("li");
        li.textContent = event;
        ul.appendChild(li);
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    await clickExpandIcon(canvasElement, 0);
    const eventList = canvasElement.querySelector("ul");
    expect(eventList).toBeTruthy();
    expect(eventList?.textContent).toContain("Expanded");
  },
};

export const DynamicRowLoading = {
  render: () => {
    let rows = [
      { id: "dept-1", name: "Engineering", budget: 500000 },
      { id: "dept-2", name: "Sales", budget: 300000 },
      { id: "dept-3", name: "Marketing", budget: 250000 },
    ];
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Dynamic Row Loading";
    wrapper.appendChild(h2);
    addParagraph(
      wrapper,
      "Child rows loaded on-demand when parent is expanded",
    );
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows,
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: false,
      getRowId: ({ row }) => String(row.id),
      onRowGroupExpand: async ({
        row,
        groupingKey,
        isExpanded,
        setLoading,
        rowIndexPath,
      }) => {
        if (!isExpanded) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        const deptId = row.id;
        let teams: { id: string; name: string; size: number }[] = [];
        if (deptId === "dept-1") {
          teams = [
            { id: "team-1", name: "Frontend Team", size: 5 },
            { id: "team-2", name: "Backend Team", size: 6 },
          ];
        } else if (deptId === "dept-2") {
          teams = [{ id: "team-3", name: "Enterprise Sales", size: 4 }];
        } else if (deptId === "dept-3") {
          teams = [{ id: "team-4", name: "Digital Marketing", size: 3 }];
        }
        setLoading(false);
        const rowIndex = rowIndexPath[0];
        const key = groupingKey;
        if (typeof rowIndex === "number" && key) {
          const newRows = [...rows];
          const targetRow = newRows[rowIndex];
          if (targetRow) targetRow[key] = teams;
          rows = newRows;
          table.update({ rows: newRows });
        }
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    await clickExpandIcon(canvasElement, 0);
    await new Promise((r) => setTimeout(r, 1000));
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(3);
  },
};

export const CanExpandRowGroupConditional = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: false,
      canExpandRowGroup: (row) => row.budget > 300000,
    });
    h2.textContent = "Conditional Row Expansion";
    addParagraph(
      wrapper,
      "Only departments with budget > 300000 can be expanded",
    );
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const firstRowCells = bodyContainer.querySelectorAll(
      '.st-cell[data-row-index="0"]',
    );
    if (firstRowCells.length === 0)
      throw new Error("First row cells not found");
    const firstRowIcon = findExpandIconInRow(Array.from(firstRowCells));
    expect(firstRowIcon).toBeTruthy();
    const secondRowCells = bodyContainer.querySelectorAll(
      '.st-cell[data-row-index="1"]',
    );
    const secondRowIcon = findExpandIconInRow(Array.from(secondRowCells));
    expect(secondRowIcon).toBeFalsy();
  },
};

export const RowGroupingWithGetRowId = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: true,
      getRowId: ({ row }) => String(row.id),
    });
    h2.textContent = "Row Grouping with getRowId";
    addParagraph(wrapper, "Stable row identification for grouped data");
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(3);
    await clickExpandIcon(canvasElement, 0);
    const collapsedCount = getVisibleRowCount(canvasElement);
    expect(collapsedCount).toBeLessThan(rowCount);
  },
};

export const EnableStickyParents = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
      { accessor: "role", label: "Role", width: 150 },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams", "members"],
      expandAll: true,
      enableStickyParents: true,
    });
    h2.textContent = "Sticky Parent Rows (Beta)";
    addParagraph(
      wrapper,
      "Parent rows stick to top while scrolling through children",
    );
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBeGreaterThan(3);
  },
};

export const GetGroupingPropertyAndDepth = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    const h2 = document.createElement("h2");
    h2.style.marginBottom = "1rem";
    h2.textContent = "Get Grouping Property & Depth API";
    wrapper.appendChild(h2);
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "Check Grouping Info";
    checkBtn.style.padding = "0.5rem 1rem";
    checkBtn.style.backgroundColor = "#2196F3";
    checkBtn.style.color = "white";
    checkBtn.style.border = "none";
    checkBtn.style.borderRadius = "4px";
    checkBtn.style.cursor = "pointer";
    checkBtn.style.marginBottom = "1rem";
    wrapper.appendChild(checkBtn);
    const infoDiv = document.createElement("div");
    infoDiv.style.padding = "0.5rem";
    infoDiv.style.backgroundColor = "#f5f5f5";
    infoDiv.style.borderRadius = "4px";
    infoDiv.style.marginBottom = "1rem";
    infoDiv.style.fontFamily = "monospace";
    infoDiv.style.fontSize = "0.85rem";
    infoDiv.textContent = "Not checked";
    wrapper.appendChild(infoDiv);
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Size", width: 100, type: "number" },
    ];
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createGroupedData(),
      height: "400px",
      rowGrouping: ["teams", "members"],
      expandAll: true,
    });
    table.mount();
    (wrapper as RenderVanillaTableResult["wrapper"])._table = table;
    checkBtn.onclick = () => {
      const prop0 = table.getAPI().getGroupingProperty(0);
      const prop1 = table.getAPI().getGroupingProperty(1);
      const depth0 = table.getAPI().getGroupingDepth("teams");
      const depth1 = table.getAPI().getGroupingDepth("members");
      infoDiv.textContent = `Depth 0: ${prop0}, Depth 1: ${prop1} | "teams" is depth ${depth0}, "members" is depth ${depth1}`;
    };
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const user = userEvent.setup();
    const button = canvasElement.querySelector("button");
    await user.click(button);
    await new Promise((r) => setTimeout(r, 300));
    const infoDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(infoDisplay?.textContent).toContain("teams");
    expect(infoDisplay?.textContent).toContain("members");
  },
};

/**
 * Get the expand icon container for the first row that has one.
 */
const getFirstExpandIcon = (canvasElement: HTMLElement): HTMLElement | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;
  const rowIndices = Array.from(
    new Set(
      Array.from(bodyContainer.querySelectorAll(".st-cell[data-row-index]"))
        .map((c) => c.getAttribute("data-row-index"))
        .filter((id): id is string => id != null),
    ),
  ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  for (const rowIndex of rowIndices) {
    const rowCells = bodyContainer.querySelectorAll(
      `.st-cell[data-row-index="${rowIndex}"]`,
    );
    const icon = findExpandIconInRow(Array.from(rowCells));
    if (icon) return icon as HTMLElement;
  }
  return null;
};

export const ExpandIconPositionAndAnimation = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "400px",
      rowGrouping: ["teams"],
      expandAll: true,
    });
    h2.textContent = "Expand icon position and animation";
    addParagraph(
      wrapper,
      "Expand icon must point down when expanded, right when collapsed, and animate between states.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    let icon = getFirstExpandIcon(canvasElement);
    expect(icon).toBeTruthy();
    expect(icon!.classList.contains("expanded")).toBe(true);
    expect(icon!.classList.contains("collapsed")).toBe(false);
    const transition = getComputedStyle(icon!).transition;
    expect(transition).toMatch(/transform/);

    // Animation requires the same DOM node to have its class toggled (not replaced)
    const iconBeforeCollapse = icon!;
    await clickExpandIcon(canvasElement, 0);
    icon = getFirstExpandIcon(canvasElement);
    expect(icon).toBeTruthy();
    expect(icon!.classList.contains("collapsed")).toBe(true);
    expect(icon!.classList.contains("expanded")).toBe(false);
    expect(icon).toBe(iconBeforeCollapse);

    const iconBeforeExpand = icon!;
    await clickExpandIcon(canvasElement, 0);
    icon = getFirstExpandIcon(canvasElement);
    expect(icon).toBeTruthy();
    expect(icon!.classList.contains("expanded")).toBe(true);
    expect(icon!.classList.contains("collapsed")).toBe(false);
    expect(icon).toBe(iconBeforeExpand);
  },
};

export const LastGroupRowSeparatorLogic = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "budget", label: "Budget", width: 150, type: "number" },
      { accessor: "size", label: "Team Size", width: 120, type: "number" },
    ];
    const { wrapper, h2 } = renderVanillaTable(headers, createGroupedData(), {
      height: "500px",
      rowGrouping: ["teams", "members"],
      expandAll: true,
    });
    h2.textContent = "Last Group Row Separator Logic";
    addParagraph(
      wrapper,
      "Verifies that st-last-group-row class is only applied to separators after depth 0 rows",
    );
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");
    const allSeparators = bodyContainer.querySelectorAll(".st-row-separator");
    const lastGroupSeparators = bodyContainer.querySelectorAll(
      ".st-row-separator.st-last-group-row",
    );
    expect(allSeparators.length).toBeGreaterThan(0);
    const cells = bodyContainer.querySelectorAll(".st-cell[data-row-index]");
    const rowMap = new Map<string, Element[]>();
    cells.forEach((cell) => {
      const rowIndex = cell.getAttribute("data-row-index");
      if (rowIndex) {
        if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
        rowMap.get(rowIndex)!.push(cell);
      }
    });
    const rows = Array.from(rowMap.values());
    const depth0RowCount = rows.filter(
      (rowCells) => getRowDepth(rowCells) === 0,
    ).length;
    expect(depth0RowCount).toBeGreaterThan(0);
    expect(lastGroupSeparators.length).toBeGreaterThanOrEqual(
      depth0RowCount - 1,
    );
    expect(lastGroupSeparators.length).toBeLessThanOrEqual(depth0RowCount);
    lastGroupSeparators.forEach((separator) => {
      const previousElement = separator.previousElementSibling;
      if (previousElement && previousElement.classList.contains("st-cell")) {
        const rowIndex = previousElement.getAttribute("data-row-index");
        if (rowIndex) {
          const rowCells = bodyContainer.querySelectorAll(
            `.st-cell[data-row-index="${rowIndex}"]`,
          );
          const depth = getRowDepth(Array.from(rowCells));
          expect(depth).toBeGreaterThan(0);
        }
      }
    });
    const regularSeparators = (Array.from(allSeparators) as Element[]).filter(
      (sep) => !sep.classList.contains("st-last-group-row"),
    );
    expect(regularSeparators.length).toBeGreaterThan(0);
  },
};
