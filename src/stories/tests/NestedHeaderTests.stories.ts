import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { FilterExampleComponent } from "../examples/filter-example/FilterExample";
import { waitForTable } from "../test-utils/commonTestUtils";
import {
  NESTED_HEADER_CONFIGURATIONS,
  EXPECTED_NESTED_STRUCTURE,
  testNestedHeaderStructure,
  testNestedHeaderSorting,
  testNestedHeaderFiltering,
  testNestedHeaderLayout,
  testNestedHeaderResponsiveness,
  testAllNestedHeaderFunctionality,
  findNestedHeader,
  verifyHeaderSpan,
  verifyParentHeaderClass,
  verifyChildHeaderPositions,
} from "../test-utils/nestedHeaderTestUtils";

const meta: Meta<typeof FilterExampleComponent> = {
  title: "Tests/Nested Headers",
  component: FilterExampleComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Tests for nested header functionality using FilterExample",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Test basic nested header structure
 */
export const NestedHeaderStructureTests: Story = {
  name: "Nested Header Structure Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header structure tests");

    testNestedHeaderStructure(canvasElement);

    console.log("✅ Nested header structure tests completed");
  },
};

/**
 * Test nested header visual layout
 */
export const NestedHeaderLayoutTests: Story = {
  name: "Nested Header Layout Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header layout tests");

    testNestedHeaderLayout(canvasElement);

    console.log("✅ Nested header layout tests completed");
  },
};

/**
 * Test sorting on nested child columns
 */
export const NestedHeaderSortingTests: Story = {
  name: "Nested Header Sorting Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header sorting tests");

    // Test sorting on child columns from each parent group
    await testNestedHeaderSorting(canvasElement, "Category");
    await testNestedHeaderSorting(canvasElement, "Price");

    console.log("✅ Nested header sorting tests completed");
  },
};

/**
 * Test filtering on nested child columns
 */
export const NestedHeaderFilteringTests: Story = {
  name: "Nested Header Filtering Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header filtering tests");

    // Test filtering on child columns from each parent group
    await testNestedHeaderFiltering(canvasElement, "Category");
    await testNestedHeaderFiltering(canvasElement, "Price");

    console.log("✅ Nested header filtering tests completed");
  },
};

/**
 * Test nested header responsiveness
 */
export const NestedHeaderResponsivenessTests: Story = {
  name: "Nested Header Responsiveness Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header responsiveness tests");

    await testNestedHeaderResponsiveness(canvasElement);

    console.log("✅ Nested header responsiveness tests completed");
  },
};

/**
 * Test parent header span calculations
 */
export const ParentHeaderSpanTests: Story = {
  name: "Parent Header Span Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting parent header span tests");

    // Test each parent header spans correct number of child columns
    for (const config of NESTED_HEADER_CONFIGURATIONS) {
      const parentHeader = findNestedHeader(canvasElement, config.parentLabel);
      expect(parentHeader).toBeTruthy();

      if (parentHeader) {
        verifyParentHeaderClass(parentHeader);
        verifyHeaderSpan(parentHeader, config.children.length);
      }
    }

    console.log("✅ Parent header span tests completed");
  },
};

/**
 * Test child header positioning
 */
export const ChildHeaderPositionTests: Story = {
  name: "Child Header Position Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting child header position tests");

    // Test child header positioning for each parent group
    for (const config of NESTED_HEADER_CONFIGURATIONS) {
      verifyChildHeaderPositions(canvasElement, config.parentLabel, config.children);
    }

    console.log("✅ Child header position tests completed");
  },
};

/**
 * Test nested header interaction with table features
 */
export const NestedHeaderFeatureIntegrationTests: Story = {
  name: "Nested Header Feature Integration Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header feature integration tests");

    // Verify nested headers don't break basic table functionality
    testNestedHeaderStructure(canvasElement);

    // Test that we can find both parent and child headers
    const productDetailsHeader = findNestedHeader(canvasElement, "Product Details");
    const categoryHeader = findNestedHeader(canvasElement, "Category");
    const priceHeader = findNestedHeader(canvasElement, "Price");

    expect(productDetailsHeader).toBeTruthy();
    expect(categoryHeader).toBeTruthy();
    expect(priceHeader).toBeTruthy();

    // Test that parent headers have different styling from child headers
    if (productDetailsHeader) {
      expect(productDetailsHeader.classList.contains("parent")).toBe(true);
    }

    if (categoryHeader) {
      expect(categoryHeader.classList.contains("parent")).toBe(false);
    }

    console.log("✅ Nested header feature integration tests completed");
  },
};

/**
 * Test nested header grid layout
 */
export const NestedHeaderGridLayoutTests: Story = {
  name: "Nested Header Grid Layout Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting nested header grid layout tests");

    // Verify CSS Grid is properly configured for nested headers
    const headerContainer = canvasElement.querySelector(".st-header-container");
    expect(headerContainer).toBeTruthy();

    const mainHeaderSection = headerContainer!.querySelector(".st-header-main");
    expect(mainHeaderSection).toBeTruthy();

    // Check grid properties
    const style = window.getComputedStyle(mainHeaderSection!);
    expect(style.display).toBe("grid");
    expect(style.gridTemplateColumns).toBeTruthy();

    // Verify all headers are positioned within the grid
    const allHeaders = canvasElement.querySelectorAll(".st-header-cell");

    for (const header of Array.from(allHeaders)) {
      const headerStyle = (header as HTMLElement).style.gridArea;
      expect(headerStyle).toBeTruthy();

      // Grid area should follow format: "row-start / col-start / row-end / col-end"
      const parts = headerStyle.split(" / ");
      expect(parts.length).toBe(4);

      // All parts should be numeric
      parts.forEach((part) => {
        expect(parseInt(part)).toBeGreaterThan(0);
      });
    }

    console.log("✅ Nested header grid layout tests completed");
  },
};

/**
 * Comprehensive nested header functionality test
 */
export const ComprehensiveNestedHeaderTests: Story = {
  name: "Comprehensive Nested Header Tests",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    console.log("🚀 Starting comprehensive nested header tests");

    await testAllNestedHeaderFunctionality(canvasElement);

    console.log("✅ Comprehensive nested header tests completed");
  },
};
