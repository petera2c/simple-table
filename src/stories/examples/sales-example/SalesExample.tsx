"use client";

import { SALES_HEADERS } from "./sales-headers";
import data from "./sales-data.json";
import { Row, SimpleTable } from "../../..";

const shouldPaginate = true;
const howManyRowsCanFit = 10;

export const SalesExampleComponent = ({ height = "70dvh" }: { height?: string }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={SALES_HEADERS}
        rows={data as Row[]}
        theme={"light"}
        selectableCells
        {...(shouldPaginate
          ? { rowsPerPage: howManyRowsCanFit, shouldPaginate }
          : {
              height: height ? `${height}px` : "70dvh",
            })}
      />
    </div>
  );
};
