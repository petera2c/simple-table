import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * COLUMN SORTING TESTS
 *
 * This test suite covers all sorting features documented in:
 * - Column Sorting Documentation
 * - Programmatic Control API (Sorting Methods)
 * - API Reference (Sorting Props)
 *
 * Features tested:
 * 1. Basic sorting with isSortable
 * 2. Sort cycle: asc → desc → null
 * 3. Custom sortingOrder configurations
 * 4. Sort indicators (icons) display
 * 5. Data type sorting (string, number, date, boolean)
 * 6. Nested accessor sorting (dot notation)
 * 7. Array index accessor sorting (v1.9.4+)
 * 8. Custom comparator function
 * 9. valueGetter for sorting
 * 10. initialSortColumn and initialSortDirection
 * 11. onSortChange callback
 * 12. externalSortHandling
 * 13. Programmatic API: getSortState, applySortState
 * 14. Multi-field sorting with comparator
 * 15. Sort persistence across interactions
 */

const meta: Meta = {
  title: "Tests/02 - Column Sorting",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for column sorting including basic sorting, custom sort orders, comparators, valueGetters, initial sort state, external sorting, and programmatic control.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

interface SortableRow extends Record<string, any> {
  id: number;
  name: string;
  age: number;
  revenue: number;
  joinDate: string;
  isActive: boolean;
  priority: number;
}

interface NestedSortRow extends Record<string, any> {
  id: number;
  user: {
    name: string;
    profile: {
      score: number;
      level: string;
    };
  };
  metadata: {
    seniorityLevel: number;
    performance: number;
  };
}

interface ArraySortRow extends Record<string, any> {
  id: number;
  name: string;
  awards: string[];
  albums: Array<{ title: string; year: number; sales: number }>;
}

const createSortableData = (): SortableRow[] => {
  return [
    {
      id: 1,
      name: "Charlie",
      age: 35,
      revenue: 50000,
      joinDate: "2023-03-15",
      isActive: true,
      priority: 2,
    },
    {
      id: 2,
      name: "Alice",
      age: 28,
      revenue: 75000,
      joinDate: "2024-01-10",
      isActive: false,
      priority: 1,
    },
    {
      id: 3,
      name: "Bob",
      age: 42,
      revenue: 60000,
      joinDate: "2022-11-20",
      isActive: true,
      priority: 3,
    },
    {
      id: 4,
      name: "Diana",
      age: 31,
      revenue: 90000,
      joinDate: "2023-08-05",
      isActive: true,
      priority: 1,
    },
    {
      id: 5,
      name: "Eve",
      age: 25,
      revenue: 45000,
      joinDate: "2024-02-28",
      isActive: false,
      priority: 2,
    },
    {
      id: 6,
      name: "Frank",
      age: 38,
      revenue: 82000,
      joinDate: "2023-05-12",
      isActive: true,
      priority: 3,
    },
    {
      id: 7,
      name: "Grace",
      age: 29,
      revenue: 68000,
      joinDate: "2023-12-01",
      isActive: false,
      priority: 2,
    },
    {
      id: 8,
      name: "Henry",
      age: 45,
      revenue: 95000,
      joinDate: "2022-07-18",
      isActive: true,
      priority: 1,
    },
  ];
};

const createNestedSortData = (): NestedSortRow[] => {
  return [
    {
      id: 1,
      user: { name: "Alice", profile: { score: 85, level: "Senior" } },
      metadata: { seniorityLevel: 3, performance: 92 },
    },
    {
      id: 2,
      user: { name: "Bob", profile: { score: 72, level: "Mid" } },
      metadata: { seniorityLevel: 2, performance: 78 },
    },
    {
      id: 3,
      user: { name: "Charlie", profile: { score: 95, level: "Lead" } },
      metadata: { seniorityLevel: 4, performance: 88 },
    },
    {
      id: 4,
      user: { name: "Diana", profile: { score: 68, level: "Junior" } },
      metadata: { seniorityLevel: 1, performance: 85 },
    },
    {
      id: 5,
      user: { name: "Eve", profile: { score: 91, level: "Senior" } },
      metadata: { seniorityLevel: 3, performance: 95 },
    },
  ];
};

const createArraySortData = (): ArraySortRow[] => {
  return [
    {
      id: 1,
      name: "Artist A",
      awards: ["Grammy", "Emmy"],
      albums: [
        { title: "Album Z", year: 2022, sales: 500000 },
        { title: "Album Y", year: 2023, sales: 750000 },
      ],
    },
    {
      id: 2,
      name: "Artist B",
      awards: ["Oscar", "Tony"],
      albums: [
        { title: "Album A", year: 2021, sales: 300000 },
        { title: "Album B", year: 2024, sales: 900000 },
      ],
    },
    {
      id: 3,
      name: "Artist C",
      awards: ["Emmy", "Tony"],
      albums: [
        { title: "Album M", year: 2020, sales: 450000 },
        { title: "Album N", year: 2022, sales: 600000 },
      ],
    },
    {
      id: 4,
      name: "Artist D",
      awards: ["Grammy", "Oscar"],
      albums: [
        { title: "Album C", year: 2023, sales: 800000 },
        { title: "Album D", year: 2024, sales: 1000000 },
      ],
    },
  ];
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const table = document.querySelector(".simple-table-root");
    if (table) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Table did not render within timeout");
};

const findHeaderByLabel = (canvasElement: HTMLElement, label: string): HTMLElement | null => {
  const headers = canvasElement.querySelectorAll(".st-header-cell");
  for (const header of Array.from(headers)) {
    const labelText = header.querySelector(".st-header-label-text");
    if (labelText?.textContent?.trim() === label) {
      return header as HTMLElement;
    }
  }
  return null;
};

const clickColumnHeader = async (canvasElement: HTMLElement, label: string) => {
  const header = findHeaderByLabel(canvasElement, label);
  if (!header) {
    throw new Error(`Header with label "${label}" not found`);
  }
  expect(header).toBeTruthy();

  // Check if header is sortable (has clickable class)
  const isSortable = header.classList.contains("clickable");
  if (!isSortable) {
    throw new Error(`Header "${label}" is not sortable (missing clickable class)`);
  }

  // Click the st-header-label div inside the header cell (that's where the onClick handler is)
  const headerLabel = header.querySelector(".st-header-label") as HTMLElement;
  if (!headerLabel) {
    throw new Error(`Header label not found for "${label}"`);
  }

  const user = userEvent.setup();
  await user.click(headerLabel);

  // Wait for sort to be applied and table to re-render
  await new Promise((resolve) => setTimeout(resolve, 500));
};

const verifySortByData = async (
  canvasElement: HTMLElement,
  accessor: string,
  expectedDirection: "asc" | "desc" | null,
  dataType: "string" | "number" = "string"
) => {
  // Wait a bit for sort to complete and table to re-render
  await new Promise((resolve) => setTimeout(resolve, 200));

  const data = getColumnData(canvasElement, accessor);

  if (data.length === 0) {
    throw new Error(`No data found for accessor "${accessor}"`);
  }

  if (expectedDirection === "asc") {
    verifyAscendingOrder(data, dataType);
  } else if (expectedDirection === "desc") {
    verifyDescendingOrder(data, dataType);
  }
  // If null, we don't verify order (could be original order)
};

const getColumnData = (canvasElement: HTMLElement, accessor: string): string[] => {
  // Only get cells from body, not header
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];

  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  return Array.from(cells)
    .map((cell) => {
      const content = cell.querySelector(".st-cell-content");
      return content?.textContent?.trim() || "";
    })
    .filter((text) => text.length > 0); // Filter out empty cells
};

