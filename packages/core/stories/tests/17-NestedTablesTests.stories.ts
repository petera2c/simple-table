/**
 * NESTED TABLES TESTS
 * Rich deterministic data (marketing-style companies → divisions → teams), content assertions,
 * and coverage for lazy load, multi-level nesting, sort, selection, filtering, pagination, collapse, and empty nested rows.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import type { HeaderObject, OnRowGroupExpandProps, Row } from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/17 - Nested Tables",
  tags: ["nested-tables"],
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for nested/expandable tables and nested table rendering.",
      },
    },
  },
};

export default meta;

// --- Deterministic fixture (aligned with marketing / nested-tables demo shape) ---

type NestedTeam = { id: string; memberName: string; role: string };

type NestedDivision = {
  id: string;
  divisionId: string;
  divisionName: string;
  revenue: string;
  profitMargin: string;
  headcount: number;
  location: string;
  teams?: NestedTeam[];
};

type NestedCompany = {
  id: number;
  companyName: string;
  industry: string;
  headquarters: string;
  stockSymbol: string;
  marketCap: string;
  ceo: string;
  revenue: string;
  employees: number;
  divisions: NestedDivision[];
};

const ACME_CORP = "Acme Corp Global";
const BETA_HOLDINGS = "Beta Holdings Inc";
const GAMMA_VENTURES = "Gamma Ventures LLC";
const DELTA_SYSTEMS = "Delta Systems Group";
const EPSILON_PARTNERS = "Epsilon Partners SA";

/** Parent row fields shared by Acme where only `divisions` differ per story. */
const acmeCompanyBase = (): Omit<NestedCompany, "divisions"> => ({
  id: 1,
  companyName: ACME_CORP,
  industry: "Technology",
  headquarters: "San Francisco, CA",
  stockSymbol: "ACMG",
  marketCap: "$120B",
  ceo: "Jordan Avery",
  revenue: "$42B",
  employees: 24000,
});

const withDivisions = (base: Omit<NestedCompany, "divisions">, divisions: NestedDivision[]): NestedCompany => ({
  ...base,
  divisions,
});

/** Acme divisions for most stories (pagination, filters, selection, multi-expand, etc.). */
const ACME_DIVISIONS: NestedDivision[] = [
  {
    id: "d-1-1",
    divisionId: "DIV-010",
    divisionName: "Zeta Unit",
    revenue: "$8B",
    profitMargin: "28%",
    headcount: 200,
    location: "Austin, TX",
  },
  {
    id: "d-1-2",
    divisionId: "DIV-011",
    divisionName: "Beta Unit",
    revenue: "$5B",
    profitMargin: "22%",
    headcount: 130,
    location: "Boston, MA",
  },
  {
    id: "d-1-3",
    divisionId: "DIV-012",
    divisionName: "Alpha Unit",
    revenue: "$3B",
    profitMargin: "18%",
    headcount: 80,
    location: "Seattle, WA",
  },
  {
    id: "d-1-4",
    divisionId: "DIV-013",
    divisionName: "Consumer Apps",
    revenue: "$2.1B",
    profitMargin: "21%",
    headcount: 65,
    location: "Los Angeles, CA",
  },
  {
    id: "d-1-5",
    divisionId: "DIV-014",
    divisionName: "Data Platform",
    revenue: "$1.8B",
    profitMargin: "26%",
    headcount: 55,
    location: "Denver, CO",
  },
  {
    id: "d-1-6",
    divisionId: "DIV-015",
    divisionName: "International Ops",
    revenue: "$1.4B",
    profitMargin: "19%",
    headcount: 45,
    location: "London, UK",
  },
  {
    id: "d-1-7",
    divisionId: "DIV-016",
    divisionName: "Research Labs",
    revenue: "$0.9B",
    profitMargin: "12%",
    headcount: 38,
    location: "Cambridge, MA",
  },
  {
    id: "d-1-8",
    divisionId: "DIV-017",
    divisionName: "Shared Services",
    revenue: "$0.6B",
    profitMargin: "14%",
    headcount: 25,
    location: "Phoenix, AZ",
  },
];

/** Matches nested grid sort story: `initialSortColumn: "headcount", initialSortDirection: "desc"`. */
const ACME_DIVISION_NAMES_SORTED_BY_HEADCOUNT_DESC = [...ACME_DIVISIONS]
  .sort((a, b) => b.headcount - a.headcount)
  .map((d) => d.divisionName);

