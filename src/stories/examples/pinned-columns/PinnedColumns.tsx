import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { inventoryData } from "../../../consts/sample-data";
import { SAMPLE_HEADERS } from "./PinnedColumnsUtil";

const PinnedColumnsExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing // Enable column resizing
        defaultHeaders={SAMPLE_HEADERS} // Set the headers
        draggable // Enable draggable columns
        rows={inventoryData} // Set rows data
        height="calc(100dvh - 112px)" // If not using pagination use a fixed height
      />
    </div>
  );
};

export default PinnedColumnsExample;