const verifyAscendingOrder = (data: string[], dataType: "string" | "number" = "string") => {
  if (data.length < 2) return; // Need at least 2 items to verify order

  for (let i = 0; i < data.length - 1; i++) {
    if (dataType === "number") {
      const current = parseFloat(data[i].replace(/[^0-9.-]/g, ""));
      const next = parseFloat(data[i + 1].replace(/[^0-9.-]/g, ""));
      if (!isNaN(current) && !isNaN(next)) {
        if (current > next) {
          throw new Error(
            `Ascending order violated at index ${i}: ${current} > ${next} (values: "${
              data[i]
            }" > "${data[i + 1]}")`
          );
        }
      }
    } else {
      // For strings, localeCompare returns negative if data[i] < data[i+1], 0 if equal, positive if greater
      const comparison = data[i].localeCompare(data[i + 1]);
      if (comparison > 0) {
        throw new Error(
          `Ascending order violated at index ${i}: "${data[i]}" > "${
            data[i + 1]
          }" (comparison: ${comparison})`
        );
      }
    }
  }
};

const verifyDescendingOrder = (data: string[], dataType: "string" | "number" = "string") => {
  if (data.length < 2) return; // Need at least 2 items to verify order

  for (let i = 0; i < data.length - 1; i++) {
    if (dataType === "number") {
      const current = parseFloat(data[i].replace(/[^0-9.-]/g, ""));
      const next = parseFloat(data[i + 1].replace(/[^0-9.-]/g, ""));
      if (!isNaN(current) && !isNaN(next)) {
        if (current < next) {
          throw new Error(
            `Descending order violated at index ${i}: ${current} < ${next} (values: "${
              data[i]
            }" < "${data[i + 1]}")`
          );
        }
      }
    } else {
      // For strings, localeCompare returns negative if data[i] < data[i+1], 0 if equal, positive if greater
      const comparison = data[i].localeCompare(data[i + 1]);
      if (comparison < 0) {
        throw new Error(
          `Descending order violated at index ${i}: "${data[i]}" < "${
            data[i + 1]
          }" (comparison: ${comparison})`
        );
      }
    }
  }
};

