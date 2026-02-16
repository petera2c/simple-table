import { SALES_HEADERS } from "./sales-headers";
import data from "./sales-data.json";
import { SimpleTable } from "../../..";
import { UniversalTableProps } from "../StoryWrapper";

// Default args specific to SalesExample - exported for reuse in stories and tests
export const salesExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  theme: "modern-dark" as const,
  height: "70dvh",
};

const shouldPaginate = false;
const howManyRowsCanFit = 10;

export const SalesExampleComponent = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      autoExpandColumns
      enableRowSelection
      defaultHeaders={SALES_HEADERS}
      rows={data}
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      theme={props.theme ?? "dark"}
      {...(shouldPaginate
        ? {
            rowsPerPage: props.rowsPerPage ?? howManyRowsCanFit,
            shouldPaginate: props.shouldPaginate ?? shouldPaginate,
          }
        : {
            height: props.height ?? "70dvh",
          })}
    />
  );
};
