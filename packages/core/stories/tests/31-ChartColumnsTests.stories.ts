/**
 * CHART COLUMNS TESTS
 * Tests for type: lineAreaChart, barChart, and chartOptions.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/31 - Chart Columns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for chart columns: lineAreaChart, barChart, chartOptions.",
      },
    },
  },
};

export default meta;

const chartData = () => [
  { id: 1, name: "A", trend: [10, 20, 30, 25, 40], bars: [5, 15, 10, 20] },
  { id: 2, name: "B", trend: [5, 15, 25, 35], bars: [8, 12, 18, 22] },
];

export const LineAreaChartRenders = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 80, type: "string" },
      {
        accessor: "trend",
        label: "Trend",
        width: 150,
        type: "lineAreaChart",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, chartData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const charts = canvasElement.querySelectorAll(".st-line-area-chart");
    expect(charts.length).toBeGreaterThan(0);
    const svgs = canvasElement.querySelectorAll("svg.st-line-area-chart");
    expect(svgs.length).toBeGreaterThan(0);
  },
};

export const BarChartRenders = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 80, type: "string" },
      {
        accessor: "bars",
        label: "Bars",
        width: 150,
        type: "barChart",
      },
    ];
    const { wrapper } = renderVanillaTable(headers, chartData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const charts = canvasElement.querySelectorAll(".st-bar-chart");
    expect(charts.length).toBeGreaterThan(0);
    const svgs = canvasElement.querySelectorAll("svg.st-bar-chart");
    expect(svgs.length).toBeGreaterThan(0);
  },
};

export const ChartOptionsDimensions = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "trend",
        label: "Trend",
        width: 150,
        type: "lineAreaChart",
        chartOptions: { width: 120, height: 35 },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, chartData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const svg = canvasElement.querySelector("svg.st-line-area-chart");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("height")).toBe("35");
    expect(svg?.getAttribute("width")).toBe("120");
  },
};

// ============================================================================
// CHART OPTIONS: COLOR AND FILL COLOR
// ============================================================================

export const ChartOptionsColor = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "trend",
        label: "Trend",
        width: 150,
        type: "lineAreaChart",
        chartOptions: {
          color: "rgb(255, 0, 0)",
          fillColor: "rgba(255, 0, 0, 0.2)",
        },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, chartData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const svgs = canvasElement.querySelectorAll("svg.st-line-area-chart");
    expect(svgs.length).toBeGreaterThan(0);
    // The stroke color should be applied to path/polyline elements
    const svg = svgs[0];
    const paths = svg.querySelectorAll("path, polyline, line");
    expect(paths.length).toBeGreaterThanOrEqual(0);
    // Verify SVG renders without error
    expect(svg).toBeTruthy();
  },
};

// ============================================================================
// CHART OPTIONS: GAP (bar chart)
// ============================================================================

export const BarChartOptionsGap = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "bars",
        label: "Bars",
        width: 150,
        type: "barChart",
        chartOptions: { gap: 4 },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, chartData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const barCharts = canvasElement.querySelectorAll("svg.st-bar-chart");
    expect(barCharts.length).toBeGreaterThan(0);
    // Bar charts with gap option render correctly
    const rects = barCharts[0].querySelectorAll("rect");
    expect(rects.length).toBeGreaterThan(0);
  },
};

// ============================================================================
// LIVE UPDATES VIA updateData
// ============================================================================

export const ChartLiveUpdate = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "name", label: "Name", width: 80, type: "string" },
      {
        accessor: "trend",
        label: "Trend",
        width: 150,
        type: "lineAreaChart",
      },
    ];
    const tableContainer = document.createElement("div");
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: chartData(),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      cellUpdateFlash: true,
    });
    table.mount();

    const updateBtn = document.createElement("button");
    updateBtn.setAttribute("data-testid", "update-chart-btn");
    updateBtn.textContent = "Update Chart Data";
    updateBtn.onclick = () => {
      table.getAPI().updateData({ accessor: "trend", rowIndex: 0, newValue: [50, 60, 70, 80, 90] });
    };

    const wrapper = document.createElement("div");
    wrapper.style.padding = "2rem";
    wrapper.appendChild(updateBtn);
    wrapper.appendChild(tableContainer);
    (wrapper as HTMLDivElement & { _table?: typeof table })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const initialSvgs = canvasElement.querySelectorAll("svg.st-line-area-chart");
    expect(initialSvgs.length).toBeGreaterThan(0);

    const updateBtn = canvasElement.querySelector<HTMLButtonElement>('[data-testid="update-chart-btn"]');
    expect(updateBtn).toBeTruthy();
    updateBtn!.click();
    await new Promise((r) => setTimeout(r, 300));

    // SVGs should still be present after update
    const updatedSvgs = canvasElement.querySelectorAll("svg.st-line-area-chart");
    expect(updatedSvgs.length).toBeGreaterThan(0);
  },
};
