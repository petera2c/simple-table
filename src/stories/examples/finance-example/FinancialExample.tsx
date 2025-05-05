import { useEffect, useRef } from "react";

import { HEADERS } from "./finance-headers";
import data from "./finance-data.json";
import TableRefType from "../../../types/TableRefType";
import SimpleTable from "../../../components/simple-table/SimpleTable";

export const FinancialExample = () => {
  const tableRef = useRef<TableRefType | null>(null);

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
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={HEADERS}
        rows={data}
        height="90dvh"
        theme="light"
        selectableCells
        tableRef={tableRef}
      />
    </div>
  );
};
