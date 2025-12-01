import React, { ReactNode } from "react";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
} from "../../types/RowStateRendererProps";

interface RowStateIndicatorProps {
  parentRow: Row;
  rowState: RowState;
  gridTemplateColumns: string;
  loadingStateRenderer?: LoadingStateRenderer;
  errorStateRenderer?: ErrorStateRenderer;
  emptyStateRenderer?: EmptyStateRenderer;
}

/**
 * Default renderer for loading state rows
 */
export const defaultLoadingRenderer: LoadingStateRenderer = () => {
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
export const defaultErrorRenderer: ErrorStateRenderer = ({ error }) => {
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
export const defaultEmptyRenderer: EmptyStateRenderer = ({ message }) => {
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
  loadingStateRenderer = defaultLoadingRenderer,
  errorStateRenderer = defaultErrorRenderer,
  emptyStateRenderer = defaultEmptyRenderer,
}) => {
  let content: ReactNode = null;

  if (rowState.loading) {
    content = loadingStateRenderer({ parentRow });
  } else if (rowState.error) {
    content = errorStateRenderer({ error: rowState.error, parentRow });
  } else if (rowState.isEmpty) {
    content = emptyStateRenderer({ message: rowState.emptyMessage, parentRow });
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
