import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS, inventoryData } from "../../consts/SampleData";

const SelectableCellsExample = () => {
  const [rows] = useState(inventoryData);

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default SelectableCellsExample;
