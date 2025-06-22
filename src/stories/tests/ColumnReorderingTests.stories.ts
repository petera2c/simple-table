import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import AlignmentExample from "../examples/AlignmentExample";
import {
  performDragAndDrop,
  waitForTable,
  getColumnOrderFromSection,
} from "../test-utils/columnReorderingTestUtils";
import { RETAIL_SALES_HEADERS } from "../data/retail-data";

const meta: Meta<typeof AlignmentExample> = {
  title: "Tests/Column Reordering Tests",
  component: AlignmentExample,
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Tests for column reordering functionality using AlignmentExample with pinned columns",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to get column label by accessor
const getColumnLabel = (accessor: string): string => {
  const header = RETAIL_SALES_HEADERS.find((h) => h.accessor === accessor);
  return header?.label || accessor;
};

// Helper function to get header element by accessor
const getHeaderElement = (section: Element, accessor: string): HTMLElement | null => {
  return section.querySelector(`[id*='cell-${accessor}'] .st-header-label`) as HTMLElement;
};

// Helper functions to get column accessors dynamically from RETAIL_SALES_HEADERS
const getPinnedLeftColumns = () =>
  RETAIL_SALES_HEADERS.filter((h) => h.pinned === "left").map((h) => h.accessor);
const getPinnedRightColumns = () =>
  RETAIL_SALES_HEADERS.filter((h) => h.pinned === "right").map((h) => h.accessor);
const getMainColumns = () => RETAIL_SALES_HEADERS.filter((h) => !h.pinned).map((h) => h.accessor);

// Helper function to verify column moved to expected position
const verifyColumnMove = (
  initialOrder: string[],
  finalOrder: string[],
  sourceColumn: string,
  targetColumn: string,
  description: string
): boolean => {
  // Check if order actually changed
  if (JSON.stringify(initialOrder) === JSON.stringify(finalOrder)) {
    return false;
  }

  const sourceLabel = getColumnLabel(sourceColumn);
  const targetLabel = getColumnLabel(targetColumn);

  // Find positions in final order
  const sourceIndex = finalOrder.indexOf(sourceLabel);
  const targetIndex = finalOrder.indexOf(targetLabel);

  if (sourceIndex === -1) {
    return false;
  }

  if (targetIndex === -1) {
    return false;
  }

  // For drag and drop, we expect the source to be positioned near the target
  // Allow for some flexibility in positioning (within 1 position)
  const positionDiff = Math.abs(sourceIndex - targetIndex);

  if (positionDiff <= 1) {
    return true;
  } else {
    return false;
  }
};

// Helper function to verify cross-section move
const verifyCrossSectionMove = (
  sourceSection: Element,
  targetSection: Element,
  sourceColumn: string,
  targetColumn: string,
  description: string
): boolean => {
  const sourceOrder = getColumnOrderFromSection(sourceSection);
  const targetOrder = getColumnOrderFromSection(targetSection);

  const sourceLabel = getColumnLabel(sourceColumn);
  const targetLabel = getColumnLabel(targetColumn);

  // Source column should no longer be in source section (or section should have changed)
  const sourceStillInOriginal = sourceOrder.includes(sourceLabel);

  // Target column should be in target section
  const targetInTargetSection = targetOrder.includes(targetLabel);

  // Source column should now be in target section (for cross-section moves)
  const sourceInTargetSection = targetOrder.includes(sourceLabel);

  if (!targetInTargetSection) {
    return false;
  }

  if (sourceStillInOriginal && !sourceInTargetSection) {
    return false;
  }

  if (sourceInTargetSection) {
    // Find positions to verify they're close
    const sourceIndex = targetOrder.indexOf(sourceLabel);
    const targetIndex = targetOrder.indexOf(targetLabel);
    const positionDiff = Math.abs(sourceIndex - targetIndex);

    if (positionDiff <= 1) {
      return true;
    } else {
      return false;
    }
  }

  return true;
};

/**
 * Comprehensive column reordering test with multiple drag and drop interactions
 */
export const ColumnReorderingInteractions: Story = {
  name: "Column Reordering - All Interactions",
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitForTable();

    const mainSection = canvasElement.querySelector(".st-header-main");
    const pinnedLeftSection = canvasElement.querySelector(".st-header-pinned-left");
    const pinnedRightSection = canvasElement.querySelector(".st-header-pinned-right");

    expect(mainSection).toBeTruthy();
    expect(pinnedLeftSection).toBeTruthy();
    expect(pinnedRightSection).toBeTruthy();

    // Get column accessors dynamically
    const mainCols = getMainColumns();
    const pinnedLeftCols = getPinnedLeftColumns();
    const pinnedRightCols = getPinnedRightColumns();

    // Interaction 1: First main column → Second main column
    const initialMainOrder1 = getColumnOrderFromSection(mainSection!);
    const col1Source = mainCols[0]; // employees
    const col1Target = mainCols[1]; // squareFootage
    const col1SourceEl = getHeaderElement(mainSection!, col1Source);
    const col1TargetEl = getHeaderElement(mainSection!, col1Target);
    expect(col1SourceEl).toBeTruthy();
    expect(col1TargetEl).toBeTruthy();
    await performDragAndDrop(
      col1SourceEl!,
      col1TargetEl!,
      `${getColumnLabel(col1Source)} → ${getColumnLabel(col1Target)}`
    );
    const finalMainOrder1 = getColumnOrderFromSection(mainSection!);
    expect(
      verifyColumnMove(
        initialMainOrder1,
        finalMainOrder1,
        col1Source,
        col1Target,
        `${getColumnLabel(col1Source)} → ${getColumnLabel(col1Target)}`
      )
    ).toBe(true);

    // Interaction 2: Third main column → Fifth main column
    const initialMainOrder2 = getColumnOrderFromSection(mainSection!);
    const col2Source = mainCols[2]; // openingDate
    const col2Target = mainCols[4]; // electronicsSales
    const col2SourceEl = getHeaderElement(mainSection!, col2Source);
    const col2TargetEl = getHeaderElement(mainSection!, col2Target);
    expect(col2SourceEl).toBeTruthy();
    expect(col2TargetEl).toBeTruthy();
    await performDragAndDrop(
      col2SourceEl!,
      col2TargetEl!,
      `${getColumnLabel(col2Source)} → ${getColumnLabel(col2Target)}`
    );
    const finalMainOrder2 = getColumnOrderFromSection(mainSection!);
    expect(
      verifyColumnMove(
        initialMainOrder2,
        finalMainOrder2,
        col2Source,
        col2Target,
        `${getColumnLabel(col2Source)} → ${getColumnLabel(col2Target)}`
      )
    ).toBe(true);

    // Interaction 3: Fifth main column → Seventh main column
    const initialMainOrder3 = getColumnOrderFromSection(mainSection!);
    const col3Source = mainCols[4]; // electronicsSales
    const col3Target = mainCols[6]; // groceriesSales
    const col3SourceEl = getHeaderElement(mainSection!, col3Source);
    const col3TargetEl = getHeaderElement(mainSection!, col3Target);
    expect(col3SourceEl).toBeTruthy();
    expect(col3TargetEl).toBeTruthy();
    await performDragAndDrop(
      col3SourceEl!,
      col3TargetEl!,
      `${getColumnLabel(col3Source)} → ${getColumnLabel(col3Target)}`
    );
    const finalMainOrder3 = getColumnOrderFromSection(mainSection!);
    expect(
      verifyColumnMove(
        initialMainOrder3,
        finalMainOrder3,
        col3Source,
        col3Target,
        `${getColumnLabel(col3Source)} → ${getColumnLabel(col3Target)}`
      )
    ).toBe(true);

    // Interaction 4: Second main column → Last main column
    const initialMainOrder4 = getColumnOrderFromSection(mainSection!);
    const col4Source = mainCols[1]; // squareFootage
    const col4Target = mainCols[mainCols.length - 1]; // furnitureSales
    const col4SourceEl = getHeaderElement(mainSection!, col4Source);
    const col4TargetEl = getHeaderElement(mainSection!, col4Target);
    expect(col4SourceEl).toBeTruthy();
    expect(col4TargetEl).toBeTruthy();
    await performDragAndDrop(
      col4SourceEl!,
      col4TargetEl!,
      `${getColumnLabel(col4Source)} → ${getColumnLabel(col4Target)}`
    );
    const finalMainOrder4 = getColumnOrderFromSection(mainSection!);
    expect(
      verifyColumnMove(
        initialMainOrder4,
        finalMainOrder4,
        col4Source,
        col4Target,
        `${getColumnLabel(col4Source)} → ${getColumnLabel(col4Target)}`
      )
    ).toBe(true);

    // Interaction 5: First pinned left → Second pinned left
    if (pinnedLeftCols.length >= 2) {
      const initialPinnedOrder1 = getColumnOrderFromSection(pinnedLeftSection!);
      const col5Source = pinnedLeftCols[0]; // name
      const col5Target = pinnedLeftCols[1]; // city
      const col5SourceEl = getHeaderElement(pinnedLeftSection!, col5Source);
      const col5TargetEl = getHeaderElement(pinnedLeftSection!, col5Target);
      expect(col5SourceEl).toBeTruthy();
      expect(col5TargetEl).toBeTruthy();
      await performDragAndDrop(
        col5SourceEl!,
        col5TargetEl!,
        `${getColumnLabel(col5Source)} → ${getColumnLabel(col5Target)} (Pinned Left)`
      );
      const finalPinnedOrder1 = getColumnOrderFromSection(pinnedLeftSection!);
      expect(
        verifyColumnMove(
          initialPinnedOrder1,
          finalPinnedOrder1,
          col5Source,
          col5Target,
          `${getColumnLabel(col5Source)} → ${getColumnLabel(col5Target)} (Pinned Left)`
        )
      ).toBe(true);
    }

    // Interaction 6: Second pinned left → First pinned left (Reverse)
    if (pinnedLeftCols.length >= 2) {
      const initialPinnedOrder2 = getColumnOrderFromSection(pinnedLeftSection!);
      const col6Source = pinnedLeftCols[1]; // city
      const col6Target = pinnedLeftCols[0]; // name
      const col6SourceEl = getHeaderElement(pinnedLeftSection!, col6Source);
      const col6TargetEl = getHeaderElement(pinnedLeftSection!, col6Target);
      expect(col6SourceEl).toBeTruthy();
      expect(col6TargetEl).toBeTruthy();
      await performDragAndDrop(
        col6SourceEl!,
        col6TargetEl!,
        `${getColumnLabel(col6Source)} → ${getColumnLabel(col6Target)} (Pinned Left)`
      );
      const finalPinnedOrder2 = getColumnOrderFromSection(pinnedLeftSection!);
      expect(
        verifyColumnMove(
          initialPinnedOrder2,
          finalPinnedOrder2,
          col6Source,
          col6Target,
          `${getColumnLabel(col6Source)} → ${getColumnLabel(col6Target)} (Pinned Left)`
        )
      ).toBe(true);
    }

    // Interaction 7: First main column → First pinned left column (Main → Pinned Left)
    const col7Source = mainCols[0]; // employees
    const col7Target = pinnedLeftCols[0]; // name
    const col7SourceEl = getHeaderElement(mainSection!, col7Source);
    const col7TargetEl = getHeaderElement(pinnedLeftSection!, col7Target);
    expect(col7SourceEl).toBeTruthy();
    expect(col7TargetEl).toBeTruthy();
    await performDragAndDrop(
      col7SourceEl!,
      col7TargetEl!,
      `${getColumnLabel(col7Source)} (Main) → ${getColumnLabel(col7Target)} (Pinned Left)`
    );
    expect(
      verifyCrossSectionMove(
        mainSection!,
        pinnedLeftSection!,
        col7Source,
        col7Target,
        `${getColumnLabel(col7Source)} (Main) → ${getColumnLabel(col7Target)} (Pinned Left)`
      )
    ).toBe(true);

    // Interaction 8: Second main column → Second pinned left column (Main → Pinned Left)
    if (pinnedLeftCols.length >= 2) {
      const col8Source = mainCols[1]; // squareFootage
      const col8Target = pinnedLeftCols[1]; // city
      const col8SourceEl = getHeaderElement(mainSection!, col8Source);
      const col8TargetEl = getHeaderElement(pinnedLeftSection!, col8Target);
      expect(col8SourceEl).toBeTruthy();
      expect(col8TargetEl).toBeTruthy();
      await performDragAndDrop(
        col8SourceEl!,
        col8TargetEl!,
        `${getColumnLabel(col8Source)} (Main) → ${getColumnLabel(col8Target)} (Pinned Left)`
      );
      expect(
        verifyCrossSectionMove(
          mainSection!,
          pinnedLeftSection!,
          col8Source,
          col8Target,
          `${getColumnLabel(col8Source)} (Main) → ${getColumnLabel(col8Target)} (Pinned Left)`
        )
      ).toBe(true);
    }

    // Interaction 9: Third main column → First pinned right column (Main → Pinned Right)
    if (pinnedRightCols.length >= 1) {
      const col9Source = mainCols[2]; // openingDate
      const col9Target = pinnedRightCols[0]; // totalSales
      const col9SourceEl = getHeaderElement(mainSection!, col9Source);
      const col9TargetEl = getHeaderElement(pinnedRightSection!, col9Target);
      expect(col9SourceEl).toBeTruthy();
      expect(col9TargetEl).toBeTruthy();
      await performDragAndDrop(
        col9SourceEl!,
        col9TargetEl!,
        `${getColumnLabel(col9Source)} (Main) → ${getColumnLabel(col9Target)} (Pinned Right)`
      );
      expect(
        verifyCrossSectionMove(
          mainSection!,
          pinnedRightSection!,
          col9Source,
          col9Target,
          `${getColumnLabel(col9Source)} (Main) → ${getColumnLabel(col9Target)} (Pinned Right)`
        )
      ).toBe(true);
    }

    // Interaction 10: Fourth main column → First pinned right column (Main → Pinned Right)
    if (pinnedRightCols.length >= 1) {
      const col10Source = mainCols[3]; // customerRating
      const col10Target = pinnedRightCols[0]; // totalSales
      const col10SourceEl = getHeaderElement(mainSection!, col10Source);
      const col10TargetEl = getHeaderElement(pinnedRightSection!, col10Target);
      expect(col10SourceEl).toBeTruthy();
      expect(col10TargetEl).toBeTruthy();
      await performDragAndDrop(
        col10SourceEl!,
        col10TargetEl!,
        `${getColumnLabel(col10Source)} (Main) → ${getColumnLabel(col10Target)} (Pinned Right)`
      );
      expect(
        verifyCrossSectionMove(
          mainSection!,
          pinnedRightSection!,
          col10Source,
          col10Target,
          `${getColumnLabel(col10Source)} (Main) → ${getColumnLabel(col10Target)} (Pinned Right)`
        )
      ).toBe(true);
    }

    // Interaction 11: Second pinned left → Third main column (Pinned Left → Main)
    if (pinnedLeftCols.length >= 2) {
      const col11Source = pinnedLeftCols[1]; // city
      const col11Target = mainCols[2]; // openingDate
      const col11SourceEl = getHeaderElement(pinnedLeftSection!, col11Source);
      const col11TargetEl = getHeaderElement(mainSection!, col11Target);
      expect(col11SourceEl).toBeTruthy();
      expect(col11TargetEl).toBeTruthy();
      await performDragAndDrop(
        col11SourceEl!,
        col11TargetEl!,
        `${getColumnLabel(col11Source)} (Pinned Left) → ${getColumnLabel(col11Target)} (Main)`
      );
      expect(
        verifyCrossSectionMove(
          pinnedLeftSection!,
          mainSection!,
          col11Source,
          col11Target,
          `${getColumnLabel(col11Source)} (Pinned Left) → ${getColumnLabel(col11Target)} (Main)`
        )
      ).toBe(true);
    }

    // Interaction 12: First pinned left → Fourth main column (Pinned Left → Main)
    const col12Source = pinnedLeftCols[0]; // name
    const col12Target = mainCols[3]; // customerRating
    const col12SourceEl = getHeaderElement(pinnedLeftSection!, col12Source);
    const col12TargetEl = getHeaderElement(mainSection!, col12Target);
    expect(col12SourceEl).toBeTruthy();
    expect(col12TargetEl).toBeTruthy();
    await performDragAndDrop(
      col12SourceEl!,
      col12TargetEl!,
      `${getColumnLabel(col12Source)} (Pinned Left) → ${getColumnLabel(col12Target)} (Main)`
    );
    expect(
      verifyCrossSectionMove(
        pinnedLeftSection!,
        mainSection!,
        col12Source,
        col12Target,
        `${getColumnLabel(col12Source)} (Pinned Left) → ${getColumnLabel(col12Target)} (Main)`
      )
    ).toBe(true);

    // Interaction 13: First pinned right → Last main column (Pinned Right → Main)
    if (pinnedRightCols.length >= 1) {
      const col13Source = pinnedRightCols[0]; // totalSales
      const col13Target = mainCols[mainCols.length - 1]; // furnitureSales
      const col13SourceEl = getHeaderElement(pinnedRightSection!, col13Source);
      const col13TargetEl = getHeaderElement(mainSection!, col13Target);
      expect(col13SourceEl).toBeTruthy();
      expect(col13TargetEl).toBeTruthy();
      await performDragAndDrop(
        col13SourceEl!,
        col13TargetEl!,
        `${getColumnLabel(col13Source)} (Pinned Right) → ${getColumnLabel(col13Target)} (Main)`
      );
      expect(
        verifyCrossSectionMove(
          pinnedRightSection!,
          mainSection!,
          col13Source,
          col13Target,
          `${getColumnLabel(col13Source)} (Pinned Right) → ${getColumnLabel(col13Target)} (Main)`
        )
      ).toBe(true);
    }

    // Interaction 14: First pinned right → First main column (Pinned Right → Main)
    if (pinnedRightCols.length >= 1) {
      const col14Source = pinnedRightCols[0]; // totalSales
      const col14Target = mainCols[0]; // employees
      const col14SourceEl = getHeaderElement(pinnedRightSection!, col14Source);
      const col14TargetEl = getHeaderElement(mainSection!, col14Target);
      expect(col14SourceEl).toBeTruthy();
      expect(col14TargetEl).toBeTruthy();
      await performDragAndDrop(
        col14SourceEl!,
        col14TargetEl!,
        `${getColumnLabel(col14Source)} (Pinned Right) → ${getColumnLabel(col14Target)} (Main)`
      );
      expect(
        verifyCrossSectionMove(
          pinnedRightSection!,
          mainSection!,
          col14Source,
          col14Target,
          `${getColumnLabel(col14Source)} (Pinned Right) → ${getColumnLabel(col14Target)} (Main)`
        )
      ).toBe(true);
    }

    // Interaction 15: Fifth main column → Sixth main column (Final Main Section Reorder)
    if (mainCols.length >= 6) {
      const initialMainOrderFinal = getColumnOrderFromSection(mainSection!);
      const col15Source = mainCols[4]; // electronicsSales
      const col15Target = mainCols[5]; // clothingSales
      const col15SourceEl = getHeaderElement(mainSection!, col15Source);
      const col15TargetEl = getHeaderElement(mainSection!, col15Target);
      expect(col15SourceEl).toBeTruthy();
      expect(col15TargetEl).toBeTruthy();
      await performDragAndDrop(
        col15SourceEl!,
        col15TargetEl!,
        `${getColumnLabel(col15Source)} → ${getColumnLabel(col15Target)} (Final)`
      );
      const finalMainOrderFinal = getColumnOrderFromSection(mainSection!);
      expect(
        verifyColumnMove(
          initialMainOrderFinal,
          finalMainOrderFinal,
          col15Source,
          col15Target,
          `${getColumnLabel(col15Source)} → ${getColumnLabel(col15Target)} (Final)`
        )
      ).toBe(true);
    }
  },
};
