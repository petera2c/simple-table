import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { singleRowChildrenConfig } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const SingleRowChildrenDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  return (
    <SimpleTable
      defaultHeaders={singleRowChildrenConfig.headers}
      rows={singleRowChildrenConfig.rows}
      columnResizing={singleRowChildrenConfig.tableProps.columnResizing}
      selectableCells={singleRowChildrenConfig.tableProps.selectableCells}
      height={height}
      theme={theme}
    />
  );
};

export default SingleRowChildrenDemo;
