/**
 * COLLAPSE / EXPAND ACCORDION ANIMATION TESTS
 *
 * Verifies the accordion-style animations on:
 *   - Nested column collapse / expand: incoming columns start at width 0 and
 *     CSS-transition to their final width while surviving columns FLIP-shift.
 *   - Row group collapse / expand: incoming rows start at height 0 and
 *     CSS-transition to rowHeight while surviving rows FLIP-shift.
 *
 * The mechanism reuses the existing FLIP `AnimationCoordinator` (no extra
 * config) and is gated by `animations.enabled`. This file exercises the
 * one-render window where:
 *   - Root has `.st-accordion-animating`.
 *   - Newly-visible cells carry inline `width: 0px` or `height: 0px`.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable, addParagraph } from "../utils";
import { waitForTable } from "./testUtils";

const meta: Meta = {
  title: "Tests/43 - Collapse/Expand Accordion Animations",
  tags: ["test", "animations", "collapse-expand"],
  parameters: {
    layout: "padded",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Accordion-style transitions on nested column and row group collapse/expand. Shares the existing animations config; honors prefers-reduced-motion via AnimationCoordinator.isEnabled().",
      },
    },
  },
};

export default meta;

const ACCORDION_CLASS = "st-accordion-animating";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const findColumnHeaderIcon = (
  canvasElement: HTMLElement,
  parentAccessor: string,
): HTMLElement | null => {
  const headerCell = canvasElement.querySelector(
    `.st-header-cell[data-accessor="${parentAccessor}"]`,
  );
  if (!headerCell) return null;
  return headerCell.querySelector(".st-expand-icon-container") as HTMLElement | null;
};

const findFirstBodyExpandIcon = (
  canvasElement: HTMLElement,
  rowIndex: number,
): HTMLElement | null => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return null;
  const rowCells = bodyContainer.querySelectorAll(
    `.st-cell[data-row-index="${rowIndex}"]`,
  );
  for (const cell of Array.from(rowCells)) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      return icon as HTMLElement;
    }
  }
  return null;
};

const getTableRoot = (canvasElement: HTMLElement): HTMLElement | null =>
  canvasElement.querySelector(".simple-table-root") as HTMLElement | null;

// ============================================================================
// COLUMN COLLAPSE / EXPAND ANIMATIONS
// ============================================================================

const SALES_DATA: Row[] = [
  { id: 1, name: "Alice", q1: 100, q2: 110, q3: 120, q4: 130, total: 460 },
  { id: 2, name: "Bob", q1: 90, q2: 95, q3: 100, q4: 105, total: 390 },
];

const buildCollapsibleColumnsHeaders = (): HeaderObject[] => [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: 120 },
  {
    accessor: "total",
    label: "Quarterly",
    width: 200,
    collapsible: true,
    singleRowChildren: true,
    children: [
      { accessor: "q1", label: "Q1", width: 80, showWhen: "parentExpanded" },
      { accessor: "q2", label: "Q2", width: 80, showWhen: "parentExpanded" },
      { accessor: "q3", label: "Q3", width: 80, showWhen: "parentExpanded" },
      { accessor: "q4", label: "Q4", width: 80, showWhen: "parentExpanded" },
    ],
  },
];

export const ColumnExpand_AddsAccordionClass = {
  tags: ["column", "expand", "css-window"],
  render: () => {
    const headers = buildCollapsibleColumnsHeaders();
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p: { row?: { id: unknown } }) => String(p.row?.id),
      height: "240px",
      animations: { enabled: true, duration: 200 },
    });
    h2.textContent = "Column expand: accordion class active during animation";
    addParagraph(
      wrapper,
      "Click chevron on Quarterly to collapse, then expand. The `.st-accordion-animating` class should appear on the table root for the animation window.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = getTableRoot(canvasElement);
    expect(root).toBeTruthy();

    // Collapse first so we can observe the expand path. Class should appear synchronously.
    const collapseIcon = findColumnHeaderIcon(canvasElement, "total");
    expect(collapseIcon).toBeTruthy();
    collapseIcon!.click();
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(true);

    // Wait past the animation window; class should be removed.
    await sleep(380);
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(false);

    // Expand: same lifecycle.
    const expandIcon = findColumnHeaderIcon(canvasElement, "total");
    expect(expandIcon).toBeTruthy();
    expandIcon!.click();
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(true);
    await sleep(380);
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(false);
  },
};

export const ColumnExpand_IncomingCellsStartAtZeroWidth = {
  tags: ["column", "expand", "size-grow"],
  render: () => {
    const headers = buildCollapsibleColumnsHeaders();
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p: { row?: { id: unknown } }) => String(p.row?.id),
      height: "240px",
      // Long duration so the test can sample post-animation as well.
      animations: { enabled: true, duration: 600 },
    });
    h2.textContent = "Column expand: incoming cells start at width 0";
    addParagraph(
      wrapper,
      "Right after expand, newly-visible Q1–Q4 columns are sized to 0 with the accordion-grow marker attribute, then transition to their final width.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Start collapsed.
    const collapseIcon = findColumnHeaderIcon(canvasElement, "total");
    expect(collapseIcon).toBeTruthy();
    collapseIcon!.click();
    await sleep(700);

    // Expand and read q1 width synchronously — at this point the cell exists
    // with the 0-width init; the 2× rAF that writes the final size hasn't
    // fired yet (rAFs are throttled until after the click microtask drains).
    const expandIcon = findColumnHeaderIcon(canvasElement, "total");
    expect(expandIcon).toBeTruthy();
    expandIcon!.click();

    const q1Header = canvasElement.querySelector(
      `.st-header-cell[data-accessor="q1"]`,
    ) as HTMLElement | null;
    expect(q1Header).toBeTruthy();
    // The accordion-grow marker proves the size transition path engaged.
    expect(q1Header!.dataset.stAccordionGrow).toBe("horizontal");
    expect(q1Header!.style.width).toBe("0px");

    // After the duration, width should be at its final value and the marker cleared.
    await sleep(900);
    const finalWidth = parseFloat(q1Header!.style.width || "0");
    expect(finalWidth).toBe(80);
    expect(q1Header!.dataset.stAccordionGrow).toBeUndefined();
  },
};

// ============================================================================
// ROW GROUP COLLAPSE / EXPAND ANIMATIONS
// ============================================================================

const GROUPED_DATA: Row[] = [
  {
    id: "dept-1",
    name: "Engineering",
    size: 5,
    members: [
      { id: "emp-1", name: "Alice", salary: 120000 },
      { id: "emp-2", name: "Bob", salary: 95000 },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    size: 3,
    members: [
      { id: "emp-3", name: "Charlie", salary: 110000 },
      { id: "emp-4", name: "Diana", salary: 100000 },
    ],
  },
];

const ROW_GROUPING_HEADERS: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 250, expandable: true },
  { accessor: "size", label: "Size", width: 100, type: "number" },
  { accessor: "salary", label: "Salary", width: 140, type: "number" },
];

export const RowExpand_AddsAccordionClass = {
  tags: ["row", "expand", "css-window"],
  render: () => {
    const { wrapper, h2 } = renderVanillaTable(ROW_GROUPING_HEADERS, GROUPED_DATA, {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id ?? ""),
      height: "320px",
      rowGrouping: ["members"],
      expandAll: false,
      animations: { enabled: true, duration: 200 },
    });
    h2.textContent = "Row group expand: accordion class active during animation";
    addParagraph(
      wrapper,
      "Click chevron on a department row. The `.st-accordion-animating` class should appear and then be removed after the duration.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = getTableRoot(canvasElement);
    expect(root).toBeTruthy();

    const expandIcon = findFirstBodyExpandIcon(canvasElement, 0);
    expect(expandIcon).toBeTruthy();
    expandIcon!.click();

    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(true);
    await sleep(380);
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(false);
  },
};

export const RowExpand_IncomingCellsStartAtZeroHeight = {
  tags: ["row", "expand", "size-grow"],
  render: () => {
    const { wrapper, h2 } = renderVanillaTable(ROW_GROUPING_HEADERS, GROUPED_DATA, {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id ?? ""),
      height: "320px",
      rowGrouping: ["members"],
      expandAll: false,
      // Long duration so the test can sample mid-animation.
      animations: { enabled: true, duration: 600 },
    });
    h2.textContent = "Row expand: incoming row cells start at height 0";
    addParagraph(
      wrapper,
      "Mid-animation, the just-revealed member cells should still have a partial height inline.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const bodyContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement | null;
    expect(bodyContainer).toBeTruthy();

    const cellsBefore = bodyContainer!.querySelectorAll(
      ".st-cell[data-row-index]",
    );
    const rowCountBefore = new Set(
      Array.from(cellsBefore).map((c) => c.getAttribute("data-row-index")),
    ).size;

    // Toggle expansion on the first department.
    const expandIcon = findFirstBodyExpandIcon(canvasElement, 0);
    expect(expandIcon).toBeTruthy();
    expandIcon!.click();

    // Sample synchronously: new cells exist with 0 height and the
    // accordion-grow marker, before any rAF has run to write the final size.
    const cellsMid = bodyContainer!.querySelectorAll(
      ".st-cell[data-row-index]",
    );
    const rowCountMid = new Set(
      Array.from(cellsMid).map((c) => c.getAttribute("data-row-index")),
    ).size;
    expect(rowCountMid).toBeGreaterThan(rowCountBefore);

    const growingCells = Array.from(
      bodyContainer!.querySelectorAll<HTMLElement>(
        '.st-cell[data-st-accordion-grow="vertical"]',
      ),
    );
    expect(growingCells.length).toBeGreaterThan(0);
    for (const c of growingCells) {
      expect(c.style.height).toBe("0px");
    }

    // After the duration, the marker should be cleared and heights non-zero.
    await sleep(900);
    for (const c of growingCells) {
      expect(c.dataset.stAccordionGrow).toBeUndefined();
      expect(parseFloat(c.style.height || "0")).toBeGreaterThan(0);
    }
  },
};

// ============================================================================
// DISABLED / REDUCED MOTION
// ============================================================================

export const Disabled_NoAccordionClass = {
  tags: ["disabled"],
  render: () => {
    const headers = buildCollapsibleColumnsHeaders();
    const { wrapper, h2 } = renderVanillaTable(headers, SALES_DATA, {
      getRowId: (p: { row?: { id: unknown } }) => String(p.row?.id),
      height: "240px",
      animations: { enabled: false },
    });
    h2.textContent = "animations.enabled: false → no accordion class";
    addParagraph(
      wrapper,
      "When animations are disabled, collapse/expand should not add the accordion class to the root. Cells reach their final state synchronously.",
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = getTableRoot(canvasElement);
    expect(root).toBeTruthy();
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(false);

    const collapseIcon = findColumnHeaderIcon(canvasElement, "total");
    expect(collapseIcon).toBeTruthy();
    collapseIcon!.click();
    expect(root!.classList.contains(ACCORDION_CLASS)).toBe(false);

    // Final state reached immediately.
    const q1Header = canvasElement.querySelector(
      `.st-header-cell[data-accessor="q1"]`,
    );
    expect(q1Header).toBeNull();
  },
};
