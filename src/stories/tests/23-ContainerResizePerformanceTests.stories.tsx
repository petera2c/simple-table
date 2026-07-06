import type { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { expect, userEvent } from "@storybook/test";
import { HeaderObject, Row, SimpleTable } from "../..";
import { CONTAINER_RESIZE_SETTLE_MS } from "../../hooks/resizeCoalescing";

/**
 * CONTAINER RESIZE PERFORMANCE REPRO
 *
 * Simulates a collapsible global left nav that animates width and squeezes the
 * main content area — the layout pattern reported on Artist/Platform pages.
 *
 * During the CSS transition, the table container fires ResizeObserver callbacks
 * on every frame. In v2 that drives:
 *   - useTableDimensions → setContainerWidth (full SimpleTable re-render)
 *   - useAutoScaleMainSection → setHeaders when autoExpandColumns + Δwidth > 10px
 *   - TableBody ResizeObserver → setColumnViewport (column window recalc)
 *
 * Use the HUD metrics while toggling the nav, or run the automated play test.
 */

// ---------------------------------------------------------------------------
// Shared perf probe (readable from play functions via window)
// ---------------------------------------------------------------------------

export interface ContainerResizePerfSnapshot {
  contentWidthChanges: number;
  tableContainerWidthChanges: number;
  gridTemplateChanges: number;
  cellRendererInvokes: number;
  /** React state updates from useTableDimensions (the metric we optimize). */
  containerWidthStateUpdates: number;
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
  gridTemplateChanges: 0,
  cellRendererInvokes: 0,
  containerWidthStateUpdates: 0,
  lastContentWidth: 0,
});

// ---------------------------------------------------------------------------
// Data — wide table similar to analytics / platform pages
// ---------------------------------------------------------------------------

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

const createPlatformHeaders = (useCustomRenderer: boolean): HeaderObject[] => {
  let cellRendererInvokeCount = 0;

  const metricCellRenderer = useCustomRenderer
    ? ({ value }: { value: unknown }) => {
        cellRendererInvokeCount += 1;
        if (window.__containerResizePerf) {
          window.__containerResizePerf.cellRendererInvokes = cellRendererInvokeCount;
        }
        const numeric = typeof value === "number" ? value : 0;
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              width: "100%",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: Math.min(48, Math.max(8, (numeric % 50) + 8)),
                height: 6,
                borderRadius: 3,
                background: "rgba(59, 130, 246, 0.55)",
              }}
            />
            {numeric.toLocaleString()}
          </span>
        );
      }
    : undefined;

  const metricColumns: HeaderObject[] = PLATFORM_METRICS.map((metric) => ({
    accessor: metric,
    label: metric.charAt(0).toUpperCase() + metric.slice(1),
    width: 120,
    align: "right" as const,
    isSortable: true,
    cellRenderer: metricCellRenderer,
  }));

  return [
    { accessor: "id", label: "ID", width: 64, pinned: "left", isSortable: true },
    { accessor: "platform", label: "Platform", width: 140, pinned: "left", isSortable: true },
    { accessor: "territory", label: "Territory", width: 100, isSortable: true },
    ...metricColumns,
  ];
};

// ---------------------------------------------------------------------------
// Layout shell — animated collapsible left nav
// ---------------------------------------------------------------------------

const NAV_EXPANDED_WIDTH = 240;
const NAV_COLLAPSED_WIDTH = 64;
const NAV_TRANSITION_MS = 300;

interface CollapsibleNavLayoutProps {
  showTable: boolean;
  autoExpandColumns: boolean;
  useCustomRenderer: boolean;
  rowCount?: number;
}

const MetricsHud = ({ snapshot }: { snapshot: ContainerResizePerfSnapshot }) => (
  <div
    data-testid="resize-perf-hud"
    style={{
      position: "sticky",
      top: 0,
      zIndex: 2,
      marginBottom: 12,
      padding: "10px 12px",
      borderRadius: 8,
      background: "rgba(15, 23, 42, 0.92)",
      color: "#e2e8f0",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: 12,
      lineHeight: 1.5,
    }}
  >
    <div style={{ fontWeight: 700, marginBottom: 4 }}>Resize perf HUD</div>
    <div>Content width changes: {snapshot.contentWidthChanges}</div>
    <div>Table container width changes: {snapshot.tableContainerWidthChanges}</div>
    <div>Grid template updates: {snapshot.gridTemplateChanges}</div>
    <div>containerWidth state updates: {snapshot.containerWidthStateUpdates}</div>
    <div>Custom cellRenderer invokes: {snapshot.cellRendererInvokes}</div>
    <div style={{ marginTop: 6, opacity: 0.75 }}>
      Toggle the nav — high counts during one transition suggest resize churn.
    </div>
  </div>
);