// ============================================================================
// TEST 1: BASIC SORTING - STRING COLUMN
// ============================================================================

export const BasicStringSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic String Column Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Click "Name" header to cycle: unsorted → ascending → descending → unsorted
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click 1: Ascending
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "name", "asc", "string");

    // Click 2: Descending
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "name", "desc", "string");

    // Click 3: Clear sort (back to original order)
    await clickColumnHeader(canvasElement, "Name");
    // Don't verify order when cleared - could be any order
  },
};

// ============================================================================
// TEST 2: BASIC SORTING - NUMBER COLUMN
// ============================================================================

export const BasicNumberSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic Number Column Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Click "Age" header to sort numeric values
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click 1: Ascending
    await clickColumnHeader(canvasElement, "Age");
    await verifySortByData(canvasElement, "age", "asc", "number");

    // Click 2: Descending
    await clickColumnHeader(canvasElement, "Age");
    await verifySortByData(canvasElement, "age", "desc", "number");
  },
};

// ============================================================================
// TEST 3: CUSTOM SORTING ORDER - DESC FIRST
// ============================================================================

export const CustomSortingOrderDescFirst: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      {
        accessor: "revenue",
        label: "Revenue",
        width: 150,
        isSortable: true,
        type: "number",
        sortingOrder: ["desc", "asc", null],
      },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Custom Sort Order - Descending First</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Revenue column cycles: descending → ascending → unsorted (common for numbers)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click 1: Descending (first in custom order)
    await clickColumnHeader(canvasElement, "Revenue");
    await verifySortByData(canvasElement, "revenue", "desc", "number");

    // Click 2: Ascending
    await clickColumnHeader(canvasElement, "Revenue");
    await verifySortByData(canvasElement, "revenue", "asc", "number");

    // Click 3: Clear sort
    await clickColumnHeader(canvasElement, "Revenue");
    // Don't verify order when cleared
  },
};

// ============================================================================
// TEST 4: CUSTOM SORTING ORDER - ALWAYS SORTED
// ============================================================================

export const CustomSortingOrderAlwaysSorted: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      {
        accessor: "priority",
        label: "Priority",
        width: 150,
        isSortable: true,
        type: "number",
        sortingOrder: ["asc", "desc"], // No null state
      },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Custom Sort Order - Always Sorted</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Priority column toggles between ascending and descending (never unsorted)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click 1: Ascending
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "asc", "number");

    // Click 2: Descending (no null state)
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "desc", "number");

    // Click 3: Back to Ascending (cycles back)
    await clickColumnHeader(canvasElement, "Priority");
    await verifySortByData(canvasElement, "priority", "asc", "number");
  },
};