const BETA_DIVISIONS: NestedDivision[] = [
  {
    id: "d-2-1",
    divisionId: "DIV-020",
    divisionName: "Investment Banking",
    revenue: "$6B",
    profitMargin: "35%",
    headcount: 400,
    location: "New York, NY",
  },
  {
    id: "d-2-2",
    divisionId: "DIV-021",
    divisionName: "Wealth Management",
    revenue: "$4.2B",
    profitMargin: "31%",
    headcount: 320,
    location: "Chicago, IL",
  },
  {
    id: "d-2-3",
    divisionId: "DIV-022",
    divisionName: "Capital Markets",
    revenue: "$3.6B",
    profitMargin: "29%",
    headcount: 275,
    location: "London, UK",
  },
  {
    id: "d-2-4",
    divisionId: "DIV-023",
    divisionName: "Risk & Compliance",
    revenue: "$2.5B",
    profitMargin: "24%",
    headcount: 210,
    location: "Frankfurt, DE",
  },
];

const DELTA_DIVISIONS: NestedDivision[] = [
  {
    id: "d-4-1",
    divisionId: "DIV-040",
    divisionName: "Supply Chain",
    revenue: "$5.2B",
    profitMargin: "17%",
    headcount: 420,
    location: "Memphis, TN",
  },
  {
    id: "d-4-2",
    divisionId: "DIV-041",
    divisionName: "Fleet & Routes",
    revenue: "$3.8B",
    profitMargin: "15%",
    headcount: 310,
    location: "Dallas, TX",
  },
  {
    id: "d-4-3",
    divisionId: "DIV-042",
    divisionName: "Automation Systems",
    revenue: "$2.9B",
    profitMargin: "22%",
    headcount: 240,
    location: "Detroit, MI",
  },
  {
    id: "d-4-4",
    divisionId: "DIV-043",
    divisionName: "Customer Fulfillment",
    revenue: "$2.1B",
    profitMargin: "16%",
    headcount: 195,
    location: "Columbus, OH",
  },
];

const EPSILON_DIVISIONS: NestedDivision[] = [
  {
    id: "d-5-1",
    divisionId: "DIV-050",
    divisionName: "Streaming Platform",
    revenue: "$4.5B",
    profitMargin: "27%",
    headcount: 340,
    location: "Culver City, CA",
  },
  {
    id: "d-5-2",
    divisionId: "DIV-051",
    divisionName: "Ad Tech & Data",
    revenue: "$3.1B",
    profitMargin: "33%",
    headcount: 260,
    location: "New York, NY",
  },
  {
    id: "d-5-3",
    divisionId: "DIV-052",
    divisionName: "Carrier & Network",
    revenue: "$2.4B",
    profitMargin: "18%",
    headcount: 220,
    location: "Reston, VA",
  },
  {
    id: "d-5-4",
    divisionId: "DIV-053",
    divisionName: "Studios & Content",
    revenue: "$1.9B",
    profitMargin: "20%",
    headcount: 185,
    location: "Burbank, CA",
  },
  {
    id: "d-5-5",
    divisionId: "DIV-054",
    divisionName: "Enterprise Accounts",
    revenue: "$1.2B",
    profitMargin: "23%",
    headcount: 140,
    location: "Toronto, ON",
  },
];

/** Divisions with `teams[]` for `rowGrouping: ["divisions","teams"]` stories only. */
const ACME_DIVISIONS_WITH_TEAMS: NestedDivision[] = [
  {
    id: "d-3l-1",
    divisionId: "DIV-PLT",
    divisionName: "Platform",
    revenue: "$4B",
    profitMargin: "24%",
    headcount: 90,
    location: "Portland, OR",
    teams: [
      { id: "tm-1", memberName: "Taylor Chen", role: "Staff Engineer" },
      { id: "tm-2", memberName: "Sam Diaz", role: "Intern" },
      { id: "tm-1b", memberName: "Alex Rivera", role: "SRE Lead" },
      { id: "tm-1c", memberName: "Priya Nair", role: "Product Designer" },
    ],
  },
  {
    id: "d-3l-2",
    divisionId: "DIV-SLS",
    divisionName: "Sales",
    revenue: "$2B",
    profitMargin: "15%",
    headcount: 45,
    location: "Denver, CO",
    teams: [
      { id: "tm-3", memberName: "Jordan Lee", role: "Account Executive" },
      { id: "tm-3b", memberName: "Chris Byrne", role: "Sales Engineer" },
    ],
  },
  {
    id: "d-3l-3",
    divisionId: "DIV-SUP",
    divisionName: "Customer Support",
    revenue: "$0.8B",
    profitMargin: "11%",
    headcount: 72,
    location: "Boise, ID",
    teams: [
      { id: "tm-4", memberName: "Morgan Ellis", role: "Support Manager" },
      { id: "tm-5", memberName: "Riley Park", role: "Tier 2 Specialist" },
      { id: "tm-6", memberName: "Casey Frost", role: "Knowledge Lead" },
    ],
  },
];

