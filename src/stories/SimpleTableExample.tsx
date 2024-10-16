import SimpleTable from "../components/SimpleTable/SimpleTable";
import { SAMPLE_HEADERS } from "../consts/SampleData";
import { inventoryData } from "../consts/SampleData";
import "../styles/simple-table.css";
export const SampleTable = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        defaultHeaders={SAMPLE_HEADERS}
        height="auto"
        // height="calc(100dvh - 4rem)"
        rows={inventoryData}
        // shouldPaginate={false}
      />
    </div>
  );
};
