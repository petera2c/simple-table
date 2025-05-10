import SimpleTable from "../../components/simple-table/SimpleTable";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { generateRetailSalesData } from "../data/retail-data";

const EXAMPLE_DATA = generateRetailSalesData();
const HEADERS = RETAIL_SALES_HEADERS;

const AlignmentExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        columnReordering // Enable draggable columns
        rows={EXAMPLE_DATA} // Set rows data
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
        selectableCells
        selectableColumns
        editColumns
      />
    </div>
  );
};

export default AlignmentExample;
