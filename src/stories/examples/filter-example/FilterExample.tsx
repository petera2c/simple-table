import { PRODUCT_HEADERS } from "./filter-headers";
import data from "./filter-data.json";
import { SimpleTable } from "../../..";
import { UniversalTableProps } from "../StoryWrapper";

const shouldPaginate = false;
const howManyRowsCanFit = 12;

// Default args specific to FilterExample - exported for reuse in stories and tests
export const filterExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "75dvh",
};

export const FilterExampleComponent = (props: UniversalTableProps) => {
  return (
    <SimpleTable
      {...props}
      defaultHeaders={PRODUCT_HEADERS}
      rowIdAccessor="id"
      rows={data}
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      {...(shouldPaginate
        ? {
            rowsPerPage: props.rowsPerPage ?? howManyRowsCanFit,
            shouldPaginate: props.shouldPaginate ?? shouldPaginate,
          }
        : {
            height: props.height ?? "75dvh",
          })}
    />
  );
};
