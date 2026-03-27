import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, HeaderRendererProps } from "@simple-table/solid";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CustomHeader = (props: HeaderRendererProps) => {
  return (
    <div style={{ display: "flex", "align-items": "center", gap: "4px", width: "100%" }}>
      <span style={{ "font-weight": "700", "font-size": "12px" }}>{props.header.label}</span>
      {props.components?.sortIcon}
    </div>
  );
};

const HEADERS: SolidHeaderObject[] = headerRendererConfig.headers.map((h) => ({
  ...h,
  headerRenderer: CustomHeader,
}));

export default function HeaderRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={HEADERS}
      rows={headerRendererConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      selectableCells={headerRendererConfig.tableProps.selectableCells}
      columnResizing={headerRendererConfig.tableProps.columnResizing}
    />
  );
}
