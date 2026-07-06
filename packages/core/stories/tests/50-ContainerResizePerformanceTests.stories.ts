/**
 * CONTAINER RESIZE PERFORMANCE REPRO
 *
 * Simulates a collapsible global left nav that animates width and squeezes the
 * main content area — the layout pattern reported on Artist/Platform pages.
 *
 * During the CSS transition, the table container's ResizeObserver fires on
 * successive frames. DimensionManager coalesces those ticks (trailing debounce)
 * so subscribers / full renders fire once after the transition settles.
 *
 * Use the HUD while toggling the nav, or run the automated play test.
 * The play test asserts coalesced table relayouts (header width updates), not
 * raw container ResizeObserver ticks — the DOM still resizes every animation frame.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { SimpleTableVanilla, type HeaderObject, type Row } from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";

const meta: Meta = {
  title: "Tests/50 - Container Resize Performance",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Reproduces resize churn when a collapsible left nav animates and squeezes a wide auto-expand table.",
      },
    },
  },
};

export default meta;

// ---------------------------------------------------------------------------
// Perf probe (readable from play functions via window)
// ---------------------------------------------------------------------------

interface ContainerResizePerfSnapshot {
  contentWidthChanges: number;
  tableContainerWidthChanges: number;
  /** Batched header relayout passes (one per table render), not per-cell updates. */
  tableRelayouts: number;
  lastContentWidth: number;
}

declare global {
  interface Window {
    __containerResizePerf?: ContainerResizePerfSnapshot;
  }
}

const createPerfSnapshot = (): ContainerResizePerfSnapshot => ({
  contentWidthChanges: 0,
  tableContainerWidthChanges: 0,
  tableRelayouts: 0,
  lastContentWidth: 0,
});

const getPerf = (): ContainerResizePerfSnapshot => {
  if (!window.__containerResizePerf) {
    window.__containerResizePerf = createPerfSnapshot();
  }
  return window.__containerResizePerf;
};

export const resetContainerResizePerf = (lastContentWidth = 0): void => {
  const perf = getPerf();
  perf.contentWidthChanges = 0;
  perf.tableContainerWidthChanges = 0;
  perf.tableRelayouts = 0;
  perf.lastContentWidth = lastContentWidth;
};

const NAV_EXPANDED_WIDTH = 240;
const NAV_COLLAPSED_WIDTH = 64;
const NAV_TRANSITION_MS = 300;

const PLATFORM_METRICS = [
  "streams",
  "listeners",
  "followers",
  "saves",
  "shares",
  "playlistAdds",
  "revenue",
  "rpm",
  "ctr",
  "impressions",
  "clicks",
  "conversions",
] as const;

const createPlatformRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => {
    const row: Row = {
      id: index + 1,
      platform: ["Spotify", "Apple Music", "YouTube", "Amazon", "Tidal"][index % 5],
      territory: ["US", "UK", "DE", "FR", "JP"][index % 5],
    };
    PLATFORM_METRICS.forEach((metric, metricIndex) => {
      row[metric] = Math.round((index + 1) * (metricIndex + 2) * 137.5);
    });
    return row;
  });

const createPlatformHeaders = (): HeaderObject[] => [
  { accessor: "id", label: "ID", width: 64, pinned: "left", type: "number" },
  { accessor: "platform", label: "Platform", width: 140, pinned: "left", type: "string" },
  { accessor: "territory", label: "Territory", width: 100, type: "string" },
  ...PLATFORM_METRICS.map((metric) => ({
    accessor: metric,
    label: metric.charAt(0).toUpperCase() + metric.slice(1),
    width: 120,
    align: "right" as const,
    type: "number" as const,
    isSortable: true,
  })),
];

const waitForTransition = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms + 80));

interface LayoutOptions {
  showTable: boolean;
  autoExpandColumns: boolean;
  rowCount?: number;
}

