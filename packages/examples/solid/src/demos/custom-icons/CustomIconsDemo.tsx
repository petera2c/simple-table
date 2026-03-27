import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { customIconsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export default function CustomIconsDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={customIconsConfig.headers}
      rows={customIconsConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      icons={{
        sortUp: <span style={{ "font-size": "10px" }}>{"\u25B2"}</span>,
        sortDown: <span style={{ "font-size": "10px" }}>{"\u25BC"}</span>,
      }}
    />
  );
}
