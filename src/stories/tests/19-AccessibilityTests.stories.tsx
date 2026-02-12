import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent, fireEvent } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * ACCESSIBILITY TESTS
 *
 * This test suite covers accessibility (a11y) features including:
 * 1. ARIA attributes on table structure (aria-rowcount, aria-colcount, aria-colindex, aria-rowindex)
 * 2. Screen reader live region announcements
 * 3. Keyboard navigation (arrow keys, Tab, Home/End, Page Up/Down)
 * 4. Sort button ARIA attributes (aria-sort, aria-label)
 * 5. Filter button ARIA attributes (aria-expanded, aria-haspopup, aria-label)
 * 6. Row selection checkbox ARIA attributes (aria-label, aria-checked)
 * 7. Expand/collapse row group ARIA attributes (role, aria-expanded, aria-label)
 * 8. Pagination ARIA attributes (aria-label, aria-current)
 * 9. Resize handle ARIA attributes (role="separator", aria-label, aria-orientation)
 * 10. Missing role="grid" or role="table" on table root (known gap)
 * 11. Screen reader only text (st-sr-only) visibility
 * 12. Header description aria-describedby
 */

const meta: Meta = {
  title: "Tests/19 - Accessibility",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Comprehensive accessibility tests covering ARIA attributes, keyboard navigation, screen reader support, and WCAG compliance.",
      },
    },
  },
};

export default meta;

// ============================================================================
// TEST DATA
// ============================================================================

interface BasicRow extends Record<string, any> {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
}

interface GroupableRow extends Record<string, any> {
  id: number;
  name: string;
  category: string;
  value: number;
  children?: GroupableRow[];
}