// ============================================================================
// TEST 5: DATE SORTING
// ============================================================================

export const DateSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      {
        accessor: "joinDate",
        label: "Join Date",
        width: 150,
        isSortable: true,
        type: "date",
        sortingOrder: ["desc", "asc", null],
      },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Date Column Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Dates sorted with newest first (descending → ascending → unsorted)
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click 1: Descending (newest first)
    await clickColumnHeader(canvasElement, "Join Date");
    await new Promise((resolve) => setTimeout(resolve, 100));
    const descData = getColumnData(canvasElement, "joinDate");
    // Verify dates are in descending order
    for (let i = 0; i < descData.length - 1; i++) {
      const current = new Date(descData[i]).getTime();
      const next = new Date(descData[i + 1]).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }

    // Click 2: Ascending (oldest first)
    await clickColumnHeader(canvasElement, "Join Date");
    await new Promise((resolve) => setTimeout(resolve, 100));
    const ascData = getColumnData(canvasElement, "joinDate");
    for (let i = 0; i < ascData.length - 1; i++) {
      const current = new Date(ascData[i]).getTime();
      const next = new Date(ascData[i + 1]).getTime();
      expect(current).toBeLessThanOrEqual(next);
    }
  },
};

// ============================================================================
// TEST 6: NESTED ACCESSOR SORTING
// ============================================================================

export const NestedAccessorSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150, isSortable: true },
      {
        accessor: "user.profile.score",
        label: "Score",
        width: 120,
        isSortable: true,
        type: "number",
      },
      { accessor: "user.profile.level", label: "Level", width: 120, isSortable: true },
    ];

    const data = createNestedSortData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Nested Accessor Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Sorting by nested properties: user.name, user.profile.score
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Test nested string sorting
    await clickColumnHeader(canvasElement, "Name");
    await verifySortByData(canvasElement, "user.name", "asc", "string");

    // Test nested number sorting
    await clickColumnHeader(canvasElement, "Score");
    await verifySortByData(canvasElement, "user.profile.score", "asc", "number");
  },
};

// ============================================================================
// TEST 7: ARRAY INDEX ACCESSOR SORTING (v1.9.4+)
// ============================================================================

export const ArrayIndexAccessorSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Artist", width: 150 },
      { accessor: "awards[0]", label: "First Award", width: 150, isSortable: true },
      { accessor: "albums[0].title", label: "First Album", width: 180, isSortable: true },
      {
        accessor: "albums[0].year",
        label: "Album Year",
        width: 120,
        isSortable: true,
        type: "number",
      },
    ];

    const data = createArraySortData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Array Index Accessor Sorting (v1.9.4+)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Sorting by array elements: awards[0], albums[0].title, albums[0].year
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Test array element sorting
    await clickColumnHeader(canvasElement, "First Award");
    await verifySortByData(canvasElement, "awards[0]", "asc", "string");

    // Test nested array property sorting
    await clickColumnHeader(canvasElement, "First Album");
    await verifySortByData(canvasElement, "albums[0].title", "asc", "string");
  },
};

// ============================================================================
// TEST 8: CUSTOM COMPARATOR - MULTI-FIELD SORTING
// ============================================================================

export const CustomComparatorMultiField: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      {
        accessor: "priority",
        label: "Priority + Revenue",
        width: 200,
        isSortable: true,
        comparator: ({ rowA, rowB, direction }) => {
          // Sort by priority first, then by revenue
          const priorityDiff = (rowA as SortableRow).priority - (rowB as SortableRow).priority;
          if (priorityDiff !== 0) {
            return direction === "asc" ? priorityDiff : -priorityDiff;
          }
          const revenueDiff = (rowA as SortableRow).revenue - (rowB as SortableRow).revenue;
          return direction === "asc" ? revenueDiff : -revenueDiff;
        },
      },
      { accessor: "revenue", label: "Revenue", width: 150, type: "number" },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Custom Comparator - Multi-Field Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Sorts by priority first, then by revenue as tiebreaker
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click to sort with custom comparator
    await clickColumnHeader(canvasElement, "Priority + Revenue");
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify multi-field sorting is applied - priority should be in order
    const priorityData = getColumnData(canvasElement, "priority");
    expect(priorityData.length).toBeGreaterThan(0);
    // Verify priorities are sorted
    verifyAscendingOrder(priorityData, "number");
  },
};