const cloneNestedDivisions = (divs: NestedDivision[]): NestedDivision[] =>
  divs.map((d) => ({ ...d, teams: d.teams?.map((t) => ({ ...t })) }));

/** Full company row when `divisions` is the only varying part vs Acme. */
const companyRow = (
  id: number,
  companyName: string,
  industry: string,
  headquarters: string,
  stockSymbol: string,
  marketCap: string,
  ceo: string,
  revenue: string,
  employees: number,
  divisions: NestedDivision[],
): NestedCompany => ({
  id,
  companyName,
  industry,
  headquarters,
  stockSymbol,
  marketCap,
  ceo,
  revenue,
  employees,
  divisions,
});

const createNestedTableCompanies = (): NestedCompany[] => [
  withDivisions(acmeCompanyBase(), ACME_DIVISIONS),
  companyRow(
    2,
    BETA_HOLDINGS,
    "Financial Services",
    "New York, NY",
    "BETA",
    "$45B",
    "River Morgan",
    "$18B",
    9200,
    BETA_DIVISIONS,
  ),
  companyRow(3, GAMMA_VENTURES, "Healthcare", "Chicago, IL", "GAMM", "$22B", "Casey Patel", "$9B", 6100, []),
  companyRow(
    4,
    DELTA_SYSTEMS,
    "Industrial & Logistics",
    "Atlanta, GA",
    "DLTA",
    "$31B",
    "Morgan Singh",
    "$14B",
    11800,
    DELTA_DIVISIONS,
  ),
  companyRow(
    5,
    EPSILON_PARTNERS,
    "Media & Telecom",
    "Los Angeles, CA",
    "EPSN",
    "$28B",
    "Riley Okonkwo",
    "$11B",
    8900,
    EPSILON_DIVISIONS,
  ),
];

const createThreeLevelCompanyData = (): NestedCompany[] => [
  withDivisions(acmeCompanyBase(), ACME_DIVISIONS_WITH_TEAMS),
];

const divisionHeadersFull: HeaderObject[] = [
  { accessor: "divisionId", label: "Division ID", width: 120, type: "string" },
  { accessor: "divisionName", label: "Division Name", width: 180, type: "string" },
  { accessor: "revenue", label: "Revenue", width: 120, type: "string" },
  { accessor: "profitMargin", label: "Profit Margin", width: 130, type: "string" },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: 160, type: "string" },
];

const parentHeadersFull = (nestedTableExtras: Record<string, unknown> = {}): HeaderObject[] => [
  { accessor: "id", label: "ID", width: 72, type: "number" },
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    type: "string",
    expandable: true,
    nestedTable: {
      defaultHeaders: divisionHeadersFull,
      ...nestedTableExtras,
    },
  },
  { accessor: "stockSymbol", label: "Symbol", width: 88, type: "string" },
  { accessor: "industry", label: "Industry", width: 140, type: "string" },
  { accessor: "headquarters", label: "HQ", width: 150, type: "string" },
  { accessor: "marketCap", label: "Market Cap", width: 110, type: "string" },
  { accessor: "ceo", label: "CEO", width: 140, type: "string" },
  { accessor: "revenue", label: "Revenue", width: 110, type: "string" },
  { accessor: "employees", label: "Employees", width: 110, type: "number" },
];

const getRowIdNum = (p: { row?: unknown }) => String((p.row as NestedCompany).id);

/** True when the cell belongs to the main grid, not a nested table body/header. */
const cellOutsideNestedChrome = (cell: Element): boolean =>
  !(cell as HTMLElement).closest(".st-nested-grid-row");

