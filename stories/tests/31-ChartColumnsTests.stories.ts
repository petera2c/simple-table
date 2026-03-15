/**
 * CHART COLUMNS TESTS
 * Tests for type: lineAreaChart, barChart, and chartOptions.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
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
