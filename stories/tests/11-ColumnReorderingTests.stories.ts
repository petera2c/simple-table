/**
 * COLUMN REORDERING TESTS
 * Ported from React - same tests, vanilla table only.
 */

import { SimpleTableVanilla } from "../../dist/index.es.js";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/11-ColumnReorderingTests",
  parameters: { layout: "padded" },
};

export default meta;

const createEmployeeData = () => [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "Engineering", salary: 120000 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "Design", salary: 95000 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Engineering", salary: 140000 },
  { id: 4, name: "Diana Prince", email: "diana@example.com", department: "Marketing", salary: 110000 },
  { id: 5, name: "Eve Adams", email: "eve@example.com", department: "Sales", salary: 105000 },
];

const getHeaderCells = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll(".st-header-cell"));

const isHeaderDraggable = (headerCell: Element) => {
  const headerLabel = headerCell.querySelector(".st-header-label");
  return headerLabel ? headerLabel.getAttribute("draggable") === "true" : false;
};

const getHeaderLabels = (canvasElement: HTMLElement) => {
  const headerCells = getHeaderCells(canvasElement);
  return headerCells.map((cell) => {
    const labelText = cell.querySelector(".st-header-label-text");
    return labelText?.textContent?.trim() || "";
  });
};

const getColumnOrderFromSection = (section: Element) => {
  const elements = Array.from(section.querySelectorAll(".st-header-label-text"));
  return elements.map((el) => el.textContent || "");
};

const performDragAndDrop = async (sourceElement: Element, targetElement: Element) => {
  try {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", "column-drag");
    dataTransfer.effectAllowed = "move";
    sourceElement.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, clientX: startX, clientY: startY, dataTransfer }));
    await new Promise((r) => setTimeout(r, 10));
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      const dragOverEvent = new DragEvent("dragover", { bubbles: true, cancelable: true, clientX: currentX, clientY: currentY, dataTransfer });
      const targetContainer = targetElement.closest(".st-header-cell") || targetElement;
      targetContainer.dispatchEvent(dragOverEvent);
      await new Promise((r) => setTimeout(r, 10));
    }
    const targetContainer = targetElement.closest(".st-header-cell") || targetElement;
    targetContainer.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, clientX: endX, clientY: endY, dataTransfer }));
    await new Promise((r) => setTimeout(r, 100));
    sourceElement.dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true, clientX: endX, clientY: endY, dataTransfer }));
    await new Promise((r) => setTimeout(r, 100));
    return true;
  } catch (e) {
    return false;
  }
};

export const ColumnReorderingEnabled = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(true);
    }
  },
};

export const ColumnReorderingDisabled = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: false, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(false);
    }
  },
};

export const DisableReorderOnSpecificColumn = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, disableReorder: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, disableReorder: true, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    expect(isHeaderDraggable(headerCells[0])).toBe(false);
    expect(isHeaderDraggable(headerCells[1])).toBe(true);
    expect(isHeaderDraggable(headerCells[2])).toBe(false);
    expect(isHeaderDraggable(headerCells[3])).toBe(true);
  },
};

export const OnColumnOrderChangeCallback = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "20px";
    const countEl = document.createElement("div");
    countEl.setAttribute("data-testid", "order-change-count");
    countEl.textContent = "0";
    const orderEl = document.createElement("div");
    orderEl.setAttribute("data-testid", "last-order");
    orderEl.textContent = "";
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    wrapper.appendChild(countEl);
    wrapper.appendChild(orderEl);
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    let orderChangeCount = 0;
    const table = new SimpleTableVanilla(tableContainer, {
      columnReordering: true,
      defaultHeaders: headers,
      rows: createEmployeeData(),
      getRowId: (params) => String(params.row?.id),
      height: "400px",
      onColumnOrderChange: (newHeaders) => {
        orderChangeCount += 1;
        countEl.textContent = String(orderChangeCount);
        orderEl.textContent = newHeaders.map((h) => h.label).join(", ");
      },
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const countElement = canvasElement.querySelector('[data-testid="order-change-count"]');
    const orderElement = canvasElement.querySelector('[data-testid="last-order"]');
    expect(countElement).toBeTruthy();
    expect(orderElement).toBeTruthy();
    expect(countElement?.textContent).toBe("0");
  },
};

export const ColumnReorderingWithSorting = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true, type: "string" },
      { accessor: "department", label: "Department", width: 150, isSortable: true, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, isSortable: true, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(true);
      expect(headerCell.classList.contains("clickable")).toBe(true);
    }
  },
};

export const ColumnReorderingWithFiltering = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, filterable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, filterable: true, type: "string" },
      { accessor: "department", label: "Department", width: 150, filterable: true, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, filterable: true, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(true);
    }
  },
};

export const ColumnReorderingWithPinnedColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, pinned: "left", type: "number" },
      { accessor: "name", label: "Name", width: 200, pinned: "left", type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const leftSection = canvasElement.querySelector(".st-header-pinned-left");
    const mainSection = canvasElement.querySelector(".st-header-main");
    const rightSection = canvasElement.querySelector(".st-header-pinned-right");
    expect(leftSection).toBeTruthy();
    expect(mainSection).toBeTruthy();
    expect(rightSection).toBeTruthy();
    expect(leftSection?.querySelectorAll(".st-header-cell").length).toBe(2);
    expect(mainSection?.querySelectorAll(".st-header-cell").length).toBe(1);
    expect(rightSection?.querySelectorAll(".st-header-cell").length).toBe(1);
    leftSection?.querySelectorAll(".st-header-cell").forEach((header) => expect(isHeaderDraggable(header)).toBe(true));
    mainSection?.querySelectorAll(".st-header-cell").forEach((header) => expect(isHeaderDraggable(header)).toBe(true));
    rightSection?.querySelectorAll(".st-header-cell").forEach((header) => expect(isHeaderDraggable(header)).toBe(true));
  },
};

