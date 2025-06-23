import { HEADERS } from "./billing-headers";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import billingData from "./billing-data.json";
import Theme from "../../../types/Theme";
import { useState } from "react";

const THEME_OPTIONS: Theme[] = ["sky", "funky", "neutral", "light", "dark"];

const BillingExample = () => {
  const [expandAll, setExpandAll] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "2rem", gap: "1rem" }}>
      <div style={{ display: "flex", overflow: "auto" }}>
        {THEME_OPTIONS.map((theme) => {
          return (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              style={{
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                margin: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
                fontFamily: "Nunito",
              }}
            >
              {theme}
            </button>
          );
        })}
        <button onClick={() => setExpandAll(!expandAll)}>
          {expandAll ? "Close All" : "Open All"}
        </button>
      </div>
      <SimpleTable
        columnReordering
        columnResizing
        defaultHeaders={HEADERS}
        editColumns
        expandAll={expandAll}
        height="90dvh"
        rowGrouping={["charges", "invoices"]}
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