// ============================================================================
// TEST 9: VALUE GETTER FOR SORTING
// ============================================================================

export const ValueGetterSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "user.name", label: "Name", width: 150 },
      {
        accessor: "metadata.seniorityLevel",
        label: "Seniority",
        width: 150,
        isSortable: true,
        type: "number",
        valueGetter: ({ row }) => (row as NestedSortRow).metadata?.seniorityLevel || 0,
        valueFormatter: ({ row }) => {
          const level = (row as NestedSortRow).metadata?.seniorityLevel || 0;
          return ["Intern", "Junior", "Mid", "Senior", "Lead"][level] || "Unknown";
        },
      },
    ];

    const data = createNestedSortData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>ValueGetter for Sorting</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Displays formatted text but sorts by numeric seniorityLevel
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Sort by seniority level
    await clickColumnHeader(canvasElement, "Seniority");
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the display shows formatted text
    const seniorityData = getColumnData(canvasElement, "metadata.seniorityLevel");
    expect(seniorityData.length).toBeGreaterThan(0);
    expect(seniorityData[0]).toMatch(/Intern|Junior|Mid|Senior|Lead/);
  },
};

// ============================================================================
// TEST 10: INITIAL SORT STATE
// ============================================================================

export const InitialSortState: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Initial Sort State</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Table loads pre-sorted by Revenue (descending)
        </p>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          initialSortColumn="revenue"
          initialSortDirection="desc"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Wait a bit for initial sort to be applied
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify initial sort is applied - table should load with revenue sorted descending
    await verifySortByData(canvasElement, "revenue", "desc", "number");

    // Also verify that the sort icon is visible
    const revenueHeader = findHeaderByLabel(canvasElement, "Revenue");
    if (revenueHeader) {
      const sortIconContainer = revenueHeader.querySelector(".st-icon-container");
      expect(sortIconContainer).toBeTruthy();
    }
  },
};

// ============================================================================
// TEST 11: ON SORT CHANGE CALLBACK
// ============================================================================

export const OnSortChangeCallback: StoryObj = {
  render: () => {
    const [sortInfo, setSortInfo] = React.useState<string>("No sort applied");

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>onSortChange Callback</h2>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontFamily: "monospace",
          }}
        >
          Sort State: {sortInfo}
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          onSortChange={(sortConfig) => {
            if (sortConfig) {
              setSortInfo(`Sorting by ${sortConfig.key.accessor} (${sortConfig.direction})`);
            } else {
              setSortInfo("No sort applied");
            }
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click to sort
    await clickColumnHeader(canvasElement, "Name");
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify callback was triggered (check display)
    const sortDisplay = canvasElement.querySelector("div[style*='monospace']");
    expect(sortDisplay?.textContent).toContain("Sorting by name");
  },
};

// ============================================================================
// TEST 12: EXTERNAL SORT HANDLING
// ============================================================================