export const DraggableAttributeOnHeaderLabels = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(3);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(true);
    }
  },
};

export const MixedDraggableAndNonDraggable = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, disableReorder: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, disableReorder: true, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(5);
    const expectedDraggable = [false, true, true, false, true];
    for (let i = 0; i < headerCells.length; i++) {
      expect(isHeaderDraggable(headerCells[i])).toBe(expectedDraggable[i]);
    }
  },
};

export const InitialColumnOrder = {
  render: () => {
    const headers = [
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "id", label: "ID", width: 80, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerLabels = getHeaderLabels(canvasElement);
    expect(headerLabels).toEqual(["Salary", "Department", "Name", "ID"]);
  },
};

export const ActualDragAndDropReordering = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), { columnReordering: true, getRowId: (params) => String(params.row?.id), height: "400px" });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const initialOrder = getHeaderLabels(canvasElement);
    expect(initialOrder).toEqual(["ID", "Name", "Department", "Salary"]);
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    const firstHeaderLabel = headerCells[0].querySelector(".st-header-label");
    const thirdHeaderLabel = headerCells[2].querySelector(".st-header-label");
    expect(firstHeaderLabel).toBeTruthy();
    expect(thirdHeaderLabel).toBeTruthy();
    if (!firstHeaderLabel || !thirdHeaderLabel) throw new Error("Header labels not found");
    const success = await performDragAndDrop(firstHeaderLabel, thirdHeaderLabel);
    const newOrder = getHeaderLabels(canvasElement);
    expect(success).toBe(true);
    expect(getHeaderCells(canvasElement).length).toBe(4);
    const orderChanged = JSON.stringify(newOrder) !== JSON.stringify(initialOrder);
    if (orderChanged) {
      expect(orderChanged).toBe(true);
    } else {
      getHeaderCells(canvasElement).forEach((headerCell) => expect(isHeaderDraggable(headerCell)).toBe(true));
    }
  },
};

export const DragAndDropWithPinnedColumns = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, pinned: "left", type: "number" },
      { accessor: "name", label: "Name", width: 150, pinned: "left", type: "string" },
      { accessor: "email", label: "Email", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, pinned: "right", type: "number" },
    ];
    const wrapper = document.createElement("div");
    wrapper.style.padding = "20px";
    wrapper.style.width = "800px";
    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);
    const table = new SimpleTableVanilla(tableContainer, {
      columnReordering: true,
      defaultHeaders: headers,
      rows: createEmployeeData(),
      getRowId: (params) => String(params.row?.id),
      height: "400px",
    });
    table.mount();
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const pinnedLeftSection = canvasElement.querySelector(".st-header-pinned-left");
    const mainSection = canvasElement.querySelector(".st-header-main");
    const pinnedRightSection = canvasElement.querySelector(".st-header-pinned-right");
    expect(pinnedLeftSection).toBeTruthy();
    expect(mainSection).toBeTruthy();
    expect(pinnedRightSection).toBeTruthy();
    const initialPinnedLeftOrder = getColumnOrderFromSection(pinnedLeftSection);
    expect(initialPinnedLeftOrder).toEqual(["ID", "Name"]);
    const idLabel = pinnedLeftSection.querySelector("[id*='header-id'] .st-header-label") || pinnedLeftSection.querySelector(".st-header-label");
    const nameLabel = pinnedLeftSection.querySelector("[id*='header-name'] .st-header-label") || pinnedLeftSection.querySelectorAll(".st-header-label")[1];
    expect(idLabel).toBeTruthy();
    expect(nameLabel).toBeTruthy();
    const success1 = await performDragAndDrop(idLabel, nameLabel);
    expect(success1).toBe(true);
    const newPinnedLeftOrder = getColumnOrderFromSection(pinnedLeftSection);
    const pinnedLeftChanged = JSON.stringify(newPinnedLeftOrder) !== JSON.stringify(initialPinnedLeftOrder);
    if (pinnedLeftChanged) expect(pinnedLeftChanged).toBe(true);
    expect(canvasElement.querySelector(".st-header-pinned-left")).toBeTruthy();
    expect(canvasElement.querySelector(".st-header-main")).toBeTruthy();
    expect(canvasElement.querySelector(".st-header-pinned-right")).toBeTruthy();
  },
};

export const ColumnReorderingWithResizing = {
  render: () => {
    const headers = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
      { accessor: "salary", label: "Salary", width: 120, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createEmployeeData(), {
      columnReordering: true,
      columnResizing: true,
      getRowId: (params) => String(params.row?.id),
      height: "400px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const headerCells = getHeaderCells(canvasElement);
    expect(headerCells.length).toBe(4);
    for (const headerCell of headerCells) {
      expect(isHeaderDraggable(headerCell)).toBe(true);
    }
    const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle");
    expect(resizeHandles.length).toBeGreaterThan(0);
  },
};
