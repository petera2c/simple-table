/**
 * Complex Nested Headers Clipboard Tests
 *
 * This file tests clipboard copy/paste with a realistic multi-group nested header
 * structure modelled after the CollapsibleColumnsExample and CSVExportSingleRowChildrenExample.
 *
 * ─── COLUMN INDEX ALIGNMENT ANALYSIS ───────────────────────────────────────────
 *
 * The clipboard utilities (cellClipboardUtils.ts) build a `colIndexToAccessor` map
 * by iterating `flattenedLeafHeaders` with 0-based indices. The cell keys stored in
 * `selectedCells` use `colIndex` values from `calculateColumnIndices`.
 *
 * For NORMAL nested headers, parent and first child SHARE a colIndex:
 *   calculateColumnIndices: parent=N, firstChild=N  (isFirst=true)
 *   findLeafHeaders:        parent excluded, firstChild at position N in leaf array
 *   → colIndexToAccessor[N] = firstChild.accessor  ✓  CORRECT
 *
 * For SINGLE ROW CHILDREN, parent gets its OWN colIndex and each child increments:
 *   calculateColumnIndices: parent=N, child1=N+1, child2=N+2  (childIsFirst=false)
 *   findLeafHeaders:        parent INCLUDED at position N, child1 at N+1, child2 at N+2
 *   → colIndexToAccessor[N]   = parent.accessor  ✓  CORRECT
 *   → colIndexToAccessor[N+1] = child1.accessor  ✓  CORRECT
 *   → colIndexToAccessor[N+2] = child2.accessor  ✓  CORRECT
 *
 * This alignment is achieved by including the singleRowChildren parent in findLeafHeaders.
 *
 * ─── TABLE STRUCTURE ────────────────────────────────────────────────────────────
 *
 *  Col  Header          Accessor          Type
 *  ───  ──────────────  ────────────────  ──────
 *   0   ID              id                number (leaf)
 *   1   Sales Rep       name              string (leaf, editable)
 *   2   Region          region            string (leaf)
 *   ─   [Quarterly]     quarterlyData     PARENT (not rendered, shares colIdx w/ q1Sales)
 *   3   Q1              q1Sales           number (leaf, editable, formatted, parentExpanded)
 *   4   Q2              q2Sales           number (leaf, editable, formatted, parentExpanded)
 *   5   Q3              q3Sales           number (leaf, editable, formatted, parentExpanded)
 *   6   Q4              q4Sales           number (leaf, editable, formatted, parentExpanded)
 *   3*  Total           totalSales        number (leaf, parentCollapsed)
 *   ─   [Product Cat.]  productCategories PARENT (not rendered, shares colIdx w/ softwareSales)
 *   7   Software        softwareSales     number (leaf, formatted)
 *   8   Hardware        hardwareSales     number (leaf, formatted)
 *   9   Services        servicesSales     number (leaf, formatted)
 *   7*  Top Category    topCategory       string (leaf, parentCollapsed)
 *   ─   [Performance]   latest.score      singleRowChildren PARENT (colIdx 10, OWN column)
 *  10*  Score           latest.score      number (singleRowChildren parent CELL)
 *  11   7d Change       weekly_diff.score number (singleRowChildren child, colIdx 11 BUT leafIdx 10)
 *  12   30d Change      monthly_diff.sc.  number (singleRowChildren child, colIdx 12 BUT leafIdx 11)
 *
 *  * = alternate index in collapsed / singleRowChildren state
 *
 *  The colIndex→accessor mapping in EXPANDED state (no collapses):
 *    0→id  1→name  2→region  3→q1Sales  4→q2Sales  5→q3Sales  6→q4Sales
 *    7→softwareSales  8→hardwareSales  9→servicesSales
 *    10→latest.score (singleRowChildren parent)
 *    11→weekly_diff.score  12→monthly_diff.score
 */

import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { SimpleTable, Row } from "../..";
import { HeaderObject } from "../..";

// ============================================================================
// DATA
// ============================================================================

interface SalesRow extends Record<string, any> {
  id: number;
  name: string;
  region: string;
  // Quarterly breakdown (expanded) / summary (collapsed)
  q1Sales: number;
  q2Sales: number;
  q3Sales: number;
  q4Sales: number;
  totalSales: number;
  // Category breakdown (expanded) / summary (collapsed)
  softwareSales: number;
  hardwareSales: number;
  servicesSales: number;
  topCategory: string;
  // singleRowChildren performance group
  latest: { score: number };
  weekly_diff: { score: number };
  monthly_diff: { score: number };
}

/**
 * Returns a fresh deep copy of the sales data for each story render.
 * The table mutates row objects directly via setNestedValue(), so every
 * story must receive its own copy to prevent inter-story data contamination.
 */
const makeSalesData = (): SalesRow[] => [
  {
    id: 1,
    name: "Alice Thompson",
    region: "North America",
    q1Sales: 245000,
    q2Sales: 289000,
    q3Sales: 312000,
    q4Sales: 298000,
    totalSales: 1144000,
    softwareSales: 456000,
    hardwareSales: 342000,
    servicesSales: 346000,
    topCategory: "Software",
    latest: { score: 92 },
    weekly_diff: { score: 5 },
    monthly_diff: { score: 12 },
  },
  {
    id: 2,
    name: "Marcus Chen",
    region: "Asia Pacific",
    q1Sales: 189000,
    q2Sales: 234000,
    q3Sales: 287000,
    q4Sales: 276000,
    totalSales: 986000,
    softwareSales: 398000,
    hardwareSales: 298000,
    servicesSales: 290000,
    topCategory: "Software",
    latest: { score: 85 },
    weekly_diff: { score: -2 },
    monthly_diff: { score: 8 },
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    region: "Europe",
    q1Sales: 198000,
    q2Sales: 245000,
    q3Sales: 267000,
    q4Sales: 289000,
    totalSales: 999000,
    softwareSales: 389000,
    hardwareSales: 312000,
    servicesSales: 298000,
    topCategory: "Hardware",
    latest: { score: 78 },
    weekly_diff: { score: 3 },
    monthly_diff: { score: -5 },
  },
  {
    id: 4,
    name: "David Kim",
    region: "Asia Pacific",
    q1Sales: 167000,
    q2Sales: 198000,
    q3Sales: 234000,
    q4Sales: 267000,
    totalSales: 866000,
    softwareSales: 346000,
    hardwareSales: 267000,
    servicesSales: 253000,
    topCategory: "Services",
    latest: { score: 88 },
    weekly_diff: { score: 7 },
    monthly_diff: { score: 15 },
  },
];

