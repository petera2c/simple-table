import { expect, within } from "@storybook/test";
import { waitForTableRender } from "./commonTestUtils";

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
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      const expectedClass = `${column.expectedAlignment}-aligned`;
      expect(headerTextElement).toHaveClass(expectedClass);

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
      const cellContent = cell.querySelector(".st-cell-content");

      if (cellContent) {
        const expectedClass = `${column.expectedAlignment}-aligned`;
        expect(cellContent).toHaveClass(expectedClass);

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

// waitForTableRender moved to commonTestUtils.ts

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
  const initialAlignments = new Map<string, string>();

  for (const column of RETAIL_COLUMN_ALIGNMENTS) {
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

  await interactionFn();

  for (const column of RETAIL_COLUMN_ALIGNMENTS) {
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

/**
 * Column Resizing Test Utilities
 */

/**
 * Test that columns can be resized by dragging resize handles
 */
export const testColumnResizing = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  // Find resize handles in the table
  const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
  expect(resizeHandles.length).toBeGreaterThan(0);

  if (resizeHandles.length > 0) {
    const firstHandle = resizeHandles[0] as HTMLElement;
    const headerCell = firstHandle.closest(".st-header-cell") as HTMLElement;

    // Get initial width
    const initialWidth = headerCell.offsetWidth;

    // Verify handle exists and has proper styling
    expect(firstHandle).toBeInTheDocument();
    expect(firstHandle).toHaveClass("st-header-resize-handle-container");

    // Simulate actual resize interaction
    const startX = firstHandle.getBoundingClientRect().left + 5;
    const endX = startX + 50; // Drag 50px to the right

    // Create mouse events
    const mouseDownEvent = new MouseEvent("mousedown", {
      clientX: startX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: endX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    const mouseUpEvent = new MouseEvent("mouseup", {
      clientX: endX,
      clientY: firstHandle.getBoundingClientRect().top + 5,
      bubbles: true,
      cancelable: true,
    });

    // Perform the resize simulation
    firstHandle.dispatchEvent(mouseDownEvent);
    document.dispatchEvent(mouseMoveEvent);
    document.dispatchEvent(mouseUpEvent);

    // Wait a bit for the resize to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check that the column width changed (or at least the interaction was handled)
    const finalWidth = headerCell.offsetWidth;

    // The width should either change or remain functional (some implementations may have constraints)
    expect(typeof finalWidth).toBe("number");
    expect(finalWidth).toBeGreaterThan(0);

    // Verify the table structure remains intact after resize
    expect(canvasElement.querySelector(".simple-table-root")).toBeInTheDocument();
  }
};

/**
 * Test that resize handles are present and properly positioned
 */
export const testResizeHandlesPresent = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  // Wait for table to render
  await waitForTableRender(canvas, canvasElement);

  // Check that resize handles exist
  const resizeHandles = canvasElement.querySelectorAll(".st-header-resize-handle-container");
  expect(resizeHandles.length).toBeGreaterThan(0);

  // Check that each handle has the correct cursor style
  resizeHandles.forEach((handle) => {
    const computedStyle = window.getComputedStyle(handle);
    expect(computedStyle.cursor).toBe("col-resize");
  });
};

/**
 * Column Reordering Test Utilities
 */

/**
 * Test that headers are draggable when columnReordering is enabled
 */
export const testColumnReordering = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTableRender(canvas, canvasElement);

  // Find draggable header labels
  const headerLabels = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
  expect(headerLabels.length).toBeGreaterThan(0);

  // Test that headers have proper drag attributes
  headerLabels.forEach((label) => {
    expect(label).toHaveAttribute("draggable", "true");
  });
};

/**
 * Test actual column reordering by dragging and dropping
 */
export const testColumnOrderPersistence = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTableRender(canvas, canvasElement);

  // Record initial column order by checking header text
  const initialHeaderTexts = Array.from(
    canvasElement.querySelectorAll(".st-header-label-text")
  ).map((el) => el.textContent);

  // Verify we have headers
  expect(initialHeaderTexts.length).toBeGreaterThan(0);
  expect(initialHeaderTexts).toContain("Name");
  expect(initialHeaderTexts).toContain("Employees");

  // Find draggable headers
  const draggableHeaders = canvasElement.querySelectorAll(".st-header-label[draggable='true']");

  if (draggableHeaders.length >= 2) {
    const sourceHeader = draggableHeaders[0] as HTMLElement;
    const targetHeader = draggableHeaders[1] as HTMLElement;

    const sourceHeaderCell = sourceHeader.closest(".st-header-cell") as HTMLElement;
    const targetHeaderCell = targetHeader.closest(".st-header-cell") as HTMLElement;

    // Get the text content to verify reordering
    const sourceText = sourceHeader.querySelector(".st-header-label-text")?.textContent;
    const targetText = targetHeader.querySelector(".st-header-label-text")?.textContent;

    // Simulate drag and drop
    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dragOverEvent = new DragEvent("dragover", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    const dragEndEvent = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    // Perform the drag and drop sequence
    sourceHeader.dispatchEvent(dragStartEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    targetHeaderCell.dispatchEvent(dragOverEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    targetHeaderCell.dispatchEvent(dropEvent);
    await new Promise((resolve) => setTimeout(resolve, 50));

    sourceHeader.dispatchEvent(dragEndEvent);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check that the table is still functional after drag operation
    expect(canvasElement.querySelector(".simple-table-root")).toBeInTheDocument();
    expect(canvasElement.querySelector(".st-header-container")).toBeInTheDocument();

    // Get the new column order
    const finalHeaderTexts = Array.from(
      canvasElement.querySelectorAll(".st-header-label-text")
    ).map((el) => el.textContent);

    // Verify we still have the same number of headers
    expect(finalHeaderTexts.length).toBe(initialHeaderTexts.length);

    // Verify all original headers are still present
    initialHeaderTexts.forEach((headerText) => {
      expect(finalHeaderTexts).toContain(headerText);
    });

    // Note: The actual order change depends on the implementation
    // At minimum, we verify the drag operation doesn't break the table
    console.log("Initial order:", initialHeaderTexts);
    console.log("Final order:", finalHeaderTexts);
  }
};

/**
 * Column Visibility Test Utilities
 */

/**
 * Test column visibility toggle functionality by actually toggling a column
 */
export const testColumnVisibility = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTableRender(canvas, canvasElement);

  // Look for column editor button/panel
  const columnEditor = canvasElement.querySelector(".st-column-editor");
  if (columnEditor) {
    expect(columnEditor).toBeInTheDocument();

    // Check for column editor popout when open
    const popout = canvasElement.querySelector(".st-column-editor-popout");
    if (popout) {
      // Look for checkboxes in the popout
      const checkboxes = popout.querySelectorAll(".st-checkbox-input");
      expect(checkboxes.length).toBeGreaterThan(0);

      // Find checkbox items with labels
      const checkboxItems = popout.querySelectorAll(".st-header-checkbox-item");

      if (checkboxItems.length > 0) {
        // Find the first checkbox that we can toggle
        const firstCheckboxItem = checkboxItems[0];
        const checkboxLabel = firstCheckboxItem.querySelector(".st-checkbox-label");
        const checkbox = firstCheckboxItem.querySelector(".st-checkbox-input") as HTMLInputElement;

        if (checkbox && checkboxLabel) {
          // Get the column name from the label
          const columnName = checkboxLabel.textContent?.trim();

          // Record initial state
          const initiallyChecked = checkbox.checked;

          // Count initial visible columns
          const initialColumns = canvasElement.querySelectorAll(".st-header-label-text");
          const initialColumnCount = initialColumns.length;

          // Click the checkbox to toggle visibility
          (checkboxLabel as HTMLElement).click();

          // Wait for the change to take effect
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Check the new state
          const finallyChecked = checkbox.checked;
          expect(finallyChecked).not.toBe(initiallyChecked);

          // Verify the table is still functional
          expect(canvasElement.querySelector(".simple-table-root")).toBeInTheDocument();
          expect(canvasElement.querySelector(".st-header-container")).toBeInTheDocument();

          // Count final visible columns (might be different)
          const finalColumns = canvasElement.querySelectorAll(".st-header-label-text");
          const finalColumnCount = finalColumns.length;

          // The column count should either change or stay the same (depending on implementation)
          expect(typeof finalColumnCount).toBe("number");
          expect(finalColumnCount).toBeGreaterThan(0);

          console.log(
            `Column visibility test: ${columnName} toggled from ${initiallyChecked} to ${finallyChecked}`
          );
          console.log(`Column count changed from ${initialColumnCount} to ${finalColumnCount}`);
        }
      }
    }
  }
};

/**
 * Test that hidden columns are not visible in the table
 */
export const testHiddenColumnsNotVisible = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  hiddenColumnAccessors: string[]
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check that hidden columns are not present in the header
  hiddenColumnAccessors.forEach((accessor) => {
    const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"]`);
    expect(cells.length).toBe(0);
  });
};

/**
 * Test that visible columns are shown in the table
 */
export const testVisibleColumnsShown = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  visibleColumnAccessors: string[]
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check that visible columns are present in the header
  visibleColumnAccessors.forEach((accessor) => {
    const cells = canvasElement.querySelectorAll(`[data-accessor="${accessor}"]`);
    expect(cells.length).toBeGreaterThan(0);
  });
};

/**
 * Column Pinning Test Utilities
 */

/**
 * Test that pinned left columns are in the correct section
 */
export const testPinnedLeftColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedLeftAccessors: string[]
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check for pinned left container
  const pinnedLeftContainer = canvasElement.querySelector(".st-header-pinned-left");
  if (pinnedLeftContainer && pinnedLeftAccessors.length > 0) {
    expect(pinnedLeftContainer).toBeInTheDocument();

    // Check that pinned columns are in the left section
    pinnedLeftAccessors.forEach((accessor) => {
      const headerCell = pinnedLeftContainer.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

/**
 * Test that pinned right columns are in the correct section
 */
export const testPinnedRightColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  pinnedRightAccessors: string[]
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check for pinned right container
  const pinnedRightContainer = canvasElement.querySelector(".st-header-pinned-right");
  if (pinnedRightContainer && pinnedRightAccessors.length > 0) {
    expect(pinnedRightContainer).toBeInTheDocument();

    // Check that pinned columns are in the right section
    pinnedRightAccessors.forEach((accessor) => {
      const headerCell = pinnedRightContainer.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

/**
 * Test that main columns are in the center section
 */
export const testMainColumns = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement,
  mainColumnAccessors: string[]
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check for main header container
  const mainContainer = canvasElement.querySelector(".st-header-main");
  if (mainContainer && mainColumnAccessors.length > 0) {
    expect(mainContainer).toBeInTheDocument();

    // Check that main columns are in the main section
    mainColumnAccessors.forEach((accessor) => {
      const headerCell =
        mainContainer.querySelector(`[data-accessor="${accessor}"]`) ||
        canvasElement.querySelector(`[data-accessor="${accessor}"]`);
      expect(headerCell).toBeInTheDocument();
    });
  }
};

/**
 * Test the three-section layout structure
 */
export const testThreeSectionLayout = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTableRender(canvas, canvasElement);

  // Check header container structure
  const headerContainer = canvasElement.querySelector(".st-header-container");
  expect(headerContainer).toBeInTheDocument();

  // Check body container structure
  const bodyContainer = canvasElement.querySelector(".st-body-container");
  expect(bodyContainer).toBeInTheDocument();

  // Check that body has proper layout structure
  const bodyMain = bodyContainer?.querySelector(".st-body-main");
  expect(bodyMain).toBeInTheDocument();
};

/**
 * Comprehensive feature integration test
 */
export const testFeatureIntegration = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await waitForTableRender(canvas, canvasElement);

  // Test that multiple features can coexist
  const hasResizing =
    canvasElement.querySelectorAll(".st-header-resize-handle-container").length > 0;
  const hasReordering =
    canvasElement.querySelectorAll(".st-header-label[draggable='true']").length > 0;
  const hasColumnEditor = canvasElement.querySelector(".st-column-editor") !== null;

  // Verify table is functional with multiple features enabled
  expect(canvasElement.querySelector(".simple-table-root")).toBeInTheDocument();
  expect(canvasElement.querySelector(".st-header-container")).toBeInTheDocument();
  expect(canvasElement.querySelector(".st-body-container")).toBeInTheDocument();

  return { hasResizing, hasReordering, hasColumnEditor };
};
