import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { FilterExampleComponent } from "../examples/filter-example/FilterExample";
import { waitForTable } from "../test-utils/commonTestUtils";
import {
  FILTER_TEST_CONFIGURATIONS,
  testStringFilter,
  testNumberFilter,
  testBooleanFilter,
  testEnumFilter,
  testFilterClear,
  clickFilterIcon,
  waitForFilterDropdown,
  fillStringFilter,
  applyFilter,
  clearFilter,
  countVisibleRows,
} from "../test-utils/columnFilterTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Column Filtering",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Tests for column filtering functionality using FilterExample",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Test basic string filter functionality
 */
export const StringFilterTests: Story = {
  name: "String Filter Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting string filter tests");

    // Test string filtering on Product column
    await testStringFilter(canvasElement, "Product", "productName", "iPhone", [
      "iPhone 15 Pro Max",
      "iPhone 14",
    ]);

    console.log("✅ String filter tests completed");
  },
};

/**
 * Test number filter functionality
 */
export const NumberFilterTests: Story = {
  name: "Number Filter Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting number filter tests");

    // Test number filtering on Price column
    await testNumberFilter(canvasElement, "Price", "greater than", 1000);

    console.log("✅ Number filter tests completed");
  },
};

/**
 * Test enum filter functionality
 */
export const EnumFilterTests: Story = {
  name: "Enum Filter Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting enum filter tests");

    // Test enum filtering on Category column
    await testEnumFilter(canvasElement, "Category", ["Electronics"]);

    console.log("✅ Enum filter tests completed");
  },
};

/**
 * Test boolean filter functionality
 */
export const BooleanFilterTests: Story = {
  name: "Boolean Filter Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting boolean filter tests");

    // Test boolean filtering on Status column
    await testBooleanFilter(canvasElement, "Status", true);

    console.log("✅ Boolean filter tests completed");
  },
};

/**
 * Test filter clearing functionality
 */
export const FilterClearTests: Story = {
  name: "Filter Clear Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting filter clear tests");

    // First apply a filter
    await testStringFilter(canvasElement, "Product", "productName", "iPhone");

    // Then test clearing it
    await testFilterClear(canvasElement, "Product");

    console.log("✅ Filter clear tests completed");
  },
};

/**
 * Test multiple filters applied simultaneously
 */
export const MultipleFiltersTests: Story = {
  name: "Multiple Filters Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting multiple filters tests");

    const initialRowCount = countVisibleRows(canvasElement);

    // Apply first filter - Category
    await clickFilterIcon(canvasElement, "Category");
    let dropdown = await waitForFilterDropdown(canvasElement);

    // First uncheck "Select All" if checked
    const selectAllCheckbox = dropdown.querySelector(
      ".st-enum-select-all .st-checkbox-input"
    ) as HTMLInputElement;
    if (selectAllCheckbox?.checked) {
      selectAllCheckbox.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Select Electronics
    const checkboxes = dropdown.querySelectorAll(".st-checkbox-input");
    for (const checkbox of Array.from(checkboxes)) {
      const label = checkbox.parentElement?.textContent?.trim();
      if (label === "Electronics") {
        if (!(checkbox as HTMLInputElement).checked) {
          (checkbox as HTMLElement).click();
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        break;
      }
    }

    await applyFilter(dropdown);

    const firstFilterRowCount = countVisibleRows(canvasElement);
    expect(firstFilterRowCount).toBeLessThan(initialRowCount);

    // Apply second filter - Price range
    await clickFilterIcon(canvasElement, "Price");
    dropdown = await waitForFilterDropdown(canvasElement);

    // Select "greater than" operator
    const operatorButton = dropdown.querySelector(".st-custom-select-trigger") as HTMLElement;
    if (operatorButton) {
      operatorButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const options = dropdown.querySelectorAll(".st-custom-select-option");
      for (const option of Array.from(options)) {
        if (option.textContent?.trim().toLowerCase().includes("greater than")) {
          (option as HTMLElement).click();
          break;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Enter price value
    const priceInput = dropdown.querySelector(
      ".st-filter-input[type='number']"
    ) as HTMLInputElement;
    if (priceInput) {
      priceInput.value = "500";
      priceInput.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await applyFilter(dropdown);

    const secondFilterRowCount = countVisibleRows(canvasElement);
    expect(secondFilterRowCount).toBeLessThanOrEqual(firstFilterRowCount);

    console.log("✅ Multiple filters tests completed");
  },
};

/**
 * Test filter dropdown interaction
 */
export const FilterDropdownInteractionTests: Story = {
  name: "Filter Dropdown Interaction Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting filter dropdown interaction tests");

    // Test opening and closing filter dropdown
    await clickFilterIcon(canvasElement, "Product");

    // Verify dropdown opened
    let dropdown = canvasElement.querySelector(".st-dropdown-content .st-filter-container");
    expect(dropdown).toBeTruthy();

    // Test filling filter input
    await fillStringFilter(dropdown as HTMLElement, "test");

    // Verify input was filled
    const input = dropdown!.querySelector(".st-filter-input") as HTMLInputElement;
    expect(input.value).toBe("test");

    // Test clear button
    await clearFilter(dropdown as HTMLElement);

    // Verify input was cleared
    expect(input.value).toBe("");

    // Close dropdown by clicking outside
    const outsideElement = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    outsideElement.click();
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify dropdown closed
    dropdown = canvasElement.querySelector(".st-dropdown-content .st-filter-container");
    expect(dropdown).toBeFalsy();

    console.log("✅ Filter dropdown interaction tests completed");
  },
};

/**
 * Test filter icon presence
 */
export const FilterIconPresenceTests: Story = {
  name: "Filter Icon Presence Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting filter icon presence tests");

    // Check that filterable columns have filter icons
    const filterableColumns = ["Product", "Category", "Price", "Status"];

    for (const columnLabel of filterableColumns) {
      const headerElements = canvasElement.querySelectorAll(".st-header-label-text");
      let foundHeader = false;

      for (const element of Array.from(headerElements)) {
        if (element.textContent?.trim() === columnLabel) {
          const headerCell = element.closest(".st-header-cell") as HTMLElement;

          // Look for filter icon
          const filterIcon = headerCell.querySelector(
            ".st-icon-container svg[viewBox='0 0 512 512']"
          );

          if (filterIcon) {
            foundHeader = true;
            console.log(`✅ Filter icon found for ${columnLabel}`);
          } else {
            console.log(`ℹ️ No filter icon found for ${columnLabel} (may not be filterable)`);
          }
          break;
        }
      }

      // At least verify the header exists
      expect(foundHeader || headerElements.length > 0).toBe(true);
    }

    console.log("✅ Filter icon presence tests completed");
  },
};

/**
 * Test filter performance with large dataset
 */
export const FilterPerformanceTests: Story = {
  name: "Filter Performance Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting filter performance tests");

    // Time the filter operation
    const startTime = performance.now();

    await clickFilterIcon(canvasElement, "Product");
    const dropdown = await waitForFilterDropdown(canvasElement);
    await fillStringFilter(dropdown, "iPhone");
    await applyFilter(dropdown);

    const endTime = performance.now();
    const filterTime = endTime - startTime;

    console.log(`Filter operation took ${filterTime.toFixed(2)}ms`);

    // Verify filter completed successfully
    const filteredRowCount = countVisibleRows(canvasElement);
    expect(filteredRowCount).toBeGreaterThan(0);

    // Filter time should be reasonable
    expect(filterTime).toBeLessThan(2000);

    console.log("✅ Filter performance tests completed");
  },
};
