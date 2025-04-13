import { useState } from "react";
import { generateBillingData } from "./billing-rows";
import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/SimpleTable/SimpleTable";

const BillingExample = ({ theme = "light" }: { theme?: "light" | "custom" }) => {
  const [data] = useState(generateBillingData());

  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={HEADERS}
        rows={data}
        height="90dvh"
        theme={theme}
        selectableCells
        // selectableColumns
      />
    </div>
  );
};

export default BillingExample;
