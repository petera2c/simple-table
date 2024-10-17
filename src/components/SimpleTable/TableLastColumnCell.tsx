import { forwardRef } from "react";

const TableLastColumnCell = forwardRef(
  (props: { visible: boolean }, ref: any) => {
    if (!props.visible) return <div ref={ref} />;
    return <div className="st-cell" ref={ref} />;
  }
);

export default TableLastColumnCell;