// ─── HEADER DEFINITIONS ───────────────────────────────────────────────────────

const usdFormatter = ({ value }: { value: any }) =>
  value != null && value !== "" ? `$${(value as number).toLocaleString()}` : "";

/**
 * Normal nested headers (no singleRowChildren).
 * colIndex alignment is correct for all columns.
 */
const NORMAL_NESTED_HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Sales Rep", width: 180, type: "string", isEditable: true },
  { accessor: "region", label: "Region", width: 140, type: "string" },
  {
    accessor: "quarterlyData",
    label: "Quarterly Sales",
    width: 420,
    collapsible: true,
    isEditable: true,
    children: [
      {
        accessor: "q1Sales",
        label: "Q1",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q2Sales",
        label: "Q2",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q3Sales",
        label: "Q3",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q4Sales",
        label: "Q4",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "totalSales",
        label: "Total",
        width: 120,
        type: "number",
        showWhen: "parentCollapsed",
        valueFormatter: usdFormatter,
        isEditable: true,
      },
    ],
  },
  {
    accessor: "productCategories",
    label: "Product Categories",
    width: 420,
    collapsible: true,
    children: [
      {
        accessor: "softwareSales",
        label: "Software",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "hardwareSales",
        label: "Hardware",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "servicesSales",
        label: "Services",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "topCategory",
        label: "Top Category",
        width: 130,
        type: "string",
        showWhen: "parentCollapsed",
      },
    ],
  },
];

/**
 * Full table with singleRowChildren performance group appended at the end.
 * Normal columns (id → servicesSales) are unaffected by the singleRowChildren bug.
 * Only the performance group (latest.score, weekly_diff.score, monthly_diff.score) is misaligned.
 */
const HEADERS_WITH_SINGLE_ROW_CHILDREN: HeaderObject[] = [
  ...NORMAL_NESTED_HEADERS,
  {
    accessor: "latest.score",
    label: "Performance",
    width: 120,
    type: "number",
    singleRowChildren: true,
    collapsible: true,
    children: [
      {
        accessor: "weekly_diff.score",
        label: "7d Change",
        width: 110,
        type: "number",
        showWhen: "parentExpanded",
      },
      {
        accessor: "monthly_diff.score",
        label: "30d Change",
        width: 110,
        type: "number",
        showWhen: "parentExpanded",
      },
    ],
  },
];

// ─── COLLAPSED-STATE HEADER VARIANTS ─────────────────────────────────────────

const makeCollapsedQuarterlyHeaders = (): HeaderObject[] =>
  NORMAL_NESTED_HEADERS.map((h) =>
    h.accessor === "quarterlyData" ? { ...h, collapseDefault: true } : h,
  );

const makeBothGroupsCollapsedHeaders = (): HeaderObject[] =>
  NORMAL_NESTED_HEADERS.map((h) =>
    h.accessor === "quarterlyData" || h.accessor === "productCategories"
      ? { ...h, collapseDefault: true }
      : h,
  );

// ─── MODULE-LEVEL CAPTURE ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let capturedEditCalls: any[] = [];
let clipboardStorage = "";

// ─── SHARED TEST UTILITIES ───────────────────────────────────────────────────

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (document.querySelector(".simple-table-root")) {
      await new Promise((r) => setTimeout(r, 200));
      return;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Table did not render within timeout");
};

const mockClipboard = () => {
  clipboardStorage = "";
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: async (text: string) => {
        clipboardStorage = text;
      },
      readText: async () => clipboardStorage,
    },
    writable: true,
    configurable: true,
  });
  return {
    get: () => clipboardStorage,
    set: (text: string) => {
      clipboardStorage = text;
    },
  };
};

const getCellByIndex = (canvas: HTMLElement, row: number, col: number) =>
  canvas.querySelector(`[data-row-index="${row}"][data-col-index="${col}"]`) as HTMLElement | null;

const getCellContent = (cell: HTMLElement) =>
  cell.querySelector(".st-cell-content")?.textContent?.trim() ?? "";

const clickCell = async (canvas: HTMLElement, row: number, col: number) => {
  const cell = getCellByIndex(canvas, row, col);
  if (!cell) throw new Error(`Cell not found at row=${row} col=${col}`);
  cell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  cell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 150));
};

const selectRange = async (canvas: HTMLElement, r0: number, c0: number, r1: number, c1: number) => {
  const startCell = getCellByIndex(canvas, r0, c0);
  const endCell = getCellByIndex(canvas, r1, c1);
  if (!startCell) throw new Error(`Start cell not found at row=${r0} col=${c0}`);
  if (!endCell) throw new Error(`End cell not found at row=${r1} col=${c1}`);

  startCell.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 10));

  for (let row = Math.min(r0, r1); row <= Math.max(r0, r1); row++) {
    for (let col = Math.min(c0, c1); col <= Math.max(c0, c1); col++) {
      const cell = getCellByIndex(canvas, row, col);
      if (cell)
        cell.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
      await new Promise((r) => setTimeout(r, 5));
    }
  }

  endCell.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 200));
};

const clearSelection = async () => {
  document.body.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }),
  );
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 100));
};

const pressCtrlC = () =>
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "c", ctrlKey: true, bubbles: true, cancelable: true }),
  );

const pressCtrlV = () =>
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "v", ctrlKey: true, bubbles: true, cancelable: true }),
  );

const pressDelete = () =>
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Delete", bubbles: true, cancelable: true }),
  );

const hasCopyFlash = (cell: HTMLElement) =>
  cell.classList.contains("st-cell-copy-flash") ||
  cell.classList.contains("st-cell-copy-flash-first");

const hasWarningFlash = (cell: HTMLElement) =>
  cell.classList.contains("st-cell-warning-flash") ||
  cell.classList.contains("st-cell-warning-flash-first");

const waitForUpdate = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const waitForPaste = () => new Promise((r) => setTimeout(r, 300));

// ============================================================================
// META
// ============================================================================

