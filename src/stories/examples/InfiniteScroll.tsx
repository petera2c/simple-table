import { useState, useCallback } from "react";
import SimpleTable from "../../components/simple-table/SimpleTable";
import { SAAS_HEADERS, SaaSData } from "../data/saas-data";
import CellChangeProps from "../../types/CellChangeProps";
import { UniversalTableProps } from "./StoryWrapper";

// Default args specific to InfiniteScroll - exported for reuse in stories and tests
export const infiniteScrollDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "calc(100dvh - 112px)",
  shouldPaginate: false,
};

/**
 * # Infinite Scroll Example
 *
 * This example demonstrates the infinite scrolling functionality of Simple Table.
 *
 * ## Features Demonstrated
 * - Loading and displaying large datasets without pagination
 * - Automatically loading more data as the user scrolls
 * - Maintaining performance with large data sets
 * - Combining infinite scroll with cell editing capabilities
 * - Simulated API calls for loading additional data
 *
 * Infinite scrolling is an alternative to pagination that provides a more
 * continuous user experience, particularly for large datasets where users
 * need to browse through many rows of data.
 */

const INITIAL_ROWS_COUNT = 50;
const LOAD_MORE_COUNT = 25;
const HEADERS = SAAS_HEADERS;

// Simulate API delay
const simulateApiDelay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Local data generation function that accepts parameters
const generateSaaSDataWithParams = (count: number, startId: number = 0): SaaSData[] => {
  const segments = ["Freelancers", "Small Business", "Startups", "Corporations", "Nonprofits"];
  const features = ["Analytics", "Collaboration", "Storage", "API Access"];
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Crypto"];
  const tiers = ["Basic", "Pro", "Enterprise", "Premium"];

  return Array.from({ length: count }, (_, index) => {
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const year = 2023 + Math.floor(Math.random() * 3);
    const monthlyRevenue = Math.floor(Math.random() * 100000) + 1000;
    const churnRate = parseFloat((Math.random() * 5).toFixed(1));
    const avgSessionTime = Math.floor(Math.random() * 60);
    const renewalDate = `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;
    const signUpDate = `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`;
    const lastLoginDay2 = Math.floor(Math.random() * 18) + 1;
    const lastLogin = `2025-03-${lastLoginDay2 < 10 ? `0${lastLoginDay2}` : lastLoginDay2}`;
    const supportTickets = Math.floor(Math.random() * 100);
    const activeUsers = Math.floor(Math.random() * 5000) + 50;
    const customerSatisfaction = parseFloat((Math.random() * 5).toFixed(1));

    return {
      id: startId + index,
      tier,
      segment,
      monthlyRevenue,
      activeUsers,
      churnRate,
      avgSessionTime,
      renewalDate,
      supportTickets,
      signUpDate,
      lastLogin,
      featureUsage: features[Math.floor(Math.random() * features.length)],
      customerSatisfaction,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    };
  });
};

const InfiniteScrollExample = (props: UniversalTableProps) => {
  const [rows, setRows] = useState(() => generateSaaSDataWithParams(INITIAL_ROWS_COUNT));
  const [isLoading, setIsLoading] = useState(false);
  const [totalLoadedRows, setTotalLoadedRows] = useState(INITIAL_ROWS_COUNT);

  const updateCell = ({ accessor, newValue, row }: CellChangeProps<SaaSData>) => {
    setRows((prevRows) => {
      const rowIndex = prevRows.findIndex((r) => r.id === row.id);
      if (rowIndex !== -1) {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [accessor]: newValue };
        return updatedRows;
      }
      return prevRows;
    });
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await simulateApiDelay();

      // Generate new data with unique IDs
      const newRows = generateSaaSDataWithParams(LOAD_MORE_COUNT, totalLoadedRows);

      // Append new rows to existing data
      setRows((prevRows) => [...prevRows, ...newRows]);
      setTotalLoadedRows((prev) => prev + LOAD_MORE_COUNT);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, totalLoadedRows]);

  return (
    <div>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          Loading more data...
        </div>
      )}
      <SimpleTable
        {...props}
        defaultHeaders={HEADERS}
        onCellEdit={updateCell}
        onLoadMore={handleLoadMore}
        rows={rows}
        rowIdAccessor="id"
        // Default settings for this example
        columnResizing={props.columnResizing ?? true}
        columnReordering={props.columnReordering ?? true}
        selectableCells={props.selectableCells ?? true}
        height={props.height ?? "calc(100dvh - 112px)"}
        shouldPaginate={props.shouldPaginate ?? false} // Disable pagination for infinite scrolling
      />
    </div>
  );
};

export default InfiniteScrollExample;
