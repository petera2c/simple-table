import { useEffect, useRef } from "react";

import { HEADERS } from "./finance-headers";
import data from "./finance-data.json";
import TableRefType from "../../../types/TableRefType";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "../StoryWrapper";

// Default args specific to FinanceExample - exported for reuse in stories and tests
export const financeExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "90dvh",
};

export const FinancialExample = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tableRef.current) {
        // Update a random row
        const indexToUpdate = Math.floor(Math.random() * data.length);
        // Get the current value - handle both old and new data formats
        const row = data[indexToUpdate] as any;
        const currentValue = row.priceChangePercent ?? row.rowData?.priceChangePercent ?? 0;
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
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={data}
      rowIdAccessor="id"
      tableRef={tableRef}
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      height={props.height ?? "90dvh"}
    />
  );
};
