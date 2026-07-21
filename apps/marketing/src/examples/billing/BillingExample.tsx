import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS } from "./billing-headers";
import "@simple-table/react/styles.css";
import { useBillingData } from "./useBillingData";

export default function BillingExample({
  height,
  icons,
  onTableReady,
  theme,
}: {
  height: number | null;
  icons?: ReactIconsConfig;
  onTableReady?: () => void;
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
      columns={HEADERS}
      enableColumnEditor
      enableStickyParents
      getRowId={({ row }) => String(row.id)}
      height={height ? `${height}px` : "70dvh"}
      icons={icons}
      initialSortColumn="amount"
      initialSortDirection="desc"
      onTableReady={onTableReady}
      rowGrouping={["invoices", "charges"]}
      rows={data}
      selectableCells
      theme={theme}
      oddColumnBackground
    />
  );
}