const meta: Meta<typeof SimpleTable> = {
  title: "Tests/21 - Complex Nested Headers Clipboard",
  component: SimpleTable,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
  tags: ["clipboard-complex"],
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// ============================================================================
// SECTION A: NORMAL NESTED HEADERS — CORRECT CLIPBOARD BEHAVIOR
//
// With normal nested headers the parent and its first child share the same
// colIndex. Since only leaf cells appear in the grid (parent is not rendered),
// every cell's colIndex maps exactly to its position in flattenedLeafHeaders.
//
// EXPANDED state column layout:
//   col 0: id          col 1: name         col 2: region
//   col 3: q1Sales     col 4: q2Sales      col 5: q3Sales     col 6: q4Sales
//   col 7: softwareSales  col 8: hardwareSales  col 9: servicesSales
// ============================================================================

/**
 * Test A1: Copy a single leaf cell that lives under a collapsible nested parent.
 *
 * q2Sales is at colIndex=4. flattenedLeafHeaders[4] = q2Sales → accessor="q2Sales".
 * Clipboard should contain Alice's Q2 value: 289000.
 * The valueFormatter ($289,000) auto-applies because useFormattedValueForClipboard
 * defaults to true when a valueFormatter is present.
 */
export const CopyLeafFromExpandedQuarterlyGroup: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={NORMAL_NESTED_HEADERS}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();

    // Col 4 = q2Sales (second child of quarterlyData, expanded)
    await clickCell(canvasElement, 0, 4);

    const cell = getCellByIndex(canvasElement, 0, 4);
    expect(cell).toBeTruthy();
    expect(getCellContent(cell!)).toBe("$289,000"); // Display uses formatter

    pressCtrlC();
    await waitForUpdate();

    // Clipboard: valueFormatter auto-applied (useFormattedValueForClipboard not explicitly disabled)
    expect(clipboard.get()).toBe("$289,000");
    expect(hasCopyFlash(cell!)).toBe(true);
  },
};

/**
 * Test A2: Copy raw value when useFormattedValueForClipboard is explicitly false.
 * Verifies that opting out of clipboard formatting gives the raw number.
 */
export const CopyRawValueFromLeaf_FormatterDisabled: Story = {
  tags: ["test"],
  render: () => {
    // Same as NORMAL_NESTED_HEADERS but q1Sales has useFormattedValueForClipboard=false
    const headers: HeaderObject[] = NORMAL_NESTED_HEADERS.map((h) => {
      if (h.accessor !== "quarterlyData") return h;
      return {
        ...h,
        children: h.children?.map((child) =>
          child.accessor === "q1Sales" ? { ...child, useFormattedValueForClipboard: false } : child,
        ),
      };
    });
    return (
      <SimpleTable
        defaultHeaders={headers}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Col 3 = q1Sales (first child, shares colIdx with parent quarterlyData)
    await clickCell(canvasElement, 0, 3);
    pressCtrlC();
    await waitForUpdate();

    // Raw value despite valueFormatter being present
    expect(clipboard.get()).toBe("245000");
  },
};

/**
 * Test A3: Copy a 2×7 range that spans both the quarterly group AND the product
 * categories group. Verifies TSV is built in correct column order across groups.
 *
 * Selected cells:
 *   Row 0: q1Sales($245K), q2Sales($289K), q3Sales($312K), q4Sales($298K),
 *           softwareSales($456K), hardwareSales($342K), servicesSales($346K)
 *   Row 1: 189K, 234K, 287K, 276K, 398K, 298K, 290K
 *
 * Expected TSV (with formatter applied):
 *   "$245,000\t$289,000\t$312,000\t$298,000\t$456,000\t$342,000\t$346,000\n
 *    $189,000\t$234,000\t$287,000\t$276,000\t$398,000\t$298,000\t$290,000"
 */
export const CopyTSVAcrossMultipleNestedGroups: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={NORMAL_NESTED_HEADERS}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Cols 3–9: q1Sales, q2Sales, q3Sales, q4Sales, softwareSales, hardwareSales, servicesSales
    // Rows 0–1: Alice and Marcus
    await selectRange(canvasElement, 0, 3, 1, 9);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2);

    const row0 = lines[0].split("\t");
    const row1 = lines[1].split("\t");
    expect(row0).toHaveLength(7);
    expect(row1).toHaveLength(7);

    // Quarterly group — formatted values
    expect(row0[0]).toBe("$245,000"); // q1Sales Alice
    expect(row0[1]).toBe("$289,000"); // q2Sales Alice
    expect(row0[2]).toBe("$312,000"); // q3Sales Alice
    expect(row0[3]).toBe("$298,000"); // q4Sales Alice
    // Category group — formatted values
    expect(row0[4]).toBe("$456,000"); // softwareSales Alice
    expect(row0[5]).toBe("$342,000"); // hardwareSales Alice
    expect(row0[6]).toBe("$346,000"); // servicesSales Alice

    expect(row1[0]).toBe("$189,000"); // q1Sales Marcus
    expect(row1[4]).toBe("$398,000"); // softwareSales Marcus
  },
};

/**
 * Test A4: copyHeadersToClipboard produces ONLY leaf labels, never group-level
 * header labels.
 *
 * When copying from q1Sales(col3) through servicesSales(col9):
 *   Parent labels: "Quarterly Sales", "Product Categories" — MUST NOT appear
 *   Leaf labels:   "Q1", "Q2", "Q3", "Q4", "Software", "Hardware", "Services" — must appear
 */
export const CopyLeafHeaderLabelsOnly_GroupLabelsExcluded: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={NORMAL_NESTED_HEADERS}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
      copyHeadersToClipboard
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select id through servicesSales across all columns for row 0
    await selectRange(canvasElement, 0, 0, 0, 9);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2); // header row + 1 data row

    const headerRow = lines[0];
    expect(headerRow).toBe("ID\tSales Rep\tRegion\tQ1\tQ2\tQ3\tQ4\tSoftware\tHardware\tServices");

    // Parent group labels must NOT appear in the header row
    expect(headerRow.includes("Quarterly Sales")).toBe(false);
    expect(headerRow.includes("Product Categories")).toBe(false);

    // Data row: formatted values
    const dataRow = lines[1].split("\t");
    expect(dataRow[0]).toBe("1"); // id
    expect(dataRow[1]).toBe("Alice Thompson"); // name
    expect(dataRow[2]).toBe("North America"); // region
    expect(dataRow[3]).toBe("$245,000"); // q1Sales formatted
  },
};

/**
 * Test A5: Collapsing the quarterly group changes which leaf columns are visible.
 *
 * COLLAPSED state layout:
 *   col 0: id   col 1: name   col 2: region
 *   col 3: totalSales     ← replaces Q1–Q4 (showWhen="parentCollapsed")
 *   col 4: softwareSales  col 5: hardwareSales  col 6: servicesSales
 *
 * findLeafHeaders (collapsed): [id, name, region, totalSales, softwareSales, hardwareSales, servicesSales]
 * calculateColumnIndices (collapsed):
 *   id=0, name=1, region=2, quarterlyData=3(parent), totalSales=3(isFirst=true, shares)
 *   productCategories=4(parent), softwareSales=4(isFirst=true, shares), hardwareSales=5, servicesSales=6
 *
 * → colIndexToAccessor: 3→"totalSales", 4→"softwareSales", 5→"hardwareSales", 6→"servicesSales"
 * All correct ✓
 */
