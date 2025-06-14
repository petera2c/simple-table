import SimpleTable from "../../../components/simple-table/SimpleTable";
import { generateRetailSalesData, RETAIL_SALES_HEADERS } from "../../data/retail-data";

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const PinnedColumnsExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={HEADERS} // Set the headers
        columnReordering // Enable draggable columns
        rows={EXAMPLE_DATA} // Set rows data
        rowGrouping={["stores"]}
        rowIdAccessor="id"
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
        selectableCells
        selectableColumns
        editColumns
      />
    </div>
  );
};

export default PinnedColumnsExample;
