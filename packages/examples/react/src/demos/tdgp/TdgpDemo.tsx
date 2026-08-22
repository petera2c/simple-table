import { SimpleTable, useTdgpTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { createTdgpClient } from "@thedatagrid/client";
import "@simple-table/react/styles.css";
import {
  TDGP_DATASET,
  TDGP_GROUP_BY,
  TDGP_PAGE_SIZE,
  TDGP_SERVER_URL,
  tdgpAggregations,
  tdgpHeaders,
} from "./tdgp.demo-data";

const client = createTdgpClient({ url: TDGP_SERVER_URL });

const TdgpDemo = ({
  height = "520px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const { rows, tableProps, error, totalRowCount } = useTdgpTable({
    client,
    dataset: TDGP_DATASET,
    columns: tdgpHeaders,
    pageSize: TDGP_PAGE_SIZE,
    groupBy: TDGP_GROUP_BY,
    aggregations: tdgpAggregations,
  });

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.45 }}>
        Live rows from {TDGP_SERVER_URL} ({TDGP_DATASET}). This query returns
        countries (not the 10k people). Next page loads more countries. Click
        the arrow in the Country column to load stacks, then people. Sort and
        column filters ask the server for a new slice.
        {totalRowCount > 0 ? ` ${totalRowCount.toLocaleString()} rows on the server.` : ""}
      </p>
      {error ? (
        <p style={{ margin: "0 0 12px", color: "#b42318", fontSize: 14 }}>{error}</p>
      ) : null}
      <SimpleTable
        columns={tdgpHeaders}
        rows={rows}
        height={height}
        theme={theme}
        columnResizing
        {...tableProps}
      />
    </div>
  );
};

export default TdgpDemo;
