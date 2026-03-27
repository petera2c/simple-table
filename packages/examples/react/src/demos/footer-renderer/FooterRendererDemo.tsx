import { SimpleTable } from "@simple-table/react";
import type { Theme, FooterRendererProps } from "@simple-table/react";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const rows = footerRendererConfig.rows;
const totalQty = rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
const totalAmount = rows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

const FooterRenderer = (_props: FooterRendererProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 16px",
      background: "#f8fafc",
      borderTop: "2px solid #e2e8f0",
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    <span>
      {rows.length} items · {totalQty} units
    </span>
    <span>Grand Total: ${totalAmount.toLocaleString()}</span>
  </div>
);

const FooterRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={footerRendererConfig.headers}
      rows={footerRendererConfig.rows}
      footerRenderer={FooterRenderer}
      hideFooter={false}
      height={height}
      theme={theme}
    />
  );
};

export default FooterRendererDemo;
