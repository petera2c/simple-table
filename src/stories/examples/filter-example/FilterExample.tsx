"use client";

import { PRODUCT_HEADERS } from "./filter-headers";
import data from "./filter-data.json";
import { Row, SimpleTable } from "../../..";

const shouldPaginate = false;
const howManyRowsCanFit = 12;

export const FilterExampleComponent = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <SimpleTable
        columnResizing
        columnReordering
        defaultHeaders={PRODUCT_HEADERS}
        rows={data as Row[]}
        theme={"light"}
        selectableCells
        {...(shouldPaginate
          ? { rowsPerPage: howManyRowsCanFit, shouldPaginate }
          : {
              height: "75dvh",
            })}
      />
    </div>
  );
};