export const CopyFromCollapsedQuarterlyGroup: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={makeCollapsedQuarterlyHeaders()}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();

    // Col 3 = totalSales (visible because quarterly group is collapsed)
    const totalSalesCell = getCellByIndex(canvasElement, 0, 3);
    expect(totalSalesCell).toBeTruthy();
    expect(getCellContent(totalSalesCell!)).toBe("$1,144,000"); // Alice's total

    await clickCell(canvasElement, 0, 3);
    pressCtrlC();
    await waitForUpdate();

    // Should copy totalSales ($1,144,000), not q1Sales
    expect(clipboard.get()).toBe("$1,144,000");

    // Category group still at correct indices (softwareSales now at col 4)
    await clearSelection();
    const softwareCell = getCellByIndex(canvasElement, 0, 4);
    expect(softwareCell).toBeTruthy();
    expect(getCellContent(softwareCell!)).toBe("$456,000");

    await clickCell(canvasElement, 0, 4);
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$456,000");
  },
};

/**
 * Test A6: Both collapsible groups collapsed simultaneously.
 *
 * BOTH COLLAPSED state layout:
 *   col 0: id   col 1: name   col 2: region
 *   col 3: totalSales    (parentCollapsed from quarterly group)
 *   col 4: topCategory   (parentCollapsed from product categories group)
 *
 * calculateColumnIndices:
 *   id=0, name=1, region=2
 *   quarterlyData=3(parent), totalSales=3(isFirst, shares)
 *   productCategories=4(parent), topCategory=4(isFirst, shares)
 *
 * → colIndexToAccessor: 3→"totalSales", 4→"topCategory"  ✓
 */
export const CopyFromBothGroupsCollapsed: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={makeBothGroupsCollapsedHeaders()}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
      copyHeadersToClipboard
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select all 5 visible columns for row 0 (id, name, region, totalSales, topCategory)
    await selectRange(canvasElement, 0, 0, 0, 4);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2); // header + data

    // Header row with both collapsed-state leaf labels
    expect(lines[0]).toBe("ID\tSales Rep\tRegion\tTotal\tTop Category");
    // Expanded leaf labels should NOT appear
    expect(lines[0].includes("Q1")).toBe(false);
    expect(lines[0].includes("Software")).toBe(false);

    // Data row
    const data = lines[1].split("\t");
    expect(data[0]).toBe("1"); // id
    expect(data[1]).toBe("Alice Thompson"); // name
    expect(data[2]).toBe("North America"); // region
    expect(data[3]).toBe("$1,144,000"); // totalSales (formatted)
    expect(data[4]).toBe("Software"); // topCategory
  },
};

/**
 * Test A7: Paste a TSV into the quarterly editable leaf columns (Q1–Q4) for row 0.
 *
 * Paste string: "300000\t350000\t400000\t450000"
 * Anchor at q1Sales (col 3, row 0).
 *
 * Expected: onCellEdit called 4 times:
 *   { accessor: "q1Sales", newValue: 300000, rowIndex: 0 }
 *   { accessor: "q2Sales", newValue: 350000, rowIndex: 0 }
 *   { accessor: "q3Sales", newValue: 400000, rowIndex: 0 }
 *   { accessor: "q4Sales", newValue: 450000, rowIndex: 0 }
 *
 * This confirms paste correctly identifies each leaf column through the nested header.
 */
export const PasteIntoEditableQuarterlyLeafColumns: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    return (
      <SimpleTable
        defaultHeaders={NORMAL_NESTED_HEADERS}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    clipboard.set("300000\t350000\t400000\t450000");

    await clearSelection();
    // Anchor at q1Sales (col 3, row 0)
    await clickCell(canvasElement, 0, 3);
    pressCtrlV();
    await waitForPaste();

    expect(capturedEditCalls.length).toBe(4);

    const byAccessor = (a: string) => capturedEditCalls.find((c) => c.accessor === a);

    const q1 = byAccessor("q1Sales");
    expect(q1).toBeTruthy();
    expect(q1!.newValue).toBe(300000);
    expect(q1!.rowIndex).toBe(0);

    const q2 = byAccessor("q2Sales");
    expect(q2!.newValue).toBe(350000);

    const q3 = byAccessor("q3Sales");
    expect(q3!.newValue).toBe(400000);

    const q4 = byAccessor("q4Sales");
    expect(q4!.newValue).toBe(450000);
  },
};

/**
 * Test A8: Paste a multi-row TSV into quarterly columns, updating multiple rows.
 * Anchor at q1Sales (col 3, row 0). Paste 3 rows × 4 quarterly columns.
 */
export const PasteMultiRowAcrossQuarterlyGroup: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    return (
      <SimpleTable
        defaultHeaders={NORMAL_NESTED_HEADERS}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    // 3 rows × 4 quarterly columns
    clipboard.set("100\t200\t300\t400\n500\t600\t700\t800\n900\t1000\t1100\t1200");

    await clearSelection();
    await clickCell(canvasElement, 0, 3); // anchor at q1Sales row 0
    pressCtrlV();
    await waitForPaste();

    // 3 rows × 4 cols = 12 edits
    expect(capturedEditCalls.length).toBe(12);

    // Verify first row updates
    const row0_q1 = capturedEditCalls.find((c) => c.rowIndex === 0 && c.accessor === "q1Sales");
    expect(row0_q1!.newValue).toBe(100);

    const row0_q4 = capturedEditCalls.find((c) => c.rowIndex === 0 && c.accessor === "q4Sales");
    expect(row0_q4!.newValue).toBe(400);

    // Verify second row updates
    const row1_q1 = capturedEditCalls.find((c) => c.rowIndex === 1 && c.accessor === "q1Sales");
    expect(row1_q1!.newValue).toBe(500);

    // Verify third row updates
    const row2_q4 = capturedEditCalls.find((c) => c.rowIndex === 2 && c.accessor === "q4Sales");
    expect(row2_q4!.newValue).toBe(1200);
  },
};

/**
 * Test A9: Paste spanning the boundary between quarterly (editable) and
 * product category (non-editable) groups.
 *
 * Anchor at q4Sales (col 6, row 0). Paste 5 values that spill into softwareSales(7),
 * hardwareSales(8), servicesSales(9) which have no isEditable set.
 *
 * Expected:
 *   - q4Sales updated (editable)
 *   - softwareSales, hardwareSales, servicesSales: warning flash, no edit
 */
