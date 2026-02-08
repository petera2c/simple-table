import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * QUICK FILTER TESTS
 *
 * This test suite covers the quick filter / global search feature:
 * - Basic quick filter functionality (simple mode)
 * - Smart mode with multi-word, phrases, negation, column-specific
 * - Case sensitivity
 * - Column selection
 * - Integration with column filters
 * - Programmatic control via tableRef
 */

const meta: Meta = {
  title: "Tests/18 - Quick Filter",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive tests for quick filter / global search functionality including simple and smart modes.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

interface TestRow extends Record<string, any> {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  status: string;
  location: string;
}

const createTestData = (): TestRow[] => {
  return [
    {
      id: 1,
      name: "Alice Johnson",
      age: 28,
      email: "alice.johnson@example.com",
      department: "Engineering",
      status: "Active",
      location: "New York",
    },
    {
      id: 2,
      name: "Bob Smith",
      age: 35,
      email: "bob.smith@example.com",
      department: "Sales",
      status: "Active",
      location: "Los Angeles",
    },
    {
      id: 3,
      name: "Charlie Davis",
      age: 42,
      email: "charlie.davis@example.com",
      department: "Engineering",
      status: "Active",
      location: "San Francisco",
    },
    {
      id: 4,
      name: "Diana Prince",
      age: 31,
      email: "diana.prince@example.com",
      department: "Marketing",
      status: "Inactive",
      location: "Chicago",
    },
    {
      id: 5,
      name: "Ethan Hunt",
      age: 29,
      email: "ethan.hunt@example.com",
      department: "Sales",
      status: "Active",
      location: "Boston",
    },
    {
      id: 6,
      name: "Fiona Green",
      age: 38,
      email: "fiona.green@example.com",
      department: "Engineering",
      status: "Active",
      location: "Seattle",
    },
    {
      id: 7,
      name: "George Wilson",
      age: 26,
      email: "george.wilson@example.com",
      department: "Marketing",
      status: "Active",
      location: "Austin",
    },
    {
      id: 8,
      name: "Hannah Lee",
      age: 33,
      email: "hannah.lee@example.com",
      department: "Sales",
      status: "Inactive",
      location: "Denver",
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

const getVisibleRowCount = (canvasElement: HTMLElement): number => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return 0;
  const rows = bodyContainer.querySelectorAll(".st-row");
  return rows.length;
};

const getColumnData = (canvasElement: HTMLElement, accessor: string): string[] => {
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  if (!bodyContainer) return [];

  const cells = bodyContainer.querySelectorAll(`[data-accessor="${accessor}"]`);
  return Array.from(cells)
    .map((cell) => {
      const content = cell.querySelector(".st-cell-content");
      return content?.textContent?.trim() || "";
    })
    .filter((text) => text.length > 0);
};

// ============================================================================
// TEST 1: BASIC QUICK FILTER (SIMPLE MODE)
// ============================================================================

export const BasicQuickFilterSimpleMode: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "age", label: "Age", width: 80 },
      { accessor: "department", label: "Department", width: 140 },
      { accessor: "email", label: "Email", width: 220 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Basic Quick Filter (Simple Mode)</h2>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search across all columns..."
          data-testid="quick-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            mode: "simple",
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Initial state - all 8 rows visible
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(8);

    // Type "engineering" in search box
    const input = canvasElement.querySelector(
      'input[data-testid="quick-filter-input"]'
    ) as HTMLInputElement;
    if (!input) throw new Error("Search input not found");

    await user.clear(input);
    await user.type(input, "engineering");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only Engineering department rows are visible
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3); // Alice, Charlie, Fiona
    const deptData = getColumnData(canvasElement, "department");
    deptData.forEach((dept) => {
      expect(dept).toBe("Engineering");
    });

    // Clear and search for "alice"
    await user.clear(input);
    await user.type(input, "alice");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only Alice is visible
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(1);
    const nameData = getColumnData(canvasElement, "name");
    expect(nameData[0]).toContain("Alice");

    // Clear search
    await user.clear(input);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify all rows are visible again
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(8);
  },
};

// ============================================================================
// TEST 2: SMART MODE - MULTI-WORD SEARCH
// ============================================================================

export const SmartModeMultiWord: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "department", label: "Department", width: 140 },
      { accessor: "status", label: "Status", width: 100 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Smart Mode - Multi-Word Search</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Multi-word search matches rows containing ALL words
        </p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Try: engineering active"
          data-testid="smart-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            mode: "smart",
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Type "engineering active" - should match only active engineering employees
    const input = canvasElement.querySelector(
      'input[data-testid="smart-filter-input"]'
    ) as HTMLInputElement;
    if (!input) throw new Error("Search input not found");

    await user.clear(input);
    await user.type(input, "engineering active");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only active Engineering employees are visible
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3); // Alice, Charlie, Fiona (all active engineering)

    const deptData = getColumnData(canvasElement, "department");
    deptData.forEach((dept) => {
      expect(dept).toBe("Engineering");
    });

    const statusData = getColumnData(canvasElement, "status");
    statusData.forEach((status) => {
      expect(status).toBe("Active");
    });
  },
};

// ============================================================================
// TEST 3: SMART MODE - PHRASE SEARCH
// ============================================================================