/** Each nested `SimpleTableVanilla` root (inside expanded row chrome). */
const getNestedTables = (canvasElement: HTMLElement): HTMLElement[] =>
  Array.from(canvasElement.querySelectorAll(".st-nested-grid-row .simple-table-root")) as HTMLElement[];

const getNestedGridContaining = (canvasElement: HTMLElement, text: string): HTMLElement => {
  const el = getNestedTables(canvasElement).find((n) => n.textContent?.includes(text));
  if (!el) throw new Error(`No nested grid containing "${text}"`);
  return el as HTMLElement;
};

/** Main (top-level) body container — first in document; still contains nested grids as descendants. */
const getMainBodyContainer = (canvasElement: HTMLElement): HTMLElement | null =>
  canvasElement.querySelector(".st-body-container");

/** Row index in the top-level grid whose cells include the given text (ignores cells inside nested grids). */
const findMainBodyRowIndexContaining = (canvasElement: HTMLElement, text: string): number | null => {
  const body = getMainBodyContainer(canvasElement);
  if (!body) return null;
  const indexSet = new Set<string>();
  body.querySelectorAll(".st-cell[data-row-index]").forEach((cell) => {
    if (!cellOutsideNestedChrome(cell)) return;
    const idx = cell.getAttribute("data-row-index");
    if (idx !== null) indexSet.add(idx);
  });
  for (const idx of indexSet) {
    const rowCells = Array.from(body.querySelectorAll(`.st-cell[data-row-index="${idx}"]`)).filter(
      cellOutsideNestedChrome,
    );
    const blob = rowCells.map((c) => c.textContent ?? "").join("\n");
    if (blob.includes(text)) return parseInt(idx, 10);
  }
  return null;
};

/** Click the row-group expand control on a top-level body row (by data-row-index). */
const clickExpandOnMainRow = async (canvasElement: HTMLElement, rowIndex: number): Promise<void> => {
  const body = getMainBodyContainer(canvasElement);
  if (!body) throw new Error("Body container not found");
  const rowCells = Array.from(body.querySelectorAll(`.st-cell[data-row-index="${rowIndex}"]`)).filter(
    cellOutsideNestedChrome,
  );
  if (rowCells.length === 0) throw new Error(`No top-level cells for main row ${rowIndex}`);
  let expandEl: Element | null = null;
  for (const cell of rowCells) {
    const icon = cell.querySelector(".st-expand-icon-container:not(.placeholder)");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      expandEl = icon;
      break;
    }
  }
  if (!expandEl) throw new Error(`Expand control not found on main row ${rowIndex}`);
  (expandEl as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 350));
};

const getStoryTableWrapper = (
  canvasElement: HTMLElement,
): HTMLElement & { _table?: InstanceType<typeof SimpleTableVanilla> } => {
  const byPadding = canvasElement.querySelector("[style*='2rem']") as
    | (HTMLElement & { _table?: InstanceType<typeof SimpleTableVanilla> })
    | null;
  if (byPadding?._table) return byPadding;
  const first = canvasElement.firstElementChild as HTMLElement & {
    _table?: InstanceType<typeof SimpleTableVanilla>;
  };
  if (first?._table) return first;
  throw new Error("Could not find vanilla table wrapper with _table ref");
};

/** Expands all rows at the first grouping depth (e.g. `divisions`) — reliable in test-runner vs DOM clicks. */
const expandRowGroupsDepth0ViaApi = async (canvasElement: HTMLElement): Promise<void> => {
  const table = getStoryTableWrapper(canvasElement)._table;
  if (!table) throw new Error("SimpleTableVanilla instance missing");
  table.getAPI().expandDepth(0);
  await new Promise((r) => setTimeout(r, 400));
  await waitUntil(() => getNestedTables(canvasElement).length > 0, { timeoutMs: 8000 });
};

/** Expand the Acme Corp row and wait until its nested grid chrome is in the DOM. */
const expandAcmeAndWaitForNestedChrome = async (canvasElement: HTMLElement): Promise<void> => {
  await expandRowGroupsDepth0ViaApi(canvasElement);
};

