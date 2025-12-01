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
 * Component that renders loading/error/empty states for a row
 * Spans the full width of the table (grid column 1 / -1)
 */
const RowStateIndicator: React.FC<RowStateIndicatorProps> = ({
  rowState,
  loadingStateRenderer,
  errorStateRenderer,
  emptyStateRenderer,
}) => {
  let content: ReactNode = null;

  if (rowState.loading && loadingStateRenderer) {
    content = loadingStateRenderer;
  } else if (rowState.error && errorStateRenderer) {
    content = errorStateRenderer;
  } else if (rowState.isEmpty && emptyStateRenderer) {
    content = emptyStateRenderer;
  }

  // If no content to render, return null
  if (!content) {
    return null;
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