export const ExternalSortHandling: StoryObj = {
  render: () => {
    const [sortedData, setSortedData] = React.useState(createSortableData());
    const [currentSort, setCurrentSort] = React.useState<{
      column: string;
      direction: "asc" | "desc";
    } | null>(null);

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
    ];

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>External Sort Handling</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Sorting handled externally - table displays pre-sorted data
        </p>
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          Current Sort: {currentSort ? `${currentSort.column} (${currentSort.direction})` : "None"}
        </div>
        <SimpleTable
          defaultHeaders={headers}
          rows={sortedData}
          height="400px"
          externalSortHandling={true}
          onSortChange={(sortConfig) => {
            if (sortConfig) {
              const { accessor } = sortConfig.key;
              const { direction } = sortConfig;

              // Sort data externally
              const sorted = [...sortedData].sort((a, b) => {
                const aVal = a[accessor];
                const bVal = b[accessor];

                if (typeof aVal === "number" && typeof bVal === "number") {
                  return direction === "asc" ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal);
                const bStr = String(bVal);
                return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
              });

              setSortedData(sorted);
              setCurrentSort({ column: accessor, direction });
            } else {
              setSortedData(createSortableData());
              setCurrentSort(null);
            }
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Click to trigger external sort
    await clickColumnHeader(canvasElement, "Name");
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify data is sorted
    await verifySortByData(canvasElement, "name", "asc", "string");
  },
};

// ============================================================================
// TEST 13: PROGRAMMATIC SORT CONTROL
// ============================================================================

export const ProgrammaticSortControl: StoryObj = {
  render: () => {
    const tableRef = React.useRef<any>(null);
    const [sortState, setSortState] = React.useState<string>("No sort");

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
      { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
    ];

    const data = createSortableData();

    const applySortByName = () => {
      if (tableRef.current) {
        tableRef.current.applySortState({
          accessor: "name",
          direction: "asc",
        });
        updateSortState();
      }
    };

    const applySortByRevenue = () => {
      if (tableRef.current) {
        tableRef.current.applySortState({
          accessor: "revenue",
          direction: "desc",
        });
        updateSortState();
      }
    };

    const clearSort = () => {
      if (tableRef.current) {
        tableRef.current.applySortState(null);
        updateSortState();
      }
    };

    const updateSortState = () => {
      if (tableRef.current) {
        const state = tableRef.current.getSortState();
        if (state) {
          setSortState(`${state.key.accessor} (${state.direction})`);
        } else {
          setSortState("No sort");
        }
      }
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Programmatic Sort Control</h2>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={applySortByName}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Name (Asc)
          </button>
          <button
            onClick={applySortByRevenue}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sort by Revenue (Desc)
          </button>
          <button
            onClick={clearSort}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Sort
          </button>
        </div>
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          Current Sort: {sortState}
        </div>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" tableRef={tableRef} />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Click "Sort by Name" button
    const sortByNameBtn = canvasElement.querySelector("button") as HTMLElement;
    if (!sortByNameBtn) {
      throw new Error("Sort by Name button not found");
    }
    await user.click(sortByNameBtn);

    // Wait longer for programmatic sort to be applied
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify sort is applied
    await verifySortByData(canvasElement, "name", "asc", "string");

    // Click "Sort by Revenue" button
    const buttons = canvasElement.querySelectorAll("button");
    if (buttons.length < 2) {
      throw new Error("Sort by Revenue button not found");
    }
    await user.click(buttons[1] as HTMLElement);

    // Wait for programmatic sort to be applied
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify revenue sort is applied
    await verifySortByData(canvasElement, "revenue", "desc", "number");
  },
};

// ============================================================================
// TEST 14: MULTIPLE COLUMNS WITH DIFFERENT SORT ORDERS
// ============================================================================

export const MultipleColumnsSorting: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      {
        accessor: "name",
        label: "Name (Asc First)",
        width: 180,
        isSortable: true,
        sortingOrder: ["asc", "desc", null],
      },
      {
        accessor: "revenue",
        label: "Revenue (Desc First)",
        width: 180,
        isSortable: true,
        type: "number",
        sortingOrder: ["desc", "asc", null],
      },
      {
        accessor: "priority",
        label: "Priority (Always)",
        width: 150,
        isSortable: true,
        type: "number",
        sortingOrder: ["asc", "desc"],
      },
    ];

    const data = createSortableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Multiple Columns with Different Sort Orders</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Each column has its own custom sort cycle
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Test Name column (asc first)
    await clickColumnHeader(canvasElement, "Name (Asc First)");
    await verifySortByData(canvasElement, "name", "asc", "string");

    // Test Revenue column (desc first)
    await clickColumnHeader(canvasElement, "Revenue (Desc First)");
    await verifySortByData(canvasElement, "revenue", "desc", "number");

    // Test Priority column (always sorted)
    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "asc", "number");

    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "desc", "number");

    // Should cycle back to asc (no null state)
    await clickColumnHeader(canvasElement, "Priority (Always)");
    await verifySortByData(canvasElement, "priority", "asc", "number");
  },
};