function buildCollapsibleNavLayout({
  showTable,
  autoExpandColumns,
  rowCount = 40,
}: LayoutOptions): HTMLDivElement {
  const root = document.createElement("div");
  root.style.display = "flex";
  root.style.width = "1280px";
  root.style.height = "100vh";
  root.style.background = "#f1f5f9";
  root.style.fontFamily = "system-ui, sans-serif";

  let navCollapsed = false;
  window.__containerResizePerf = createPerfSnapshot();

  const nav = document.createElement("nav");
  nav.dataset.testid = "global-left-nav";
  nav.style.flexShrink = "0";
  nav.style.transition = `width ${NAV_TRANSITION_MS}ms ease`;
  nav.style.background = "#0f172a";
  nav.style.color = "#f8fafc";
  nav.style.padding = "16px 12px";
  nav.style.overflow = "hidden";

  const setNavWidth = () => {
    nav.style.width = `${navCollapsed ? NAV_COLLAPSED_WIDTH : NAV_EXPANDED_WIDTH}px`;
  };
  setNavWidth();

  const navTitle = document.createElement("div");
  navTitle.style.fontWeight = "700";
  navTitle.style.marginBottom = "16px";
  navTitle.style.whiteSpace = "nowrap";
  nav.appendChild(navTitle);

  const navLinks = document.createElement("div");
  navLinks.style.display = "flex";
  navLinks.style.flexDirection = "column";
  navLinks.style.gap = "8px";
  navLinks.style.fontSize = "14px";
  ["Artists", "Platforms", "Reports", "Settings"].forEach((label) => {
    const link = document.createElement("span");
    link.textContent = label;
    navLinks.appendChild(link);
  });
  nav.appendChild(navLinks);

  const main = document.createElement("main");
  main.dataset.testid = "main-content";
  main.style.flex = "1";
  main.style.minWidth = "0";
  main.style.padding = "16px";
  main.style.overflow = "auto";

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "12px";
  controls.style.marginBottom = "12px";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.dataset.testid = "nav-toggle";
  toggleButton.style.padding = "8px 14px";
  toggleButton.style.borderRadius = "6px";
  toggleButton.style.border = "1px solid #cbd5e1";
  toggleButton.style.background = "#fff";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.fontWeight = "600";

  const status = document.createElement("span");
  status.style.color = "#475569";
  status.style.fontSize = "14px";

  const hud = document.createElement("div");
  hud.dataset.testid = "resize-perf-hud";
  hud.style.position = "sticky";
  hud.style.top = "0";
  hud.style.zIndex = "2";
  hud.style.marginBottom = "12px";
  hud.style.padding = "10px 12px";
  hud.style.borderRadius = "8px";
  hud.style.background = "rgba(15, 23, 42, 0.92)";
  hud.style.color = "#e2e8f0";
  hud.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  hud.style.fontSize = "12px";
  hud.style.lineHeight = "1.5";

  const renderHud = () => {
    const perf = getPerf();
    navTitle.textContent = navCollapsed ? "≡" : "Global Nav";
    navLinks.style.display = navCollapsed ? "none" : "flex";
    toggleButton.textContent = navCollapsed ? "Expand nav" : "Collapse nav";
    status.textContent = showTable
      ? `Table on · autoExpand=${autoExpandColumns ? "yes" : "no"}`
      : "No table (baseline)";
    hud.innerHTML = [
      "<div style='font-weight:700;margin-bottom:4px'>Resize perf HUD</div>",
      `<div>Content width changes: ${perf.contentWidthChanges}</div>`,
      `<div>Table container width changes: ${perf.tableContainerWidthChanges}</div>`,
      `<div>Table relayout passes: ${perf.tableRelayouts}</div>`,
      "<div style='margin-top:6px;opacity:0.75'>Toggle the nav — high counts during one transition suggest resize churn.</div>",
    ].join("");
  };

  const resetPerf = () => {
    resetContainerResizePerf(main.clientWidth);
    renderHud();
  };

  toggleButton.addEventListener("click", () => {
    navCollapsed = !navCollapsed;
    setNavWidth();
    renderHud();
  });

  controls.appendChild(toggleButton);
  controls.appendChild(status);
  main.appendChild(controls);
  main.appendChild(hud);

  let tableHost: HTMLDivElement | null = null;
  let tableInstance: SimpleTableVanilla | null = null;

  if (showTable) {
    tableHost = document.createElement("div");
    tableHost.dataset.testid = "table-host";
    main.appendChild(tableHost);

    tableInstance = new SimpleTableVanilla(tableHost, {
      defaultHeaders: createPlatformHeaders(),
      rows: createPlatformRows(rowCount),
      getRowId: (p) => String((p.row as { id?: number }).id),
      maxHeight: "calc(100vh - 180px)",
      autoExpandColumns,
      columnResizing: true,
      animations: { enabled: false },
    });
    tableInstance.mount();
  } else {
    const baseline = document.createElement("div");
    baseline.dataset.testid = "baseline-panel";
    baseline.style.height = "360px";
    baseline.style.borderRadius = "8px";
    baseline.style.border = "1px dashed #94a3b8";
    baseline.style.background =
      "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))";
    baseline.style.display = "flex";
    baseline.style.alignItems = "center";
    baseline.style.justifyContent = "center";
    baseline.style.color = "#475569";
    baseline.style.fontSize = "15px";
    baseline.textContent =
      "Baseline content — toggle nav without a table to compare animation smoothness.";
    main.appendChild(baseline);
  }

  const attachTableProbes = () => {
    const tableContainer = root.querySelector(".st-body-container") as HTMLElement | null;
    const headerCells = Array.from(root.querySelectorAll<HTMLElement>(".st-header-cell"));
    if (!tableContainer || headerCells.length === 0) return false;

    let lastTableWidth = tableContainer.clientWidth;
    const tableRo = new ResizeObserver(() => {
      const perf = getPerf();
      const width = tableContainer.clientWidth;
      if (width !== lastTableWidth) {
        lastTableWidth = width;
        perf.tableContainerWidthChanges += 1;
        renderHud();
      }
    });
    tableRo.observe(tableContainer);

    const lastHeaderWidths = new Map<HTMLElement, string>();
    headerCells.forEach((cell) => lastHeaderWidths.set(cell, cell.style.width));
    let relayoutRaf: number | null = null;
    const headerMo = new MutationObserver((mutations) => {
      let changed = false;
      for (const mutation of mutations) {
        const cell = mutation.target as HTMLElement;
        const nextWidth = cell.style.width;
        const prevWidth = lastHeaderWidths.get(cell) ?? "";
        if (nextWidth && nextWidth !== prevWidth) {
          lastHeaderWidths.set(cell, nextWidth);
          changed = true;
        }
      }
      if (!changed || relayoutRaf !== null) return;
      relayoutRaf = requestAnimationFrame(() => {
        relayoutRaf = null;
        getPerf().tableRelayouts += 1;
        renderHud();
      });
    });
    headerCells.forEach((cell) => {
      headerMo.observe(cell, { attributes: true, attributeFilter: ["style"] });
    });

    return true;
  };

  let contentWidth = main.clientWidth;
  getPerf().lastContentWidth = contentWidth;
  const contentRo = new ResizeObserver(() => {
    const perf = getPerf();
    const width = main.clientWidth;
    if (width !== contentWidth) {
      contentWidth = width;
      perf.contentWidthChanges += 1;
      perf.lastContentWidth = width;
      renderHud();
    }
  });
  contentRo.observe(main);

  if (showTable) {
    let attempts = 0;
    const attachTimer = window.setInterval(() => {
      attempts += 1;
      if (attachTableProbes() || attempts > 40) {
        window.clearInterval(attachTimer);
      }
    }, 50);
  }

  renderHud();
  resetPerf();

  root.appendChild(nav);
  root.appendChild(main);
  return root;
}