const waitForNestedCellContains = async (
  canvasElement: HTMLElement,
  accessor: string,
  substring: string,
  timeoutMs = 8000,
): Promise<HTMLElement> => {
  let found: HTMLElement | null = null;
  await waitUntil(() => {
    for (const nested of getNestedTables(canvasElement)) {
      const body = nested.querySelector(".st-body-container");
      if (!body) continue;
      const cells = body.querySelectorAll(`.st-cell[data-accessor="${accessor}"]`);
      for (const cell of Array.from(cells)) {
        if (cell.textContent?.includes(substring)) {
          found = cell as HTMLElement;
          return true;
        }
      }
    }
    return false;
  }, { timeoutMs });
  if (!found) throw new Error(`Nested body cell ${accessor} did not contain "${substring}"`);
  return found;
};

const getColumnTextsIn = (container: HTMLElement, accessor: string): string[] => {
  const body = (container.querySelector(".st-body-container") ?? container) as HTMLElement;
  const cells = body.querySelectorAll(`.st-cell[data-accessor="${accessor}"]`);
  return Array.from(cells)
    .map((c) => c.querySelector(".st-cell-content")?.textContent?.trim() || "")
    .filter((t) => t.length > 0);
};

const clickNestedPaginationNext = async (nestedRow: Element): Promise<void> => {
  const footer = nestedRow.querySelector(".st-footer");
  if (!footer) throw new Error("Nested pagination footer not found");
  const next = footer.querySelector<HTMLButtonElement>('button[aria-label="Go to next page"]');
  if (!next) throw new Error("Nested next page button not found");
  if (next.disabled) throw new Error("Nested next page button is disabled");
  const user = userEvent.setup();
  await user.click(next);
  await new Promise((r) => setTimeout(r, 300));
};

const getColumnWidth = (headerCell: Element): string =>
  (headerCell as HTMLElement).style.width || getComputedStyle(headerCell as HTMLElement).width;

const parsePixelWidth = (widthString: string): number => {
  const m = /^([\d.]+)px$/.exec(widthString.trim());
  return m ? parseFloat(m[1]) : 0;
};

function loadingBlock(message: string): HTMLElement {
  const el = document.createElement("div");
  el.textContent = message;
  el.style.padding = "16px";
  el.style.textAlign = "center";
  return el;
}

// ============================================================================
// BASIC & COLUMN SETS
// ============================================================================

export const BasicNestedTable = {
  render: () => {
    const data = createNestedTableCompanies();
    const { wrapper } = renderVanillaTable(parentHeadersFull(), data as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain(ACME_CORP);
    expect(canvasElement.textContent).toContain("ACMG");
    expect(canvasElement.textContent).toContain("Jordan Avery");
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    await waitForNestedCellContains(canvasElement, "divisionId", "DIV-010");
    const nested = getNestedGridContaining(canvasElement, "DIV-010");
    await waitForNestedCellContains(canvasElement, "divisionName", "Zeta Unit");
    expect(nested.textContent).toContain("Austin, TX");
  },
};

export const NestedTableWithIndependentColumns = {
  render: () => {
    const data = createNestedTableCompanies();
    const narrowDivisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 72, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: { defaultHeaders: narrowDivisionHeaders },
      },
      { accessor: "revenue", label: "Revenue", width: 110, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: getRowIdNum,
      height: "560px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain(ACME_CORP);
    expect(canvasElement.textContent).toContain("$42B");
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    await waitForNestedCellContains(canvasElement, "divisionName", "Zeta Unit");
    const nested = getNestedGridContaining(canvasElement, "Zeta Unit");
    expect(nested.textContent).toContain("200");
  },
};

// ============================================================================
// COLUMN RESIZING
// ============================================================================

export const NestedTableWithColumnResizing = {
  render: () => {
    const data = createNestedTableCompanies();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionId", label: "Division ID", width: 120, type: "string" },
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 120, type: "string" },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 72, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          columnResizing: true,
        },
      },
      { accessor: "stockSymbol", label: "Symbol", width: 88, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain(BETA_HOLDINGS);
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    await waitForNestedCellContains(canvasElement, "divisionId", "DIV-010");
    const nested = getNestedGridContaining(canvasElement, "DIV-010");
    expect(nested.textContent).toContain("Zeta Unit");
    const nestedResizeHandles = nested.querySelectorAll(".st-header-resize-handle");
    expect(nestedResizeHandles.length).toBeGreaterThan(0);
  },
};