export const PasteSpanningEditableAndNonEditableBoundary: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    return (
      <SimpleTable
        defaultHeaders={NORMAL_NESTED_HEADERS}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();
    // 4 values: q4Sales (editable) + 3 category cols (not editable)
    clipboard.set("999\t111\t222\t333");

    await clearSelection();
    // Anchor at q4Sales (col 6, row 0)
    await clickCell(canvasElement, 0, 6);
    pressCtrlV();
    await waitForPaste();

    // Only q4Sales updated (the only editable target in the range)
    expect(capturedEditCalls.length).toBe(1);
    expect(capturedEditCalls[0].accessor).toBe("q4Sales");
    expect(capturedEditCalls[0].newValue).toBe(999);

    // Category cells should show warning flash
    const softwareCell = getCellByIndex(canvasElement, 0, 7);
    expect(hasWarningFlash(softwareCell!)).toBe(true);
  },
};

/**
 * Test A10: Delete on a quarterly leaf column clears its value and triggers the
 * onCellEdit callback with an empty number value (null for type="number").
 */
export const DeleteQuarterlyLeafColumn: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    return (
      <SimpleTable
        defaultHeaders={NORMAL_NESTED_HEADERS}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    await clearSelection();
    // Select all 4 quarterly cells for row 0 (q1–q4, cols 3–6)
    await selectRange(canvasElement, 0, 3, 0, 6);
    pressDelete();
    await waitForUpdate();

    // 4 deletes, each with newValue=null (type="number")
    expect(capturedEditCalls.length).toBe(4);
    const accessors = capturedEditCalls.map((c) => c.accessor).sort();
    expect(accessors).toEqual(["q1Sales", "q2Sales", "q3Sales", "q4Sales"].sort());
    capturedEditCalls.forEach((c) => expect(c.newValue).toBeNull());

    // Flash should appear on the deleted cells
    for (let col = 3; col <= 6; col++) {
      const cell = getCellByIndex(canvasElement, 0, col);
      expect(hasCopyFlash(cell!)).toBe(true);
    }
  },
};

/**
 * Test A11: Copy → Paste round trip within the quarterly group.
 * Copy Q1–Q4 from Alice (row 0), paste into Marcus (row 1).
 * Both rows must have matching values after the round trip.
 */
export const CopyPasteRoundTripAcrossRows: Story = {
  tags: ["test"],
  render: () => {
    capturedEditCalls = [];
    return (
      <SimpleTable
        defaultHeaders={NORMAL_NESTED_HEADERS}
        rows={makeSalesData() as Row[]}
        getRowId={({ row }) => String(row.id)}
        height="500px"
        selectableCells
        onCellEdit={(p) => capturedEditCalls.push(p)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // Step 1: Copy Alice's quarterly data (row 0, cols 3–6)
    await clearSelection();
    await selectRange(canvasElement, 0, 3, 0, 6);
    pressCtrlC();
    await waitForUpdate();

    const copiedText = clipboard.get();
    // Formatted values
    expect(copiedText).toBe("$245,000\t$289,000\t$312,000\t$298,000");

    // Step 2: Anchor at Marcus's q1Sales (row 1, col 3) and paste
    await clearSelection();
    await clickCell(canvasElement, 1, 3);
    pressCtrlV();
    await waitForPaste();

    // 4 edits on row 1 with formatted strings as new values
    // (paste tries to parse "$245,000" as a number → NaN → keeps raw string)
    // This is the expected behavior: formatted strings paste as strings
    expect(capturedEditCalls.length).toBe(4);
    const row1Edits = capturedEditCalls.filter((c) => c.rowIndex === 1);
    expect(row1Edits).toHaveLength(4);

    // The values pasted are the formatted strings (not numbers, since "$245,000" fails Number())
    const q1Edit = row1Edits.find((c) => c.accessor === "q1Sales");
    expect(q1Edit!.newValue).toBe("$245,000"); // formatted string, not 245000
  },
};

/**
 * Test A12: Select all (Ctrl+A) on a table with nested headers selects only
 * the visible LEAF cells (not parent header cells which aren't rendered).
 * Then Ctrl+C copies all of them in correct row×col order.
 */
export const SelectAllThenCopy_WithNestedHeaders: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={NORMAL_NESTED_HEADERS}
      rows={makeSalesData().slice(0, 2) as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // Click a cell first to establish focus
    await clickCell(canvasElement, 0, 0);
    await waitForUpdate();

    // Ctrl+A selects all visible leaf columns (10 cols: id, name, region, Q1-Q4, sw, hw, svc)
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", ctrlKey: true, bubbles: true }),
    );
    await waitForUpdate();

    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2); // 2 rows of data

    const row0Cols = lines[0].split("\t");
    const row1Cols = lines[1].split("\t");
    expect(row0Cols).toHaveLength(10); // id, name, region, Q1, Q2, Q3, Q4, sw, hw, svc
    expect(row1Cols).toHaveLength(10);

    // First column: id
    expect(row0Cols[0]).toBe("1");
    expect(row1Cols[0]).toBe("2");

    // Q1 column (index 3 in TSV = col 3)
    expect(row0Cols[3]).toBe("$245,000"); // Alice Q1
    expect(row1Cols[3]).toBe("$189,000"); // Marcus Q1

    // Software column (index 7 in TSV = col 7)
    expect(row0Cols[7]).toBe("$456,000"); // Alice software
    expect(row1Cols[7]).toBe("$398,000"); // Marcus software
  },
};

// ============================================================================
// SECTION B: SINGLE ROW CHILDREN — ALIGNMENT ANALYSIS
//
// A singleRowChildren parent gets its OWN colIndex in calculateColumnIndices
// (not shared with first child). This shifts every cell in the singleRowChildren
// group +1 relative to their positions in flattenedLeafHeaders.
//
// With headers = [...NORMAL_NESTED_HEADERS, latest.score (singleRowChildren)]:
//
//   EXPANDED state grid columns:
//     0:id  1:name  2:region
//     3:q1Sales  4:q2Sales  5:q3Sales  6:q4Sales   (normal nested, ✓)
//     7:softwareSales  8:hardwareSales  9:servicesSales  (normal nested, ✓)
//     10:latest.score  (singleRowChildren parent — OWN cell)
//     11:weekly_diff.score   (child)
//     12:monthly_diff.score  (child)
//
//   flattenedLeafHeaders positions:
//     [0:id 1:name 2:region 3:q1Sales ... 9:servicesSales 10:weekly_diff.score 11:monthly_diff.score]
//     → latest.score (parent) is NOT in leafHeaders
//
//   colIndexToAccessor (built from 0-based leafHeaders positions):
//     10 → "weekly_diff.score"   ← parent cell has colIdx=10, maps to WRONG accessor
//     11 → "monthly_diff.score"  ← child1 cell has colIdx=11, maps to WRONG accessor
//     12 → undefined             ← child2 cell has colIdx=12, no entry
//
// IMPORTANT: All columns BEFORE the singleRowChildren group (cols 0–9) are
// completely unaffected and copy/paste correctly.
// ============================================================================

