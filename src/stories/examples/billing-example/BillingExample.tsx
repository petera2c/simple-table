import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import billingData from "./billing-data.json";

const BillingExample = ({ theme = "light" }: { theme?: "light" | "custom" }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        editColumns
        columnResizing
        columnReordering
        defaultHeaders={HEADERS}
        rows={billingData}
        height="90dvh"
        theme={theme}
        selectableCells
        // selectableColumns
        useOddColumnBackground
        useHoverRowBackground={false}
      />
    </div>
  );
};

export default BillingExample;
