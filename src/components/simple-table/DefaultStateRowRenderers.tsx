import { ReactNode } from "react";
import Row from "../../types/Row";

/**
 * Default renderer for loading state rows
 */
export const defaultLoadingRowRenderer = (row: Row): ReactNode => {
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
export const defaultErrorRowRenderer = (row: Row, error: string): ReactNode => {
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
export const defaultEmptyRowRenderer = (row: Row, message?: string): ReactNode => {
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
