/**
 * Heavy horizontal-scroll playground: many columns, custom headers, custom cells.
 * Open Tests/58 - Heavy Horizontal Scroll and flick the trackpad sideways.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import type { CellRendererProps, ColumnDef, HeaderRendererProps } from "../../src/index";
import {
  getMainScrollX,
  mainOverflowsX,
  setMainScrollX,
  waitForTable,
} from "./testUtils";
import { addParagraph, renderVanillaTable } from "../utils";

const COLUMN_COUNT = 100;
const ROW_COUNT = 80;
const COLUMN_WIDTH = 128;
const FAR_COLUMN = 40;

const STATUSES = ["Open", "Hold", "Done", "Risk"] as const;
const STATUS_COLORS: Record<(typeof STATUSES)[number], string> = {
  Open: "#2563eb",
  Hold: "#d97706",
  Done: "#059669",
  Risk: "#dc2626",
};

type HeavyRow = Record<string, string | number>;

const meta: Meta = {
  title: "Tests/58 - Heavy Horizontal Scroll",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "100 columns and 80 rows with custom header and cell renderers, so you can feel horizontal scroll under load. Header and body share one offset.",
      },
    },
  },
};

export default meta;

const headerRenderer = ({ header }: HeaderRendererProps<HeavyRow>): HTMLElement => {
  const wrap = document.createElement("span");
  wrap.className = "st-heavy-hscroll-header";
  wrap.style.display = "inline-flex";
  wrap.style.alignItems = "center";
  wrap.style.gap = "6px";

  const badge = document.createElement("span");
  badge.style.display = "inline-flex";
  badge.style.alignItems = "center";
  badge.style.justifyContent = "center";
  badge.style.minWidth = "22px";
  badge.style.height = "18px";
  badge.style.padding = "0 4px";
  badge.style.borderRadius = "4px";
  badge.style.background = "#e2e8f0";
  badge.style.color = "#334155";
  badge.style.fontSize = "10px";
  badge.style.fontWeight = "700";
  badge.textContent = String(header.label).replace(/^Metric /, "M");

  const label = document.createElement("span");
  label.textContent = header.label;

  wrap.append(badge, label);
  return wrap;
};

const statusCellRenderer = ({ value }: CellRendererProps<HeavyRow>): HTMLElement => {
  const status = String(value) as (typeof STATUSES)[number];
  const pill = document.createElement("span");
  pill.className = "st-heavy-hscroll-cell st-heavy-hscroll-status";
  pill.style.display = "inline-flex";
  pill.style.alignItems = "center";
  pill.style.gap = "6px";
  pill.style.padding = "2px 8px";
  pill.style.borderRadius = "999px";
  pill.style.background = "#f1f5f9";
  pill.style.fontSize = "12px";

  const dot = document.createElement("span");
  dot.style.width = "8px";
  dot.style.height = "8px";
  dot.style.borderRadius = "50%";
  dot.style.background = STATUS_COLORS[status] ?? "#64748b";

  const text = document.createElement("span");
  text.textContent = status;

  pill.append(dot, text);
  return pill;
};

const barCellRenderer = ({ value }: CellRendererProps<HeavyRow>): HTMLElement => {
  const n = Number(value);
  const wrap = document.createElement("div");
  wrap.className = "st-heavy-hscroll-cell st-heavy-hscroll-bar";
  wrap.style.display = "flex";
  wrap.style.alignItems = "center";
  wrap.style.gap = "8px";

  const track = document.createElement("div");
  track.style.flex = "1";
  track.style.height = "8px";
  track.style.borderRadius = "4px";
  track.style.background = "#e2e8f0";
  track.style.overflow = "hidden";

  const fill = document.createElement("div");
  fill.style.height = "100%";
  fill.style.width = `${Math.max(4, Math.min(100, n))}%`;
  fill.style.background = n > 70 ? "#059669" : n > 40 ? "#2563eb" : "#d97706";
  track.appendChild(fill);

  const label = document.createElement("span");
  label.style.fontSize = "11px";
  label.style.color = "#475569";
  label.style.minWidth = "28px";
  label.textContent = String(n);

  wrap.append(track, label);
  return wrap;
};

const chipCellRenderer = ({ value }: CellRendererProps<HeavyRow>): HTMLElement => {
  const chip = document.createElement("span");
  chip.className = "st-heavy-hscroll-cell st-heavy-hscroll-chip";
  chip.style.display = "inline-block";
  chip.style.maxWidth = "100%";
  chip.style.overflow = "hidden";
  chip.style.textOverflow = "ellipsis";
  chip.style.whiteSpace = "nowrap";
  chip.style.padding = "2px 8px";
  chip.style.borderRadius = "4px";
  chip.style.background = "#eff6ff";
  chip.style.color = "#1e40af";
  chip.style.fontSize = "12px";
  chip.textContent = String(value);
  return chip;
};

const numberCellRenderer = ({ value }: CellRendererProps<HeavyRow>): HTMLElement => {
  const el = document.createElement("span");
  el.className = "st-heavy-hscroll-cell st-heavy-hscroll-number";
  el.style.fontVariantNumeric = "tabular-nums";
  el.textContent = Number(value).toLocaleString();
  return el;
};

const nameHeaderRenderer = ({ header }: HeaderRendererProps<HeavyRow>): HTMLElement => {
  const wrap = document.createElement("span");
  wrap.className = "st-heavy-hscroll-header";
  wrap.style.fontWeight = "700";
  wrap.textContent = header.label;
  return wrap;
};

const nameCellRenderer = ({ value }: CellRendererProps<HeavyRow>): HTMLElement => {
  const el = document.createElement("span");
  el.className = "st-heavy-hscroll-cell st-heavy-hscroll-name";
  el.style.fontWeight = "600";
  el.textContent = String(value);
  return el;
};

const metricRendererFor = (index: number) => {
  const kind = index % 4;
  if (kind === 0) return statusCellRenderer;
  if (kind === 1) return barCellRenderer;
  if (kind === 2) return chipCellRenderer;
  return numberCellRenderer;
};

const metricValue = (rowIndex: number, colIndex: number): string | number => {
  const kind = colIndex % 4;
  if (kind === 0) return STATUSES[(rowIndex + colIndex) % STATUSES.length];
  if (kind === 1) return (rowIndex * 7 + colIndex * 13) % 100;
  if (kind === 2) return `R${rowIndex + 1}-C${colIndex + 1}`;
  return (rowIndex + 1) * 100 + colIndex;
};

const buildHeaders = (): ColumnDef<HeavyRow>[] => {
  const headers: ColumnDef<HeavyRow>[] = [
    {
      accessor: "id",
      label: "ID",
      width: 72,
      type: "number",
      pinned: "left",
      headerRenderer: nameHeaderRenderer,
      cellRenderer: numberCellRenderer,
    },
    {
      accessor: "name",
      label: "Account",
      width: 160,
      type: "string",
      pinned: "left",
      headerRenderer: nameHeaderRenderer,
      cellRenderer: nameCellRenderer,
    },
  ];

  for (let i = 0; i < COLUMN_COUNT; i++) {
    headers.push({
      accessor: `c${i}`,
      label: `Metric ${i}`,
      width: COLUMN_WIDTH,
      type: i % 4 === 0 ? "string" : "number",
      headerRenderer,
      cellRenderer: metricRendererFor(i),
    });
  }
  return headers;
};

const buildRows = (): HeavyRow[] =>
  Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
    const row: HeavyRow = {
      id: rowIndex + 1,
      name: `Account ${rowIndex + 1}`,
    };
    for (let c = 0; c < COLUMN_COUNT; c++) {
      row[`c${c}`] = metricValue(rowIndex, c);
    }
    return row;
  });

const HEADERS = buildHeaders();
const ROWS = buildRows();

const renderHeavyTable = () => {
  const { wrapper, tableContainer, h2 } = renderVanillaTable(HEADERS, ROWS, {
    getRowId: (p) => String((p.row as HeavyRow).id),
    height: "560px",
    columnResizing: true,
    oddEvenRowBackground: true,
  });
  h2.textContent = "Heavy horizontal scroll";
  addParagraph(
    wrapper,
    `${COLUMN_COUNT} metric columns plus pinned ID and Account. Custom header and cell renderers on every column. Flick the trackpad sideways and check that the header stays lined up with the body.`,
    tableContainer,
  );
  wrapper.style.padding = "1rem";
  tableContainer.style.width = "100%";
  return wrapper;
};

export const HeavyTablePlayground = {
  parameters: { tags: ["heavy-horizontal-scroll-playground"] },
  render: () => renderHeavyTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.querySelector(".st-heavy-hscroll-header")).toBeTruthy();
    expect(canvasElement.querySelector(".st-heavy-hscroll-cell")).toBeTruthy();
    expect(mainOverflowsX(canvasElement)).toBe(true);

    const far = `c${FAR_COLUMN}`;
    expect(canvasElement.querySelector(`.st-body-main [data-accessor="${far}"]`)).toBeFalsy();

    const offset = FAR_COLUMN * COLUMN_WIDTH;
    setMainScrollX(canvasElement, offset);
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    expect(getMainScrollX(canvasElement)).toBe(offset);
    const header = canvasElement.querySelector(".st-header-main") as HTMLElement;
    const body = canvasElement.querySelector(".st-body-main") as HTMLElement;
    expect(header.dataset.stScrollX).toBe(String(offset));
    expect(body.dataset.stScrollX).toBe(String(offset));
    expect(canvasElement.querySelector(`.st-body-main [data-accessor="${far}"]`)).toBeTruthy();
    expect(canvasElement.querySelector(`.st-header-main [data-accessor="${far}"]`)).toBeTruthy();
    expect(
      canvasElement.querySelector(`.st-body-main [data-accessor="${far}"] .st-heavy-hscroll-cell`),
    ).toBeTruthy();
  },
};
