import React from "react";
import { SimpleTable } from "../..";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { generateRetailSalesData } from "../data/retail-data";
import { UniversalTableProps } from "./StoryWrapper";
import { TableAPI } from "../../types/TableAPI";

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

// Default args specific to AlignmentExample - exported for reuse in stories and tests
export const alignmentExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  selectableColumns: true,
  editColumns: true,
  height: "calc(100dvh - 112px)",
};

const AlignmentExample = (props: UniversalTableProps) => {
  const tableRef = React.useRef<TableAPI | null>(null);
  return (
    <>
      <button onClick={() => tableRef.current?.exportToCSV()}>Export to CSV</button>
      <SimpleTable
        {...props}
        defaultHeaders={HEADERS}
        rows={EXAMPLE_DATA}
        rowGrouping={["stores"]}
        height={props.height ?? "calc(100dvh - 112px)"}
        tableRef={tableRef}
      />
    </>
  );
};

export default AlignmentExample;
