import { calculateSeparatorTopPosition } from "../../utils/infiniteScrollUtils";

const TableRowSeparator = ({
  isExpandedGroupSeparator,
  position,
  rowHeight,
  templateColumns,
}: {
  isExpandedGroupSeparator?: boolean;
  position: number;
  rowHeight: number;
  templateColumns: string;
}) => {
  return (
    <div
      className={`st-row-separator ${isExpandedGroupSeparator ? "st-last-group-row" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: templateColumns,
        position: "absolute",
        top: calculateSeparatorTopPosition({ position, rowHeight }),
        minWidth: "100%",
      }}
    >
      <div style={{ gridColumn: "1 / -1" }} />
    </div>
  );
};

export default TableRowSeparator;
