import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { groupedInventoryData } from "./grouped-sample-data";
import { SAMPLE_HEADERS } from "../../../consts/sample-data";

const RowGroupingExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={SAMPLE_HEADERS}
        rows={groupedInventoryData}
        height="calc(100dvh - 112px)"
      />
    </div>
  );
};

export default RowGroupingExample;
