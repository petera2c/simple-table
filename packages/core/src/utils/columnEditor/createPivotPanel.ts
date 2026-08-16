import type { AggregationType } from "../../types/AggregationTypes";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type { PivotConfig, PivotValueConfig } from "../../types/PivotTypes";
import { createCloseIcon } from "../../icons/CloseIcon";
import { createCustomSelect } from "../filters/createCustomSelect";

const AGG_TYPES: AggregationType[] = ["sum", "average", "count", "min", "max"];

const AGG_OPTIONS = AGG_TYPES.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

type PivotZone = "rows" | "columns" | "values";

type PanelPivotState = {
  rows: Accessor[];
  columns: Accessor[];
  values: { accessor: Accessor; aggregation: AggregationType }[];
};

const EMPTY_STATE: PanelPivotState = { rows: [], columns: [], values: [] };

function flattenLeafHeaders(headers: ColumnDef[]): ColumnDef[] {
  const leaves: ColumnDef[] = [];
  const walk = (list: ColumnDef[]) => {
    for (const header of list) {
      if (header.isSelectionColumn || header.excludeFromRender) continue;
      if (header.children && header.children.length > 0) {
        walk(header.children);
      } else {
        leaves.push(header);
      }
    }
  };
  walk(headers);
  return leaves;
}

function isMeasure(header: ColumnDef): boolean {
  return header.type === "number";
}

function toPanelState(pivot: PivotConfig | null | undefined): PanelPivotState {
  if (!pivot) return structuredClone(EMPTY_STATE);
  return {
    rows: [...pivot.rows],
    columns: [...pivot.columns],
    values: pivot.values.map((v) => ({
      accessor: v.accessor,
      aggregation: (v.aggregation?.type ?? "sum") as AggregationType,
    })),
  };
}

function toPivotConfig(state: PanelPivotState): PivotConfig | null {
  if (state.values.length === 0) return null;
  const values: PivotValueConfig[] = state.values.map((v) => ({
    accessor: v.accessor,
    aggregation: { type: v.aggregation },
  }));
  return {
    rows: [...state.rows],
    columns: [...state.columns],
    values,
  };
}

function fieldLabel(fields: ColumnDef[], accessor: Accessor): string {
  return fields.find((f) => f.accessor === accessor)?.label ?? String(accessor);
}

export type CreatePivotPanelOptions = {
  fields: ColumnDef[];
  pivot: PivotConfig | null;
  setPivot: (pivot: PivotConfig | null) => void;
};

export type PivotPanelInstance = {
  element: HTMLElement;
  update: (options: Partial<CreatePivotPanelOptions>) => void;
  destroy: () => void;
};

/**
 * Interactive pivot field composer: Available fields + Rows / Columns / Values.
 */
