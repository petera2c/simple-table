import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS, inventoryData } from "../../consts/SampleData";
import CellChangeProps from "../../types/CellChangeProps";

const EditableCellsExample = () => {
  const [rows, setRows] = useState(inventoryData);

  const updateCell = ({
    accessor,
    newRowIndex,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => {
    setRows((prevRows) => {
      prevRows[originalRowIndex][accessor] = newValue;
      return prevRows;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        onCellChange={updateCell} // Handle cell changes
        rows={rows} // Set rows data
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default EditableCellsExample;
