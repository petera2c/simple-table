import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { generateFinanceData } from "./finance-rows";
import { HEADERS } from "./finance-headers";

const data = generateFinanceData();
const FinancialExample = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={HEADERS}
        rows={data}
        height="400px"
        theme="light"
        selectableCells
        editColumns
      />
    </div>
  );
};

export default FinancialExample;
