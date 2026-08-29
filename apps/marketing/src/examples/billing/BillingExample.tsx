import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactIconsConfig } from "@simple-table/react";
import { HEADERS, MOBILE_VISIBLE_ACCESSORS } from "./billing-headers";
import { useMobileExampleColumns } from "../_shared/mobileColumns";
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
  const columns = useMobileExampleColumns(HEADERS, MOBILE_VISIBLE_ACCESSORS);

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
      autoExpandColumns
      columnReordering
      columnResizing
      columns={columns}
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
