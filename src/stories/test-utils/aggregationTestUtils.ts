import { expect } from "@storybook/test";
import { waitForTable } from "./commonTestUtils";

/**
 * Aggregation Test Utilities for RowGrouping Example
 */

/**
 * Wait for table to load and expand all groups to see aggregated data
 */
export const expandAllGroupsForTesting = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Find all expand icons and click them to show all aggregated data
  const expandIcons = canvasElement.querySelectorAll(".st-expand-icon");

  for (const icon of Array.from(expandIcons)) {
    // Check if the parent row is collapsed (icon not rotated)
    const iconElement = icon as HTMLElement;
    const parentRow = iconElement.closest(".st-row");

    if (parentRow) {
      // Click to expand if collapsed
      iconElement.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Wait for all expansions to complete
  await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Get aggregated value from a specific row and column
 */
export const getAggregatedValue = (
  canvasElement: HTMLElement,
  rowText: string,
  columnAccessor: string
): string | null => {
  // Find the row that contains the specified text
  const rows = canvasElement.querySelectorAll(".st-row");

  for (const row of Array.from(rows)) {
    const organizationCell = row.querySelector('[data-accessor="organization"] .st-cell-content');
    if (organizationCell?.textContent?.trim() === rowText) {
      // Found the target row, now get value from the specified column
      const targetCell = row.querySelector(`[data-accessor="${columnAccessor}"] .st-cell-content`);
      return targetCell?.textContent?.trim() || null;
    }
  }

  return null;
};

/**
 * Get all child values for a parent row to verify aggregation calculation
 */
export const getChildValues = (
  canvasElement: HTMLElement,
  parentRowText: string,
  columnAccessor: string
): number[] => {
  const values: number[] = [];

  // This is a simplified approach - in a real test we'd need to understand
  // the hierarchical structure better, but for now we can manually verify
  // known child values from our test data

  return values;
};

/**
 * Test sum aggregation for employees column
 */
export const testSumAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test TechSolutions Inc. - should sum all its division employees
  const techSolutionsEmployees = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "employees"
  );
  expect(techSolutionsEmployees).toBeTruthy();

  // Based on the cleaned data, TechSolutions should aggregate from its teams:
  // Frontend: 28, Backend: 32, DevOps: 15, Mobile: 22 = 97 (Engineering division)
  // Design: 17, Research: 9, QA Testing: 14 = 40 (Product division)
  // Total: 137
  expect(techSolutionsEmployees).toBe("137");

  // Test Engineering division - should sum its teams
  const engineeringEmployees = getAggregatedValue(canvasElement, "Engineering", "employees");
  expect(engineeringEmployees).toBeTruthy();
  expect(engineeringEmployees).toBe("97");

  // Test Product division - should sum its teams
  const productEmployees = getAggregatedValue(canvasElement, "Product", "employees");
  expect(productEmployees).toBeTruthy();
  expect(productEmployees).toBe("40");
};

/**
 * Test sum aggregation for budget column with custom parsing and formatting
 */
export const testBudgetAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test TechSolutions Inc. budget aggregation
  const techSolutionsBudget = getAggregatedValue(canvasElement, "TechSolutions Inc.", "budget");
  expect(techSolutionsBudget).toBeTruthy();

  // Based on team budgets:
  // Frontend: 2.8M, Backend: 3.4M, DevOps: 1.9M, Mobile: 2.5M = 10.6M (Engineering)
  // Design: 1.8M, Research: 1.4M, QA Testing: 1.2M = 4.4M (Product)
  // Total: 15.0M
  expect(techSolutionsBudget).toBe("$15.0M");

  // Test Engineering division budget
  const engineeringBudget = getAggregatedValue(canvasElement, "Engineering", "budget");
  expect(engineeringBudget).toBeTruthy();
  expect(engineeringBudget).toBe("$10.6M");

  // Test Product division budget
  const productBudget = getAggregatedValue(canvasElement, "Product", "budget");
  expect(productBudget).toBeTruthy();
  expect(productBudget).toBe("$4.4M");
};

