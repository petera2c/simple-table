import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import billingData from "./billing-data.json";
import Theme from "../../../types/Theme";

const BillingExample = ({ expandAll, theme }: { expandAll: boolean; theme: Theme }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "2rem", gap: "1rem" }}>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={HEADERS}
        editColumns
        expandAll={expandAll}
        height="90dvh"
        rowGrouping={["invoices", "charges"]}
        rowIdAccessor="id"
        rows={billingData}
        selectableCells
        theme={theme}
        useOddColumnBackground
        useHoverRowBackground={false}
      />
    </div>
  );
};

export default BillingExample;
