import { useMemo } from "react";
import { QuickFilterConfig, SmartFilterToken } from "../types/QuickFilterTypes";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { getNestedValue } from "../utils/rowUtils";
import CellValue from "../types/CellValue";
import { parseSmartFilter, matchesSimpleFilter } from "../utils/quickFilterUtils";

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
      // For smart mode, we need to check if all tokens are satisfied across the row
      if (mode === "smart" && smartTokens) {
        // Track which tokens have been matched
        const matchedTokens = new Set<number>();
        const columnSpecificTokens = new Map<Accessor, number[]>();

        // First pass: identify column-specific tokens
        smartTokens.forEach((token, index) => {
          if (token.type === "columnSpecific" && token.column) {
            if (!columnSpecificTokens.has(token.column)) {
              columnSpecificTokens.set(token.column, []);
            }
            columnSpecificTokens.get(token.column)!.push(index);
          }
        });

        // Build a combined search string from all columns for non-column-specific tokens
        const allColumnValues: string[] = [];

        searchableHeaders.forEach((header) => {
          try {
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
                  colIndex: 0,
                  row,
                  rowIndex: 0,
                  value: cellValue,
                });

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

            allColumnValues.push(searchValue);

            // Check column-specific tokens for this column
            const columnTokenIndices = columnSpecificTokens.get(header.accessor);
            if (columnTokenIndices) {
              columnTokenIndices.forEach((tokenIndex) => {
                const token = smartTokens[tokenIndex];
                const searchVal = caseSensitive ? searchValue : searchValue.toLowerCase();
                const tokenVal = caseSensitive ? token.value : token.value.toLowerCase();

                if (searchVal.includes(tokenVal)) {
                  matchedTokens.add(tokenIndex);
                }
              });
            }
          } catch (error) {
            console.warn(`Quick filter error for column ${header.accessor}:`, error);
          }
        });

        // Combine all column values for non-column-specific token matching
        const combinedValue = caseSensitive
          ? allColumnValues.join(" ")
          : allColumnValues.join(" ").toLowerCase();

        // Check non-column-specific tokens against combined value
        smartTokens.forEach((token, index) => {
          if (token.type === "columnSpecific") {
            // Already handled above
            return;
          }

          const tokenVal = caseSensitive ? token.value : token.value.toLowerCase();

          switch (token.type) {
            case "word":
            case "phrase":
              if (combinedValue.includes(tokenVal)) {
                matchedTokens.add(index);
              }
              break;

            case "negation":
              if (!combinedValue.includes(tokenVal)) {
                matchedTokens.add(index);
              }
              break;
          }
        });

        // All tokens must be matched for the row to pass
        return matchedTokens.size === smartTokens.length;
      } else {
        // Simple mode - check if any column matches
        return searchableHeaders.some((header) => {
          try {
            let searchValue: string;

            if (header.quickFilterGetter) {
              searchValue = header.quickFilterGetter({ row, accessor: header.accessor });
            } else {
              const cellValue: CellValue = getNestedValue(row, header.accessor);

              if (useFormattedValue && header.valueFormatter) {
                const formatted = header.valueFormatter({
                  accessor: header.accessor,
                  colIndex: 0,
                  row,
                  rowIndex: 0,
                  value: cellValue,
                });

                if (Array.isArray(formatted)) {
                  searchValue = formatted.join(" ");
                } else {
                  searchValue = String(formatted);
                }
              } else {
                if (cellValue === null || cellValue === undefined) {
                  searchValue = "";
                } else if (Array.isArray(cellValue)) {
                  searchValue = cellValue.join(" ");
                } else {
                  searchValue = String(cellValue);
                }
              }
            }

            return matchesSimpleFilter(searchValue, text, caseSensitive);
          } catch (error) {
            console.warn(`Quick filter error for column ${header.accessor}:`, error);
            return false;
          }
        });
      }
    });
  }, [rows, headers, quickFilter]);
};

export default useQuickFilter;