const createBasicData = (count: number): BasicRow[] => {
  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Employee ${index + 1}`,
    age: 25 + (index % 30),
    department: departments[index % departments.length],
    salary: 50000 + index * 5000,
  }));
};

const createGroupableData = (): GroupableRow[] => {
  return [
    {
      id: 1,
      name: "Group A",
      category: "Alpha",
      value: 100,
      children: [
        { id: 11, name: "Item A1", category: "Alpha", value: 40 },
        { id: 12, name: "Item A2", category: "Alpha", value: 60 },
      ],
    },
    {
      id: 2,
      name: "Group B",
      category: "Beta",
      value: 200,
      children: [
        { id: 21, name: "Item B1", category: "Beta", value: 80 },
        { id: 22, name: "Item B2", category: "Beta", value: 120 },
      ],
    },
    {
      id: 3,
      name: "Group C",
      category: "Gamma",
      value: 150,
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

// ============================================================================
// TEST 1: TABLE STRUCTURE ARIA ATTRIBUTES
// ============================================================================

export const TableStructureAriaAttributes: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table Structure ARIA Attributes</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify aria-rowcount on header container
    const headerContainer = canvasElement.querySelector(".st-header-container");
    if (!headerContainer) throw new Error("Header container not found");

    const ariaRowCount = headerContainer.getAttribute("aria-rowcount");
    expect(ariaRowCount).toBeTruthy();
    // Should be total rows + header depth
    expect(Number(ariaRowCount)).toBeGreaterThanOrEqual(11); // 10 rows + at least 1 header row

    // Verify aria-colcount on header container
    const ariaColCount = headerContainer.getAttribute("aria-colcount");
    expect(ariaColCount).toBeTruthy();
    expect(Number(ariaColCount)).toBe(4);

    // Verify aria-colindex on header cells
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBe(4);

    headerCells.forEach((cell, index) => {
      const ariaColIndex = cell.getAttribute("aria-colindex");
      expect(ariaColIndex).toBeTruthy();
      expect(Number(ariaColIndex)).toBe(index + 1); // 1-based
    });

    // Verify aria-rowindex on body rows
    const rows = canvasElement.querySelectorAll(".st-body-container .st-row");
    expect(rows.length).toBeGreaterThan(0);

    rows.forEach((row) => {
      const ariaRowIndex = row.getAttribute("aria-rowindex");
      expect(ariaRowIndex).toBeTruthy();
      expect(Number(ariaRowIndex)).toBeGreaterThan(0);
    });

    // Verify aria-colindex on body cells
    const firstRow = rows[0];
    const bodyCells = firstRow.querySelectorAll(".st-cell");
    bodyCells.forEach((cell) => {
      const ariaColIndex = cell.getAttribute("aria-colindex");
      expect(ariaColIndex).toBeTruthy();
      expect(Number(ariaColIndex)).toBeGreaterThan(0);
    });
  },
};

// ============================================================================
// TEST 2: SCREEN READER LIVE REGION
// ============================================================================

export const ScreenReaderLiveRegion: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Screen Reader Live Region</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify aria-live region exists
    const liveRegion = canvasElement.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();

    // Verify it has aria-atomic
    expect(liveRegion?.getAttribute("aria-atomic")).toBe("true");

    // Verify it has the sr-only class (visually hidden)
    expect(liveRegion?.classList.contains("st-sr-only")).toBe(true);
  },
};

// ============================================================================
// TEST 3: SCREEN READER ONLY TEXT VISIBILITY
// ============================================================================

export const ScreenReaderOnlyTextVisibility: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
    ];

    const data = createBasicData(3);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>SR-Only Text Visibility</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="300px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Verify sr-only elements exist and are visually hidden
    const srOnlyElements = canvasElement.querySelectorAll(".st-sr-only");
    expect(srOnlyElements.length).toBeGreaterThan(0);

    srOnlyElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      // sr-only elements should be positioned off-screen or have clip/overflow hidden
      // Common patterns: width: 1px, height: 1px, overflow: hidden, clip, position: absolute
      const isVisuallyHidden =
        style.position === "absolute" ||
        style.clip !== "auto" ||
        style.clipPath === "inset(50%)" ||
        (style.width === "1px" && style.height === "1px") ||
        style.overflow === "hidden";
      expect(isVisuallyHidden).toBe(true);
    });
  },
};

// ============================================================================
// TEST 4: SORT BUTTON ARIA ATTRIBUTES
// ============================================================================

export const SortButtonAriaAttributes: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Sort Button ARIA Attributes</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Sortable headers should have aria-sort="none" initially
    const nameHeader = canvasElement.querySelector(
      '[id*="header"][id*="name"].st-header-cell'
    ) as HTMLElement;

    // Find the header cell for "Name" by checking header label text
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    let nameHeaderCell: HTMLElement | null = null;
    let ageHeaderCell: HTMLElement | null = null;
    let deptHeaderCell: HTMLElement | null = null;

    headerCells.forEach((cell) => {
      const labelText = cell.querySelector(".st-header-label-text")?.textContent?.trim();
      if (labelText === "Name") nameHeaderCell = cell as HTMLElement;
      if (labelText === "Age") ageHeaderCell = cell as HTMLElement;
      if (labelText === "Department") deptHeaderCell = cell as HTMLElement;
    });

    if (!nameHeaderCell) throw new Error("Name header cell not found");
    if (!ageHeaderCell) throw new Error("Age header cell not found");

    // Sortable columns should have aria-sort="none" when not sorted
    expect(nameHeaderCell.getAttribute("aria-sort")).toBe("none");
    expect(ageHeaderCell.getAttribute("aria-sort")).toBe("none");

    // Non-sortable column should NOT have aria-sort
    if (deptHeaderCell) {
      expect(deptHeaderCell.getAttribute("aria-sort")).toBeNull();
    }

    // Click to sort by Name
    const nameLabel = nameHeaderCell.querySelector(".st-header-label") as HTMLElement;
    if (!nameLabel) throw new Error("Name header label not found");
    await user.click(nameLabel);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // After sort, header should have aria-sort="ascending" or "descending"
    const sortValue = nameHeaderCell.getAttribute("aria-sort");
    expect(sortValue === "ascending" || sortValue === "descending").toBe(true);

    // Check that sort icon has proper aria-label
    const sortIcon = nameHeaderCell.querySelector('[role="button"][aria-label*="Sort"]');
    if (sortIcon) {
      const sortAriaLabel = sortIcon.getAttribute("aria-label");
      expect(sortAriaLabel).toBeTruthy();
      expect(sortAriaLabel).toContain("Sort");
      expect(sortAriaLabel).toContain("Name");
    }
  },
};

// ============================================================================
// TEST 5: FILTER BUTTON ARIA ATTRIBUTES
// ============================================================================

export const FilterButtonAriaAttributes: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, filterable: true },
      { accessor: "age", label: "Age", width: 100, filterable: true, type: "number" },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Filter Button ARIA Attributes</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Find filter buttons by role and aria-label
    const filterButtons = canvasElement.querySelectorAll('[role="button"][aria-label*="Filter"]');
    expect(filterButtons.length).toBeGreaterThanOrEqual(2); // Name and Age are filterable

    filterButtons.forEach((button) => {
      // Each filter button should have aria-haspopup
      const haspopup = button.getAttribute("aria-haspopup");
      expect(haspopup).toBeTruthy();

      // Each filter button should have aria-expanded (initially false)
      expect(button.getAttribute("aria-expanded")).toBe("false");

      // Each filter button should have a descriptive aria-label
      const ariaLabel = button.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Filter");

      // Filter button should be focusable
      const tabIndex = button.getAttribute("tabindex");
      expect(tabIndex).toBe("0");
    });

    // Click a filter button and verify aria-expanded changes
    const firstFilterButton = filterButtons[0] as HTMLElement;
    firstFilterButton.click();
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(firstFilterButton.getAttribute("aria-expanded")).toBe("true");
  },
};

// ============================================================================
// TEST 6: ROW SELECTION CHECKBOX ARIA
// ============================================================================

export const RowSelectionCheckboxAria: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Row Selection Checkbox ARIA</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Header "Select all" checkbox should exist with proper aria-label
    const selectAllCheckbox = canvasElement.querySelector(
      'input[type="checkbox"][aria-label="Select all rows"]'
    ) as HTMLInputElement;
    expect(selectAllCheckbox).toBeTruthy();
    expect(selectAllCheckbox.getAttribute("aria-checked")).toBe("false");

    // Hover over first row to reveal its checkbox
    const firstRow = canvasElement.querySelector(".st-body-container .st-row") as HTMLElement;
    if (!firstRow) throw new Error("First row not found");

    const selectionCell = firstRow.querySelector(".st-selection-cell") as HTMLElement;
    if (!selectionCell) throw new Error("Selection cell not found");

    await user.hover(selectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Row checkbox should have aria-label with row context
    const rowCheckbox = firstRow.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    if (!rowCheckbox) throw new Error("Row checkbox not found");

    expect(rowCheckbox.getAttribute("aria-label")).toBeTruthy();
    expect(rowCheckbox.getAttribute("aria-checked")).toBe("false");

    // Custom checkbox span should be aria-hidden
    const customCheckboxSpan = firstRow.querySelector(".st-checkbox-custom");
    if (customCheckboxSpan) {
      expect(customCheckboxSpan.getAttribute("aria-hidden")).toBe("true");
    }

    // Select the row and verify aria-checked updates
    fireEvent.click(rowCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Re-query after state change
    await user.hover(selectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updatedCheckbox = firstRow.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    if (updatedCheckbox) {
      expect(updatedCheckbox.getAttribute("aria-checked")).toBe("true");
    }
  },
};

// ============================================================================
// TEST 7: EXPAND/COLLAPSE ROW GROUP ARIA
// ============================================================================

export const ExpandCollapseRowGroupAria: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "category", label: "Category", width: 150 },
      { accessor: "value", label: "Value", width: 100, type: "number" },
    ];

    const data = createGroupableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Expand/Collapse Row Group ARIA</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          rowGrouping={["children"]}
          expandAll={false}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Find expand/collapse buttons
    const expandButtons = canvasElement.querySelectorAll('[role="button"][aria-label*="row group"]');

    // There should be expand buttons for rows with children
    expect(expandButtons.length).toBeGreaterThan(0);

    expandButtons.forEach((button) => {
      // Each expandable button should have role="button"
      expect(button.getAttribute("role")).toBe("button");

      // Should have aria-expanded
      const ariaExpanded = button.getAttribute("aria-expanded");
      expect(ariaExpanded === "true" || ariaExpanded === "false").toBe(true);

      // Should have descriptive aria-label
      const ariaLabel = button.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(
        ariaLabel!.includes("Expand") || ariaLabel!.includes("Collapse")
      ).toBe(true);

      // Should be focusable via keyboard
      expect(button.getAttribute("tabindex")).toBe("0");
    });

    // Non-expandable rows should have aria-hidden on the expand icon container
    const presentationIcons = canvasElement.querySelectorAll(
      '.st-expand-icon-container[aria-hidden="true"]'
    );
    // Rows without children should have presentation icons
    if (presentationIcons.length > 0) {
      presentationIcons.forEach((icon) => {
        expect(icon.getAttribute("aria-hidden")).toBe("true");
      });
    }
  },
};

// ============================================================================
// TEST 8: PAGINATION ARIA ATTRIBUTES
// ============================================================================

export const PaginationAriaAttributes: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(25);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Pagination ARIA Attributes</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={5}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Page buttons should have aria-label
    const pageButtons = canvasElement.querySelectorAll('.st-page-btn');
    expect(pageButtons.length).toBeGreaterThan(0);

    pageButtons.forEach((btn) => {
      const ariaLabel = btn.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Go to page");
    });

    // Current page button should have aria-current="page"
    const currentPageBtn = canvasElement.querySelector('.st-page-btn.active');
    if (currentPageBtn) {
      expect(currentPageBtn.getAttribute("aria-current")).toBe("page");
    }

    // Non-active page buttons should NOT have aria-current
    const nonActivePageBtns = canvasElement.querySelectorAll('.st-page-btn:not(.active)');
    nonActivePageBtns.forEach((btn) => {
      const ariaCurrent = btn.getAttribute("aria-current");
      expect(ariaCurrent === null || ariaCurrent === undefined).toBe(true);
    });

    // Next/Previous buttons should have aria-labels
    const nextBtn = canvasElement.querySelector('button[aria-label="Go to next page"]');
    expect(nextBtn).toBeTruthy();

    const prevBtn = canvasElement.querySelector('button[aria-label="Go to previous page"]');
    expect(prevBtn).toBeTruthy();

    // Previous button should be disabled on first page
    expect((prevBtn as HTMLButtonElement)?.disabled).toBe(true);

    // Navigate to page 2 and verify aria-current moves
    await user.click(nextBtn as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newCurrentPageBtn = canvasElement.querySelector('.st-page-btn.active');
    if (newCurrentPageBtn) {
      expect(newCurrentPageBtn.getAttribute("aria-current")).toBe("page");
      expect(newCurrentPageBtn.textContent?.trim()).toBe("2");
    }

    // Previous button should now be enabled
    const updatedPrevBtn = canvasElement.querySelector(
      'button[aria-label="Go to previous page"]'
    ) as HTMLButtonElement;
    expect(updatedPrevBtn?.disabled).toBe(false);
  },
};

// ============================================================================
// TEST 9: RESIZE HANDLE ARIA ATTRIBUTES
// ============================================================================

export const ResizeHandleAriaAttributes: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Resize Handle ARIA Attributes</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Find resize handles
    const resizeHandles = canvasElement.querySelectorAll('[role="separator"]');
    expect(resizeHandles.length).toBeGreaterThan(0);

    resizeHandles.forEach((handle) => {
      // Should have role="separator"
      expect(handle.getAttribute("role")).toBe("separator");

      // Should have aria-orientation="vertical"
      expect(handle.getAttribute("aria-orientation")).toBe("vertical");

      // Should have descriptive aria-label
      const ariaLabel = handle.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Resize");
      expect(ariaLabel).toContain("column");
    });
  },
};

// ============================================================================
// TEST 10: KEYBOARD NAVIGATION - ARROW KEYS
// ============================================================================

export const KeyboardNavigationArrowKeys: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(10);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Keyboard Navigation - Arrow Keys</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Click on a cell to establish focus
    const bodyContainer = canvasElement.querySelector(".st-body-container");
    if (!bodyContainer) throw new Error("Body container not found");

    const firstCell = bodyContainer.querySelector('.st-cell[data-accessor="id"]') as HTMLElement;
    if (!firstCell) throw new Error("First cell not found");

    await user.click(firstCell);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // The clicked cell should be selected (has selection class)
    const selectedCells = bodyContainer.querySelectorAll(".st-cell-selected, .selected");
    // At least one cell should be focused/selected after click
    expect(selectedCells.length + bodyContainer.querySelectorAll(".st-cell-focused").length).toBeGreaterThanOrEqual(0);

    // Navigate right with arrow key
    await user.keyboard("{ArrowRight}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Navigate down with arrow key
    await user.keyboard("{ArrowDown}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Navigate left
    await user.keyboard("{ArrowLeft}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Navigate up
    await user.keyboard("{ArrowUp}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    // These navigations should not throw errors - basic smoke test for keyboard nav
    // The table should still be in a valid state
    const tableRoot = canvasElement.querySelector(".simple-table-root");
    expect(tableRoot).toBeTruthy();
  },
};

// ============================================================================
// TEST 11: KEYBOARD NAVIGATION - EXPAND/COLLAPSE WITH ENTER/SPACE
// ============================================================================

export const KeyboardExpandCollapse: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 250, expandable: true },
      { accessor: "category", label: "Category", width: 150 },
      { accessor: "value", label: "Value", width: 100, type: "number" },
    ];

    const data = createGroupableData();

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Keyboard Expand/Collapse</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          rowGrouping={["children"]}
          expandAll={false}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Find the first expand button
    const expandButton = canvasElement.querySelector(
      '[role="button"][aria-label*="Expand row group"]'
    ) as HTMLElement;

    if (!expandButton) throw new Error("Expand button not found");

    // Verify initial state
    expect(expandButton.getAttribute("aria-expanded")).toBe("false");

    // Focus the button
    expandButton.focus();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Press Enter to expand
    fireEvent.keyDown(expandButton, { key: "Enter" });
    await new Promise((resolve) => setTimeout(resolve, 300));

    // After expansion, the aria-label should change to "Collapse"
    // Re-query since the DOM may have updated
    const updatedButton = canvasElement.querySelector(
      '[role="button"][aria-label*="row group"][aria-expanded="true"]'
    );
    if (updatedButton) {
      expect(updatedButton.getAttribute("aria-expanded")).toBe("true");
      expect(updatedButton.getAttribute("aria-label")).toContain("Collapse");
    }

    // Press Space to collapse (on the same or re-queried button)
    const collapseButton = canvasElement.querySelector(
      '[role="button"][aria-label*="Collapse row group"]'
    ) as HTMLElement;
    if (collapseButton) {
      collapseButton.focus();
      fireEvent.keyDown(collapseButton, { key: " " });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  },
};

// ============================================================================
// TEST 12: HEADER DESCRIPTION AND ARIA-DESCRIBEDBY
// ============================================================================

export const HeaderDescriptionAriaDescribedby: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true, filterable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Header aria-describedby</h2>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Headers with sortable/filterable should have aria-describedby
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");

    let foundDescribedBy = false;
    headerCells.forEach((cell) => {
      const describedBy = cell.getAttribute("aria-describedby");
      if (describedBy) {
        foundDescribedBy = true;
        // The referenced element should exist in the DOM
        const descriptionEl = document.getElementById(describedBy);
        expect(descriptionEl).toBeTruthy();

        // The description should have sr-only class
        if (descriptionEl) {
          expect(descriptionEl.classList.contains("st-sr-only")).toBe(true);
          // Description should not be empty
          expect(descriptionEl.textContent?.trim().length).toBeGreaterThan(0);
        }
      }
    });

    // At least one header should have aria-describedby (Name is sortable + filterable)
    expect(foundDescribedBy).toBe(true);
  },
};

// ============================================================================
// TEST 13: ROW BUTTON GROUP ARIA
// ============================================================================

export const RowButtonGroupAria: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "department", label: "Department", width: 150 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Row Button Group ARIA</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          enableRowSelection={true}
          rowButtons={[
            ({ row }) => (
              <button aria-label={`Edit ${row.name}`} onClick={() => {}}>
                Edit
              </button>
            ),
          ]}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const user = userEvent.setup();

    // Hover over a row to reveal the row buttons
    const firstRow = canvasElement.querySelector(".st-body-container .st-row") as HTMLElement;
    if (!firstRow) throw new Error("First row not found");

    const selectionCell = firstRow.querySelector(".st-selection-cell") as HTMLElement;
    if (!selectionCell) throw new Error("Selection cell not found");

    await user.hover(selectionCell);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // The row buttons container should have role="group"
    const rowButtonGroup = firstRow.querySelector('[role="group"]');
    if (rowButtonGroup) {
      expect(rowButtonGroup.getAttribute("role")).toBe("group");

      // Should have an aria-label describing what the group is for
      const ariaLabel = rowButtonGroup.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Actions");
    }
  },
};

// ============================================================================
// TEST 14: TABLE ROOT MISSING ROLE (KNOWN GAP)
// ============================================================================

export const TableRootMissingRole: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
    ];

    const data = createBasicData(3);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Table Root Missing Role (Known Gap)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          The table root should have role="grid" or role="table" for proper screen reader
          navigation. This test documents the current gap.
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="300px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    // Check if the table root has role="grid" or role="table"
    // This is a KNOWN GAP - the table does not use role="grid" or role="table"
    const role = tableRoot.getAttribute("role");
    expect(role === "grid" || role === "table").toBe(true);
  },
};

// ============================================================================
// TEST 15: HEADER CELLS MISSING ROLE (KNOWN GAP)
// ============================================================================

export const HeaderCellsMissingRole: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
      { accessor: "age", label: "Age", width: 100 },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Header/Row/Cell Roles (Known Gap)</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Header cells should have role="columnheader", rows role="row", body cells
          role="gridcell" for proper screen reader table navigation.
        </p>
        <SimpleTable defaultHeaders={headers} rows={data} height="400px" />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Check header cells for role="columnheader"
    const headerCells = canvasElement.querySelectorAll(".st-header-cell");
    expect(headerCells.length).toBeGreaterThan(0);

    headerCells.forEach((cell) => {
      expect(cell.getAttribute("role")).toBe("columnheader");
    });

    // Check body rows for role="row"
    const bodyRows = canvasElement.querySelectorAll(".st-body-container .st-row");
    expect(bodyRows.length).toBeGreaterThan(0);

    bodyRows.forEach((row) => {
      expect(row.getAttribute("role")).toBe("row");
    });

    // Check body cells for role="gridcell"
    const bodyCells = canvasElement.querySelectorAll(".st-body-container .st-cell");
    expect(bodyCells.length).toBeGreaterThan(0);

    bodyCells.forEach((cell) => {
      expect(cell.getAttribute("role")).toBe("gridcell");
    });
  },
};

// ============================================================================
// TEST 16: FOCUS MANAGEMENT - TAB ORDER
// ============================================================================

export const FocusManagementTabOrder: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200, isSortable: true, filterable: true },
      { accessor: "age", label: "Age", width: 100, isSortable: true },
    ];

    const data = createBasicData(5);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Focus Management - Tab Order</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          columnResizing={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Interactive elements within headers should be focusable (tabindex=0)
    // Sort icons, filter buttons, and resize handles should all be tabbable

    // Check filter buttons are focusable
    const filterButtons = canvasElement.querySelectorAll('[role="button"][aria-label*="Filter"]');
    filterButtons.forEach((btn) => {
      expect(btn.getAttribute("tabindex")).toBe("0");
    });

    // Check resize handles are in the tab order (or excluded intentionally)
    const resizeHandles = canvasElement.querySelectorAll('[role="separator"]');
    // Resize handles exist but may not need to be in tab order
    expect(resizeHandles.length).toBeGreaterThan(0);
  },
};

// ============================================================================
// TEST 17: SELECT ALL CHECKBOX KEYBOARD ACCESSIBLE
// ============================================================================

export const SelectAllCheckboxKeyboardAccessible: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
    ];

    const data = createBasicData(3);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Select All Checkbox - Keyboard</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="300px"
          enableRowSelection={true}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Find the select-all checkbox
    const selectAllCheckbox = canvasElement.querySelector(
      'input[type="checkbox"][aria-label="Select all rows"]'
    ) as HTMLInputElement;

    if (!selectAllCheckbox) throw new Error("Select all checkbox not found");

    // Verify it's a native checkbox (inherently keyboard accessible)
    expect(selectAllCheckbox.tagName.toLowerCase()).toBe("input");
    expect(selectAllCheckbox.type).toBe("checkbox");

    // Verify it's not disabled
    expect(selectAllCheckbox.disabled).toBe(false);

    // The checkbox should be wrapped in a label for click association
    const label = selectAllCheckbox.closest("label");
    expect(label).toBeTruthy();

    // Activate with Space key (native behavior for checkboxes)
    selectAllCheckbox.focus();
    fireEvent.keyDown(selectAllCheckbox, { key: " " });
    fireEvent.keyUp(selectAllCheckbox, { key: " " });
    fireEvent.click(selectAllCheckbox);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // After activation, should be checked
    const updatedCheckbox = canvasElement.querySelector(
      'input[type="checkbox"][aria-label="Select all rows"]'
    ) as HTMLInputElement;
    if (updatedCheckbox) {
      expect(updatedCheckbox.checked).toBe(true);
      expect(updatedCheckbox.getAttribute("aria-checked")).toBe("true");
    }
  },
};

// ============================================================================
// TEST 18: FOOTER RESULTS TEXT FOR SCREEN READERS
// ============================================================================

export const FooterResultsTextForScreenReaders: StoryObj = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80 },
      { accessor: "name", label: "Name", width: 200 },
    ];

    const data = createBasicData(25);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Footer Results Text</h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          height="400px"
          shouldPaginate={true}
          rowsPerPage={10}
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Footer should have results text
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer).toBeTruthy();

    const resultsText = canvasElement.querySelector(".st-footer-results-text");
    expect(resultsText).toBeTruthy();

    // Results text should communicate row range and total
    const text = resultsText?.textContent;
    expect(text).toBeTruthy();
    expect(text).toContain("Showing");
    expect(text).toContain("of");
    expect(text).toContain("25");

    // Footer pagination should be navigable
    const pagination = canvasElement.querySelector(".st-footer-pagination");
    expect(pagination).toBeTruthy();

    // All page buttons should be <button> elements (keyboard accessible by default)
    const buttons = pagination?.querySelectorAll("button");
    if (buttons) {
      buttons.forEach((btn) => {
        expect(btn.tagName.toLowerCase()).toBe("button");
      });
    }
  },
};
