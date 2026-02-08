import { useMemo } from "react";
import { QuickFilterConfig, SmartFilterToken } from "../types/QuickFilterTypes";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { getNestedValue } from "../utils/rowUtils";
import CellValue from "../types/CellValue";
import {
  parseSmartFilter,
  matchesSimpleFilter,
  matchesSmartFilter,
  hasUnmatchedColumnSpecificTokens,
} from "../utils/quickFilterUtils";

interface UseQuickFilterProps {
  rows: Row[];
  headers: HeaderObject[];
  quickFilter?: QuickFilterConfig;
}

/**
 * Hook to filter rows based on quick filter configuration
 * Supports both simple (contains) and smart (multi-word, phrases, negation, column-specific) modes
 */
const useQuickFilter = ({ rows, headers, quickFilter }: UseQuickFilterProps): Row[] => {
  return useMemo(() => {
    // If no quick filter or empty text, return all rows
    if (!quickFilter || !quickFilter.text || quickFilter.text.trim() === "") {
      return rows;
    }

    const {
      text,
      columns,
      caseSensitive = false,
      mode = "simple",
      useFormattedValue = true,
    } = quickFilter;

    // Determine which columns to search
    const searchableHeaders = headers.filter((header) => {
      // Skip hidden columns
      if (header.hide || header.excludeFromRender) return false;

      // If specific columns are provided, only search those
      if (columns && columns.length > 0) {
        return columns.includes(header.accessor);
      }

      // Otherwise, search all columns unless explicitly disabled
      return header.quickFilterable !== false;
    });

    // Parse smart filter tokens if in smart mode
    const smartTokens: SmartFilterToken[] | null =
      mode === "smart" ? parseSmartFilter(text) : null;

    // Filter rows
    return rows.filter((row) => {
      // Track which column-specific tokens have been matched (for smart mode)
      const matchedColumns = new Set<Accessor>();

      // Check if any column matches the filter
      const hasMatch = searchableHeaders.some((header) => {
        try {
          // Get the value to search
          let searchValue: string;

          // Use custom quickFilterGetter if provided
          if (header.quickFilterGetter) {
            searchValue = header.quickFilterGetter({ row, accessor: header.accessor });
          } else {
            // Get raw value
            const cellValue: CellValue = getNestedValue(row, header.accessor);

            // Use formatted value if requested and formatter exists
            if (useFormattedValue && header.valueFormatter) {
              const formatted = header.valueFormatter({
                accessor: header.accessor,
                colIndex: 0, // Not relevant for filtering
                row,
                rowIndex: 0, // Not relevant for filtering
                value: cellValue,
              });

              // Convert formatted value to string
              if (Array.isArray(formatted)) {
                searchValue = formatted.join(" ");
              } else {
                searchValue = String(formatted);
              }
            } else {
              // Use raw value
              if (cellValue === null || cellValue === undefined) {
                searchValue = "";
              } else if (Array.isArray(cellValue)) {
                searchValue = cellValue.join(" ");
              } else {
                searchValue = String(cellValue);
              }
            }
          }

          // Apply filter based on mode
          if (mode === "smart" && smartTokens) {
            const matches = matchesSmartFilter(
              searchValue,
              smartTokens,
              caseSensitive,
              header.accessor
            );

            if (matches) {
              matchedColumns.add(header.accessor);
            }

            return matches;
          } else {
            // Simple mode - just check if value contains filter text
            return matchesSimpleFilter(searchValue, text, caseSensitive);
          }
        } catch (error) {
          console.warn(`Quick filter error for column ${header.accessor}:`, error);
          return false;
        }
      });

      // For smart mode, check if all column-specific tokens were matched
      if (mode === "smart" && smartTokens) {
        if (hasUnmatchedColumnSpecificTokens(smartTokens, matchedColumns)) {
          return false;
        }
      }

      return hasMatch;
    });
  }, [rows, headers, quickFilter]);
};

export default useQuickFilter;
