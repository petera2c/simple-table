import { useLayoutEffect, useState, useMemo, useCallback } from "react";
import { getRowId } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";

interface UseTransformAnimationsProps {
  tableRows: any[];
  previousTableRows?: any[];
  rowIdAccessor: string;
  rowHeight: number;
  allowAnimations: boolean;
  contentHeight: number;
}

const useTransformAnimations = ({
  tableRows,
  previousTableRows = [],
  rowIdAccessor,
  rowHeight,
  allowAnimations,
  contentHeight,
}: UseTransformAnimationsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [extendedRows, setExtendedRows] = useState<any[]>([]);

  // Categorize rows based on ID changes
  const categorizeRows = useCallback(
    (previousRows: any[], currentRows: any[], allRows: any[]) => {
      const previousIds = new Set(
        previousRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
      );
      const currentIds = new Set(
        currentRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
      );

      const staying = currentRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return previousIds.has(id);
      });

      const entering = currentRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return !previousIds.has(id);
      });

      const leaving = previousRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return !currentIds.has(id);
      });

      return { staying, entering, leaving };
    },
    [rowIdAccessor]
  );

  useLayoutEffect(() => {
    // Don't re-run effect while animation is in progress
    if (isAnimating) {
      return;
    }

    // Always sync extendedRows when not animating
    if (!allowAnimations) {
      setExtendedRows(tableRows);
      return;
    }

    // Initialize on first render
    if (previousTableRows.length === 0) {
      setExtendedRows(tableRows);
      return;
    }

    // Check if rows actually changed
    const currentIds = tableRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })));
    const previousIds = previousTableRows.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
    );

    if (
      currentIds.length === previousIds.length &&
      currentIds.every((id, index) => id === previousIds[index])
    ) {
      setExtendedRows(tableRows);
      return;
    }

    // Categorize rows
    const { entering } = categorizeRows(previousTableRows, tableRows, allRows);

    const extendedRowSet = [...previousTableRows, ...entering];

    // Calculate transform states using pre-calculated positions

    // Update state
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_CONFIGS.ROW_REORDER.duration + 100);
    setExtendedRows(extendedRowSet);

    return () => clearTimeout(timeout);

    // No need to update refs since we're using passed previousTableRows
  }, [
    categorizeRows,
    previousTableRows,
    tableRows,
    allowAnimations,
    rowIdAccessor,
    isAnimating,
    contentHeight,
    rowHeight,
  ]);

  // Check if there are actual row changes that would trigger animation
  const hasRowChanges = useMemo(() => {
    if (previousTableRows.length === 0) {
      return false;
    }

    const currentIds = tableRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })));
    const previousIds = previousTableRows.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
    );

    const hasChanges =
      currentIds.length !== previousIds.length ||
      !currentIds.every((id, index) => id === previousIds[index]);

    return hasChanges;
  }, [tableRows, previousTableRows, rowIdAccessor]);

  const finalExtendedRows = useMemo(() => {
    if (isAnimating) {
      return extendedRows;
    }

    if (allowAnimations && hasRowChanges) {
      // When row changes are detected, we need to create the extended row set
      // that includes new rows + leaving rows for animation
      const currentIds = tableRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })));

      // Find leaving rows (in previous but not in current)
      const leavingRows = previousTableRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return !currentIds.includes(id);
      });

      // Create extended row set with new rows + leaving rows
      const extendedRowSet = [...tableRows, ...leavingRows];

      return extendedRowSet;
    }

    return tableRows;
  }, [
    isAnimating,
    allowAnimations,
    hasRowChanges,
    tableRows,
    previousTableRows,
    rowIdAccessor,
    extendedRows,
  ]);

  return {
    extendedRows: finalExtendedRows,
    isAnimating,
  };
};

export default useTransformAnimations;
