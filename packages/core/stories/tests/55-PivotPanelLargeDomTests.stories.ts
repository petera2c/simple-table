/**
 * Large-grid Pivot Panel DOM tests.
 * Clicks panel actions against 480 source rows / 10 columns, then asserts
 * the rendered header + body HTML matches the expected pivot matrix.
 */
import type { Meta, StoryObj } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { buildPivotAccessor, buildPivotRowTotalAccessor } from "../../src/index";
import { waitForTable, waitUntil, getRowCount } from "./testUtils";
import { renderVanillaTable } from "../utils";
import {
  LARGE_CHANNELS,
  LARGE_PIVOT_ROWS,
  LARGE_PRODUCTS,
  LARGE_QUARTERS,
  LARGE_REGIONS,
  LARGE_YEARS,
  formatSalesDom,
  pivotPanelLargeDefaults,
  renderPivotPanelLargeExample,
  sumMeasure,
} from "../examples/PivotPanelLargeExample";

const meta: Meta = {
  title: "Tests/55 - Pivot Panel Large DOM",
  parameters: {
    layout: "padded",
    test: { timeout: 120_000 },
  },
};
export default meta;

type Story = StoryObj;

const KEY_SEP = "\u0001";
const WAIT = { timeoutMs: 20000, intervalMs: 50 };

const waitFor = (predicate: () => boolean) => waitUntil(predicate, WAIT);

const headerLabels = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll(".st-header-label-text")).map((el) => el.textContent ?? "");

const headerAccessors = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll(".st-header-cell[data-accessor]")).map(
    (el) => el.getAttribute("data-accessor") ?? ""
  );

const chipLabels = (root: HTMLElement, zone: string): string[] =>
  Array.from(
    root.querySelectorAll(`[data-pivot-zone="${zone}"] .st-pivot-panel-chip-label`)
  ).map((el) => el.textContent ?? "");

const availableLabels = (root: HTMLElement): string[] =>
  Array.from(
    root.querySelectorAll(
      '[data-pivot-zone="available"] .st-pivot-panel-field-label'
    )
  ).map((el) => el.textContent ?? "");

const cellText = (root: HTMLElement, rowIndex: number, accessor: string): string => {
  // Avoid CSS attribute selectors — pivot accessors contain U+0001 separators.
  const cell = Array.from(
    root.querySelectorAll(`.st-body-container .st-cell[data-row-index="${rowIndex}"]`)
  ).find((el) => el.getAttribute("data-accessor") === accessor) as HTMLElement | undefined;
  expect(cell, `cell row=${rowIndex} accessor=${JSON.stringify(accessor)}`).toBeTruthy();
  const content = cell!.querySelector(".st-cell-content");
  return (content?.textContent ?? cell!.textContent ?? "").trim();
};

const findRowIndexByDim = (root: HTMLElement, accessor: string, label: string): number => {
  const cells = Array.from(
    root.querySelectorAll(`.st-body-container .st-cell[data-accessor="${accessor}"]`)
  );
  const match = cells.find((el) => {
    const content = el.querySelector(".st-cell-content");
    return (content?.textContent ?? el.textContent ?? "").trim() === label;
  });
  expect(match, `row dim cell ${accessor}=${label}`).toBeTruthy();
  return Number(match!.getAttribute("data-row-index"));
};