/**
 * Test B1: Columns BEFORE the singleRowChildren group copy correctly.
 *
 * Even with a singleRowChildren parent in the header definition, the preceding
 * normal columns are unaffected because the parent is appended at the end.
 * Selects id + name + q1Sales + q2Sales (cols 0–4) — all before the performance group.
 */
export const SingleRowChildren_PrecedingColumnsUnaffected: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={HEADERS_WITH_SINGLE_ROW_CHILDREN}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Cols 0–4: id, name, region, q1Sales, q2Sales for rows 0–1
    await selectRange(canvasElement, 0, 0, 1, 4);
    pressCtrlC();
    await waitForUpdate();

    const text = clipboard.get();
    const lines = text.split("\n");
    expect(lines).toHaveLength(2);

    const row0 = lines[0].split("\t");
    expect(row0).toHaveLength(5);
    expect(row0[0]).toBe("1"); // id
    expect(row0[1]).toBe("Alice Thompson"); // name
    expect(row0[2]).toBe("North America"); // region
    expect(row0[3]).toBe("$245,000"); // q1Sales ← formatted, correct ✓
    expect(row0[4]).toBe("$289,000"); // q2Sales ← correct ✓

    const row1 = lines[1].split("\t");
    expect(row1[0]).toBe("2"); // Marcus id
    expect(row1[3]).toBe("$189,000"); // Marcus q1Sales ← correct ✓
  },
};

/**
 * Test B2: The singleRowChildren PARENT cell is selectable and triggers copy flash,
 * and the clipboard value correctly reflects the parent's own accessor.
 *
 * The parent (latest.score) is now included in leafHeaders at position 10, so
 * colIdx=10 maps to "latest.score" and copies Alice's score of 92.
 */
export const SingleRowChildren_ParentCellSelectableFlashWorks: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={HEADERS_WITH_SINGLE_ROW_CHILDREN}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();

    // Parent cell: colIdx=10 (latest.score own column)
    const parentCell = getCellByIndex(canvasElement, 0, 10);
    expect(parentCell).toBeTruthy();

    await clickCell(canvasElement, 0, 10);
    pressCtrlC();
    await waitForUpdate();

    // Flash DOES appear (flash is based on selectedCells membership, which works)
    expect(hasCopyFlash(parentCell!)).toBe(true);

    // The parent cell (latest.score) is now included in leafHeaders, so colIdx=10
    // correctly maps to the "latest.score" accessor → Alice's value = "92".
    expect(clipboard.get()).toBe("92");
  },
};

/**
 * Test B3: Child columns of a singleRowChildren group copy the correct values.
 *
 * With the parent included in leafHeaders:
 *   col 11 → weekly_diff.score → Alice's value = "5"
 *   col 12 → monthly_diff.score → Alice's value = "12"
 */
export const SingleRowChildren_ChildColumnsDocumentedBug: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={HEADERS_WITH_SINGLE_ROW_CHILDREN}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();

    // First child (weekly_diff.score) at colIdx=11
    const child1Cell = getCellByIndex(canvasElement, 0, 11);
    expect(child1Cell).toBeTruthy();
    await clickCell(canvasElement, 0, 11);
    pressCtrlC();
    await waitForUpdate();

    // Flash works correctly (UI behavior)
    expect(hasCopyFlash(child1Cell!)).toBe(true);

    // colIdx=11 → leafHeaders[11] = "weekly_diff.score" → Alice's value = "5"
    expect(clipboard.get()).toBe("5");

    // Second child (monthly_diff.score) at colIdx=12
    await clearSelection();
    const child2Cell = getCellByIndex(canvasElement, 0, 12);
    expect(child2Cell).toBeTruthy();
    await clickCell(canvasElement, 0, 12);
    pressCtrlC();
    await waitForUpdate();

    // colIdx=12 → leafHeaders[12] = "monthly_diff.score" → Alice's value = "12"
    expect(clipboard.get()).toBe("12");
  },
};

/**
 * Test B4: Copying a full row that includes the singleRowChildren group.
 *
 * All 13 columns map correctly after the findLeafHeaders fix:
 *   Cols 0–9  (normal + normal nested): correct as before.
 *   Col 10 (singleRowChildren parent): latest.score → "92"
 *   Col 11 (first child): weekly_diff.score → "5"
 *   Col 12 (second child): monthly_diff.score → "12"
 */
export const SingleRowChildren_FullRowCopyShowsMisalignment: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={HEADERS_WITH_SINGLE_ROW_CHILDREN}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    await clearSelection();
    // Select all 13 columns (cols 0–12) for row 0
    await selectRange(canvasElement, 0, 0, 0, 12);
    pressCtrlC();
    await waitForUpdate();

    const cols = clipboard.get().split("\t");
    expect(cols).toHaveLength(13);

    // Cols 0–9: correct values
    expect(cols[0]).toBe("1"); // id ✓
    expect(cols[1]).toBe("Alice Thompson"); // name ✓
    expect(cols[2]).toBe("North America"); // region ✓
    expect(cols[3]).toBe("$245,000"); // q1Sales ✓
    expect(cols[4]).toBe("$289,000"); // q2Sales ✓
    expect(cols[5]).toBe("$312,000"); // q3Sales ✓
    expect(cols[6]).toBe("$298,000"); // q4Sales ✓
    expect(cols[7]).toBe("$456,000"); // softwareSales ✓
    expect(cols[8]).toBe("$342,000"); // hardwareSales ✓
    expect(cols[9]).toBe("$346,000"); // servicesSales ✓

    // Cols 10–12: singleRowChildren group, now correctly aligned
    expect(cols[10]).toBe("92"); // latest.score — parent
    expect(cols[11]).toBe("5"); // weekly_diff.score — child1
    expect(cols[12]).toBe("12"); // monthly_diff.score — child2
  },
};

// ============================================================================
// SECTION C: EXPAND → COLLAPSE → RE-EXPAND LIFECYCLE
//
// This is the primary live-interaction test: the same story clicks the collapse
// toggle button in the Quarterly Sales header mid-play, verifying that:
//   1. Copy works correctly when the group is expanded (Q1–Q4 visible)
//   2. Copy works correctly after collapsing (Total takes colIdx=3)
//   3. Copy works correctly after re-expanding (Q1 back at colIdx=3)
//
// The collapse button is found via aria-label and clicked directly — this
// exercises the real collapse/expand code path, not just collapseDefault.
// ============================================================================

