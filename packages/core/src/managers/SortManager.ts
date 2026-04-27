import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import SortColumn, { SortDirection } from "../types/SortColumn";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";
import { flattenAllHeaders } from "../utils/headerUtils";
import { calculateAggregatedRows } from "../hooks/useAggregatedRows";

export interface SortManagerConfig {
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortColumn | null) => void;
  rowGrouping?: string[];
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  announce?: (message: string) => void;
}

export interface SortManagerState {
  sort: SortColumn | null;
  sortedRows: Row[];
}

type StateChangeCallback = (state: SortManagerState) => void;

export class SortManager {
  private config: SortManagerConfig;
  private state: SortManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private headerLookup: Map<Accessor, HeaderObject> = new Map();

  constructor(config: SortManagerConfig) {
    this.config = config;
    this.updateHeaderLookup();
    
    const initialSort = this.getInitialSort();
    const sortedRows = this.computeSortedRows(config.tableRows, initialSort);
    
    this.state = {
      sort: initialSort,
      sortedRows,
    };
  }

  private updateHeaderLookup(): void {
    const allHeaders = flattenAllHeaders(this.config.headers);
    this.headerLookup = new Map<Accessor, HeaderObject>();
    
    allHeaders.forEach((header) => {
      this.headerLookup.set(header.accessor, header);
    });
  }

  private getInitialSort(): SortColumn | null {
    if (!this.config.initialSortColumn) return null;

    const targetHeader = this.headerLookup.get(this.config.initialSortColumn);
    if (!targetHeader) return null;

    return {
      key: targetHeader,
      direction: this.config.initialSortDirection || "asc",
    };
  }

  private sortNestedRows({
    groupingKeys,
    headers,
    rows,
    sortColumn,
  }: {
    groupingKeys: string[];
    headers: HeaderObject[];
    rows: Row[];
    sortColumn: SortColumn;
  }): Row[] {
    const sortedData = handleSort({ headers, rows, sortColumn });

    if (!groupingKeys || groupingKeys.length === 0) {
      return sortedData;
    }

    return sortedData.map((row) => {
      const currentGroupingKey = groupingKeys[0];
      const nestedData = row[currentGroupingKey];

      if (isRowArray(nestedData)) {
        const sortedNestedData = this.sortNestedRows({
          rows: nestedData,
          sortColumn,
          headers,
          groupingKeys: groupingKeys.slice(1),
        });

        return {
          ...row,
          [currentGroupingKey]: sortedNestedData,
        };
      }

      return row;
    });
  }

  private computeSortedRows(tableRows: Row[], sortColumn: SortColumn | null): Row[] {
    if (this.config.externalSortHandling) return tableRows;

    // Always calculate aggregated values so parent rows display aggregated values
    // regardless of whether a sort is active.
    const aggregatedRows = calculateAggregatedRows({
      rows: tableRows,
      headers: this.config.headers,
      rowGrouping: this.config.rowGrouping,
    });

    if (!sortColumn) return aggregatedRows;

    if (this.config.rowGrouping && this.config.rowGrouping.length > 0) {
      return this.sortNestedRows({
        groupingKeys: this.config.rowGrouping,
        headers: this.config.headers,
        rows: aggregatedRows,
        sortColumn,
      });
    } else {
      return handleSort({ headers: this.config.headers, rows: aggregatedRows, sortColumn });
    }
  }

  updateConfig(config: Partial<SortManagerConfig>): void {
    const oldHeaders = this.config.headers;
    this.config = { ...this.config, ...config };
    
    if (config.headers && config.headers !== oldHeaders) {
      this.updateHeaderLookup();
    }

    const sortedRows = this.computeSortedRows(this.config.tableRows, this.state.sort);
    
    if (sortedRows !== this.state.sortedRows) {
      this.state = {
        ...this.state,
        sortedRows,
      };
      this.notifySubscribers();
    }
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  updateSort(props?: { accessor: Accessor; direction?: SortDirection }): void {
    if (!props) {
      // Route through computeSortedRows so grouped tables still see aggregated
      // values when sort is cleared. With the aggregation cache this is ~free
      // when nothing else has changed.
      this.state = {
        ...this.state,
        sort: null,
        sortedRows: this.computeSortedRows(this.config.tableRows, null),
      };
      this.config.onSortChange?.(null);
      this.notifySubscribers();
      return;
    }

    const { accessor, direction } = props;
    const targetHeader = this.headerLookup.get(accessor);

    if (!targetHeader) {
      return;
    }

    let newSortColumn: SortColumn | null = null;

    if (direction) {
      newSortColumn = {
        key: targetHeader,
        direction: direction,
      };
    } else {
      const sortingOrder = targetHeader.sortingOrder || ["asc", "desc", null];

      let currentIndex = -1;
      if (this.state.sort && this.state.sort.key.accessor === accessor) {
        currentIndex = sortingOrder.indexOf(this.state.sort.direction);
      }

      const nextIndex = (currentIndex + 1) % sortingOrder.length;
      const nextDirection = sortingOrder[nextIndex];

      if (nextDirection === null) {
        newSortColumn = null;
      } else {
        newSortColumn = {
          key: targetHeader,
          direction: nextDirection,
        };
      }
    }

    const sortedRows = this.computeSortedRows(this.config.tableRows, newSortColumn);

    this.state = {
      sort: newSortColumn,
      sortedRows,
    };

    this.config.onSortChange?.(newSortColumn);

    if (this.config.announce) {
      if (newSortColumn) {
        const directionText = newSortColumn.direction === "asc" ? "ascending" : "descending";
        this.config.announce(`Sorted by ${targetHeader.label}, ${directionText}`);
      } else {
        this.config.announce(`Sort removed from ${targetHeader.label}`);
      }
    }

    this.notifySubscribers();
  }

  computeSortedRowsPreview(accessor: Accessor): Row[] {
    const findHeaderRecursively = (headers: HeaderObject[]): HeaderObject | undefined => {
      for (const header of headers) {
        if (header.accessor === accessor) {
          return header;
        }
        if (header.children && header.children.length > 0) {
          const found = findHeaderRecursively(header.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const targetHeader = findHeaderRecursively(this.config.headers);

    if (!targetHeader) {
      return this.config.tableRows;
    }

    let previewSortColumn: SortColumn | null = null;
    const sortingOrder = targetHeader.sortingOrder || ["asc", "desc", null];

    let currentIndex = -1;
    if (this.state.sort && this.state.sort.key.accessor === accessor) {
      currentIndex = sortingOrder.indexOf(this.state.sort.direction);
    }

    const nextIndex = (currentIndex + 1) % sortingOrder.length;
    const nextDirection = sortingOrder[nextIndex];

    if (nextDirection === null) {
      previewSortColumn = null;
    } else {
      previewSortColumn = {
        key: targetHeader,
        direction: nextDirection,
      };
    }

    return this.computeSortedRows(this.config.tableRows, previewSortColumn);
  }

  getState(): SortManagerState {
    return this.state;
  }

  getSortColumn(): SortColumn | null {
    return this.state.sort;
  }

  getSortedRows(): Row[] {
    return this.state.sortedRows;
  }

  destroy(): void {
    this.subscribers.clear();
  }
}
