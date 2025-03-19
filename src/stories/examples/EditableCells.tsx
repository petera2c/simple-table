import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import CellChangeProps from "../../types/CellChangeProps";
import { generateAthletesData, ATHLETES_HEADERS } from "../data/athlete-data";

const HEADERS = ATHLETES_HEADERS;
const EXAMPLE_DATA = generateAthletesData();

const EditableCellsExample = () => {
  const [rows, setRows] = useState(EXAMPLE_DATA);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex].rowData[accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={HEADERS} // Set the headers
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default EditableCellsExample;