export const SmartModePhraseSearch: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "email", label: "Email", width: 220 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Smart Mode - Phrase Search</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Use quotes to search for exact phrases
        </p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder='Try: "alice johnson"'
          data-testid="phrase-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            mode: "smart",
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    const input = canvasElement.querySelector(
      'input[data-testid="phrase-filter-input"]'
    ) as HTMLInputElement;
    if (!input) throw new Error("Search input not found");

    // Search for exact phrase "alice johnson"
    await user.clear(input);
    await user.type(input, '"alice johnson"');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only Alice Johnson is visible
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(1);

    const nameData = getColumnData(canvasElement, "name");
    expect(nameData[0]).toBe("Alice Johnson");
  },
};

// ============================================================================
// TEST 4: SMART MODE - NEGATION
// ============================================================================

export const SmartModeNegation: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "status", label: "Status", width: 100 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Smart Mode - Negation</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Use minus sign to exclude rows containing a term
        </p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Try: -inactive"
          data-testid="negation-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            mode: "smart",
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    const input = canvasElement.querySelector(
      'input[data-testid="negation-filter-input"]'
    ) as HTMLInputElement;
    if (!input) throw new Error("Search input not found");

    // Search with negation "-inactive"
    await user.clear(input);
    await user.type(input, "-inactive");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only active employees are visible (no inactive)
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(6); // All except Diana and Hannah

    const statusData = getColumnData(canvasElement, "status");
    statusData.forEach((status) => {
      expect(status).not.toBe("Inactive");
    });
  },
};

// ============================================================================
// TEST 5: SMART MODE - COLUMN-SPECIFIC SEARCH
// ============================================================================

export const SmartModeColumnSpecific: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "department", label: "Department", width: 140 },
      { accessor: "location", label: "Location", width: 140 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Smart Mode - Column-Specific Search</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Use column:value syntax to search specific columns
        </p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Try: department:engineering"
          data-testid="column-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            mode: "smart",
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    const input = canvasElement.querySelector(
      'input[data-testid="column-filter-input"]'
    ) as HTMLInputElement;
    if (!input) throw new Error("Search input not found");

    // Search with column-specific "department:engineering"
    await user.clear(input);
    await user.type(input, "department:engineering");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only Engineering department rows are visible
    const rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);

    const deptData = getColumnData(canvasElement, "department");
    deptData.forEach((dept) => {
      expect(dept).toBe("Engineering");
    });
  },
};

// ============================================================================
// TEST 6: CASE SENSITIVITY
// ============================================================================

export const CaseSensitivity: StoryObj = {
  render: () => {
    const [searchText, setSearchText] = React.useState("");
    const [caseSensitive, setCaseSensitive] = React.useState(false);

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "department", label: "Department", width: 140 },
    ];

    const data = createTestData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Case Sensitivity</h2>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Try: ALICE"
          data-testid="case-filter-input"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "0.5rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <label style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            data-testid="case-sensitive-checkbox"
            style={{ marginRight: "5px" }}
          />
          Case Sensitive
        </label>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          quickFilter={{
            text: searchText,
            caseSensitive: caseSensitive,
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    const input = canvasElement.querySelector(
      'input[data-testid="case-filter-input"]'
    ) as HTMLInputElement;
    const checkbox = canvasElement.querySelector(
      'input[data-testid="case-sensitive-checkbox"]'
    ) as HTMLInputElement;
    if (!input || !checkbox) throw new Error("Input or checkbox not found");

    // Search for "ALICE" (uppercase) without case sensitivity
    await user.clear(input);
    await user.type(input, "ALICE");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Should find Alice (case insensitive by default)
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(1);

    // Enable case sensitivity
    await user.click(checkbox);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Should NOT find Alice (case sensitive, "ALICE" != "Alice")
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(0);

    // Disable case sensitivity again
    await user.click(checkbox);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Should find Alice again
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(1);
  },
};

// ============================================================================
// TEST 7: PROGRAMMATIC CONTROL
// ============================================================================

export const ProgrammaticControl: StoryObj = {
  render: () => {
    const tableRef = React.useRef<any>(null);
    const [searchText, setSearchText] = React.useState("");

    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 180 },
      { accessor: "department", label: "Department", width: 140 },
    ];

    const data = createTestData();

    const applyEngineeringFilter = () => {
      setSearchText("engineering");
      if (tableRef.current) {
        tableRef.current.setQuickFilter("engineering");
      }
    };

    const clearFilter = () => {
      setSearchText("");
      if (tableRef.current) {
        tableRef.current.setQuickFilter("");
      }
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Programmatic Control</h2>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={applyEngineeringFilter}
            data-testid="apply-filter-btn"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Filter Engineering
          </button>
          <button
            onClick={clearFilter}
            data-testid="clear-filter-btn"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Filter
          </button>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          tableRef={tableRef}
          quickFilter={{
            text: searchText,
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const user = userEvent.setup();

    // Initial state - all rows visible
    let rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(8);

    // Click "Filter Engineering" button
    const applyBtn = canvasElement.querySelector(
      'button[data-testid="apply-filter-btn"]'
    ) as HTMLElement;
    if (!applyBtn) throw new Error("Apply button not found");
    await user.click(applyBtn);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only Engineering rows are visible
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(3);

    // Click "Clear Filter" button
    const clearBtn = canvasElement.querySelector(
      'button[data-testid="clear-filter-btn"]'
    ) as HTMLElement;
    if (!clearBtn) throw new Error("Clear button not found");
    await user.click(clearBtn);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify all rows are visible again
    rowCount = getVisibleRowCount(canvasElement);
    expect(rowCount).toBe(8);
  },
};
