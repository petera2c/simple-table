import {SimpleTable, defaultHeadersFromCore} from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { singleRowChildrenConfig } from "./single-row-children.demo-data";
import "@simple-table/solid/styles.css";

export default function SingleRowChildrenDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(singleRowChildrenConfig.headers)}
      rows={singleRowChildrenConfig.rows}
      columnResizing={singleRowChildrenConfig.tableProps.columnResizing}
      selectableCells={singleRowChildrenConfig.tableProps.selectableCells}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
