import { SimpleTable } from "@simple-table/solid";
import type { Theme, FooterRendererProps } from "@simple-table/solid";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CustomFooter = (props: FooterRendererProps) => {
  return (
    <div style={{
      display: "flex",
      "align-items": "center",
      "justify-content": "space-between",
      padding: "0 12px",
      height: "100%",
      "font-size": "13px",
    }}>
      <span>
        Showing {props.startRow}–{props.endRow} of {props.totalRows}
      </span>
      <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
        <button
          disabled={!props.hasPrevPage}
          onClick={() => props.onPrevPage()}
          style={{ cursor: props.hasPrevPage ? "pointer" : "default", padding: "2px 8px" }}
        >
          Prev
        </button>
        <span>Page {props.currentPage} / {props.totalPages}</span>
        <button
          disabled={!props.hasNextPage}
          onClick={() => props.onNextPage()}
          style={{ cursor: props.hasNextPage ? "pointer" : "default", padding: "2px 8px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function FooterRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={footerRendererConfig.headers}
      rows={footerRendererConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      shouldPaginate={footerRendererConfig.tableProps.shouldPaginate}
      rowsPerPage={footerRendererConfig.tableProps.rowsPerPage}
      footerRenderer={CustomFooter}
    />
  );
}
