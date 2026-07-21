/**
 * PivotExample – interactive playground for declarative matrix pivot.
 */
import type {
  AggregationType,
  ColumnDef,
  PivotConfig,
  PivotValueConfig,
  Row,
  Accessor,
} from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";
import { renderVanillaTable, addParagraph } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const DIMENSION_FIELDS = [
  { accessor: "region", label: "Region" },
  { accessor: "country", label: "Country" },
  { accessor: "category", label: "Category" },
  { accessor: "product", label: "Product" },
  { accessor: "year", label: "Year" },
  { accessor: "quarter", label: "Quarter" },
] as const;

const MEASURE_FIELDS = [
  { accessor: "sales", label: "Sales" },
  { accessor: "units", label: "Units" },
  { accessor: "cost", label: "Cost" },
] as const;

const AGG_TYPES: AggregationType[] = ["sum", "average", "count", "min", "max"];

const HEADERS: ColumnDef[] = [
  ...DIMENSION_FIELDS.map((f) => ({
    accessor: f.accessor,
    label: f.label,
    width: 110,
    type: "string" as const,
    filterable: true,
    sortable: true,
  })),
  {
    accessor: "sales",
    label: "Sales",
    width: 100,
    type: "number",
    align: "right",
    sortable: true,
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `$${value.toLocaleString()}` : "",
  },
  {
    accessor: "units",
    label: "Units",
    width: 80,
    type: "number",
    align: "right",
    sortable: true,
  },
  {
    accessor: "cost",
    label: "Cost",
    width: 100,
    type: "number",
    align: "right",
    sortable: true,
    valueFormatter: ({ value }: { value?: unknown }) =>
      typeof value === "number" ? `$${value.toLocaleString()}` : "",
  },
];

const REGIONS = ["West", "East", "North", "South"] as const;
const COUNTRIES: Record<(typeof REGIONS)[number], string[]> = {
  West: ["USA", "Canada"],
  East: ["USA", "UK"],
  North: ["Canada", "Sweden"],
  South: ["Brazil", "Australia"],
};
const CATEGORIES = ["Hardware", "Software"] as const;
const PRODUCTS: Record<(typeof CATEGORIES)[number], string[]> = {
  Hardware: ["Widget", "Gadget", "Sensor"],
  Software: ["License", "Subscription"],
};
const YEARS = [2024, 2025] as const;
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

function buildPlaygroundRows(): Row[] {
  const rows: Row[] = [];
  let id = 1;
  for (const region of REGIONS) {
    for (const country of COUNTRIES[region]) {
      for (const category of CATEGORIES) {
        for (const product of PRODUCTS[category]) {
          for (const year of YEARS) {
            for (const quarter of QUARTERS) {
              // Sparse facts — not every combo has a row
              if ((id + year + quarter.charCodeAt(1)) % 3 === 0) {
                id++;
                continue;
              }
              const base = 40 + ((id * 17) % 90);
              rows.push({
                id: `r${id}`,
                region,
                country,
                category,
                product,
                year,
                quarter,
                sales: base * 100,
                units: base,
                cost: Math.round(base * 55),
              });
              id++;
            }
          }
        }
      }
    }
  }
  return rows;
}

const PLAYGROUND_ROWS = buildPlaygroundRows();

type PlaygroundState = {
  rows: Accessor[];
  columns: Accessor[];
  values: { accessor: Accessor; aggregation: AggregationType }[];
  showRowTotals: boolean;
  showColumnTotals: boolean;
  showGrandTotal: boolean;
  enabled: boolean;
};

const DEFAULT_STATE: PlaygroundState = {
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: "sum" }],
  showRowTotals: true,
  showColumnTotals: true,
  showGrandTotal: true,
  enabled: true,
};