const findFirstProductRow = (root: HTMLElement, product: string): number => {
  const match = Array.from(
    root.querySelectorAll(`.st-body-container .st-cell[data-accessor="product"]`)
  ).find((el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === product);
  expect(match, `product row ${product}`).toBeTruthy();
  return Number(match!.getAttribute("data-row-index"));
};

const clickZoneAction = async (root: HTMLElement, fieldLabel: string, action: string) => {
  await waitFor(() => availableLabels(root).includes(fieldLabel));
  const fields = Array.from(root.querySelectorAll(".st-pivot-panel-field"));
  const row = fields.find((el) => {
    const label = el.querySelector(".st-pivot-panel-field-label");
    return label?.textContent === fieldLabel;
  });
  expect(row, `Available field "${fieldLabel}"`).toBeTruthy();
  const btn = Array.from(row!.querySelectorAll(".st-pivot-panel-action")).find(
    (el) => el.textContent === action
  );
  expect(btn, `Action "${action}" on "${fieldLabel}"`).toBeTruthy();
  await userEvent.click(btn!);

  const zone =
    action === "Rows" ? "rows" : action === "Columns" ? "columns" : "values";
  await waitFor(() => chipLabels(root, zone).includes(fieldLabel));
};

const removeChip = async (
  root: HTMLElement,
  zone: "rows" | "columns" | "values",
  label: string
) => {
  await waitFor(() => chipLabels(root, zone).includes(label));
  const chips = Array.from(
    root.querySelectorAll(`[data-pivot-zone="${zone}"] .st-pivot-panel-chip`)
  );
  const chip = chips.find(
    (el) => el.querySelector(".st-pivot-panel-chip-label")?.textContent === label
  );
  expect(chip, `Chip "${label}" in ${zone}`).toBeTruthy();
  const remove = chip!.querySelector(".st-pivot-panel-remove") as HTMLButtonElement | null;
  expect(remove).toBeTruthy();
  await userEvent.click(remove!);
  await waitFor(() => !chipLabels(root, zone).includes(label));
};

const expectHeaderPresent = (root: HTMLElement, label: string) => {
  expect(headerLabels(root), `header "${label}"`).toContain(label);
};

const expectHeaderAbsent = (root: HTMLElement, label: string) => {
  expect(headerLabels(root), `header absent "${label}"`).not.toContain(label);
};

const expectSourceFlatHeaders = (root: HTMLElement) => {
  for (const label of [
    "Region",
    "Product",
    "Year",
    "Quarter",
    "Channel",
    "Sales",
    "Units",
    "Cost",
    "Margin",
    "Returns",
  ]) {
    expectHeaderPresent(root, label);
  }
};

// First story in this file. Test-runner runs it before the large-grid plays.
export const PivotPanelLargeWarmUp: Story = {
  parameters: { tags: ["warmup"] },
  render: () =>
    renderVanillaTable(
      [{ accessor: "name", label: "Name", width: 160, type: "string" }],
      [
        { id: 1, name: "Ada" },
        { id: 2, name: "Grace" },
      ],
      { getRowId: (p) => String((p.row as { id?: number })?.id), height: "160px" },
    ).wrapper,
  play: async () => {
    await waitForTable();
  },
};

export const LargeGridPanelClicksMatchRenderedHtml: Story = {
  render: () => renderPivotPanelLargeExample(pivotPanelLargeDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    // --- Flat source table: lots of rows + columns in the DOM ---
    expectSourceFlatHeaders(root);
    expect(headerAccessors(root)).toEqual(
      expect.arrayContaining([
        "region",
        "product",
        "year",
        "quarter",
        "channel",
        "sales",
        "units",
        "cost",
        "margin",
        "returns",
      ])
    );

    const flatRowCount = getRowCount(root);
    expect(flatRowCount).toBe(LARGE_PIVOT_ROWS.length);
    expect(LARGE_PIVOT_ROWS.length).toBe(
      LARGE_REGIONS.length *
        LARGE_PRODUCTS.length *
        LARGE_YEARS.length *
        LARGE_QUARTERS.length *
        LARGE_CHANNELS.length
    );

    expect(cellText(root, 0, "region")).toBe("East");
    expect(cellText(root, 0, "sales")).toBe(formatSalesDom(10));
    expect(cellText(root, 0, "units")).toBe("2");
    expect(cellText(root, flatRowCount - 1, "region")).toBe("West");
    expect(cellText(root, flatRowCount - 1, "channel")).toBe("Partner");
    expect(cellText(root, flatRowCount - 1, "returns")).toBe("1");

    // --- Values only → one aggregated matrix row ---
    await clickZoneAction(root, "Sales", "Values");
    const valuesOnlyAccessor = buildPivotAccessor("", "sales");
    await waitFor(
      () =>
        headerAccessors(root).includes(valuesOnlyAccessor) &&
        !headerAccessors(root).includes("channel") &&
        getRowCount(root) === 1
    );

    expectHeaderPresent(root, "Sales");
    expectHeaderAbsent(root, "Channel");
    expect(getRowCount(root)).toBe(1);

    const valuesOnlySales = sumMeasure(LARGE_PIVOT_ROWS, "sales", {});
    expect(cellText(root, 0, valuesOnlyAccessor)).toBe(formatSalesDom(valuesOnlySales));
    expect(valuesOnlySales).toBe(LARGE_PIVOT_ROWS.length * 10);

    // --- Region rows + Quarter columns ---
    await clickZoneAction(root, "Region", "Rows");
    await waitFor(() =>
      LARGE_REGIONS.every((region) =>
        Array.from(
          root.querySelectorAll(`.st-body-container .st-cell[data-accessor="region"]`)
        ).some(
          (el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === region
        )
      )
    );

    await clickZoneAction(root, "Quarter", "Columns");
    await waitFor(
      () =>
        LARGE_QUARTERS.every((q) => headerLabels(root).includes(q)) &&
        headerLabels(root).includes("Total") &&
        getRowCount(root) === LARGE_REGIONS.length + 1
    );

    for (const q of LARGE_QUARTERS) expectHeaderPresent(root, q);
    expectHeaderPresent(root, "Region");
    expectHeaderPresent(root, "Total");
    expectHeaderAbsent(root, "Channel");
    expectHeaderAbsent(root, "Product");
    expect(getRowCount(root)).toBe(LARGE_REGIONS.length + 1);

    for (const region of LARGE_REGIONS) {
      const rowIndex = findRowIndexByDim(root, "region", region);
      for (const quarter of LARGE_QUARTERS) {
        const expected = sumMeasure(LARGE_PIVOT_ROWS, "sales", { region, quarter });
        expect(cellText(root, rowIndex, buildPivotAccessor(quarter, "sales"))).toBe(
          formatSalesDom(expected)
        );
        expect(expected).toBe(
          LARGE_PRODUCTS.length * LARGE_YEARS.length * LARGE_CHANNELS.length * 10
        );
      }
      const regionTotal = sumMeasure(LARGE_PIVOT_ROWS, "sales", { region });
      expect(cellText(root, rowIndex, buildPivotRowTotalAccessor("sales"))).toBe(
        formatSalesDom(regionTotal)
      );
    }

    const totalRowIndex = findRowIndexByDim(root, "region", "Total");
    for (const quarter of LARGE_QUARTERS) {
      const expected = sumMeasure(LARGE_PIVOT_ROWS, "sales", { quarter });
      expect(cellText(root, totalRowIndex, buildPivotAccessor(quarter, "sales"))).toBe(
        formatSalesDom(expected)
      );
    }

    // --- Add Product as a second row dimension (flat: one row per combo) ---
    await clickZoneAction(root, "Product", "Rows");
    expectHeaderPresent(root, "Product");
    await waitFor(() =>
      Array.from(
        root.querySelectorAll(`.st-body-container .st-cell[data-accessor="product"]`)
      ).filter((el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === "Alpha")
        .length === LARGE_REGIONS.length
    );

    const alphaRows = Array.from(
      root.querySelectorAll(`.st-body-container .st-cell[data-accessor="product"]`)
    ).filter((el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === "Alpha");
    expect(alphaRows.length).toBe(LARGE_REGIONS.length);

    // Sorted flat: East + Alpha is the first Alpha combination.
    const alphaRowIndex = findFirstProductRow(root, "Alpha");
    const alphaQ1 = sumMeasure(LARGE_PIVOT_ROWS, "sales", {
      product: "Alpha",
      quarter: "Q1",
      region: "East",
    });
    expect(cellText(root, alphaRowIndex, buildPivotAccessor("Q1", "sales"))).toBe(
      formatSalesDom(alphaQ1)
    );
    expect(alphaQ1).toBe(LARGE_YEARS.length * LARGE_CHANNELS.length * 10);

    // --- Year column dimension (nested quarter → year headers) ---
    // Column key order follows panel placement order: Quarter then Year.
    await clickZoneAction(root, "Year", "Columns");
    const nestedAccessor = buildPivotAccessor(`Q2${KEY_SEP}2024`, "sales");
    await waitFor(
      () =>
        headerLabels(root).includes("2024") && headerAccessors(root).includes(nestedAccessor)
    );

    for (const year of LARGE_YEARS) expectHeaderPresent(root, year);
    for (const q of LARGE_QUARTERS) expectHeaderPresent(root, q);

    const nestedExpected = sumMeasure(LARGE_PIVOT_ROWS, "sales", {
      product: "Alpha",
      region: "East",
      year: "2024",
      quarter: "Q2",
    });
    const nestedRow = findFirstProductRow(root, "Alpha");
    expect(cellText(root, nestedRow, nestedAccessor)).toBe(formatSalesDom(nestedExpected));
    expect(nestedExpected).toBe(LARGE_CHANNELS.length * 10);

    // --- Second measure: Units ---
    await clickZoneAction(root, "Units", "Values");
    const unitsQ2 = buildPivotAccessor(`Q2${KEY_SEP}2024`, "units");
    await waitFor(() => headerAccessors(root).includes(unitsQ2));

    expect(headerAccessors(root)).toContain(nestedAccessor);
    const unitsExpected = sumMeasure(LARGE_PIVOT_ROWS, "units", {
      product: "Alpha",
      region: "East",
      year: "2024",
      quarter: "Q2",
    });
    const unitsRow = findFirstProductRow(root, "Alpha");
    expect(cellText(root, unitsRow, unitsQ2)).toBe(String(unitsExpected));
    expect(unitsExpected).toBe(LARGE_CHANNELS.length * 2);

    // --- Aggregation change updates numbers, keeps column accessors ---
    const salesChip = Array.from(
      root.querySelectorAll('[data-pivot-zone="values"] .st-pivot-panel-chip')
    ).find((el) => el.querySelector(".st-pivot-panel-chip-label")?.textContent === "Sales");
    const salesAgg = salesChip?.querySelector(".st-pivot-panel-agg") as HTMLElement | null;
    expect(salesAgg).toBeTruthy();
    const salesTrigger = salesAgg!.querySelector(
      ".st-custom-select-trigger"
    ) as HTMLButtonElement;
    salesTrigger.click();
    await waitFor(() => Boolean(root.querySelector(".st-pivot-panel-agg.st-custom-select-open")));
    const countOption = Array.from(root.querySelectorAll(".st-custom-select-option")).find(
      (el) => el.textContent === "Count"
    );
    expect(countOption).toBeTruthy();
    (countOption as HTMLElement).click();
    await waitFor(
      () =>
        root.querySelector('[data-pivot-zone="values"] .st-pivot-panel-agg')?.getAttribute(
          "data-agg"
        ) === "count"
    );

    const countExpected = LARGE_CHANNELS.length;
    await waitFor(() => {
      const match = Array.from(
        root.querySelectorAll(`.st-body-container .st-cell[data-accessor="product"]`)
      ).find((el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === "Alpha");
      if (!match) return false;
      const rowIndex = Number(match.getAttribute("data-row-index"));
      const cell = Array.from(
        root.querySelectorAll(`.st-body-container .st-cell[data-row-index="${rowIndex}"]`)
      ).find((el) => el.getAttribute("data-accessor") === nestedAccessor);
      const text = (cell?.querySelector(".st-cell-content")?.textContent ?? "").trim();
      // Sales keeps its $ formatter even for count aggregates.
      return text === String(countExpected) || text === formatSalesDom(countExpected);
    });

    expect(headerAccessors(root)).toContain(nestedAccessor);
    expect(headerAccessors(root)).toContain(unitsQ2);

    // --- Remove Values → flat source HTML restored ---
    await removeChip(root, "values", "Sales");
    await removeChip(root, "values", "Units");
    await waitFor(
      () =>
        headerAccessors(root).includes("channel") &&
        headerAccessors(root).includes("returns") &&
        getRowCount(root) === LARGE_PIVOT_ROWS.length &&
        !headerAccessors(root).some((a) => a.startsWith("__pivot:"))
    );

    expectSourceFlatHeaders(root);
    expect(cellText(root, 0, "sales")).toBe(formatSalesDom(10));
    expect(chipLabels(root, "rows").length).toBeGreaterThan(0);
  },
};

export const LargeGridChannelColumnsDom: Story = {
  render: () => renderPivotPanelLargeExample(pivotPanelLargeDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    await clickZoneAction(root, "Cost", "Values");
    await clickZoneAction(root, "Region", "Rows");
    await waitFor(() =>
      LARGE_REGIONS.every((region) =>
        Array.from(
          root.querySelectorAll(`.st-body-container .st-cell[data-accessor="region"]`)
        ).some(
          (el) => (el.querySelector(".st-cell-content")?.textContent ?? "").trim() === region
        )
      )
    );

    await clickZoneAction(root, "Channel", "Columns");
    await waitFor(
      () =>
        LARGE_CHANNELS.every((c) => headerLabels(root).includes(c)) &&
        headerAccessors(root).includes(buildPivotAccessor("Direct", "cost")) &&
        getRowCount(root) === LARGE_REGIONS.length + 1
    );

    for (const channel of LARGE_CHANNELS) {
      expectHeaderPresent(root, channel);
      expect(headerAccessors(root)).toContain(buildPivotAccessor(channel, "cost"));
    }
    expectHeaderPresent(root, "Total");
    expect(headerAccessors(root)).toContain(buildPivotRowTotalAccessor("cost"));

    for (const region of LARGE_REGIONS) {
      const rowIndex = findRowIndexByDim(root, "region", region);
      for (const channel of LARGE_CHANNELS) {
        const expected = sumMeasure(LARGE_PIVOT_ROWS, "cost", { region, channel });
        expect(cellText(root, rowIndex, buildPivotAccessor(channel, "cost"))).toBe(
          formatSalesDom(expected)
        );
        expect(expected).toBe(
          LARGE_PRODUCTS.length * LARGE_YEARS.length * LARGE_QUARTERS.length * 5
        );
      }
    }

    // Swap column dim to Year — channel headers leave, year headers appear.
    await removeChip(root, "columns", "Channel");
    await clickZoneAction(root, "Year", "Columns");
    await waitFor(
      () =>
        headerLabels(root).includes("2024") &&
        headerAccessors(root).includes(buildPivotAccessor("2025", "cost")) &&
        !headerLabels(root).includes("Direct")
    );

    for (const year of LARGE_YEARS) {
      expectHeaderPresent(root, year);
      expect(headerAccessors(root)).toContain(buildPivotAccessor(year, "cost"));
    }
    expect(headerAccessors(root).some((a) => a.includes("Direct"))).toBe(false);

    const west = findRowIndexByDim(root, "region", "West");
    const west2025 = sumMeasure(LARGE_PIVOT_ROWS, "cost", { region: "West", year: "2025" });
    expect(cellText(root, west, buildPivotAccessor("2025", "cost"))).toBe(
      formatSalesDom(west2025)
    );
  },
};
