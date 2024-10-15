import { forwardRef } from "react";

const TableLastColumnCell = forwardRef(
  (props: { isLastRow?: boolean; visible: boolean }, ref: any) => {
    if (!props.visible) return <div ref={ref} />;
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
