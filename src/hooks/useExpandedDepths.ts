import { useEffect, useState } from "react";
import { Accessor } from "../types/HeaderObject";

/**
 * Initialize expandedDepths based on expandAll prop and rowGrouping
 */
export const initializeExpandedDepths = (
  expandAll: boolean,
  rowGrouping?: Accessor[]
): Set<number> => {
  if (!rowGrouping || rowGrouping.length === 0) return new Set();
  if (expandAll) {
    const depths = Array.from({ length: rowGrouping.length }, (_, i) => i);
    return new Set(depths);
  }
  return new Set();
};

/**
 * Hook to manage expandedDepths state and sync with rowGrouping changes
 */
const useExpandedDepths = (expandAll: boolean, rowGrouping?: Accessor[]) => {
  const [expandedDepths, setExpandedDepths] = useState<Set<number>>(() =>
    initializeExpandedDepths(expandAll, rowGrouping)
  );

  // Update expandedDepths if rowGrouping changes (remove depths that no longer exist)
  useEffect(() => {
    if (!rowGrouping || rowGrouping.length === 0) {
      setExpandedDepths(new Set());
      return;
    }

    setExpandedDepths((prev) => {
      const maxDepth = rowGrouping.length;
      // Filter out depths that are now out of range
      const filtered = Array.from(prev).filter((d) => d < maxDepth);
      return new Set(filtered);
    });
  }, [rowGrouping]);

  return { expandedDepths, setExpandedDepths };
};

export default useExpandedDepths;
