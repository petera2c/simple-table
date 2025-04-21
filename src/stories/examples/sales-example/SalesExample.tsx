"use client";

import { SALES_HEADERS } from "./sales-headers";
import data from "./sales-data.json";
import "simple-table-core/styles.css";
import { Row, SimpleTable } from "../../..";

export const SalesExampleComponent = ({ height = "70dvh" }: { height?: string }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={SALES_HEADERS}
        rows={data as Row[]}
        height={height}
        theme={"light"}
        selectableCells
      />
    </div>
  );
};