/**
 * Test C1: Full lifecycle — copy from expanded quarterly, collapse it, copy again,
 * then re-expand and verify the original layout is restored.
 *
 * The collapse toggle button for "Quarterly Sales" has
 * aria-label="Collapse Quarterly Sales column" (expanded state)
 * aria-label="Expand Quarterly Sales column"  (collapsed state)
 *
 * EXPANDED layout (cols 3–6):  q1Sales · q2Sales · q3Sales · q4Sales
 * COLLAPSED layout (col 3):    totalSales  (replaces the whole quarterly group)
 *   and category group shifts: softwareSales→col4, hardwareSales→col5, servicesSales→col6
 */
export const CopyExpandedCollapseAndCopyAgain: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={NORMAL_NESTED_HEADERS}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // ── PHASE 1: Quarterly group EXPANDED ──────────────────────────────────────
    //
    // Verify individual leaf cell values and that the 2-row TSV is correct.
    // col 3 = q1Sales, col 4 = q2Sales, col 5 = q3Sales, col 6 = q4Sales
    // col 7 = softwareSales, col 8 = hardwareSales, col 9 = servicesSales

    await clearSelection();

    // Sanity: cell content matches expected display value
    const q1CellExpanded = getCellByIndex(canvasElement, 0, 3);
    const q2CellExpanded = getCellByIndex(canvasElement, 0, 4);
    expect(getCellContent(q1CellExpanded!)).toBe("$245,000");
    expect(getCellContent(q2CellExpanded!)).toBe("$289,000");

    // Copy 4-column quarterly range for rows 0 and 1
    await selectRange(canvasElement, 0, 3, 1, 6);
    pressCtrlC();
    await waitForUpdate();

    const expandedTsv = clipboard.get();
    const expandedRows = expandedTsv.split("\n");
    expect(expandedRows).toHaveLength(2);

    const aliceExpanded = expandedRows[0].split("\t");
    expect(aliceExpanded).toHaveLength(4);
    expect(aliceExpanded[0]).toBe("$245,000"); // q1Sales Alice ✓
    expect(aliceExpanded[1]).toBe("$289,000"); // q2Sales Alice ✓
    expect(aliceExpanded[2]).toBe("$312,000"); // q3Sales Alice ✓
    expect(aliceExpanded[3]).toBe("$298,000"); // q4Sales Alice ✓

    const marcusExpanded = expandedRows[1].split("\t");
    expect(marcusExpanded[0]).toBe("$189,000"); // q1Sales Marcus ✓
    expect(marcusExpanded[3]).toBe("$276,000"); // q4Sales Marcus ✓

    // Category group still correct in expanded state
    await clearSelection();
    await clickCell(canvasElement, 0, 7); // softwareSales
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$456,000"); // Alice software ✓

    // ── PHASE 2: COLLAPSE the quarterly group ──────────────────────────────────
    //
    // Click the collapse button in the "Quarterly Sales" header.
    // After this: q1–q4 cells disappear, totalSales appears at colIdx=3,
    // and the product category group shifts down to cols 4–6.

    const collapseBtn = canvasElement.querySelector(
      '[aria-label="Collapse Quarterly Sales column"]',
    ) as HTMLElement | null;
    expect(collapseBtn).toBeTruthy();
    collapseBtn!.click();
    await new Promise((r) => setTimeout(r, 500)); // allow React to commit the collapsed state

    await clearSelection();

    // col 3 now shows totalSales (was q1Sales before collapse)
    const totalSalesCell = getCellByIndex(canvasElement, 0, 3);
    expect(totalSalesCell).toBeTruthy();
    expect(getCellContent(totalSalesCell!)).toBe("$1,144,000"); // Alice total

    // Copy just the totalSales cell
    await clickCell(canvasElement, 0, 3);
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$1,144,000"); // ✓ totalSales, not q1Sales

    // Category group has shifted: col 4 → softwareSales, col 5 → hardwareSales, col 6 → servicesSales
    const softwareCellCollapsed = getCellByIndex(canvasElement, 0, 4);
    expect(getCellContent(softwareCellCollapsed!)).toBe("$456,000");

    // Copy 3-column range: totalSales + softwareSales + hardwareSales for rows 0 and 1
    await clearSelection();
    await selectRange(canvasElement, 0, 3, 1, 5);
    pressCtrlC();
    await waitForUpdate();

    const collapsedTsv = clipboard.get();
    const collapsedRows = collapsedTsv.split("\n");
    expect(collapsedRows).toHaveLength(2);

    const aliceCollapsed = collapsedRows[0].split("\t");
    expect(aliceCollapsed).toHaveLength(3);
    expect(aliceCollapsed[0]).toBe("$1,144,000"); // totalSales Alice ✓
    expect(aliceCollapsed[1]).toBe("$456,000"); // softwareSales Alice ✓
    expect(aliceCollapsed[2]).toBe("$342,000"); // hardwareSales Alice ✓

    const marcusCollapsed = collapsedRows[1].split("\t");
    expect(marcusCollapsed[0]).toBe("$986,000"); // totalSales Marcus ✓
    expect(marcusCollapsed[1]).toBe("$398,000"); // softwareSales Marcus ✓

    // ── PHASE 3: RE-EXPAND the quarterly group ─────────────────────────────────
    //
    // Click the expand button (aria-label changes when collapsed).
    // After this the layout reverts to: q1Sales→col3, q2Sales→col4, …, softwareSales→col7.

    const expandBtn = canvasElement.querySelector(
      '[aria-label="Expand Quarterly Sales column"]',
    ) as HTMLElement | null;
    expect(expandBtn).toBeTruthy();
    expandBtn!.click();
    await new Promise((r) => setTimeout(r, 500));

    await clearSelection();

    // col 3 must be q1Sales again
    const q1AfterExpand = getCellByIndex(canvasElement, 0, 3);
    expect(getCellContent(q1AfterExpand!)).toBe("$245,000"); // q1Sales restored ✓

    await clickCell(canvasElement, 0, 3);
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$245,000"); // ✓ not totalSales

    // col 7 must be softwareSales again (shifted back from col 4)
    const softwareAfterExpand = getCellByIndex(canvasElement, 0, 7);
    expect(getCellContent(softwareAfterExpand!)).toBe("$456,000"); // ✓

    await clearSelection();
    await clickCell(canvasElement, 0, 7);
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$456,000"); // ✓ softwareSales, not totalSales offset
  },
};