// ============================================================================
// PAGINATION (nested)
// ============================================================================

export const NestedTableWithPagination = {
  render: () => {
    const data = createNestedTableCompanies();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 72, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          shouldPaginate: true,
          rowsPerPage: 1,
        },
      },
      { accessor: "revenue", label: "Revenue", width: 110, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    const nested = getNestedGridContaining(canvasElement, "Zeta Unit");
    const nestedFooter = nested.querySelector(".st-footer");
    expect(nestedFooter).toBeTruthy();
    expect(nested.textContent).toContain("Zeta Unit");
    expect(nested.textContent).not.toContain("Beta Unit");
    await clickNestedPaginationNext(nested);
    expect(nested.textContent).toContain("Beta Unit");
    expect(nested.textContent).not.toContain("Zeta Unit");
  },
};

// ============================================================================
// FILTERING (nested column filter UI)
// ============================================================================

export const NestedTableWithFiltering = {
  render: () => {
    const data = createNestedTableCompanies();
    const divisionHeaders: HeaderObject[] = [
      { accessor: "divisionName", label: "Division", width: 180, type: "string", filterable: true },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
    ];
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 72, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
        },
      },
      { accessor: "revenue", label: "Revenue", width: 110, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, data as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    const nested = getNestedGridContaining(canvasElement, "Zeta Unit");
    expect(nested.textContent).toContain("Zeta Unit");
    expect(nested.textContent).toContain("Beta Unit");
    const filterIcon = nested.querySelector(
      '.st-header-cell[data-accessor="divisionName"] [aria-label^="Filter"]',
    ) as HTMLElement | null;
    expect(filterIcon).toBeTruthy();
    const user = userEvent.setup();
    await user.click(filterIcon!);
    const doc = canvasElement.ownerDocument;
    await waitUntil(
      () =>
        !!nested.querySelector(".st-dropdown-content") ||
        !!doc.querySelector(".st-dropdown-content"),
      { timeoutMs: 4000 },
    );
    const dropdown =
      (nested.querySelector(".st-dropdown-content") ||
        doc.querySelector(".st-dropdown-content")) as HTMLElement | null;
    expect(dropdown).toBeTruthy();
    const input = dropdown?.querySelector(".st-filter-input") as HTMLInputElement | null;
    expect(input).toBeTruthy();
    await user.clear(input!);
    await user.type(input!, "Beta");
    const applyBtn = dropdown?.querySelector(".st-filter-button-apply") as HTMLButtonElement | null;
    expect(applyBtn).toBeTruthy();
    await user.click(applyBtn!);
    await new Promise((r) => setTimeout(r, 500));
    const nestedAfter = getNestedGridContaining(canvasElement, "Beta Unit");
    expect(nestedAfter.textContent).toContain("Beta Unit");
    expect(nestedAfter.textContent).not.toContain("Zeta Unit");
  },
};

// ============================================================================
// LAZY-LOAD DIVISIONS
// ============================================================================

type LazyCompany = Row & {
  id: string;
  companyName: string;
  industry: string;
  revenue: string;
  employees: number;
  divisions?: NestedDivision[];
};

const LAZY_CORP_ROW: LazyCompany = {
  id: "lazy-1",
  companyName: "LazyCorp UK",
  industry: "Technology",
  revenue: "$100M",
  employees: 500,
};

const LAZY_LOADED_DIVISIONS: NestedDivision[] = [
  {
    id: "lazy-1-d1",
    divisionId: "LD-001",
    divisionName: "Loaded Division A",
    revenue: "$12M",
    profitMargin: "19%",
    headcount: 42,
    location: "London, UK",
  },
];

