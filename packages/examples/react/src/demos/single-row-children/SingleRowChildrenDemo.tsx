import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { singleRowChildrenConfig, type StudentRecord } from "./single-row-children.demo-data";
import "@simple-table/react/styles.css";

const SingleRowChildrenDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  return (
    <SimpleTable<StudentRecord>
      columns={singleRowChildrenConfig.headers}
      rows={singleRowChildrenConfig.rows}
      columnResizing={singleRowChildrenConfig.tableProps.columnResizing}
      selectableCells={singleRowChildrenConfig.tableProps.selectableCells}
      height={height}
      theme={theme}
      getRowId={({ row }) => row.id}
    />
  );
};

export default SingleRowChildrenDemo;
