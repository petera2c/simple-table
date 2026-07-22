/**
 * FOOTER RENDERER TESTS
 * Tests for table footer: default footer with pagination, hideFooter, footerPosition.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef, SimpleTableVanilla } from "../../src/index";
import type { FooterRendererProps, Row } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/24 - Footer Renderer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for table footer: default footer with pagination info and navigation, hideFooter, footerPosition top.",
      },
    },
  },
};

export default meta;

const createData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

const headers: ColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number", sortable: true },
  { accessor: "name", label: "Name", width: 150, type: "string", sortable: true },
];

export const DefaultFooterWithPagination = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(25), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      enablePagination: true,
      rowsPerPage: 7,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    expect(footer?.querySelector(".st-footer-info")).toBeTruthy();
    expect(footer?.querySelector(".st-footer-results-text")).toBeTruthy();
    expect(footer?.textContent).toMatch(/Showing \d+ to \d+ of \d+ results/);
    expect(footer?.querySelector(".st-footer-pagination")).toBeTruthy();
    expect(footer?.querySelectorAll(".st-page-btn").length).toBeGreaterThan(0);
  },
};

export const FooterShowsCorrectRange = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(15), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      enablePagination: true,
      rowsPerPage: 5,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const resultsText = canvasElement.querySelector(".st-footer-results-text");
    expect(resultsText?.textContent).toContain("Showing 1 to 5 of 15 results");
  },
};

export const FooterPositionTop = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(25), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      enablePagination: true,
      rowsPerPage: 10,
      footerPosition: "top",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root?.classList.contains("st-footer-position-top")).toBe(true);

    const wrapperContainer = canvasElement.querySelector(".st-wrapper-container");
    expect(wrapperContainer?.firstElementChild?.id).toBe("st-footer-container");

    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    expect(footer?.querySelector(".st-footer-pagination")).toBeTruthy();

    const header = canvasElement.querySelector(".st-header-container");
    const footerContainer = canvasElement.querySelector("#st-footer-container");
    expect(footerContainer && header && footerContainer.compareDocumentPosition(header)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  },
};

export const HideFooterHidesFooter = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(10), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      enablePagination: true,
      rowsPerPage: 5,
      hideFooter: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeFalsy();
  },
};

export const NoPaginationNoFooter = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(10), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      enablePagination: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeFalsy();
  },
};

// ============================================================================
// STANDARD FOOTER NAVIGATION (page count display)
// ============================================================================

export const FooterShowsCorrectPageCount = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(25), {
      getRowId: (p) => String(p.row?.id),
      height: "350px",
      enablePagination: true,
      rowsPerPage: 10,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    // 25 rows / 10 per page = 3 pages — footer should mention page count
    expect(footer?.textContent).toContain("3");
  },
};

export const FooterPrevDisabledOnFirstPage = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(20), {
      getRowId: (p) => String(p.row?.id),
      height: "350px",
      enablePagination: true,
      rowsPerPage: 10,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();
    // On the first page the prev button should be disabled.
    // The footer renders page-number buttons first, then prev/next buttons,
    // so we select by aria-label to target the correct button.
    const prevBtn = footer?.querySelector<HTMLButtonElement>(
      'button[aria-label="Go to previous page"]',
    );
    expect(prevBtn).toBeTruthy();
    expect(prevBtn?.disabled).toBe(true);
  },
};

// Custom footers are reused across scroll renders when pagination inputs are
// unchanged. Consumers with external footer state (loading, etc.) need either
// `footerRenderKey` or an `update({ rows })` to bust that cache — without
// replacing the footerRenderer function identity on every tick.
export const CustomFooterRespectsFooterRenderKey = {
  render: () => {
    let status = "idle";
    const footerRenderer = (_props: FooterRendererProps): HTMLElement => {
      const el = document.createElement("div");
      el.className = "custom-footer-status";
      el.dataset.status = status;
      el.textContent = `status:${status}`;
      return el;
    };

    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "footer-render-key-trigger";
    trigger.textContent = "Set loading";
    wrapper.appendChild(trigger);

    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);

    const rows = createData(5) as Row[];
    const table = new SimpleTableVanilla(tableContainer, {
      columns: headers,
      rows,
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      footerRenderer,
      footerRenderKey: status,
    });
    table.mount();

    trigger.addEventListener("click", () => {
      status = "loading";
      table.update({ footerRenderKey: status });
    });

    (wrapper as HTMLDivElement & { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = () =>
      canvasElement.querySelector(".custom-footer-status") as HTMLElement | null;

    expect(footer()?.dataset.status).toBe("idle");
    expect(footer()?.textContent).toBe("status:idle");

    const trigger = canvasElement.querySelector(
      ".footer-render-key-trigger",
    ) as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();
    trigger!.click();

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    expect(footer()?.dataset.status).toBe("loading");
    expect(footer()?.textContent).toBe("status:loading");
  },
};

export const CustomFooterRefreshesOnRowsUpdateSameCount = {
  render: () => {
    let label = "first";
    const footerRenderer = (_props: FooterRendererProps): HTMLElement => {
      const el = document.createElement("div");
      el.className = "custom-footer-label";
      el.textContent = label;
      return el;
    };

    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "footer-rows-update-trigger";
    trigger.textContent = "Swap rows";
    wrapper.appendChild(trigger);

    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);

    let rows = createData(5) as Row[];
    const table = new SimpleTableVanilla(tableContainer, {
      columns: headers,
      rows,
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      footerRenderer,
    });
    table.mount();

    trigger.addEventListener("click", () => {
      // Same length, new row identities — pagination key unchanged, but update({ rows })
      // must still re-invoke the custom footer (infinite-scroll skeleton swap case).
      label = "second";
      rows = createData(5).map((r) => ({ ...r, name: `Swapped ${r.name}` })) as Row[];
      table.update({ rows });
    });

    (wrapper as HTMLDivElement & { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const footer = () =>
      canvasElement.querySelector(".custom-footer-label") as HTMLElement | null;
    expect(footer()?.textContent).toBe("first");

    const trigger = canvasElement.querySelector(
      ".footer-rows-update-trigger",
    ) as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();
    trigger!.click();

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    expect(footer()?.textContent).toBe("second");
  },
};
