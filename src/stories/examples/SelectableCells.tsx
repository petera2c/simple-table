import { useState } from "react";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { generateSaaSData, SAAS_HEADERS } from "../data/saas-data";

const EXAMPLE_DATA = generateSaaSData();
const HEADERS = SAAS_HEADERS;
const SelectableCellsExample = () => {
  const [rows] = useState(EXAMPLE_DATA);

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={HEADERS} // Set the headers
        rows={rows} // Set rows data
        selectableCells // Enable selectable cells
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default SelectableCellsExample;
