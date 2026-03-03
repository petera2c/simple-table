import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import { useEffect, useRef, useReducer } from "react";
import SortColumn, { SortDirection } from "../types/SortColumn";
import { SortManager, SortManagerConfig } from "../managers/SortManager";

const useSortableData = ({
  headers,
  tableRows,
  externalSortHandling,
  onSortChange,
  rowGrouping,
  initialSortColumn,
  initialSortDirection,
  announce,
}: {
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortColumn | null) => void;
  rowGrouping?: string[];
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  announce?: (message: string) => void;
}) => {
  const managerRef = useRef<SortManager>();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (!managerRef.current) {
    const config: SortManagerConfig = {
      headers,
      tableRows,
      externalSortHandling,
      onSortChange,
      rowGrouping,
      initialSortColumn,
      initialSortDirection,
      announce,
    };
    managerRef.current = new SortManager(config);
  }

  useEffect(() => {
    const manager = managerRef.current!;
    const unsubscribe = manager.subscribe(() => {
      forceUpdate();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    managerRef.current!.updateConfig({
      headers,
      tableRows,
      externalSortHandling,
      onSortChange,
      rowGrouping,
      announce,
    });
  }, [headers, tableRows, externalSortHandling, onSortChange, rowGrouping, announce]);

  useEffect(() => {
    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  const manager = managerRef.current;
  const state = manager.getState();

  return {
    sort: state.sort,
    sortedRows: state.sortedRows,
    updateSort: (props?: { accessor: Accessor; direction?: SortDirection }) => 
      manager.updateSort(props),
    computeSortedRowsPreview: (accessor: Accessor) => 
      manager.computeSortedRowsPreview(accessor),
  };
};

export default useSortableData;
