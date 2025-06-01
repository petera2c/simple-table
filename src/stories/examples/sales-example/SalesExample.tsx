"use client";

import { SALES_HEADERS } from "./sales-headers";
import data from "./sales-data.json";
import { SimpleTable } from "../../..";

const shouldPaginate = false;
const howManyRowsCanFit = 10;

export const SalesExampleComponent = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={SALES_HEADERS}
        rowIdAccessor="id"
        rows={data}
        theme={"dark"}
        selectableCells
        {...(shouldPaginate
          ? { rowsPerPage: howManyRowsCanFit, shouldPaginate }
          : {
              height: "70dvh",
            })}
      />
    </div>
  );
};