const CollapsibleNavLayout = ({
  showTable,
  autoExpandColumns,
  useCustomRenderer,
  rowCount = 40,
}: CollapsibleNavLayoutProps) => {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const tableHostRef = useRef<HTMLDivElement>(null);
  const tableProbeCleanupRef = useRef<(() => void) | null>(null);
  const [perf, setPerf] = useState<ContainerResizePerfSnapshot>(createPerfSnapshot);

  const headers = useMemo(
    () => createPlatformHeaders(useCustomRenderer),
    [useCustomRenderer],
  );
  const rows = useMemo(() => createPlatformRows(rowCount), [rowCount]);

  const resetPerf = useCallback(() => {
    const next = createPerfSnapshot();
    window.__containerResizePerf = next;
    setPerf(next);
  }, []);

  // Track content-area width changes (proxy for nav-driven layout shifts).
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    resetPerf();

    let lastWidth = content.clientWidth;
    window.__containerResizePerf!.lastContentWidth = lastWidth;

    const ro = new ResizeObserver(() => {
      const width = content.clientWidth;
      if (width !== lastWidth) {
        lastWidth = width;
        const snap = window.__containerResizePerf!;
        snap.contentWidthChanges += 1;
        snap.lastContentWidth = width;
        setPerf({ ...snap });
      }
    });

    ro.observe(content);
    return () => ro.disconnect();
  }, [resetPerf, showTable, autoExpandColumns, useCustomRenderer]);

  // Keep HUD in sync with containerWidth state updates recorded by the table.
  useEffect(() => {
    const syncFromWindow = () => {
      if (window.__containerResizePerf) {
        setPerf({ ...window.__containerResizePerf });
      }
    };
    window.addEventListener("st-container-width-update", syncFromWindow);
    return () => window.removeEventListener("st-container-width-update", syncFromWindow);
  }, []);

  const attachTableProbes = useCallback(() => {
    tableProbeCleanupRef.current?.();
    tableProbeCleanupRef.current = null;

    if (!showTable) return;

    const host = tableHostRef.current;
    if (!host) return;

    const tableContainer = host.querySelector(".st-body-container") as HTMLElement | null;
    const headerMain = host.querySelector(".st-header-main") as HTMLElement | null;
    if (!tableContainer || !headerMain) return;

    const snap = window.__containerResizePerf ?? createPerfSnapshot();
    window.__containerResizePerf = snap;

    let lastTableWidth = tableContainer.clientWidth;
    let lastGridTemplate = headerMain.style.gridTemplateColumns;

    const tableRo = new ResizeObserver(() => {
      const width = tableContainer.clientWidth;
      if (width !== lastTableWidth) {
        lastTableWidth = width;
        snap.tableContainerWidthChanges += 1;
        setPerf({ ...snap });
      }
    });
    tableRo.observe(tableContainer);

    const mo = new MutationObserver(() => {
      const nextTemplate = headerMain.style.gridTemplateColumns;
      if (nextTemplate && nextTemplate !== lastGridTemplate) {
        lastGridTemplate = nextTemplate;
        snap.gridTemplateChanges += 1;
        setPerf({ ...snap });
      }
    });
    mo.observe(headerMain, { attributes: true, attributeFilter: ["style"] });

    tableProbeCleanupRef.current = () => {
      tableRo.disconnect();
      mo.disconnect();
    };
  }, [showTable]);

  // Re-attach table probes once SimpleTable has painted into the host.
  useEffect(() => {
    if (!showTable) {
      tableProbeCleanupRef.current?.();
      tableProbeCleanupRef.current = null;
      return;
    }

    attachTableProbes();
    const retry = window.setInterval(() => {
      if (tableHostRef.current?.querySelector(".st-body-container")) {
        attachTableProbes();
        window.clearInterval(retry);
      }
    }, 50);

    return () => {
      window.clearInterval(retry);
      tableProbeCleanupRef.current?.();
      tableProbeCleanupRef.current = null;
    };
  }, [showTable, attachTableProbes, headers, rows, autoExpandColumns]);

  const toggleNav = () => setNavCollapsed((value) => !value);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f1f5f9",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <nav
        data-testid="global-left-nav"
        style={{
          flexShrink: 0,
          width: navCollapsed ? NAV_COLLAPSED_WIDTH : NAV_EXPANDED_WIDTH,
          transition: `width ${NAV_TRANSITION_MS}ms ease`,
          background: "#0f172a",
          color: "#f8fafc",
          padding: "16px 12px",
          overflow: "hidden",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, whiteSpace: "nowrap" }}>
          {navCollapsed ? "≡" : "Global Nav"}
        </div>
        {!navCollapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <span>Artists</span>
            <span>Platforms</span>
            <span>Reports</span>
            <span>Settings</span>
          </div>
        )}
      </nav>

      <main
        ref={contentRef}
        data-testid="main-content"
        style={{
          flex: 1,
          minWidth: 0,
          padding: 16,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button
            type="button"
            data-testid="nav-toggle"
            onClick={toggleNav}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {navCollapsed ? "Expand nav" : "Collapse nav"}
          </button>
          <button
            type="button"
            data-testid="reset-metrics"
            onClick={resetPerf}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Reset metrics
          </button>
          <span style={{ color: "#475569", fontSize: 14 }}>
            {showTable
              ? `Table on · autoExpand=${autoExpandColumns ? "yes" : "no"} · customRenderer=${
                  useCustomRenderer ? "yes" : "no"
                }`
              : "No table (baseline)"}
          </span>
        </div>

        <MetricsHud snapshot={perf} />

        {showTable ? (
          <div ref={tableHostRef} data-testid="table-host">
            <SimpleTable
              defaultHeaders={headers}
              rows={rows}
              maxHeight="calc(100vh - 180px)"
              autoExpandColumns={autoExpandColumns}
              columnResizing
            />
          </div>
        ) : (
          <div
            data-testid="baseline-panel"
            style={{
              height: 360,
              borderRadius: 8,
              border: "1px dashed #94a3b8",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#475569",
              fontSize: 15,
            }}
          >
            Baseline content — toggle nav without a table to compare animation smoothness.
          </div>
        )}
      </main>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Storybook meta + tests
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Tests/23 - Container Resize Performance",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

const waitForTable = async (timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (document.querySelector(".simple-table-root")) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

const waitForTransition = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms + 80));

/** Poll table container width during a CSS transition (reliable in test-runner). */
const countTableWidthChangesDuring = async (
  host: HTMLElement,
  action: () => Promise<void>,
  durationMs: number,
): Promise<{ tableWidthChanges: number; gridTemplateChanges: number }> => {
  const tableContainer = host.querySelector(".st-body-container") as HTMLElement | null;
  const headerMain = host.querySelector(".st-header-main") as HTMLElement | null;
  if (!tableContainer || !headerMain) {
    throw new Error("Table probe targets not found");
  }

  let tableWidthChanges = 0;
  let gridTemplateChanges = 0;
  let lastTableWidth = tableContainer.clientWidth;
  let lastGridTemplate = headerMain.style.gridTemplateColumns;

  const poll = window.setInterval(() => {
    const width = tableContainer.clientWidth;
    if (width !== lastTableWidth) {
      lastTableWidth = width;
      tableWidthChanges += 1;
    }
    const template = headerMain.style.gridTemplateColumns;
    if (template && template !== lastGridTemplate) {
      lastGridTemplate = template;
      gridTemplateChanges += 1;
    }
  }, 16);

  await action();
  await waitForTransition(durationMs);
  window.clearInterval(poll);

  return { tableWidthChanges, gridTemplateChanges };
};

// Interactive repro — heaviest case (autoExpand + custom renderers + wide grid)
export const CollapsibleNavWithTable: StoryObj = {
  tags: ["container-resize-perf"],
  render: () => (
    <CollapsibleNavLayout showTable autoExpandColumns useCustomRenderer rowCount={40} />
  ),
};

// Same layout without autoExpandColumns
export const CollapsibleNavTableNoAutoExpand: StoryObj = {
  tags: ["container-resize-perf"],
  render: () => (
    <CollapsibleNavLayout
      showTable
      autoExpandColumns={false}
      useCustomRenderer
      rowCount={40}
    />
  ),
};

// Baseline — nav animation only, no table
export const CollapsibleNavBaseline: StoryObj = {
  tags: ["container-resize-perf"],
  render: () => (
    <CollapsibleNavLayout
      showTable={false}
      autoExpandColumns={false}
      useCustomRenderer={false}
    />
  ),
};

// Automated benchmark: one nav toggle should coalesce resize into a single settled
// React update (not one per animation frame).
export const NavToggleCoalescesTableRelayout: StoryObj = {
  tags: ["container-resize-perf"],
  render: () => (
    <CollapsibleNavLayout showTable autoExpandColumns useCustomRenderer rowCount={30} />
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const resetButton = canvasElement.querySelector(
      '[data-testid="reset-metrics"]',
    ) as HTMLButtonElement | null;
    const toggleButton = canvasElement.querySelector(
      '[data-testid="nav-toggle"]',
    ) as HTMLButtonElement | null;

    if (!resetButton || !toggleButton) {
      throw new Error("Resize perf controls not found");
    }

    const tableHost = canvasElement.querySelector('[data-testid="table-host"]') as HTMLElement;
    if (!tableHost) throw new Error("Table host not found");

    const user = userEvent.setup();
    await user.click(resetButton);

    const stateUpdatesBefore =
      window.__containerResizePerf?.containerWidthStateUpdates ?? 0;

    const { gridTemplateChanges } = await countTableWidthChangesDuring(
      tableHost,
      async () => {
        await user.click(toggleButton);
      },
      NAV_TRANSITION_MS,
    );

    // Wait for the 150ms settle timer after the 300ms CSS transition.
    await waitForTransition(CONTAINER_RESIZE_SETTLE_MS);

    const stateUpdatesAfter =
      window.__containerResizePerf?.containerWidthStateUpdates ?? 0;
    const stateUpdatesDuringToggle = stateUpdatesAfter - stateUpdatesBefore;

    const contentWidthChanges = window.__containerResizePerf?.contentWidthChanges ?? 0;

    // Nav animation still resizes the content area (CSS transition — expected).
    expect(contentWidthChanges).toBeGreaterThan(2);

    // Coalesced: one settled containerWidth publish for this toggle, not per frame.
    expect(stateUpdatesDuringToggle).toBeLessThanOrEqual(1);

    // autoExpand rescale runs once after settle, not throughout the transition.
    expect(gridTemplateChanges).toBeLessThanOrEqual(2);
  },
};

// Compare baseline vs table: baseline should see content width changes but no grid churn.
export const BaselineNavHasNoTableGridChurn: StoryObj = {
  tags: ["container-resize-perf"],
  render: () => (
    <CollapsibleNavLayout
      showTable={false}
      autoExpandColumns={false}
      useCustomRenderer={false}
    />
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const resetButton = canvasElement.querySelector(
      '[data-testid="reset-metrics"]',
    ) as HTMLButtonElement | null;
    const toggleButton = canvasElement.querySelector(
      '[data-testid="nav-toggle"]',
    ) as HTMLButtonElement | null;

    if (!resetButton || !toggleButton) {
      throw new Error("Resize perf controls not found");
    }

    const user = userEvent.setup();
    await user.click(resetButton);

    const before = { ...(window.__containerResizePerf ?? createPerfSnapshot()) };

    await user.click(toggleButton);
    await waitForTransition(NAV_TRANSITION_MS);

    const after = window.__containerResizePerf ?? createPerfSnapshot();

    expect(after.contentWidthChanges - before.contentWidthChanges).toBeGreaterThan(2);
    expect(after.tableContainerWidthChanges - before.tableContainerWidthChanges).toBe(0);
    expect(after.gridTemplateChanges - before.gridTemplateChanges).toBe(0);
  },
};
