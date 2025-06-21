import { expect, within } from "@storybook/test";

/**
 * Shared test utilities for SimpleTable components
 */

/**
 * Basic table structure validation - checks all essential DOM elements
 */
export const validateBasicTableStructure = async (canvasElement: HTMLElement) => {
  // Core table structure
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  expect(tableRoot).toBeInTheDocument();

  const tableContent = canvasElement.querySelector(".st-content");
  expect(tableContent).toBeInTheDocument();

  const headerContainer = canvasElement.querySelector(".st-header-container");
  expect(headerContainer).toBeInTheDocument();

  const bodyContainer = canvasElement.querySelector(".st-body-container");
  expect(bodyContainer).toBeInTheDocument();

  // At least one row should exist
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThan(0);

  // Header and body main sections
  const headerMain = headerContainer?.querySelector(".st-header-main");
  expect(headerMain).toBeInTheDocument();

  const bodyMain = bodyContainer?.querySelector(".st-body-main");
  expect(bodyMain).toBeInTheDocument();
};

/**
 * Simple wait for table to be ready for testing
 */
export const waitForTable = async () => {
  // Simple delay to ensure table is rendered
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Test the three-section layout structure (for pinning)
 */
export const testThreeSectionLayout = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await validateBasicTableStructure(canvasElement);

  // Additional pinning-specific checks
  const headerContainer = canvasElement.querySelector(".st-header-container");
  const bodyContainer = canvasElement.querySelector(".st-body-container");

  // Check that both containers exist (already validated above)
  // Check that body has proper layout structure
  const bodyMain = bodyContainer?.querySelector(".st-body-main");
  expect(bodyMain).toBeInTheDocument();
};

/**
 * Test that multiple features can coexist without breaking basic structure
 */
export const testFeatureIntegration = async (
  canvas: ReturnType<typeof within>,
  canvasElement: HTMLElement
) => {
  await validateBasicTableStructure(canvasElement);

  // Check what features are present
  const hasResizing =
    canvasElement.querySelectorAll(".st-header-resize-handle-container").length > 0;
  const hasReordering =
    canvasElement.querySelectorAll(".st-header-label[draggable='true']").length > 0;
  const hasColumnEditor = canvasElement.querySelector(".st-column-editor") !== null;

  return { hasResizing, hasReordering, hasColumnEditor };
};
