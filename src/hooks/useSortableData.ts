import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import { useEffect, useRef, useState } from "react";
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
  const managerRef = useRef<SortManager | null>(null);
  const [state, setState] = useState<{
    sort: SortColumn | null;
    sortedRows: Row[];
  }>({
    sort: null,
    sortedRows: [],
  });

  useEffect(() => {
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

    const unsubscribe = managerRef.current.subscribe((newState) => {
      setState({
        sort: newState.sort,
        sortedRows: newState.sortedRows,
      });
    });

    setState({
      sort: managerRef.current.getSortColumn(),
      sortedRows: managerRef.current.getSortedRows(),
    });

    return () => {
      unsubscribe();
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    managerRef.current?.updateConfig({
      headers,
      tableRows,
      externalSortHandling,
      onSortChange,
      rowGrouping,
      announce,
    });
  }, [headers, tableRows, externalSortHandling, onSortChange, rowGrouping, announce]);

  return {
    sort: state.sort,
    sortedRows: state.sortedRows,
    updateSort: (props?: { accessor: Accessor; direction?: SortDirection }) => 
      managerRef.current?.updateSort(props),
    computeSortedRowsPreview: (accessor: Accessor) => 
      managerRef.current?.computeSortedRowsPreview(accessor) ?? [],
  };
};

export default useSortableData;