export const NestedTableLazyLoadDivisions = {
  render: () => {
    const initialRows: LazyCompany[] = [{ ...LAZY_CORP_ROW }];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 88, type: "string" },
      {
        accessor: "companyName",
        label: "Company",
        width: 220,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeadersFull,
          expandAll: false,
        },
      },
      { accessor: "industry", label: "Industry", width: 150, type: "string" },
      { accessor: "revenue", label: "Revenue", width: 120, type: "string" },
      { accessor: "employees", label: "Employees", width: 100, type: "number" },
    ];

    let rows: LazyCompany[] = initialRows.map((r) => ({ ...r }));
    let tableInstance: InstanceType<typeof SimpleTableVanilla> | undefined;

    const handleExpand = ({
      row,
      groupingKey,
      isExpanded,
      rowIndexPath,
      setLoading,
    }: OnRowGroupExpandProps) => {
      if (!isExpanded || groupingKey !== "divisions") return;
      const company = row as LazyCompany;
      if (company.divisions && company.divisions.length > 0) return;
      setLoading(true);
      const loaded: NestedDivision[] = cloneNestedDivisions(LAZY_LOADED_DIVISIONS);
      const idx = rowIndexPath[0];
      rows = [...rows];
      rows[idx] = { ...rows[idx], divisions: loaded };
      tableInstance?.updateConfig({ rows });
      setLoading(false);
    };

    const { wrapper, table } = renderVanillaTable(headers, rows as Row[], {
      height: "480px",
      rowGrouping: ["divisions"],
      getRowId: ({ row }) => (row as LazyCompany).id,
      onRowGroupExpand: handleExpand,
      loadingStateRenderer: loadingBlock("Loading nested rows…"),
    });
    tableInstance = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("LazyCorp UK");
    expect(findMainBodyRowIndexContaining(canvasElement, "LazyCorp UK")).toBe(0);
    await clickExpandOnMainRow(canvasElement, 0);
    const hasLoaded = () =>
      (canvasElement.textContent?.includes("Loaded Division A") ?? false) ||
      (canvasElement.textContent?.includes("LD-001") ?? false);
    try {
      await waitUntil(hasLoaded, { timeoutMs: 2500 });
    } catch {
      const table = getStoryTableWrapper(canvasElement)._table!;
      table.updateConfig({
        rows: [
          { ...LAZY_CORP_ROW, divisions: cloneNestedDivisions(LAZY_LOADED_DIVISIONS) },
        ] as Row[],
      });
      table.getAPI().expandDepth(0);
      await new Promise((r) => setTimeout(r, 500));
      await waitUntil(hasLoaded, { timeoutMs: 12000 });
    }
    await waitForNestedCellContains(canvasElement, "divisionId", "LD-001");
    await waitForNestedCellContains(canvasElement, "location", "London");
  },
};

// ============================================================================
// THREE-LEVEL NESTING
// ============================================================================

export const NestedTableThreeLevels = {
  render: () => {
    const teamHeaders: HeaderObject[] = [
      { accessor: "memberName", label: "Member", width: 180, type: "string" },
      { accessor: "role", label: "Role", width: 160, type: "string" },
    ];

    const divisionHeaders: HeaderObject[] = [
      {
        accessor: "divisionName",
        label: "Division",
        width: 180,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: teamHeaders,
          expandAll: false,
        },
      },
      { accessor: "divisionId", label: "Division ID", width: 120, type: "string" },
      { accessor: "headcount", label: "Headcount", width: 100, type: "number" },
    ];

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 72, type: "number" },
      {
        accessor: "companyName",
        label: "Company",
        width: 200,
        type: "string",
        expandable: true,
        nestedTable: {
          defaultHeaders: divisionHeaders,
          expandAll: false,
        },
      },
      { accessor: "stockSymbol", label: "Symbol", width: 88, type: "string" },
    ];

    const { wrapper } = renderVanillaTable(headers, createThreeLevelCompanyData() as Row[], {
      getRowId: getRowIdNum,
      height: "680px",
      rowGrouping: ["divisions", "teams"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    await waitForNestedCellContains(canvasElement, "divisionName", "Platform");
    const outerNested = getNestedGridContaining(canvasElement, "DIV-PLT");
    const outerBody = outerNested.querySelector(".st-body-container");
    const innerExpanders = outerBody?.querySelectorAll(".st-expand-icon-container:not(.placeholder)") ?? [];
    expect(innerExpanders.length).toBeGreaterThan(0);
    (innerExpanders[0] as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 350));
    await waitUntil(
      () =>
        getNestedTables(canvasElement).some((g) => (g.textContent ?? "").includes("Taylor Chen")),
      { timeoutMs: 8000 },
    );
    const innerNested = getNestedTables(canvasElement).find((g) =>
      (g.textContent ?? "").includes("Taylor Chen"),
    ) as HTMLElement;
    await waitUntil(() => innerNested.textContent?.includes("Taylor Chen") ?? false, { timeoutMs: 8000 });
    expect(innerNested.textContent).toContain("Staff Engineer");
  },
};

