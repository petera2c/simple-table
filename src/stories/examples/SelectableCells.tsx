import SimpleTable from "../../components/simple-table/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../data/retail-data";

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const SelectableCellsExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        columnReordering
        rowHeight={20}
        rows={EXAMPLE_DATA}
        rowGrouping={["stores"]}
        rowIdAccessor="id"
        selectableCells
        selectableColumns
        height="80vh"
      />
    </div>
  );
};

export default SelectableCellsExample;
