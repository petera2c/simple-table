import SimpleTable from "../../../components/simple-table/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../../data/retail-data";
import { UniversalTableProps } from "../StoryWrapper";

// Default args specific to PinnedColumns - exported for reuse in stories and tests
export const pinnedColumnsDefaults = {
  columnReordering: true,
  selectableCells: true,
  selectableColumns: true,
  editColumns: true,
  height: "calc(100dvh - 112px)",
};

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const PinnedColumnsExample = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={EXAMPLE_DATA}
      rowGrouping={["stores"]}
      rowIdAccessor="id"
      // Default settings for this example
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      selectableColumns={props.selectableColumns ?? true}
      editColumns={props.editColumns ?? true}
      height={props.height ?? "calc(100dvh - 112px)"}
    />
  );
};

export default PinnedColumnsExample;
