/**
 * INFINITE SCROLL TESTS
 * Tests for onLoadMore callback when scrolling near bottom.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/36 - Infinite Scroll",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for onLoadMore when user scrolls near bottom.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
];
const createData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

export const OnLoadMoreFired = {
  render: () => {
    const captured: { count: number } = { count: 0 };
    (window as unknown as { __onLoadMoreCapture?: { count: number } }).__onLoadMoreCapture = captured;
    const { wrapper } = renderVanillaTable(headers, createData(20), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      onLoadMore: () => {
        captured.count += 1;
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as { __onLoadMoreCapture?: { count: number } }).__onLoadMoreCapture;
    expect(captured).toBeTruthy();
    expect(captured!.count).toBe(0);

    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLDivElement;
    expect(bodyContainer).toBeTruthy();
    const scrollHeight = bodyContainer.scrollHeight;
    const clientHeight = bodyContainer.clientHeight;
    if (scrollHeight > clientHeight) {
      bodyContainer.scrollTop = scrollHeight - clientHeight - 50;
      bodyContainer.dispatchEvent(new Event("scroll", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 250));
      expect(captured!.count).toBeGreaterThanOrEqual(1);
    }
  },
};

export const OnLoadMoreNotFiredBeforeScroll = {
  render: () => {
    const captured: { count: number } = { count: 0 };
    (window as unknown as { __onLoadMoreCapture2?: { count: number } }).__onLoadMoreCapture2 = captured;
    const { wrapper } = renderVanillaTable(headers, createData(5), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      onLoadMore: () => {
        captured.count += 1;
      },
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as { __onLoadMoreCapture2?: { count: number } }).__onLoadMoreCapture2;
    expect(captured).toBeTruthy();
    expect(captured!.count).toBe(0);
  },
};