/**
 * Test average aggregation
 */
export const testAverageAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test average rating for TechSolutions Inc.
  const techSolutionsRating = getAggregatedValue(canvasElement, "TechSolutions Inc.", "rating");
  expect(techSolutionsRating).toBeTruthy();

  // Should be calculated as average of all team ratings
  // We'll need to verify this matches expected calculation
  const ratingValue = parseFloat(techSolutionsRating || "0");
  expect(ratingValue).toBeGreaterThan(0);
  expect(ratingValue).toBeLessThanOrEqual(5);
};

/**
 * Test count aggregation
 */
export const testCountAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test project count for TechSolutions Inc.
  const techSolutionsProjects = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "projectCount"
  );
  expect(techSolutionsProjects).toBeTruthy();

  // Should count all projects across teams
  const projectCount = parseInt(techSolutionsProjects || "0");
  expect(projectCount).toBeGreaterThan(0);
};

/**
 * Test min aggregation
 */
export const testMinAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test minimum team size
  const techSolutionsMinTeam = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "minTeamSize"
  );
  expect(techSolutionsMinTeam).toBeTruthy();

  // Should be minimum team size across all teams
  const minSize = parseInt(techSolutionsMinTeam || "0");
  expect(minSize).toBeGreaterThan(0);
};

/**
 * Test max aggregation
 */
export const testMaxAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test maximum team size
  const techSolutionsMaxTeam = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "maxTeamSize"
  );
  expect(techSolutionsMaxTeam).toBeTruthy();

  // Should be maximum team size across all teams
  const maxSize = parseInt(techSolutionsMaxTeam || "0");
  expect(maxSize).toBeGreaterThan(0);
};

/**
 * Test custom aggregation function
 */
export const testCustomAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test custom weighted score calculation
  const techSolutionsScore = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "weightedScore"
  );
  expect(techSolutionsScore).toBeTruthy();

  // Should be a custom calculation based on employees and performance
  const score = parseFloat(techSolutionsScore || "0");
  expect(score).toBeGreaterThan(0);
};

/**
 * Comprehensive test for all aggregation functions
 */
export const testAllAggregationFunctions = async (canvasElement: HTMLElement): Promise<void> => {
  // Test each aggregation type
  await testSumAggregation(canvasElement);
  await testBudgetAggregation(canvasElement);
  await testAverageAggregation(canvasElement);
  await testCountAggregation(canvasElement);
  await testMinAggregation(canvasElement);
  await testMaxAggregation(canvasElement);
  await testCustomAggregation(canvasElement);
};

/**
 * Test that parent rows show aggregated values while leaf rows show original values
 */
export const testHierarchicalAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test that leaf rows (teams) show their original employee counts
  const frontendEmployees = getAggregatedValue(canvasElement, "Frontend", "employees");
  expect(frontendEmployees).toBe("28");

  const backendEmployees = getAggregatedValue(canvasElement, "Backend", "employees");
  expect(backendEmployees).toBe("32");

  // Test that parent rows show aggregated values
  const engineeringEmployees = getAggregatedValue(canvasElement, "Engineering", "employees");
  expect(engineeringEmployees).toBe("97"); // 28 + 32 + 15 + 22

  // Test that top-level parent shows total aggregation
  const techSolutionsEmployees = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "employees"
  );
  expect(techSolutionsEmployees).toBe("137"); // 97 + 40
};

/**
 * Test that aggregation respects expansion state
 */
export const testAggregationWithCollapsedRows = async (
  canvasElement: HTMLElement
): Promise<void> => {
  await waitForTable();

  // Initially, top-level rows should still show aggregated values even when collapsed
  const techSolutionsEmployees = getAggregatedValue(
    canvasElement,
    "TechSolutions Inc.",
    "employees"
  );
  expect(techSolutionsEmployees).toBeTruthy();

  // The aggregation should work regardless of expansion state
  const employeeCount = parseInt(techSolutionsEmployees || "0");
  expect(employeeCount).toBeGreaterThan(0);
};