// ============================================================================
// SECTION D: SINGLE ROW CHILDREN IN THE MIDDLE — PRODUCT CATEGORIES
//
// In this variant the Product Categories group is configured with
// singleRowChildren: true. This places productCategories parent as its own
// rendered cell (colIdx=7) AND gives each child its own separate colIndex
// (software→8, hardware→9, services→10).
//
// calculateColumnIndices (expanded):
//   id=0  name=1  region=2
//   quarterlyData=3(parent)  q1Sales=3(isFirst=true,shares)  q2Sales=4  q3Sales=5  q4Sales=6
//   productCategories=7(singleRowChildren parent, OWN colIdx)
//   softwareSales=8  hardwareSales=9  servicesSales=10
//
// flattenedLeafHeaders (expanded) — with findLeafHeaders fix:
//   [id(0) name(1) region(2) q1Sales(3) q2Sales(4) q3Sales(5) q4Sales(6)
//    productCategories(7) softwareSales(8) hardwareSales(9) servicesSales(10)]
//   → productCategories IS included because singleRowChildren=true
//
// colIndexToAccessor:
//   0→id  1→name  2→region  3→q1Sales  4→q2Sales  5→q3Sales  6→q4Sales
//   7→productCategories  8→softwareSales  9→hardwareSales  10→servicesSales  ✓
//
// RESULT: all columns correctly aligned ✓
// ============================================================================

/** Headers where Product Categories uses singleRowChildren (not the quarterly group). */
const PRODUCT_CATEGORIES_SINGLE_ROW_HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "name", label: "Sales Rep", width: 180, type: "string" },
  { accessor: "region", label: "Region", width: 140, type: "string" },
  {
    accessor: "quarterlyData",
    label: "Quarterly Sales",
    width: 420,
    collapsible: true,
    children: [
      {
        accessor: "q1Sales",
        label: "Q1",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q2Sales",
        label: "Q2",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q3Sales",
        label: "Q3",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "q4Sales",
        label: "Q4",
        width: 100,
        type: "number",
        showWhen: "parentExpanded",
        isEditable: true,
        valueFormatter: usdFormatter,
      },
      {
        accessor: "totalSales",
        label: "Total",
        width: 120,
        type: "number",
        showWhen: "parentCollapsed",
        valueFormatter: usdFormatter,
      },
    ],
  },
  {
    // ← singleRowChildren on the Product Categories group
    accessor: "productCategories",
    label: "Product Categories",
    width: 450,
    collapsible: true,
    singleRowChildren: true,
    children: [
      {
        accessor: "softwareSales",
        label: "Software",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "hardwareSales",
        label: "Hardware",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "servicesSales",
        label: "Services",
        width: 130,
        type: "number",
        valueFormatter: usdFormatter,
      },
      {
        accessor: "topCategory",
        label: "Top Category",
        width: 130,
        type: "string",
        showWhen: "parentCollapsed",
      },
    ],
  },
];

/**
 * Test D1: The quarterly (normal nested) columns copy correctly even when the
 * product categories group uses singleRowChildren. The singleRowChildren parent
 * is appended AFTER the quarterly group so it has no effect on cols 0–6.
 *
 * Then demonstrates the colIndex misalignment that begins at the productCategories
 * singleRowChildren parent cell (col 7) and propagates through all children.
 */
export const ProductCategories_SingleRowChildren_QuarterlyStillCorrect: Story = {
  tags: ["test"],
  render: () => (
    <SimpleTable
      defaultHeaders={PRODUCT_CATEGORIES_SINGLE_ROW_HEADERS}
      rows={makeSalesData() as Row[]}
      getRowId={({ row }) => String(row.id)}
      height="500px"
      selectableCells
    />
  ),
  play: async ({ canvasElement }) => {
    await waitForTable();
    const clipboard = mockClipboard();

    // ── Part 1: Quarterly columns (cols 3–6) are unaffected ───────────────────
    //
    // These are BEFORE the singleRowChildren group and use normal nested headers,
    // so calculateColumnIndices and findLeafHeaders remain perfectly aligned.

    await clearSelection();
    await selectRange(canvasElement, 0, 3, 0, 6); // q1–q4 for Alice (row 0)
    pressCtrlC();
    await waitForUpdate();

    const quarterlyCols = clipboard.get().split("\t");
    expect(quarterlyCols).toHaveLength(4);
    expect(quarterlyCols[0]).toBe("$245,000"); // q1Sales ✓
    expect(quarterlyCols[1]).toBe("$289,000"); // q2Sales ✓
    expect(quarterlyCols[2]).toBe("$312,000"); // q3Sales ✓
    expect(quarterlyCols[3]).toBe("$298,000"); // q4Sales ✓

    // id, name, region also correct
    await clearSelection();
    await selectRange(canvasElement, 0, 0, 0, 2);
    pressCtrlC();
    await waitForUpdate();
    const idNameRegion = clipboard.get().split("\t");
    expect(idNameRegion).toHaveLength(3);
    expect(idNameRegion[0]).toBe("1");
    expect(idNameRegion[1]).toBe("Alice Thompson");
    expect(idNameRegion[2]).toBe("North America");

    // ── Part 2: singleRowChildren parent cell (col 7) ────────────────────────
    //
    // productCategories is now included in leafHeaders, so colIdx=7 maps to
    // the "productCategories" accessor. That accessor has no data field in the
    // rows, so the clipboard value is "".

    await clearSelection();
    const parentCell = getCellByIndex(canvasElement, 0, 7);
    expect(parentCell).toBeTruthy();
    await clickCell(canvasElement, 0, 7);
    pressCtrlC();
    await waitForUpdate();

    // Flash works (selection is correct)
    expect(hasCopyFlash(parentCell!)).toBe(true);

    // colIdx=7 → leafHeaders[7] = "productCategories" → no data field → ""
    expect(clipboard.get()).toBe("");

    // ── Part 3: Child cells now map correctly ─────────────────────────────────
    //
    // softwareSales cell: colIdx=8 → softwareSales → $456,000
    // hardwareSales cell: colIdx=9 → hardwareSales → $342,000
    // servicesSales cell: colIdx=10 → servicesSales → $346,000

    await clearSelection();
    await clickCell(canvasElement, 0, 8); // softwareSales cell
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$456,000");

    await clearSelection();
    await clickCell(canvasElement, 0, 9); // hardwareSales cell
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$342,000");

    await clearSelection();
    await clickCell(canvasElement, 0, 10); // servicesSales cell
    pressCtrlC();
    await waitForUpdate();
    expect(clipboard.get()).toBe("$346,000");
  },
};
