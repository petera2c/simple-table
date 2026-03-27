import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, FooterRendererProps } from "simple-table-core";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const dataRows = footerRendererConfig.rows;
const totalQty = dataRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
const totalAmount = dataRows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

function customFooter(_props: FooterRendererProps): HTMLElement {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#f8fafc",
    borderTop: "2px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
  });
  wrapper.innerHTML = `<span>${dataRows.length} items · ${totalQty} units</span><span>Grand Total: $${totalAmount.toLocaleString()}</span>`;
  return wrapper;
}

export function renderFooterRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...footerRendererConfig.headers],
    rows: footerRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    footerRenderer: customFooter,
    hideFooter: false,
  });
  return table;
}
