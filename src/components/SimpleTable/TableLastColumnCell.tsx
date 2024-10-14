import { forwardRef } from "react";

const TableLastColumnCell = forwardRef(
  (props: { isLastRow?: boolean }, ref: any) => {
    return (
      <div
        className={`st-table-cell ${
          props.isLastRow ? "st-table-cell-last-row" : ""
        }`}
        ref={ref}
      />
    );
  }
);

export default TableLastColumnCell;
