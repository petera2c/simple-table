import { calculateSeparatorTopPosition } from "../../utils/infiniteScrollUtils";

const TableRowSeparator = ({
  lastGroupRow,
  position,
  rowHeight,
  templateColumns,
}: {
  lastGroupRow?: boolean;
  position: number;
  rowHeight: number;
  templateColumns: string;
}) => {
  return (
    <div
      className={`st-row-separator ${lastGroupRow ? "st-last-group-row" : ""}`}
      style={{
        display: "grid",
        gridTemplateColumns: templateColumns,
        position: "absolute",
        top: calculateSeparatorTopPosition({ position, rowHeight }),
      }}
    >
      <div style={{ gridColumn: "1 / -1" }} />
    </div>
  );
};

export default TableRowSeparator;
