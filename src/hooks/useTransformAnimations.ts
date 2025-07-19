import { useRef, useLayoutEffect, useState, useMemo, useCallback } from "react";
import { getRowId } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";
import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";

interface CalculatedPosition {
  id: string;
  y: number;
  position: number;
}

export interface TransformState {
  deltaY: number;
  isEntering: boolean;
  isLeaving: boolean;
  isStaying: boolean;
}

interface UseTransformAnimationsProps {
  tableRows: any[];
  previousTableRows?: any[];
  rowIdAccessor: string;
  rowHeight: number;
  allowAnimations: boolean;
  contentHeight: number;
}

interface UseTransformAnimationsReturn {
  extendedRows: any[];
  isAnimating: boolean;
  transformStates: Map<string, TransformState>;
}

const useTransformAnimations = ({
  tableRows,
  previousTableRows = [],
  rowIdAccessor,
  rowHeight,
  allowAnimations,
  contentHeight,
}: UseTransformAnimationsProps): UseTransformAnimationsReturn => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [extendedRows, setExtendedRows] = useState<any[]>([]);
  const [transformStates, setTransformStates] = useState<Map<string, TransformState>>(new Map());
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get animation config
  const animationConfig = ANIMATION_CONFIGS.ROW_REORDER;
  const rowHeightWithSeparator = rowHeight + ROW_SEPARATOR_WIDTH;

  // Pre-calculate positions from row data (not DOM)
  const calculatePositionsFromData = useCallback(
    (rows: any[]): Map<string, CalculatedPosition> => {
      const positions = new Map<string, CalculatedPosition>();

      rows.forEach((tableRow) => {
        const id = String(getRowId({ row: tableRow.row, rowIdAccessor }));
        const y = tableRow.position * rowHeightWithSeparator;

        positions.set(id, {
          id,
          y,
          position: tableRow.position,
        });
      });

      return positions;
    },
    [rowHeightWithSeparator, rowIdAccessor]
  );

  // Pre-calculate what the old and new positions should be
  const { oldPositions, newPositions } = useMemo(() => {
    const newPositions = calculatePositionsFromData(tableRows);
    const oldPositions = calculatePositionsFromData(previousTableRows);

    return { oldPositions, newPositions };
  }, [calculatePositionsFromData, tableRows, previousTableRows]);

  // Categorize rows based on ID changes
  const categorizeRows = useCallback(
    (previousRows: any[], currentRows: any[]) => {
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

  // Calculate transform states using pre-calculated positions
  const calculateTransformStates = useCallback(
    (staying: any[], entering: any[], leaving: any[]): Map<string, TransformState> => {
      const states = new Map<string, TransformState>();

      // STAYING rows: calculate deltaY from old position to new position
      staying.forEach((tableRow) => {
        const id = String(getRowId({ row: tableRow.row, rowIdAccessor }));
        const oldPos = oldPositions.get(id);
        const newPos = newPositions.get(id);

        if (oldPos && newPos) {
          const deltaY = oldPos.y - newPos.y;

          states.set(id, {
            deltaY,
            isEntering: false,
            isLeaving: false,
            isStaying: true,
          });
        }
      });

      // ENTERING rows: start from outside viewport
      entering.forEach((tableRow) => {
        const id = String(getRowId({ row: tableRow.row, rowIdAccessor }));
        const newPos = newPositions.get(id);

        if (newPos) {
          const startY = contentHeight + rowHeight; // Start from bottom
          const deltaY = startY - newPos.y;

          states.set(id, {
            deltaY,
            isEntering: true,
            isLeaving: false,
            isStaying: false,
          });
        }
      });

      // LEAVING rows: exit to outside viewport
      leaving.forEach((tableRow) => {
        const id = String(getRowId({ row: tableRow.row, rowIdAccessor }));
        const oldPos = oldPositions.get(id);

        if (oldPos) {
          const exitY = oldPos.y < contentHeight / 2 ? -rowHeight : contentHeight;
          const deltaY = exitY - oldPos.y;

          states.set(id, {
            deltaY,
            isEntering: false,
            isLeaving: true,
            isStaying: false,
          });
        }
      });

      return states;
    },
    [oldPositions, newPositions, contentHeight, rowHeight, rowIdAccessor]
  );

  // Apply transforms immediately when DOM elements are available
  const applyTransforms = useCallback(
    (states: Map<string, TransformState>, extendedRowSet: any[]) => {
      // First pass: Apply initial transforms immediately
      states.forEach((state, id) => {
        const element = document.querySelector(`[data-table-row-id="${id}"]`) as HTMLElement;

        if (element) {
          element.style.transform = `translateY(${state.deltaY}px)`;
          element.style.transition = "none";

          // Add animation classes
          if (state.isEntering) {
            element.classList.add("st-row-entering");
          } else if (state.isLeaving) {
            element.classList.add("st-row-leaving");
          } else if (state.isStaying) {
            element.classList.add("st-row-repositioning");
          }
        }
      });

      // Force reflow
      const firstElement = document.querySelector(`[data-table-row-id]`) as HTMLElement;
      if (firstElement) {
        void firstElement.offsetHeight;
      }

      // Second pass: Animate to final positions
      requestAnimationFrame(() => {
        states.forEach((state, id) => {
          const element = document.querySelector(`[data-table-row-id="${id}"]`) as HTMLElement;

          if (element) {
            element.style.transition = `transform ${animationConfig.duration}ms ${animationConfig.easing}`;
            element.style.transform = "translateY(0px)";
          }
        });

        // Clean up after animation completes
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setExtendedRows(tableRows);
          setTransformStates(new Map());

          // Clean up animation classes and styles
          states.forEach((state, id) => {
            const element = document.querySelector(`[data-table-row-id="${id}"]`) as HTMLElement;
            if (element) {
              element.style.transform = "";
              element.style.transition = "";
              element.classList.remove("st-row-entering", "st-row-leaving", "st-row-repositioning");
            }
          });
        }, animationConfig.duration + 100);
      });
    },
    [animationConfig, tableRows]
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
    const { staying, entering, leaving } = categorizeRows(previousTableRows, tableRows);

    // Create extended row set for animation
    // Position leaving rows at the beginning of visible area, avoiding conflicts
    const currentPositions = new Set(tableRows.map((r) => r.position));
    let leavingPosition = 0; // Start at the beginning

    const leavingWithTempPositions = leaving.map((row) => {
      // Find the next available position
      while (currentPositions.has(leavingPosition)) {
        leavingPosition++;
      }
      const position = leavingPosition;
      leavingPosition++;

      return {
        ...row,
        position,
      };
    });

    const extendedRowSet = [...tableRows, ...leavingWithTempPositions];

    // Calculate transform states using pre-calculated positions
    const states = calculateTransformStates(staying, entering, leaving);

    // Update state
    setIsAnimating(true);
    setExtendedRows(extendedRowSet);
    setTransformStates(states);

    // Apply animations immediately
    setTimeout(() => {
      applyTransforms(states, extendedRowSet);
    }, 0);

    // No need to update refs since we're using passed previousTableRows
  }, [
    applyTransforms,
    calculateTransformStates,
    categorizeRows,
    previousTableRows,
    tableRows,
    allowAnimations,
    rowIdAccessor,
    isAnimating,
    oldPositions,
    newPositions,
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
    transformStates,
  };
};

export default useTransformAnimations;
