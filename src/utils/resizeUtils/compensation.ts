import type HeaderObject from "../../types/HeaderObject";
import { MIN_COLUMN_WIDTH } from "../../consts/column-constraints";

/**
 * Distribute compensation among columns proportionally based on available headroom
 * Used in autoExpandColumns mode
 * Positive compensation = shrink columns, Negative compensation = grow columns
 */
export const distributeCompensationProportionally = ({
  columnsToShrink,
  totalCompensation,
  initialWidthsMap,
}: {
  columnsToShrink: HeaderObject[];
  totalCompensation: number;
  initialWidthsMap: Map<string, number>;
}): void => {
  // Handle growing columns (negative compensation)
  if (totalCompensation < 0) {
    const totalGrowth = Math.abs(totalCompensation);

    // Distribute growth proportionally based on initial widths
    const totalInitialWidth = columnsToShrink.reduce((sum, col) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      return sum + initialWidth;
    }, 0);

    if (totalInitialWidth === 0) return;

    columnsToShrink.forEach((col, index) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const proportion = initialWidth / totalInitialWidth;
      let growth = totalGrowth * proportion;

      // Last column takes any remaining to avoid rounding errors
      if (index === columnsToShrink.length - 1) {
        const alreadyDistributed = columnsToShrink
          .slice(0, index)
          .reduce((sum, c) => {
            const initW = initialWidthsMap.get(c.accessor as string) || 100;
            const currentW = typeof c.width === "number" ? c.width : 100;
            return sum + (currentW - initW);
          }, 0);
        growth = totalGrowth - alreadyDistributed;
      }

      col.width = initialWidth + growth;
    });

    return;
  }

  let remainingCompensation = totalCompensation;

  // Keep iterating until all compensation is distributed (shrinking columns)
  while (remainingCompensation > 0.5) {
    // 0.5px threshold to avoid floating point issues
    // Calculate headroom for each column (initial width - minWidth)
    // In autoExpandColumns mode, we use MIN_COLUMN_WIDTH instead of header minWidth
    const headrooms = columnsToShrink.map((col) => {
      // Use initial width from the map (captured at drag start)
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const minWidth = MIN_COLUMN_WIDTH;
      return {
        column: col,
        headroom: Math.max(0, initialWidth - minWidth),
        initialWidth,
        minWidth,
      };
    });

    // Filter to columns with headroom > 0
    const columnsWithHeadroom = headrooms.filter((h) => h.headroom > 0);

    if (columnsWithHeadroom.length > 0) {
      // CASE 1: Some columns still have headroom above their minWidth
      // Distribute proportionally based on available headroom
      const totalHeadroom = columnsWithHeadroom.reduce(
        (sum, h) => sum + h.headroom,
        0,
      );

      let compensationDistributed = 0;
      // Store remainingCompensation in a const to avoid no-loop-func warning
      const compensationToDistribute = remainingCompensation;
      columnsWithHeadroom.forEach((item, index) => {
        const proportion = item.headroom / totalHeadroom;
        let compensation = compensationToDistribute * proportion;

        // Don't shrink below minWidth
        compensation = Math.min(compensation, item.headroom);

        // Last column takes any remaining to avoid rounding errors
        if (index === columnsWithHeadroom.length - 1) {
          compensation = Math.min(
            compensationToDistribute - compensationDistributed,
            item.headroom,
          );
        }

        // Calculate new width from initial width minus compensation
        item.column.width = item.initialWidth - compensation;
        compensationDistributed += compensation;
      });

      remainingCompensation -= compensationDistributed;
    } else {
      // CASE 2: All columns at minWidth
      // Start shrinking minWidths equally, but not below MIN_COLUMN_WIDTH
      const columnsAboveAbsoluteMin = headrooms.filter(
        (h) => h.minWidth > MIN_COLUMN_WIDTH,
      );

      if (columnsAboveAbsoluteMin.length > 0) {
        // Distribute equally among columns that can still shrink
        // Store remainingCompensation in a const to avoid no-loop-func warning
        const compensationToDistribute = remainingCompensation;
        const compensationPerColumn =
          compensationToDistribute / columnsAboveAbsoluteMin.length;

        let compensationDistributed = 0;
        columnsAboveAbsoluteMin.forEach((item, index) => {
          const maxShrink = item.minWidth - MIN_COLUMN_WIDTH;
          let compensation = Math.min(compensationPerColumn, maxShrink);

          // Last column takes remaining
          if (index === columnsAboveAbsoluteMin.length - 1) {
            compensation = Math.min(
              compensationToDistribute - compensationDistributed,
              maxShrink,
            );
          }

          const newWidth = item.initialWidth - compensation;
          item.column.width = newWidth;
          item.column.minWidth = Math.max(newWidth, MIN_COLUMN_WIDTH);
          compensationDistributed += compensation;
        });

        remainingCompensation -= compensationDistributed;
      } else {
        // All columns at absolute minimum - can't shrink further
        break;
      }
    }
  }
};