const PRESETS: { label: string; state: PlaygroundState }[] = [
  {
    label: "Region × Quarter",
    state: {
      ...DEFAULT_STATE,
      rows: ["region"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: "sum" }],
    },
  },
  {
    label: "Region → Product × Quarter",
    state: {
      ...DEFAULT_STATE,
      rows: ["region", "product"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: "sum" }],
    },
  },
  {
    label: "Category × Year → Quarter",
    state: {
      ...DEFAULT_STATE,
      rows: ["category"],
      columns: ["year", "quarter"],
      values: [{ accessor: "sales", aggregation: "sum" }],
    },
  },
  {
    label: "Sales + Units",
    state: {
      ...DEFAULT_STATE,
      rows: ["region"],
      columns: ["quarter"],
      values: [
        { accessor: "sales", aggregation: "sum" },
        { accessor: "units", aggregation: "sum" },
      ],
    },
  },
  {
    label: "Country × Category (avg)",
    state: {
      ...DEFAULT_STATE,
      rows: ["country"],
      columns: ["category"],
      values: [{ accessor: "sales", aggregation: "average" }],
      showColumnTotals: false,
    },
  },
  {
    label: "Values only (no cols)",
    state: {
      ...DEFAULT_STATE,
      rows: ["region", "category"],
      columns: [],
      values: [
        { accessor: "sales", aggregation: "sum" },
        { accessor: "cost", aggregation: "sum" },
      ],
    },
  },
];

function stateToPivot(state: PlaygroundState): PivotConfig | null {
  if (!state.enabled || state.values.length === 0) return null;
  const values: PivotValueConfig[] = state.values.map((v) => ({
    accessor: v.accessor,
    aggregation: { type: v.aggregation },
    label: MEASURE_FIELDS.find((m) => m.accessor === v.accessor)?.label,
  }));
  return {
    rows: [...state.rows],
    columns: [...state.columns],
    values,
    showRowTotals: state.showRowTotals,
    showColumnTotals: state.showColumnTotals,
    showGrandTotal: state.showGrandTotal,
  };
}

function styleButton(btn: HTMLButtonElement, active = false): void {
  btn.type = "button";
  btn.style.padding = "6px 12px";
  btn.style.border = "1px solid #cbd5e1";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "13px";
  btn.style.backgroundColor = active ? "#2563eb" : "#fff";
  btn.style.color = active ? "#fff" : "#0f172a";
}

function styleChip(btn: HTMLButtonElement, active: boolean, tone: "row" | "col" | "val"): void {
  styleButton(btn, active);
  if (active) {
    const colors = { row: "#059669", col: "#7c3aed", val: "#d97706" };
    btn.style.backgroundColor = colors[tone];
    btn.style.borderColor = colors[tone];
  }
}

function createSection(title: string, hint: string): HTMLDivElement {
  const section = document.createElement("div");
  section.style.marginBottom = "1rem";
  const h = document.createElement("div");
  h.style.display = "flex";
  h.style.alignItems = "baseline";
  h.style.gap = "0.5rem";
  h.style.marginBottom = "0.4rem";
  const t = document.createElement("strong");
  t.textContent = title;
  t.style.fontSize = "13px";
  const s = document.createElement("span");
  s.textContent = hint;
  s.style.fontSize = "12px";
  s.style.color = "#64748b";
  h.append(t, s);
  section.appendChild(h);
  return section;
}

function createChipRow(): HTMLDivElement {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.flexWrap = "wrap";
  row.style.gap = "0.4rem";
  return row;
}

export const pivotExampleDefaults = {
  columnResizing: true,
  height: "480px",
  expandAll: true,
  columnBorders: true,
  pivot: stateToPivot(DEFAULT_STATE),
};

/**
 * Interactive pivot feature demo: configure rows / columns / values / totals live.
 */
