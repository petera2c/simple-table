/**
 * Window Infinite Scroll Example – demonstrates `scrollParent` driving
 * virtualization and `onLoadMore` from an outer (page-like) scroll container.
 *
 * The table has no `height` / `maxHeight`. It grows to its natural size inside
 * an enclosing scroll container, and that container's scroll position is what
 * drives row recycling and the load-more callback. In a real app you'd usually
 * pass `scrollParent: "window"`; this story uses a fixed-height scrollable
 * `<div>` so the behavior is visible inside the Storybook iframe.
 */
import { SimpleTableVanilla } from "../../src/index";
import type { HeaderObject, Row } from "../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const INITIAL_ROWS = 50;
const BATCH_SIZE = 50;
const MAX_ROWS = 5_000;
const LOAD_DELAY_MS = 350;

const FIRST_NAMES = [
  "Elena",
  "Kai",
  "Amara",
  "Santiago",
  "Priya",
  "Magnus",
  "Zara",
  "Luca",
  "Sarah",
  "Olumide",
  "Isabella",
  "Dmitri",
  "Aiko",
  "Mateo",
  "Noor",
  "Fionn",
];
const LAST_NAMES = [
  "Vasquez",
  "Tanaka",
  "Okafor",
  "Rodriguez",
  "Chakraborty",
  "Eriksson",
  "Al-Rashid",
  "Rossi",
  "Kim",
  "Adebayo",
  "Chen",
  "Volkov",
];
const DEPARTMENTS = [
  "Engineering",
  "AI Research",
  "UX Design",
  "DevOps",
  "Marketing",
  "Product",
  "Sales",
  "Finance",
  "Operations",
];
const STATUSES = ["Active", "On Leave", "Remote", "Onsite"];

function generateRows(startIndex: number, count: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const first = FIRST_NAMES[idx % FIRST_NAMES.length];
    const last = LAST_NAMES[(idx * 3) % LAST_NAMES.length];
    rows.push({
      id: idx + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/'/g, "")}@example.com`,
      department: DEPARTMENTS[idx % DEPARTMENTS.length],
      status: STATUSES[idx % STATUSES.length],
      tenureYears: 1 + ((idx * 13) % 18),
      salary: 60_000 + Math.floor(((idx * 7919) % 120_000)),
    });
  }
  return rows;
}

const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number", align: "right" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 160 },
  { accessor: "email", label: "Email", width: 260 },
  { accessor: "department", label: "Department", width: 160 },
  { accessor: "status", label: "Status", width: 120 },
  {
    accessor: "tenureYears",
    label: "Tenure",
    width: 110,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `${value} yrs`,
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 140,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString()}`,
  },
];

export const windowInfiniteScrollExampleDefaults: Partial<UniversalVanillaArgs> = {
  // `height` / `maxHeight` are intentionally left off — the table grows to its
  // natural size inside the outer scrollContainer instead.
};

export function renderWindowInfiniteScrollExample(
  args?: Partial<UniversalVanillaArgs>,
): HTMLElement {
  const options = {
    ...defaultVanillaArgs,
    ...windowInfiniteScrollExampleDefaults,
    ...args,
  };

  const wrapper = document.createElement("div");

  const scrollContainer = document.createElement("div");
  Object.assign(scrollContainer.style, {
    height: "640px",
    overflow: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "32px",
    background: "#fafafa",
  });
  wrapper.appendChild(scrollContainer);

  const inner = document.createElement("div");
  inner.style.maxWidth = "1000px";
  inner.style.margin = "0 auto";
  scrollContainer.appendChild(inner);

  const heading = document.createElement("h1");
  heading.textContent = "Window-Scroll Infinite Loading";
  Object.assign(heading.style, {
    fontSize: "28px",
    margin: "0 0 12px 0",
    color: "#0f172a",
  });
  inner.appendChild(heading);

  const intro = document.createElement("p");
  intro.innerHTML =
    "This table has no <code>height</code> or <code>maxHeight</code> — it grows to fit its rows. " +
    "We pass <code>scrollParent</code> pointing at the outer scrolling box (or " +
    "<code>\"window\"</code> in a regular page) so the table virtualizes rows and fires " +
    "<code>onLoadMore</code> based on the parent's scroll position. The header pins to the " +
    "top of the outer scroll viewport as you scroll. Scroll down to load more.";
  Object.assign(intro.style, {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0 0 16px 0",
  });
  inner.appendChild(intro);

  const status = document.createElement("div");
  Object.assign(status.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    marginBottom: "16px",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "500",
  });
  inner.appendChild(status);

  const tableContainer = document.createElement("div");
  inner.appendChild(tableContainer);

  const footer = document.createElement("p");
  footer.textContent =
    "End of the demo content. As you scroll near the bottom, onLoadMore keeps firing until the dataset is exhausted.";
  Object.assign(footer.style, {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "24px 0 48px 0",
    textAlign: "center",
  });
  inner.appendChild(footer);

  let rows: Row[] = generateRows(0, INITIAL_ROWS);
  let loading = false;
  let hasMore = true;

  const updateStatus = () => {
    const dot =
      '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6366f1;"></span>';
    const label = loading
      ? "Loading more rows…"
      : hasMore
        ? `${rows.length.toLocaleString()} rows loaded · scroll for more`
        : `${rows.length.toLocaleString()} rows loaded · end of dataset`;
    status.innerHTML = `${dot}<span>${label}</span>`;
  };
  updateStatus();

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: HEADERS,
    rows,
    theme: options.theme,
    customTheme: options.customTheme,
    getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
    scrollParent: scrollContainer,
    infiniteScrollThreshold: 400,
    onLoadMore: () => {
      if (loading || !hasMore) return;
      loading = true;
      updateStatus();

      setTimeout(() => {
        const next = generateRows(rows.length, BATCH_SIZE);
        rows = [...rows, ...next];
        if (rows.length >= MAX_ROWS) {
          rows = rows.slice(0, MAX_ROWS);
          hasMore = false;
        }
        loading = false;
        table.update({ rows });
        updateStatus();
      }, LOAD_DELAY_MS);
    },
  });
  table.mount();

  // Hold a reference so the story container can dispose of the instance.
  (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;

  return wrapper;
}
