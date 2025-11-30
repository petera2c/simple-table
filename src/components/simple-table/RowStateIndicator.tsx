import React, { ReactNode } from "react";
import Row from "../../types/Row";
import RowState from "../../types/RowState";

interface RowStateIndicatorProps {
  parentRow: Row;
  rowState: RowState;
  gridTemplateColumns: string;
}

/**
 * Default renderer for loading state rows
 */
const defaultLoadingRenderer = (): ReactNode => {
  return (
    <div
      style={{
        padding: "12px 16px",
        color: "#666",
        fontSize: "14px",
        fontStyle: "italic",
      }}
    >
      Loading...
    </div>
  );
};

/**
 * Default renderer for error state rows
 */
const defaultErrorRenderer = (error: string): ReactNode => {
  return (
    <div
      style={{
        padding: "12px 16px",
        color: "#dc2626",
        fontSize: "14px",
      }}
    >
      Error: {error}
    </div>
  );
};

/**
 * Default renderer for empty state rows
 */
const defaultEmptyRenderer = (message?: string): ReactNode => {
  return (
    <div
      style={{
        padding: "12px 16px",
        color: "#666",
        fontSize: "14px",
        fontStyle: "italic",
      }}
    >
      {message || "No items found"}
    </div>
  );
};

/**
 * Component that renders loading/error/empty states for a row
 * Spans the full width of the table (grid column 1 / -1)
 */
const RowStateIndicator: React.FC<RowStateIndicatorProps> = ({
  parentRow,
  rowState,
  gridTemplateColumns,
}) => {
  let content: ReactNode = null;

  if (rowState.loading) {
    content = defaultLoadingRenderer();
  } else if (rowState.error) {
    content = defaultErrorRenderer(rowState.error);
  } else if (rowState.isEmpty) {
    content = defaultEmptyRenderer(rowState.emptyMessage);
  }

  return (
    <div
      className="st-cell st-state-row-cell"
      style={{
        gridColumn: "1 / -1", // Span all columns
        padding: 0,
      }}
    >
      {content}
    </div>
  );
};

export default RowStateIndicator;
