/**
 * SalesExample – vanilla port of React sales-example/SalesExample.
 * Uses same SALES_HEADERS and sales-data as React, with autoExpandColumns and enableRowSelection.
 */
import type { FooterRendererProps, Row } from "../../../src/index";
import { renderVanillaTable } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { SALES_HEADERS } from "./sales-headers";
import salesData from "./sales-data.json";

export const salesExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  autoExpandColumns: true,
  theme: "modern-dark" as const,
  height: "70dvh",
  enableColumnEditor: true,
  enablePagination: true,
  rowsPerPage: 40,
  footerPosition: "top" as const,
};

function createSalesFooter(props: FooterRendererProps): HTMLElement {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    backgroundColor: "#111827",
    borderBottom: "1px solid #374151",
    color: "#d1d5db",
    fontSize: "14px",
  });

  const info = document.createElement("span");
  info.style.fontWeight = "600";
  info.textContent = `Showing ${props.startRow}–${props.endRow} of ${props.totalRows} deals`;
  wrap.appendChild(info);

  const controls = document.createElement("div");
  Object.assign(controls.style, { display: "flex", alignItems: "center", gap: "8px" });

  const makeBtn = (label: string, onClick: () => void, disabled: boolean) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    Object.assign(btn.style, {
      padding: "6px 14px",
      fontSize: "14px",
      fontWeight: "500",
      color: disabled ? "#6b7280" : "#d1d5db",
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "6px",
      cursor: disabled ? "not-allowed" : "pointer",
    });
    btn.disabled = disabled;
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  };

  controls.appendChild(makeBtn("Previous", () => props.onPrevPage(), !props.hasPrevPage));

  const pageInfo = document.createElement("span");
  pageInfo.style.minWidth = "90px";
  pageInfo.style.textAlign = "center";
  pageInfo.textContent = `Page ${props.currentPage} of ${props.totalPages}`;
  controls.appendChild(pageInfo);

  controls.appendChild(makeBtn("Next", () => void props.onNextPage(), !props.hasNextPage));

  wrap.appendChild(controls);
  return wrap;
}

export function renderSalesExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...salesExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(SALES_HEADERS, salesData as Row[], {
    ...options,
    footerRenderer: (props: FooterRendererProps) => createSalesFooter(props),
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Sales Example";
  return wrapper;
}
