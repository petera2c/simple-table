import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS } from "./billing-headers";
import "@simple-table/react/styles.css";
import { useBillingData } from "./useBillingData";

export default function BillingExample({
  height,
  icons,
  onGridReady,
  theme,
}: {
  height: number | null;
  icons?: ReactIconsConfig;
  onGridReady?: () => void;
  theme?: Theme;
}) {
  const { data, isLoading } = useBillingData();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: height ? `${height}px` : "70dvh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading billing data...
      </div>
    );
  }

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={HEADERS}
      editColumns
      height={height ? `${height}px` : "70dvh"}
      icons={icons}
      initialSortColumn="amount"
      initialSortDirection="desc"
      onGridReady={onGridReady}
      rowGrouping={["invoices", "charges"]}
      rows={data}
      selectableCells
      theme={theme}
      useOddColumnBackground
    />
  );
}
