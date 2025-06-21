import { expect, within } from "@storybook/test";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

/**
 * Simple wait function for table rendering
 */
export const waitForTable = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Comprehensive alignment test that verifies CSS text-align properties
 * for both header cells and body cells
 */
export const testColumnAlignment = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  console.log("Testing column alignment...");

  for (const column of RETAIL_SALES_HEADERS) {
    // Test header alignment
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      const headerComputedStyle = window.getComputedStyle(headerTextElement);
      console.log(`Header ${column.label}: computed textAlign = ${headerComputedStyle.textAlign}`);
      expect(headerComputedStyle.textAlign).toBe(column.align);
    } else {
      console.warn(`Header element not found for column: ${column.label}`);
    }

    // Test body cell alignment (check first data row)
    const tableRows = canvasElement.querySelectorAll(".st-row");
    if (tableRows.length > 0) {
      const firstDataRow = tableRows[0];
      const cell = firstDataRow.querySelector(`[data-accessor="${column.accessor}"]`);

      if (cell) {
        const cellContent = cell.querySelector(".st-cell-content");
        if (cellContent) {
          const cellComputedStyle = window.getComputedStyle(cellContent);

          expect(cellComputedStyle.textAlign).toBe(column.align);
        } else {
          console.warn(`Cell content not found for column: ${column.label}`);
        }
      } else {
        console.warn(`Cell not found for column: ${column.label}`);
      }
    }
  }

  console.log("Column alignment test completed successfully");
};
