import { useEffect, useRef, useState } from "react";

import { HEADERS } from "./finance-headers";
import data from "./finance-data.json";
import TableRefType from "../../../types/TableRefType";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import Theme from "../../../types/Theme";
const THEME_OPTIONS: Theme[] = ["sky", "funky", "neutral", "light", "dark"];

export const FinancialExample = () => {
  const tableRef = useRef<TableRefType | null>(null);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const interval = setInterval(() => {
      if (tableRef.current) {
        // Update a random row
        const indexToUpdate = Math.floor(Math.random() * data.length);
        // Get the current value
        const currentValue = data[indexToUpdate].rowData.priceChangePercent;
        // Add or subtract between 0 and 0.2
        const newValue = currentValue + (Math.random() * 0.2 - 0.1);
        tableRef.current.updateData({
          accessor: "priceChangePercent",
          rowIndex: indexToUpdate,
          newValue,
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
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
      </div>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={HEADERS}
        rows={data}
        height="90dvh"
        theme={theme}
        selectableCells
        tableRef={tableRef}
      />
    </div>
  );
};
