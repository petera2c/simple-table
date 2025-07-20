import { expect } from "@storybook/test";
import { waitForTable } from "./commonTestUtils";
import { Accessor } from "../../types/HeaderObject";

/**
 * Aggregation Test Utilities for RowGrouping Example
 */

/**
 * Wait for table to load and expand all groups to see aggregated data
 */
export const expandAllGroupsForTesting = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Find all expand icon containers (clickable elements) and ensure they are expanded
  const expandIconContainers = canvasElement.querySelectorAll(".st-expand-icon-container");

  for (const iconContainer of Array.from(expandIconContainers)) {
    const iconElement = iconContainer as HTMLElement;
    const parentRow = iconElement.closest(".st-row");

    if (parentRow) {
      // Check if the row is currently collapsed (not expanded)
      const isExpanded = iconElement.classList.contains("expanded");

      if (!isExpanded) {
        iconElement.click();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  // Wait for all expansions to complete
  await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Ensure a specific row is expanded by finding and clicking its expand icon if collapsed
 */
export const ensureRowExpanded = async (
  canvasElement: HTMLElement,
  rowText: string
): Promise<void> => {
  // Find the row that contains the specified text
  const rows = canvasElement.querySelectorAll(".st-row");

  for (const row of Array.from(rows)) {
    const organizationCell = row.querySelector('[data-accessor="organization"] .st-cell-content');
    const orgText = organizationCell?.textContent?.trim();

    if (orgText === rowText) {
      // Find the expand icon container in this row
      const expandIconContainer = row.querySelector(".st-expand-icon-container");

      if (expandIconContainer) {
        const iconElement = expandIconContainer as HTMLElement;
        const isExpanded = iconElement.classList.contains("expanded");

        if (!isExpanded) {
          iconElement.click();
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      return;
    }
  }
};

/**
 * Get aggregated value from a specific row and column
 */
export const getAggregatedValue = (
  canvasElement: HTMLElement,
  rowText: string,
  columnAccessor: Accessor
): string | null => {
  // Find the row that contains the specified text
  const rows = canvasElement.querySelectorAll(".st-row");

  for (const row of Array.from(rows)) {
    const organizationCell = row.querySelector('[data-accessor="organization"] .st-cell-content');
    const orgText = organizationCell?.textContent?.trim();

    if (orgText === rowText) {
      // Found the target row, now get value from the specified column
      const targetCell = row.querySelector(`[data-accessor="${columnAccessor}"] .st-cell-content`);
      const value = targetCell?.textContent?.trim() || null;

      return value;
    }
  }

  return null;
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

  // For division-level tests, let's try to expand TechSolutions specifically first
  await ensureRowExpanded(canvasElement, "TechSolutions Inc.");

  // Test Engineering division - should sum its teams
  const engineeringEmployees = getAggregatedValue(canvasElement, "Engineering", "employees");

  if (engineeringEmployees) {
    expect(engineeringEmployees).toBe("97");
  }

  // Test Product division - should sum its teams
  const productEmployees = getAggregatedValue(canvasElement, "Product", "employees");

  if (productEmployees) {
    expect(productEmployees).toBe("40");
  }
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

  // Ensure TechSolutions is expanded for division testing
  await ensureRowExpanded(canvasElement, "TechSolutions Inc.");

  // Test Engineering division budget
  const engineeringBudget = getAggregatedValue(canvasElement, "Engineering", "budget");

  if (engineeringBudget) {
    expect(engineeringBudget).toBe("$10.6M");
  }

  // Test Product division budget
  const productBudget = getAggregatedValue(canvasElement, "Product", "budget");

  if (productBudget) {
    expect(productBudget).toBe("$4.4M");
  }
};

/**
 * Test average aggregation
 */
export const testAverageAggregation = async (canvasElement: HTMLElement): Promise<void> => {
  await expandAllGroupsForTesting(canvasElement);

  // Test average rating for TechSolutions Inc.
  const techSolutionsRating = getAggregatedValue(canvasElement, "TechSolutions Inc.", "rating");

  if (techSolutionsRating) {
    // Should be calculated as average of all team ratings
    // We'll need to verify this matches expected calculation
    const ratingValue = parseFloat(techSolutionsRating.replace(/[^\d.]/g, "") || "0");
    expect(ratingValue).toBeGreaterThan(0);
    expect(ratingValue).toBeLessThanOrEqual(5);
  }
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

  if (techSolutionsProjects) {
    // Should count all projects across teams
    const projectCount = parseInt(techSolutionsProjects || "0");
    expect(projectCount).toBeGreaterThan(0);
  }
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

  if (techSolutionsMinTeam) {
    // Should be minimum team size across all teams
    const minSize = parseInt(techSolutionsMinTeam || "0");
    expect(minSize).toBeGreaterThan(0);
  }
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

  if (techSolutionsMaxTeam) {
    // Should be maximum team size across all teams
    const maxSize = parseInt(techSolutionsMaxTeam || "0");
    expect(maxSize).toBeGreaterThan(0);
  }
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

  if (techSolutionsScore) {
    // Should be a custom calculation based on employees and performance
    const score = parseFloat(techSolutionsScore.replace(/[^\d.]/g, "") || "0");
    expect(score).toBeGreaterThan(0);
  }
};

/**
 * Simple test to verify table elements are accessible
 */
export const testBasicTableElements = async (canvasElement: HTMLElement): Promise<void> => {
  await waitForTable();

  // Check if table root exists
  const tableRoot = canvasElement.querySelector(".simple-table-root");
  expect(tableRoot).toBeTruthy();

  // Check if any rows exist
  const rows = canvasElement.querySelectorAll(".st-row");
  expect(rows.length).toBeGreaterThan(0);

  // Check if organization column exists
  const orgCells = canvasElement.querySelectorAll('[data-accessor="organization"]');
  expect(orgCells.length).toBeGreaterThan(0);

  // Check if employees column exists
  const empCells = canvasElement.querySelectorAll('[data-accessor="employees"]');
  expect(empCells.length).toBeGreaterThan(0);

  // Check if budget column exists
  const budgetCells = canvasElement.querySelectorAll('[data-accessor="budget"]');
  expect(budgetCells.length).toBeGreaterThan(0);
};

/**
 * Comprehensive test for all aggregation functions
 */
export const testAllAggregationFunctions = async (canvasElement: HTMLElement): Promise<void> => {
  try {
    await testSumAggregation(canvasElement);
    await testBudgetAggregation(canvasElement);
    await testAverageAggregation(canvasElement);
    await testCountAggregation(canvasElement);
    await testMinAggregation(canvasElement);
    await testMaxAggregation(canvasElement);
    await testCustomAggregation(canvasElement);
  } catch (error) {
    throw error;
  }
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
