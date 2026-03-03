import { useEffect, useRef, useReducer, useState } from "react";
import { TableManager, TableManagerConfig } from "../../managers/TableManager";
import { TableRenderer } from "../../renderers/TableRenderer";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import SortColumn, { SortDirection } from "../../types/SortColumn";
import { TableFilterState } from "../../types/FilterTypes";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { CustomTheme, DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";

export interface SimpleTableAdapterProps {
  headers: HeaderObject[];
  rows: Row[];
  rowHeight?: number;
  headerHeight?: number;
  customTheme?: Partial<CustomTheme>;
  
  externalSortHandling?: boolean;
  externalFilterHandling?: boolean;
  rowGrouping?: Accessor[];
  selectableCells?: boolean;
  selectableColumns?: boolean;
  enableRowSelection?: boolean;
  copyHeadersToClipboard?: boolean;
  
  height?: string | number;
  maxHeight?: string | number;
  
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  
  onSortChange?: (sort: SortColumn | null) => void;
  onFilterChange?: (filters: TableFilterState) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onLoadMore?: () => void;
  onCellEdit?: (props: any) => void;
  
  className?: string;
}

/**
 * React adapter for the framework-agnostic TableManager
 * This demonstrates how to wrap the core table logic in a React component
 */
export const SimpleTableAdapter = (props: SimpleTableAdapterProps) => {
  const {
    headers,
    rows,
    rowHeight = 40,
    headerHeight,
    customTheme,
    externalSortHandling,
    externalFilterHandling,
    rowGrouping,
    selectableCells,
    selectableColumns,
    enableRowSelection,
    copyHeadersToClipboard,
    height,
    maxHeight,
    initialSortColumn,
    initialSortDirection,
    onSortChange,
    onFilterChange,
    onColumnOrderChange,
    onColumnVisibilityChange,
    onColumnWidthChange,
    onLoadMore,
    onCellEdit,
    className,
  } = props;

  const tableManagerRef = useRef<TableManager>();
  const tableRendererRef = useRef<TableRenderer>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    if (!tableManagerRef.current) {
      const mergedTheme = { ...DEFAULT_CUSTOM_THEME, ...customTheme };
      
      const config: TableManagerConfig = {
        headers,
        rows,
        rowHeight,
        headerHeight,
        customTheme: mergedTheme,
        externalSortHandling,
        externalFilterHandling,
        rowGrouping,
        selectableCells,
        selectableColumns,
        enableRowSelection,
        copyHeadersToClipboard,
        height,
        maxHeight,
        initialSortColumn,
        initialSortDirection,
        onSortChange,
        onFilterChange,
        onColumnOrderChange,
        onColumnVisibilityChange,
        onColumnWidthChange,
        onLoadMore,
        onCellEdit,
        containerElement: containerRef.current,
      };

      tableManagerRef.current = new TableManager(config);
      
      tableManagerRef.current.subscribe(() => {
        forceUpdate();
      });

      tableRendererRef.current = new TableRenderer({
        tableManager: tableManagerRef.current,
      });
    }

    return () => {
      tableManagerRef.current?.destroy();
      tableRendererRef.current?.destroy();
    };
  }, [isClient]);

  useEffect(() => {
    if (!tableManagerRef.current) return;

    const mergedTheme = { ...DEFAULT_CUSTOM_THEME, ...customTheme };

    tableManagerRef.current.updateConfig({
      headers,
      rows,
      rowHeight,
      headerHeight,
      customTheme: mergedTheme,
      externalSortHandling,
      externalFilterHandling,
      rowGrouping,
      selectableCells,
      selectableColumns,
      enableRowSelection,
      copyHeadersToClipboard,
      height,
      maxHeight,
      onSortChange,
      onFilterChange,
      onColumnOrderChange,
      onColumnVisibilityChange,
      onColumnWidthChange,
      onLoadMore,
      onCellEdit,
    });
  }, [
    headers,
    rows,
    rowHeight,
    headerHeight,
    customTheme,
    externalSortHandling,
    externalFilterHandling,
    rowGrouping,
    selectableCells,
    selectableColumns,
    enableRowSelection,
    copyHeadersToClipboard,
    height,
    maxHeight,
    onSortChange,
    onFilterChange,
    onColumnOrderChange,
    onColumnVisibilityChange,
    onColumnWidthChange,
    onLoadMore,
    onCellEdit,
  ]);

  if (!isClient) return null;

  return (
    <div 
      ref={containerRef}
      className={`simple-table-adapter ${className || ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }}
    >
      {/* Table content will be rendered here by TableRenderer */}
      <div className="simple-table-content">
        {tableManagerRef.current && (
          <div>
            Table is ready with {tableManagerRef.current.sortManager.getSortedRows().length} rows
          </div>
        )}
      </div>
    </div>
  );
};
