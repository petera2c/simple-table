/**
 * Custom horizontal scroll: one offset for header and body, wheel input,
 * bottom-bar thumb, and column virtualization.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef, SimpleTableVanilla } from "../../src/index";
import {
  getMainScrollX,
  mainOverflowsX,
  setMainScrollX,
  waitForTable,
} from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/53 - Horizontal Scroll Engine",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Header and body share one horizontal offset. Wheel, the bottom bar, and programmatic sets all write that same number.",
      },
    },
  },
};

export default meta;

const wideHeaders = (): ColumnDef[] =>
  Array.from({ length: 20 }, (_, i) => ({
    accessor: `c${i}`,
    label: `Col ${i}`,
    width: 140,
    type: "string" as const,
  }));

const rows = Array.from({ length: 12 }, (_, i) => {
  const row: Record<string, string | number> = { id: i + 1 };
  for (let c = 0; c < 20; c++) {
    row[`c${c}`] = `${i}-${c}`;
  }
  return row;
});

let mountedTable: SimpleTableVanilla<Record<string, string | number>> | null = null;

const renderWide = (width: string) => {
  const { wrapper, tableContainer, table } = renderVanillaTable(
    [{ accessor: "id", label: "ID", width: 72, type: "number", pinned: "left" }, ...wideHeaders()],
    rows,
    {
      getRowId: (p) => String((p.row as { id: number }).id),
      height: "280px",
    },
  );
  tableContainer.style.width = width;
  wrapper.style.width = width;
  mountedTable = table;
  return wrapper;
};

export const HeaderAndBodyStayAligned = {
  parameters: { tags: ["horizontal-scroll-header-body-aligned"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(mainOverflowsX(canvasElement)).toBe(true);

    const header = canvasElement.querySelector(".st-header-main") as HTMLElement;
    const body = canvasElement.querySelector(".st-body-main") as HTMLElement;
    expect(header).toBeTruthy();
    expect(body).toBeTruthy();

    setMainScrollX(canvasElement, 240);
    expect(getMainScrollX(canvasElement)).toBe(240);
    expect(header.dataset.stScrollX).toBe("240");
    expect(body.dataset.stScrollX).toBe("240");

    const headerLayer = header.querySelector(".st-h-scroll-layer") as HTMLElement;
    const bodyLayer = body.querySelector(".st-h-scroll-layer") as HTMLElement;
    expect(headerLayer.style.transform).toBe(bodyLayer.style.transform);
    expect(headerLayer.style.transform).toContain("-240px");
  },
};

export const WheelOnBodyMovesHeader = {
  parameters: { tags: ["horizontal-scroll-wheel-sync"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const body = canvasElement.querySelector(".st-body-main") as HTMLElement;
    expect(body).toBeTruthy();

    body.dispatchEvent(
      new WheelEvent("wheel", { deltaX: 80, cancelable: true, bubbles: true }),
    );
    expect(getMainScrollX(canvasElement)).toBe(80);

    const header = canvasElement.querySelector(".st-header-main") as HTMLElement;
    expect(header.dataset.stScrollX).toBe("80");
  },
};

export const BottomBarDrivesHeaderAndBody = {
  parameters: { tags: ["horizontal-scroll-bar-sync"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await new Promise((r) => setTimeout(r, 40));

    const bar = canvasElement.querySelector(
      ".st-horizontal-scrollbar-middle",
    ) as HTMLElement | null;
    expect(bar, "bottom bar should exist when columns overflow").toBeTruthy();

    bar!.scrollLeft = 160;
    bar!.dispatchEvent(new Event("scroll", { bubbles: true }));
    expect(getMainScrollX(canvasElement)).toBe(160);

    const header = canvasElement.querySelector(".st-header-main") as HTMLElement;
    const body = canvasElement.querySelector(".st-body-main") as HTMLElement;
    expect(header.dataset.stScrollX).toBe("160");
    expect(body.dataset.stScrollX).toBe("160");
  },
};

export const VirtualizationFollowsOffset = {
  parameters: { tags: ["horizontal-scroll-virtualization"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const far = "c15";
    expect(canvasElement.querySelector(`.st-body-main [data-accessor="${far}"]`)).toBeFalsy();

    setMainScrollX(canvasElement, 15 * 140);
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    expect(
      canvasElement.querySelector(`.st-body-main [data-accessor="${far}"]`),
    ).toBeTruthy();
    expect(
      canvasElement.querySelector(`.st-header-main [data-accessor="${far}"]`),
    ).toBeTruthy();
  },
};

export const OffsetSurvivesRerender = {
  parameters: { tags: ["horizontal-scroll-survives-rerender"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    setMainScrollX(canvasElement, 180);
    expect(getMainScrollX(canvasElement)).toBe(180);

    mountedTable?.update({ rows: [...rows, { id: 99, c0: "x" }] });
    await new Promise((r) => setTimeout(r, 50));
    expect(getMainScrollX(canvasElement)).toBe(180);
  },
};

export const PinnedLeftStaysPut = {
  parameters: { tags: ["horizontal-scroll-pinned-left-still"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const leftHeader = canvasElement.querySelector(".st-header-pinned-left") as HTMLElement;
    const leftBody = canvasElement.querySelector(".st-body-pinned-left") as HTMLElement;
    expect(leftHeader).toBeTruthy();
    expect(leftBody).toBeTruthy();

    setMainScrollX(canvasElement, 240);
    expect(getMainScrollX(canvasElement)).toBe(240);
    expect(leftHeader.dataset.stScrollX === undefined || leftHeader.dataset.stScrollX === "0").toBe(
      true,
    );
    expect(leftBody.dataset.stScrollX === undefined || leftBody.dataset.stScrollX === "0").toBe(
      true,
    );

    const leftLayer = leftHeader.querySelector(".st-h-scroll-layer") as HTMLElement | null;
    if (leftLayer?.style.transform) {
      expect(leftLayer.style.transform).toContain("0px");
    }
  },
};

export const EmptyTableHeaderAndBar = {
  parameters: { tags: ["horizontal-scroll-empty-table"] },
  render: () => {
    const { wrapper, tableContainer } = renderVanillaTable(wideHeaders(), [], {
      height: "280px",
    });
    tableContainer.style.width = "420px";
    wrapper.style.width = "420px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const header = canvasElement.querySelector(".st-header-main") as HTMLElement;
    expect(header).toBeTruthy();
    expect(mainOverflowsX(canvasElement)).toBe(true);

    setMainScrollX(canvasElement, 200);
    expect(getMainScrollX(canvasElement)).toBe(200);
    expect(header.dataset.stScrollX).toBe("200");

    await new Promise((r) => setTimeout(r, 40));
    const bar = canvasElement.querySelector(
      ".st-horizontal-scrollbar-middle",
    ) as HTMLElement | null;
    expect(bar, "bottom bar should exist when header columns overflow").toBeTruthy();
  },
};

export const BodyContainerDoesNotScrollX = {
  parameters: { tags: ["horizontal-scroll-no-native-x"] },
  render: () => renderWide("420px"),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    const body = canvasElement.querySelector(".st-body-main") as HTMLElement;
    expect(bodyContainer).toBeTruthy();
    expect(body).toBeTruthy();

    setMainScrollX(canvasElement, 200);
    expect(getMainScrollX(canvasElement)).toBe(200);
    expect(body.scrollLeft).toBe(0);
    expect(bodyContainer.scrollLeft).toBe(0);
  },
};
