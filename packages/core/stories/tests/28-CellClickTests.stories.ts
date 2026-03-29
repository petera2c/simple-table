/**
 * CELL CLICK TESTS
 * Tests for onCellClick callback when a body cell is clicked.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/28 - Cell Click",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for onCellClick callback: payload when a body cell is clicked.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
];

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
  { accessor: "score", label: "Score", width: 100, type: "number" },
];

export const OnCellClickCallback = {
  render: () => {
    const captured: { accessor?: string; rowIndex?: number; value?: unknown; row?: unknown }[] = [];
    (window as unknown as { __cellClickCapture?: typeof captured }).__cellClickCapture = captured;
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
      onCellClick: (props) => {
        captured.push({
          accessor: props.accessor as string,
          rowIndex: props.rowIndex,
          value: props.value,
          row: props.row,
        });
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as {
      __cellClickCapture?: { accessor?: string; rowIndex?: number; value?: unknown; row?: unknown }[];
    }).__cellClickCapture;
    expect(captured).toBeTruthy();
    expect(captured!.length).toBe(0);

    const nameCell = canvasElement.querySelector(
      '.st-cell[data-row-index="0"][data-accessor="name"]'
    ) as HTMLElement;
    expect(nameCell).toBeTruthy();
    nameCell.click();
    await new Promise((r) => setTimeout(r, 50));

    expect(captured!.length).toBe(1);
    expect(captured![0].accessor).toBe("name");
    expect(captured![0].rowIndex).toBe(0);
    expect(captured![0].value).toBe("Alice");
    expect(captured![0].row).toEqual(
      expect.objectContaining({ id: 1, name: "Alice", score: 85 })
    );
  },
};

export const OnCellClickDifferentCell = {
  render: () => {
    const captured: { accessor?: string; value?: unknown }[] = [];
    (window as unknown as { __cellClickCapture2?: typeof captured }).__cellClickCapture2 = captured;
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
      onCellClick: (props) => {
        captured.push({ accessor: props.accessor as string, value: props.value });
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as { __cellClickCapture2?: { accessor?: string; value?: unknown }[] })
      .__cellClickCapture2;
    const scoreCell = canvasElement.querySelector(
      '.st-cell[data-row-index="1"][data-accessor="score"]'
    ) as HTMLElement;
    expect(scoreCell).toBeTruthy();
    scoreCell.click();
    await new Promise((r) => setTimeout(r, 50));
    expect(captured!.length).toBe(1);
    expect(captured![0].accessor).toBe("score");
    expect(captured![0].value).toBe(92);
  },
};
