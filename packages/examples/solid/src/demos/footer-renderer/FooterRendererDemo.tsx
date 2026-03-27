import { SimpleTable } from "@simple-table/solid";
import type { Theme, FooterRendererProps } from "@simple-table/solid";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const dataRows = footerRendererConfig.rows;
const totalQty = dataRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
const totalAmount = dataRows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

const FooterRenderer = (_props: FooterRendererProps) => (
  <div
    style={{
      display: "flex",
      "justify-content": "space-between",
      "align-items": "center",
      padding: "10px 16px",
      background: "#f8fafc",
      "border-top": "2px solid #e2e8f0",
      "font-size": "13px",
      "font-weight": "600",
    }}
  >
    <span>{dataRows.length} items · {totalQty} units</span>
    <span>Grand Total: ${totalAmount.toLocaleString()}</span>
  </div>
);

export default function FooterRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={footerRendererConfig.headers}
      rows={footerRendererConfig.rows}
      footerRenderer={FooterRenderer}
      hideFooter={false}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
