import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../data/retail-data";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to SelectableCells - exported for reuse in stories and tests
export const selectableCellsDefaults = {
  selectableCells: true,
  selectableColumns: true,
  columnResizing: true,
  columnReordering: true,
  rowHeight: 20,
  height: "80vh",
};

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const SelectableCellsExample = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={EXAMPLE_DATA}
      rowGrouping={["stores"]}
      rowIdAccessor="id"
      // Default settings for this example
      selectableCells={props.selectableCells ?? true}
      selectableColumns={props.selectableColumns ?? true}
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      rowHeight={props.rowHeight ?? 20}
      height={props.height ?? "80vh"}
    />
  );
};

export default SelectableCellsExample;