// Interactive repro — heaviest case (autoExpand + wide grid)
export const CollapsibleNavWithTable = {
  tags: ["container-resize-perf"],
  render: () =>
    buildCollapsibleNavLayout({ showTable: true, autoExpandColumns: true, rowCount: 40 }),
};

// Same layout without autoExpandColumns
export const CollapsibleNavTableNoAutoExpand = {
  tags: ["container-resize-perf"],
  render: () =>
    buildCollapsibleNavLayout({ showTable: true, autoExpandColumns: false, rowCount: 40 }),
};

// Baseline — nav animation only, no table
export const CollapsibleNavBaseline = {
  tags: ["container-resize-perf"],
  render: () =>
    buildCollapsibleNavLayout({ showTable: false, autoExpandColumns: false, rowCount: 0 }),
};

// One nav toggle should coalesce table relayouts — currently fails until fixed.
export const NavToggleCoalescesTableRelayout = {
  tags: ["container-resize-perf"],
  render: () =>
    buildCollapsibleNavLayout({ showTable: true, autoExpandColumns: true, rowCount: 30 }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await waitUntil(
      () =>
        !!canvasElement.querySelector(".st-body-container") &&
        canvasElement.querySelectorAll(".st-header-cell").length > 0,
      { timeoutMs: 5000, intervalMs: 50 },
    );

    const toggleButton = canvasElement.querySelector(
      '[data-testid="nav-toggle"]',
    ) as HTMLButtonElement | null;
    if (!toggleButton) throw new Error("Nav toggle control not found");

    // Reset after probes have attached so the toggle window is measured cleanly.
    resetContainerResizePerf(
      (canvasElement.querySelector('[data-testid="main-content"]') as HTMLElement | null)
        ?.clientWidth ?? 0,
    );

    const user = userEvent.setup();
    await user.click(toggleButton);
    await waitForTransition(NAV_TRANSITION_MS);

    const after = getPerf();

    // Nav animation must have actually resized the content area.
    expect(after.contentWidthChanges).toBeGreaterThan(2);

    // Coalesced: table should relayout at most twice during the whole transition.
    expect(after.tableRelayouts).toBeLessThanOrEqual(2);
  },
};

// Baseline should resize content but has no table host to churn against.
export const BaselineNavHasNoTableGridChurn = {
  tags: ["container-resize-perf"],
  render: () =>
    buildCollapsibleNavLayout({ showTable: false, autoExpandColumns: false, rowCount: 0 }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    expect(canvasElement.querySelector('[data-testid="table-host"]')).toBeNull();
    expect(canvasElement.querySelector(".st-body-container")).toBeNull();

    const toggleButton = canvasElement.querySelector(
      '[data-testid="nav-toggle"]',
    ) as HTMLButtonElement | null;
    if (!toggleButton) throw new Error("Nav toggle control not found");

    const before = { ...getPerf() };

    const user = userEvent.setup();
    await user.click(toggleButton);
    await waitForTransition(NAV_TRANSITION_MS);

    const after = getPerf();

    expect(after.contentWidthChanges - before.contentWidthChanges).toBeGreaterThan(2);
  },
};
