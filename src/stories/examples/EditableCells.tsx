import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../data/finance-data";
import CellChangeProps from "../../types/CellChangeProps";
import InfiniteScrollTest from "../../components/InfiniteScrollTest";
import HeaderObject from "../../types/HeaderObject";

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const EditableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({ accessor, newRowIndex, newValue, originalRowIndex, row }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  // Usage example:
  const headers: HeaderObject[] = [
    { accessor: "name", label: "Name", width: 200 },
    { accessor: "age", label: "Age", width: 100, align: "center" },
    { accessor: "active", label: "Active", width: 100, align: "center" },
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <InfiniteScrollTest headers={headers} pageSize={1000} rowHeight={50} containerHeight={600} />;
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={HEADERS} // Set the headers
        draggable // Enable draggable columns
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="80vh"
      />
    </div>
  );
};

export default EditableCellsExample;
