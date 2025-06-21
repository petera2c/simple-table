import { expect, within } from "@storybook/test";

/**
 * Test utilities for column alignment testing in SimpleTable
 */

export interface ColumnAlignment {
  accessor: string;
  label: string;
  expectedAlignment: "left" | "right" | "center";
}

/**
 * Configuration for retail sales data column alignments
 */
export const RETAIL_COLUMN_ALIGNMENTS: ColumnAlignment[] = [
  { accessor: "name", label: "Name", expectedAlignment: "left" },
  { accessor: "city", label: "City", expectedAlignment: "left" },
  { accessor: "employees", label: "Employees", expectedAlignment: "right" },
  { accessor: "squareFootage", label: "Square Footage", expectedAlignment: "right" },
  { accessor: "openingDate", label: "Opening Date", expectedAlignment: "left" },
  { accessor: "customerRating", label: "Customer Rating", expectedAlignment: "right" },
  { accessor: "electronicsSales", label: "Electronics Sales", expectedAlignment: "center" },
  { accessor: "clothingSales", label: "Clothing Sales", expectedAlignment: "left" },
  { accessor: "groceriesSales", label: "Groceries Sales", expectedAlignment: "right" },
  { accessor: "furnitureSales", label: "Furniture Sales", expectedAlignment: "center" },
  { accessor: "totalSales", label: "Total Sales", expectedAlignment: "center" },
];

/**
 * Helper function to test header cell alignment
 */
export const testHeaderAlignment = async (
  canvas: ReturnType<typeof within>,
  columns: ColumnAlignment[]
) => {
  for (const column of columns) {
    // Find specifically in the header container to avoid column editor text
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      // Check that it has the correct alignment class
      const expectedClass = `${column.expectedAlignment}-aligned`;
      expect(headerTextElement).toHaveClass(expectedClass);

      // Also verify the computed style
      const computedStyle = window.getComputedStyle(headerTextElement);
      expect(computedStyle.textAlign).toBe(column.expectedAlignment);
    }
  }
};

/**
 * Helper function to test data cell alignment
 */
export const testDataCellAlignment = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  columns: ColumnAlignment[],
  rowIndex: number = 0
) => {
  const tableRows = canvasElement.querySelectorAll(".st-row");
  expect(tableRows.length).toBeGreaterThan(rowIndex);

  const dataRow = tableRows[rowIndex];

  for (const column of columns) {
    const cell = dataRow.querySelector(`[data-accessor="${column.accessor}"]`);

    if (cell) {
      // Find the st-cell-content span within the cell
      const cellContent = cell.querySelector(".st-cell-content");

      if (cellContent) {
        // Check that it has the correct alignment class
        const expectedClass = `${column.expectedAlignment}-aligned`;
        expect(cellContent).toHaveClass(expectedClass);

        // Also verify the computed style
        const computedStyle = window.getComputedStyle(cellContent);
        expect(computedStyle.textAlign).toBe(column.expectedAlignment);
      }
    }
  }
};

/**
 * Helper function to find the header cell element
 */
export const findHeaderCellElement = (headerText: Element): Element | null => {
  return (
    headerText.closest('[data-testid*="header-cell"]') ||
    headerText.closest("th") ||
    headerText.closest(".header-cell") ||
    headerText.closest(".table-header-cell") ||
    headerText.parentElement
  );
};

/**
 * Helper function to wait for table to be fully rendered
 */
export const waitForTableRender = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  // Wait for SimpleTable root element to be present
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  expect(tableRoot).toBeInTheDocument();

  // Wait for table content
  const tableContent = canvasElement.querySelector(".st-content");
  expect(tableContent).toBeInTheDocument();

  // Wait for header container section
  const headerContainer = canvasElement.querySelector(".st-header-container");
  expect(headerContainer).toBeInTheDocument();

  // Wait for body container section with rows
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  expect(bodyContainer).toBeInTheDocument();

  // Wait for at least one row
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThan(0);
};

/**
 * Helper function to test alignment across different column types
 */
export const testAlignmentByType = async (canvas: ReturnType<typeof within>) => {
  const leftAligned = RETAIL_COLUMN_ALIGNMENTS.filter((col) => col.expectedAlignment === "left");
  const rightAligned = RETAIL_COLUMN_ALIGNMENTS.filter((col) => col.expectedAlignment === "right");
  const centerAligned = RETAIL_COLUMN_ALIGNMENTS.filter(
    (col) => col.expectedAlignment === "center"
  );

  // Test each alignment type
  await testHeaderAlignment(canvas, leftAligned);
  await testHeaderAlignment(canvas, rightAligned);
  await testHeaderAlignment(canvas, centerAligned);
};

/**
 * Helper function to test that alignment persists after interactions
 */
export const testAlignmentPersistence = async (
  canvas: ReturnType<typeof within>,
  interactionFn: () => Promise<void>
) => {
  // Record initial alignments from header text elements
  const initialAlignments = new Map<string, string>();

  for (const column of RETAIL_COLUMN_ALIGNMENTS) {
    // Find specifically in the header container to avoid column editor text
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      const computedStyle = window.getComputedStyle(headerTextElement);
      initialAlignments.set(column.label, computedStyle.textAlign);
    }
  }

  // Perform interaction
  await interactionFn();

  // Verify alignments are preserved
  for (const column of RETAIL_COLUMN_ALIGNMENTS) {
    // Find specifically in the header container to avoid column editor text
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      const computedStyle = window.getComputedStyle(headerTextElement);
      const initialAlignment = initialAlignments.get(column.label);
      expect(computedStyle.textAlign).toBe(initialAlignment);
    }
  }
};
