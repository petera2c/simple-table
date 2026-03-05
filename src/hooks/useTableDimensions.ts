import { useState, useEffect, useRef, RefObject } from "react";
import HeaderObject from "../types/HeaderObject";
import { DimensionManager } from "../managers/DimensionManager";

interface UseTableDimensionsProps {
  effectiveHeaders: HeaderObject[];
  headerHeight?: number;
  rowHeight: number;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
}

interface UseTableDimensionsReturn {
  containerWidth: number;
  calculatedHeaderHeight: number;
  maxHeaderDepth: number;
}

export const useTableDimensions = ({
  effectiveHeaders,
  headerHeight,
  rowHeight,
  tableBodyContainerRef,
}: UseTableDimensionsProps): UseTableDimensionsReturn => {
  const managerRef = useRef<DimensionManager | null>(null);
  const [dimensions, setDimensions] = useState({
    containerWidth: 0,
    calculatedHeaderHeight: 0,
    maxHeaderDepth: 0,
  });

  useEffect(() => {
    if (!tableBodyContainerRef.current) return;

    managerRef.current = new DimensionManager({
      effectiveHeaders,
      headerHeight,
      rowHeight,
      totalRowCount: 0,
      containerElement: tableBodyContainerRef.current,
    });

    const unsubscribe = managerRef.current.subscribe((state) => {
      setDimensions({
        containerWidth: state.containerWidth,
        calculatedHeaderHeight: state.calculatedHeaderHeight,
        maxHeaderDepth: state.maxHeaderDepth,
      });
    });

    setDimensions({
      containerWidth: managerRef.current.getContainerWidth(),
      calculatedHeaderHeight: managerRef.current.getCalculatedHeaderHeight(),
      maxHeaderDepth: managerRef.current.getMaxHeaderDepth(),
    });

    return () => {
      unsubscribe();
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [tableBodyContainerRef]);

  useEffect(() => {
    managerRef.current?.updateConfig({
      effectiveHeaders,
      headerHeight,
      rowHeight,
    });
  }, [effectiveHeaders, headerHeight, rowHeight]);

  return dimensions;
};
