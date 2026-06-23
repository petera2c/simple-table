import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { SimpleTableVanilla } from "simple-table-core";
import type { CellRendererProps, SimpleTableConfig, TableAPI } from "simple-table-core";
import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, SimpleTableReactProps } from "@simple-table/react";

import { makeStockRows, stockHeaders, TICK_ACCESSORS, type StockRow } from "./data";
import type { LeakHarness, MountOptions, MountTarget, ScrollMetrics } from "./types";

const CORE_ROOT_ID = "core-root";
const REACT_ROOT_ID = "react-root";

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const microtask = () => Promise.resolve();
/** Let coalesced updateData flush + render + any scroll handler settle. */
const settle = async () => {
  await microtask();
  await nextFrame();
  await nextFrame();
};

/** Simple React cell renderer to exercise PortalBridge registration churn. */
const PriceCell: React.FC<CellRendererProps> = ({ value }) => (
  <span className="leak-price-cell">{String(value)}</span>
);

interface ActiveMount {
  target: MountTarget;
  rows: number;
  data: StockRow[];
  rowIdToIndex: Map<string, number>;
  getApi: () => TableAPI | null;
}

let active: ActiveMount | null = null;
let coreInstance: SimpleTableVanilla | null = null;
let reactRoot: Root | null = null;
let reactApi: TableAPI | null = null;
let sortDir: "asc" | "desc" = "desc";

function rootEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Harness root #${id} missing`);
  return el;
}

function buildIndexMap(data: StockRow[]): Map<string, number> {
  const map = new Map<string, number>();
  data.forEach((row, i) => map.set(row.id, i));
  return map;
}

function scrollContainer(): HTMLElement | null {
  if (!active) return null;
  const id = active.target === "core" ? CORE_ROOT_ID : REACT_ROOT_ID;
  return rootEl(id).querySelector<HTMLElement>(".st-body-container");
}

async function unmountInternal(): Promise<void> {
  if (coreInstance) {
    coreInstance.destroy();
    coreInstance = null;
    rootEl(CORE_ROOT_ID).innerHTML = "";
  }
  if (reactRoot) {
    // Synchronous unmount so the adapter's cleanup effect (instance.destroy())
    // runs before we measure.
    flushSync(() => reactRoot!.unmount());
    reactRoot = null;
    reactApi = null;
    rootEl(REACT_ROOT_ID).innerHTML = "";
  }
  active = null;
  await settle();
}

async function mountCore(options: MountOptions, data: StockRow[]): Promise<void> {
  const config: SimpleTableConfig = {
    defaultHeaders: stockHeaders,
    rows: data,
    height: options.height ?? 400,
    cellUpdateFlash: options.cellUpdateFlash ?? false,
    getRowId: ({ row }) => row.id as string,
  };
  const instance = new SimpleTableVanilla(rootEl(CORE_ROOT_ID), config);
  instance.mount();
  coreInstance = instance;
  active = {
    target: "core",
    rows: data.length,
    data,
    rowIdToIndex: buildIndexMap(data),
    getApi: () => coreInstance?.getAPI() ?? null,
  };
}

async function mountReact(options: MountOptions, data: StockRow[]): Promise<void> {
  const headers: ReactHeaderObject[] = stockHeaders.map((h) =>
    options.customRenderer && h.accessor === "price"
      ? ({ ...h, cellRenderer: PriceCell } as ReactHeaderObject)
      : (h as ReactHeaderObject),
  );

  const props: SimpleTableReactProps = {
    defaultHeaders: headers,
    rows: data,
    height: options.height ?? 400,
    cellUpdateFlash: options.cellUpdateFlash ?? false,
    getRowId: ({ row }) => row.id as string,
    ref: (api: TableAPI | null) => {
      reactApi = api;
    },
  } as SimpleTableReactProps;

  const root = createRoot(rootEl(REACT_ROOT_ID));
  reactRoot = root;
  // flushSync forces a synchronous commit so the adapter's layout effect (which
  // assigns the ref) runs before mount() resolves.
  flushSync(() => root.render(React.createElement(SimpleTable, props)));
  active = {
    target: "react",
    rows: data.length,
    data,
    rowIdToIndex: buildIndexMap(data),
    getApi: () => reactApi,
  };
}

const harness: LeakHarness = {
  async mount(options) {
    await unmountInternal();
    const data = makeStockRows(options.rows ?? 2000);
    if (options.target === "core") {
      await mountCore(options, data);
    } else {
      await mountReact(options, data);
    }
    await settle();
  },

  async unmount() {
    await unmountInternal();
  },

  state() {
    return { target: active?.target ?? null, rows: active?.rows ?? 0 };
  },

  async burst(totalUpdates) {
    if (!active) return 0;
    const api = active.getApi();
    if (!api) return 0;

    const visible = api.getVisibleRows();
    if (visible.length === 0) return 0;

    const { data, rowIdToIndex } = active;
    let made = 0;
    let tick = 0;

    while (made < totalUpdates) {
      for (const vr of visible) {
        const id = String((vr.row as StockRow).id);
        const idx = rowIdToIndex.get(id);
        if (idx === undefined) continue;

        const accessor = TICK_ACCESSORS[made % TICK_ACCESSORS.length];
        const base = (data[idx][accessor] as number) ?? 0;
        const next = Math.round((base + ((tick % 9) - 4) * 0.01) * 100) / 100;
        data[idx][accessor] = next;
        api.updateData({ accessor, rowIndex: idx, newValue: next });

        made++;
        if (made >= totalUpdates) break;
      }
      tick++;
      // Periodically yield a real macrotask so the microtask-coalesced flush,
      // rendering, and any flash timers can run mid-workload (mirrors a live feed).
      if (tick % 25 === 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
    }

    await settle();
    return made;
  },

  async scrollBy(px) {
    const el = scrollContainer();
    if (!el) return;
    el.scrollTop += px;
    await settle();
  },

  async scrollTo(px) {
    const el = scrollContainer();
    if (!el) return;
    el.scrollTop = px;
    await settle();
  },

  getScrollMetrics(): ScrollMetrics {
    const el = scrollContainer();
    if (!el) return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };
    return {
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    };
  },

  visibleRowCount() {
    const api = active?.getApi();
    return api ? api.getVisibleRows().length : 0;
  },

  cellRegistrySize() {
    if (!coreInstance) return -1;
    const registry = (coreInstance as unknown as { cellRegistry?: Map<string, unknown> })
      .cellRegistry;
    return registry ? registry.size : -1;
  },

  async toggleSort(accessor) {
    const api = active?.getApi();
    if (!api) return;
    sortDir = sortDir === "asc" ? "desc" : "asc";
    await api.applySortState({ accessor, direction: sortDir });
    await settle();
  },

  setQuickFilter(text) {
    const api = active?.getApi();
    if (!api) return;
    api.setQuickFilter(text);
  },
};

window.__leak = harness;
