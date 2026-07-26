import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { chartsConfig, type ChartsProduct } from "./charts.demo-data";
import "@simple-table/react/styles.css";

const ChartsDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  return (
    <SimpleTable<ChartsProduct>
      columnReordering={chartsConfig.tableProps.columnReordering}
      columnResizing={chartsConfig.tableProps.columnResizing}
      columns={chartsConfig.headers}
      getRowId={({ row }) => row.id}
      rows={chartsConfig.rows}
      selectableCells={chartsConfig.tableProps.selectableCells}
      height={height}
      theme={theme}
    />
  );
};

export default ChartsDemo;
