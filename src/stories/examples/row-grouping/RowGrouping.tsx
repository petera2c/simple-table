import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { generateFinanceData, FINANCE_HEADERS } from "../../data/finance-data";

const EXAMPLE_DATA = generateFinanceData();
const HEADERS = FINANCE_HEADERS;

const RowGroupingExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        defaultHeaders={HEADERS}
        rows={EXAMPLE_DATA}
        height="calc(100dvh - 112px)"
      />
    </div>
  );
};

export default RowGroupingExample;