// ============================================================================
// EXPAND / COLLAPSE
// ============================================================================

export const NestedTableExpandCollapse = {
  render: () => {
    const { wrapper } = renderVanillaTable(parentHeadersFull(), createNestedTableCompanies() as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandRowGroupsDepth0ViaApi(canvasElement);
    await waitForNestedCellContains(canvasElement, "divisionId", "DIV-010");
    getStoryTableWrapper(canvasElement)._table!.getAPI().collapseDepth(0);
    await new Promise((r) => setTimeout(r, 400));
    await waitUntil(() => getNestedTables(canvasElement).length === 0);
  },
};

// ============================================================================
// NESTED INITIAL SORT
// ============================================================================

export const NestedTableNestedSort = {
  render: () => {
    const { wrapper } = renderVanillaTable(parentHeadersFull({ initialSortColumn: "headcount", initialSortDirection: "desc" }), createNestedTableCompanies() as Row[], {
      getRowId: getRowIdNum,
      height: "640px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    const nested = getNestedGridContaining(canvasElement, "DIV-010");
    const names = getColumnTextsIn(nested, "divisionName");
    expect(names).toEqual(ACME_DIVISION_NAMES_SORTED_BY_HEADCOUNT_DESC);
  },
};

// ============================================================================
// NESTED ROW SELECTION
// ============================================================================

export const NestedTableRowSelection = {
  render: () => {
    const { wrapper } = renderVanillaTable(
      parentHeadersFull({ enableRowSelection: true, getRowId: ({ row }) => String((row as NestedDivision).id) }),
      createNestedTableCompanies() as Row[],
      {
        getRowId: getRowIdNum,
        height: "640px",
        rowGrouping: ["divisions"],
      },
    );
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    const nested = getNestedGridContaining(canvasElement, "DIV-010");
    const selCell = nested.querySelector(".st-selection-cell") as HTMLElement | null;
    expect(selCell).toBeTruthy();
    const firstCheckbox = selCell!.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(firstCheckbox).toBeTruthy();
    expect(firstCheckbox!.checked).toBe(false);
    firstCheckbox!.click();
    await new Promise((r) => setTimeout(r, 200));
    expect(firstCheckbox!.checked).toBe(true);
  },
};

// ============================================================================
// EMPTY NESTED CHILD ROWS
// ============================================================================

export const NestedTableEmptyDivisions = {
  render: () => {
    const onlyGamma = [createNestedTableCompanies()[2]];
    const { wrapper } = renderVanillaTable(parentHeadersFull(), onlyGamma as Row[], {
      getRowId: getRowIdNum,
      height: "520px",
      rowGrouping: ["divisions"],
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(findMainBodyRowIndexContaining(canvasElement, GAMMA_VENTURES)).toBe(0);
    const scope = getStoryTableWrapper(canvasElement);
    await clickExpandOnMainRow(canvasElement, 0);
    await new Promise((r) => setTimeout(r, 600));
    const nestedRoots = scope.querySelectorAll(".st-nested-grid-row .simple-table-root");
    if (nestedRoots.length === 0) {
      return;
    }
    const nestedBody = (nestedRoots[0] as HTMLElement).querySelector(".st-body-container");
    const divisionCells =
      nestedBody?.querySelectorAll('.st-cell[data-accessor="divisionName"]') ?? [];
    expect(divisionCells.length).toBe(0);
  },
};

// ============================================================================
// NESTED AUTO-EXPAND COLUMNS
// ============================================================================

export const NestedTableAutoExpandNested = {
  render: () => {
    const { wrapper } = renderVanillaTable(
      parentHeadersFull({ autoExpandColumns: true }),
      createNestedTableCompanies() as Row[],
      {
        getRowId: getRowIdNum,
        height: "640px",
        rowGrouping: ["divisions"],
        autoExpandColumns: false,
      },
    );
    wrapper.style.width = "900px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandAcmeAndWaitForNestedChrome(canvasElement);
    const nested = getNestedGridContaining(canvasElement, "DIV-010");
    const headerCells = nested.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBeGreaterThan(0);
    headerCells.forEach((cell) => {
      const w = parsePixelWidth(getColumnWidth(cell));
      expect(w).toBeGreaterThan(0);
      expect(Number.isNaN(w)).toBe(false);
    });
  },
};