export function renderPivotExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const state: PlaygroundState = structuredClone(DEFAULT_STATE);

  const options = {
    ...defaultVanillaArgs,
    ...pivotExampleDefaults,
    ...args,
    pivot: stateToPivot(state),
  };

  const { wrapper, h2, tableContainer, table } = renderVanillaTable(
    HEADERS,
    PLAYGROUND_ROWS,
    options
  );
  h2.textContent = "Pivot";
  addParagraph(
    wrapper,
    "Toggle fields below; changes apply immediately via TableAPI.setPivot.",
    tableContainer
  );

  const panel = document.createElement("div");
  panel.style.marginBottom = "1.25rem";
  panel.style.padding = "1rem 1.1rem";
  panel.style.background =
    "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)";
  panel.style.border = "1px solid #e2e8f0";
  panel.style.borderRadius = "10px";
  panel.style.fontFamily =
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  // --- Presets ---
  const presetsSection = createSection("Presets", "one-click configurations");
  const presetRow = createChipRow();
  for (const preset of PRESETS) {
    const btn = document.createElement("button");
    btn.textContent = preset.label;
    styleButton(btn);
    btn.addEventListener("click", () => {
      Object.assign(state, structuredClone(preset.state));
      state.enabled = true;
      renderControls();
      applyPivot();
    });
    presetRow.appendChild(btn);
  }
  presetsSection.appendChild(presetRow);

  // --- Dynamic control hosts ---
  const rowsHost = createSection("Row fields", "click to toggle · order = click order");
  const colsHost = createSection("Column fields", "become dynamic header groups");
  const valsHost = createSection("Value fields", "pick measure + aggregation");
  const totalsHost = createSection("Totals", "row / column / grand");
  const actionsHost = createSection("Actions", "API helpers");

  const rowsChips = createChipRow();
  const colsChips = createChipRow();
  const valsArea = document.createElement("div");
  valsArea.style.display = "flex";
  valsArea.style.flexDirection = "column";
  valsArea.style.gap = "0.4rem";
  const totalsRow = createChipRow();
  const actionsRow = createChipRow();

  rowsHost.appendChild(rowsChips);
  colsHost.appendChild(colsChips);
  valsHost.appendChild(valsArea);
  totalsHost.appendChild(totalsRow);
  actionsHost.appendChild(actionsRow);

  panel.append(presetsSection, rowsHost, colsHost, valsHost, totalsHost, actionsHost);
  wrapper.insertBefore(panel, tableContainer);

  const toggleInList = (list: Accessor[], accessor: Accessor): Accessor[] => {
    const idx = list.indexOf(accessor);
    if (idx >= 0) {
      const next = [...list];
      next.splice(idx, 1);
      return next;
    }
    // Keep a field from living in both rows and columns
    return [...list, accessor];
  };

  const applyPivot = () => {
    const api = (table as SimpleTableVanilla).getAPI();
    api.setPivot(stateToPivot(state));
  };

  const renderControls = () => {
    rowsChips.replaceChildren();
    for (const field of DIMENSION_FIELDS) {
      const active = state.rows.includes(field.accessor);
      const btn = document.createElement("button");
      const order = active ? ` ${state.rows.indexOf(field.accessor) + 1}` : "";
      btn.textContent = `${field.label}${order}`;
      styleChip(btn, active, "row");
      btn.addEventListener("click", () => {
        state.columns = state.columns.filter((a) => a !== field.accessor);
        state.rows = toggleInList(state.rows, field.accessor);
        renderControls();
        applyPivot();
      });
      rowsChips.appendChild(btn);
    }

    colsChips.replaceChildren();
    for (const field of DIMENSION_FIELDS) {
      const active = state.columns.includes(field.accessor);
      const btn = document.createElement("button");
      const order = active ? ` ${state.columns.indexOf(field.accessor) + 1}` : "";
      btn.textContent = `${field.label}${order}`;
      styleChip(btn, active, "col");
      btn.addEventListener("click", () => {
        state.rows = state.rows.filter((a) => a !== field.accessor);
        state.columns = toggleInList(state.columns, field.accessor);
        renderControls();
        applyPivot();
      });
      colsChips.appendChild(btn);
    }

    valsArea.replaceChildren();
    for (const field of MEASURE_FIELDS) {
      const existing = state.values.find((v) => v.accessor === field.accessor);
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "0.5rem";

      const chip = document.createElement("button");
      chip.textContent = field.label;
      styleChip(chip, Boolean(existing), "val");
      chip.style.minWidth = "88px";
      chip.addEventListener("click", () => {
        if (existing) {
          state.values = state.values.filter((v) => v.accessor !== field.accessor);
        } else {
          state.values = [
            ...state.values,
            { accessor: field.accessor, aggregation: "sum" },
          ];
        }
        renderControls();
        applyPivot();
      });

      const select = document.createElement("select");
      select.disabled = !existing;
      select.style.padding = "5px 8px";
      select.style.borderRadius = "6px";
      select.style.border = "1px solid #cbd5e1";
      select.style.fontSize = "13px";
      for (const agg of AGG_TYPES) {
        const opt = document.createElement("option");
        opt.value = agg;
        opt.textContent = agg;
        if (existing?.aggregation === agg) opt.selected = true;
        select.appendChild(opt);
      }
      select.addEventListener("change", () => {
        const target = state.values.find((v) => v.accessor === field.accessor);
        if (target) {
          target.aggregation = select.value as AggregationType;
          applyPivot();
        }
      });

      row.append(chip, select);
      valsArea.appendChild(row);
    }

    totalsRow.replaceChildren();
    const totalDefs: {
      key: "showRowTotals" | "showColumnTotals" | "showGrandTotal" | "enabled";
      label: string;
    }[] = [
      { key: "showRowTotals", label: "Row totals" },
      { key: "showColumnTotals", label: "Column totals" },
      { key: "showGrandTotal", label: "Grand total" },
      { key: "enabled", label: "Pivot enabled" },
    ];
    for (const def of totalDefs) {
      const btn = document.createElement("button");
      const on = state[def.key];
      btn.textContent = `${def.label}: ${on ? "on" : "off"}`;
      styleButton(btn, on);
      if (def.key === "enabled") {
        btn.style.backgroundColor = on ? "#16a34a" : "#94a3b8";
        btn.style.color = "#fff";
        btn.style.borderColor = "transparent";
      }
      btn.addEventListener("click", () => {
        state[def.key] = !state[def.key];
        renderControls();
        applyPivot();
      });
      totalsRow.appendChild(btn);
    }

    actionsRow.replaceChildren();
    const expandBtn = document.createElement("button");
    expandBtn.textContent = "Expand all";
    styleButton(expandBtn);
    expandBtn.addEventListener("click", () => table.getAPI().expandAll());
    const collapseBtn = document.createElement("button");
    collapseBtn.textContent = "Collapse all";
    styleButton(collapseBtn);
    collapseBtn.addEventListener("click", () => table.getAPI().collapseAll());
    const csvBtn = document.createElement("button");
    csvBtn.textContent = "Export CSV";
    styleButton(csvBtn);
    csvBtn.addEventListener("click", () =>
      table.getAPI().exportToCSV({ filename: "pivot-playground.csv" })
    );
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear pivot";
    styleButton(clearBtn);
    clearBtn.style.backgroundColor = "#fee2e2";
    clearBtn.style.borderColor = "#fecaca";
    clearBtn.addEventListener("click", () => {
      state.enabled = false;
      renderControls();
      applyPivot();
    });
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset default";
    styleButton(resetBtn);
    resetBtn.addEventListener("click", () => {
      Object.assign(state, structuredClone(DEFAULT_STATE));
      renderControls();
      applyPivot();
    });
    actionsRow.append(expandBtn, collapseBtn, csvBtn, clearBtn, resetBtn);
  };

  renderControls();
  applyPivot();
  return wrapper;
}
