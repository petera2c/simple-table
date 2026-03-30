import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { chartsConfig } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const ChartsDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  return (
    <SimpleTable
      columnReordering={chartsConfig.tableProps.columnReordering}
      columnResizing={chartsConfig.tableProps.columnResizing}
      defaultHeaders={chartsConfig.headers}
      rows={chartsConfig.rows}
      selectableCells={chartsConfig.tableProps.selectableCells}
      height={height}
      theme={theme}
    />
  );
};

export default ChartsDemo;
