/**
 * Interaction tests for the in-table Pivot Panel (column editor popout).
 * Covers the behavior plan checklist: field catalog, setPivot cycle, activation rule.
 */
import type { Meta, StoryObj } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { waitForTable, waitUntil } from "./testUtils";
import {
  renderPivotPanelExample,
  pivotPanelExampleDefaults,
} from "../examples/PivotPanelExample";

const meta: Meta = {
  title: "Tests/54 - Pivot Panel",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const clickZoneAction = async (root: HTMLElement, fieldLabel: string, action: string) => {
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
};

const headerLabels = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll(".st-header-label-text")).map((el) => el.textContent ?? "");

export const ShowsSourceFieldCatalog: Story = {
  render: () => renderPivotPanelExample(pivotPanelExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const panel = canvasElement.querySelector(".st-pivot-panel");
    expect(panel).toBeTruthy();

    // Column visibility chrome stays hidden in pivot mode.
    expect(canvasElement.querySelector(".st-column-editor-search")).toBeFalsy();
    expect(canvasElement.querySelector(".st-column-editor-lists")).toBeFalsy();

    const availableLabels = Array.from(
      panel!.querySelectorAll(
        '[data-pivot-zone="available"] .st-pivot-panel-field-label'
      )
    ).map((el) => el.textContent ?? "");

    expect(availableLabels).toEqual(
      expect.arrayContaining(["Region", "Product", "Quarter", "Sales", "Units"])
    );
    // Source catalog — not pivoted synthetic accessors.
    expect(availableLabels.some((l) => l.startsWith("__pivot:"))).toBe(false);
  },
};

export const PlaceRemoveSyncsPivotAndGrid: Story = {
  render: () => renderPivotPanelExample(pivotPanelExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    await clickZoneAction(root, "Sales", "Values");
    await waitUntil(() =>
      Boolean(root.querySelector('[data-pivot-zone="values"] .st-pivot-panel-chip-label'))
    );

    expect(
      root.querySelector('[data-pivot-zone="values"] .st-pivot-panel-chip-label')?.textContent
    ).toBe("Sales");

    await clickZoneAction(root, "Region", "Rows");
    await clickZoneAction(root, "Quarter", "Columns");

    await waitUntil(() => headerLabels(root).includes("Q1"));

    const labels = headerLabels(root);
    expect(labels).toContain("Region");
    expect(labels).toContain("Q1");
    expect(labels).toContain("Q2");

    // Remove Values → pivot off → flat source headers return.
    const removeBtn = root.querySelector(
      '[data-pivot-zone="values"] .st-pivot-panel-remove'
    ) as HTMLButtonElement | null;
    expect(removeBtn).toBeTruthy();
    await userEvent.click(removeBtn!);

    await waitUntil(() => headerLabels(root).includes("Sales"));
    const after = headerLabels(root);
    expect(after).toContain("Sales");
    expect(after).toContain("Units");
    expect(after).toContain("Region");

    // Sales returns to Available.
    const availableAgain = Array.from(
      root.querySelectorAll('[data-pivot-zone="available"] .st-pivot-panel-field-label')
    ).map((el) => el.textContent ?? "");
    expect(availableAgain).toContain("Sales");
  },
};

export const PivotRequiresAtLeastOneValue: Story = {
  render: () => renderPivotPanelExample(pivotPanelExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    // Dimensions alone must not activate pivot (still flat source columns).
    await clickZoneAction(root, "Region", "Rows");
    await clickZoneAction(root, "Quarter", "Columns");

    await waitUntil(() =>
      Boolean(root.querySelector('[data-pivot-zone="rows"] .st-pivot-panel-chip-label'))
    );

    const labels = headerLabels(root);
    expect(labels).toContain("Sales");
    expect(labels).toContain("Units");
    expect(labels).not.toContain("Q1");

    // Adding a measure activates the matrix.
    await clickZoneAction(root, "Sales", "Values");
    await waitUntil(() => headerLabels(root).includes("Q1"));
    expect(headerLabels(root)).toContain("Q1");
  },
};

export const MeasuresAndDimensionsRespectZones: Story = {
  render: () => renderPivotPanelExample(pivotPanelExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    const salesRow = Array.from(root.querySelectorAll(".st-pivot-panel-field")).find((el) =>
      el.querySelector(".st-pivot-panel-field-label")?.textContent === "Sales"
    );
    expect(salesRow).toBeTruthy();
    const salesActions = Array.from(salesRow!.querySelectorAll(".st-pivot-panel-action")).map(
      (el) => el.textContent
    );
    expect(salesActions).toEqual(["Values"]);

    const regionRow = Array.from(root.querySelectorAll(".st-pivot-panel-field")).find((el) =>
      el.querySelector(".st-pivot-panel-field-label")?.textContent === "Region"
    );
    expect(regionRow).toBeTruthy();
    const regionActions = Array.from(regionRow!.querySelectorAll(".st-pivot-panel-action")).map(
      (el) => el.textContent
    );
    expect(regionActions).toEqual(["Rows", "Columns"]);
  },
};

export const AggregationUsesCustomSelect: Story = {
  render: () => renderPivotPanelExample(pivotPanelExampleDefaults),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    const root = canvasElement;

    await clickZoneAction(root, "Sales", "Values");
    await waitUntil(() =>
      Boolean(root.querySelector('[data-pivot-zone="values"] .st-pivot-panel-chip-label'))
    );

    // Match filter/boolean UI: shared CustomSelect, not a native <select>.
    expect(root.querySelector('[data-pivot-zone="values"] select')).toBeFalsy();
    const agg = root.querySelector(
      '[data-pivot-zone="values"] .st-pivot-panel-agg'
    ) as HTMLElement | null;
    expect(agg).toBeTruthy();
    expect(agg!.classList.contains("st-custom-select")).toBe(true);
    expect(agg!.querySelector(".st-custom-select-trigger")).toBeTruthy();
    expect(agg!.querySelector(".st-custom-select-arrow")).toBeTruthy();
    expect(agg!.querySelector(".st-custom-select-value")?.textContent).toBe("Sum");
    expect(agg!.getAttribute("data-agg")).toBe("sum");
  },
};

export const ColumnVisibilityRestoredWhenPivotPanelOff: Story = {
  render: () =>
    renderPivotPanelExample({
      ...pivotPanelExampleDefaults,
      enablePivotPanel: false,
    }),
  play: async ({ canvasElement }) => {
    await waitForTable(canvasElement);
    expect(canvasElement.querySelector(".st-pivot-panel")).toBeFalsy();
    expect(canvasElement.querySelector(".st-column-editor-search")).toBeTruthy();
    expect(canvasElement.querySelector(".st-column-editor-lists")).toBeTruthy();
  },
};