export function createPivotPanel(options: CreatePivotPanelOptions): PivotPanelInstance {
  let fields = flattenLeafHeaders(options.fields);
  let state = toPanelState(options.pivot);
  let setPivot = options.setPivot;
  const selectInstances: Array<ReturnType<typeof createCustomSelect>> = [];

  const root = document.createElement("div");
  root.className = "st-pivot-panel";

  const availableHost = document.createElement("div");
  availableHost.className = "st-pivot-panel-zone";
  availableHost.dataset.pivotZone = "available";

  const rowsHost = document.createElement("div");
  rowsHost.className = "st-pivot-panel-zone";
  rowsHost.dataset.pivotZone = "rows";

  const colsHost = document.createElement("div");
  colsHost.className = "st-pivot-panel-zone";
  colsHost.dataset.pivotZone = "columns";

  const valsHost = document.createElement("div");
  valsHost.className = "st-pivot-panel-zone";
  valsHost.dataset.pivotZone = "values";

  root.append(availableHost, rowsHost, colsHost, valsHost);

  const commit = () => {
    // Local paint first; setPivot re-renders the table and syncs panel state back.
    render();
    setPivot(toPivotConfig(state));
  };

  const removeFromAll = (accessor: Accessor) => {
    state.rows = state.rows.filter((a) => a !== accessor);
    state.columns = state.columns.filter((a) => a !== accessor);
    state.values = state.values.filter((v) => v.accessor !== accessor);
  };

  const place = (accessor: Accessor, zone: PivotZone) => {
    const header = fields.find((f) => f.accessor === accessor);
    if (!header) return;

    if (zone === "values") {
      if (!isMeasure(header)) return;
      removeFromAll(accessor);
      state.values = [...state.values, { accessor, aggregation: "sum" }];
    } else {
      if (isMeasure(header)) return;
      removeFromAll(accessor);
      if (zone === "rows") state.rows = [...state.rows, accessor];
      else state.columns = [...state.columns, accessor];
    }
    commit();
  };

  const makeSectionLabel = (text: string) => {
    const label = document.createElement("div");
    label.className = "st-pivot-panel-zone-title";
    label.textContent = text;
    return label;
  };

  const makeList = () => {
    const list = document.createElement("div");
    list.className = "st-column-editor-list st-pivot-panel-zone-list";
    return list;
  };

  const makeEmpty = (text: string) => {
    const empty = document.createElement("div");
    empty.className = "st-pivot-panel-zone-empty";
    empty.textContent = text;
    return empty;
  };

  const makeActionBtn = (text: string, onClick: () => void) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "st-pivot-panel-action";
    btn.textContent = text;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  };

  const makeChip = (
    accessor: Accessor,
    zone: PivotZone,
    aggregation?: AggregationType
  ): HTMLElement => {
    const chip = document.createElement("div");
    chip.className = "st-pivot-panel-chip";

    const label = document.createElement("span");
    label.className = "st-pivot-panel-chip-label";
    label.textContent = fieldLabel(fields, accessor);
    chip.appendChild(label);

    if (zone === "values" && aggregation) {
      const select = createCustomSelect({
        value: aggregation,
        className: "st-pivot-panel-agg",
        options: AGG_OPTIONS,
        onChange: (next) => {
          const target = state.values.find((v) => v.accessor === accessor);
          if (!target || target.aggregation === next) return;
          target.aggregation = next as AggregationType;
          commit();
        },
      });
      select.element.dataset.agg = aggregation;
      select.element.addEventListener("click", (e) => e.stopPropagation());
      selectInstances.push(select);
      chip.appendChild(select.element);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "st-column-pin-btn st-pivot-panel-remove";
    remove.setAttribute("aria-label", `Remove ${fieldLabel(fields, accessor)}`);
    remove.appendChild(createCloseIcon("st-column-pin-svg"));
    remove.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromAll(accessor);
      commit();
    });
    chip.appendChild(remove);
    return chip;
  };

  const renderZone = (
    host: HTMLElement,
    title: string,
    zone: PivotZone,
    accessors: Accessor[],
    emptyText: string,
    valueAggs?: { accessor: Accessor; aggregation: AggregationType }[]
  ) => {
    host.replaceChildren();
    host.appendChild(makeSectionLabel(title));
    const list = makeList();
    if (accessors.length === 0) {
      list.appendChild(makeEmpty(emptyText));
    } else if (zone === "values" && valueAggs) {
      for (const v of valueAggs) {
        list.appendChild(makeChip(v.accessor, "values", v.aggregation));
      }
    } else {
      for (const accessor of accessors) {
        list.appendChild(makeChip(accessor, zone));
      }
    }
    host.appendChild(list);
  };

  const renderAvailable = () => {
    availableHost.replaceChildren();
    availableHost.appendChild(makeSectionLabel("Available"));
    const list = makeList();

    const used = new Set<string>([
      ...state.rows.map(String),
      ...state.columns.map(String),
      ...state.values.map((v) => String(v.accessor)),
    ]);
    const available = fields.filter((f) => !used.has(String(f.accessor)));

    if (available.length === 0) {
      list.appendChild(makeEmpty("All fields placed"));
    } else {
      for (const header of available) {
        const row = document.createElement("div");
        row.className = "st-pivot-panel-field";

        const label = document.createElement("span");
        label.className = "st-pivot-panel-field-label";
        label.textContent = header.label;
        row.appendChild(label);

        const actions = document.createElement("div");
        actions.className = "st-pivot-panel-field-actions";

        if (isMeasure(header)) {
          actions.appendChild(makeActionBtn("Values", () => place(header.accessor, "values")));
        } else {
          actions.appendChild(makeActionBtn("Rows", () => place(header.accessor, "rows")));
          actions.appendChild(makeActionBtn("Columns", () => place(header.accessor, "columns")));
        }
        row.appendChild(actions);
        list.appendChild(row);
      }
    }
    availableHost.appendChild(list);
  };

  const destroySelects = () => {
    while (selectInstances.length > 0) {
      selectInstances.pop()?.destroy();
    }
  };

  const render = () => {
    destroySelects();
    renderAvailable();
    renderZone(rowsHost, "Rows", "rows", state.rows, "Add dimensions");
    renderZone(colsHost, "Columns", "columns", state.columns, "Add dimensions");
    renderZone(
      valsHost,
      "Values",
      "values",
      state.values.map((v) => v.accessor),
      "Add measures",
      state.values
    );
  };

  render();

  return {
    element: root,
    update: (next) => {
      if (next.fields !== undefined) fields = flattenLeafHeaders(next.fields);
      if (next.setPivot !== undefined) setPivot = next.setPivot;
      if (next.pivot !== undefined) {
        // Config wins when pivot is active (has values) or when an active
        // pivot is cleared externally. While values are empty, rows/columns
        // may be staged in the panel with setPivot(null) — keep that draft.
        if (next.pivot !== null) {
          state = toPanelState(next.pivot);
        } else if (state.values.length > 0) {
          state = toPanelState(null);
        }
      }
      render();
    },
    destroy: () => {
      destroySelects();
      root.remove();
    },
  };
}
