import { expect, within } from "@storybook/test";
import { getMainColumns, getPinnedLeftColumns, getPinnedRightColumns } from "./commonTestUtils";

/**
 * Comprehensive alignment test that verifies CSS text-align properties
 * for both header cells and body cells
 */
export const testColumnAlignment = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  // Get all columns from shared utilities instead of importing RETAIL_SALES_HEADERS directly
  const allColumns = [...getPinnedLeftColumns(), ...getMainColumns(), ...getPinnedRightColumns()];

  for (const column of allColumns) {
    // Test header alignment
    const headerTexts = canvas.getAllByText(column.label);
    const headerTextElement = headerTexts.find(
      (element: HTMLElement) =>
        element.closest(".st-header-container") &&
        element.classList.contains("st-header-label-text")
    );

    if (headerTextElement) {
      const headerComputedStyle = window.getComputedStyle(headerTextElement);
      expect(headerComputedStyle.textAlign).toBe(column.align);
    } else {
      console.warn(`Header element not found for column: ${column.label}`);
    }

    // Test body cell alignment (search across all sections for the accessor)
    const cell = canvasElement.querySelector(`[data-accessor="${column.accessor}"]`);

    if (cell) {
      const cellContent = cell.querySelector(".st-cell-content");
      if (cellContent) {
        const cellComputedStyle = window.getComputedStyle(cellContent);

        expect(cellComputedStyle.textAlign).toBe(column.align);
      } else {
        console.warn(`Cell content not found for column: ${column.label}`);
      }
    } else {
      console.warn(`Cell not found for column: ${column.label} with accessor: ${column.accessor}`);
    }
  }
};
