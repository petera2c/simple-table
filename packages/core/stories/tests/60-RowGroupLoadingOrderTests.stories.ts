/**
 * Lazy row groups where child rows are saved before setLoading(false).
 * Expand Engineering. The spinner should clear and the team rows should show.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import type { ColumnDef, OnRowGroupExpandProps, Row } from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";
import { addParagraph } from "../utils";
import { waitForTable, waitUntil } from "./testUtils";

const meta: Meta = {
  title: "Tests/60 - Row Group Loading Order",
  tags: ["test", "row-grouping", "lazy-loading"],
  parameters: {
    layout: "padded",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Expand a row group, save its children, then clear the loading spinner. The team rows should replace the spinner.",
      },
    },
  },
};

export default meta;

interface TeamRow {
  id: string;
  name: string;
  size: number;
}

interface DeptRow extends Row {
  id: string;
  name: string;
  budget: number;
  teams?: TeamRow[];
}

const HEADERS: ColumnDef<DeptRow>[] = [
  { accessor: "name", label: "Name", width: 250, expandable: true },
  { accessor: "budget", label: "Budget", width: 150, type: "number" },
  { accessor: "size", label: "Team Size", width: 120, type: "number" },
];

const INITIAL_ROWS: DeptRow[] = [
  { id: "dept-1", name: "Engineering", budget: 500_000 },
  { id: "dept-2", name: "Sales", budget: 300_000 },
  { id: "dept-3", name: "Marketing", budget: 250_000 },
];

const TEAMS_BY_DEPT: Record<string, TeamRow[]> = {
  "dept-1": [
    { id: "team-1", name: "Frontend Team", size: 5 },
    { id: "team-2", name: "Backend Team", size: 6 },
  ],
  "dept-2": [{ id: "team-3", name: "Enterprise Sales", size: 4 }],
  "dept-3": [{ id: "team-4", name: "Digital Marketing", size: 3 }],
};

const FETCH_MS = 700;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const renderRowsThenClearLoading = (): HTMLDivElement => {
  let rows: DeptRow[] = INITIAL_ROWS.map((row) => ({ ...row }));

  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "1rem";
  h2.textContent = "Save children, then clear loading";
  wrapper.appendChild(h2);

  addParagraph(
    wrapper,
    "Expand a department. Child rows are saved first, then the loading spinner is cleared. The teams should replace the spinner.",
  );

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const table = new SimpleTableVanilla<DeptRow>(tableContainer, {
    columns: HEADERS,
    rows,
    height: "400px",
    rowGrouping: ["teams"],
    expandAll: false,
    getRowId: ({ row }) => String((row as DeptRow).id),
    onRowGroupExpand: async ({
      row,
      isExpanded,
      setLoading,
      groupingKey,
      rowIndexPath,
    }: OnRowGroupExpandProps<DeptRow>) => {
      if (!isExpanded || !groupingKey) return;
      const alreadyLoaded = Array.isArray(row[groupingKey]) && (row[groupingKey] as TeamRow[]).length > 0;
      if (alreadyLoaded) return;

      setLoading(true);
      try {
        await sleep(FETCH_MS);
        const rowIndex = rowIndexPath[0];
        if (typeof rowIndex !== "number") return;
        const nextRows = rows.map((entry) => ({ ...entry }));
        nextRows[rowIndex] = {
          ...nextRows[rowIndex],
          [groupingKey]: TEAMS_BY_DEPT[String(row.id)] ?? [],
        };
        rows = nextRows;
        table.update({ rows: nextRows });
      } finally {
        setLoading(false);
      }
    },
  });
  table.mount();
  return wrapper;
};

const findExpandIcon = (canvasElement: HTMLElement, rowIndex: number): HTMLElement => {
  const body = canvasElement.querySelector(".st-body-container");
  if (!body) throw new Error("Body container not found");
  const rowCells = body.querySelectorAll(`.st-cell[data-row-index="${rowIndex}"]`);
  for (const cell of Array.from(rowCells)) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      return icon as HTMLElement;
    }
  }
  throw new Error(`Expand icon not found in row ${rowIndex}`);
};

export const RowsThenClearLoading = {
  render: () => renderRowsThenClearLoading(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("Engineering");
    expect(canvasElement.textContent).not.toContain("Frontend Team");

    const user = userEvent.setup();
    await user.click(findExpandIcon(canvasElement, 0));

    await waitUntil(() => canvasElement.textContent?.includes("Frontend Team") ?? false, {
      timeoutMs: 4000,
    });
    expect(canvasElement.textContent).toContain("Backend Team");
    expect(canvasElement.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length).toBe(0);
  },
};
